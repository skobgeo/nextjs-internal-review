import type { ElementType, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../lib/cx';
import styles from './typography.module.css';

type TextTone = 'eyebrow' | 'title' | 'sectionTitle' | 'subtitle' | 'body' | 'muted';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  /** Какой тег отрендерить. Уровень заголовка выбирает вызывающий — так его видно в разметке. */
  readonly as?: ElementType;
  readonly tone?: TextTone;
  readonly children: ReactNode;
}

export function Text({ as: Tag = 'p', tone = 'body', className, children, ...rest }: TextProps) {
  return (
    <Tag className={cx(styles[tone], className)} {...rest}>
      {children}
    </Tag>
  );
}
