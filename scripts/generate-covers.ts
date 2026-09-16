#!/usr/bin/env node
/**
 * Генерирует обложки статей: `apps/web/public/images/articles/<slug>.jpg` (1280×720)
 * и уменьшенную копию `<slug>-640.jpg` (640×360) для нативного `srcset` (задание T-05).
 *
 * Картинки растровые намеренно — так `next/image` реально ресайзит и перекодирует их,
 * и на стенде можно посмотреть на `srcset`, `sizes` и форматы в Network.
 *
 *   node scripts/generate-covers.ts
 *
 * Запускается нативным type stripping Node 24, зависимостей не добавляет:
 * `sharp` берётся из зависимостей Next.
 */
import { createRequire } from 'node:module';
import { mkdirSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { articlesSeed, type CategorySlug } from '../apps/api/src/db/seed-data.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'apps/web/public/images/articles');

const nextDir = realpathSync(join(ROOT, 'apps/web/node_modules/next'));
const require = createRequire(join(nextDir, 'package.json'));
const sharp = require('sharp') as typeof import('sharp');

const WIDTH = 1280;
const HEIGHT = 720;
/** Ширины файлов на диске: полная и уменьшенная копия для `srcset`. */
const VARIANTS = [
  { suffix: '', width: WIDTH },
  { suffix: '-640', width: 640 },
] as const;

const PALETTE: Record<CategorySlug, { from: string; to: string; accent: string }> = {
  growth: { from: '#0f766e', to: '#14b8a6', accent: '#ccfbf1' },
  seo: { from: '#4338ca', to: '#7c3aed', accent: '#e0e7ff' },
  analytics: { from: '#b45309', to: '#f59e0b', accent: '#fef3c7' },
};

function hash(text: string): number {
  let value = 2166136261;
  for (const char of text) {
    value ^= char.charCodeAt(0);
    value = Math.imul(value, 16777619) >>> 0;
  }
  return value;
}

function shapes(seed: number, accent: string): string {
  const parts: string[] = [];
  let state = seed;
  const next = () => {
    state = (Math.imul(state, 1103515245) + 12345) >>> 0;
    return state / 0xffffffff;
  };

  for (let i = 0; i < 5; i += 1) {
    const cx = Math.round(next() * WIDTH);
    const cy = Math.round(next() * HEIGHT);
    const r = Math.round(80 + next() * 260);
    const opacity = (0.08 + next() * 0.14).toFixed(2);
    parts.push(`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${accent}" fill-opacity="${opacity}" />`);
  }

  for (let i = 0; i < 3; i += 1) {
    const x = Math.round(next() * WIDTH);
    const y = Math.round(next() * HEIGHT);
    const size = Math.round(120 + next() * 240);
    const rotate = Math.round(next() * 60 - 30);
    const opacity = (0.06 + next() * 0.1).toFixed(2);
    parts.push(
      `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${Math.round(size / 6)}" fill="${accent}" fill-opacity="${opacity}" transform="rotate(${rotate} ${x} ${y})" />`,
    );
  }

  return parts.join('\n');
}

function svgFor(slug: string, category: CategorySlug, index: number): string {
  const palette = PALETTE[category];
  const seed = hash(slug);
  const number = String(index + 1).padStart(2, '0');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${palette.from}" />
      <stop offset="1" stop-color="${palette.to}" />
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)" />
  ${shapes(seed, palette.accent)}
  <text x="64" y="${HEIGHT - 64}" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" letter-spacing="6" fill="${palette.accent}" fill-opacity="0.9">${category.toUpperCase()}</text>
  <text x="${WIDTH - 64}" y="${HEIGHT - 64}" text-anchor="end" font-family="Helvetica, Arial, sans-serif" font-size="120" font-weight="700" fill="${palette.accent}" fill-opacity="0.35">${number}</text>
</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });

let total = 0;
for (const [index, article] of articlesSeed.entries()) {
  const svg = Buffer.from(svgFor(article.slug, article.category, index));

  for (const variant of VARIANTS) {
    const name = `${article.slug}${variant.suffix}.jpg`;
    const info = await sharp(svg)
      .resize(variant.width)
      .jpeg({ quality: 72, mozjpeg: true })
      .toFile(join(OUT_DIR, name));
    total += info.size;
    console.log(`✓ ${name}  ${(info.size / 1024).toFixed(0)} KB`);
  }
}

console.log(`\nГотово: ${articlesSeed.length} обложек × ${VARIANTS.length} размера, ${(total / 1024).toFixed(0)} KB`);
