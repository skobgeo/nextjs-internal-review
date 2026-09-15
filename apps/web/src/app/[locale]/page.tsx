'use client';

import { assignVariant } from '@repo/core';
import { Container, CtaBand, FeatureGrid, Hero, MetricsBand } from '@repo/ui';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

import { VISITOR_COOKIE } from '@/i18n/config';
import { API_PUBLIC_URL } from '@/lib/env';
import { CMS_REQUEST_HEADERS } from '@/lib/server-config';

/**
 * [S3-01] Главная страница.
 *
 * Страница целиком помечена `'use client'` и тянет контент из API в `useEffect`.
 * Работает — но давайте посмотрим, чем за это платим:
 *  - в исходном HTML нет ни заголовка, ни текста хиро-секции (view-source);
 *  - пользователь сначала видит «Loading…», потом прыжок layout;
 *  - экспортировать `metadata` из клиентского компонента нельзя, поэтому у
 *    главной вообще нет своих метаданных;
 *  - вместе с компонентом в браузер уезжает всё, что он импортирует.
 *
 * Задача: сделать страницу серверной, оставив клиентскими только те куски,
 * которым действительно нужна интерактивность. Заодно найдите, что именно
 * из импортов этой страницы НЕ должно было попасть в клиентский бандл
 * (подсказка: откройте DevTools → Sources и поищите `dev-only-secret`).
 */

interface SectionItem {
  id: number;
  icon: string | null;
  value: string | null;
  fields: Record<string, string>;
}

interface Section {
  id: number;
  kind: string;
  media_url: string | null;
  cta_href: string | null;
  fields: Record<string, string>;
  items: SectionItem[];
}

interface PageContentResponse {
  locale: string;
  sections: Section[];
}

function useVisitorId(): string {
  const [visitorId, setVisitorId] = useState('anonymous');

  useEffect(() => {
    const match = document.cookie.split('; ').find((row) => row.startsWith(`${VISITOR_COOKIE}=`));
    if (match) setVisitorId(match.slice(VISITOR_COOKIE.length + 1));
  }, []);

  return visitorId;
}

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const visitorId = useVisitorId();

  const [content, setContent] = useState<PageContentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`${API_PUBLIC_URL}/api/content/home?locale=${locale}`, {
      headers: CMS_REQUEST_HEADERS,
    })
      .then((response) => response.json())
      .then((data: PageContentResponse) => {
        if (!cancelled) setContent(data);
      })
      .catch(() => {
        if (!cancelled) setContent(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (isLoading) {
    return (
      <Container>
        <p style={{ padding: '6rem 0' }}>Loading…</p>
      </Container>
    );
  }

  const sections = content?.sections ?? [];
  const hero = sections.find((section) => section.kind === 'hero');
  const metrics = sections.find((section) => section.kind === 'metrics');
  const features = sections.find((section) => section.kind === 'features');
  const cta = sections.find((section) => section.kind === 'cta');

  // A/B-эксперимент над надписью на кнопке: бакет считается детерминированно,
  // от стабильного id посетителя.
  const variant = assignVariant('hero-cta', visitorId, [
    { id: 'control', weight: 50 },
    { id: 'value-first', weight: 50 },
  ]);

  const heroCtaLabel =
    variant.id === 'value-first'
      ? (hero?.fields.secondaryCtaLabel ?? hero?.fields.ctaLabel ?? '')
      : (hero?.fields.ctaLabel ?? '');

  return (
    <>
      {hero ? (
        <Hero
          eyebrow={hero.fields.eyebrow}
          title={hero.fields.title ?? ''}
          subtitle={hero.fields.subtitle}
          primaryCta={
            hero.cta_href && heroCtaLabel
              ? { label: heroCtaLabel, href: `/${locale}${hero.cta_href}` }
              : undefined
          }
          secondaryCta={
            hero.fields.secondaryCtaLabel
              ? { label: hero.fields.secondaryCtaLabel, href: `/${locale}/blog` }
              : undefined
          }
          mediaUrl={hero.media_url ?? undefined}
          mediaAlt={hero.fields.mediaAlt}
          linkComponent={Link}
        />
      ) : null}

      <Container>
        {metrics ? (
          <MetricsBand
            title={metrics.fields.title}
            items={metrics.items.map((item) => ({
              id: item.id,
              value: item.value ?? '',
              label: item.fields.label ?? '',
            }))}
          />
        ) : null}

        {features ? (
          <FeatureGrid
            title={features.fields.title}
            subtitle={features.fields.subtitle}
            items={features.items.map((item) => ({
              id: item.id,
              icon: item.icon,
              title: item.fields.title ?? '',
              description: item.fields.description ?? '',
            }))}
          />
        ) : null}

        {cta ? (
          <CtaBand
            title={cta.fields.title ?? ''}
            description={cta.fields.description}
            cta={
              cta.cta_href && cta.fields.ctaLabel
                ? { label: cta.fields.ctaLabel, href: `/${locale}${cta.cta_href}` }
                : undefined
            }
          />
        ) : null}
      </Container>
    </>
  );
}
