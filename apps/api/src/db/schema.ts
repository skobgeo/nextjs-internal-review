import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

/**
 * Переводимый контент хранится по схеме «сущность + локаль + поле».
 * Такая таблица переживает добавление новых языков без миграции остальных таблиц
 * и позволяет отдавать частично переведённый контент с фолбэком.
 */
export const translations = sqliteTable(
  'translations',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    entity: text('entity').notNull(),
    entityId: text('entity_id').notNull(),
    locale: text('locale').notNull(),
    field: text('field').notNull(),
    value: text('value').notNull(),
  },
  (table) => [
    uniqueIndex('translations_unique').on(table.entity, table.entityId, table.locale, table.field),
    index('translations_lookup').on(table.entity, table.locale),
  ],
);

export const pages = sqliteTable('pages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  kind: text('kind').notNull().default('marketing'),
});

export const sections = sqliteTable(
  'sections',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    pageId: integer('page_id')
      .notNull()
      .references(() => pages.id),
    kind: text('kind').notNull(),
    position: integer('position').notNull(),
    mediaUrl: text('media_url'),
    ctaHref: text('cta_href'),
  },
  (table) => [index('sections_page').on(table.pageId, table.position)],
);

export const sectionItems = sqliteTable(
  'section_items',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    sectionId: integer('section_id')
      .notNull()
      .references(() => sections.id),
    position: integer('position').notNull(),
    icon: text('icon'),
    value: text('value'),
  },
  (table) => [index('section_items_section').on(table.sectionId, table.position)],
);

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
});

export const articles = sqliteTable(
  'articles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    coverUrl: text('cover_url').notNull(),
    authorName: text('author_name').notNull(),
    authorRole: text('author_role').notNull(),
    readingMinutes: integer('reading_minutes').notNull(),
    publishedAt: text('published_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('articles_published').on(table.publishedAt)],
);

export const navItems = sqliteTable(
  'nav_items',
  {
    id: text('id').primaryKey(),
    parentId: text('parent_id'),
    slug: text('slug').notNull(),
    href: text('href').notNull(),
    position: integer('position').notNull(),
  },
  (table) => [index('nav_items_parent').on(table.parentId, table.position)],
);

export const experiments = sqliteTable('experiments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  key: text('key').notNull().unique(),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(true),
  /** JSON-массив вариантов: [{ "id": "control", "weight": 50 }] */
  variants: text('variants').notNull(),
});

export const leads = sqliteTable(
  'leads',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    company: text('company'),
    message: text('message').notNull(),
    budget: text('budget').notNull().default('unknown'),
    locale: text('locale').notNull().default('en'),
    score: integer('score').notNull().default(0),
    grade: text('grade').notNull().default('cold'),
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    pagePath: text('page_path'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index('leads_created').on(table.createdAt)],
);

export type ArticleRow = typeof articles.$inferSelect;
export type SectionRow = typeof sections.$inferSelect;
export type NavItemRow = typeof navItems.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
