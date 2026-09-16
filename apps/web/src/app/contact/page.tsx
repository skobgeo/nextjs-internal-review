import { Container } from '@repo/ui';
import type { Metadata } from 'next';

import { ContactForm } from '@/components/contact-form';
import { absoluteUrl } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Book a demo',
  description: 'Tell us about your funnel and we will bring the questions.',
  alternates: { canonical: absoluteUrl('/contact') },
};

export default function ContactPage() {
  return (
    <Container>
      <div className="pageHeader">
        <h1 className="pageTitle">Book a demo</h1>
        <p className="pageSubtitle">Tell us about your funnel and we will bring the questions.</p>
      </div>

      <div style={{ paddingBlockEnd: 'var(--space-2xl)' }}>
        <ContactForm />
      </div>
    </Container>
  );
}
