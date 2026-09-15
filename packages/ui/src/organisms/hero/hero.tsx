import { Button, ButtonLink } from '../../atoms/button/button';
import { cx } from '../../lib/cx';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './hero.module.css';

export interface HeroProps {
  readonly eyebrow?: string;
  readonly title: string;
  readonly subtitle?: string;
  readonly primaryCta?: { readonly label: string; readonly href: string };
  readonly secondaryCta?: { readonly label: string; readonly href: string };
  readonly mediaUrl?: string;
  readonly mediaAlt?: string;
  readonly linkComponent?: LinkComponent;
  readonly className?: string;
}

/**
 * [S2-02] + [S2-04] Хиро-секция главной.
 *
 * Помимо проблем с адаптивом (см. hero.module.css) здесь есть дефект
 * доступности, связанный с картинкой.
 */
export function Hero({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  mediaUrl,
  mediaAlt,
  linkComponent,
  className,
}: HeroProps) {
  const Link = linkComponent ?? DEFAULT_LINK;

  return (
    <section className={cx(styles.hero, className)}>
      <div className={styles.content}>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}

        <h1 className={styles.title}>{title}</h1>

        {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}

        <div className={styles.actions}>
          {primaryCta ? (
            <Link href={primaryCta.href} style={{ textDecoration: 'none' }}>
              <Button variant="primary">{primaryCta.label}</Button>
            </Link>
          ) : null}

          {secondaryCta ? (
            <ButtonLink variant="secondary" href={secondaryCta.href}>
              {secondaryCta.label}
            </ButtonLink>
          ) : null}
        </div>
      </div>

      {mediaUrl ? (
        <div className={styles.media}>
          <img className={styles.image} src={mediaUrl} />
        </div>
      ) : null}
    </section>
  );
}
