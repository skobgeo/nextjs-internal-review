import { describe, expect, it } from 'vitest';

import { LruCache } from './lru-cache';

describe('[S1-04] LruCache', () => {
  it('хранит и отдаёт значения', () => {
    const cache = new LruCache<string, number>(3);

    cache.set('a', 1).set('b', 2);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('нет такого')).toBeUndefined();
    expect(cache.size).toBe(2);
  });

  it('вытесняет самый давно использованный ключ при переполнении', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);

    expect(cache.has('a')).toBe(false);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
    expect(cache.size).toBe(2);
  });

  it('get обновляет свежесть ключа', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.get('a'); // теперь самый свежий — 'a'
    cache.set('c', 3); // вытесняем 'b'

    expect(cache.has('a')).toBe(true);
    expect(cache.has('b')).toBe(false);
  });

  it('повторный set существующего ключа обновляет значение и свежесть, не увеличивая размер', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('a', 10);

    expect(cache.size).toBe(2);
    expect(cache.get('a')).toBe(10);

    cache.set('c', 3);
    expect(cache.has('b')).toBe(false);
    expect(cache.has('a')).toBe(true);
  });

  it('has не обновляет свежесть', () => {
    const cache = new LruCache<string, number>(2);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.has('a');
    cache.set('c', 3);

    expect(cache.has('a')).toBe(false);
  });

  it('keys() отдаёт порядок от самого давнего к самому свежему', () => {
    const cache = new LruCache<string, number>(3);

    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.get('a');

    expect(cache.keys()).toEqual(['b', 'c', 'a']);
  });

  it('delete и clear работают', () => {
    const cache = new LruCache<string, number>(3);

    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.delete('a')).toBe(true);
    expect(cache.delete('a')).toBe(false);
    expect(cache.size).toBe(1);

    cache.clear();
    expect(cache.size).toBe(0);
    expect(cache.keys()).toEqual([]);
  });

  it('бросает RangeError на некорректной ёмкости', () => {
    expect(() => new LruCache<string, number>(0)).toThrow(RangeError);
    expect(() => new LruCache<string, number>(-5)).toThrow(RangeError);
  });

  it('не деградирует на большом числе операций', () => {
    const cache = new LruCache<number, number>(1_000);

    const startedAt = performance.now();
    for (let i = 0; i < 200_000; i += 1) {
      cache.set(i, i);
      cache.get(i - 500);
    }
    const elapsed = performance.now() - startedAt;

    expect(cache.size).toBe(1_000);
    expect(elapsed).toBeLessThan(1_000);
  });
});
