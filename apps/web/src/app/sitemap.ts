import type { MetadataRoute } from 'next';

import { getArticles } from '@/lib/api/articles';
import { absoluteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/'), priority: 1 },
    { url: absoluteUrl('/blog'), priority: 0.8 },
    { url: absoluteUrl('/contact'), priority: 0.8 },
  ];

  const list = await getArticles({ perPage: 50 });

  for (const article of list.items as { slug: string; updatedAt?: Date | string }[]) {
    entries.push({
      url: absoluteUrl(`/blog/${article.slug}`),
      lastModified: article.updatedAt ? new Date(article.updatedAt) : undefined,
      priority: 0.6,
    });
  }

  return entries;
}
