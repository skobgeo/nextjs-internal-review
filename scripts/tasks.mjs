#!/usr/bin/env node
/**
 * Печатает список заданий, найденных по маркерам вида `[S1-03]` в исходниках.
 *
 * Использование:
 *   pnpm tasks           — все задания
 *   pnpm tasks S2        — только вторая сессия
 *   pnpm tasks S1-04     — конкретное задание
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const SKIP = new Set(['node_modules', '.next', '.turbo', '.git', 'dist', 'coverage', 'data', 'scripts']);
const EXTENSIONS = /\.(ts|tsx|css|mjs)$/;
const MARKER = /\[(S[123]-(?:B?\d{1,2}))\]/g;

const SESSION_TITLES = {
  S1: 'Сессия 1 — JavaScript, алгоритмы, TypeScript, валидация',
  S2: 'Сессия 2 — HTML, CSS, адаптив, доступность, SEO',
  S3: 'Сессия 3 — Next.js App Router',
};

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;

    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      walk(full, files);
    } else if (EXTENSIONS.test(entry)) {
      files.push(full);
    }
  }

  return files;
}

const filter = (process.argv[2] ?? '').toUpperCase();
const found = new Map();

for (const file of walk(ROOT)) {
  const lines = readFileSync(file, 'utf8').split('\n');

  lines.forEach((line, index) => {
    for (const match of line.matchAll(MARKER)) {
      const id = match[1];
      if (filter && !id.startsWith(filter)) continue;

      const entry = found.get(id) ?? [];
      entry.push({ file: relative(ROOT, file), line: index + 1, text: line.trim() });
      found.set(id, entry);
    }
  });
}

if (found.size === 0) {
  console.log(filter ? `Ничего не найдено по фильтру «${filter}»` : 'Маркеры заданий не найдены');
  process.exit(0);
}

const ids = [...found.keys()].sort();
let currentSession = '';

for (const id of ids) {
  const session = id.slice(0, 2);

  if (session !== currentSession) {
    currentSession = session;
    console.log(`\n\x1b[1m${SESSION_TITLES[session] ?? session}\x1b[0m`);
  }

  const places = found.get(id);
  console.log(`\n  \x1b[36m${id}\x1b[0m`);

  for (const place of places) {
    console.log(`    ${place.file}:${place.line}`);
  }
}

console.log('\nПодробности каждого задания — в README.md\n');
