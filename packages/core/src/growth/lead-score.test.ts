import { describe, expect, it } from 'vitest';

import { scoreLead } from './lead-score';

const longMessage = 'Мы ищем аналитику для команды роста. '.repeat(8); // > 200 символов
// длина между 80 и 200 символами
const mediumMessage =
  'Интересует внедрение и стоимость лицензии на команду из 20 человек, нужна интеграция с CRM.';

describe('[S1-B2] scoreLead', () => {
  it('высоко оценивает корпоративную заявку с бюджетом', () => {
    const result = scoreLead({
      email: 'cto@acme-corp.com',
      company: 'Acme Corp',
      message: longMessage,
      budget: 'gt50k',
      utm: { medium: 'cpc', source: 'google' },
      pagePath: '/pricing',
    });

    expect(result.score).toBe(95);
    expect(result.grade).toBe('hot');
    expect(result.reasons).toEqual([
      'corporate-email',
      'has-company',
      'long-message',
      'budget-gt50k',
      'paid-traffic',
      'pricing-intent',
    ]);
  });

  it('не начисляет ничего пустой заявке с бесплатной почты', () => {
    const result = scoreLead({
      email: 'someone@gmail.com',
      message: 'Привет',
      budget: 'unknown',
    });

    expect(result.score).toBe(0);
    expect(result.grade).toBe('cold');
    expect(result.reasons).toEqual([]);
  });

  it('считает средние сигналы', () => {
    const result = scoreLead({
      email: 'ivan@yandex.ru',
      company: 'ИП Иванов',
      message: mediumMessage,
      budget: 'lt10k',
    });

    expect(result.score).toBe(20);
    expect(result.grade).toBe('cold');
    expect(result.reasons).toEqual(['has-company', 'medium-message', 'budget-lt10k']);
  });

  it('штрафует сообщение со ссылкой', () => {
    const result = scoreLead({
      email: 'sales@enterprise.io',
      message: `${mediumMessage} https://spam.example/promo`,
      budget: '10k-50k',
    });

    expect(result.score).toBe(30);
    expect(result.grade).toBe('warm');
    expect(result.reasons).toEqual([
      'corporate-email',
      'medium-message',
      'budget-10k-50k',
      'contains-link',
    ]);
  });

  it('не уходит ниже нуля', () => {
    const result = scoreLead({
      email: 'bot@mail.ru',
      message: 'http://spam.example',
      budget: 'unknown',
    });

    expect(result.score).toBe(0);
    expect(result.grade).toBe('cold');
    expect(result.reasons).toEqual(['contains-link']);
  });

  it('домен почты сравнивается без учёта регистра', () => {
    const result = scoreLead({
      email: 'Someone@GMAIL.com',
      message: 'Привет',
      budget: 'unknown',
    });

    expect(result.reasons).not.toContain('corporate-email');
  });
});
