import { sql } from 'drizzle-orm';
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
});

export const articles = sqliteTable(
  'articles',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    slug: text('slug').notNull().unique(),
    categoryId: integer('category_id')
      .notNull()
      .references(() => categories.id),
    title: text('title').notNull(),
    excerpt: text('excerpt').notNull(),
    /** Абзацы разделены пустой строкой. */
    body: text('body').notNull(),
    coverUrl: text('cover_url').notNull(),
    authorName: text('author_name').notNull(),
    authorRole: text('author_role').notNull(),
    readingMinutes: integer('reading_minutes').notNull(),
    publishedAt: text('published_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('articles_published').on(table.publishedAt)],
);

export const leads = sqliteTable(
  'leads',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    email: text('email').notNull(),
    company: text('company'),
    message: text('message').notNull(),
    budget: text('budget').notNull().default('unknown'),
    createdAt: text('created_at')
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index('leads_created').on(table.createdAt)],
);

export type ArticleRow = typeof articles.$inferSelect;
export type LeadRow = typeof leads.$inferSelect;
