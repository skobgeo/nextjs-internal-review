import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../lib/cx';
import styles from './visually-hidden.module.css';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  readonly as?: ElementType;
  readonly children: ReactNode;
}

export function VisuallyHidden({ as: Tag = 'span', className, children, ...rest }: VisuallyHiddenProps) {
  return (
    <Tag className={cx(styles.visuallyHidden, className)} {...rest}>
      {children}
    </Tag>
  );
}
