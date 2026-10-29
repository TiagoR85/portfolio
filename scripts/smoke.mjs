// scripts/smoke.mjs
import { pathToFileURL } from 'node:url';

const SLUGS = ['jobforge', 'logpipe', 'einvoice', 'devops', 'soap-grpc-bridge', 'vbnet-strangler-fig', 'dashboard-king'];
const PATHS = ['/', '/cv', '/sitemap-index.xml', '/robots.txt', '/og/home.png', ...SLUGS.map((s) => `/projetos/${s}`)];
const FETCH_OPTS = { redirect: 'follow' };

// Retorna o nº de falhas; 0 = smoke OK. fetchImpl injetável para testes.
export async function runSmoke(baseUrl, fetchImpl = fetch) {
  let bad = 0;
  let res;
  for (const path of PATHS) {
    try {
      // sinal por request: um AbortSignal disparado não pode ser reaproveitado
      res = await fetchImpl(baseUrl + path, { ...FETCH_OPTS, signal: AbortSignal.timeout(10_000) });
      if (!res.ok) { console.error(`${path}: HTTP ${res.status}`); bad++; }
    } catch (err) {
      console.error(`${path}: ${(err instanceof Error) ? err.message : String(err)}`);
      bad++;
    }
  }
  try {
    res = await fetchImpl(baseUrl + '/', { ...FETCH_OPTS, signal: AbortSignal.timeout(10_000) });
    const html = await res.text();
    if (!html.includes('og:image')) { console.error('home sem og:image'); bad++; }
    if (!html.includes('<title>')) { console.error('home sem <title>'); bad++; }
  } catch (err) {
    console.error(`/: ${(err instanceof Error) ? err.message : String(err)}`);
    bad++;
  }
  return bad;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const base = process.env.SMOKE_URL ?? 'https://portfolio.tiagords.com.br';
  if (await runSmoke(base)) process.exit(1);
  console.log('smoke OK');
}
