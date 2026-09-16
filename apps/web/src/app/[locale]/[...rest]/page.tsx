import { Container } from '@repo/ui';
import Link from 'next/link';

/**
 * [S3-03] Catch-all для «хвостов» старого сайта.
 *
 * Сюда попадает всё, что не подошло ни одному конкретному маршруту:
 * `/ru/posts/growth-loops`, `/ru/docs/api`, опечатки в URL.
 * Легаси-пути из `LEGACY_REDIRECTS` должны вести на новые адреса,
 * всё остальное — честно сообщать поисковику, что страницы нет.
 *
 * Откройте `/ru/posts/foo` и посмотрите, что происходит, — затем проверьте,
 * какой HTTP-статус получает ответ.
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
