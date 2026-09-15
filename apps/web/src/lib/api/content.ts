import 'server-only';

import { unwrapOr } from '@repo/contracts';

import type { Locale } from '@/i18n/config';
import { apiGet } from './client';
import { navigationSchema, pageContentSchema, type Navigation, type PageContent } from './schemas';

const EMPTY_CONTENT: PageContent = {
  slug: '',
  kind: 'marketing',
  locale: 'en',
  usedFallback: false,
  sections: [],
};

/**
 * Контент маркетинговой страницы.
 *
 * [S3-02] Этот контент меняется раз в несколько дней и одинаков для всех
 * посетителей. Подберите ему подходящую политику кэширования и тег для
 * точечной инвалидации.
 */
export async function getPageContent(slug: string, locale: Locale): Promise<PageContent | null> {
  const result = await apiGet(`/api/content/${slug}`, {
    schema: pageContentSchema,
    locale,
    tags: [`content:${slug}`, `content:${slug}:${locale}`],
    revalidate: 300,
  });

  if (!result.ok) {
    if (result.error.kind === 'http' && result.error.status === 404) return null;

    console.error('[content] не удалось получить страницу', slug, result.error);
    return null;
  }

  return result.data;
}

/** Навигация нужна на каждой странице — идеальный кандидат на долгий кэш. */
export async function getNavigation(locale: Locale): Promise<Navigation> {
  const result = await apiGet('/api/navigation', {
    schema: navigationSchema,
    locale,
    tags: ['navigation'],
    revalidate: 3600,
  });

  return unwrapOr(result, { locale, items: [] });
}

export function findSection(content: PageContent | null, kind: string) {
  return content?.sections?.find((section) => section.kind === kind) ?? null;
}

export { EMPTY_CONTENT };
