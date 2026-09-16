import { safeFetch, type FetchFailure, type Result } from '@repo/contracts';

import { API_PUBLIC_URL } from '@/lib/env';
import { articleListSchema, type ArticleList } from './schemas';

export interface ArticlePageParams {
  readonly page: number;
  readonly perPage: number;
  readonly query?: string;
}

/**
 * Загрузка страницы списка ИЗ БРАУЗЕРА — для бесконечной прокрутки.
 * Ходит в API напрямую (CORS для localhost:3000 разрешён) и валидирует ответ
 * той же схемой, что и сервер.
 */
export async function fetchArticlesPage(
  { page, perPage, query }: ArticlePageParams,
  signal?: AbortSignal,
): Promise<Result<ArticleList, FetchFailure>> {
  const url = new URL('/api/articles', API_PUBLIC_URL);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));
  if (query) url.searchParams.set('q', query);

  return safeFetch(url, { schema: articleListSchema, init: { signal } });
}
