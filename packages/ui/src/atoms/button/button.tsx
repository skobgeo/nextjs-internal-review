import type { AnchorHTMLAttributes, ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react';

import styles from './button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';

/**
 * [S2-01] Атом «кнопка».
 *
 * Кнопка работает и выглядит как в макете, но нарушает правило ui-kit:
 * оформление живёт не в CSS на токенах. Проверьте её клавиатурой и попробуйте
 * добавить размер `sm` — станет понятно, что переделывать.
 *
 * Задача: перенести оформление в `button.module.css` на дизайн-токены,
 * варианты и размеры выражать через `data-`атрибуты или классы-модификаторы,
 * добавить проп `size` ('sm' | 'md' | 'lg') и свести `Button`/`ButtonLink`
 * к одному полиморфному компоненту (дженерик-проп `as`), не потеряв
 * типизацию нативных атрибутов.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
}

function variantStyle(variant: ButtonVariant): CSSProperties {
  if (variant === 'secondary') {
    return { background: '#ffffff', color: '#4f46e5', border: '1px solid #c7d2fe' };
  }

  if (variant === 'ghost') {
    return { background: 'transparent', color: '#1e293b', border: '1px solid transparent' };
  }

  return { background: '#4f46e5', color: '#ffffff', border: '1px solid #4f46e5' };
}

const baseStyle: CSSProperties = {
  padding: '12px 20px',
  borderRadius: 8,
  fontWeight: 500,
  fontSize: 16,
  lineHeight: 1.2,
  cursor: 'pointer',
  textAlign: 'center',
};

export function Button({ variant = 'primary', children, style, ...rest }: ButtonProps) {
  return (
    <button className={styles.button} style={{ ...baseStyle, ...variantStyle(variant), ...style }} {...rest}>
      {children}
    </button>
  );
}

export interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  readonly variant?: ButtonVariant;
  readonly children: ReactNode;
}

/** Та же кнопка, но ссылкой. */
export function ButtonLink({ variant = 'primary', children, style, ...rest }: ButtonLinkProps) {
  return (
    <a className={styles.button} style={{ ...baseStyle, ...variantStyle(variant), ...style }} {...rest}>
      {children}
    </a>
  );
}
