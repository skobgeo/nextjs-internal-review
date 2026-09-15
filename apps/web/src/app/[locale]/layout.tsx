import '@repo/ui/tokens.css';
import '@repo/ui/reset.css';
import '../globals.css';

import { PageShell, SiteFooter, type FooterColumn, type HeaderNavItem } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { AppHeader } from '@/components/app-header';
import { LanguageSwitcher } from '@/components/language-switcher';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { getNavigation } from '@/lib/api/content';

/**
 * [S2-05] Метаданные сайта.
 *
 * Сейчас здесь один статичный объект на все страницы: одинаковый `title`
 * у главной, блога и каждой статьи, нет `metadataBase`, нет canonical и
 * нет языковых альтернатив (hreflang). Для сайта на двух языках это
 * означает конкуренцию собственных страниц в выдаче.
 *
 * Задача: сделать метаданные осмысленными — шаблон заголовка, `metadataBase`,
 * canonical и `alternates.languages` с учётом локали (см. `@/lib/seo`).
 */
export const metadata: Metadata = {
  title: 'Lumen Analytics',
  description: 'Product analytics for growth teams.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  const [t, navigation] = await Promise.all([getDictionary(locale), getNavigation(locale)]);

  const topLevel = navigation.items.filter((item) => item.parentId === null);

  const headerItems: HeaderNavItem[] = topLevel
    .filter((item) => item.id !== 'legal')
    .map((item) => ({
      id: item.id,
      title: item.title,
      href: `/${locale}${item.href === '/' ? '' : item.href}`,
    }));

  const columnFor = (parentId: string, title: string): FooterColumn => ({
    id: parentId,
    title,
    links: navigation.items
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        id: item.id,
        title: item.title,
        href: `/${locale}${item.href}`,
      })),
  });

  const footerColumns: FooterColumn[] = [
    {
      id: 'product',
      title: t.t('footer.product'),
      links: headerItems.map((item) => ({ id: item.id, title: item.title, href: item.href })),
    },
    columnFor('blog', t.t('footer.resources')),
    columnFor('legal', t.t('footer.legal')),
  ];

  return (
    <html lang="en">
      <body>
        <PageShell
          header={
            <AppHeader
              brandName="Lumen"
              brandTagline={t.t('nav.brandTagline')}
              homeHref={`/${locale}`}
              items={headerItems}
              labels={{
                primaryNav: t.t('nav.primary'),
                openMenu: t.t('nav.openMenu'),
                closeMenu: t.t('nav.closeMenu'),
              }}
              actions={<LanguageSwitcher locale={locale} label={t.t('nav.language')} />}
            />
          }
          footer={
            <SiteFooter
              columns={footerColumns}
              copyright={t.t('footer.rights', { year: new Date().getFullYear() })}
              note={t.t('footer.builtWith')}
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
