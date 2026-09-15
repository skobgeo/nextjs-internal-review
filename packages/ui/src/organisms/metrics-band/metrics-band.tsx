import { cx } from '../../lib/cx';
import styles from './metrics-band.module.css';

export interface MetricItem {
  readonly id: string | number;
  readonly value: string;
  readonly label: string;
}

export interface MetricsBandProps {
  readonly title?: string;
  readonly items: readonly MetricItem[];
  readonly className?: string;
}

export function MetricsBand({ title, items, className }: MetricsBandProps) {
  if (items.length === 0) return null;

  return (
    <section className={cx(styles.band, className)}>
      {title ? <h2 className={styles.title}>{title}</h2> : null}

      {items.map((item) => (
        <div key={item.id} className={styles.metric}>
          <span className={styles.value}>{item.value}</span>
          <span className={styles.label}>{item.label}</span>
        </div>
      ))}
    </section>
  );
}
