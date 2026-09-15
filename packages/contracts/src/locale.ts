import { z } from 'zod';

/**
 * Поддерживаемые локали сайта. Порядок важен: первая — дефолтная,
 * она же конечное звено цепочки фолбэков на бэкенде.
 */
export const SUPPORTED_LOCALES = ['en', 'ru'] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'en';

export const localeSchema = z.enum(SUPPORTED_LOCALES);

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (SUPPORTED_LOCALES as readonly string[]).includes(value);
}

/**
 * Разбирает заголовок `Accept-Language` и возвращает локали в порядке убывания q-фактора.
 * `ru-RU,ru;q=0.9,en;q=0.8` → `['ru', 'en']`
 */
export function parseAcceptLanguage(header: string | undefined | null): string[] {
  if (!header) return [];

  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const quality = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;

      return {
        tag: (tag ?? '').trim().toLowerCase(),
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((entry) => entry.tag.length > 0 && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.tag);
}

/**
 * Выбирает локаль из списка предпочтений: точное совпадение, затем совпадение
 * по языковой части (`ru-RU` → `ru`), затем дефолт.
 */
export function negotiateLocale(preferred: readonly string[]): Locale {
  for (const candidate of preferred) {
    if (isLocale(candidate)) return candidate;

    const base = candidate.split('-')[0];
    if (isLocale(base)) return base;
  }

  return DEFAULT_LOCALE;
}
