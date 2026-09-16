'use client';

import { useState, type ReactNode } from 'react';

import { Container } from '../../atoms/layout/layout';
import { Icon } from '../../atoms/icon/icon';
import { cx } from '../../lib/cx';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './site-header.module.css';

export interface HeaderNavItem {
  readonly id: string;
  readonly title: string;
  readonly href: string;
  readonly active?: boolean;
}

export interface SiteHeaderProps {
  readonly brandName: string;
  readonly brandTagline?: string;
  readonly homeHref: string;
  readonly items: readonly HeaderNavItem[];
  readonly labels: {
    readonly primaryNav: string;
    readonly openMenu: string;
    readonly closeMenu: string;
  };
  /** Переключатель языка и прочие действия справа. */
  readonly actions?: ReactNode;
  readonly linkComponent?: LinkComponent;
}

/**
 * [T-07] Шапка сайта.
 *
 * Компонент рабочий: меню открывается, ссылки ведут куда надо, на мобильном
 * появляется бургер. Пройдите её с клавиатуры (Tab, Enter) и посмотрите
 * дерево доступности в DevTools.
 */
export function SiteHeader({
  brandName,
  brandTagline,
  homeHref,
  items,
  labels,
  actions,
  linkComponent,
}: SiteHeaderProps) {
  const Link = linkComponent ?? DEFAULT_LINK;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <div className={styles.brand} onClick={() => (window.location.href = homeHref)}>
            <span className={styles.brandMark}>L</span>
            <span>
              {brandName}
              {brandTagline ? <span className={styles.brandTagline}> · {brandTagline}</span> : null}
            </span>
          </div>

          <nav className={styles.nav} aria-label={labels.primaryNav}>
            {items.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cx(styles.navLink, item.active && styles.navLinkActive)}
                aria-current={item.active ? 'page' : undefined}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className={styles.actions}>
            {actions}

            <div className={styles.burger} onClick={() => setMenuOpen((open) => !open)}>
              <Icon name={menuOpen ? 'close' : 'menu'} />
            </div>
          </div>
        </div>

        {menuOpen ? (
          <nav className={styles.mobileNav} aria-label={labels.primaryNav}>
            {items.map((item) => (
              <Link key={item.id} href={item.href} className={styles.navLink}>
                {item.title}
              </Link>
            ))}
          </nav>
        ) : null}
      </Container>
    </header>
  );
}
