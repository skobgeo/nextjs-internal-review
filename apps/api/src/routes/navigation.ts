import { asc } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { db } from '../db/client';
import { navItems } from '../db/schema';
import { resolveLocale, setLanguageHeaders } from '../lib/locale';
import { createTranslationResolver } from '../lib/translations';
import { localeQuerySchema, navigationResponseSchema } from '../schemas';

export const navigationRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/navigation',
    {
      schema: {
        tags: ['content'],
        summary: 'Плоское дерево навигации',
        description:
          'Пункты меню приходят плоским списком с `parent_id`. Дерево собирается на клиенте — ' +
          'так один и тот же ответ переиспользуется для шапки, подвала и хлебных крошек.',
        querystring: localeQuerySchema,
        response: { 200: navigationResponseSchema },
      },
    },
    (request, reply) => {
      const resolved = resolveLocale(request);
      const rows = db.select().from(navItems).orderBy(asc(navItems.position)).all();
      const text = createTranslationResolver(
        'nav_item',
        resolved.locale,
        rows.map((row) => row.id),
      );

      setLanguageHeaders(reply, text.effectiveLocale);

      return {
        locale: text.effectiveLocale,
        items: rows.map((row) => ({
          id: row.id,
          parent_id: row.parentId,
          slug: row.slug,
          href: row.href,
          position: row.position,
          title: text.value(row.id, 'title'),
        })),
      };
    },
  );
};
