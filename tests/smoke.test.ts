import { describe, it, expect, vi, afterEach } from 'vitest';
import { runSmoke } from '../scripts/smoke.mjs';

const PATHS = [
  '/', '/cv', '/sitemap-index.xml', '/robots.txt', '/og/home.png',
  '/projetos/jobforge', '/projetos/logpipe', '/projetos/einvoice',
  '/projetos/devops', '/projetos/soap-grpc-bridge', '/projetos/vbnet-strangler-fig',
  '/projetos/dashboard-king',
];
const FULL_HOME = '<html><head><title>x</title><meta property="og:image" content="/og/home.png"></head></html>';
type FakeRes = { ok: boolean; status: number; text: () => Promise<string> };

function stubFetch(responses: Record<string, FakeRes>) {
  const f = vi.fn(async (url: string | URL | Request, _init?: RequestInit): Promise<Response> => {
    const path = new URL(String(url)).pathname;
    const r = responses[path];
    return {
      ok: r?.ok ?? true,
      status: r?.status ?? 200,
      text: async () => (r ? r.text() : FULL_HOME),
    } as Response;
  });
  vi.stubGlobal('fetch', f);
  return f;
}

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

describe('runSmoke', () => {
  it('todas as respostas 200 e home com og:image → 0 falhas (CLI sai 0)', async () => {
    const f = stubFetch({});
    await expect(runSmoke('https://smoke.test')).resolves.toBe(0);
    const urls = f.mock.calls.map((c) => String(c[0]));
    for (const path of PATHS) expect(urls).toContain('https://smoke.test' + path);
    // sinal novo e não-disparado em cada request (não compartilhado)
    const signals = f.mock.calls.map(([, init]) => (init?.signal ?? null) as AbortSignal | null);
    expect(signals.length).toBe(PATHS.length + 1);
    for (const s of signals) { expect(s).toBeInstanceOf(AbortSignal); expect(s?.aborted).toBe(false); }
  });
  it('uma resposta 500 → 1 falha (CLI sai 1)', async () => {
    stubFetch({ '/robots.txt': { ok: false, status: 500, text: async () => '' } });
    await expect(runSmoke('https://smoke.test')).resolves.toBe(1);
  });
  it('fetch lança AbortError (timeout) → falha com o path na mensagem (CLI sai 1)', async () => {
    const inner = vi.fn(async (_url: string | URL | Request, _init?: RequestInit): Promise<Response> => ({
      ok: true, status: 200, text: async () => FULL_HOME,
    } as Response));
    vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request, init?: RequestInit): Promise<Response> => {
      if (new URL(String(url)).pathname === '/projetos/devops') throw new DOMException('timeout', 'AbortError');
      return inner(url, init);
    }));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(runSmoke('https://smoke.test')).resolves.toBe(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('/projetos/devops'));
    expect(String(errorSpy.mock.calls[0][0])).toContain('timeout');
    errorSpy.mockRestore();
  });
  it('home sem og:image → 1 falha (CLI sai 1)', async () => {
    stubFetch({ '/': { ok: true, status: 200, text: async () => '<html><head><title>x</title></head></html>' } });
    await expect(runSmoke('https://smoke.test')).resolves.toBe(1);
  });
  it('falha ao reler a home (segundo fetch lança) → 1 falha, path "/" na mensagem', async () => {
    let calls = 0;
    vi.stubGlobal('fetch', vi.fn(async (): Promise<Response> => {
      calls++;
      if (calls > PATHS.length) throw new DOMException('boom', 'AbortError');
      return { ok: true, status: 200, text: async () => '<html></html>' } as Response;
    }));
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await expect(runSmoke('https://smoke.test')).resolves.toBe(1);
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('/:'));
    errorSpy.mockRestore();
  });
});
