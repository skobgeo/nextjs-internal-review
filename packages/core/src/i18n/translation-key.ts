/** Словарь переводов: произвольная вложенность, листья — строки. */
export interface TranslationDict {
  readonly [key: string]: string | TranslationDict;
}

/**
 * [S1-06] Типобезопасный ключ перевода.
 *
 * Сейчас это просто `string`, поэтому `t('hero.titel')` с опечаткой компилируется
 * и падает уже в рантайме — на проде это «пустая» строка в хиро-секции.
 *
 * Задача: сделать `TranslationKey<TDict>` объединением всех ТОЧЕЧНЫХ путей до
 * СТРОКОВЫХ листьев словаря.
 *
 * Для словаря
 *   { hero: { title: 'A', cta: { label: 'B' } }, nav: { blog: 'C' } }
 * ожидается
 *   'hero.title' | 'hero.cta.label' | 'nav.blog'
 *
 * Путь до объекта (`'hero'`, `'hero.cta'`) валидным ключом быть НЕ должен.
 *
 * Проверять удобно в `type-playground.ts` — там лежат заготовленные примеры.
 */
export type TranslationKey<TDict extends TranslationDict> = TDict extends TranslationDict
  ? string
  : never;

export type TranslationParams = Readonly<Record<string, string | number>>;

export interface TranslatorOptions {
  /**
   * Словарь дефолтной локали. Если ключа нет в основном словаре,
   * перевод берётся отсюда.
   */
  readonly fallback?: TranslationDict;
  /** Вызывается, когда ключ не найден нигде — точка подключения аналитики. */
  readonly onMissing?: (key: string) => void;
}

export interface Translator<TDict extends TranslationDict> {
  readonly locale: string;
  t(key: TranslationKey<TDict>, params?: TranslationParams): string;
  has(key: string): boolean;
}

function resolvePath(dict: TranslationDict, key: string): string | undefined {
  let current: string | TranslationDict | undefined = dict;

  for (const segment of key.split('.')) {
    if (typeof current !== 'object' || current === null) return undefined;
    current = current[segment];
  }

  return typeof current === 'string' ? current : undefined;
}

/**
 * [S1-06] Переводчик поверх словаря.
 *
 * Базовый поиск по ключу уже работает. Не хватает двух вещей, без которых
 * сайт не переводится целиком — тесты показывают, каких именно:
 *
 *  1. интерполяция параметров: `t('blog.readingTime', { minutes: 7 })`
 *     для строки `'{minutes} мин чтения'` должна дать `'7 мин чтения'`;
 *     плейсхолдер без переданного значения остаётся в тексте как есть;
 *  2. фолбэк на словарь дефолтной локали (`options.fallback`), а `onMissing`
 *     зовётся только тогда, когда ключа нет ни там, ни там.
 */
export function createTranslator<TDict extends TranslationDict>(
  locale: string,
  dict: TDict,
  options: TranslatorOptions = {},
): Translator<TDict> {
  return {
    locale,

    has(key: string): boolean {
      return resolvePath(dict, key) !== undefined;
    },

    t(key: TranslationKey<TDict>, _params?: TranslationParams): string {
      const template = resolvePath(dict, key as string);

      if (template === undefined) {
        options.onMissing?.(key as string);
        return key as string;
      }

      return template;
    },
  };
}
