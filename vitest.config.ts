import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { defineConfig } from 'vitest/config'

const __dirname = dirname(fileURLToPath(import.meta.url))

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
  cacheDir: resolve(__dirname, 'node_modules/.vite'),
  resolve: {
    alias: {
      '@vuecraft/shared': pathToFileURL(
        resolve(__dirname, 'packages/shared/index.ts'),
      ).href,
      '@vuecraft': pathToFileURL(resolve(__dirname, 'packages/core/index.ts')).href,
    },
  },
})
