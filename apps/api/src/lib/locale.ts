import {
  DEFAULT_LOCALE,
  isLocale,
  negotiateLocale,
  parseAcceptLanguage,
  type Locale,
} from '@repo/contracts';
import type { FastifyReply, FastifyRequest } from 'fastify';

export interface ResolvedLocale {
  readonly locale: Locale;
  readonly source: 'query' | 'header' | 'default';
  /** Запрошенная строка локали, даже если она не поддерживается. */
  readonly requested: string | null;
}

/**
 * Порядок разрешения локали: явный `?locale=` → `Accept-Language` → дефолт.
 *
 * Неизвестная локаль не является ошибкой: контент отдаётся на дефолтном языке,
 * а клиент узнаёт об этом из заголовка `Content-Language`.
 */
export function resolveLocale(request: FastifyRequest): ResolvedLocale {
  const queryLocale = (request.query as { locale?: string } | undefined)?.locale ?? null;

  if (queryLocale && isLocale(queryLocale)) {
    return { locale: queryLocale, source: 'query', requested: queryLocale };
  }

  const header = request.headers['accept-language'];
  const preferred = parseAcceptLanguage(Array.isArray(header) ? header[0] : header);

  if (preferred.length > 0) {
    const negotiated = negotiateLocale(preferred);
    if (!queryLocale) {
      return { locale: negotiated, source: 'header', requested: preferred[0] ?? null };
    }
  }

  return { locale: DEFAULT_LOCALE, source: 'default', requested: queryLocale };
}

/**
 * Проставляет языковые заголовки ответа.
 *
 * `Content-Language` — язык, на котором контент отдан НА САМОМ ДЕЛЕ,
 * `Vary: Accept-Language` — чтобы промежуточные кэши не смешивали языки.
 */
export function setLanguageHeaders(reply: FastifyReply, actualLocale: Locale): void {
  reply.header('Content-Language', actualLocale);
  reply.header('Vary', 'Accept-Language');
}
