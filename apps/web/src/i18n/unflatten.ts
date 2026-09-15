/**
 * Бэкенд отдаёт словарь плоскими ключами (`blog.readingTime`), а `createTranslator`
 * работает с вложенным объектом. Здесь — разворачивание одного в другое.
 *
 * Ключи, у которых часть пути конфликтует с уже существующей строкой,
 * игнорируются: словарь не должен падать из-за одной кривой записи в CMS.
 */
export function unflatten(flat: Readonly<Record<string, string>>): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [path, value] of Object.entries(flat)) {
    const segments = path.split('.');
    let node: Record<string, unknown> = result;
    let skip = false;

    for (let i = 0; i < segments.length - 1; i += 1) {
      const segment = segments[i];
      if (!segment) continue;

      const next = node[segment];

      if (next === undefined) {
        const created: Record<string, unknown> = {};
        node[segment] = created;
        node = created;
      } else if (typeof next === 'object' && next !== null) {
        node = next as Record<string, unknown>;
      } else {
        skip = true;
        break;
      }
    }

    const leaf = segments[segments.length - 1];
    if (!skip && leaf && typeof node[leaf] !== 'object') {
      node[leaf] = value;
    }
  }

  return result;
}
