import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', '.direnv'],
    // stdio spawn needs threads that can use process; keep fileParallelism off for clarity
    pool: 'forks',
  },
})
