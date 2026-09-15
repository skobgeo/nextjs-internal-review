import { describe, expect, it } from 'vitest';

import { buildArticleIndex, groupBy, indexBy, type ArticleLike, type CategoryLike } from './group-by';

const posts = [
  { id: 1, tag: 'seo' },
  { id: 2, tag: 'growth' },
  { id: 3, tag: 'seo' },
];

describe('[S1-01] groupBy', () => {
  it('группирует по ключу, сохраняя порядок внутри группы', () => {
    expect(groupBy(posts, (post) => post.tag)).toEqual({
      seo: [
        { id: 1, tag: 'seo' },
        { id: 3, tag: 'seo' },
      ],
      growth: [{ id: 2, tag: 'growth' }],
    });
  });

  it('передаёт индекс в callback', () => {
    expect(groupBy(['a', 'b', 'c'], (_item, index) => (index % 2 === 0 ? 'even' : 'odd'))).toEqual({
      even: ['a', 'c'],
      odd: ['b'],
    });
  });

  it('работает с любым iterable, а не только с массивом', () => {
    const set = new Set([1, 2, 3, 4]);

    expect(groupBy(set, (n) => (n % 2 === 0 ? 'even' : 'odd'))).toEqual({
      odd: [1, 3],
      even: [2, 4],
    });
  });

  it('на пустом входе возвращает пустой объект', () => {
    expect(groupBy([], () => 'x')).toEqual({});
  });
});

describe('[S1-01] indexBy', () => {
  it('кладёт по одному элементу на ключ', () => {
    expect(indexBy(posts, (post) => post.id)).toEqual({
      1: { id: 1, tag: 'seo' },
      2: { id: 2, tag: 'growth' },
      3: { id: 3, tag: 'seo' },
    });
  });

  it('при коллизии оставляет последний элемент', () => {
    expect(indexBy(posts, (post) => post.tag)).toEqual({
      seo: { id: 3, tag: 'seo' },
      growth: { id: 2, tag: 'growth' },
    });
  });
});

describe('[S1-01] buildArticleIndex', () => {
  const categories: CategoryLike[] = [
    { id: 'seo', title: 'SEO' },
    { id: 'growth', title: 'Growth' },
  ];

  it('подставляет название категории', () => {
    const articles: ArticleLike[] = [
      { id: 1, slug: 'a', categoryId: 'seo' },
      { id: 2, slug: 'b', categoryId: 'growth' },
    ];

    expect(buildArticleIndex(articles, categories).map((a) => a.categoryTitle)).toEqual([
      'SEO',
      'Growth',
    ]);
  });

  it('подставляет заглушку для неизвестной категории', () => {
    const articles: ArticleLike[] = [{ id: 1, slug: 'a', categoryId: 'missing' }];

    expect(buildArticleIndex(articles, categories)[0]?.categoryTitle).toBe('Uncategorized');
  });

  it('не деградирует на больших объёмах', () => {
    const bigCategories: CategoryLike[] = Array.from({ length: 3_000 }, (_, i) => ({
      id: `c${i}`,
      title: `Category ${i}`,
    }));

    const bigArticles: ArticleLike[] = Array.from({ length: 60_000 }, (_, i) => ({
      id: i,
      slug: `article-${i}`,
      // худший случай: категория в самом конце списка
      categoryId: `c${2_999 - (i % 50)}`,
    }));

    const startedAt = performance.now();
    const result = buildArticleIndex(bigArticles, bigCategories);
    const elapsed = performance.now() - startedAt;

    expect(result).toHaveLength(60_000);
    expect(elapsed).toBeLessThan(200);
  });
});
