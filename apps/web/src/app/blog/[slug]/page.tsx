import { Container, Text } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ReadingProgress } from '@/components/blog/reading-progress';
import { getArticle, getArticleSlugs } from '@/lib/api/articles';
import { formatDate, toIsoDate } from '@/lib/format';
import { absoluteUrl } from '@/lib/seo';
import styles from './article.module.css';

interface ArticleParams {
  readonly slug: string;
}

export async function generateStaticParams(): Promise<ArticleParams[]> {
  const slugs = await getArticleSlugs();

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<ArticleParams> }): Promise<Metadata> {
  const { slug } = await params;

  const article = await getArticle(slug);
  if (!article) return {};

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: absoluteUrl(`/blog/${slug}`),
      images: article.coverUrl ? [{ url: absoluteUrl(article.coverUrl), width: 1280, height: 720 }] : undefined,
      publishedTime: toIsoDate(article.publishedAt),
      modifiedTime: toIsoDate(article.updatedAt),
      authors: article.author ? [article.author.name] : undefined,
    },
  };
}

/**
 * Страница статьи.
 *
 * [T-05] Обложка вставлена обычным `<img>`: это самый крупный элемент над
 * сгибом, и именно он определяет LCP страницы.
 */
export default async function ArticlePage({ params }: { params: Promise<ArticleParams> }) {
  const { slug } = await params;

  const article = await getArticle(slug);
  if (!article) notFound();

  const paragraphs: string[] = (article.body ?? '').split('\n\n').filter(Boolean);

  return (
    <Container>
      <ReadingProgress />

      <article className={styles.article}>
        <header className={styles.header}>
          <Text as="span" tone="eyebrow">
            {article.category?.title}
          </Text>

          <h1 className={styles.title}>{article.title}</h1>

          <Text tone="muted">
            by {article.author?.name} ·{' '}
            <time dateTime={toIsoDate(article.publishedAt)}>{formatDate(article.publishedAt)}</time> ·{' '}
            {article.readingMinutes} min read
          </Text>
        </header>

        <img className={styles.cover} src={article.coverUrl} alt="" />

        <div className="prose">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        <p className={styles.back}>
          <Link href="/blog">← Back to the blog</Link>
        </p>
      </article>
    </Container>
  );
}
