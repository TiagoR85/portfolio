// scripts/og.mjs
import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

if (!existsSync('assets/fonts/Kanit-Black.ttf')) throw new Error('TTF da Kanit ausente em assets/fonts/Kanit-Black.ttf');

const pages = {
  home: ['TIAGO RODRIGUES', 'back-end .NET · arquitetura distribuída · DevOps'],
  cv: ['CURRÍCULO', 'Tiago Rodrigues — stack, projetos e contato'],
  jobforge: ['JOBFORGE', 'Orquestração de jobs: outbox → Kafka → runner'],
  logpipe: ['LOGPIPE', 'Pipeline de logs em tiers com contrato gRPC versionado'],
  einvoice: ['EINVOICE', 'Nota fiscal: API, worker RabbitMQ e PDF'],
  devops: ['PLATAFORMA DEVOPS', 'CI/CD, Docker production-grade e quality gates'],
  'soap-grpc-bridge': ['SOAP → GRPC', 'Ponte para integrações legadas de ERP'],
  'vbnet-strangler-fig': ['STRANGLER FIG', 'Migração VB.NET → C#/.NET 10 sem parar'],
  'dashboard-king': ['DASHBOARD', 'Blazor WASM + Tailwind: 50 rotas e CI/CD'],
};

const svg = (title, subtitle) => `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0C0C0C"/>
  <text x="70" y="420" font-family="Kanit" font-weight="900" font-size="${title.length > 12 ? 96 : 130}" fill="#D7E2EA">${title}</text>
  <text x="72" y="500" font-family="Kanit" font-weight="900" font-size="30" fill="#D7E2EA" fill-opacity="0.6">${subtitle}</text>
  <text x="70" y="90" font-family="Kanit" font-weight="900" font-size="28" fill="#D7E2EA" fill-opacity="0.4">portfolio.tiagords.com.br</text>
</svg>`;

mkdirSync('public/og', { recursive: true });
for (const [slug, [title, subtitle]] of Object.entries(pages)) {
  const png = new Resvg(svg(title, subtitle), { font: { fontFiles: ['assets/fonts/Kanit-Black.ttf'], loadSystemFonts: false, defaultFontFamily: 'Kanit' } }).render().asPng();
  writeFileSync(join('public/og', `${slug}.png`), png);
}
console.log(`og: ${Object.keys(pages).length} imagens geradas`);
