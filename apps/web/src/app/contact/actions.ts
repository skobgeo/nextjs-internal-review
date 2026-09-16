'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_INTERNAL_URL } from '@/lib/env';
import { type ContactFormState } from './form-state';

/**
 * [T-04] Server Action формы обратной связи.
 *
 * Форма уже подключена через `useActionState` и отправляется без JavaScript.
 * Действие отправляет данные в `POST /api/leads` — и на этом хорошие новости
 * заканчиваются. Отправьте форму пустой, потом с одной ошибкой, потом
 * с выключенным API (`Ctrl+C` в терминале бэкенда) и посмотрите, что увидит
 * пользователь в каждом случае. Потом откройте `/admin/leads` сразу после
 * успешной отправки.
 *
 * Что нужно:
 *  1. валидировать `FormData` ТОЙ ЖЕ схемой `leadInputSchema` из `@repo/contracts`,
 *     что и бэкенд, — до похода в API; ошибки вернуть по полям;
 *  2. ответ `422` от API разложить по полям так же (`toFieldErrorMap` уже есть
 *     в `@repo/contracts`), `429` и сетевые ошибки — в общую ошибку формы;
 *  3. не терять введённые значения при ошибке;
 *  4. после успешного сохранения сбросить кэш списка заявок (тег `leads`):
 *     `updateTag` или `revalidateTag` — выбрать и объяснить, почему;
 *  5. убрать `any` — состояние описано в `form-state.ts`.
 */
export async function submitContactForm(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const payload: any = Object.fromEntries(formData.entries());
  payload.consent = payload.consent === 'on';

  const response = await fetch(`${API_INTERNAL_URL}/api/leads`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
    cache: 'no-store',
  });

  if (response.status === 201) {
    return { status: 'success', fieldErrors: {} };
  }

  const body: any = await response.json();

  return {
    status: 'error',
    fieldErrors: body.errors ?? [],
    formError: body.message,
  };
}
