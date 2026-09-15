import type { z } from 'zod';

import { ok, type FetchFailure, type Result } from './result';

export interface SafeFetchOptions<TSchema extends z.ZodType> {
  /** Схема, описывающая ответ сервера. Именно она решает, доверяем мы данным или нет. */
  readonly schema: TSchema;
  readonly init?: RequestInit;
  /** Подменяемый fetch — нужен тестам и серверным вызовам с другими опциями кэша. */
  readonly fetchImpl?: typeof fetch;
}

/**
 * [S1-07] Типобезопасный HTTP-клиент.
 *
 * Что нужно сделать:
 *  1. Дженерик `TSchema extends z.ZodType` должен выводить тип успешного результата
 *     из схемы (`z.output<TSchema>`) — без `any` и без ручного указания типа на вызове.
 *  2. Функция никогда не бросает исключение: любая проблема возвращается как
 *     `Result<…, FetchFailure>` с корректным `kind`:
 *       - `network`      — fetch отвалился (нет сети, CORS, abort);
 *       - `http`         — ответ пришёл, но статус не 2xx (тело по возможности приложить);
 *       - `invalid-json` — тело не распарсилось как JSON;
 *       - `schema`       — JSON распарсился, но не прошёл валидацию схемой.
 *         В `issues` должны попасть путь поля и сообщение по каждой проблеме.
 *  3. Успешный результат — это ВАЛИДИРОВАННЫЕ данные (`schema.safeParse`), а не `as`.
 *
 * Тесты: `pnpm --filter @repo/contracts test`
 *
 * Сейчас реализация «оптимистичная»: она приводит тело ответа к нужному типу через
 * `as` и делает вид, что всё в порядке. Ровно так этот код и написан в проде у многих.
 */
export async function safeFetch<TSchema extends z.ZodType>(
  input: string | URL,
  options: SafeFetchOptions<TSchema>,
): Promise<Result<z.output<TSchema>, FetchFailure>> {
  const doFetch = options.fetchImpl ?? fetch;

  const response = await doFetch(input, options.init);
  const body = await response.json();

  return ok(body as z.output<TSchema>);
}
