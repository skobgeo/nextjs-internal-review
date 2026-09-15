import { describe, expect, it, vi } from 'vitest';

import { mapWithConcurrency } from './map-with-concurrency';

const tick = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('[S1-02] mapWithConcurrency', () => {
  it('возвращает результаты в порядке входного массива', async () => {
    const input = [30, 10, 20, 0];

    const result = await mapWithConcurrency(input, 2, async (ms) => {
      await tick(ms);
      return ms * 2;
    });

    expect(result).toEqual([60, 20, 40, 0]);
  });

  it('никогда не превышает лимит параллельных задач', async () => {
    let running = 0;
    let peak = 0;

    await mapWithConcurrency(
      Array.from({ length: 12 }, (_, i) => i),
      3,
      async (i) => {
        running += 1;
        peak = Math.max(peak, running);
        await tick(5);
        running -= 1;
        return i;
      },
    );

    expect(peak).toBe(3);
  });

  it('обрабатывает каждый элемент ровно один раз и передаёт индекс', async () => {
    const seen: Array<[string, number]> = [];

    await mapWithConcurrency(['a', 'b', 'c'], 2, async (item, index) => {
      seen.push([item, index]);
      return item;
    });

    expect(seen).toEqual([
      ['a', 0],
      ['b', 1],
      ['c', 2],
    ]);
  });

  it('при limit >= длины ведёт себя как Promise.all', async () => {
    const result = await mapWithConcurrency([1, 2, 3], 10, async (n) => n * 10);

    expect(result).toEqual([10, 20, 30]);
  });

  it('на пустом входе не зовёт worker', async () => {
    const worker = vi.fn(async (n: number) => n);

    await expect(mapWithConcurrency([], 4, worker)).resolves.toEqual([]);
    expect(worker).not.toHaveBeenCalled();
  });

  it('падает с RangeError на некорректном лимите', async () => {
    await expect(mapWithConcurrency([1], 0, async (n) => n)).rejects.toThrow(RangeError);
    await expect(mapWithConcurrency([1], -1, async (n) => n)).rejects.toThrow(RangeError);
    await expect(mapWithConcurrency([1], Number.NaN, async (n) => n)).rejects.toThrow(RangeError);
  });

  it('реджектится первой ошибкой и не запускает задачи из хвоста очереди', async () => {
    const started: number[] = [];

    const promise = mapWithConcurrency(
      Array.from({ length: 10 }, (_, i) => i),
      2,
      async (i) => {
        started.push(i);
        await tick(5);
        if (i === 1) throw new Error('boom');
        return i;
      },
    );

    await expect(promise).rejects.toThrow('boom');
    await tick(40);

    // стартовать успели первые несколько, хвост очереди отменён
    expect(started.length).toBeLessThanOrEqual(4);
    expect(started).not.toContain(9);
  });
});
