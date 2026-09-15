import { describe, expect, it } from 'vitest';

import { buildNavTree, findBreadcrumbs, type FlatNavItem } from './build-nav-tree';

const items: FlatNavItem[] = [
  { id: 'blog', parentId: null, slug: 'blog', title: 'Блог', href: '/blog', position: 2 },
  { id: 'product', parentId: null, slug: 'product', title: 'Продукт', href: '/product', position: 1 },
  {
    id: 'seo',
    parentId: 'blog',
    slug: 'seo',
    title: 'SEO',
    href: '/blog/seo',
    position: 2,
  },
  {
    id: 'growth',
    parentId: 'blog',
    slug: 'growth',
    title: 'Growth',
    href: '/blog/growth',
    position: 1,
  },
  {
    id: 'growth-loops',
    parentId: 'growth',
    slug: 'loops',
    title: 'Циклы роста',
    href: '/blog/growth/loops',
    position: 1,
  },
  {
    id: 'orphan',
    parentId: 'не-существует',
    slug: 'orphan',
    title: 'Сирота',
    href: '/orphan',
    position: 1,
  },
];

describe('[S1-05] buildNavTree', () => {
  it('собирает корни в порядке position', () => {
    const tree = buildNavTree(items);

    expect(tree.map((node) => node.id)).toEqual(['product', 'blog']);
  });

  it('вкладывает детей и сортирует их по position', () => {
    const tree = buildNavTree(items);
    const blog = tree.find((node) => node.id === 'blog');

    expect(blog?.children.map((node) => node.id)).toEqual(['growth', 'seo']);
  });

  it('поддерживает произвольную глубину', () => {
    const tree = buildNavTree(items);
    const growth = tree
      .find((node) => node.id === 'blog')
      ?.children.find((node) => node.id === 'growth');

    expect(growth?.children.map((node) => node.id)).toEqual(['growth-loops']);
  });

  it('выбрасывает узлы с несуществующим родителем', () => {
    const tree = buildNavTree(items);
    const flatIds: string[] = [];

    const walk = (nodes: readonly { id: string; children: readonly unknown[] }[]) => {
      for (const node of nodes) {
        flatIds.push(node.id);
        walk(node.children as { id: string; children: readonly unknown[] }[]);
      }
    };
    walk(tree);

    expect(flatIds).not.toContain('orphan');
  });

  it('не мутирует входной массив', () => {
    const snapshot = JSON.parse(JSON.stringify(items));
    buildNavTree(items);

    expect(JSON.parse(JSON.stringify(items))).toEqual(snapshot);
  });

  it('на пустом входе возвращает пустой массив', () => {
    expect(buildNavTree([])).toEqual([]);
  });

  it('не деградирует на больших деревьях', () => {
    const many: FlatNavItem[] = Array.from({ length: 20_000 }, (_, i) => ({
      id: `n${i}`,
      parentId: i === 0 ? null : `n${Math.floor((i - 1) / 4)}`,
      slug: `n${i}`,
      title: `Node ${i}`,
      href: `/n${i}`,
      position: i % 4,
    }));

    const startedAt = performance.now();
    const tree = buildNavTree(many);
    const elapsed = performance.now() - startedAt;

    expect(tree).toHaveLength(1);
    expect(elapsed).toBeLessThan(300);
  });
});

describe('[S1-05] findBreadcrumbs', () => {
  it('возвращает путь от корня до узла включительно', () => {
    const tree = buildNavTree(items);

    expect(findBreadcrumbs(tree, 'growth-loops').map((node) => node.id)).toEqual([
      'blog',
      'growth',
      'growth-loops',
    ]);
  });

  it('для корневого узла возвращает его самого', () => {
    const tree = buildNavTree(items);

    expect(findBreadcrumbs(tree, 'product').map((node) => node.id)).toEqual(['product']);
  });

  it('для неизвестного узла возвращает пустой массив', () => {
    const tree = buildNavTree(items);

    expect(findBreadcrumbs(tree, 'нет-такого')).toEqual([]);
  });
});
