'use client';

import { LEAD_BUDGETS, type LeadBudget } from '@repo/contracts';
import { Button, Checkbox, FieldError, FormField, Input, Select, Textarea } from '@repo/ui';
import Link from 'next/link';
import { useActionState } from 'react';

import { submitContactForm } from '@/app/contact/actions';
import { initialContactState } from '@/app/contact/form-state';
import styles from './contact-form.module.css';

const BUDGET_LABELS: Readonly<Record<LeadBudget, string>> = {
  unknown: 'Not sure yet',
  lt10k: 'Under $10k',
  '10k-50k': '$10k – $50k',
  gt50k: 'Over $50k',
};

/**
 * [T-04] Форма обратной связи на Server Action + `useActionState`.
 *
 * Разметка полей уже доступная (`FormField` связывает подпись, подсказку
 * и ошибку), отправка работает без JavaScript. Не хватает состояния отправки,
 * объявления результата вспомогательным технологиям и честных типов
 * (см. `app/contact/actions.ts` и `form-state.ts`).
 *
 * [T-07] И один из контролов подписан не так, как остальные.
 */
export function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialContactState);

  const fieldError = (field: string): string | undefined => state.fieldErrors?.[field]?.[0];

  if (state.status === 'success') {
    return (
      <div className={styles.success}>
        <h2>Request received</h2>
        <p>A solutions engineer replies within one business day.</p>
        <p>
          <Link href="/admin/leads">See submitted requests →</Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className={styles.form} noValidate>
      <h2>Book a demo</h2>
      <p className={styles.description}>Tell us about your funnel and we will bring the questions.</p>

      <FormField id="name" label="Your name" error={fieldError('name')} required>
        {(field) => (
          <Input {...field} name="name" autoComplete="name" placeholder="Ada Lovelace" defaultValue={state.values?.name} />
        )}
      </FormField>

      <FormField id="email" label="Work email" error={fieldError('email')} required>
        {(field) => (
          <Input
            {...field}
            name="email"
            type="email"
            autoComplete="email"
            placeholder="ada@company.com"
            defaultValue={state.values?.email}
          />
        )}
      </FormField>

      <FormField id="company" label="Company" error={fieldError('company')}>
        {(field) => (
          <Input
            {...field}
            name="company"
            autoComplete="organization"
            placeholder="Analytical Engines Ltd"
            defaultValue={state.values?.company}
          />
        )}
      </FormField>

      <FormField id="budget" label="Budget" error={fieldError('budget')}>
        {(field) => (
          <Select {...field} name="budget" defaultValue={state.values?.budget ?? 'unknown'}>
            {LEAD_BUDGETS.map((budget) => (
              <option key={budget} value={budget}>
                {BUDGET_LABELS[budget]}
              </option>
            ))}
          </Select>
        )}
      </FormField>

      <FormField id="message" label="What are you trying to move?" error={fieldError('message')} required>
        {(field) => (
          <Textarea
            {...field}
            name="message"
            rows={6}
            placeholder="We want to understand why trial teams stop on day three…"
            defaultValue={state.values?.message}
          />
        )}
      </FormField>

      <div className={styles.consentRow}>
        <Checkbox name="consent" defaultChecked={state.values?.consent === 'on'} />
        <span>I agree that Lumen may contact me about this request.</span>
      </div>
      {fieldError('consent') ? <FieldError>{fieldError('consent')}</FieldError> : null}

      {/* Honeypot: скрыт от людей, боты его заполняют, бэкенд отвечает 422. */}
      <div className={styles.honeypot} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      {state.status === 'error' ? (
        <div className={styles.formError}>
          <strong>The request was not sent</strong>
          <p>{state.formError ?? 'Check the highlighted fields and try again.'}</p>
        </div>
      ) : null}

      <div>
        <Button type="submit">Send request</Button>
      </div>
    </form>
  );
}
