import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { DtsCreator } from 'typed-css-modules/lib/dts-creator.js';
import { type Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * Keeps the `*.module.d.css.ts` typings next to each CSS Module in step with it
 * while the dev server runs, so a class added to the CSS is usable in TSX right
 * away. Outside the dev server `npm run css:types` does the same, and CI checks
 * that the committed typings are current.
 */
function cssModuleTypes(): Plugin {
  const creator = new DtsCreator({ allowArbitraryExtensions: true });

  return {
    name: 'css-module-types',
    apply: 'serve',
    async hotUpdate({ file, type }) {
      if (this.environment.name !== 'client' || !file.endsWith('.module.css')) {
        return;
      }

      const content = await creator.create(file, undefined, true, type === 'delete');
      await (type === 'delete' ? content.deleteFile() : content.writeFile());
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves a project site from /<repo>/, so built asset URLs need
  // that prefix. CI passes it in; a build run locally stays at the root.
  base: process.env['BASE_PATH'] ?? '/',
  plugins: [react(), cssModuleTypes()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    // Process CSS Modules in tests so className is not undefined.
    css: true,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/**/*.test.{ts,tsx}', 'src/**/*.d.css.ts'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
