import { and, desc, eq, sql } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '../db/client';
import { articles, categories } from '../db/schema';
import { resolveLocale, setLanguageHeaders, type ResolvedLocale } from '../lib/locale';
import { createTranslationResolver } from '../lib/translations';
import {
  articleDetailSchema,
  articleListQuerySchema,
  articleListResponseSchema,
  errorResponseSchema,
  localeQuerySchema,
} from '../schemas';

type ArticleRowWithCategory = {
  article: typeof articles.$inferSelect;
  category: typeof categories.$inferSelect;
};

function mapArticle(
  row: ArticleRowWithCategory,
  resolved: ResolvedLocale,
  articleText: ReturnType<typeof createTranslationResolver>,
  categoryText: ReturnType<typeof createTranslationResolver>,
) {
  const titleField = articleText.get(row.article.id, 'title');

  return {
    id: row.article.id,
    slug: row.article.slug,
    title: titleField?.value ?? '',
    excerpt: articleText.value(row.article.id, 'excerpt'),
    cover_url: row.article.coverUrl,
    reading_minutes: row.article.readingMinutes,
    published_at: row.article.publishedAt,
    updated_at: row.article.updatedAt,
    content_locale: titleField?.locale ?? resolved.locale,
    category: {
      id: row.category.id,
      slug: row.category.slug,
      title: categoryText.value(row.category.id, 'title'),
    },
    author: {
      name: row.article.authorName,
      role: row.article.authorRole,
    },
  };
}

export const articleRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/articles',
    {
      schema: {
        tags: ['articles'],
        summary: 'Список статей блога с пагинацией',
        description:
          'Ответ — конверт с `items`, `total`, `page` и `per_page`, а не голый массив. ' +
          'Поля дат приходят строками ISO 8601 в snake_case: `published_at`, `updated_at`. ' +
          'Если у статьи нет перевода на запрошенную локаль, текст отдаётся на дефолтной, ' +
          'а реальный язык лежит в `content_locale`.',
        querystring: articleListQuerySchema,
        response: { 200: articleListResponseSchema },
      },
    },
    (request, reply) => {
      const resolved = resolveLocale(request);
      const { page, per_page: perPage, category } = request.query;

      const categoryRow = category
        ? db.select().from(categories).where(eq(categories.slug, category)).get()
        : undefined;

      const where = categoryRow ? eq(articles.categoryId, categoryRow.id) : undefined;

      const totalRow = db
        .select({ count: sql<number>`count(*)` })
        .from(articles)
        .where(where)
        .get();

      const rows = db
        .select({ article: articles, category: categories })
        .from(articles)
        .innerJoin(categories, eq(categories.id, articles.categoryId))
        .where(where)
        .orderBy(desc(articles.publishedAt))
        .limit(perPage)
        .offset((page - 1) * perPage)
        .all();

      const articleText = createTranslationResolver(
        'article',
        resolved.locale,
        rows.map((row) => row.article.id),
      );
      const categoryText = createTranslationResolver(
        'category',
        resolved.locale,
        rows.map((row) => row.category.id),
      );

      setLanguageHeaders(reply, articleText.effectiveLocale);

      return {
        items: rows.map((row) => mapArticle(row, resolved, articleText, categoryText)),
        total: totalRow?.count ?? 0,
        page,
        per_page: perPage,
      };
    },
  );

  app.get(
    '/api/articles/:slug',
    {
      schema: {
        tags: ['articles'],
        summary: 'Одна статья по слагу',
        params: z.object({ slug: z.string() }),
        querystring: localeQuerySchema,
        response: { 200: articleDetailSchema, 404: errorResponseSchema },
      },
    },
    (request, reply) => {
      const resolved = resolveLocale(request);

      const row = db
        .select({ article: articles, category: categories })
        .from(articles)
        .innerJoin(categories, eq(categories.id, articles.categoryId))
        .where(and(eq(articles.slug, request.params.slug)))
        .get();

      if (!row) {
        setLanguageHeaders(reply, resolved.locale);
        reply.code(404);

        return {
          error: 'not_found',
          message: `Статья «${request.params.slug}» не найдена`,
          statusCode: 404,
        };
      }

      const articleText = createTranslationResolver('article', resolved.locale, [row.article.id]);
      const categoryText = createTranslationResolver('category', resolved.locale, [row.category.id]);

      setLanguageHeaders(reply, articleText.effectiveLocale);

      return {
        ...mapArticle(row, resolved, articleText, categoryText),
        body: articleText.value(row.article.id, 'body'),
      };
    },
  );
};
