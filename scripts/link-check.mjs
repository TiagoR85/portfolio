// scripts/link-check.mjs
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export function linkExists(href, distDir) {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return true;
  const p = join(distDir, clean);
  return existsSync(p) || existsSync(join(p, 'index.html')) || existsSync(join(distDir, clean + '.html'));
}

export const DIST = 'dist';

const walk = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f); return statSync(p).isDirectory() ? walk(p) : [p];
});

// varre o dist e devolve as páginas lidas e os links internos quebrados
export function findBrokenLinks(distDir) {
  const pages = walk(distDir).filter((f) => f.endsWith('.html'));
  const errors = [];
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
      if (!linkExists(m[1], distDir)) errors.push(`${file}: link quebrado ${m[1]}`);
    }
  }
  return { pages, errors };
}

function main() {
  const { pages, errors } = findBrokenLinks(DIST);
  if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
  console.log(`link-check OK (${pages.length} páginas)`);
}

if (process.argv[1] && process.argv[1] === fileURLToPath(import.meta.url)) main();
