import { z } from 'zod';

export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  statusCode: z.number().int(),
  errors: z
    .array(z.object({ path: z.string(), message: z.string() }))
    .optional()
    .describe('Заполняется для 422: по одной записи на поле формы.'),
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
  cover_url: z.string().describe('Путь к обложке относительно корня сайта, 1280×720.'),
  reading_minutes: z.number().int(),
  published_at: z.string().describe('ISO 8601, UTC.'),
  updated_at: z.string().describe('ISO 8601, UTC.'),
  category: articleCategorySchema,
  author: articleAuthorSchema,
});

export const articleListResponseSchema = z.object({
  items: z.array(articleListItemSchema),
  total: z.number().int().describe('Всего статей, подходящих под фильтр (не на странице).'),
  page: z.number().int(),
  per_page: z.number().int(),
});

export const articleDetailSchema = articleListItemSchema.extend({
  body: z.string().describe('Абзацы разделены пустой строкой (\\n\\n).'),
});

export const articleListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(50).default(6),
  q: z.string().trim().max(100).optional().describe('Поиск по подстроке заголовка без учёта регистра.'),
});

// --- заявки -----------------------------------------------------------------

export const leadSummarySchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  company: z.string().nullable(),
  message: z.string(),
  budget: z.string(),
  created_at: z.string().describe('ISO 8601, UTC.'),
});

export const leadListResponseSchema = z.object({
  items: z.array(leadSummarySchema),
  total: z.number().int(),
  page: z.number().int(),
  per_page: z.number().int(),
});

export const leadListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(50),
});

// --- служебное --------------------------------------------------------------

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
  uptime_seconds: z.number(),
  database: z.literal('ready'),
});
