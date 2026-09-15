import { Container } from '@repo/ui';
import Link from 'next/link';

/**
 * [S3-03] Catch-all для «хвостов» старого сайта.
 *
 * Сюда попадает всё, что не подошло ни одному конкретному маршруту:
 * `/ru/posts/growth-loops`, `/ru/docs/api`, опечатки в URL.
 *
 * Здесь ДВЕ проблемы:
 *  1. страница падает на любом запросе (откройте `/ru/что-угодно`);
 *     причина — в том, как читаются `params`, и она типовая для Next 15+;
 *  2. даже когда упадёт не сразу — любой несуществующий URL отдаёт 500,
 *     хотя должен отдавать 404 либо 301 на новый адрес.
 *
 * Задача: починить чтение параметров, сделать карту редиректов для
 * легаси-путей (`/posts/:slug` → `/blog/:slug`) через `redirect()`,
 * а для всего остального вызвать `notFound()`.
 */
const LEGACY_REDIRECTS: Record<string, string> = {
  posts: 'blog',
  articles: 'blog',
  plans: 'pricing',
};

export default function LegacyCatchAllPage({
  params,
}: {
  params: Promise<{ locale: string; rest: string[] }>;
}) {
  const { locale, rest } = params as unknown as { locale: string; rest: string[] };

  const [first, ...tail] = rest;
  const target = first ? LEGACY_REDIRECTS[first] : undefined;

  return (
    <Container>
      <div className="centered">
        <h1 className="pageTitle">404</h1>
        <p className="pageSubtitle">
          {target
            ? `Эта страница переехала: /${locale}/${target}/${tail.join('/')}`
            : `Ничего не найдено по адресу /${locale}/${rest.join('/')}`}
        </p>
        <Link href={`/${locale}`}>← Lumen</Link>
      </div>
    </Container>
  );
}
