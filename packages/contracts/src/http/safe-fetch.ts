import type { z } from 'zod';

import { err, ok, type FetchFailure, type Result } from './result';

export interface SafeFetchOptions<TSchema extends z.ZodType> {
  /** Схема, описывающая ответ сервера. Именно она решает, доверяем мы данным или нет. */
  readonly schema: TSchema;
  readonly init?: RequestInit;
  /** Подменяемый fetch — нужен тестам и серверным вызовам с другими опциями кэша. */
  readonly fetchImpl?: typeof fetch;
}

/**
 * Типобезопасный HTTP-клиент: никогда не бросает, тип успешного результата
 * выводится из схемы (`z.output<TSchema>`), успех — это ПРОВАЛИДИРОВАННЫЕ данные.
 *
 * Варианты ошибки различаются по `kind`, чтобы вызывающий код решал сам:
 *  - `network`      — fetch отвалился (нет сети, CORS, abort);
 *  - `http`         — ответ пришёл, но статус не 2xx (тело приложено, если разобралось);
 *  - `invalid-json` — тело не распарсилось как JSON;
 *  - `schema`       — JSON распарсился, но не прошёл валидацию схемой.
 *
 * Обратите внимание: результат `getArticles()` в приложении зависит от того,
 * какую схему сюда передали. `z.any()` на входе — `any` на выходе (см. задание T-01).
 */
export async function safeFetch<TSchema extends z.ZodType>(
  input: string | URL,
  options: SafeFetchOptions<TSchema>,
): Promise<Result<z.output<TSchema>, FetchFailure>> {
  const doFetch = options.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await doFetch(input, options.init);
  } catch (cause) {
    return err({ kind: 'network', message: cause instanceof Error ? cause.message : String(cause), cause });
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch (cause) {
    if (!response.ok) {
      return err({ kind: 'http', status: response.status, message: response.statusText || `HTTP ${response.status}` });
    }

    return err({ kind: 'invalid-json', message: cause instanceof Error ? cause.message : String(cause) });
  }

  if (!response.ok) {
    return err({
      kind: 'http',
      status: response.status,
      message: response.statusText || `HTTP ${response.status}`,
      body,
    });
  }

  const parsed = options.schema.safeParse(body);

  if (!parsed.success) {
    return err({
      kind: 'schema',
      message: 'Ответ не соответствует схеме',
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.map(String).join('.'),
        message: issue.message,
      })),
    });
  }

  return ok(parsed.data as z.output<TSchema>);
}
