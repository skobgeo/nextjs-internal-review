/**
 * Вставка структурированных данных (schema.org) в разметку.
 *
 * Помощник готов; где и какие схемы описывать — задача S2-06.
 * Кандидаты на страницу статьи: `Article` и `BreadcrumbList`.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Значение формируется на сервере из наших же данных.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
