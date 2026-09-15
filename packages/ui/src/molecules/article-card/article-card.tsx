import { cx } from '../../lib/cx';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './article-card.module.css';

export interface ArticleCardData {
  readonly slug: string;
  readonly href: string;
  readonly title: string;
  readonly excerpt: string;
  readonly coverUrl: string;
  readonly categoryTitle: string;
  readonly authorName: string;
  readonly readingLabel: string;
  readonly publishedLabel: string;
  /** Показываем честно, если текст пришёл не на запрошенном языке. */
  readonly fallbackNotice?: string;
}

export interface ArticleCardProps {
  readonly article: ArticleCardData;
  readonly linkComponent?: LinkComponent;
  readonly className?: string;
}

export function ArticleCard({ article, linkComponent, className }: ArticleCardProps) {
  const Link = linkComponent ?? DEFAULT_LINK;

  return (
    <article className={cx(styles.card, className)}>
      <img className={styles.cover} src={article.coverUrl} alt="" />

      <div className={styles.body}>
        <span className={styles.category}>{article.categoryTitle}</span>

        <h3 className={styles.title}>
          <Link className={styles.titleLink} href={article.href}>
            {article.title}
          </Link>
        </h3>

        <p className={styles.excerpt}>{article.excerpt}</p>

        <div className={styles.meta}>
          <span>{article.authorName}</span>
          <span aria-hidden="true">·</span>
          <span>{article.publishedLabel}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readingLabel}</span>
          {article.fallbackNotice ? (
            <span className={styles.fallbackBadge}>{article.fallbackNotice}</span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
