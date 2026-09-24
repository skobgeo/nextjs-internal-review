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
 * ПОСЛЕДНЕГО обращения, с аргументами и `this` последнего вызова.
 * Им пользуется поиск в блоге (`components/blog/search-box.tsx`).
 *
 * Сама функция, `flush()` и `pending()` готовы и покрыты тестами.
 * Не дописан `cancel()` — один тест `debounce` красный.
 *
 * Разобраться по ходу: что делает `fn.apply(this, args)` и почему здесь
 * нельзя написать просто `fn(...args)`; зачем `this` описан в типах
 * (`this: TThis`) и что было бы с обычной `function` вместо стрелки.
 */
export function debounce<TArgs extends unknown[], TThis = unknown>(
  fn: (this: TThis, ...args: TArgs) => void,
  waitMs: number,
): DebouncedFunction<TArgs, TThis> {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pendingCall: (() => void) | null = null;

  const runPending = () => {
    const call = pendingCall;
    pendingCall = null;
    call?.();
  };

  const debounced = function (this: TThis, ...args: TArgs): void {
    // Каждый вызов перезаписывает и аргументы, и контекст — стреляет последний.
    pendingCall = () => fn.apply(this, args);

    if (timer !== null) clearTimeout(timer);

    timer = setTimeout(() => {
      timer = null;
      runPending();
    }, waitMs);
  } as DebouncedFunction<TArgs, TThis>;

  debounced.cancel = () => {
    // [T-02] Написать: после cancel() отложенный вызов не выстреливает,
    // а pending() возвращает false.
  };

  debounced.flush = () => {
    if (timer === null) return;

    clearTimeout(timer);
    timer = null;
    runPending();
  };

  debounced.pending = () => timer !== null;

  return debounced;
}
