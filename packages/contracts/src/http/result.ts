/**
 * Размеченное объединение для операций, которые могут провалиться.
 * Ничего не бросает — вызывающий обязан разобрать оба варианта.
 */
export type Result<T, E> = { readonly ok: true; readonly data: T } | { readonly ok: false; readonly error: E };

export function ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

export function err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; data: T } {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}

/** Возвращает данные или подставляет фолбэк — удобно для необязательных секций страницы. */
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
  return result.ok ? result.data : fallback;
}

/** Описание того, почему запрос не дал валидных данных. */
export type FetchFailure =
  | { readonly kind: 'network'; readonly message: string; readonly cause?: unknown }
  | { readonly kind: 'http'; readonly status: number; readonly message: string; readonly body?: unknown }
  | { readonly kind: 'invalid-json'; readonly message: string }
  | {
      readonly kind: 'schema';
      readonly message: string;
      readonly issues: readonly { readonly path: string; readonly message: string }[];
    };

export function describeFailure(failure: FetchFailure): string {
  switch (failure.kind) {
    case 'network':
      return `Сеть недоступна: ${failure.message}`;
    case 'http':
      return `HTTP ${failure.status}: ${failure.message}`;
    case 'invalid-json':
      return `Ответ не является корректным JSON: ${failure.message}`;
    case 'schema':
      return `Ответ не соответствует схеме: ${failure.issues
        .map((issue) => `${issue.path || '<root>'} — ${issue.message}`)
        .join('; ')}`;
  }
}
