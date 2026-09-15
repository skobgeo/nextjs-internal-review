import { buildNavTree, findBreadcrumbs } from '@repo/core';
import { Breadcrumbs, Container, Text } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { getArticle } from '@/lib/api/articles';
import { getNavigation } from '@/lib/api/content';
import { formatDate, toIsoDate } from '@/lib/format';

/**
 * [S3-03] + [S2-05] + [S2-06] Страница статьи.
 *
 * Что здесь нужно сделать:
 *  1. `generateStaticParams` — статей немного и они почти не меняются,
 *     сейчас каждая страница рендерится на каждый запрос
 *     (`getArticleSlugs` из `@/lib/api/articles` уже есть);
 *  2. несуществующий слаг отдаёт 200 и пустую страницу — это «мягкий 404».
 *     Нужен `notFound()` и файл `not-found.tsx` для сегмента;
 *  3. рядом не хватает `loading.tsx` и `error.tsx`;
 *  4. метаданные ниже статичны: ни заголовка статьи, ни описания,
 *     ни canonical, ни hreflang, ни Open Graph;
 *  5. структурированные данные (`Article`, `BreadcrumbList`) не отдаются —
 *     помощник лежит в `@/components/json-ld`.
 *
 * Хлебные крошки уже подключены, но пусты: они строятся функциями из
 * `@repo/core` (задание S1-05).
 */
export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Lumen Analytics',
    description: 'Product analytics for growth teams.',
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const [t, article, navigation] = await Promise.all([
    getDictionary(locale),
    getArticle(slug, locale),
    getNavigation(locale),
  ]);

  const tree = buildNavTree(
    navigation.items.map((item) => ({
      id: item.id,
      parentId: item.parentId,
      slug: item.slug,
      title: item.title,
      href: `/${locale}${item.href}`,
      position: item.position,
    })),
  );

  const crumbs = findBreadcrumbs(tree, `blog-${article?.category?.slug ?? ''}`).map((node) => ({
    id: node.id,
    title: node.title,
    href: node.href,
  }));

  const paragraphs = (article?.body ?? '').split('\n\n').filter(Boolean);

  return (
    <Container>
      <article style={{ paddingBlock: 'var(--space-xl)' }}>
        <Breadcrumbs items={crumbs} label={t.t('nav.breadcrumbs')} linkComponent={Link} />

        <header style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2xs)', paddingBlock: 'var(--space-md)' }}>
          <Text as="span" tone="eyebrow">
            {article?.category?.title}
          </Text>

          <h1 style={{ fontSize: 'var(--font-size-3xl)' }}>{article?.title}</h1>

          <Text tone="muted">
            {t.t('blog.byAuthor', { author: article?.author?.name ?? '' })} ·{' '}
            <time dateTime={toIsoDate(article?.publishedAt)}>
              {formatDate(article?.publishedAt, locale)}
            </time>{' '}
            · {t.t('blog.readingTime', { minutes: article?.readingMinutes ?? 0 })}
          </Text>

          {article?.contentLocale && article.contentLocale !== locale ? (
            <Text tone="muted">{t.t('blog.translationMissing')}</Text>
          ) : null}
        </header>

        <div className="prose">
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        <p style={{ paddingBlock: 'var(--space-lg)' }}>
          <Link href={`/${locale}/blog`}>← {t.t('blog.backToBlog')}</Link>
        </p>
      </article>
    </Container>
  );
}
