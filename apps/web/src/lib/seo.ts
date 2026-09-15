import { SITE_URL } from '@/lib/env';
import { SUPPORTED_LOCALES, type Locale } from '@/i18n/config';

/** Абсолютный URL — нужен для canonical, OG и sitemap. */
export function absoluteUrl(path: string): string {
  return new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL).toString();
}

/**
 * Языковые альтернативы страницы для `alternates.languages` (теги hreflang).
 * `path` передаётся БЕЗ локали: `/blog/seo`, а не `/ru/blog/seo`.
 */
export function localeAlternates(path: string): Record<string, string> {
  const clean = path === '/' ? '' : path;
  const alternates: Record<string, string> = {};

  for (const locale of SUPPORTED_LOCALES) {
    alternates[locale] = absoluteUrl(`/${locale}${clean}`);
  }

  alternates['x-default'] = absoluteUrl(`/${SUPPORTED_LOCALES[0]}${clean}`);

  return alternates;
}

export function canonicalFor(path: string, locale: Locale): string {
  const clean = path === '/' ? '' : path;

  return absoluteUrl(`/${locale}${clean}`);
}
