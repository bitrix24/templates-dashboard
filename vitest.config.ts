import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // happy-dom provides DOMParser and other browser APIs used by some helpers
    environment: 'happy-dom',
    include: ['test/**/*.{test,spec}.ts'],
    globals: true,
    // Pin the timezone so locale/date formatting tests are deterministic on any
    // machine (Intl reads process.env.TZ; without this, dates render in the
    // runner's local zone and day/month assertions fail west of UTC).
    env: {
      TZ: 'UTC'
    }
  }
})
