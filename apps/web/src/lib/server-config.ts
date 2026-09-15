/**
 * Конфигурация обращений к CMS.
 *
 * ВНИМАНИЕ: токен — серверный секрет. Модуль обязан оставаться серверным.
 */
export const CMS_API_TOKEN = process.env.CMS_API_TOKEN ?? 'dev-only-secret-do-not-ship-to-client';

export const CMS_REQUEST_HEADERS: Record<string, string> = {
  'x-cms-token': CMS_API_TOKEN,
  'x-client': 'lumen-web',
};
