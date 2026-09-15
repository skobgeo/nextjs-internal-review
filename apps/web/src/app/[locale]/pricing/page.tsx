import { Container, CtaBand, FeatureGrid, Hero } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { isLocale } from '@/i18n/config';
import { findSection, getPageContent } from '@/lib/api/content';
import { canonicalFor, localeAlternates } from '@/lib/seo';

/**
 * Эталонная серверная страница: данные берутся на сервере, метаданные
 * строятся из того же контента, canonical и hreflang проставлены.
 * Смотрите сюда, когда будете чинить главную (S3-01) и метаданные (S2-05).
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const content = await getPageContent('pricing', locale);
  const hero = findSection(content, 'hero');

  const title = hero?.fields.title ?? 'Pricing';
  const description = hero?.fields.subtitle;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalFor('/pricing', locale),
      languages: localeAlternates('/pricing'),
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonicalFor('/pricing', locale),
      locale,
    },
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const content = await getPageContent('pricing', locale);
  if (!content) notFound();

  const hero = findSection(content, 'hero');
  const plans = findSection(content, 'features');

  return (
    <>
      {hero ? (
        <Hero
          eyebrow={hero.fields.eyebrow}
          title={hero.fields.title ?? ''}
          subtitle={hero.fields.subtitle}
          primaryCta={
            hero.ctaHref && hero.fields.ctaLabel
              ? { label: hero.fields.ctaLabel, href: `/${locale}${hero.ctaHref}` }
              : undefined
          }
          linkComponent={Link}
        />
      ) : null}

      <Container>
        {plans ? (
          <FeatureGrid
            title={plans.fields.title}
            items={plans.items.map((item) => ({
              id: item.id,
              icon: item.icon,
              value: item.value,
              title: item.fields.title ?? '',
              description: item.fields.description ?? '',
            }))}
          />
        ) : null}

        <CtaBand
          title={hero?.fields.title ?? 'Lumen'}
          description={hero?.fields.subtitle}
          cta={{ label: hero?.fields.ctaLabel ?? 'Contact', href: `/${locale}/contact` }}
        />
      </Container>
    </>
  );
}
