import { SITE_URL } from '@/lib/env';

/** Абсолютный URL — нужен для canonical, Open Graph и sitemap. */
export function absoluteUrl(path: string): string {
  return new URL(path.startsWith('/') ? path : `/${path}`, SITE_URL).toString();
}
