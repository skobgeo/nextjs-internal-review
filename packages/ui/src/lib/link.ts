import type { ElementType } from 'react';

/**
 * ui-kit не знает про роутер приложения. Компоненты, которые рендерят ссылки,
 * принимают его снаружи: в Next.js это `next/link`, в Storybook — обычный `a`.
 */
export type LinkComponent = ElementType;

export const DEFAULT_LINK: LinkComponent = 'a';
