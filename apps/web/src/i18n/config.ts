import { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale, type Locale } from '@repo/contracts';

export { DEFAULT_LOCALE, SUPPORTED_LOCALES, isLocale };
export type { Locale };

/** Кука с выбранной локалью. Ставится в proxy.ts и переключателем языка. */
export const LOCALE_COOKIE = 'lumen_locale';

/** Кука со стабильным id посетителя — на ней держится A/B-бакетирование. */
export const VISITOR_COOKIE = 'lumen_visitor';

export const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  ru: 'Русский',
};

/** `/ru/blog/seo` → `/blog/seo` */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (first && isLocale(first)) {
    return `/${segments.slice(1).join('/')}`;
  }

  return pathname || '/';
}

/** `/blog/seo` + `ru` → `/ru/blog/seo` */
export function withLocale(pathname: string, locale: Locale): string {
  const clean = stripLocale(pathname);
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`;
}
