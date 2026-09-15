import 'server-only';

import type { Locale } from '@/i18n/config';
import { API_INTERNAL_URL } from '@/lib/env';

/**
 * [S1-07] + [S3-02] Слой данных блога.
 *
 * Здесь всё держится на честном слове: ответ приводится к нужному типу
 * через `as`, схемы нет, ошибки не обрабатываются, кэш отключён.
 * Страница `/ru/blog` уже показывает следствия — найдите их.
 *
 * Задача:
 *  - перевести обе функции на `apiGet` + схемы из `./schemas`;
 *  - подобрать политику кэширования (список статей и отдельная статья
 *    живут по-разному) и повесить теги для инвалидации;
 *  - корректно обработать 404 и ошибку сети.
 */

export interface Article {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly coverUrl: string;
  readonly readingMinutes: number;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly contentLocale: string;
  readonly category: { readonly id: number; readonly slug: string; readonly title: string };
  readonly author: { readonly name: string; readonly role: string };
}

export interface ArticleDetail extends Article {
  readonly body: string;
}

export interface ArticleListResult {
  readonly items: readonly Article[];
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
}

export interface ArticleListParams {
  readonly locale: Locale;
  readonly page?: number;
  readonly perPage?: number;
  readonly category?: string;
}

export async function getArticles({
  locale,
  page = 1,
  perPage = 6,
  category,
}: ArticleListParams): Promise<ArticleListResult> {
  const url = new URL('/api/articles', API_INTERNAL_URL);
  url.searchParams.set('locale', locale);
  url.searchParams.set('page', String(page));
  url.searchParams.set('per_page', String(perPage));
  if (category) url.searchParams.set('category', category);

  const response = await fetch(url, { cache: 'no-store' });
  const data = (await response.json()) as ArticleListResult;

  return data;
}

export async function getArticle(slug: string, locale: Locale): Promise<ArticleDetail | null> {
  const url = new URL(`/api/articles/${slug}`, API_INTERNAL_URL);
  url.searchParams.set('locale', locale);

  const response = await fetch(url, { cache: 'no-store' });

  if (response.status === 404) return null;

  return (await response.json()) as ArticleDetail;
}

/**
 * Список слагов для предгенерации страниц статей.
 * Пригодится в `generateStaticParams` (см. задание S3-03).
 */
export async function getArticleSlugs(locale: Locale): Promise<string[]> {
  const list = await getArticles({ locale, perPage: 50 });

  return (list.items ?? []).map((article) => article.slug);
}
