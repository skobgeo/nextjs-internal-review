import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from './debounce';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('[S1-03] debounce', () => {
  it('вызывает функцию один раз после паузы', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced();
    debounced();
    debounced();

    expect(spy).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('передаёт аргументы ПОСЛЕДНЕГО вызова', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced('первый');
    vi.advanceTimersByTime(50);
    debounced('второй');
    vi.advanceTimersByTime(50);
    debounced('третий');
    vi.advanceTimersByTime(100);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('третий');
  });

  it('сохраняет контекст вызова (this)', () => {
    const counter = {
      value: 0,
      bump(this: { value: number }, by: number) {
        this.value += by;
      },
    };

    const debouncedBump = debounce(counter.bump, 100);

    debouncedBump.call(counter, 5);
    vi.advanceTimersByTime(100);

    expect(counter.value).toBe(5);
  });

  it('cancel() отменяет отложенный вызов', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced('данные');
    expect(debounced.pending()).toBe(true);

    debounced.cancel();
    expect(debounced.pending()).toBe(false);

    vi.advanceTimersByTime(500);
    expect(spy).not.toHaveBeenCalled();
  });

  it('flush() выполняет отложенный вызов немедленно и ровно один раз', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced('сейчас');
    debounced.flush();

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('сейчас');

    vi.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('после срабатывания готова к новой серии вызовов', () => {
    const spy = vi.fn();
    const debounced = debounce(spy, 100);

    debounced('серия-1');
    vi.advanceTimersByTime(100);

    debounced('серия-2');
    vi.advanceTimersByTime(100);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, 'серия-1');
    expect(spy).toHaveBeenNthCalledWith(2, 'серия-2');
  });
});
