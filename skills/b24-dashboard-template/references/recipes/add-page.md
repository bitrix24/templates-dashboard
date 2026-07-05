# Recipe: add a page

Adds a new route, wires it into the sidebar + command palette + shortcuts, and
localizes it. (The install page is **excluded** — see the note at the bottom.)

## Steps

### 1. Create the page

`app/pages/<name>.vue`:

```vue
<script setup lang="ts">
const { t } = useI18n()

useHead({ title: t('page.<name>.seo.title') })
</script>

<template>
  <B24DashboardPanel>
    <!-- compose B24* components / feature components here -->
  </B24DashboardPanel>
</template>
```

Keep it thin: compose components, wire data via a composable or
`useFetch('/api/<name>.json')`, set SEO. Feature UI → `app/components/<name>/`.

### 2. Localize

- Add keys under `page.<name>.*` in `i18n/locales/en.json`.
- Reference them with `t('...')` — no literal strings.
- Run `pnpm run translate-ui` to fill the other locales.

See [i18n](../guidelines/i18n.md).

### 3. Register in navigation (`app/layouts/default.vue`)

Add an entry to the sidebar `links` computed (`NavigationMenuItem[][]`), using an
imported icon and an i18n label:

```ts
import ChartIcon from '@bitrix24/b24icons-vue/outline/ChartIcon'
// ...
{
  label: t('nav.<name>'),
  icon: ChartIcon,
  to: '/<name>',
  onSelect: () => { open.value = false }
}
```

The command palette `groups` computed already flattens `links.value.flat()`, so a
new link appears in the palette automatically — no separate step.

### 4. Add a keyboard shortcut (if navigable)

In `app/composables/useDashboard.ts`, add a `g-<key>` binding:

```ts
defineShortcuts({
  // ...
  'g-<key>': () => router.push('/<name>')
})
```

### 5. Data

- Demo/mock: add `server/api/<name>.json.get.ts` returning typed fixtures, read via
  `useFetch<Type[]>('/api/<name>.json', { lazy: true })`. If the route must be
  prerendered, add it to `nitro.prerender.routes` in `nuxt.config.ts`.
- Real CRM: use a `useDealStats`-style composable — see
  [data-layer](data-layer.md).

### 6. Verify

```bash
pnpm lint --fix
pnpm typecheck
```

## Checklist

```
- [ ] app/pages/<name>.vue created (script setup lang="ts", thin)
- [ ] i18n keys in en.json + pnpm run translate-ui
- [ ] sidebar link added in app/layouts/default.vue (icon + t() label)
- [ ] g-<key> shortcut in useDashboard.ts (if navigable)
- [ ] data wired (mock server/api or composable); prerender route if needed
- [ ] semantic colors only; no hard-coded strings
- [ ] pnpm lint && pnpm typecheck pass
```

## Not this recipe: the install page

`app/pages/install.vue` needs a **full rewrite** (install flow, scope handshake,
error states) and is tracked as its own task. Do not treat it as a routine page
addition.
