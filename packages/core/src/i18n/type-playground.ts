import { createTranslator, type TranslationKey } from './translation-key';

/**
 * [S1-06] Площадка для проверки ТИПОВ (рантайм-тесты здесь не помогут).
 *
 * Пока `TranslationKey` возвращает `string`, все строки ниже компилируются —
 * в том числе заведомо неправильные. Когда тип будет написан верно:
 *
 *   - строки в блоке «должно компилироваться» останутся зелёными;
 *   - строки в блоке «должно ломаться» начнут подсвечиваться редактором
 *     (раскомментируйте их и покажите ошибку — это и есть приёмка задачи).
 *
 * Файл намеренно не подключён к сборке сайта.
 */
const dictionary = {
  hero: {
    title: 'Grow without guesswork',
    cta: { label: 'Book a demo' },
  },
  nav: { blog: 'Blog' },
} as const;

type Dictionary = typeof dictionary;

// Ожидаемый результат: 'hero.title' | 'hero.cta.label' | 'nav.blog'
export type Keys = TranslationKey<Dictionary>;

const { t } = createTranslator('en', dictionary);

// --- должно компилироваться ---
export const okTitle = t('hero.title');
export const okCtaLabel = t('hero.cta.label');
export const okNavBlog = t('nav.blog');

// --- должно ломаться после решения задачи (раскомментируйте) ---
// export const typoKey = t('hero.titel');
// export const objectKey = t('hero.cta');
// export const unknownNamespace = t('footer.copyright');
