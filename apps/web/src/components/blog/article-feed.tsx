'use client';

import { describeFailure } from '@repo/contracts';
import { Button } from '@repo/ui';

import { fetchArticlesPage } from '@/lib/api/articles-client';
import type { ArticleListItem } from '@/lib/api/schemas';
import { ArticleCard } from './article-card';
import styles from './article-feed.module.css';
import { useInfiniteList } from './use-infinite-list';

export interface ArticleFeedProps {
  readonly query: string;
  readonly initialItems: readonly ArticleListItem[];
  readonly total: number;
  readonly page: number;
  readonly perPage: number;
}

/**
 * Лента статей: первая страница приходит с сервера (и попадает в HTML),
 * следующие догружаются из браузера через `useInfiniteList` (задание T-03).
 *
 * [T-07] Посмотрите на разметку списка и на уровни заголовков в карточках.
 */
export function ArticleFeed({ query, initialItems, total, page, perPage }: ArticleFeedProps) {
  const list = useInfiniteList({
    initialItems,
    initialPage: page,
    perPage,
    total,
    fetchPage: async (nextPage: number) => {
      const result = await fetchArticlesPage({ page: nextPage, perPage, query });
      if (!result.ok) throw new Error(describeFailure(result.error));

      return result.data.items;
    },
  });

  if (list.items.length === 0) {
    return <p className={styles.empty}>No articles match this search.</p>;
  }

  return (
    <>
      <div className={styles.grid}>
        {list.items.map((article: ArticleListItem) => (
          <div key={article.slug} className={styles.item}>
            <ArticleCard article={article} />
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        {list.error ? <p className={styles.error}>Could not load more articles.</p> : null}

        {list.hasMore ? (
          <Button variant="secondary" onClick={list.loadMore} disabled={list.isLoading}>
            {list.isLoading ? 'Loading more articles…' : 'Show more articles'}
          </Button>
        ) : (
          <p className={styles.end}>You have reached the end.</p>
        )}
      </div>
    </>
  );
}
