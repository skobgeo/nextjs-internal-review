import { Container, Text } from '@repo/ui';

import { isLocale } from '@/i18n/config';
import { findSection, getPageContent } from '@/lib/api/content';

/**
 * [S3-03] Юридические страницы на ОПЦИОНАЛЬНОМ catch-all сегменте `[[...slug]]`.
 *
 * Такой сегмент ловит и `/ru/legal`, и `/ru/legal/privacy`, и любую вложенность.
 * Сейчас обработан ровно один случай — один сегмент:
 *  - `/ru/legal` (без слага) отдаёт пустую страницу вместо списка документов;
 *  - несуществующий документ отдаёт 200 с пустотой вместо 404;
 *  - вложенные пути (`/ru/legal/privacy/eu`) молча игнорируются.
 *
 * Задача: обработать все три случая, добавить `notFound()` и объяснить,
 * чем `[[...slug]]` отличается от `[...slug]` и от `[slug]`.
 */
export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) return null;

  const document = slug?.[0];
  const content = await getPageContent(`legal/${document}`, locale);
  const section = findSection(content, 'richtext');

  return (
    <Container>
      <article style={{ paddingBlock: 'var(--space-xl)' }}>
        <h1 style={{ fontSize: 'var(--font-size-3xl)' }}>{section?.fields.title}</h1>

        <div className="prose" style={{ paddingBlock: 'var(--space-md)' }}>
          {(section?.fields.body ?? '')
            .split('\n\n')
            .filter(Boolean)
            .map((paragraph) => (
              <Text key={paragraph.slice(0, 32)}>{paragraph}</Text>
            ))}
        </div>
      </article>
    </Container>
  );
}
