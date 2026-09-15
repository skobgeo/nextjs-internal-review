import { ArticleCard, type ArticleCardData } from '../../molecules/article-card/article-card';
import { cx } from '../../lib/cx';
import { type LinkComponent } from '../../lib/link';
import styles from './article-grid.module.css';

export interface ArticleGridProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly articles: readonly ArticleCardData[];
  readonly emptyLabel: string;
  readonly linkComponent?: LinkComponent;
  readonly className?: string;
}

export function ArticleGrid({
  title,
  subtitle,
  articles,
  emptyLabel,
  linkComponent,
  className,
}: ArticleGridProps) {
  return (
    <section className={cx(styles.section, className)}>
      {title || subtitle ? (
        <header className={styles.header}>
          {title ? <h1>{title}</h1> : null}
          {subtitle ? <p>{subtitle}</p> : null}
        </header>
      ) : null}

      {articles.length === 0 ? (
        <p className={styles.empty}>{emptyLabel}</p>
      ) : (
        <div className={styles.grid}>
          {articles.map((article) => (
            <div key={article.slug} className={styles.item}>
              <ArticleCard article={article} linkComponent={linkComponent} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
