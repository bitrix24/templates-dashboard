---
name: b24-dashboard-template
description: Work on the Bitrix24 Nuxt Dashboard Template — a starter B24 app built with @bitrix24/b24ui-nuxt, running on mock data standalone and on CRM data when embedded in Bitrix24. Use when adding pages, components, composables, mock/real data, or localized strings to this template.
---

# Bitrix24 Nuxt Dashboard Template

A Nuxt 4 dashboard that ships as a browser-based Bitrix24 application. It works
**standalone on mock data** and, once embedded in Bitrix24, reads CRM data
through the B24 Frame SDK. Every screen is composed from
[`@bitrix24/b24ui-nuxt`](https://bitrix24.github.io/b24ui/) components and
[`@bitrix24/b24icons-vue`](https://bitrix24.github.io/b24icons/) icons, and every
visible string is localized across 19 locales.

## Component API reference

This skill teaches **how to build within this template**. For the API of a
specific b24ui component (props, slots, events), use the Bitrix24 UI docs:
<https://bitrix24.github.io/b24ui/llms.txt> (skill `b24-ui-nuxt`). If it is not
configured, add it.

## First step — pick the integration target

Before any feature work, ask the user **how the app talks to Bitrix24** and set the
project up accordingly. This is the #1 convenience goal of the template — a
Vibecoding user should never have to rip out the SDK by hand.

- **Bitrix24 Vibecoding** → run the removal procedure in
  [recipes/setup-target.md](references/recipes/setup-target.md#vibecoding) first
  (strips `@bitrix24/b24jssdk` + `-nuxt`), then build on mock data and use
  <https://vibecode.bitrix24.tech/llms.txt>.
- **REST API** → keep the SDK; follow
  [recipes/setup-target.md](references/recipes/setup-target.md#rest-api), use the
  [JS SDK docs](https://bitrix24.github.io/b24jssdk/llms.txt), and recommend the
  [REST API MCP Server](https://apidocs.bitrix24.com/ai-tools/mcp.html).

If the user hasn't said, **ask** — don't assume.

## Core rules (always apply)

1. **Semantic colors only.** Use b24ui tokens (`text-description`, `bg-elevated`,
   `border-muted`, `air-primary`, …) — never raw Tailwind palette
   (`text-gray-500`, `bg-blue-600`). This is a hard requirement inherited from
   b24ui; see [conventions](references/guidelines/conventions.md).
2. **No hard-coded user-facing strings.** Everything goes through i18n. Add keys
   to `i18n/locales/en.json` (the source of truth) first. See
   [i18n](references/guidelines/i18n.md).
3. **All B24 access through `useB24()`.** Never `new B24Frame()` in a component.
   See [b24-integration](references/guidelines/b24-integration.md).
4. **Keep pages thin.** Feature UI lives in `app/components/<feature>/`, data in
   `app/composables/` or `server/api/`. See [architecture](references/architecture.md).
5. **Mock first.** New data must render standalone (mock) before it reads real
   CRM data. See [data-layer](references/recipes/data-layer.md).

## How to use this skill

Load only the references the task needs — don't read everything.

### Reference files

**Guidelines** — the requirements and patterns:
- [architecture](references/architecture.md) — stack, layers, data flow, where things live
- [conventions](references/guidelines/conventions.md) — Vue/TS/ESLint conventions, b24ui usage requirements, semantic colors, icons
- [i18n](references/guidelines/i18n.md) — locale files, keys, `useI18n`, `translate-ui`
- [b24-integration](references/guidelines/b24-integration.md) — `useB24`, `B24Frame`, jssdk, scopes, install flow

**Recipes** — step-by-step for common tasks:
- [setup-target](references/recipes/setup-target.md) — **do this first**: configure the project for Vibecoding (remove JS SDK) or REST API (keep SDK)
- [add-page](references/recipes/add-page.md) — new route + sidebar entry + command palette + shortcut + i18n
- [data-layer](references/recipes/data-layer.md) — mock endpoint → real B24 CRM data via a `useDealStats`-style composable

### Routing table

| Task | Load these references |
|---|---|
| **First contact / project setup for a target** | setup-target |
| Understand the project before changing anything | architecture |
| Add a new page / route | conventions, i18n, add-page |
| Build or edit a feature component | conventions, architecture |
| Add / change data (mock or CRM) | architecture, b24-integration, data-layer |
| Add or change any visible text | i18n |
| Wire something to Bitrix24 CRM | b24-integration, data-layer |

## Known work / TODO

See `AGENTS.md` → "Known Work / TODO" for the live list. In short: `app/pages/install.vue`
needs a **full rewrite** (dedicated task, not the add-page recipe); a **localization
pass** across all pages is pending; and an **AI anonymized feedback loop** is under
development (delivery item, spec TBD).

## Before you finish

- [ ] `pnpm lint` passes (`pnpm lint --fix` to autofix stylistic rules)
- [ ] `pnpm typecheck` passes
- [ ] No hard-coded user-facing strings — keys added to `i18n/locales/en.json`
- [ ] No raw Tailwind palette colors — semantic tokens only
- [ ] New data renders standalone on mock data
