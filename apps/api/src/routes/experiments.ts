import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { db } from '../db/client';
import { experiments } from '../db/schema';
import { experimentsResponseSchema } from '../schemas';

export const experimentRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/experiments',
    {
      schema: {
        tags: ['growth'],
        summary: 'Конфигурация A/B-экспериментов',
        description:
          'Бакетирование считается на клиенте детерминированной хэш-функцией от id посетителя, ' +
          'поэтому сервер отдаёт только веса вариантов и может кэшироваться надолго.',
        response: { 200: experimentsResponseSchema },
      },
    },
    async () => {
      const rows = db.select().from(experiments).all();

      return {
        items: rows.map((row) => ({
          key: row.key,
          enabled: row.enabled,
          variants: JSON.parse(row.variants) as { id: string; weight: number }[],
        })),
      };
    },
  );
};
