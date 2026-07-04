# Recipe: configure the project for its integration target

**Do this before any feature work.** The template ships wired for the Bitrix24
JS SDK. Which Bitrix24 integration the project actually uses decides whether that
SDK stays or goes. Ask the user, then run the matching section.

> **How will this app talk to Bitrix24 — Bitrix24 Vibecoding, or the REST API?**

If they haven't said, ask — don't assume.

---

## Vibecoding

Target: [vibecode.bitrix24.tech](https://vibecode.bitrix24.tech/v1/me). The JS SDK
is **not** used here, so remove it up front — this is the pain point the template
exists to eliminate. Bitrix24 access on this platform goes through
<https://vibecode.bitrix24.tech/llms.txt>; the app otherwise runs on mock data.

### Removal procedure

1. **`package.json`** — delete both dependencies:
   - `@bitrix24/b24jssdk`
   - `@bitrix24/b24jssdk-nuxt`

2. **`nuxt.config.ts`** — remove `'@bitrix24/b24jssdk-nuxt'` from the `modules`
   array (leave the other modules intact).

3. **Code that imports the SDK** — find every usage and remove or replace it:

   ```bash
   grep -rn "@bitrix24/b24jssdk" app server
   ```

   Known touch points today:
   - `app/composables/useB24.ts` — the whole composable is SDK glue; delete the
     file (or reduce it to a no-op that always reports "not connected").
   - `app/composables/useDealStats/` — `index.ts` and `api.ts` import
     `B24Frame` / `SdkError` and call the CRM. Keep the composable's public shape,
     but drop the real-CRM branch so it always returns the mock path
     (`generateMockStats` / `generateMockChart` / `generateMockSales`).

4. **Keep the app on mock data.** `server/api/*.json.get.ts` and the `generateMock*`
   helpers already provide everything the UI needs. After removal:

   ```bash
   pnpm install      # refresh lockfile without the SDK
   pnpm lint --fix
   pnpm typecheck    # must be clean — no dangling SDK types
   pnpm dev          # app boots on mock data
   ```

5. **Point Bitrix24 work at the vibecode docs:**
   <https://vibecode.bitrix24.tech/llms.txt>. Entity references live under
   `https://vibecode.bitrix24.tech/docs/entities/<name>` (e.g. `deals`).

> After this, the "B24 access through `useB24`" and JS-SDK-JSDoc rules no longer
> apply — there is no SDK in the project.

---

## REST API

Target: a classic Bitrix24 application talking to the
[REST API](https://apidocs.bitrix24.com/). **Keep the JS SDK** — it fits this
target well. No files need to be removed.

1. Leave `@bitrix24/b24jssdk` + `@bitrix24/b24jssdk-nuxt` and the
   `@bitrix24/b24jssdk-nuxt` module in place.
2. Access Bitrix24 only through `useB24()` (see
   [b24-integration](../guidelines/b24-integration.md)).
3. Use the **Bitrix24 JS SDK docs**: <https://bitrix24.github.io/b24jssdk/llms.txt>.
4. **Recommend to the user** connecting the
   [MCP Server for the Bitrix24 REST API](https://apidocs.bitrix24.com/ai-tools/mcp.html) —
   it gives the agent live access to REST method docs while coding.
5. Follow the JSDoc rule for any SDK-calling function (see
   [conventions](../guidelines/conventions.md#jsdoc-on-bitrix24-js-sdk-code)).

---

## Quick reference

| | Vibecoding | REST API |
|---|---|---|
| `@bitrix24/b24jssdk(-nuxt)` | **remove** | keep |
| `useB24` / real-CRM paths | remove (mock only) | keep |
| Bitrix24 docs | vibecode.bitrix24.tech/llms.txt | bitrix24.github.io/b24jssdk/llms.txt |
| Extra recommendation | — | REST API MCP Server |
