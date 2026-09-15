import 'server-only';

import { createTranslator, type TranslationDict, type Translator } from '@repo/core';

import { apiGet } from '@/lib/api/client';
import { messagesSchema } from '@/lib/api/schemas';
import { en, type Dictionary } from './dictionaries/en';
import { unflatten } from './unflatten';
import type { Locale } from './config';

export type SiteTranslator = Translator<Dictionary>;

/**
 * Собирает переводчик для локали.
 *
 * Тексты приходят с бэкенда (`GET /api/i18n`), английский словарь остаётся
 * фолбэком: если ключ не перевели или API недоступен, страница всё равно
 * отрисуется осмысленным текстом, а не ключами.
 *
 * [S3-02] Словарь одинаков для всех посетителей и меняется редко —
 * подберите ему политику кэширования.
 */
export async function getDictionary(locale: Locale): Promise<SiteTranslator> {
  const result = await apiGet('/api/i18n', {
    schema: messagesSchema,
    locale,
    tags: ['i18n', `i18n:${locale}`],
    revalidate: 600,
  });

  const remote = result.ok ? (unflatten(result.data.messages) as TranslationDict) : null;

  if (!result.ok) {
    console.error('[i18n] словарь не загрузился, используем локальный en', result.error);
  }

  return createTranslator<Dictionary>(locale, (remote ?? en) as unknown as Dictionary, {
    fallback: en as unknown as TranslationDict,
    onMissing: (key) => {
      if (process.env.NODE_ENV === 'development') {
        console.warn(`[i18n] нет перевода для ключа «${key}» (локаль ${locale})`);
      }
    },
  });
}
