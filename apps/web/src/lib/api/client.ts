import { safeFetch, type FetchFailure, type Result } from '@repo/contracts';
import type { z } from 'zod';

import type { Locale } from '@/i18n/config';
import { API_INTERNAL_URL } from '@/lib/env';
import { CMS_REQUEST_HEADERS } from '@/lib/server-config';

export interface ApiGetOptions<TSchema extends z.ZodType> {
  readonly schema: TSchema;
  readonly locale?: Locale;
  readonly searchParams?: Readonly<Record<string, string | number | undefined>>;
  /**
   * [S3-02] Политика кэширования конкретного запроса.
   *
   * Сейчас эти параметры принимаются, но НЕ используются: ниже жёстко
   * проставлен `cache: 'no-store'`, поэтому каждая страница ходит в API на
   * каждый запрос, а `revalidateTag` ничего не инвалидирует.
   *
   * Задача: пробросить их в `fetch` (`next: { revalidate, tags }`),
   * выбрать разумные значения на вызывающей стороне и объяснить выбор.
   */
  readonly revalidate?: number | false;
  readonly tags?: readonly string[];
}

function buildUrl(
  path: string,
  locale: Locale | undefined,
  searchParams: ApiGetOptions<z.ZodType>['searchParams'],
): string {
  const url = new URL(path, API_INTERNAL_URL);

  if (locale) url.searchParams.set('locale', locale);

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  return url.toString();
}

/**
 * Единая точка входа для серверных GET-запросов к API.
 * Валидация ответа делегирована `safeFetch` (см. задание S1-07).
 */
export async function apiGet<TSchema extends z.ZodType>(
  path: string,
  options: ApiGetOptions<TSchema>,
): Promise<Result<z.output<TSchema>, FetchFailure>> {
  return safeFetch(buildUrl(path, options.locale, options.searchParams), {
    schema: options.schema,
    init: {
      headers: CMS_REQUEST_HEADERS,
      cache: 'no-store',
    },
  });
}
