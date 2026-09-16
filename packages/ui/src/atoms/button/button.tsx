import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { cx } from '../../lib/cx';
import { DEFAULT_LINK, type LinkComponent } from '../../lib/link';
import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonBaseProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
}

export interface ButtonProps extends ButtonBaseProps, ButtonHTMLAttributes<HTMLButtonElement> {
  readonly children: ReactNode;
}

/** Кнопка. Оформление — в CSS на токенах, вариант и размер — через data-атрибуты. */
export function Button({ variant = 'primary', size = 'md', className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(styles.button, className)}
      data-variant={variant}
      data-size={size}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends ButtonBaseProps, AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly href: string;
  readonly children: ReactNode;
  /** Роутер приложения (в Next.js — `next/link`); по умолчанию обычный `<a>`. */
  readonly linkComponent?: LinkComponent;
}

/** Та же кнопка, но ссылкой — для переходов, а не действий. */
export function ButtonLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  linkComponent,
  ...rest
}: ButtonLinkProps) {
  const Link = linkComponent ?? DEFAULT_LINK;

  return (
    <Link className={cx(styles.button, className)} data-variant={variant} data-size={size} {...rest}>
      {children}
    </Link>
  );
}
