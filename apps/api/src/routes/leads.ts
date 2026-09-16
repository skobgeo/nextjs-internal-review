import { leadCreatedSchema, leadInputSchema } from '@repo/contracts';
import { desc, sql } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { db } from '../db/client';
import { leads } from '../db/schema';
import { errorResponseSchema, leadListQuerySchema, leadListResponseSchema } from '../schemas';

export const leadRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/leads',
    {
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
      schema: {
        tags: ['leads'],
        summary: 'Заявка из формы обратной связи',
        description:
          'Тело валидируется той же zod-схемой, что используется на фронте (`leadInputSchema` из `@repo/contracts`). ' +
          'При ошибках валидации возвращается 422 со списком `errors` вида `{ path, message }` — ' +
          'сообщения человекочитаемые, их можно показывать как есть. Поле `website` — honeypot: оно должно оставаться пустым.',
        body: leadInputSchema,
        response: {
          201: leadCreatedSchema,
          422: errorResponseSchema,
          429: errorResponseSchema,
        },
      },
    },
    (request, reply) => {
      const input = request.body;

      const created = db
        .insert(leads)
        .values({
          name: input.name,
          email: input.email,
          company: input.company || null,
          message: input.message,
          budget: input.budget,
          createdAt: new Date().toISOString(),
        })
        .returning({ id: leads.id, createdAt: leads.createdAt })
        .get();

      request.log.info({ leadId: created.id }, 'Новая заявка');

      reply.code(201);
      return {
        id: created.id,
        created_at: created.createdAt,
      };
    },
  );

  app.get(
    '/api/leads',
    {
      schema: {
        tags: ['leads'],
        summary: 'Сохранённые заявки, новые сверху',
        description:
          'Служебная ручка стенда: по ней проверяют, что форма действительно сохранила данные. ' +
          'Тот же список показывает страница `/admin/leads` на сайте. Конверт стандартный: `items`, `total`, `page`, `per_page`.',
        querystring: leadListQuerySchema,
        response: { 200: leadListResponseSchema },
      },
    },
    (request) => {
      const { page, per_page: perPage } = request.query;

      const totalRow = db
        .select({ count: sql<number>`count(*)` })
        .from(leads)
        .get();

      const rows = db
        .select()
        .from(leads)
        .orderBy(desc(leads.createdAt), desc(leads.id))
        .limit(perPage)
        .offset((page - 1) * perPage)
        .all();

      return {
        items: rows.map((row) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          company: row.company,
          message: row.message,
          budget: row.budget,
          created_at: row.createdAt,
        })),
        total: totalRow?.count ?? 0,
        page,
        per_page: perPage,
      };
    },
  );
};
