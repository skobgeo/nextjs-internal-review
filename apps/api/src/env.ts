import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));

export const env = {
  port: Number.parseInt(process.env.API_PORT ?? '3100', 10),
  host: process.env.API_HOST ?? '0.0.0.0',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  /** Файл SQLite. Лежит рядом с приложением и создаётся при первом старте. */
  databaseFile: process.env.DATABASE_FILE ?? path.join(here, '..', 'data', 'review.sqlite'),
  corsOrigins: (process.env.CORS_ORIGINS ?? 'http://localhost:3000').split(',').map((o) => o.trim()),
} as const;

export const isProduction = env.nodeEnv === 'production';
