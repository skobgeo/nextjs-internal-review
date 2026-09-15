import { Icon, type IconName } from '../../atoms/icon/icon';
import { cx } from '../../lib/cx';
import styles from './feature-grid.module.css';

export interface FeatureItem {
  readonly id: string | number;
  readonly icon?: string | null;
  readonly value?: string | null;
  readonly title: string;
  readonly description: string;
}

export interface FeatureGridProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly items: readonly FeatureItem[];
  readonly headingLevel?: 'h2' | 'h3';
  readonly className?: string;
}

const KNOWN_ICONS: readonly string[] = [
  'funnel',
  'experiment',
  'attribution',
  'privacy',
  'seed',
  'growth',
  'scale',
];

export function FeatureGrid({
  title,
  subtitle,
  items,
  headingLevel: Heading = 'h2',
  className,
}: FeatureGridProps) {
  if (items.length === 0) return null;

  return (
    <section className={cx(styles.section, className)}>
      {title || subtitle ? (
        <header className={styles.header}>
          {title ? <Heading className={styles.itemValue}>{title}</Heading> : null}
          {subtitle ? <p className={styles.itemText}>{subtitle}</p> : null}
        </header>
      ) : null}

      <div className={styles.grid}>
        {items.map((item) => (
          <article key={item.id} className={styles.item}>
            {item.icon && KNOWN_ICONS.includes(item.icon) ? (
              <span className={styles.iconWrap}>
                <Icon name={item.icon as IconName} size={22} />
              </span>
            ) : null}

            {item.value ? <span className={styles.itemValue}>{item.value}</span> : null}

            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemText}>{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
