import type { Locale } from '@/i18n/config';

/**
 * Формат даты для конкретной локали.
 *
 * Специально устойчив к мусору на входе: если дата не распарсилась,
 * возвращается прочерк, а не падение рендера с `RangeError`.
 */
export function formatDate(value: string | Date | undefined | null, locale: Locale): string {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** Машиночитаемая дата для `<time datetime>` и JSON-LD. */
export function toIsoDate(value: string | Date | undefined | null): string | undefined {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString();
}
