import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/lib/env';

/**
 * [S2-06] Карта сайта.
 *
 * Сейчас в ней три захардкоженных URL на одном языке. В ней нет:
 *  - страниц второй локали и связей `alternates.languages` (hreflang);
 *  - статей блога (а это основной источник органики);
 *  - юридических страниц;
 *  - осмысленных `lastModified` — у статей есть `updated_at`.
 *
 * Задача: собрать карту из реальных данных (`getArticleSlugs`, `getNavigation`),
 * добавить языковые альтернативы и подумать, как эта функция должна кэшироваться.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/en`, priority: 1 },
    { url: `${SITE_URL}/en/pricing`, priority: 0.8 },
    { url: `${SITE_URL}/en/blog`, priority: 0.8 },
  ];
}
