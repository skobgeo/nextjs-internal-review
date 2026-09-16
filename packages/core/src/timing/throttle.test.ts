import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { throttle } from './throttle';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('[T-06] throttle', () => {
  it('первый вызов серии выполняется сразу', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('a');

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('вызовы внутри интервала схлопываются в один trailing-вызов с последними аргументами', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('a');
    vi.advanceTimersByTime(30);
    throttled('b');
    vi.advanceTimersByTime(30);
    throttled('c');

    expect(spy).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(40);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('c');
  });

  it('на длинной серии вызывает функцию не чаще одного раза в интервал', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    // 35 вызовов каждые 10 мс: t = 0, 10, …, 340
    for (let t = 0; t <= 340; t += 10) {
      throttled(t);
      vi.advanceTimersByTime(10);
    }
    // сейчас t = 350: leading на 0 + trailing на 100, 200, 300
    expect(spy).toHaveBeenCalledTimes(4);

    vi.advanceTimersByTime(50);
    // t = 400: последний вызов серии (t = 340) не потерян
    expect(spy).toHaveBeenCalledTimes(5);
    expect(spy).toHaveBeenLastCalledWith(340);
  });

  it('cancel() отменяет отложенный trailing-вызов', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('a');
    throttled('b');
    throttled.cancel();

    vi.advanceTimersByTime(500);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a');
  });

  it('после паузы длиннее интервала снова стреляет сразу', () => {
    const spy = vi.fn();
    const throttled = throttle(spy, 100);

    throttled('a');
    vi.advanceTimersByTime(250);
    throttled('b');

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenLastCalledWith('b');
  });
});
