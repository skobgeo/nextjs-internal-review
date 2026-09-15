import fs from 'node:fs';
import path from 'node:path';

import Database, { type Database as SqliteDatabase } from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

import { env } from '../env';
import * as schema from './schema';

fs.mkdirSync(path.dirname(env.databaseFile), { recursive: true });

export const sqlite: SqliteDatabase = new Database(env.databaseFile);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

/**
 * Схема создаётся прямо на старте: для стенда это надёжнее, чем цепочка миграций,
 * которую кандидат никогда не увидит. Всё идемпотентно.
 */
export function ensureSchema(): void {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      kind TEXT NOT NULL DEFAULT 'marketing'
    );

    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER NOT NULL REFERENCES pages(id),
      kind TEXT NOT NULL,
      position INTEGER NOT NULL,
      media_url TEXT,
      cta_href TEXT
    );
    CREATE INDEX IF NOT EXISTS sections_page ON sections(page_id, position);

    CREATE TABLE IF NOT EXISTS section_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_id INTEGER NOT NULL REFERENCES sections(id),
      position INTEGER NOT NULL,
      icon TEXT,
      value TEXT
    );
    CREATE INDEX IF NOT EXISTS section_items_section ON section_items(section_id, position);

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      category_id INTEGER NOT NULL REFERENCES categories(id),
      cover_url TEXT NOT NULL,
      author_name TEXT NOT NULL,
      author_role TEXT NOT NULL,
      reading_minutes INTEGER NOT NULL,
      published_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS articles_published ON articles(published_at);

    CREATE TABLE IF NOT EXISTS nav_items (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      slug TEXT NOT NULL,
      href TEXT NOT NULL,
      position INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS nav_items_parent ON nav_items(parent_id, position);

    CREATE TABLE IF NOT EXISTS experiments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      enabled INTEGER NOT NULL DEFAULT 1,
      variants TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS translations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      locale TEXT NOT NULL,
      field TEXT NOT NULL,
      value TEXT NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS translations_unique
      ON translations(entity, entity_id, locale, field);
    CREATE INDEX IF NOT EXISTS translations_lookup ON translations(entity, locale);

    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      company TEXT,
      message TEXT NOT NULL,
      budget TEXT NOT NULL DEFAULT 'unknown',
      locale TEXT NOT NULL DEFAULT 'en',
      score INTEGER NOT NULL DEFAULT 0,
      grade TEXT NOT NULL DEFAULT 'cold',
      utm_source TEXT,
      utm_medium TEXT,
      utm_campaign TEXT,
      page_path TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS leads_created ON leads(created_at);
  `);
}
