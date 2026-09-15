import { negotiateLocale, parseAcceptLanguage } from '@repo/contracts';
import { NextResponse, type NextRequest } from 'next/server';

import { DEFAULT_LOCALE, LOCALE_COOKIE, SUPPORTED_LOCALES, VISITOR_COOKIE, isLocale } from '@/i18n/config';

/**
 * В Next.js 16 `middleware.ts` переименован в `proxy.ts`, а экспорт называется
 * `proxy`. Здесь решается ровно одна задача: у каждого URL должна быть локаль
 * в пути (`/en/...`, `/ru/...`).
 *
 * [S3-05] Сейчас определение локали учитывает только `Accept-Language`.
 * Выбор, который посетитель сделал руками (кука `lumen_locale`), игнорируется:
 * переключил язык на русский, зашёл завтра на `/` — снова английский.
 */
function detectLocale(request: NextRequest): string {
  const preferred = parseAcceptLanguage(request.headers.get('accept-language'));

  return negotiateLocale(preferred);
}

function createVisitorId(): string {
  return crypto.randomUUID();
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split('/')[1];
  const hasLocale = Boolean(firstSegment && isLocale(firstSegment));

  const response = hasLocale
    ? NextResponse.next()
    : (() => {
        const url = request.nextUrl.clone();
        url.pathname = `/${detectLocale(request)}${pathname === '/' ? '' : pathname}`;

        return NextResponse.redirect(url);
      })();

  // Стабильный id посетителя нужен для детерминированного A/B-бакетирования:
  // сервер и клиент считают вариант от одного значения и не расходятся.
  if (!request.cookies.has(VISITOR_COOKIE)) {
    response.cookies.set(VISITOR_COOKIE, createVisitorId(), {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  if (hasLocale && firstSegment && request.cookies.get(LOCALE_COOKIE)?.value !== firstSegment) {
    response.cookies.set(LOCALE_COOKIE, firstSegment, {
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}

export const config = {
  matcher: [
    // Пропускаем внутренние маршруты Next, статику и файлы с расширением.
    '/((?!_next/|images/|favicon.ico|robots.txt|sitemap.xml|.*\\.[^/]+$).*)',
  ],
};

export { DEFAULT_LOCALE, SUPPORTED_LOCALES };
