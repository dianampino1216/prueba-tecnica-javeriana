import { defineConfig } from '@rstest/core';

export default defineConfig({
  name: 'prueba-tecnica-javerina',
  source: {
    tsconfigPath: './tsconfig.test.json',
  },
  testEnvironment: 'happy-dom',
  globals: true,
  include: ['src/**/*.{test,spec}.{ts,tsx}'],
  exclude: ['**/node_modules/**', '**/dist/**'],
  setupFiles: ['./rstest.setup.ts'],
  passWithNoTests: true,
  tools: {
    swc: {
      jsc: {
        transform: {
          react: {
            runtime: 'automatic',
          },
        },
      },
    },
  },
});
