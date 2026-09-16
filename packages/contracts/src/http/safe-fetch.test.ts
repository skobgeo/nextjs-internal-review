import { describe, expect, it, vi } from 'vitest';
import { z } from 'zod';

import { safeFetch } from './safe-fetch';

const articleSchema = z.object({
  id: z.number().int(),
  slug: z.string(),
  published_at: z.iso.datetime(),
});

function jsonResponse(body: unknown, init?: ResponseInit): typeof fetch {
  return vi.fn(async () =>
    new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json' },
      ...init,
    }),
  ) as unknown as typeof fetch;
}

describe('safeFetch', () => {
  it('возвращает провалидированные данные при корректном ответе', async () => {
    const payload = { id: 1, slug: 'hello', published_at: '2026-01-01T00:00:00.000Z' };

    const result = await safeFetch('https://api.test/articles/1', {
      schema: articleSchema,
      fetchImpl: jsonResponse(payload),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toEqual(payload);
    }
  });

  it('отбрасывает лишние поля, которых нет в схеме', async () => {
    const result = await safeFetch('https://api.test/articles/1', {
      schema: articleSchema,
      fetchImpl: jsonResponse({
        id: 1,
        slug: 'hello',
        published_at: '2026-01-01T00:00:00.000Z',
        internal_debug_flag: true,
      }),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).not.toHaveProperty('internal_debug_flag');
    }
  });

  it('применяет трансформации схемы (snake_case → доменная модель)', async () => {
    const schema = articleSchema.transform((raw) => ({
      id: raw.id,
      slug: raw.slug,
      publishedAt: new Date(raw.published_at),
    }));

    const result = await safeFetch('https://api.test/articles/1', {
      schema,
      fetchImpl: jsonResponse({ id: 7, slug: 'x', published_at: '2026-03-04T10:00:00.000Z' }),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.publishedAt).toBeInstanceOf(Date);
      expect(result.data.publishedAt.getUTCFullYear()).toBe(2026);
    }
  });

  it('возвращает kind "schema" с путями полей, когда ответ не соответствует контракту', async () => {
    const result = await safeFetch('https://api.test/articles/1', {
      schema: articleSchema,
      // бэкенд отдал publishedAt вместо published_at и строку вместо числа
      fetchImpl: jsonResponse({ id: '1', slug: 'hello', publishedAt: '2026-01-01T00:00:00.000Z' }),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('schema');
      if (result.error.kind === 'schema') {
        const paths = result.error.issues.map((issue) => issue.path);
        expect(paths).toContain('id');
        expect(paths).toContain('published_at');
        expect(result.error.issues.every((issue) => issue.message.length > 0)).toBe(true);
      }
    }
  });

  it('возвращает kind "http" на статус вне 2xx и не бросает исключение', async () => {
    const result = await safeFetch('https://api.test/articles/404', {
      schema: articleSchema,
      fetchImpl: jsonResponse({ error: 'not_found', message: 'Article not found' }, { status: 404 }),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('http');
      if (result.error.kind === 'http') {
        expect(result.error.status).toBe(404);
      }
    }
  });

  it('возвращает kind "invalid-json", когда тело не является JSON', async () => {
    const fetchImpl = vi.fn(
      async () => new Response('<html>502 Bad Gateway</html>', { status: 200 }),
    ) as unknown as typeof fetch;

    const result = await safeFetch('https://api.test/articles/1', {
      schema: articleSchema,
      fetchImpl,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('invalid-json');
    }
  });

  it('возвращает kind "network", когда fetch отваливается', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('fetch failed');
    }) as unknown as typeof fetch;

    const result = await safeFetch('https://api.test/articles/1', {
      schema: articleSchema,
      fetchImpl,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('network');
    }
  });

  it('пробрасывает init в fetch (метод, заголовки, сигнал)', async () => {
    const fetchImpl = jsonResponse({ id: 1, slug: 's', published_at: '2026-01-01T00:00:00.000Z' });

    await safeFetch('https://api.test/articles/1', {
      schema: articleSchema,
      init: { method: 'POST', headers: { 'x-trace': 'abc' } },
      fetchImpl,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.test/articles/1',
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
