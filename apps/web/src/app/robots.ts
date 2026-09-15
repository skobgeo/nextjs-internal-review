import type { MetadataRoute } from 'next';

/**
 * [S2-06] robots.txt.
 *
 * В этом файле две ошибки, каждая из которых в проде стоит трафика.
 * Найдите их и почините — заодно добавьте ссылку на карту сайта.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        disallow: '/',
      },
    ],
  };
}
