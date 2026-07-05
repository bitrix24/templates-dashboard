/**
 * vue-i18n runtime options for @nuxtjs/i18n.
 *
 * `fallbackLocale: 'en'` makes any key missing in the active locale fall back to
 * English instead of rendering the raw key path. Locale files should still carry
 * an identical key set (see AGENTS.md i18n rules); this is a safety net.
 */
export default defineI18nConfig(() => ({
  fallbackLocale: 'en'
}))
