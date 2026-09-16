/**
 * Базовые адреса. Значения приходят из mise (`mise.toml`), но у каждого есть
 * дефолт — проект поднимается и без него.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Адрес API для СЕРВЕРНЫХ запросов (RSC, Server Actions). */
export const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? 'http://localhost:3100';

/** Адрес API для запросов ИЗ БРАУЗЕРА (бесконечная прокрутка). */
export const API_PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100';
