import { DEFAULT_LOCALE, type Locale } from '@repo/contracts';
import { and, eq, inArray } from 'drizzle-orm';

import { db } from '../db/client';
import { translations } from '../db/schema';

export interface ResolvedField {
  readonly value: string;
  readonly locale: Locale;
}

export interface TranslationResolver {
  /** Значение поля на запрошенной локали или на дефолтной. */
  get(entityId: string | number, field: string): ResolvedField | undefined;
  /** То же самое, но сразу строкой (пустая, если перевода нет нигде). */
  value(entityId: string | number, field: string): string;
  /** Все поля сущности, уже разрешённые с учётом фолбэка. */
  fields(entityId: string | number): Record<string, string>;
  /** Пришлось ли хоть раз подставить дефолтную локаль. */
  readonly usedFallback: boolean;
  /** Реальный язык отданного контента. */
  readonly effectiveLocale: Locale;
}

/**
 * Загружает переводы одной сущности за один запрос и отдаёт резолвер с фолбэком
 * на дефолтную локаль. Так на страницу приходится ровно столько SELECT-ов,
 * сколько типов сущностей на ней, а не по одному на поле.
 */
export function createTranslationResolver(
  entity: string,
  locale: Locale,
  entityIds?: readonly (string | number)[],
): TranslationResolver {
  const locales: Locale[] = locale === DEFAULT_LOCALE ? [DEFAULT_LOCALE] : [locale, DEFAULT_LOCALE];

  const where =
    entityIds && entityIds.length > 0
      ? and(
          eq(translations.entity, entity),
          inArray(translations.locale, locales),
          inArray(
            translations.entityId,
            entityIds.map((id) => String(id)),
          ),
        )
      : and(eq(translations.entity, entity), inArray(translations.locale, locales));

  const rows = db
    .select({
      entityId: translations.entityId,
      locale: translations.locale,
      field: translations.field,
      value: translations.value,
    })
    .from(translations)
    .where(where)
    .all();

  const byKey = new Map<string, string>();
  const idsWithFields = new Map<string, Set<string>>();

  for (const row of rows) {
    byKey.set(`${row.entityId}|${row.field}|${row.locale}`, row.value);

    const fields = idsWithFields.get(row.entityId) ?? new Set<string>();
    fields.add(row.field);
    idsWithFields.set(row.entityId, fields);
  }

  let usedFallback = false;
  let usedRequested = false;

  const get = (entityId: string | number, field: string): ResolvedField | undefined => {
    const id = String(entityId);

    const exact = byKey.get(`${id}|${field}|${locale}`);
    if (exact !== undefined) {
      usedRequested = true;
      return { value: exact, locale };
    }

    const fallback = byKey.get(`${id}|${field}|${DEFAULT_LOCALE}`);
    if (fallback !== undefined) {
      usedFallback = true;
      return { value: fallback, locale: DEFAULT_LOCALE };
    }

    return undefined;
  };

  return {
    get,
    value: (entityId, field) => get(entityId, field)?.value ?? '',
    fields: (entityId) => {
      const result: Record<string, string> = {};
      for (const field of idsWithFields.get(String(entityId)) ?? []) {
        const resolved = get(entityId, field);
        if (resolved) result[field] = resolved.value;
      }
      return result;
    },
    get usedFallback() {
      return usedFallback;
    },
    get effectiveLocale() {
      return usedRequested || !usedFallback ? locale : DEFAULT_LOCALE;
    },
  };
}
