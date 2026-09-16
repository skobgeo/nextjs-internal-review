import Link from 'next/link';

import type { ArticleListItem } from '@/lib/api/schemas';
import { formatDate, toIsoDate } from '@/lib/format';
import styles from './article-card.module.css';

export interface ArticleCardProps {
  readonly article: ArticleListItem;
}

/**
 * Карточка статьи в списке.
 *
 * [T-05] Обложка — обычный `<img>` с одним `src`: в карточку шириной 340 px
 * уезжает файл 1280×720, и все шесть обложек грузятся сразу. Рядом с каждой
 * обложкой лежит копия шириной 640: `/images/articles/<slug>-640.jpg`.
 *
 * [T-06] После нативных атрибутов — перевод на `next/image`.
 */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.cover} src={article.coverUrl} alt="" />

      <div className={styles.body}>
        <span className={styles.category}>{article.category?.title}</span>

        <h2 className={styles.title}>
          <Link className={styles.titleLink} href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        <p className={styles.excerpt}>{article.excerpt}</p>

        <p className={styles.meta}>
          <span>by {article.author?.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={toIsoDate(article.publishedAt)}>{formatDate(article.publishedAt)}</time>
          <span aria-hidden="true">·</span>
          <span>{article.readingMinutes} min read</span>
        </p>
      </div>
    </article>
  );
}
