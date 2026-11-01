import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // gate só no que é lógica testável: componentes/ícones não entram.
      // números medidos no vitest 5 (provider v8 conta mais branches que no 3);
      // o que fica fora são os entrypoints de CLI (`if import.meta.url...`), que
      // não são coletáveis em processo — por isso branch 70, não 85.
      include: ['src/lib/**/*.ts', 'scripts/link-check.mjs', 'scripts/smoke.mjs'],
      thresholds: { lines: 85, statements: 80, branches: 70, functions: 85 },
    },
  },
});
