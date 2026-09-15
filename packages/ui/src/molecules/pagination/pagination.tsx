import { Icon } from '../../atoms/icon/icon';
import { cx } from '../../lib/cx';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './pagination.module.css';

export interface PaginationProps {
  readonly page: number;
  readonly totalPages: number;
  readonly hrefForPage: (page: number) => string;
  readonly labels: {
    readonly nav: string;
    readonly previous: string;
    readonly next: string;
    readonly status: string;
  };
  readonly linkComponent?: LinkComponent;
  readonly className?: string;
}

export function Pagination({
  page,
  totalPages,
  hrefForPage,
  labels,
  linkComponent,
  className,
}: PaginationProps) {
  const Link = linkComponent ?? DEFAULT_LINK;

  if (totalPages <= 1) return null;

  return (
    <nav aria-label={labels.nav} className={cx(styles.pagination, className)}>
      {page > 1 ? (
        <Link className={styles.link} href={hrefForPage(page - 1)} rel="prev">
          <Icon name="chevron-right" size={14} style={{ transform: 'rotate(180deg)' }} />
          {labels.previous}
        </Link>
      ) : null}

      <span className={styles.status}>{labels.status}</span>

      {page < totalPages ? (
        <Link className={styles.link} href={hrefForPage(page + 1)} rel="next">
          {labels.next}
          <Icon name="chevron-right" size={14} />
        </Link>
      ) : null}
    </nav>
  );
}
