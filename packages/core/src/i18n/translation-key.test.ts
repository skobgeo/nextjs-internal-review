import { describe, expect, it, vi } from 'vitest';

import { createTranslator, type TranslationDict, type TranslationParams } from './translation-key';

/**
 * Словарь локали может быть беднее фолбэка, поэтому ключи фолбэка не входят
 * в TranslationKey основного словаря. Для таких проверок берём нестрогую
 * сигнатуру t() — ровно так же приложение типизирует переводчик по
 * эталонному (английскому) словарю.
 */
type LooseT = (key: string, params?: TranslationParams) => string;

function looseTranslator(dict: TranslationDict, fallback: TranslationDict, onMissing?: (key: string) => void): LooseT {
  return createTranslator('ru', dict, { fallback, onMissing }).t as LooseT;
}

const en = {
  hero: {
    title: 'Grow without guesswork',
    cta: { label: 'Book a demo' },
  },
  blog: {
    readingTime: '{minutes} min read',
    byAuthor: 'by {author} · {date}',
  },
  nav: { blog: 'Blog' },
} as const;

const ru = {
  hero: {
    title: 'Рост без догадок',
    cta: { label: 'Заказать демо' },
  },
  blog: {
    readingTime: '{minutes} мин чтения',
  },
  nav: { blog: 'Блог' },
} as const;

describe('[S1-06] createTranslator', () => {
  it('достаёт перевод по точечному ключу', () => {
    const { t } = createTranslator('en', en);

    expect(t('hero.title')).toBe('Grow without guesswork');
    expect(t('hero.cta.label')).toBe('Book a demo');
  });

  it('подставляет параметры в плейсхолдеры', () => {
    const { t } = createTranslator('ru', ru);

    expect(t('blog.readingTime', { minutes: 7 })).toBe('7 мин чтения');
  });

  it('подставляет несколько параметров и не трогает лишние плейсхолдеры', () => {
    const { t } = createTranslator('en', en);

    expect(t('blog.byAuthor', { author: 'Аня' })).toBe('by Аня · {date}');
  });

  it('падает в фолбэк-словарь, если ключа нет в основном', () => {
    const t = looseTranslator(ru, en);

    expect(t('blog.byAuthor', { author: 'Аня', date: '2026-01-01' })).toBe('by Аня · 2026-01-01');
  });

  it('возвращает сам ключ и зовёт onMissing, когда перевода нет нигде', () => {
    const onMissing = vi.fn();
    const t = looseTranslator(ru, en, onMissing);

    expect(t('нет.такого.ключа')).toBe('нет.такого.ключа');
    expect(onMissing).toHaveBeenCalledWith('нет.такого.ключа');
  });

  it('не зовёт onMissing, когда ключ нашёлся в фолбэке', () => {
    const onMissing = vi.fn();
    const t = looseTranslator(ru, en, onMissing);

    t('blog.byAuthor', { author: 'A', date: 'B' });

    expect(onMissing).not.toHaveBeenCalled();
  });

  it('путь до объекта считается отсутствующим переводом', () => {
    const { t, has } = createTranslator('en', en);

    expect(has('hero.cta')).toBe(false);
    expect(t('hero.cta' as never)).toBe('hero.cta');
  });
});
