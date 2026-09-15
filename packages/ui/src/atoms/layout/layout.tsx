import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';

import { cx } from '../../lib/cx';
import styles from './layout.module.css';

type SpaceToken = '3xs' | '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const spaceVar = (token: SpaceToken) => `var(--space-${token})`;

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  readonly as?: ElementType;
  readonly children: ReactNode;
}

export function Container({ as: Tag = 'div', className, children, ...rest }: ContainerProps) {
  return (
    <Tag className={cx(styles.container, className)} {...rest}>
      {children}
    </Tag>
  );
}

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  readonly as?: ElementType;
  readonly muted?: boolean;
  readonly children: ReactNode;
}

export function Section({ as: Tag = 'section', muted = false, className, children, ...rest }: SectionProps) {
  return (
    <Tag className={cx(styles.section, muted && styles.sectionMuted, className)} {...rest}>
      {children}
    </Tag>
  );
}

export interface StackProps extends HTMLAttributes<HTMLElement> {
  readonly as?: ElementType;
  readonly gap?: SpaceToken;
  readonly children: ReactNode;
}

export function Stack({ as: Tag = 'div', gap = 'sm', className, style, children, ...rest }: StackProps) {
  return (
    <Tag
      className={cx(styles.stack, className)}
      style={{ ...style, '--stack-gap': spaceVar(gap) } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export interface ClusterProps extends HTMLAttributes<HTMLElement> {
  readonly as?: ElementType;
  readonly gap?: SpaceToken;
  readonly children: ReactNode;
}

export function Cluster({ as: Tag = 'div', gap = '2xs', className, style, children, ...rest }: ClusterProps) {
  return (
    <Tag
      className={cx(styles.cluster, className)}
      style={{ ...style, '--cluster-gap': spaceVar(gap) } as CSSProperties}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Divider({ className, ...rest }: HTMLAttributes<HTMLHRElement>) {
  return <hr className={cx(styles.divider, className)} {...rest} />;
}
