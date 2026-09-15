export interface ArticleLike {
  readonly id: number;
  readonly slug: string;
  readonly categoryId: string;
}

export interface CategoryLike {
  readonly id: string;
  readonly title: string;
}

export interface ArticleWithCategory extends ArticleLike {
  readonly categoryTitle: string;
}

/**
 * [S1-01] Сгруппировать элементы по ключу.
 *
 * Требования:
 *  - один проход по коллекции (O(n));
 *  - принимает любой iterable, а не только массив;
 *  - ключ может быть string | number | symbol, порядок элементов внутри группы сохраняется;
 *  - пустой вход — пустой объект.
 */
export function groupBy<T, K extends PropertyKey>(
  _items: Iterable<T>,
  _getKey: (item: T, index: number) => K,
): Record<K, T[]> {
  return {} as Record<K, T[]>;
}

/**
 * [S1-01] То же самое, но на ключ приходится ровно один элемент.
 * При коллизии побеждает последний.
 */
export function indexBy<T, K extends PropertyKey>(
  _items: Iterable<T>,
  _getKey: (item: T, index: number) => K,
): Record<K, T> {
  return {} as Record<K, T>;
}

/**
 * Приклеивает к каждой статье название её категории.
 *
 * Функция работает правильно, но на реальных объёмах блога она складывается.
 * Найдите причину и перепишите — тест `не деградирует на больших объёмах` должен
 * проходить с запасом.
 */
export function buildArticleIndex(
  articles: readonly ArticleLike[],
  categories: readonly CategoryLike[],
): ArticleWithCategory[] {
  return articles.map((article) => {
    const category = categories.find((candidate) => candidate.id === article.categoryId);

    return {
      ...article,
      categoryTitle: category?.title ?? 'Uncategorized',
    };
  });
}
