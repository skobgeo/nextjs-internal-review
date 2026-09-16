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
 * [T-05] Обложка — обычный `<img>`: в карточку шириной 340 px уезжает файл
 * 1280×720 в JPEG (посмотрите размер и формат в Network). Переведите на
 * `next/image` и будьте готовы объяснить, что именно он делает и какие
 * атрибуты за это отвечают.
 */
export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className={styles.card}>
      <img className={styles.cover} src={article.coverUrl} alt="" />

      <div className={styles.body}>
        <span className={styles.category}>{article.category?.title}</span>

        <h3 className={styles.title}>
          <Link className={styles.titleLink} href={`/blog/${article.slug}`}>
            {article.title}
          </Link>
        </h3>

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
