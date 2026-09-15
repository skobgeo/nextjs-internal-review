'use client';

import { SiteHeader, type SiteHeaderProps } from '@repo/ui';
import Link from 'next/link';

/**
 * Тонкая обёртка над шапкой из ui-kit: подставляет роутер приложения.
 *
 * Компонент клиентский, потому что шапка хранит состояние мобильного меню.
 * Сам `next/link` нельзя передать пропом из серверного компонента —
 * ссылки на компоненты через границу RSC не сериализуются.
 */
export function AppHeader(props: Omit<SiteHeaderProps, 'linkComponent'>) {
  return <SiteHeader {...props} linkComponent={Link} />;
}
