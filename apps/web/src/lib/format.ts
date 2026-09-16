const LOCALE = 'en-GB';

/**
 * Формат даты. Специально устойчив к мусору на входе: если дата не распарсилась,
 * возвращается прочерк, а не падение рендера с `RangeError`.
 * Часовой пояс зафиксирован, чтобы сервер и браузер отрисовали одно и то же.
 */
export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(LOCALE, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatDateTime(value: string | Date | undefined | null): string {
  if (!value) return '—';

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat(LOCALE, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'UTC',
  }).format(date);
}

/** Машиночитаемая дата для `<time datetime>`. */
export function toIsoDate(value: string | Date | undefined | null): string | undefined {
  if (!value) return undefined;

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;

  return date.toISOString();
}
