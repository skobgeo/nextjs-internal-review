import { z } from 'zod';

/**
 * Схемы ОТВЕТОВ бэкенда.
 *
 * Фронт не импортирует внутренние типы сервера — он описывает то, на что
 * рассчитывает, и проверяет это в рантайме через `safeFetch`. Всё, что
 * не прошло схему, до компонентов не доходит. Контракт задокументирован
 * в Swagger: http://localhost:3100/docs
 */

// --- заявки (пример того, как должна выглядеть схема ответа) ------------------

export const leadSummarySchema = z
  .object({
    id: z.number().int(),
    name: z.string(),
    email: z.string(),
    company: z.string().nullable(),
    message: z.string(),
    budget: z.string(),
    created_at: z.string(),
  })
  .transform((raw) => ({
    id: raw.id,
    name: raw.name,
    email: raw.email,
    company: raw.company,
    message: raw.message,
    budget: raw.budget,
    createdAt: new Date(raw.created_at),
  }));

export const leadListSchema = z
  .object({
    items: z.array(leadSummarySchema),
    total: z.number().int(),
    page: z.number().int(),
    per_page: z.number().int(),
  })
  .transform((raw) => ({
    items: raw.items,
    total: raw.total,
    page: raw.page,
    perPage: raw.per_page,
  }));

export type LeadSummary = z.output<typeof leadSummarySchema>;
export type LeadList = z.output<typeof leadListSchema>;

// --- статьи -------------------------------------------------------------------

/**
 * [T-01] Схемы ответов блога.
 *
 * Сейчас это заглушки: `z.any()` пропускает всё, что пришло с бэкенда, и всё,
 * что из него выводится ниже (`ArticleListItem`, `ArticleList`, `ArticleDetail`),
 * тоже `any`. Компилятор молчит, а страница `/blog` уже показывает неправду —
 * откройте её и сравните карточки с ответом `GET /api/articles` в Swagger.
 *
 * Задача:
 *  1. описать реальные ответы `GET /api/articles` и `GET /api/articles/:slug`
 *     так, как они задокументированы в Swagger (образец — `leadSummarySchema` выше);
 *  2. привести их к доменной модели через `.transform()`: snake_case → camelCase,
 *     `published_at` (строка ISO) → `Date`;
 *  3. убедиться, что после этого типы ниже стали строгими, и починить всё,
 *     что подсветит компилятор в `blog/page.tsx`, `blog/[slug]/page.tsx`
 *     и `components/blog/*`;
 *  4. подумать, где здесь просится дженерик: список статей и список заявок
 *     приходят одинаковым конвертом `{ items, total, page, per_page }`.
 */
export const articleListItemSchema = z.any();

export const articleListSchema = z.any();

export const articleDetailSchema = z.any();

export type ArticleListItem = z.output<typeof articleListItemSchema>;
export type ArticleList = z.output<typeof articleListSchema>;
export type ArticleDetail = z.output<typeof articleDetailSchema>;
