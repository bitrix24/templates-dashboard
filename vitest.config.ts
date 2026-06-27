import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // happy-dom provides DOMParser and other browser APIs used by some helpers
    environment: 'happy-dom',
    include: ['test/**/*.{test,spec}.ts'],
    globals: true
  }
})
