import { z } from 'zod';

/**
 * Схемы ОТВЕТОВ бэкенда.
 *
 * Фронт не импортирует внутренние типы сервера — он описывает то, на что
 * рассчитывает, и проверяет это в рантайме. Контракт задокументирован
 * в Swagger: http://localhost:3100/docs
 */

// --- контент страниц (пример того, как это должно выглядеть) ----------------

export const sectionItemSchema = z.object({
  id: z.number().int(),
  position: z.number().int(),
  icon: z.string().nullable(),
  value: z.string().nullable(),
  fields: z.record(z.string(), z.string()),
});

export const sectionSchema = z.object({
  id: z.number().int(),
  kind: z.string(),
  position: z.number().int(),
  media_url: z.string().nullable(),
  cta_href: z.string().nullable(),
  fields: z.record(z.string(), z.string()),
  items: z.array(sectionItemSchema),
});

export const pageContentSchema = z
  .object({
    slug: z.string(),
    kind: z.string(),
    locale: z.string(),
    requested_locale: z.string().nullable(),
    used_fallback: z.boolean(),
    sections: z.array(sectionSchema),
  })
  .transform((raw) => ({
    slug: raw.slug,
    kind: raw.kind,
    locale: raw.locale,
    usedFallback: raw.used_fallback,
    sections: raw.sections.map((section) => ({
      id: section.id,
      kind: section.kind,
      position: section.position,
      mediaUrl: section.media_url,
      ctaHref: section.cta_href,
      fields: section.fields,
      items: section.items.map((item) => ({
        id: item.id,
        position: item.position,
        icon: item.icon,
        value: item.value,
        fields: item.fields,
      })),
    })),
  }));

export type PageContent = z.output<typeof pageContentSchema>;
export type PageSection = PageContent['sections'][number];

// --- навигация ---------------------------------------------------------------

export const navigationSchema = z
  .object({
    locale: z.string(),
    items: z.array(
      z.object({
        id: z.string(),
        parent_id: z.string().nullable(),
        slug: z.string(),
        href: z.string(),
        position: z.number().int(),
        title: z.string(),
      }),
    ),
  })
  .transform((raw) => ({
    locale: raw.locale,
    items: raw.items.map((item) => ({
      id: item.id,
      parentId: item.parent_id,
      slug: item.slug,
      href: item.href,
      position: item.position,
      title: item.title,
    })),
  }));

export type Navigation = z.output<typeof navigationSchema>;

// --- словарь интерфейса -------------------------------------------------------

export const messagesSchema = z.object({
  locale: z.string(),
  requested_locale: z.string().nullable(),
  messages: z.record(z.string(), z.string()),
});

// --- эксперименты -------------------------------------------------------------

export const experimentsSchema = z
  .object({
    items: z.array(
      z.object({
        key: z.string(),
        enabled: z.boolean(),
        variants: z.array(z.object({ id: z.string(), weight: z.number() })),
      }),
    ),
  })
  .transform((raw) => raw.items);

export type Experiment = z.output<typeof experimentsSchema>[number];

// --- статьи -------------------------------------------------------------------

/**
 * [S1-07] Схемы ответов блога.
 *
 * Сейчас это заглушки: валидации нет, и всё, что приходит с бэкенда,
 * принимается на веру. Из-за этого страница блога уже показывает мусор —
 * откройте `/ru/blog` и сравните с ответом в Swagger.
 *
 * Задача:
 *  1. описать реальный ответ `GET /api/articles` (и `/api/articles/:slug`)
 *     так, как он задокументирован в Swagger;
 *  2. привести его к доменной модели через `.transform()`:
 *     snake_case → camelCase, `published_at` (строка ISO) → `Date`;
 *  3. проверить, что после исправления `safeFetch` возвращает `kind: 'schema'`,
 *     если бэкенд изменит контракт (сломайте поле в ответе и посмотрите).
 */
export const articleListSchema = z.any();

export const articleDetailSchema = z.any();
