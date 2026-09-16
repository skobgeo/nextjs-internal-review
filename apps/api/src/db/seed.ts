import { db, ensureSchema, sqlite } from './client';
import { articlesSeed, categoriesSeed, coverUrlFor } from './seed-data';
import { articles, categories } from './schema';

export function seed(): { seeded: boolean } {
  ensureSchema();

  const existing = sqlite.prepare('SELECT COUNT(*) as count FROM articles').get() as { count: number };
  if (existing.count > 0) {
    return { seeded: false };
  }

  db.transaction((tx) => {
    const categoryIdBySlug = new Map<string, number>();

    for (const category of categoriesSeed) {
      const inserted = tx
        .insert(categories)
        .values({ slug: category.slug, title: category.title })
        .returning({ id: categories.id })
        .get();
      categoryIdBySlug.set(category.slug, inserted.id);
    }

    for (const article of articlesSeed) {
      const categoryId = categoryIdBySlug.get(article.category);
      if (categoryId === undefined) continue;

      tx.insert(articles)
        .values({
          slug: article.slug,
          categoryId,
          title: article.title,
          excerpt: article.excerpt,
          body: article.body,
          coverUrl: coverUrlFor(article.slug),
          authorName: article.authorName,
          authorRole: article.authorRole,
          readingMinutes: article.readingMinutes,
          publishedAt: article.publishedAt,
          updatedAt: article.updatedAt,
        })
        .run();
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
