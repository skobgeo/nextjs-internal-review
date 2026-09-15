import { DEFAULT_LOCALE } from '@repo/contracts';
import { and, eq, inArray } from 'drizzle-orm';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

import { db } from '../db/client';
import { translations } from '../db/schema';
import { resolveLocale, setLanguageHeaders } from '../lib/locale';
import { localeQuerySchema, messagesResponseSchema } from '../schemas';

export const i18nRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/i18n',
    {
      schema: {
        tags: ['i18n'],
        summary: 'Словарь интерфейса для локали',
        description:
          'Ключи плоские, с точками (`blog.readingTime`). Ключи, которых нет в запрошенной ' +
          'локали, добираются из дефолтной — поэтому частично переведённый интерфейс не ломается.',
        querystring: localeQuerySchema,
        response: { 200: messagesResponseSchema },
      },
    },
    (request, reply) => {
      const resolved = resolveLocale(request);
      const locales =
        resolved.locale === DEFAULT_LOCALE ? [DEFAULT_LOCALE] : [DEFAULT_LOCALE, resolved.locale];

      // Порядок важен: сначала дефолт, потом запрошенная локаль перезаписывает ключи.
      const rows = db
        .select({ locale: translations.locale, field: translations.field, value: translations.value })
        .from(translations)
        .where(and(eq(translations.entity, 'ui'), inArray(translations.locale, locales)))
        .all();

      const messages: Record<string, string> = {};

      for (const localeInOrder of locales) {
        for (const row of rows) {
          if (row.locale === localeInOrder) {
            messages[row.field] = row.value;
          }
        }
      }

      setLanguageHeaders(reply, resolved.locale);

      return {
        locale: resolved.locale,
        requested_locale: resolved.requested,
        messages,
      };
    },
  );
};
