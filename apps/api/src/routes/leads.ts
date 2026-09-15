import { leadCreatedSchema, leadInputSchema } from '@repo/contracts';
import { scoreLead } from '@repo/core';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { db } from '../db/client';
import { leads } from '../db/schema';
import { errorResponseSchema } from '../schemas';

export const leadRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/api/leads',
    {
      config: {
        rateLimit: { max: 5, timeWindow: '1 minute' },
      },
      schema: {
        tags: ['leads'],
        summary: 'Заявка из формы обратной связи',
        description:
          'Тело валидируется той же zod-схемой, что используется на фронте (`@repo/contracts`). ' +
          'При ошибках валидации возвращается 422 со списком `errors` вида `{ path, message }` — ' +
          'сообщения приходят КЛЮЧАМИ словаря (`validation.email.invalid`), чтобы фронт перевёл их сам. ' +
          'Поле `website` — honeypot: оно должно оставаться пустым.',
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

      const { score, grade } = scoreLead({
        email: input.email,
        company: input.company || undefined,
        message: input.message,
        budget: input.budget,
        utm: {
          source: input.utmSource,
          medium: input.utmMedium,
          campaign: input.utmCampaign,
        },
        pagePath: input.pagePath,
      });

      const created = db
        .insert(leads)
        .values({
          name: input.name,
          email: input.email,
          company: input.company || null,
          message: input.message,
          budget: input.budget,
          locale: input.locale,
          score,
          grade,
          utmSource: input.utmSource ?? null,
          utmMedium: input.utmMedium ?? null,
          utmCampaign: input.utmCampaign ?? null,
          pagePath: input.pagePath ?? null,
          createdAt: new Date().toISOString(),
        })
        .returning({ id: leads.id, createdAt: leads.createdAt })
        .get();

      request.log.info({ leadId: created.id, score, grade }, 'Новая заявка');

      reply.code(201);
      return {
        id: created.id,
        score,
        created_at: created.createdAt,
      };
    },
  );
};
