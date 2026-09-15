import { asc, eq, inArray } from 'drizzle-orm';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { db } from '../db/client';
import { pages, sectionItems, sections } from '../db/schema';
import { resolveLocale, setLanguageHeaders, type ResolvedLocale } from '../lib/locale';
import { createTranslationResolver } from '../lib/translations';
import { errorResponseSchema, localeQuerySchema, pageContentSchema } from '../schemas';

function loadPage(slug: string, resolved: ResolvedLocale) {
  const page = db.select().from(pages).where(eq(pages.slug, slug)).get();
  if (!page) return null;

  const pageSections = db
    .select()
    .from(sections)
    .where(eq(sections.pageId, page.id))
    .orderBy(asc(sections.position))
    .all();

  const sectionIds = pageSections.map((section) => section.id);

  const items = sectionIds.length
    ? db
        .select()
        .from(sectionItems)
        .where(inArray(sectionItems.sectionId, sectionIds))
        .orderBy(asc(sectionItems.position))
        .all()
    : [];

  const sectionText = createTranslationResolver('section', resolved.locale, sectionIds);
  const itemText = createTranslationResolver(
    'section_item',
    resolved.locale,
    items.map((item) => item.id),
  );

  return {
    slug: page.slug,
    kind: page.kind,
    locale: sectionText.effectiveLocale,
    requested_locale: resolved.requested,
    used_fallback: sectionText.usedFallback || itemText.usedFallback,
    sections: pageSections.map((section) => ({
      id: section.id,
      kind: section.kind,
      position: section.position,
      media_url: section.mediaUrl,
      cta_href: section.ctaHref,
      fields: sectionText.fields(section.id),
      items: items
        .filter((item) => item.sectionId === section.id)
        .map((item) => ({
          id: item.id,
          position: item.position,
          icon: item.icon,
          value: item.value,
          fields: itemText.fields(item.id),
        })),
    })),
  };
}

function respondWithPage(slug: string, request: FastifyRequest, reply: FastifyReply) {
  const resolved = resolveLocale(request);
  const content = loadPage(slug, resolved);

  if (!content) {
    setLanguageHeaders(reply, resolved.locale);
    reply.code(404);

    return {
      error: 'not_found',
      message: `Страница «${slug}» не найдена`,
      statusCode: 404,
    };
  }

  setLanguageHeaders(reply, content.locale);

  return content;
}

export const contentRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/api/content/:page',
    {
      schema: {
        tags: ['content'],
        summary: 'Контент страницы для указанной локали',
        description:
          'Возвращает секции страницы с уже разрешёнными переводами. Если перевода нет, ' +
          'подставляется дефолтная локаль; фактический язык указан в поле `locale` и в заголовке `Content-Language`.',
        params: z.object({ page: z.string().describe('home | pricing | contact') }),
        querystring: localeQuerySchema,
        response: { 200: pageContentSchema, 404: errorResponseSchema },
      },
    },
    (request, reply) => respondWithPage(request.params.page, request, reply),
  );

  app.get(
    '/api/content/:group/:page',
    {
      schema: {
        tags: ['content'],
        summary: 'Контент вложенной страницы (например, legal/privacy)',
        params: z.object({ group: z.string().describe('legal'), page: z.string().describe('privacy | terms | cookies') }),
        querystring: localeQuerySchema,
        response: { 200: pageContentSchema, 404: errorResponseSchema },
      },
    },
    (request, reply) => respondWithPage(`${request.params.group}/${request.params.page}`, request, reply),
  );
};
