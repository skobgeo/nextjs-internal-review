'use client';

import { describeFailure } from '@repo/contracts';
import { Button } from '@repo/ui';
import { useCallback, useEffect, useRef } from 'react';

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
 * [T-03] Лента статей.
 *
 * Первая страница приходит с сервера (и попадает в HTML), следующие
 * догружаются из браузера: по кнопке «Show more articles» и автоматически,
 * когда «маячок» под списком попадает в зону видимости (`IntersectionObserver`).
 * Кнопка остаётся для клавиатуры и на случай, если observer не сработал.
 */
export function ArticleFeed({ query, initialItems, total, page, perPage }: ArticleFeedProps) {
  const fetchPage = useCallback(
    async (nextPage: number) => {
      const result = await fetchArticlesPage({ page: nextPage, perPage, query });
      if (!result.ok) throw new Error(describeFailure(result.error));

      return result.data.items;
    },
    [perPage, query],
  );

  const list = useInfiniteList<ArticleListItem>({ initialItems, initialPage: page, perPage, total, fetchPage });

  const sentinelRef = useRef<HTMLDivElement>(null);
  // Observer вызывает loadMore через ref, чтобы не переподписываться на каждый рендер.
  const loadMoreRef = useRef(list.loadMore);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !list.hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMoreRef.current();
      },
      { rootMargin: '240px 0px' },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [list.hasMore]);

  if (list.items.length === 0) {
    return <p className={styles.empty}>No articles match this search.</p>;
  }

  return (
    <>
      <ul className={styles.grid}>
        {list.items.map((article) => (
          <li key={article.slug} className={styles.item}>
            <ArticleCard article={article} />
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className={styles.sentinel} aria-hidden="true" />

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
