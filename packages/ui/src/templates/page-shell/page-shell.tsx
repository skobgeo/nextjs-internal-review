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
 * [T-07] Каркас страницы: шапка, содержимое, подвал.
 *
 * Разметка «работает». Попробуйте с клавиатуры добраться до содержимого,
 * не проходя каждый раз всё меню, и посмотрите, какие ориентиры (landmarks)
 * видит скринридер.
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
