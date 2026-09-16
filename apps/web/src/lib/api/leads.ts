import 'server-only';

import { apiGet } from './client';
import { leadListSchema, type LeadList } from './schemas';

export const LEADS_CACHE_TAG = 'leads';

/**
 * Сохранённые заявки для служебной страницы `/admin/leads`.
 *
 * Список кэшируется на 60 секунд с тегом `leads`. Тот, кто сохраняет новую
 * заявку, обязан этот тег сбросить — иначе страница минуту показывает старое
 * (см. задание T-04).
 */
export async function getLeads(): Promise<LeadList | null> {
  const result = await apiGet('/api/leads', {
    schema: leadListSchema,
    searchParams: { per_page: 100 },
    tags: [LEADS_CACHE_TAG],
    revalidate: 60,
  });

  if (!result.ok) {
    console.error('[leads] не удалось получить заявки', result.error);
    return null;
  }

  return result.data;
}
