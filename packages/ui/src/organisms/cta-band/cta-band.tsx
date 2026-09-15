import { ButtonLink } from '../../atoms/button/button';
import { cx } from '../../lib/cx';
import styles from './cta-band.module.css';

export interface CtaBandProps {
  readonly title: string;
  readonly description?: string;
  readonly cta?: { readonly label: string; readonly href: string };
  readonly className?: string;
}

export function CtaBand({ title, description, cta, className }: CtaBandProps) {
  return (
    <section className={cx(styles.band, className)}>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      {cta ? <ButtonLink href={cta.href}>{cta.label}</ButtonLink> : null}
    </section>
  );
}
