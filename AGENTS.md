# AGENTS.md

Guidance for AI coding agents working on the **Nuxt Dashboard Template** — a
starter Bitrix24 application built with [Bitrix24 UI](https://bitrix24.github.io/b24ui/).

## START HERE — ask the integration target first

Before writing any feature code, **ask the user one question and act on it.** This
is the first thing any AI agent must do with this template — it decides which
Bitrix24 integration the project uses and saves the user from ripping the SDK out
by hand later.

> **How will this app talk to Bitrix24 — Bitrix24 Vibecoding, or the REST API?**

- **Bitrix24 Vibecoding** ([vibecode.bitrix24.tech](https://vibecode.bitrix24.tech/v1/me)):
  the JS SDK is **not** used there. **Before doing anything else**, run the
  removal procedure in [recipes/setup-target.md](skills/b24-dashboard-template/references/recipes/setup-target.md#vibecoding)
  to strip `@bitrix24/b24jssdk` + `@bitrix24/b24jssdk-nuxt` cleanly, then build on
  mock data and use <https://vibecode.bitrix24.tech/llms.txt>.
- **REST API** (a classic Bitrix24 app): keep the JS SDK — it fits well. Follow
  [recipes/setup-target.md](skills/b24-dashboard-template/references/recipes/setup-target.md#rest-api),
  use the [Bitrix24 JS SDK docs](https://bitrix24.github.io/b24jssdk/llms.txt), and
  recommend connecting the
  [MCP Server for the Bitrix24 REST API](https://apidocs.bitrix24.com/ai-tools/mcp.html).

If the user hasn't said, **ask** — don't assume. Everything below applies to both
targets except where it explicitly mentions the JS SDK.

## Project Overview

Nuxt 4 dashboard template that ships as a browser-based Bitrix24 app. It runs
**standalone on mock data** (`server/api/*.json.get.ts`) and, depending on the
integration target chosen above, talks to the CRM either through the B24 Frame SDK
(`@bitrix24/b24jssdk`, REST-API target) or through the Vibecoding platform.
UI is composed entirely from `@bitrix24/b24ui-nuxt` components and
`@bitrix24/b24icons-vue` icons. All user-facing text is localized (19 locales).

## Project Structure

```
app/
├── pages/             # Routes (index, inbox, customers, settings/*, install)
├── layouts/           # default.vue (sidebar + command palette), clear.vue
├── components/<feature>/  # Feature components (home/, inbox/, customers/, settings/)
├── composables/       # useB24, useDashboard, useDealStats/ (api|formatters|mocks|helpers)
├── types/index.d.ts   # Shared app types
├── utils/             # Helpers (sleepAction, ...)
└── app.config.ts      # colorMode config
server/api/            # *.json.get.ts mock endpoints (customers, mails, members, notifications)
i18n/
├── i18n.ts            # contentLocales list
└── locales/<code>.json # en.json is the source of truth; mirror keys into the others
```

## Commands

```bash
pnpm dev            # Dev server on http://localhost:3000
pnpm build          # Production build
pnpm generate       # Static generation
pnpm preview        # Preview production build
pnpm lint           # ESLint check (pnpm lint --fix to autofix)
pnpm typecheck      # nuxt typecheck (vue-tsc)
pnpm test           # Run unit tests (vitest)
```

## Key Conventions

- **Semantic colors only** — use b24ui tokens (`text-description`, `bg-elevated`,
  `border-muted`), never raw Tailwind palette (`text-gray-500`).
- **No hard-coded strings** — every visible string goes through i18n (`useI18n` →
  `t('page.<name>....')`). Add keys to `i18n/locales/en.json` first (the source of
  truth), then mirror the same keys into every other `i18n/locales/*.json`.
- **b24ui components** — prefix `B24*`, resolved via `resolveComponent` or
  auto-import. For component APIs consult the b24ui skill / `llms.txt` (below).
- **Feature components** live in `app/components/<feature>/`; keep pages thin.
- **Data composables** follow the `useDealStats/` pattern — split into
  `api.ts` (B24 REST), `formatters.ts`, `helpers.ts`, `mocks.ts`, `index.ts`.
- **B24 access** goes through `useB24()` only; never instantiate `B24Frame`
  directly in components. Required scopes: `user_brief`, `crm`, `tasks`, `entity` (see `getRequiredRights()` in `useB24.ts`).
- **JSDoc on Bitrix24 JS SDK code (required; REST-API target only).** Any function that
  calls the Bitrix24 JS SDK (`@bitrix24/b24jssdk`) — e.g. `useDealStats/api.ts` —
  must carry JSDoc that documents params/returns **and** links to:
  - the REST API method it uses: <https://apidocs.bitrix24.com/> (link the concrete
    method page, e.g. `crm.deal.list`);
  - the equivalent vibecoding entity docs, e.g.
    <https://vibecode.bitrix24.tech/docs/entities/deals> (or the raw
    `https://vibecode.bitrix24.tech/docs-content/entities/deals.md`).
- **ESLint style** (`@nuxt/eslint`, stylistic): `commaDangle: 'never'`,
  `braceStyle: '1tbs'`. Run `pnpm lint --fix`.

## Documentation & Resources

- **Bitrix24 UI (always).** For component props / slots / events / examples, use
  the Bitrix24 UI docs: <https://bitrix24.github.io/b24ui/llms.txt>
  (skill `b24-ui-nuxt`). If it is not configured, add it.

- **Integration target.** Decided by the [START HERE](#start-here--ask-the-integration-target-first)
  question. Full setup / SDK-removal procedure for both targets lives in
  [recipes/setup-target.md](skills/b24-dashboard-template/references/recipes/setup-target.md):
  - **Vibecoding** → SDK removed; use <https://vibecode.bitrix24.tech/llms.txt>.
  - **REST API** → SDK kept; use <https://bitrix24.github.io/b24jssdk/llms.txt> and
    recommend the [REST API MCP Server](https://apidocs.bitrix24.com/ai-tools/mcp.html).

## Skill

Deeper how-to guidance lives in [`skills/b24-dashboard-template/SKILL.md`](skills/b24-dashboard-template/SKILL.md)
(architecture, conventions, i18n, B24 integration, and recipes for adding a page
and wiring the data layer).

## Add-a-Page Checklist

```
- [ ] 1. Create app/pages/<name>.vue (script setup lang="ts")
- [ ] 2. Add i18n keys to i18n/locales/en.json, then mirror them into the other i18n/locales/*.json
- [ ] 3. Register the route in the sidebar links + command palette (app/layouts/default.vue)
- [ ] 4. Add a g-<key> shortcut in app/composables/useDashboard.ts if navigable
- [ ] 5. Feature UI → app/components/<feature>/, data → app/composables/ or server/api
- [ ] 6. pnpm lint --fix && pnpm typecheck
```

## Known Work / TODO

Open items agents should be aware of (not yet covered by a recipe):

- **Install page needs a full rewrite.** `app/pages/install.vue` is a stub and
  must be rewritten end-to-end (install flow, scope handshake, error states). It
  is intentionally **not** covered by the add-page recipe — treat it as a
  dedicated task, not a routine page addition.
- **Localization pass across all pages.** Not every page is fully localized yet.
  All pages must be audited and every visible string moved to i18n keys. Formal
  localization requirements will be added here once that pass is scoped — until
  then follow the i18n guideline and keep `en.json` the source of truth.
- **AI anonymized feedback loop (under development).** A planned mechanism for AI
  agents to automatically emit **anonymized** feedback while working with the
  template — errors, inaccuracies, improvement suggestions, and positive notes —
  telemetry-style, with no PII or project content. The contour is still being
  designed (spec + endpoint TBD); this is a delivery item, wired up once the
  design is finalized.

## Before Submitting

- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] No hard-coded user-facing strings (i18n keys added to `en.json`)
- [ ] No raw Tailwind palette colors
- [ ] Commit message is clear and scoped

---

_Last reviewed: 2026-07-05._
