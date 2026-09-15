/**
 * [S1-04] LRU-кэш фиксированной ёмкости.
 *
 * Используется на сайте для кэша уже отрендеренных хлебных крошек и ответов
 * CMS внутри одного запроса.
 *
 * Требования:
 *  - `get` и `set` работают за O(1) — обход коллекции в них недопустим;
 *  - при переполнении вытесняется САМЫЙ ДАВНО используемый ключ;
 *  - `get` и `set` существующего ключа обновляют «свежесть», `has` — нет;
 *  - `keys()` отдаёт ключи от самого давнего к самому свежему;
 *  - ёмкость меньше 1 — `RangeError` в конструкторе.
 *
 * Подсказка: `Map` в JS сохраняет порядок вставки, и этого достаточно.
 */
export class LruCache<K, V> {
  readonly capacity: number;

  constructor(capacity: number) {
    this.capacity = capacity;
  }

  get size(): number {
    return 0;
  }

  has(_key: K): boolean {
    return false;
  }

  get(_key: K): V | undefined {
    return undefined;
  }

  set(_key: K, _value: V): this {
    return this;
  }

  delete(_key: K): boolean {
    return false;
  }

  clear(): void {
    // пусто
  }

  /** От самого давно использованного к самому свежему. */
  keys(): K[] {
    return [];
  }
}
