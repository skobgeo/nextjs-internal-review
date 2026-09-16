import { desc, eq, sql, type SQL } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '../db/client';
import { articles, categories } from '../db/schema';
import {
  articleDetailSchema,
  articleListQuerySchema,
  articleListResponseSchema,
  errorResponseSchema,
} from '../schemas';

type ArticleRowWithCategory = {
  article: typeof articles.$inferSelect;
  category: typeof categories.$inferSelect;
};

function mapArticle(row: ArticleRowWithCategory) {
  return {
    id: row.article.id,
    slug: row.article.slug,
    title: row.article.title,
    excerpt: row.article.excerpt,
    cover_url: row.article.coverUrl,
    reading_minutes: row.article.readingMinutes,
    published_at: row.article.publishedAt,
    updated_at: row.article.updatedAt,
    category: {
      id: row.category.id,
      slug: row.category.slug,
      title: row.category.title,
    },
    author: {
      name: row.article.authorName,
      role: row.article.authorRole,
    },
  };
}

/** `%` и `_` в LIKE — служебные; экранируем, чтобы «100%» искалось буквально. */
function escapeLike(value: string): string {
  return value.replace(/[\\%_]/g, (char) => `\\${char}`);
}

export const articleRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/articles',
    {
      schema: {
        tags: ['articles'],
        summary: 'Список статей блога с пагинацией и поиском по заголовку',
        description:
          'Ответ — конверт с `items`, `total`, `page` и `per_page`, а не голый массив. ' +
          'Поля дат приходят строками ISO 8601 в snake_case: `published_at`, `updated_at`. ' +
          'Параметр `q` фильтрует по подстроке заголовка без учёта регистра.',
        querystring: articleListQuerySchema,
        response: { 200: articleListResponseSchema },
      },
    },
    (request) => {
      const { page, per_page: perPage, q } = request.query;

      const where: SQL | undefined = q
        ? sql`lower(${articles.title}) like ${`%${escapeLike(q.toLowerCase())}%`} escape '\\'`
        : undefined;

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

      return {
        items: rows.map(mapArticle),
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
        response: { 200: articleDetailSchema, 404: errorResponseSchema },
      },
    },
    (request, reply) => {
      const row = db
        .select({ article: articles, category: categories })
        .from(articles)
        .innerJoin(categories, eq(categories.id, articles.categoryId))
        .where(eq(articles.slug, request.params.slug))
        .get();

      if (!row) {
        reply.code(404);

        return {
          error: 'not_found',
          message: `Article "${request.params.slug}" was not found`,
          statusCode: 404,
        };
      }

      return {
        ...mapArticle(row),
        body: row.article.body,
      };
    },
  );
};
