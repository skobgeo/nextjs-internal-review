import 'server-only';

import { apiGet } from './client';
import { articleDetailSchema, articleListSchema, type ArticleDetail, type ArticleList } from './schemas';

export interface ArticleListParams {
  readonly page?: number;
  readonly perPage?: number;
  /** Подстрока заголовка (см. поиск в блоге). */
  readonly query?: string;
}

export const ARTICLES_PER_PAGE = 6;

const EMPTY_LIST: ArticleList = { items: [], total: 0, page: 1, perPage: ARTICLES_PER_PAGE };

/**
 * Список статей. Кэшируется на минуту с тегом `articles`; поисковые выдачи
 * тоже кэшируются, но по своему URL — у каждого `q` свой ключ в Data Cache.
 *
 * Тип результата приходит из `articleListSchema` (задание T-01).
 */
export async function getArticles({ page = 1, perPage = ARTICLES_PER_PAGE, query }: ArticleListParams = {}): Promise<ArticleList> {
  const result = await apiGet('/api/articles', {
    schema: articleListSchema,
    searchParams: { page, per_page: perPage, q: query },
    tags: ['articles'],
    revalidate: 60,
  });

  if (!result.ok) {
    console.error('[articles] не удалось получить список', result.error);
    return EMPTY_LIST;
  }

  return result.data;
}

/** Одна статья. `null` — если статьи нет (404), чтобы страница отдала честный `notFound()`. */
export async function getArticle(slug: string): Promise<ArticleDetail | null> {
  const result = await apiGet(`/api/articles/${encodeURIComponent(slug)}`, {
    schema: articleDetailSchema,
    tags: ['articles', `article:${slug}`],
    revalidate: 300,
  });

  if (!result.ok) {
    if (result.error.kind === 'http' && result.error.status === 404) return null;

    console.error('[articles] не удалось получить статью', slug, result.error);
    return null;
  }

  return result.data;
}

/** Слаги всех статей — для `generateStaticParams` и карты сайта. */
export async function getArticleSlugs(): Promise<string[]> {
  const list = await getArticles({ perPage: 50 });

  return list.items.map((article: { slug: string }) => article.slug);
}
