'use client';

import { VisuallyHidden } from '@repo/ui';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';

import { LOCALE_LABELS, SUPPORTED_LOCALES, type Locale } from '@/i18n/config';

export interface LanguageSwitcherProps {
  readonly locale: Locale;
  readonly label: string;
}

/**
 * [S3-05] Переключатель языка.
 *
 * Сейчас он умеет ровно одно: отправить пользователя на главную выбранного
 * языка. Со страницы `/ru/blog/growth-loops-beat-funnels` переключение на
 * английский выкидывает на `/en` — человек теряет то, что читал.
 * Выбор языка к тому же нигде не запоминается.
 *
 * Задача: сохранять текущий путь и query при переключении, запоминать выбор
 * (кука `lumen_locale`, см. `proxy.ts`) и не ломать состояние загрузки.
 */
export function LanguageSwitcher({ locale, label }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (next: string) => {
    startTransition(() => {
      router.push(`/${next}`);
    });
  };

  return (
    <label>
      <VisuallyHidden>{label}</VisuallyHidden>
      <select
        value={locale}
        onChange={(event) => handleChange(event.target.value)}
        disabled={isPending}
        data-pathname={pathname}
        style={{
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.35rem 0.5rem',
          background: 'var(--color-surface)',
          fontSize: 'var(--font-size-sm)',
        }}
      >
        {SUPPORTED_LOCALES.map((option) => (
          <option key={option} value={option}>
            {LOCALE_LABELS[option]}
          </option>
        ))}
      </select>
    </label>
  );
}
