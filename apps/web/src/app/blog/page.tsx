import { Container, Pagination, Text } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

import { ArticleFeed } from '@/components/blog/article-feed';
import { SearchBox } from '@/components/blog/search-box';
import { ARTICLES_PER_PAGE, getArticles } from '@/lib/api/articles';
import { absoluteUrl } from '@/lib/seo';

interface BlogSearchParams {
  readonly q?: string;
  readonly page?: string;
}

function parsePage(value: string | undefined): number {
  const page = Number.parseInt(value ?? '1', 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<BlogSearchParams> }): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: 'Blog',
    description: 'Notes on growth, analytics and the web platform.',
    alternates: { canonical: absoluteUrl('/blog') },
    // Поисковые выдачи — дубликаты списка; в индекс им не нужно.
    robots: q ? { index: false, follow: true } : undefined,
  };
}

/**
 * Список статей: серверный рендер первой страницы (SEO, работа без JS),
 * поиск по заголовку через `?q=`, пагинация через `?page=` и бесконечная
 * прокрутка поверх неё (`ArticleFeed`).
 */
export default async function BlogPage({ searchParams }: { searchParams: Promise<BlogSearchParams> }) {
  const { q, page: pageParam } = await searchParams;

  const query = q?.trim() ?? '';
  const page = parsePage(pageParam);

  const list = await getArticles({ page, perPage: ARTICLES_PER_PAGE, query: query || undefined });

  const totalPages = Math.max(1, Math.ceil(list.total / list.perPage));

  const hrefForPage = (nextPage: number) => {
    const search = new URLSearchParams();
    if (query) search.set('q', query);
    if (nextPage > 1) search.set('page', String(nextPage));
    const suffix = search.toString();

    return `/blog${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <Container>
      <div className="pageHeader">
        <h1 className="pageTitle">Blog</h1>
        <p className="pageSubtitle">Notes on growth, analytics and the web platform.</p>
      </div>

      <SearchBox initialQuery={query} />

      {query ? (
        <Text tone="muted" style={{ paddingBlock: 'var(--space-2xs)' }}>
          Results for “{query}”
        </Text>
      ) : null}

      {/* [T-03] Лента: первая страница с сервера, остальные догружает браузер. */}
      <ArticleFeed query={query} initialItems={list.items} total={list.total} page={page} perPage={ARTICLES_PER_PAGE} />

      <Pagination
        page={page}
        totalPages={totalPages}
        hrefForPage={hrefForPage}
        labels={{
          nav: 'Blog pagination',
          previous: 'Previous',
          next: 'Next',
          status: `Page ${page} of ${totalPages}`,
        }}
        linkComponent={Link}
      />
    </Container>
  );
}
