export interface DebouncedFunction<TArgs extends unknown[], TThis = unknown> {
  (this: TThis, ...args: TArgs): void;
  /** Отменяет отложенный вызов. После неё функция не должна выстрелить. */
  cancel(): void;
  /** Немедленно выполняет отложенный вызов, если он есть. */
  flush(): void;
  /** Есть ли запланированный вызов прямо сейчас. */
  pending(): boolean;
}

/**
 * [T-02] Классический trailing-debounce: вызывает `fn` через `waitMs` после
 * ПОСЛЕДНЕГО обращения. Им пользуется поиск в блоге (`components/blog/search-box.tsx`).
 *
 * Реализация ниже написана «на глаз» и содержит ТРИ дефекта. Тесты
 * (`pnpm test:core`) показывают симптомы; найдите причины и почините,
 * не меняя публичный API.
 */
export function debounce<TArgs extends unknown[], TThis = unknown>(
  fn: (this: TThis, ...args: TArgs) => void,
  waitMs: number,
): DebouncedFunction<TArgs, TThis> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingArgs: TArgs | null = null;
  const invoke = fn as (...args: TArgs) => void;

  const debounced = function (this: TThis, ...args: TArgs): void {
    if (pendingArgs === null) {
      pendingArgs = args;
    }

    if (timer !== null) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = null;
      const callArgs = pendingArgs ?? ([] as unknown as TArgs);
      pendingArgs = null;
      invoke(...callArgs);
    }, waitMs);
  } as DebouncedFunction<TArgs, TThis>;

  debounced.cancel = () => {
    timer = null;
    pendingArgs = null;
  };

  debounced.flush = () => {
    if (timer === null) return;

    clearTimeout(timer);
    timer = null;
    const callArgs = pendingArgs ?? ([] as unknown as TArgs);
    pendingArgs = null;
    invoke(...callArgs);
  };

  debounced.pending = () => timer !== null;

  return debounced;
}
