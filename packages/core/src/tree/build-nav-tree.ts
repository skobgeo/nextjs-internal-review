export interface FlatNavItem {
  readonly id: string;
  readonly parentId: string | null;
  readonly slug: string;
  readonly title: string;
  readonly href: string;
  readonly position: number;
}

export interface NavNode extends FlatNavItem {
  readonly children: NavNode[];
}

/**
 * [S1-05] Собирает дерево навигации из плоского списка, который отдаёт
 * `GET /api/navigation`.
 *
 * Требования:
 *  - один проход по списку плюс сортировка, без вложенного поиска по массиву;
 *  - на каждом уровне элементы отсортированы по `position` по возрастанию;
 *  - корни — элементы с `parentId === null`;
 *  - элементы, ссылающиеся на несуществующего родителя, в дерево НЕ попадают;
 *  - входной массив не мутируется.
 */
export function buildNavTree(_items: readonly FlatNavItem[]): NavNode[] {
  return [];
}

/**
 * [S1-05] Возвращает путь от корня до узла включительно — это хлебные крошки
 * страницы (и заодно источник данных для BreadcrumbList в JSON-LD).
 *
 * Если узла нет — пустой массив.
 */
export function findBreadcrumbs(_tree: readonly NavNode[], _targetId: string): NavNode[] {
  return [];
}
