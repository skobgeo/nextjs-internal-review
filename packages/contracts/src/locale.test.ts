import { describe, expect, it } from 'vitest';

import { negotiateLocale, parseAcceptLanguage } from './locale';

describe('parseAcceptLanguage', () => {
  it('сортирует языки по q-фактору', () => {
    expect(parseAcceptLanguage('en;q=0.8,ru-RU,ru;q=0.9')).toEqual(['ru-ru', 'ru', 'en']);
  });

  it('игнорирует пустой заголовок', () => {
    expect(parseAcceptLanguage(undefined)).toEqual([]);
    expect(parseAcceptLanguage('')).toEqual([]);
  });
});

describe('negotiateLocale', () => {
  it('находит точное совпадение', () => {
    expect(negotiateLocale(['ru'])).toBe('ru');
  });

  it('сводит региональный тег к базовому языку', () => {
    expect(negotiateLocale(['ru-ru'])).toBe('ru');
  });

  it('падает в дефолтную локаль, если ничего не подошло', () => {
    expect(negotiateLocale(['de', 'fr-ca'])).toBe('en');
  });
});
