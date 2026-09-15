import type { ReactNode } from 'react';

import { cx } from '../../lib/cx';
import styles from './page-shell.module.css';

export interface PageShellProps {
  readonly header: ReactNode;
  readonly footer: ReactNode;
  readonly children: ReactNode;
  readonly className?: string;
}

/**
 * [S2-04] Каркас страницы: шапка, содержимое, подвал.
 *
 * Разметка «работает», но клавиатурный пользователь обречён каждый раз
 * проходить всё меню заново, а скринридер не может перескочить к сути.
 */
export function PageShell({ header, footer, children, className }: PageShellProps) {
  return (
    <div className={cx(styles.shell, className)}>
      {header}

      <div className={styles.content}>{children}</div>

      {footer}
    </div>
  );
}
