import { describe, expect, it } from 'vitest';

import { parseUtm, resolveAttribution, type Attribution, type Touch } from './utm';

const SITE_HOST = 'lumen.example';

const paidTouch: Touch = {
  utm: { source: 'google', medium: 'cpc', campaign: 'brand' },
  landingPath: '/pricing',
  referrer: 'https://www.google.com/',
  at: '2026-01-01T10:00:00.000Z',
};

const directTouch: Touch = {
  utm: {},
  landingPath: '/',
  referrer: null,
  at: '2026-01-05T10:00:00.000Z',
};

const organicTouch: Touch = {
  utm: {},
  landingPath: '/blog/seo',
  referrer: 'https://duckduckgo.com/',
  at: '2026-01-07T10:00:00.000Z',
};

describe('parseUtm', () => {
  it('разбирает query-строку', () => {
    expect(parseUtm('?utm_source=google&utm_medium=cpc&utm_campaign=brand')).toEqual({
      source: 'google',
      medium: 'cpc',
      campaign: 'brand',
    });
  });

  it('игнорирует пустые метки и посторонние параметры', () => {
    expect(parseUtm('utm_source=&page=2&utm_medium=email')).toEqual({ medium: 'email' });
  });
});

describe('[S1-B1] resolveAttribution', () => {
  it('первое касание становится и first, и last', () => {
    const result = resolveAttribution(null, paidTouch, SITE_HOST);

    expect(result.firstTouch).toEqual(paidTouch);
    expect(result.lastTouch).toEqual(paidTouch);
    expect(result.visits).toBe(1);
  });

  it('никогда не перезаписывает firstTouch', () => {
    const existing: Attribution = { firstTouch: paidTouch, lastTouch: paidTouch, visits: 1 };

    const result = resolveAttribution(existing, organicTouch, SITE_HOST);

    expect(result.firstTouch).toEqual(paidTouch);
  });

  it('обновляет lastTouch на непрямом касании', () => {
    const existing: Attribution = { firstTouch: paidTouch, lastTouch: paidTouch, visits: 1 };

    const result = resolveAttribution(existing, organicTouch, SITE_HOST);

    expect(result.lastTouch).toEqual(organicTouch);
    expect(result.visits).toBe(2);
  });

  it('прямой заход не затирает lastTouch, но считается визитом', () => {
    const existing: Attribution = { firstTouch: paidTouch, lastTouch: paidTouch, visits: 3 };

    const result = resolveAttribution(existing, directTouch, SITE_HOST);

    expect(result.lastTouch).toEqual(paidTouch);
    expect(result.visits).toBe(4);
  });

  it('переход с собственного домена считается прямым', () => {
    const internal: Touch = {
      utm: {},
      landingPath: '/contact',
      referrer: `https://${SITE_HOST}/blog/seo`,
      at: '2026-01-09T10:00:00.000Z',
    };
    const existing: Attribution = { firstTouch: paidTouch, lastTouch: organicTouch, visits: 2 };

    const result = resolveAttribution(existing, internal, SITE_HOST);

    expect(result.lastTouch).toEqual(organicTouch);
    expect(result.visits).toBe(3);
  });

  it('прямой заход с utm-меткой прямым не считается', () => {
    const existing: Attribution = { firstTouch: paidTouch, lastTouch: paidTouch, visits: 1 };
    const emailTouch: Touch = {
      utm: { source: 'newsletter', medium: 'email' },
      landingPath: '/',
      referrer: null,
      at: '2026-02-01T10:00:00.000Z',
    };

    const result = resolveAttribution(existing, emailTouch, SITE_HOST);

    expect(result.lastTouch).toEqual(emailTouch);
  });
});
