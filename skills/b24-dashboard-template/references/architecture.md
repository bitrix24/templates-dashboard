# Architecture

## Stack

- **Nuxt 4** (Vue 3.5, `<script setup lang="ts">`), SSR/prerender via Nitro.
- **[@bitrix24/b24ui-nuxt](https://bitrix24.github.io/b24ui/)** — the entire UI
  layer (auto-imported `B24*` components).
- **[@bitrix24/b24icons-vue](https://bitrix24.github.io/b24icons/)** — icons,
  imported per-icon (`import HomeIcon from '@bitrix24/b24icons-vue/outline/HomeIcon'`).
- **[@bitrix24/b24jssdk](https://bitrix24.github.io/b24jssdk/)** + `-nuxt` — talks
  to Bitrix24 CRM from inside the app frame.
- **@nuxtjs/i18n** — 20 locales, `no_prefix` strategy.
- **@tanstack/vue-table**, **@unovis/vue** — tables and charts.
- **zod** — schema validation.

## Layers and where things live

```
app/
├── pages/              Routes. Keep thin — compose components, wire data, set SEO.
├── layouts/            default.vue = sidebar nav + command palette + notifications;
│                       clear.vue = bare (install page, errors).
├── components/<feature>/  Feature UI grouped by domain: home/, inbox/, customers/,
│                          settings/. Cross-cutting bits live at components/ root.
├── composables/        Reusable logic + data. useB24 (frame access),
│                       useDashboard (shortcuts + shared state),
│                       useDealStats/ (a full data-composable example).
├── types/index.d.ts    Shared types (User, Deal, Sale, ...). Import as `~/types`.
├── utils/              Small helpers (e.g. sleepAction).
├── app.config.ts       colorMode configuration.
└── app.vue / error.vue Root + error boundary.
server/api/             Mock endpoints: <name>.json.get.ts returns static data,
                        consumed via useFetch('/api/<name>.json').
i18n/
├── i18n.ts             contentLocales — the canonical locale list.
└── locales/<code>.json One file per locale. en.json is the source of truth.
tools/translate.ui.ts   Fills missing locale keys from en.json.
```

## Data flow

Two sources feed the UI, and the template is designed to switch between them:

1. **Mock (standalone / demo mode).** `server/api/*.json.get.ts` return static
   fixtures; pages read them with `useFetch('/api/<name>.json')`. This is what
   makes the template runnable without a Bitrix24 account. Prerendered routes are
   listed in `nuxt.config.ts` (`nitro.prerender.routes`).
2. **Real CRM (embedded in Bitrix24).** Composables call the B24 REST API through
   `useB24()` → `B24Frame`. The `useDealStats/` composable is the reference
   pattern: `api.ts` (REST calls), `formatters.ts`, `helpers.ts`, `mocks.ts`,
   `index.ts` (public composable that picks mock vs real).

When adding data, build the mock path first so the screen renders standalone,
then layer the real B24 path behind the same composable interface. See
[data-layer](recipes/data-layer.md).

## Navigation

`app/layouts/default.vue` owns the sidebar (`NavigationMenuItem[][]`) and the
command palette (`CommandPaletteGroup`). `app/composables/useDashboard.ts` owns
keyboard shortcuts (`g-h`, `g-i`, `g-c`, `g-s`, `shift_D` for theme, `n` for
notifications). A new navigable page must be registered in both. See
[add-page](recipes/add-page.md).

## Bitrix24 app shape

The app installs at `/install` and needs the `crm` and `user_brief` scopes.
See [b24-integration](guidelines/b24-integration.md).
