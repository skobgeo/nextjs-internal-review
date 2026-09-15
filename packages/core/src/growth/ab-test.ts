export interface Variant {
  readonly id: string;
  /** Доля трафика. Веса нормализуются, так что 1/1 и 50/50 — одно и то же. */
  readonly weight: number;
}

/** FNV-1a: детерминированный, быстрый, одинаковый на сервере и в браузере. */
export function hashString(value: string): number {
  let hash = 0x811c9dc5;

  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

/**
 * Стабильно раскладывает посетителя по вариантам эксперимента.
 *
 * Один и тот же `visitorId` всегда попадает в один и тот же вариант, поэтому
 * бакет можно считать и на сервере (при рендере), и на клиенте — расхождения
 * гидратации не будет.
 */
export function assignVariant<TVariant extends Variant>(
  experimentKey: string,
  visitorId: string,
  variants: readonly TVariant[],
): TVariant {
  const first = variants[0];
  if (!first) {
    throw new RangeError('assignVariant: список вариантов пуст');
  }

  const totalWeight = variants.reduce((sum, variant) => sum + Math.max(0, variant.weight), 0);
  if (totalWeight <= 0) return first;

  const bucket = (hashString(`${experimentKey}:${visitorId}`) % 10_000) / 10_000;

  let cumulative = 0;
  for (const variant of variants) {
    cumulative += Math.max(0, variant.weight) / totalWeight;
    if (bucket < cumulative) return variant;
  }

  return variants[variants.length - 1] ?? first;
}
