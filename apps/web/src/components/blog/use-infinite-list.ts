import { useCallback, useRef, useState } from 'react';

export interface UseInfiniteListOptions<TItem> {
  /** То, что уже отрендерил сервер. */
  readonly initialItems: readonly TItem[];
  /** Номер страницы, с которой начали (`?page=`). */
  readonly initialPage: number;
  readonly perPage: number;
  /** Сколько элементов всего подходит под текущий фильтр. */
  readonly total: number;
  /** Загрузить страницу с номером `page`. Ошибку можно бросать — хук её поймает. */
  readonly fetchPage: (page: number) => Promise<readonly TItem[]>;
}

export interface InfiniteList<TItem> {
  readonly items: readonly TItem[];
  readonly hasMore: boolean;
  readonly isLoading: boolean;
  readonly error: string | null;
  loadMore(): void;
}

/**
 * [T-03] Бесконечная прокрутка поверх постраничного API.
 *
 * Хук ничего не знает про статьи: элемент списка — параметр типа, загрузка —
 * колбэк. Первую страницу рендерит сервер и передаёт в `initialItems`,
 * следующие догружает `loadMore`. Лента статей (`article-feed.tsx`) вызывает
 * `loadMore` по кнопке и автоматически, когда пользователь доскроллил до конца.
 */
export function useInfiniteList<TItem>({
  initialItems,
  initialPage,
  perPage,
  total,
  fetchPage,
}: UseInfiniteListOptions<TItem>): InfiniteList<TItem> {
  const [items, setItems] = useState<readonly TItem[]>(initialItems);
  const [page, setPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Флаг в ref, а не в state: он нужен синхронно, чтобы второй вызов
  // за один кадр не запустил второй запрос.
  const inFlight = useRef(false);

  const hasMore = page * perPage < total;

  const loadMore = useCallback(() => {
    if (inFlight.current || !hasMore) return;

    inFlight.current = true;
    setIsLoading(true);
    setError(null);

    const nextPage = page + 1;

    fetchPage(nextPage)
      .then((next) => {
        setItems((previous) => [...previous, ...next]);
        setPage(nextPage);
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : String(cause));
      })
      .finally(() => {
        inFlight.current = false;
        setIsLoading(false);
      });
  }, [fetchPage, hasMore, page]);

  return { items, hasMore, isLoading, error, loadMore };
}
