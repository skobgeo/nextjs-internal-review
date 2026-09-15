export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

export interface UtmParams {
  readonly source?: string;
  readonly medium?: string;
  readonly campaign?: string;
  readonly content?: string;
  readonly term?: string;
}

export interface Touch {
  readonly utm: UtmParams;
  readonly landingPath: string;
  readonly referrer: string | null;
  /** ISO-строка. Время передаётся снаружи — функции остаются чистыми. */
  readonly at: string;
}

export interface Attribution {
  readonly firstTouch: Touch;
  readonly lastTouch: Touch;
  readonly visits: number;
}

type QueryInput = URLSearchParams | Readonly<Record<string, string | undefined>> | string;

function toSearchParams(input: QueryInput): URLSearchParams {
  if (input instanceof URLSearchParams) return input;
  if (typeof input === 'string') return new URLSearchParams(input.startsWith('?') ? input.slice(1) : input);

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === 'string') params.set(key, value);
  }
  return params;
}

/** Достаёт utm-метки из query-строки. Пустые значения отбрасываются. */
export function parseUtm(input: QueryInput): UtmParams {
  const params = toSearchParams(input);
  const utm: Record<string, string> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) {
      utm[key.slice('utm_'.length)] = value;
    }
  }

  return utm as UtmParams;
}

/** Есть ли в касании хоть какая-то рекламная метка. */
export function hasUtm(utm: UtmParams): boolean {
  return Object.values(utm).some((value) => typeof value === 'string' && value.length > 0);
}

/**
 * Считается ли переход «прямым»: ни utm-меток, ни внешнего реферера.
 * Внутренние переходы (реферер с того же хоста) прямыми тоже считаются.
 */
export function isDirectTouch(touch: Touch, siteHost: string): boolean {
  if (hasUtm(touch.utm)) return false;
  if (!touch.referrer) return true;

  try {
    return new URL(touch.referrer).host === siteHost;
  } catch {
    return true;
  }
}

/**
 * [S1-B1] Склеивает сохранённую атрибуцию с новым касанием.
 *
 * Правила (обычная модель first-touch + last-touch для growth-сайта):
 *  - атрибуции ещё нет → `firstTouch` и `lastTouch` равны новому касанию, `visits === 1`;
 *  - `firstTouch` не меняется НИКОГДА;
 *  - `visits` увеличивается на 1 на каждое касание;
 *  - `lastTouch` перезаписывается, только если касание НЕ прямое
 *    (иначе прямой заход затирал бы платный источник и ломал отчётность).
 */
export function resolveAttribution(
  _existing: Attribution | null,
  incoming: Touch,
  _siteHost: string,
): Attribution {
  return { firstTouch: incoming, lastTouch: incoming, visits: 1 };
}
