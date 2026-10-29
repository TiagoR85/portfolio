import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const DIST = 'dist';
const ASTRO = '_astro';
const errors = [];
const html = (p) => { const f = join(DIST, p); return existsSync(f) ? readFileSync(f, 'utf8') : null; };

const index = html('index.html');
if (!index) errors.push('dist/index.html não existe');
else {
  if (!index.includes('lang="pt-BR"')) errors.push('index.html sem lang="pt-BR"');
  if (!index.includes('<title>')) errors.push('index.html sem <title>');
  if (!index.includes('rel="canonical"')) errors.push('index.html sem canonical');
  if (!index.includes('hero-heading')) errors.push('home sem h1 .hero-heading');
  if (!index.includes('id="contato"')) errors.push('home sem seção contato');
  for (const s of ['APIs e back-end sob medida', 'DevOps e CI/CD']) {
    if (!index.includes(s)) errors.push(`serviços sem "${s}"`);
  }
  for (const anchor of ['/#servicos', '/#projetos', '/#sobre', '/#contato', '/cv']) {
    if (!index.includes(`href="${anchor}"`)) errors.push(`home sem link de navegação ${anchor}`);
  }
  for (const slug of ['jobforge', 'logpipe', 'einvoice', 'devops', 'soap-grpc-bridge', 'vbnet-strangler-fig', 'dashboard-king']) {
    if (!index.includes(`/projetos/${slug}`)) errors.push(`home sem card para ${slug}`);
  }
  if (!index.includes('mailto:Tiago.rds85@hotmail.com')) errors.push('contato sem e-mail');
  if (!index.includes('github.com/TiagoR85')) errors.push('contato sem GitHub');
  if (!index.includes('© 2026 Tiago Rodrigues')) errors.push('footer sem copyright');
}

const SLUGS = ['jobforge', 'logpipe', 'einvoice', 'devops', 'soap-grpc-bridge', 'vbnet-strangler-fig', 'dashboard-king'];

for (const slug of SLUGS) {
  const p = html(`projetos/${slug}/index.html`);
  if (!p) { errors.push(`rota /projetos/${slug} ausente`); continue; }
  if (!p.includes('application/ld+json')) errors.push(`/projetos/${slug} sem JSON-LD`);
  if (!p.includes('rel="canonical"')) errors.push(`/projetos/${slug} sem canonical`);
}

const cv = html('cv/index.html');
if (!cv) errors.push('rota /cv ausente');
else {
  if (!cv.includes('window.print')) errors.push('/cv sem botão de imprimir');
  if (!cv.includes('jobforge-orchestrator')) errors.push('/cv sem projetos do README');
  for (const s of ['DBY Desenvolvimento de Sistemas', 'Bacharelado em Engenharia de Software', 'Inglês', 'Microsoft Certified']) {
    if (!cv.includes(s)) errors.push(`/cv sem "${s}"`);
  }
}
if (!html('404.html')) errors.push('404.html ausente');

if (!index?.includes('"@type":"Person"')) errors.push('home sem JSON-LD Person');
if (!index?.includes('id="outros"')) errors.push('home sem grid de outros repositórios');
if (!index?.includes('akka-cluster-jobs') || !index?.includes('powerhell-deploy-kit')) errors.push('grid de outros repositórios sem cards');
if (!index?.includes('twitter:image')) errors.push('home sem twitter:image');
if (!index?.includes('/img/diagrams/jobforge.svg')) errors.push('home sem faixa de diagramas');

const ogPng = (name) => {
  const p = join(DIST, 'og', `${name}.png`);
  const buf = existsSync(p) ? readFileSync(p) : null;
  if (!buf || buf.length < 5000) { errors.push(`og ${name}.png ausente/pequeno`); return null; }
  // IHDR: bytes 16..24 big-endian = width, height
  if (buf.length >= 24 && (buf.readUInt32BE(16) !== 1200 || buf.readUInt32BE(20) !== 630))
    errors.push(`og ${name}.png com dimensão errada (esperado 1200x630)`);
  return buf;
};

// og:image por página (8 páginas)
const ogPages = [
  ['index.html', 'home'],
  ['cv/index.html', 'cv'],
  ...SLUGS.map((s) => [`projetos/${s}/index.html`, s]),
];
for (const [page, name] of ogPages) {
  const doc = html(page);
  if (!doc) continue;
  const m = doc.match(/property="og:image" content="([^"]+)"/);
  if (!m) { errors.push(`${page} sem og:image`); continue; }
  const ogName = m[1].split('/').pop()?.replace(/\.png$/, '');
  if (ogName !== name || !ogPng(ogName)) errors.push(`${page} aponta og image inesperado: ${m[1]}`);
}

// assets /img/ referenciados pelas páginas de projeto devem existir em dist
for (const file of readdirSync('src/content/projects').map((m) => join('src/content/projects', m))) {
  const body = readFileSync(file, 'utf8');
  for (const m of body.matchAll(/\/img\/[A-Za-z0-9._/-]+\.(?:avif|webp|svg|png)/g)) {
    if (!existsSync(join(DIST, m[0]))) errors.push(`${file}: asset ausente ${m[0]}`);
  }
}
for (const decor of ['decor-grid.svg']) {
  if (!existsSync(join(DIST, 'img', decor))) errors.push(`asset de decoração ausente /img/${decor}`);
}
const heroPhoto = join(DIST, 'img', 'tiao.webp');
if (!existsSync(heroPhoto) || statSync(heroPhoto).size > 200 * 1024) errors.push('foto do hero ausente ou > 200 KB (public/img/tiao.webp)');

if (!existsSync(join(DIST, 'robots.txt'))) errors.push('robots.txt ausente');
// o sitemap que o @astrojs/sitemap emite é sitemap-index.xml; validar pela URL declarada no robots
else {
  const robots = readFileSync(join(DIST, 'robots.txt'), 'utf8');
  const sitemapLine = robots.match(/^Sitemap: https:\/\/portfolio\.tiagords\.com\.br(\/\S+)$/m);
  if (!sitemapLine) errors.push('robots.txt sem linha Sitemap');
  else {
    if (sitemapLine[1] !== '/sitemap-index.xml') errors.push(`robots.txt aponta sitemap errado: ${sitemapLine[1]}`);
    if (!existsSync(join(DIST, sitemapLine[1]))) errors.push(`sitemap declarado no robots não existe: ${sitemapLine[1]}`);
  }
}
if (index && !index.includes('og:image')) errors.push('home sem og:image');

const cssFiles = existsSync(join(DIST, ASTRO)) ? readdirSync(join(DIST, ASTRO)).filter(f => f.endsWith('.css')) : [];
const allCss = cssFiles.map(f => readFileSync(join(DIST, ASTRO, f), 'utf8')).join('\n');
const srcCss = readFileSync('src/styles/globals.css', 'utf8');
if (!srcCss.includes('linear-gradient(180deg')) errors.push('globals.css sem gradiente .hero-heading');
if (!srcCss.includes('color-mix(in oklab')) errors.push('globals.css sem gradiente derivado do accent');
if (!srcCss.includes('--accent')) errors.push('globals.css sem token --accent');
if (!srcCss.includes('color-scheme: dark')) errors.push('globals.css sem color-scheme dark');
// ancorado de propósito: o CodeQL acusa regex sem âncora (js/missing-regexp-anchor)
if (/^.*fonts\.googleapis\.com.*$/m.test(allCss)) errors.push('CSS contém fonts.googleapis.com (proibido)');
if (!allCss.includes('kanit-900')) errors.push('CSS sem @font-face kanit-900');

const jsFiles = existsSync(join(DIST, ASTRO)) ? readdirSync(join(DIST, ASTRO)).filter(f => f.endsWith('.js')) : [];
const jsKb = jsFiles.reduce((s, f) => s + statSync(join(DIST, ASTRO, f)).size, 0) / 1024;
const cssKb = cssFiles.reduce((s, f) => s + statSync(join(DIST, ASTRO, f)).size, 0) / 1024;
const gzipKb = (files) => files.reduce((s, f) => s + gzipSync(readFileSync(join(DIST, ASTRO, f))).length, 0) / 1024;
const homeHtmlKb = gzipSync(Buffer.from(index ?? '')).length / 1024;
const totalGzip = gzipKb([...jsFiles, ...cssFiles]) + homeHtmlKb;
if (jsKb + cssKb > 400) errors.push(`JS+CSS ${(jsKb + cssKb).toFixed(0)} KB > 400 KB (orçamento sem compressão)`);
if (totalGzip > 150) errors.push(`home ${totalGzip.toFixed(0)} KB gzip > 150 KB (orçamento)`);

// ativos não comprimidos pelo servidor (fontes/imagens já chegam compressos pelo formato):
// informação, não gate — o orçamento de rede da home os inclui implicitamente.
const fontKb = existsSync(join(DIST, 'fonts'))
  ? readdirSync(join(DIST, 'fonts')).reduce((s, f) => s + statSync(join(DIST, 'fonts', f)).size, 0) / 1024
  : 0;
const imgKb = ['tiao.webp', 'tie-mask.png'].reduce((s, f) => {
  const p = join(DIST, 'img', f);
  return s + (existsSync(p) ? statSync(p).size : 0);
}, 0) / 1024;
console.log(`check-build ativos: fontes ${fontKb.toFixed(0)} KB · foto+máscara ${imgKb.toFixed(0)} KB`);

if (errors.length) { console.error('check-build FALHOU:\n- ' + errors.join('\n- ')); process.exit(1); }
console.log('check-build OK');
