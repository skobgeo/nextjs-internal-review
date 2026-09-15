import { ArticleGrid, Container, Pagination, type ArticleCardData } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { getArticles } from '@/lib/api/articles';
import { formatDate } from '@/lib/format';

/**
 * [S2-05] У страницы блога нет собственных метаданных: в выдаче она
 * неотличима от главной.
 *
 * [S3-02] Список статей ходит в API на каждый запрос — посмотрите, что
 * происходит в логах бэкенда при обновлении страницы.
 */
const PER_PAGE = 6;

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { locale } = await params;
  const { page: pageParam, category } = await searchParams;

  if (!isLocale(locale)) notFound();

  const page = Number.parseInt(pageParam ?? '1', 10) || 1;

  const [t, list] = await Promise.all([
    getDictionary(locale),
    getArticles({ locale, page, perPage: PER_PAGE, category }),
  ]);

  const totalPages = Math.ceil(list.total / list.perPage);

  const articles: ArticleCardData[] = (list.items ?? []).map((article) => ({
    slug: article.slug,
    href: `/${locale}/blog/${article.slug}`,
    title: article.title,
    excerpt: article.excerpt,
    coverUrl: article.coverUrl,
    categoryTitle: article.category?.title ?? '',
    authorName: article.author?.name ?? '',
    readingLabel: t.t('blog.readingTime', { minutes: article.readingMinutes }),
    publishedLabel: formatDate(article.publishedAt, locale),
    fallbackNotice:
      article.contentLocale && article.contentLocale !== locale
        ? t.t('blog.translationMissing')
        : undefined,
  }));

  const hrefForPage = (nextPage: number) => {
    const query = new URLSearchParams();
    if (nextPage > 1) query.set('page', String(nextPage));
    if (category) query.set('category', category);
    const suffix = query.toString();

    return `/${locale}/blog${suffix ? `?${suffix}` : ''}`;
  };

  return (
    <Container>
      <ArticleGrid
        title={t.t('blog.title')}
        subtitle={t.t('blog.subtitle')}
        articles={articles}
        emptyLabel={t.t('blog.empty')}
        linkComponent={Link}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        hrefForPage={hrefForPage}
        labels={{
          nav: t.t('blog.paginationNav'),
          previous: t.t('blog.previous'),
          next: t.t('blog.next'),
          status: t.t('blog.pagination', { page, total: totalPages }),
        }}
        linkComponent={Link}
      />
    </Container>
  );
}
