import { describe, it, expect, afterAll } from 'vitest';
import { mkdirSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { linkExists, findBrokenLinks } from '../scripts/link-check.mjs';

// mkdtemp cria diretório único com 0700 (CodeQL: js/insecure-temporary-file)
const dist = mkdtempSync(join(tmpdir(), 'link-check-test-'));
mkdirSync(join(dist, 'cv'), { recursive: true });
writeFileSync(join(dist, 'cv', 'index.html'), '<html></html>');
writeFileSync(join(dist, 'sobre.html'), '<html></html>');
mkdirSync(join(dist, 'img'), { recursive: true });
writeFileSync(join(dist, 'img', 'fix.png'), 'x');
writeFileSync(join(dist, 'img.png'), 'x');

afterAll(() => rmSync(dist, { recursive: true, force: true }));

describe('linkExists', () => {
  it('arquivo .html direto existe', () => expect(linkExists('/sobre.html', dist)).toBe(true));
  it('diretório com index.html existe', () => expect(linkExists('/cv', dist)).toBe(true));
  it('rota sem arquivo resolve por fallback .html', () => expect(linkExists('/sobre', dist)).toBe(true));
  it('rota inexistente retorna false', () => expect(linkExists('/inexistente', dist)).toBe(false));
  it('href externo retorna true', () => expect(linkExists('https://github.com/TiagoR85', dist)).toBe(true));
  it('#hash é removido antes de resolver', () => expect(linkExists('/cv#contato', dist)).toBe(true));
  it('?query é removido antes de resolver', () => expect(linkExists('/sobre?ref=home', dist)).toBe(true));
  it('asset /img existente retorna true', () => expect(linkExists('/img/fix.png', dist)).toBe(true));
  it('asset /img inexistente retorna false', () => expect(linkExists('/img/inexistente.png', dist)).toBe(false));
  it('og inexistente retorna false', () => expect(linkExists('/og/faltando.png', dist)).toBe(false));
  it('foto do hero ausente retorna false (sem carve-out)', () => expect(linkExists('/img/tiao.webp', dist)).toBe(false));
});

describe('findBrokenLinks', () => {
  it('lista páginas aninhadas e ignora assets que não sejam HTML', () => {
    const { pages } = findBrokenLinks(dist);
    expect(pages.map((p: string) => p.replace(dist, '').replace(/\\/g, '/')).sort()).toEqual(['/cv/index.html', '/sobre.html']);
  });
  it('aponta href e src internos quebrados e aceita os que existem', () => {
    const root = mkdtempSync(join(tmpdir(), 'link-scan-'));
    mkdirSync(join(root, 'sub'), { recursive: true });
    mkdirSync(join(root, 'img'), { recursive: true });
    writeFileSync(join(root, 'img', 'fix.png'), 'x');
    writeFileSync(join(root, 'sub', 'page.html'), '<a href="/img/fix.png">ok</a><img src="/img/nada.png"><a href="https://x.dev">ext</a>');
    writeFileSync(join(root, 'index.html'), '<a href="/sub">ok</a>');
    const { errors } = findBrokenLinks(root);
    rmSync(root, { recursive: true, force: true });
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('/img/nada.png');
  });
});
