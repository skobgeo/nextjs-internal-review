import { Container, Text } from '@repo/ui';
import { notFound } from 'next/navigation';

import { ContactForm } from '@/components/contact-form';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { findSection, getPageContent } from '@/lib/api/content';

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const [t, content] = await Promise.all([getDictionary(locale), getPageContent('contact', locale)]);
  const hero = findSection(content, 'hero');

  return (
    <Container>
      <div className="pageHeader">
        <Text as="span" tone="eyebrow">
          {hero?.fields.eyebrow}
        </Text>
        <h1 className="pageTitle">{hero?.fields.title}</h1>
        <p className="pageSubtitle">{hero?.fields.subtitle}</p>
      </div>

      <div style={{ paddingBlockEnd: 'var(--space-2xl)' }}>
        <ContactForm
          locale={locale}
          labels={{
            title: t.t('contact.title'),
            description: t.t('contact.description'),
            name: t.t('contact.name'),
            namePlaceholder: t.t('contact.namePlaceholder'),
            email: t.t('contact.email'),
            emailPlaceholder: t.t('contact.emailPlaceholder'),
            company: t.t('contact.company'),
            companyPlaceholder: t.t('contact.companyPlaceholder'),
            budget: t.t('contact.budget'),
            budgetUnknown: t.t('contact.budgetUnknown'),
            budgetLt10k: t.t('contact.budgetLt10k'),
            budget10k50k: t.t('contact.budget10k50k'),
            budgetGt50k: t.t('contact.budgetGt50k'),
            message: t.t('contact.message'),
            messagePlaceholder: t.t('contact.messagePlaceholder'),
            consent: t.t('contact.consent'),
            submit: t.t('contact.submit'),
            submitting: t.t('contact.submitting'),
            successTitle: t.t('contact.successTitle'),
            successDescription: t.t('contact.successDescription'),
            errorTitle: t.t('contact.errorTitle'),
            errorDescription: t.t('contact.errorDescription'),
          }}
        />
      </div>
    </Container>
  );
}
