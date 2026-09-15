import type { UtmParams } from './utm';

export const FREE_EMAIL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'mail.ru',
  'yandex.ru',
  'icloud.com',
  'proton.me',
] as const;

export type Budget = 'unknown' | 'lt10k' | '10k-50k' | 'gt50k';

export interface LeadSignals {
  readonly email: string;
  readonly company?: string;
  readonly message: string;
  readonly budget: Budget;
  readonly utm?: UtmParams;
  readonly pagePath?: string;
}

export type LeadGrade = 'cold' | 'warm' | 'hot';

export interface LeadScore {
  readonly score: number;
  readonly grade: LeadGrade;
  readonly reasons: string[];
}

/**
 * [S1-B2] Скоринг входящей заявки — то, ради чего маркетинг вообще смотрит на форму.
 *
 * Правила (применять в этом порядке, коды причин складывать в `reasons`):
 *  1. `corporate-email`  +25 — домен почты НЕ входит в `FREE_EMAIL_DOMAINS`;
 *  2. `has-company`      +10 — компания указана (непустая строка после trim);
 *  3. длина сообщения: `long-message` +15 при `length >= 200`,
 *     иначе `medium-message` +5 при `length >= 80` (взаимоисключающие);
 *  4. бюджет: `budget-gt50k` +30, `budget-10k-50k` +20, `budget-lt10k` +5,
 *     `unknown` — ничего и без причины;
 *  5. `paid-traffic`     +10 — `utm.medium` равен `cpc` или `paid`;
 *  6. `pricing-intent`   +5  — `pagePath` начинается с `/pricing`;
 *  7. `contains-link`    −20 — в сообщении есть `http://` или `https://`.
 *
 * Итог обрезается в диапазон 0..100.
 * Грейд: `hot` при score >= 60, `warm` при score >= 30, иначе `cold`.
 */
export function scoreLead(_signals: LeadSignals): LeadScore {
  return { score: 0, grade: 'cold', reasons: [] };
}
