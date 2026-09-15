/**
 * Демонстрационный контент стенда. Продукт вымышленный: Lumen — продуктовая
 * аналитика для growth-команд.
 *
 * Английский заполнен целиком, русский — частично. Это сделано намеренно:
 * так видно, как работает фолбэк локалей и заголовок `Content-Language`.
 */

export type LocalizedText = { readonly en: string; readonly ru?: string };

export interface NavSeed {
  readonly id: string;
  readonly parentId: string | null;
  readonly slug: string;
  readonly href: string;
  readonly position: number;
  readonly title: LocalizedText;
}

export const navSeed: NavSeed[] = [
  { id: 'product', parentId: null, slug: 'product', href: '/', position: 1, title: { en: 'Product', ru: 'Продукт' } },
  { id: 'pricing', parentId: null, slug: 'pricing', href: '/pricing', position: 2, title: { en: 'Pricing', ru: 'Тарифы' } },
  { id: 'blog', parentId: null, slug: 'blog', href: '/blog', position: 3, title: { en: 'Blog', ru: 'Блог' } },
  { id: 'contact', parentId: null, slug: 'contact', href: '/contact', position: 4, title: { en: 'Contact', ru: 'Контакты' } },
  { id: 'legal', parentId: null, slug: 'legal', href: '/legal', position: 5, title: { en: 'Legal', ru: 'Документы' } },

  { id: 'blog-growth', parentId: 'blog', slug: 'growth', href: '/blog?category=growth', position: 1, title: { en: 'Growth', ru: 'Рост' } },
  { id: 'blog-seo', parentId: 'blog', slug: 'seo', href: '/blog?category=seo', position: 2, title: { en: 'SEO', ru: 'SEO' } },
  { id: 'blog-analytics', parentId: 'blog', slug: 'analytics', href: '/blog?category=analytics', position: 3, title: { en: 'Analytics', ru: 'Аналитика' } },

  { id: 'legal-privacy', parentId: 'legal', slug: 'privacy', href: '/legal/privacy', position: 1, title: { en: 'Privacy Policy', ru: 'Политика конфиденциальности' } },
  { id: 'legal-terms', parentId: 'legal', slug: 'terms', href: '/legal/terms', position: 2, title: { en: 'Terms of Service', ru: 'Условия использования' } },
  { id: 'legal-cookies', parentId: 'legal', slug: 'cookies', href: '/legal/cookies', position: 3, title: { en: 'Cookie Notice' } },
];

export interface SectionItemSeed {
  readonly icon?: string;
  readonly value?: string;
  readonly fields: Readonly<Record<string, LocalizedText>>;
}

export interface SectionSeed {
  readonly kind: 'hero' | 'metrics' | 'features' | 'cta' | 'richtext';
  readonly mediaUrl?: string;
  readonly ctaHref?: string;
  readonly fields: Readonly<Record<string, LocalizedText>>;
  readonly items?: readonly SectionItemSeed[];
}

export interface PageSeed {
  readonly slug: string;
  readonly kind: 'marketing' | 'legal';
  readonly sections: readonly SectionSeed[];
}

export const pagesSeed: PageSeed[] = [
  {
    slug: 'home',
    kind: 'marketing',
    sections: [
      {
        kind: 'hero',
        mediaUrl: '/images/hero-dashboard.svg',
        ctaHref: '/contact',
        fields: {
          eyebrow: { en: 'Product analytics for growth teams', ru: 'Продуктовая аналитика для growth-команд' },
          title: { en: 'Grow without guesswork', ru: 'Рост без догадок' },
          subtitle: {
            en: 'Lumen connects product usage, acquisition channels and revenue in one place — so your next experiment starts from evidence, not from opinion.',
            ru: 'Lumen связывает продуктовые события, каналы привлечения и выручку в одном месте — чтобы следующий эксперимент начинался с данных, а не с мнения.',
          },
          ctaLabel: { en: 'Book a demo', ru: 'Заказать демо' },
          secondaryCtaLabel: { en: 'Read the blog', ru: 'Читать блог' },
          mediaAlt: {
            en: 'Lumen dashboard showing funnel conversion by acquisition channel',
            ru: 'Дашборд Lumen с конверсией воронки по каналам привлечения',
          },
        },
      },
      {
        kind: 'metrics',
        fields: {
          title: { en: 'Teams ship faster with Lumen', ru: 'С Lumen команды двигаются быстрее' },
        },
        items: [
          { value: '38%', fields: { label: { en: 'more experiments shipped per quarter', ru: 'больше экспериментов за квартал' } } },
          { value: '2.4x', fields: { label: { en: 'faster time to insight', ru: 'быстрее время до инсайта' } } },
          { value: '120+', fields: { label: { en: 'integrations out of the box', ru: 'интеграций из коробки' } } },
        ],
      },
      {
        kind: 'features',
        fields: {
          title: { en: 'Everything a growth loop needs', ru: 'Всё, что нужно циклу роста' },
          subtitle: {
            en: 'Instrument once, then answer questions without waiting for the data team.',
            ru: 'Разметьте события один раз и получайте ответы, не дожидаясь дата-команды.',
          },
        },
        items: [
          {
            icon: 'funnel',
            fields: {
              title: { en: 'Funnels that explain themselves', ru: 'Воронки, которые объясняют себя' },
              description: {
                en: 'Every drop-off links back to the sessions behind it, so you see the cause and not just the number.',
                ru: 'За каждым падением стоят конкретные сессии — видно причину, а не только цифру.',
              },
            },
          },
          {
            icon: 'experiment',
            fields: {
              title: { en: 'Experiments with guardrails', ru: 'Эксперименты с ограничителями' },
              description: {
                en: 'Sequential testing stops a losing variant before it costs you a quarter of pipeline.',
                ru: 'Последовательное тестирование останавливает проигрышный вариант до того, как он съест квартальный пайплайн.',
              },
            },
          },
          {
            icon: 'attribution',
            fields: {
              title: { en: 'Attribution you can defend', ru: 'Атрибуция, которую не стыдно защищать' },
              description: {
                en: 'First touch, last touch and a position-based model side by side, computed from raw events.',
                ru: 'First touch, last touch и позиционная модель рядом, посчитанные по сырым событиям.',
              },
            },
          },
          {
            icon: 'privacy',
            fields: {
              title: { en: 'Consent-aware by default', ru: 'Учитывает согласие по умолчанию' },
              description: {
                en: 'Tracking respects the visitor consent state, and the audit log proves it.',
                ru: 'Трекинг уважает состояние согласия посетителя, а журнал аудита это подтверждает.',
              },
            },
          },
        ],
      },
      {
        kind: 'cta',
        ctaHref: '/contact',
        fields: {
          title: { en: 'See Lumen on your own funnel', ru: 'Посмотрите Lumen на своей воронке' },
          description: {
            en: 'Thirty minutes, your data, no slides. We will show the three questions your current stack cannot answer.',
            ru: 'Тридцать минут, ваши данные, без слайдов. Покажем три вопроса, на которые ваш текущий стек не отвечает.',
          },
          ctaLabel: { en: 'Book a demo', ru: 'Заказать демо' },
        },
      },
    ],
  },

  {
    slug: 'pricing',
    kind: 'marketing',
    sections: [
      {
        kind: 'hero',
        ctaHref: '/contact',
        fields: {
          eyebrow: { en: 'Pricing', ru: 'Тарифы' },
          title: { en: 'Pay for insight, not for seats', ru: 'Платите за инсайты, а не за места' },
          subtitle: {
            en: 'Every plan includes unlimited seats. You are billed on tracked events, so analysts, designers and founders all get access.',
            ru: 'В каждом тарифе неограниченное число пользователей. Счёт выставляется за события, поэтому доступ есть у всех — от аналитика до основателя.',
          },
          ctaLabel: { en: 'Talk to sales', ru: 'Связаться с отделом продаж' },
        },
      },
      {
        kind: 'features',
        fields: {
          title: { en: 'Three ways to start', ru: 'Три способа начать' },
        },
        items: [
          {
            icon: 'seed',
            value: '$0',
            fields: {
              title: { en: 'Starter', ru: 'Starter' },
              description: {
                en: 'Up to 100k events per month, 3 months of history, community support.',
                ru: 'До 100 тыс. событий в месяц, 3 месяца истории, поддержка сообщества.',
              },
            },
          },
          {
            icon: 'growth',
            value: '$390',
            fields: {
              title: { en: 'Growth', ru: 'Growth' },
              description: {
                en: 'Up to 2M events, experiment guardrails, attribution models, Slack support.',
                ru: 'До 2 млн событий, ограничители экспериментов, модели атрибуции, поддержка в Slack.',
              },
            },
          },
          {
            icon: 'scale',
            value: 'Custom',
            fields: {
              title: { en: 'Scale', ru: 'Scale' },
              description: {
                en: 'Data residency, SSO, audit log, dedicated solutions architect.',
                ru: 'Хранение данных в нужном регионе, SSO, журнал аудита, выделенный архитектор решений.',
              },
            },
          },
        ],
      },
    ],
  },

  {
    slug: 'contact',
    kind: 'marketing',
    sections: [
      {
        kind: 'hero',
        fields: {
          eyebrow: { en: 'Contact', ru: 'Контакты' },
          title: { en: 'Tell us what you are trying to move', ru: 'Расскажите, какую метрику двигаете' },
          subtitle: {
            en: 'A solutions engineer replies within one business day. No sequence, no drip campaign.',
            ru: 'Инженер решений отвечает в течение рабочего дня. Без цепочек писем и прогревов.',
          },
        },
      },
    ],
  },

  {
    slug: 'legal/privacy',
    kind: 'legal',
    sections: [
      {
        kind: 'richtext',
        fields: {
          title: { en: 'Privacy Policy', ru: 'Политика конфиденциальности' },
          body: {
            en: 'Lumen processes product events on behalf of its customers. We store raw events for the retention period configured in your workspace and never sell personal data to third parties.\n\nVisitors of this marketing site are tracked only after analytics consent is granted. Consent state is stored in a first-party cookie and can be withdrawn at any time.',
            ru: 'Lumen обрабатывает продуктовые события от имени клиентов. Сырые события хранятся столько, сколько настроено в вашем воркспейсе, и никогда не продаются третьим лицам.\n\nПосетители этого сайта отслеживаются только после получения согласия на аналитику. Состояние согласия хранится в собственной куке и может быть отозвано в любой момент.',
          },
        },
      },
    ],
  },

  {
    slug: 'legal/terms',
    kind: 'legal',
    sections: [
      {
        kind: 'richtext',
        fields: {
          title: { en: 'Terms of Service', ru: 'Условия использования' },
          body: {
            en: 'These terms govern access to the Lumen platform. By creating a workspace you agree to the fair-use limits described in your plan.\n\nThe service is provided as is during the trial period. Availability commitments apply to paid plans only.',
            ru: 'Эти условия регулируют доступ к платформе Lumen. Создавая воркспейс, вы соглашаетесь с лимитами честного использования, описанными в вашем тарифе.\n\nВо время пробного периода сервис предоставляется «как есть». Обязательства по доступности действуют только для платных тарифов.',
          },
        },
      },
    ],
  },

  {
    slug: 'legal/cookies',
    kind: 'legal',
    sections: [
      {
        kind: 'richtext',
        fields: {
          title: { en: 'Cookie Notice' },
          body: {
            en: 'We use a strictly necessary cookie to remember your locale and a consent cookie to remember your analytics choice. Analytics cookies are set only after consent.',
          },
        },
      },
    ],
  },
];

export interface ArticleSeed {
  readonly slug: string;
  readonly category: 'growth' | 'seo' | 'analytics';
  readonly coverUrl: string;
  readonly authorName: string;
  readonly authorRole: string;
  readonly readingMinutes: number;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly title: LocalizedText;
  readonly excerpt: LocalizedText;
  readonly body: LocalizedText;
}

export const categoriesSeed = [
  { slug: 'growth', title: { en: 'Growth', ru: 'Рост' } satisfies LocalizedText },
  { slug: 'seo', title: { en: 'SEO', ru: 'SEO' } satisfies LocalizedText },
  { slug: 'analytics', title: { en: 'Analytics', ru: 'Аналитика' } satisfies LocalizedText },
];

export const articlesSeed: ArticleSeed[] = [
  {
    slug: 'growth-loops-beat-funnels',
    category: 'growth',
    coverUrl: '/images/articles/loops.svg',
    authorName: 'Mara Ellis',
    authorRole: 'Head of Growth',
    readingMinutes: 7,
    publishedAt: '2026-08-18T09:00:00.000Z',
    updatedAt: '2026-08-20T11:30:00.000Z',
    title: { en: 'Growth loops beat funnels', ru: 'Циклы роста сильнее воронок' },
    excerpt: {
      en: 'A funnel ends. A loop feeds itself. Here is how to find the loop already hiding in your product.',
      ru: 'Воронка заканчивается, цикл питает сам себя. Как найти цикл, который уже спрятан в вашем продукте.',
    },
    body: {
      en: 'Funnels are a reporting convenience, not a model of how products grow.\n\nA loop has an output that becomes its own input: a user invites a teammate, that teammate creates content, that content brings organic traffic, which brings another user. Draw the loop first, then instrument every edge of it.\n\nThe practical test is simple: if doubling the top of your funnel does not change next quarter, you do not have a loop — you have a campaign.',
      ru: 'Воронка — это удобство отчётности, а не модель роста продукта.\n\nУ цикла выход становится его же входом: пользователь зовёт коллегу, коллега создаёт контент, контент приносит органический трафик, трафик приносит нового пользователя. Сначала нарисуйте цикл, потом разметьте каждое его ребро.\n\nПроверка простая: если удвоение верха воронки не меняет следующий квартал, у вас не цикл, а кампания.',
    },
  },
  {
    slug: 'core-web-vitals-are-a-growth-metric',
    category: 'seo',
    coverUrl: '/images/articles/vitals.svg',
    authorName: 'Dan Ozturk',
    authorRole: 'Technical SEO',
    readingMinutes: 9,
    publishedAt: '2026-07-30T08:15:00.000Z',
    updatedAt: '2026-07-30T08:15:00.000Z',
    title: { en: 'Core Web Vitals are a growth metric', ru: 'Core Web Vitals — это метрика роста' },
    excerpt: {
      en: 'LCP is not a developer vanity number. It is the first conversion step your visitor never sees.',
      ru: 'LCP — не метрика ради метрики. Это первый шаг конверсии, которого посетитель не видит.',
    },
    body: {
      en: 'Layout shift is a trust problem before it is a ranking problem.\n\nReserve space for every image with width and height, keep the largest contentful element out of a client component, and stop shipping fonts that swap three times before settling.\n\nMeasure the field data, not the lab score. A green Lighthouse run on your laptop says nothing about a mid-range Android on a train.',
      ru: 'Сдвиг layout — сначала проблема доверия и только потом проблема ранжирования.\n\nРезервируйте место под каждое изображение через width и height, держите самый крупный элемент вне клиентского компонента и перестаньте грузить шрифты, которые трижды меняются перед тем, как устояться.\n\nСмотрите на полевые данные, а не на лабораторный балл. Зелёный Lighthouse на вашем ноутбуке ничего не говорит о среднем Android в электричке.',
    },
  },
  {
    slug: 'server-components-and-the-data-layer',
    category: 'analytics',
    coverUrl: '/images/articles/rsc.svg',
    authorName: 'Priya Raman',
    authorRole: 'Staff Engineer',
    readingMinutes: 11,
    publishedAt: '2026-07-12T13:45:00.000Z',
    updatedAt: '2026-08-01T10:00:00.000Z',
    title: { en: 'Server components and the data layer', ru: 'Серверные компоненты и слой данных' },
    excerpt: {
      en: 'Moving fetches to the server is the easy half. Deciding what may be cached is the interesting half.',
      ru: 'Перенести запросы на сервер — простая половина. Решить, что можно кэшировать, — интересная.',
    },
    body: {
      en: 'The question is never "server or client". The question is "who owns this data and how stale may it be".\n\nMarketing copy can be stale for an hour. A pricing page can be stale for a minute. A submitted form must never be stale at all. Write those three sentences down before you touch a cache directive.\n\nOnce the lifetimes are explicit, the component boundary usually draws itself.',
      ru: 'Вопрос никогда не звучит как «сервер или клиент». Вопрос звучит как «чьи это данные и насколько устаревшими они могут быть».\n\nМаркетинговый текст может быть устаревшим на час. Страница тарифов — на минуту. Отправленная форма не может быть устаревшей вообще. Запишите эти три предложения до того, как тронете директиву кэша.\n\nКогда времена жизни явные, граница компонентов обычно рисуется сама.',
    },
  },
  {
    slug: 'attribution-without-lying-to-yourself',
    category: 'analytics',
    coverUrl: '/images/articles/attribution.svg',
    authorName: 'Mara Ellis',
    authorRole: 'Head of Growth',
    readingMinutes: 6,
    publishedAt: '2026-06-28T07:00:00.000Z',
    updatedAt: '2026-06-28T07:00:00.000Z',
    title: { en: 'Attribution without lying to yourself', ru: 'Атрибуция без самообмана' },
    excerpt: {
      en: 'Last touch is not wrong. It is just answering a different question than the one you asked.',
      ru: 'Last touch не ошибается. Он просто отвечает не на тот вопрос, который вы задали.',
    },
    body: {
      en: 'Keep first touch and last touch side by side and never average them into one number.\n\nA direct visit should not overwrite the paid click that started the journey — that single rule removes most of the disagreement between marketing and finance.\n\nStore raw touches. Models change; events do not.',
      ru: 'Держите first touch и last touch рядом и никогда не усредняйте их в одно число.\n\nПрямой заход не должен затирать платный клик, с которого началось путешествие, — одно это правило снимает большую часть споров между маркетингом и финансами.\n\nХраните сырые касания. Модели меняются, события — нет.',
    },
  },
  {
    slug: 'the-pricing-page-is-a-product-surface',
    category: 'growth',
    coverUrl: '/images/articles/pricing.svg',
    authorName: 'Tom Feld',
    authorRole: 'Product Marketing',
    readingMinutes: 5,
    publishedAt: '2026-06-02T15:20:00.000Z',
    updatedAt: '2026-06-02T15:20:00.000Z',
    title: { en: 'The pricing page is a product surface' },
    excerpt: {
      en: 'It is the most edited, least tested page you own. Treat it like a feature, not like copy.',
    },
    body: {
      en: 'Pricing pages accumulate exceptions. Every deal that needed a footnote left one behind.\n\nRun the same discipline you run on the product: a hypothesis, a guardrail metric, a stop rule. And keep the page server rendered — bots that cannot read your plans cannot rank them.',
    },
  },
  {
    slug: 'internationalisation-is-a-routing-problem',
    category: 'seo',
    coverUrl: '/images/articles/i18n.svg',
    authorName: 'Priya Raman',
    authorRole: 'Staff Engineer',
    readingMinutes: 8,
    publishedAt: '2026-05-14T11:05:00.000Z',
    updatedAt: '2026-05-14T11:05:00.000Z',
    title: { en: 'Internationalisation is a routing problem' },
    excerpt: {
      en: 'Translation files are the easy part. The URLs, the hreflang tags and the fallbacks are where sites break.',
    },
    body: {
      en: 'Give every locale its own URL. Detect once, redirect once, then never guess again.\n\nEmit hreflang for every alternate, including x-default. Point canonical at the current locale, not at the English version — that single mistake deindexes entire language trees.\n\nAnd decide what happens when a translation is missing: fall back to the default language, but say so in Content-Language so caches do not mix the two.',
    },
  },
];

/** Словарь интерфейса. Английский — источник истины, русский переопределяет часть ключей. */
export const uiMessages = {
  en: {
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
      translationMissing: 'This article is not translated yet — showing the English version.',
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
    validation: {
      'name.min': 'Please enter at least 2 characters.',
      'name.max': 'That name is too long.',
      'email.invalid': 'This does not look like an email address.',
      'email.max': 'That email is too long.',
      'company.max': 'That company name is too long.',
      'message.min': 'Please describe your case in at least 20 characters.',
      'message.max': 'Please keep the message under 2000 characters.',
      'consent.required': 'We need your consent to reply.',
      'website.bot': 'This field must stay empty.',
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
  },
  ru: {
    common: {
      skipToContent: 'Перейти к содержимому',
      loading: 'Загрузка…',
      retry: 'Попробовать снова',
      readMore: 'Читать дальше',
    },
    nav: {
      openMenu: 'Открыть меню',
      closeMenu: 'Закрыть меню',
      language: 'Язык',
      brandTagline: 'Продуктовая аналитика',
      primary: 'Основная',
      breadcrumbs: 'Хлебные крошки',
    },
    blog: {
      title: 'Блог',
      subtitle: 'Заметки о росте, аналитике и веб-платформе.',
      readingTime: '{minutes} мин чтения',
      publishedOn: 'Опубликовано {date}',
      byAuthor: 'автор: {author}',
      backToBlog: 'Вернуться в блог',
      empty: 'В этой категории пока нет статей.',
      pagination: 'Страница {page} из {total}',
      paginationNav: 'Пагинация блога',
      previous: 'Назад',
      next: 'Вперёд',
      translationMissing: 'Статья ещё не переведена — показана английская версия.',
    },
    contact: {
      title: 'Заказать демо',
      description: 'Расскажите про свою воронку, а вопросы мы принесём.',
      name: 'Имя',
      namePlaceholder: 'Ада Лавлейс',
      email: 'Рабочая почта',
      emailPlaceholder: 'ada@company.com',
      company: 'Компания',
      companyPlaceholder: 'ООО «Аналитические машины»',
      budget: 'Бюджет',
      budgetUnknown: 'Пока не знаю',
      budgetLt10k: 'До $10 тыс.',
      budget10k50k: '$10–50 тыс.',
      budgetGt50k: 'Больше $50 тыс.',
      message: 'Какую метрику хотите сдвинуть?',
      messagePlaceholder: 'Хотим понять, почему команды на триале останавливаются на третий день…',
      consent: 'Согласен, что Lumen может связаться со мной по этому запросу.',
      submit: 'Отправить запрос',
      submitting: 'Отправляем…',
      successTitle: 'Запрос получен',
      successDescription: 'Инженер решений ответит в течение рабочего дня.',
      errorTitle: 'Запрос не отправлен',
      errorDescription: 'Проверьте подсвеченные поля и попробуйте ещё раз.',
    },
    validation: {
      'name.min': 'Введите хотя бы 2 символа.',
      'email.invalid': 'Это не похоже на адрес почты.',
      'message.min': 'Опишите задачу хотя бы в 20 символах.',
      'consent.required': 'Без согласия мы не сможем ответить.',
    },
    errors: {
      title: 'Что-то пошло не так',
      description: 'Страница не загрузилась. Это на нашей стороне.',
      notFoundTitle: 'Страница не найдена',
      notFoundDescription: 'Такой страницы не существует или она переехала.',
      backHome: 'На главную',
    },
    footer: {
      rights: '© {year} Lumen Analytics. Все права защищены.',
      builtWith: 'Сделано для внутреннего фронтенд-ревью.',
      product: 'Продукт',
      resources: 'Материалы',
      legal: 'Документы',
    },
  },
} as const;

export const experimentsSeed = [
  {
    key: 'hero-cta',
    enabled: true,
    variants: [
      { id: 'control', weight: 50 },
      { id: 'value-first', weight: 50 },
    ],
  },
  {
    key: 'pricing-layout',
    enabled: false,
    variants: [
      { id: 'control', weight: 70 },
      { id: 'comparison-table', weight: 30 },
    ],
  },
];
