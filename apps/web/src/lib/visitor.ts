import 'server-only';

import { cookies } from 'next/headers';

import { VISITOR_COOKIE } from '@/i18n/config';

/**
 * Стабильный идентификатор посетителя. Кука выставляется в `proxy.ts`,
 * поэтому здесь остаётся только прочитать её (Server Component писать куки
 * не может — это делают proxy, Server Action или route handler).
 */
export async function getVisitorId(): Promise<string> {
  const store = await cookies();

  return store.get(VISITOR_COOKIE)?.value ?? 'anonymous';
}
