import 'server-only';

import { safeFetch, type FetchFailure, type Result } from '@repo/contracts';
import type { z } from 'zod';

import { API_INTERNAL_URL } from '@/lib/env';

export interface ApiGetOptions<TSchema extends z.ZodType> {
  readonly schema: TSchema;
  readonly searchParams?: Readonly<Record<string, string | number | undefined>>;
  /**
   * Политика кэширования конкретного запроса (Data Cache Next.js):
   * `revalidate` — срок жизни в секундах (`false` — без кэша), `tags` — метки
   * для точечной инвалидации через `revalidateTag` / `updateTag`.
   */
  readonly revalidate?: number | false;
  readonly tags?: readonly string[];
}

export function buildApiUrl(
  path: string,
  searchParams: ApiGetOptions<z.ZodType>['searchParams'],
  base: string = API_INTERNAL_URL,
): string {
  const url = new URL(path, base);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/**
 * Единая точка входа для серверных GET-запросов к API.
 *
 * Тип результата выводится из схемы: `apiGet('/x', { schema })` возвращает
 * `Result<z.output<typeof schema>, FetchFailure>`. Ничего не бросает.
 */
export async function apiGet<TSchema extends z.ZodType>(
  path: string,
  options: ApiGetOptions<TSchema>,
): Promise<Result<z.output<TSchema>, FetchFailure>> {
  const init: RequestInit & { next?: { revalidate?: number | false; tags?: string[] } } =
    options.revalidate === false
      ? { cache: 'no-store' }
      : { next: { revalidate: options.revalidate, tags: options.tags ? [...options.tags] : undefined } };

  return safeFetch(buildApiUrl(path, options.searchParams), {
    schema: options.schema,
    init,
  });
}
