import { db, ensureSchema, sqlite } from './client';
import {
  articlesSeed,
  categoriesSeed,
  experimentsSeed,
  navSeed,
  pagesSeed,
  uiMessages,
  type LocalizedText,
} from './seed-data';
import { articles, categories, experiments, navItems, pages, sectionItems, sections, translations } from './schema';

type TranslationRow = {
  entity: string;
  entityId: string;
  locale: string;
  field: string;
  value: string;
};

function collectTranslations(
  entity: string,
  entityId: string | number,
  fields: Readonly<Record<string, LocalizedText>>,
): TranslationRow[] {
  const rows: TranslationRow[] = [];

  for (const [field, text] of Object.entries(fields)) {
    for (const [locale, value] of Object.entries(text)) {
      if (typeof value === 'string' && value.length > 0) {
        rows.push({ entity, entityId: String(entityId), locale, field, value });
      }
    }
  }

  return rows;
}

/** { blog: { readingTime: '…' } } → { 'blog.readingTime': '…' } */
function flatten(source: Record<string, unknown>, prefix = ''): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(source)) {
    const path = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      result[path] = value;
    } else if (value && typeof value === 'object') {
      Object.assign(result, flatten(value as Record<string, unknown>, path));
    }
  }

  return result;
}

export function seed(): { seeded: boolean } {
  ensureSchema();

  const existing = sqlite.prepare('SELECT COUNT(*) as count FROM pages').get() as { count: number };
  if (existing.count > 0) {
    return { seeded: false };
  }

  const translationRows: TranslationRow[] = [];

  db.transaction((tx) => {
    // --- навигация ------------------------------------------------------------
    for (const item of navSeed) {
      tx.insert(navItems)
        .values({
          id: item.id,
          parentId: item.parentId,
          slug: item.slug,
          href: item.href,
          position: item.position,
        })
        .run();

      translationRows.push(...collectTranslations('nav_item', item.id, { title: item.title }));
    }

    // --- категории ------------------------------------------------------------
    const categoryIdBySlug = new Map<string, number>();
    for (const category of categoriesSeed) {
      const inserted = tx.insert(categories).values({ slug: category.slug }).returning({ id: categories.id }).get();
      categoryIdBySlug.set(category.slug, inserted.id);
      translationRows.push(...collectTranslations('category', inserted.id, { title: category.title }));
    }

    // --- страницы и секции ----------------------------------------------------
    for (const page of pagesSeed) {
      const insertedPage = tx
        .insert(pages)
        .values({ slug: page.slug, kind: page.kind })
        .returning({ id: pages.id })
        .get();

      page.sections.forEach((section, index) => {
        const insertedSection = tx
          .insert(sections)
          .values({
            pageId: insertedPage.id,
            kind: section.kind,
            position: index + 1,
            mediaUrl: section.mediaUrl ?? null,
            ctaHref: section.ctaHref ?? null,
          })
          .returning({ id: sections.id })
          .get();

        translationRows.push(...collectTranslations('section', insertedSection.id, section.fields));

        section.items?.forEach((item, itemIndex) => {
          const insertedItem = tx
            .insert(sectionItems)
            .values({
              sectionId: insertedSection.id,
              position: itemIndex + 1,
              icon: item.icon ?? null,
              value: item.value ?? null,
            })
            .returning({ id: sectionItems.id })
            .get();

          translationRows.push(...collectTranslations('section_item', insertedItem.id, item.fields));
        });
      });
    }

    // --- статьи ---------------------------------------------------------------
    for (const article of articlesSeed) {
      const categoryId = categoryIdBySlug.get(article.category);
      if (categoryId === undefined) continue;

      const inserted = tx
        .insert(articles)
        .values({
          slug: article.slug,
          categoryId,
          coverUrl: article.coverUrl,
          authorName: article.authorName,
          authorRole: article.authorRole,
          readingMinutes: article.readingMinutes,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
        })
        .returning({ id: articles.id })
        .get();

      translationRows.push(
        ...collectTranslations('article', inserted.id, {
          title: article.title,
          excerpt: article.excerpt,
          body: article.body,
        }),
      );
    }

    // --- эксперименты ---------------------------------------------------------
    for (const experiment of experimentsSeed) {
      tx.insert(experiments)
        .values({
          key: experiment.key,
          enabled: experiment.enabled,
          variants: JSON.stringify(experiment.variants),
        })
        .run();
    }

    // --- словарь интерфейса ---------------------------------------------------
    for (const [locale, messages] of Object.entries(uiMessages)) {
      for (const [field, value] of Object.entries(flatten(messages as Record<string, unknown>))) {
        translationRows.push({ entity: 'ui', entityId: 'messages', locale, field, value });
      }
    }

    for (const row of translationRows) {
      tx.insert(translations).values(row).onConflictDoNothing().run();
    }
  });

  return { seeded: true };
}

const isDirectRun = process.argv[1]?.includes('seed');

if (isDirectRun) {
  const result = seed();
  console.log(result.seeded ? '✅ База засеяна демо-контентом' : 'ℹ️  База уже содержит данные, сид пропущен');
  sqlite.close();
}
