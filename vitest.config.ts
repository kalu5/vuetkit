import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: 'dot',
    exclude: ['**/node_modules/**'],
    coverage: {
      include: ['packages/**/*.ts', 'packages/**/src/**/**/*.ts'],
      exclude: [
        '**/.vitepress/**',
        '**/.test/**',
        '**/.turbo/**',
        '**/demo/**',
        '**/dist/**',
        '**/node_modules/**',
        '**/*.test.ts',
        '**/*.*.test.ts',
        '**/types.ts',
        '**/*.config.ts',
      ],
    },
  },
  cacheDir: resolve(import.meta.dirname, 'node_modules/.vite'),
  resolve: {
    alias: {
      '@kalu55': resolve(import.meta.dirname, 'packages/core/index.ts'),
      '@kalu55/shared': resolve(
        import.meta.dirname,
        'packages/shared/index.ts',
      ),
    },
  },
})
