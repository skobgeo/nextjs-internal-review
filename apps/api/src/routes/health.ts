import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { sqlite } from '../db/client';
import { healthResponseSchema } from '../schemas';

export const healthRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/health',
    {
      schema: {
        tags: ['system'],
        summary: 'Проверка живости сервиса и доступности базы',
        response: { 200: healthResponseSchema },
      },
    },
    async () => {
      sqlite.prepare('SELECT 1').get();

      return {
        status: 'ok' as const,
        uptime_seconds: Number(process.uptime().toFixed(1)),
        database: 'ready' as const,
      };
    },
  );
};
