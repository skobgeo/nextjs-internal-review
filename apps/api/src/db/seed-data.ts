/**
 * Демонстрационный контент стенда. Продукт вымышленный: Lumen — продуктовая
 * аналитика для growth-команд, а это его блог.
 */

export type CategorySlug = 'growth' | 'seo' | 'analytics';

export interface ArticleSeed {
  readonly slug: string;
  readonly category: CategorySlug;
  readonly authorName: string;
  readonly authorRole: string;
  readonly readingMinutes: number;
  readonly publishedAt: string;
  readonly updatedAt: string;
  readonly title: string;
  readonly excerpt: string;
  readonly body: string;
}

export const categoriesSeed: readonly { slug: CategorySlug; title: string }[] = [
  { slug: 'growth', title: 'Growth' },
  { slug: 'seo', title: 'SEO' },
  { slug: 'analytics', title: 'Analytics' },
];

const AUTHORS = {
  mara: { authorName: 'Mara Ellis', authorRole: 'Head of Growth' },
  dan: { authorName: 'Dan Ozturk', authorRole: 'Technical SEO' },
  priya: { authorName: 'Priya Raman', authorRole: 'Staff Engineer' },
  tom: { authorName: 'Tom Feld', authorRole: 'Product Marketing' },
  lena: { authorName: 'Lena Voss', authorRole: 'Data Analyst' },
} as const;

/** Обложка статьи лежит в `apps/web/public/images/articles/<slug>.jpg` (см. `scripts/generate-covers.ts`). */
export function coverUrlFor(slug: string): string {
  return `/images/articles/${slug}.jpg`;
}

export const articlesSeed: readonly ArticleSeed[] = [
  // --- рост -------------------------------------------------------------------
  {
    slug: 'growth-loops-beat-funnels',
    category: 'growth',
    ...AUTHORS.mara,
    readingMinutes: 7,
    publishedAt: '2026-09-10T09:00:00.000Z',
    updatedAt: '2026-09-12T11:30:00.000Z',
    title: 'Growth loops beat funnels',
    excerpt: 'A funnel ends. A loop feeds itself. Here is how to find the loop already hiding in your product.',
    body: 'Funnels are a reporting convenience, not a model of how products grow.\n\nA loop has an output that becomes its own input: a user invites a teammate, that teammate creates content, that content brings organic traffic, which brings another user. Draw the loop first, then instrument every edge of it.\n\nThe practical test is simple: if doubling the top of your funnel does not change next quarter, you do not have a loop — you have a campaign.',
  },
  {
    slug: 'onboarding-is-a-retention-feature',
    category: 'growth',
    ...AUTHORS.mara,
    readingMinutes: 6,
    publishedAt: '2026-08-28T10:00:00.000Z',
    updatedAt: '2026-08-28T10:00:00.000Z',
    title: 'Onboarding is a retention feature',
    excerpt: 'The first session decides the thirtieth. Design onboarding as the product, not as a tour of it.',
    body: 'Most onboarding flows explain the interface. The good ones get the user to the first real outcome and skip everything else.\n\nMeasure time to first value, not completion rate of the tour. A tour completed by everyone and followed by nobody is a beautifully instrumented failure.\n\nWhen a step cannot be skipped, it had better be worth it.',
  },
  {
    slug: 'activation-metrics-that-survive-a-quarter',
    category: 'growth',
    ...AUTHORS.lena,
    readingMinutes: 8,
    publishedAt: '2026-08-14T08:30:00.000Z',
    updatedAt: '2026-08-15T09:00:00.000Z',
    title: 'Activation metrics that survive a quarter',
    excerpt: 'An activation metric is a bet on behaviour. Here is how to pick one you will not have to redefine.',
    body: 'Activation should predict retention, be reachable in the first week and be hard to fake with a marketing push.\n\nRun the correlation against six-month retention before you announce anything. If the metric moves but retention does not, you have measured a habit of your onboarding, not of your users.\n\nWrite the definition down with the SQL next to it. Definitions that live in slides drift.',
  },
  {
    slug: 'referral-programs-without-the-spam',
    category: 'growth',
    ...AUTHORS.tom,
    readingMinutes: 5,
    publishedAt: '2026-07-31T12:00:00.000Z',
    updatedAt: '2026-07-31T12:00:00.000Z',
    title: 'Referral programs without the spam',
    excerpt: 'Rewards attract the wrong invitations. Timing attracts the right ones.',
    body: 'Ask for the referral right after the user got value, not right after they signed up.\n\nReward the invitee more than the inviter: it keeps the invitation honest and the new account motivated.\n\nAnd cap it. A referral program that scales linearly with abuse is a fraud program.',
  },
  {
    slug: 'when-to-stop-an-experiment',
    category: 'growth',
    ...AUTHORS.lena,
    readingMinutes: 9,
    publishedAt: '2026-07-17T09:45:00.000Z',
    updatedAt: '2026-07-20T09:45:00.000Z',
    title: 'When to stop an experiment',
    excerpt: 'Peeking is not a sin if you decided the rules before you looked.',
    body: 'Decide the sample size, the guardrail metrics and the stop rule before the first user enters the test.\n\nStopping early on a win inflates the effect. Stopping early on a loss is fine — that is what guardrails are for.\n\nEvery experiment ends with a written decision, including the boring ones.',
  },
  {
    slug: 'free-trials-versus-freemium',
    category: 'growth',
    ...AUTHORS.tom,
    readingMinutes: 6,
    publishedAt: '2026-07-03T14:20:00.000Z',
    updatedAt: '2026-07-03T14:20:00.000Z',
    title: 'Free trials versus freemium',
    excerpt: 'One model sells urgency, the other sells habit. Pick by how long value takes to show up.',
    body: 'If a user can see the value in a week, a trial works: the deadline creates the push.\n\nIf value compounds over months, a trial expires before the habit forms and freemium is the only honest option.\n\nDo not mix them because a competitor did.',
  },
  {
    slug: 'the-pricing-page-is-a-product-surface',
    category: 'growth',
    ...AUTHORS.tom,
    readingMinutes: 5,
    publishedAt: '2026-06-19T15:20:00.000Z',
    updatedAt: '2026-06-19T15:20:00.000Z',
    title: 'The pricing page is a product surface',
    excerpt: 'It is the most edited, least tested page you own. Treat it like a feature, not like copy.',
    body: 'Pricing pages accumulate exceptions. Every deal that needed a footnote left one behind.\n\nRun the same discipline you run on the product: a hypothesis, a guardrail metric, a stop rule. And keep the page server rendered — bots that cannot read your plans cannot rank them.',
  },
  {
    slug: 'the-north-star-metric-is-a-question',
    category: 'growth',
    ...AUTHORS.mara,
    readingMinutes: 4,
    publishedAt: '2026-06-05T08:00:00.000Z',
    updatedAt: '2026-06-05T08:00:00.000Z',
    title: 'The North Star metric is a question',
    excerpt: 'A good North Star is not a number to hit. It is the question every team answers differently.',
    body: 'The metric itself matters less than the sentence behind it: what does a customer do when we are winning?\n\nOnce the sentence is shared, each team can find its own input metric and stop arguing about the dashboard.',
  },

  // --- SEO --------------------------------------------------------------------
  {
    slug: 'core-web-vitals-are-a-growth-metric',
    category: 'seo',
    ...AUTHORS.dan,
    readingMinutes: 9,
    publishedAt: '2026-05-22T08:15:00.000Z',
    updatedAt: '2026-05-22T08:15:00.000Z',
    title: 'Core Web Vitals are a growth metric',
    excerpt: 'LCP is not a developer vanity number. It is the first conversion step your visitor never sees.',
    body: 'Layout shift is a trust problem before it is a ranking problem.\n\nReserve space for every image with width and height, keep the largest contentful element out of a client component, and stop shipping fonts that swap three times before settling.\n\nMeasure the field data, not the lab score. A green Lighthouse run on your laptop says nothing about a mid-range Android on a train.',
  },
  {
    slug: 'canonical-tags-are-not-a-suggestion',
    category: 'seo',
    ...AUTHORS.dan,
    readingMinutes: 6,
    publishedAt: '2026-05-08T10:10:00.000Z',
    updatedAt: '2026-05-08T10:10:00.000Z',
    title: 'Canonical tags are not a suggestion',
    excerpt: 'Every page with a query string is a duplicate waiting to happen. Canonical is how you pick the winner.',
    body: 'Search results, pagination and tracking parameters all produce URLs that look like new pages.\n\nPoint canonical at the clean URL, keep it absolute and make sure it agrees with your sitemap and your hreflang tags. Three signals that disagree are worse than none.',
  },
  {
    slug: 'what-a-sitemap-actually-does',
    category: 'seo',
    ...AUTHORS.dan,
    readingMinutes: 5,
    publishedAt: '2026-04-24T09:00:00.000Z',
    updatedAt: '2026-04-24T09:00:00.000Z',
    title: 'What a sitemap actually does',
    excerpt: 'It does not make pages rank. It makes them get found — and tells the crawler what changed.',
    body: 'A sitemap is a hint about discovery and freshness. Fill lastModified honestly; a value that is always "now" is ignored.\n\nGenerate it from the same data the pages use. A hand-written sitemap is outdated the day after it ships.',
  },
  {
    slug: 'structured-data-for-people-who-hate-json-ld',
    category: 'seo',
    ...AUTHORS.priya,
    readingMinutes: 7,
    publishedAt: '2026-04-10T11:30:00.000Z',
    updatedAt: '2026-04-11T08:00:00.000Z',
    title: 'Structured data for people who hate JSON-LD',
    excerpt: 'Two schemas cover most blogs: Article and BreadcrumbList. Generate them from the page data and stop there.',
    body: 'Structured data is not a ranking hack; it is a way to tell the crawler which parts of the page mean what.\n\nRender it on the server from the same object that renders the article. If the headline in JSON-LD can disagree with the h1, one day it will.',
  },
  {
    slug: 'server-rendering-is-an-seo-baseline',
    category: 'seo',
    ...AUTHORS.priya,
    readingMinutes: 8,
    publishedAt: '2026-03-27T13:00:00.000Z',
    updatedAt: '2026-03-27T13:00:00.000Z',
    title: 'Server rendering is an SEO baseline',
    excerpt: 'Crawlers do execute JavaScript. They just do it later, less often and with a budget you do not control.',
    body: 'The text that matters must be in the HTML response. Everything a crawler has to wait for is a coin toss.\n\nWith server components this is the default; the trick is not to opt out of it by marking a whole page as a client component because one button needed state.',
  },
  {
    slug: 'image-optimisation-without-a-cdn-bill',
    category: 'seo',
    ...AUTHORS.dan,
    readingMinutes: 7,
    publishedAt: '2026-03-13T09:20:00.000Z',
    updatedAt: '2026-03-13T09:20:00.000Z',
    title: 'Image optimisation without a CDN bill',
    excerpt: 'Resize on demand, serve modern formats, reserve the space. The framework already does two of these for you.',
    body: 'The browser picks the source from srcset only if you tell it how wide the image will be. Without sizes it assumes full viewport and downloads the largest candidate.\n\nAbove the fold: load eagerly. Below: lazy. And always reserve the box, or the text will jump when the image arrives.',
  },
  {
    slug: 'soft-404s-and-how-to-find-them',
    category: 'seo',
    ...AUTHORS.dan,
    readingMinutes: 4,
    publishedAt: '2026-02-27T10:00:00.000Z',
    updatedAt: '2026-02-27T10:00:00.000Z',
    title: 'Soft 404s and how to find them',
    excerpt: 'A page that says "not found" with status 200 is indexed as content. Empty content.',
    body: 'Crawl your own site with a script that follows every link and records the status code. Anything that renders an error message with a 200 is a soft 404.\n\nFix the status first, the design second.',
  },
  {
    slug: 'internationalisation-is-a-routing-problem',
    category: 'seo',
    ...AUTHORS.priya,
    readingMinutes: 8,
    publishedAt: '2026-02-13T11:05:00.000Z',
    updatedAt: '2026-02-13T11:05:00.000Z',
    title: 'Internationalisation is a routing problem',
    excerpt: 'Translation files are the easy part. The URLs, the hreflang tags and the fallbacks are where sites break.',
    body: 'Give every locale its own URL. Detect once, redirect once, then never guess again.\n\nEmit hreflang for every alternate, including x-default. Point canonical at the current locale, not at the English version — that single mistake deindexes entire language trees.\n\nAnd decide what happens when a translation is missing: fall back to the default language, but say so in Content-Language so caches do not mix the two.',
  },

  // --- аналитика --------------------------------------------------------------
  {
    slug: 'server-components-and-the-data-layer',
    category: 'analytics',
    ...AUTHORS.priya,
    readingMinutes: 11,
    publishedAt: '2026-01-30T13:45:00.000Z',
    updatedAt: '2026-02-01T10:00:00.000Z',
    title: 'Server components and the data layer',
    excerpt: 'Moving fetches to the server is the easy half. Deciding what may be cached is the interesting half.',
    body: 'The question is never "server or client". The question is "who owns this data and how stale may it be".\n\nMarketing copy can be stale for an hour. A list of articles can be stale for a minute. A submitted form must never be stale at all. Write those three sentences down before you touch a cache directive.\n\nOnce the lifetimes are explicit, the component boundary usually draws itself.',
  },
  {
    slug: 'attribution-without-lying-to-yourself',
    category: 'analytics',
    ...AUTHORS.mara,
    readingMinutes: 6,
    publishedAt: '2026-01-16T07:00:00.000Z',
    updatedAt: '2026-01-16T07:00:00.000Z',
    title: 'Attribution without lying to yourself',
    excerpt: 'Last touch is not wrong. It is just answering a different question than the one you asked.',
    body: 'Keep first touch and last touch side by side and never average them into one number.\n\nA direct visit should not overwrite the paid click that started the journey — that single rule removes most of the disagreement between marketing and finance.\n\nStore raw touches. Models change; events do not.',
  },
  {
    slug: 'event-naming-that-survives-a-reorg',
    category: 'analytics',
    ...AUTHORS.lena,
    readingMinutes: 6,
    publishedAt: '2025-12-19T09:30:00.000Z',
    updatedAt: '2025-12-19T09:30:00.000Z',
    title: 'Event naming that survives a reorg',
    excerpt: 'Name events after what the user did, not after the team that shipped the button.',
    body: 'object_verb, lower snake case, past tense: report_exported, invite_sent. No team names, no screen names, no version numbers.\n\nPut the context into properties. The event name is the sentence; properties are the adjectives.',
  },
  {
    slug: 'dashboards-nobody-reads',
    category: 'analytics',
    ...AUTHORS.lena,
    readingMinutes: 5,
    publishedAt: '2025-12-05T10:00:00.000Z',
    updatedAt: '2025-12-05T10:00:00.000Z',
    title: 'Dashboards nobody reads',
    excerpt: 'A dashboard is a question with a chart attached. If the question is gone, delete the chart.',
    body: 'Every chart needs an owner and a decision it informs. Review the list quarterly and delete without ceremony.\n\nA dashboard with forty charts is a data lake with a colour scheme.',
  },
  {
    slug: 'sampling-is-not-cheating',
    category: 'analytics',
    ...AUTHORS.lena,
    readingMinutes: 7,
    publishedAt: '2025-11-21T08:45:00.000Z',
    updatedAt: '2025-11-21T08:45:00.000Z',
    title: 'Sampling is not cheating',
    excerpt: 'You do not need every event to answer most questions. You need to know which questions are the exception.',
    body: 'Funnels and retention tolerate sampling well. Revenue, billing and anything with a legal footnote do not.\n\nSample deterministically by user, never by event, or your funnels will leak steps.',
  },
  {
    slug: 'the-cohort-chart-you-actually-need',
    category: 'analytics',
    ...AUTHORS.lena,
    readingMinutes: 6,
    publishedAt: '2025-11-07T12:15:00.000Z',
    updatedAt: '2025-11-07T12:15:00.000Z',
    title: 'The cohort chart you actually need',
    excerpt: 'Triangles are pretty. Curves are readable. Plot retention curves per cohort and look for the flattening.',
    body: 'The cohort triangle answers "which week was worse". The overlaid curves answer "did the product get better".\n\nThe only shape that matters is a curve that stops falling. If none of them do, no growth spend will save you.',
  },
  {
    slug: 'consent-mode-and-the-missing-thirty-percent',
    category: 'analytics',
    ...AUTHORS.priya,
    readingMinutes: 8,
    publishedAt: '2025-10-24T09:00:00.000Z',
    updatedAt: '2025-10-24T09:00:00.000Z',
    title: 'Consent mode and the missing thirty percent',
    excerpt: 'A third of your visitors decline analytics cookies. Design your metrics so that the gap is known, not guessed.',
    body: 'Count consent decisions as events themselves. Then every rate you report can carry the denominator it was measured against.\n\nServer-side counts of page views are a legitimate baseline for the gap, as long as they never carry identity.',
  },
  {
    slug: 'debouncing-analytics-events-in-the-browser',
    category: 'analytics',
    ...AUTHORS.priya,
    readingMinutes: 5,
    publishedAt: '2025-10-10T10:30:00.000Z',
    updatedAt: '2025-10-10T10:30:00.000Z',
    title: 'Debouncing analytics events in the browser',
    excerpt: 'A search box that fires an event per keystroke is not measuring search. It is measuring typing speed.',
    body: 'Debounce for intent (the user paused), throttle for continuous signals (the user is scrolling). Mixing them up produces either a flood or a gap.\n\nAnd cancel pending timers when the component unmounts — an event that fires after navigation lands on the wrong page.',
  },
];
