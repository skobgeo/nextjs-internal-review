import '@repo/ui/tokens.css';
import '@repo/ui/reset.css';
import './globals.css';

import { PageShell, SiteFooter, type FooterColumn, type HeaderNavItem } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { AppHeader } from '@/components/app-header';
import { API_PUBLIC_URL, SITE_URL } from '@/lib/env';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: '%s · Lumen',
    default: 'Lumen Analytics',
  },
  description: 'Product analytics for growth teams.',
};

const HEADER_ITEMS: HeaderNavItem[] = [
  { id: 'blog', title: 'Blog', href: '/blog' },
  { id: 'contact', title: 'Contact', href: '/contact' },
];

const FOOTER_COLUMNS: FooterColumn[] = [
  {
    id: 'site',
    title: 'Lumen',
    links: HEADER_ITEMS.map((item) => ({ id: item.id, title: item.title, href: item.href })),
  },
  {
    id: 'internal',
    title: 'Internal',
    links: [
      { id: 'leads', title: 'Submitted requests', href: '/admin/leads' },
      { id: 'swagger', title: 'API docs', href: `${API_PUBLIC_URL}/docs`, external: true },
    ],
  },
];

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageShell
          header={
            <AppHeader
              brandName="Lumen"
              brandTagline="Product analytics"
              homeHref="/"
              items={HEADER_ITEMS}
              labels={{ primaryNav: 'Primary', openMenu: 'Open menu', closeMenu: 'Close menu' }}
            />
          }
          footer={
            <SiteFooter
              columns={FOOTER_COLUMNS}
              copyright={`© ${new Date().getFullYear()} Lumen Analytics. All rights reserved.`}
              note="Built for the internal frontend review."
              linkComponent={Link}
            />
          }
        >
          {children}
        </PageShell>
      </body>
    </html>
  );
}
