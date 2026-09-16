import { ButtonLink, Container, Text } from '@repo/ui';
import type { Metadata } from 'next';
import Link from 'next/link';

import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: { absolute: 'Lumen · Growth without guesswork' },
  description:
    'Notes from a team that ships product analytics: growth loops, technical SEO and the data layer behind them.',
  alternates: { canonical: absoluteUrl('/') },
};

/** Главная: серверный компонент без единого клиентского байта. */
export default function HomePage() {
  return (
    <Container>
      <section className="centered">
        <Text as="span" tone="eyebrow">
          Lumen Analytics
        </Text>
        <h1 className="pageTitle">Growth without guesswork</h1>
        <p className="pageSubtitle">
          Notes from a team that ships product analytics: growth loops, technical SEO and the data layer behind
          them.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2xs)' }}>
          <ButtonLink href="/blog" size="lg" linkComponent={Link}>
            Read the blog
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" size="lg" linkComponent={Link}>
            Book a demo
          </ButtonLink>
        </div>
      </section>
    </Container>
  );
}
