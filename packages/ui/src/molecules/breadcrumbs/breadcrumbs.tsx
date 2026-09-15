import { Icon } from '../../atoms/icon/icon';
import { cx } from '../../lib/cx';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './breadcrumbs.module.css';

export interface Crumb {
  readonly id: string;
  readonly title: string;
  readonly href: string;
}

export interface BreadcrumbsProps {
  readonly items: readonly Crumb[];
  readonly label: string;
  readonly linkComponent?: LinkComponent;
  readonly className?: string;
}

export function Breadcrumbs({ items, label, linkComponent, className }: BreadcrumbsProps) {
  const Link = linkComponent ?? DEFAULT_LINK;

  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={className}>
      <ol className={styles.list}>
        {items.map((crumb, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={crumb.id} className={styles.item}>
              {isLast ? (
                <span className={styles.current} aria-current="page">
                  {crumb.title}
                </span>
              ) : (
                <>
                  <Link className={cx(styles.link)} href={crumb.href}>
                    {crumb.title}
                  </Link>
                  <Icon name="chevron-right" size={14} className={styles.separator} />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
