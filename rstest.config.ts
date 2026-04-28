import { defineConfig } from '@rstest/core';

export default defineConfig({
  tsconfigPath: './tsconfig.test.json',
  name: 'prueba-tecnica-javerina',
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
