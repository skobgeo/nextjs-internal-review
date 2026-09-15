import type { SVGProps } from 'react';

export type IconName =
  | 'funnel'
  | 'experiment'
  | 'attribution'
  | 'privacy'
  | 'seed'
  | 'growth'
  | 'scale'
  | 'arrow-right'
  | 'globe'
  | 'menu'
  | 'close'
  | 'check'
  | 'chevron-right';

const PATHS: Record<IconName, string> = {
  funnel: 'M3 4h18l-7 8v7l-4 2v-9L3 4z',
  experiment: 'M9 3v6L4 19a2 2 0 0 0 2 3h12a2 2 0 0 0 2-3l-5-10V3M8 3h8M8 14h8',
  attribution: 'M4 19V5m0 14h16M8 15l4-6 3 4 4-7',
  privacy: 'M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6l7-3zm-2.5 9l2 2 4-4',
  seed: 'M12 20v-6m0 0c-4 0-6-2-6-6 4 0 6 2 6 6zm0 0c0-4 2-6 6-6 0 4-2 6-6 6z',
  growth: 'M4 19h16M7 16V9m5 7V5m5 11v-4',
  scale: 'M12 4v16M5 8l7-4 7 4M4 12h5l-2.5 5L4 12zm11 0h5l-2.5 5L15 12z',
  'arrow-right': 'M5 12h14m-6-7 7 7-7 7',
  globe: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 0c3 3 3 15 0 18m0-18c-3 3-3 15 0 18M3.5 9h17m-17 6h17',
  menu: 'M4 7h16M4 12h16M4 17h16',
  close: 'M6 6l12 12M18 6 6 18',
  check: 'M4 12.5 9 18 20 6',
  'chevron-right': 'M9 5l7 7-7 7',
};

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  readonly name: IconName;
  readonly size?: number;
  /**
   * Доступное имя. Если иконка декоративная — не передавайте его,
   * и она будет скрыта от скринридеров через `aria-hidden`.
   */
  readonly title?: string;
}

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  );
}
