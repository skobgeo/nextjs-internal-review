'use server';

import type { Locale } from '@/i18n/config';

export interface ContactFormState {
  readonly status: 'idle' | 'success' | 'error';
  /** Ошибки по именам полей формы: `{ email: ['validation.email.invalid'] }` */
  readonly fieldErrors: Readonly<Record<string, string[]>>;
  /** Общая ошибка, не привязанная к полю (сеть, 500, rate limit). */
  readonly formError?: string;
  /** Что ввёл пользователь — чтобы не терять данные при ошибке. */
  readonly values?: Readonly<Record<string, string>>;
}

export const initialContactState: ContactFormState = {
  status: 'idle',
  fieldErrors: {},
};

/**
 * [S3-04] Server Action формы обратной связи.
 *
 * Сейчас форма отправляется руками из клиентского компонента (см.
 * `@/components/contact-form`) и умеет ровно ничего: не валидирует ввод,
 * не показывает, какое поле не понравилось серверу, не защищена от
 * повторной отправки и не работает без JavaScript.
 *
 * Задача — перенести отправку сюда:
 *  1. разобрать `FormData` и провалидировать той же схемой `leadInputSchema`
 *     из `@repo/contracts`, что использует бэкенд (одна схема на клиент и сервер);
 *  2. при ошибках валидации вернуть `fieldErrors` — ключами сообщений
 *     (`validation.email.invalid`), чтобы клиент перевёл их словарём;
 *  3. отправить заявку в `POST /api/leads`, разобрать ответ:
 *     201 — успех, 422 — разложить `errors[]` по полям (есть готовый
 *     `toFieldErrorMap` в `@repo/contracts`), 429 — общая ошибка;
 *  4. подключить действие через `useActionState`, чтобы форма работала
 *     и без JavaScript (progressive enhancement), и показывала pending;
 *  5. после успешной отправки сбросить кэш там, где это нужно
 *     (`revalidateTag` / `updateTag` — подумайте, что здесь уместнее и почему).
 *
 * Полезное:
 *  - `import { leadInputSchema, toFieldErrorMap } from '@repo/contracts'`
 *  - `import { API_INTERNAL_URL } from '@/lib/env'`
 *  - utm-метки и путь страницы стоит прокинуть скрытыми полями — на них
 *     завязан скоринг заявки на бэкенде.
 */
export async function submitContactForm(
  _prevState: ContactFormState,
  _formData: FormData,
): Promise<ContactFormState> {
  return {
    status: 'error',
    fieldErrors: {},
    formError: 'contact.notImplemented',
  };
}

/** Заглушка: пригодится, когда действие начнёт зависеть от локали. */
export async function noopWithLocale(_locale: Locale): Promise<void> {
  return undefined;
}
