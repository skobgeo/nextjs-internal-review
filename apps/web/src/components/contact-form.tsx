'use client';

import { Button } from '@repo/ui';
import { useState } from 'react';

import { API_PUBLIC_URL } from '@/lib/env';

export interface ContactFormLabels {
  readonly title: string;
  readonly description: string;
  readonly name: string;
  readonly namePlaceholder: string;
  readonly email: string;
  readonly emailPlaceholder: string;
  readonly company: string;
  readonly companyPlaceholder: string;
  readonly budget: string;
  readonly budgetUnknown: string;
  readonly budgetLt10k: string;
  readonly budget10k50k: string;
  readonly budgetGt50k: string;
  readonly message: string;
  readonly messagePlaceholder: string;
  readonly consent: string;
  readonly submit: string;
  readonly submitting: string;
  readonly successTitle: string;
  readonly successDescription: string;
  readonly errorTitle: string;
  readonly errorDescription: string;
}

export interface ContactFormProps {
  readonly locale: string;
  readonly labels: ContactFormLabels;
}

/**
 * [S3-04] + [S2-04] Форма обратной связи.
 *
 * Форма «работает»: данные уходят на бэкенд, при успехе показывается спасибо.
 * Но она отправляется вручную из браузера и поэтому:
 *  - не валидирует ввод до отправки и не показывает, какое поле не так —
 *    сервер отвечает 422 со списком полей, а мы выводим одну общую фразу;
 *  - кнопку можно нажать десять раз подряд;
 *  - без JavaScript не отправляется вообще;
 *  - подписи полей сделаны плейсхолдерами: текст пропадает, как только
 *    начинаешь печатать, а скринридер не понимает, что за поле перед ним;
 *  - состояния успеха и ошибки появляются молча — вспомогательные
 *    технологии о них не узнают;
 *  - honeypot и utm-метки не передаются, поэтому скоринг заявки на бэкенде
 *    работает вслепую.
 *
 * Задача: перевести на Server Action `submitContactForm` + `useActionState`
 * (см. `app/[locale]/contact/actions.ts`) и починить доступность,
 * используя `FormField` из `@repo/ui`.
 */
export function ContactForm({ locale, labels }: ContactFormProps) {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    setStatus('sending');

    const response = await fetch(`${API_PUBLIC_URL}/api/leads`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company'),
        budget: formData.get('budget'),
        message: formData.get('message'),
        consent: formData.get('consent') === 'on',
        locale,
      }),
    });

    setStatus(response.ok ? 'success' : 'error');
  }

  if (status === 'success') {
    return (
      <div>
        <h2>{labels.successTitle}</h2>
        <p>{labels.successDescription}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', maxInlineSize: '36rem' }}
    >
      <h2>{labels.title}</h2>
      <p>{labels.description}</p>

      <input name="name" placeholder={labels.namePlaceholder} />

      <input name="email" placeholder={labels.emailPlaceholder} />

      <input name="company" placeholder={labels.companyPlaceholder} />

      <select name="budget" defaultValue="unknown">
        <option value="unknown">{labels.budgetUnknown}</option>
        <option value="lt10k">{labels.budgetLt10k}</option>
        <option value="10k-50k">{labels.budget10k50k}</option>
        <option value="gt50k">{labels.budgetGt50k}</option>
      </select>

      <textarea name="message" placeholder={labels.messagePlaceholder} rows={6} />

      <div style={{ display: 'flex', gap: 'var(--space-2xs)' }}>
        <input type="checkbox" name="consent" />
        <span>{labels.consent}</span>
      </div>

      {status === 'error' ? (
        <div style={{ color: 'var(--color-danger)' }}>
          <strong>{labels.errorTitle}</strong>
          <p>{labels.errorDescription}</p>
        </div>
      ) : null}

      <Button type="submit">{status === 'sending' ? labels.submitting : labels.submit}</Button>
    </form>
  );
}
