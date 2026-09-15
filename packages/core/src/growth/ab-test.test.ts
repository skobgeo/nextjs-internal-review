import { describe, expect, it } from 'vitest';

import { assignVariant, type Variant } from './ab-test';

const variants: Variant[] = [
  { id: 'control', weight: 50 },
  { id: 'bold-cta', weight: 50 },
];

describe('assignVariant', () => {
  it('детерминирован для одного и того же посетителя', () => {
    const first = assignVariant('hero-cta', 'visitor-42', variants);
    const second = assignVariant('hero-cta', 'visitor-42', variants);

    expect(first.id).toBe(second.id);
  });

  it('разводит трафик примерно поровну', () => {
    let control = 0;

    for (let i = 0; i < 10_000; i += 1) {
      if (assignVariant('hero-cta', `visitor-${i}`, variants).id === 'control') control += 1;
    }

    expect(control).toBeGreaterThan(4_500);
    expect(control).toBeLessThan(5_500);
  });

  it('уважает веса', () => {
    const skewed: Variant[] = [
      { id: 'control', weight: 90 },
      { id: 'test', weight: 10 },
    ];

    let test = 0;
    for (let i = 0; i < 10_000; i += 1) {
      if (assignVariant('pricing', `visitor-${i}`, skewed).id === 'test') test += 1;
    }

    expect(test).toBeGreaterThan(700);
    expect(test).toBeLessThan(1_300);
  });

  it('разные эксперименты дают независимые бакеты', () => {
    const a = Array.from({ length: 200 }, (_, i) => assignVariant('exp-a', `v${i}`, variants).id);
    const b = Array.from({ length: 200 }, (_, i) => assignVariant('exp-b', `v${i}`, variants).id);

    expect(a).not.toEqual(b);
  });

  it('на пустом списке вариантов бросает RangeError', () => {
    expect(() => assignVariant('exp', 'v', [])).toThrow(RangeError);
  });
});
