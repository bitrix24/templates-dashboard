# Conventions

These conventions are **requirements**. Where a rule comes from the Bitrix24 UI
library, it is inherited from
[b24ui `.github/contributing`](https://github.com/bitrix24/b24ui/tree/main/.github/contributing) —
that is the upstream source of truth for anything about b24ui components/themes.

## Vue / TypeScript

- **`<script setup lang="ts">`** for every component and page.
- **Separate type imports** — always on their own line:
  ```ts
  import type { TableColumn } from '@bitrix24/b24ui-nuxt'
  import { getPaginationRowModel } from '@tanstack/table-core'
  ```
- **Shared types** live in `app/types/index.d.ts`; import via `~/types`.
- **Composables** are named `use*` and returned from `app/composables/`. Reusable
  singletons wrap `createSharedComposable` (see `useDashboard`, `useDealStats`).
- **Keep pages thin** — a page composes components, wires a composable/`useFetch`,
  and sets SEO (`useHead` / `useSeoMeta` with i18n keys). Feature UI belongs in
  `app/components/<feature>/`.

## ESLint / formatting

Config: `@nuxt/eslint` with stylistic rules (`eslint.config.mjs` + `nuxt.config.ts`):

- `commaDangle: 'never'` — no trailing commas.
- `braceStyle: '1tbs'`.

Run `pnpm lint --fix` before finishing; `pnpm lint` must pass.

## Bitrix24 UI components

- Components are auto-imported with the `B24` prefix (`B24Button`, `B24Table`,
  `B24NavigationMenu`). In render-function / column contexts resolve them with
  `resolveComponent('B24Badge')`.
- **For a component's API — props, slots, events — use the Bitrix24 UI docs**
  (<https://bitrix24.github.io/b24ui/llms.txt>), not guesswork.
- **Override priority** (highest wins): `b24ui` prop / `class` prop → global
  `app.config.ts` → theme defaults. Use the `b24ui` prop to target individual
  slots; use `class` for the root.
- Need exact slot names for a component? Read the generated theme file
  (`.nuxt/ui/<component>.ts` after `pnpm dev`/`nuxt prepare`) — it lists every
  slot and variant.

## Semantic colors (hard rule)

Never use raw Tailwind palette colors (`text-gray-500`, `bg-blue-600`,
`border-red-400`). Use b24ui semantic tokens only:

- Text: `text-label`, `text-description`, `text-muted`, `text-dimmed`, `text-legend`.
- Surfaces: `bg-default`, `bg-elevated`, `bg-accented`.
- Borders: `border-default`, `border-muted`, `border-accented`.
- Component `color` prop: `air-primary`, `air-primary-success`, `air-primary-alert`,
  `air-primary-warning`, `air-primary-copilot`, `air-secondary*`, `air-selection`, …

See the full palette in
[b24ui theme-structure.md](https://github.com/bitrix24/b24ui/blob/main/.github/contributing/theme-structure.md).

## Icons

Import each icon individually from `@bitrix24/b24icons-vue/<set>/<Name>` and pass
the component to the `icon` prop — do not use string names:

```ts
import HomeIcon from '@bitrix24/b24icons-vue/outline/HomeIcon'
// ...
{ label: t('nav.home'), icon: HomeIcon, to: '/' }
```

Browse icons at <https://bitrix24.github.io/b24icons/>.

## No hard-coded strings

Every user-facing string goes through i18n. See [i18n](i18n.md).

## JSDoc on Bitrix24 JS SDK code

**Required** (REST-API target only — Vibecoding projects have no SDK). Any function
that calls the Bitrix24 JS SDK (`@bitrix24/b24jssdk`) — e.g. everything in
`app/composables/useDealStats/api.ts` — must carry JSDoc that:

1. documents params and the return value;
2. links to the **concrete REST method** it uses on
   <https://apidocs.bitrix24.com/> (e.g. the `crm.deal.list` page);
3. links to the **equivalent vibecoding entity docs**, e.g.
   <https://vibecode.bitrix24.tech/docs/entities/deals> (raw form:
   `https://vibecode.bitrix24.tech/docs-content/entities/deals.md`).

```ts
/**
 * Loads deals from the CRM for the given interval (paginated).
 *
 * @param b24 - B24Frame instance used to run the query
 * @param start - interval start (00:00:00)
 * @param end - interval end (23:59:59)
 * @returns aggregated deal data for the range
 *
 * @see https://apidocs.bitrix24.com/api-reference/crm/deals/crm-deal-list.html
 * @see https://vibecode.bitrix24.tech/docs/entities/deals
 */
export async function fetchDealsInRange(b24: B24Frame, start: Date, end: Date) { /* ... */ }
```
