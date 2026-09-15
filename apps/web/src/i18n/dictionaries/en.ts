/**
 * Английский словарь — источник истины ДЛЯ ТИПОВ.
 *
 * Тексты для остальных локалей приходят с бэкенда (`GET /api/i18n?locale=`),
 * но набор допустимых ключей определяется вот этим объектом: `as const` +
 * `TranslationKey<typeof en>` дают автодополнение и защиту от опечаток.
 *
 * Он же используется как офлайн-фолбэк, если бэкенд недоступен.
 */
export const en = {
  common: {
    skipToContent: 'Skip to content',
    loading: 'Loading…',
    retry: 'Try again',
    readMore: 'Read more',
  },
  nav: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    language: 'Language',
    brandTagline: 'Product analytics',
    primary: 'Primary',
    breadcrumbs: 'Breadcrumbs',
  },
  blog: {
    title: 'Blog',
    subtitle: 'Notes on growth, analytics and the web platform.',
    readingTime: '{minutes} min read',
    publishedOn: 'Published {date}',
    byAuthor: 'by {author}',
    backToBlog: 'Back to the blog',
    empty: 'No articles in this category yet.',
    pagination: 'Page {page} of {total}',
    paginationNav: 'Blog pagination',
    previous: 'Previous',
    next: 'Next',
    translationMissing: 'Not translated yet',
  },
  contact: {
    title: 'Book a demo',
    description: 'Tell us about your funnel and we will bring the questions.',
    name: 'Your name',
    namePlaceholder: 'Ada Lovelace',
    email: 'Work email',
    emailPlaceholder: 'ada@company.com',
    company: 'Company',
    companyPlaceholder: 'Analytical Engines Ltd',
    budget: 'Budget',
    budgetUnknown: 'Not sure yet',
    budgetLt10k: 'Under $10k',
    budget10k50k: '$10k – $50k',
    budgetGt50k: 'Over $50k',
    message: 'What are you trying to move?',
    messagePlaceholder: 'We want to understand why trial teams stop on day three…',
    consent: 'I agree that Lumen may contact me about this request.',
    submit: 'Send request',
    submitting: 'Sending…',
    successTitle: 'Request received',
    successDescription: 'A solutions engineer replies within one business day.',
    errorTitle: 'The request was not sent',
    errorDescription: 'Check the highlighted fields and try again.',
  },
  // Ключи совпадают с сообщениями zod-схемы из @repo/contracts:
  // сервер возвращает `validation.email.invalid`, клиент переводит его сам.
  validation: {
    name: {
      min: 'Please enter at least 2 characters.',
      max: 'That name is too long.',
    },
    email: {
      invalid: 'This does not look like an email address.',
      max: 'That email is too long.',
    },
    company: {
      max: 'That company name is too long.',
    },
    message: {
      min: 'Please describe your case in at least 20 characters.',
      max: 'Please keep the message under 2000 characters.',
    },
    consent: {
      required: 'We need your consent to reply.',
    },
    website: {
      bot: 'This field must stay empty.',
    },
    unknown: 'Something is wrong with this field.',
  },
  errors: {
    title: 'Something went wrong',
    description: 'The page failed to load. This is on us.',
    notFoundTitle: 'Page not found',
    notFoundDescription: 'The page you were looking for does not exist or has moved.',
    backHome: 'Back to the homepage',
  },
  footer: {
    rights: '© {year} Lumen Analytics. All rights reserved.',
    builtWith: 'Built for the internal frontend review.',
    product: 'Product',
    resources: 'Resources',
    legal: 'Legal',
  },
} as const;

export type Dictionary = typeof en;
