import { SUPPORTED_LOCALES } from '@repo/contracts';
import { z } from 'zod';

/**
 * Локаль в query намеренно принимается как обычная строка: неизвестное значение
 * не ошибка, а повод отдать контент на дефолтном языке. Фактический язык ответа
 * всегда возвращается в заголовке `Content-Language`.
 */
export const localeQuerySchema = z.object({
  locale: z
    .string()
    .optional()
    .describe(`Желаемая локаль. Поддерживаются: ${SUPPORTED_LOCALES.join(', ')}. Неизвестная локаль → фолбэк на en.`),
});

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
  errors: z
    .array(z.object({ path: z.string(), message: z.string() }))
    .optional()
    .describe('Заполняется для 422: по одной записи на поле формы.'),
});

// --- контент страниц --------------------------------------------------------

export const sectionItemSchema = z.object({
  id: z.number().int(),
  position: z.number().int(),
  icon: z.string().nullable(),
  value: z.string().nullable(),
  fields: z.record(z.string(), z.string()).describe('Переведённые поля элемента секции.'),
});

export const sectionSchema = z.object({
  id: z.number().int(),
  kind: z.string().describe('hero | metrics | features | cta | richtext'),
  position: z.number().int(),
  media_url: z.string().nullable(),
  cta_href: z.string().nullable(),
  fields: z.record(z.string(), z.string()),
  items: z.array(sectionItemSchema),
});

export const pageContentSchema = z.object({
  slug: z.string(),
  kind: z.string(),
  locale: z.string().describe('Фактический язык контента.'),
  requested_locale: z.string().nullable(),
  used_fallback: z.boolean(),
  sections: z.array(sectionSchema),
});

// --- навигация --------------------------------------------------------------

export const navItemSchema = z.object({
  id: z.string(),
  parent_id: z.string().nullable(),
  slug: z.string(),
  href: z.string(),
  position: z.number().int(),
  title: z.string(),
});

export const navigationResponseSchema = z.object({
  locale: z.string(),
  items: z.array(navItemSchema).describe('Плоский список. Дерево собирается на клиенте.'),
});

// --- статьи -----------------------------------------------------------------

export const articleCategorySchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
});

export const articleAuthorSchema = z.object({
  name: z.string(),
  role: z.string(),
});

export const articleListItemSchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  cover_url: z.string(),
  reading_minutes: z.number().int(),
  published_at: z.string().describe('ISO 8601, UTC.'),
  updated_at: z.string().describe('ISO 8601, UTC.'),
  content_locale: z.string().describe('Язык, на котором реально отдан текст статьи.'),
  category: articleCategorySchema,
  author: articleAuthorSchema,
});

export const articleListResponseSchema = z.object({
  items: z.array(articleListItemSchema),
  total: z.number().int(),
  page: z.number().int(),
  per_page: z.number().int(),
});

export const articleDetailSchema = articleListItemSchema.extend({
  body: z.string(),
});

export const articleListQuerySchema = localeQuerySchema.extend({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(50).default(6),
  category: z.string().optional().describe('Слаг категории: growth | seo | analytics'),
});

// --- словарь интерфейса -----------------------------------------------------

export const messagesResponseSchema = z.object({
  locale: z.string(),
  requested_locale: z.string().nullable(),
  /** Плоские ключи с точками: `blog.readingTime`. Клиент разворачивает их в объект. */
  messages: z.record(z.string(), z.string()),
});

// --- эксперименты -----------------------------------------------------------

export const experimentSchema = z.object({
  key: z.string(),
  enabled: z.boolean(),
  variants: z.array(z.object({ id: z.string(), weight: z.number() })),
});

export const experimentsResponseSchema = z.object({
  items: z.array(experimentSchema),
});

// --- служебное --------------------------------------------------------------

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  uptime_seconds: z.number(),
  database: z.literal('ready'),
});
