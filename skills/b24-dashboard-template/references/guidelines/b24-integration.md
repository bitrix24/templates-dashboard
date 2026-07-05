# Bitrix24 integration

> **Applies to the REST-API target only.** If the project targets Bitrix24
> Vibecoding, the JS SDK has been removed (see
> [setup-target.md](../recipes/setup-target.md#vibecoding)) and this guideline
> does not apply — the app runs on mock data and Bitrix24 work follows
> <https://vibecode.bitrix24.tech/llms.txt>.

## The app as a Bitrix24 application

This template runs as a browser app **inside the Bitrix24 frame**. It:

- installs at `/install` (`app/pages/install.vue`);
- requires scopes `user_brief`, `crm`, `tasks`, `entity` (declared by `getRequiredRights()` in `useB24.ts`);
- registers with an Application URL and an Installation URL (see `README.md`).

> `app/pages/install.vue` implements a **client-only** install flow
> (init → placement → userFields → finish), modeled on `bitrix24/b24-ai-starter`'s
> `install.client.vue` with the `serverSide` step intentionally dropped (see the
> header comment in the file). The placement/userFields handlers are demo bindings.

## Access only through `useB24()`

Never call `new B24Frame()` in a component. The `app/composables/useB24.ts`
composable owns the single frame instance and exposes:

- `get()` → the `B24Frame` instance (once initialized);
- `isInit()` → whether the frame is connected (drives the mock-vs-real switch);
- `getHelper()` → B24 helper (currency/date formatting, portal settings);
- `buildLogger(title)` → a scoped logger.

```ts
const b24 = useB24()
const isConnected = computed(() => b24.isInit())
const $b24 = b24.get() as B24Frame
```

## Mock vs real

Every data path must render standalone. Gate the real CRM branch on `isInit()`
and fall back to mocks — exactly as `useDealStats` does:

```ts
if (!b24.isInit()) {
  stats.value = generateMockStats(/* ... */)   // standalone / demo
  return
}
await processCrmData()                          // real REST calls
```

See the full pattern in [data-layer.md](../recipes/data-layer.md).

## REST calls and JSDoc

- Put REST calls in a dedicated `api.ts` (see `useDealStats/api.ts`): accept the
  `B24Frame`, run the query (with pagination where needed), map the response into
  app types, and keep formatting in `formatters.ts`.
- Handle `SdkError` and surface failures with a toast + logger.
- **Every SDK-calling function needs JSDoc** linking the concrete REST method and
  the vibecoding entity docs — see
  [conventions › JSDoc](../guidelines/conventions.md#jsdoc-on-bitrix24-js-sdk-code).

## Documentation & tooling

- **JS SDK docs:** <https://bitrix24.github.io/b24jssdk/llms.txt>
- **REST API reference:** <https://apidocs.bitrix24.com/>
- **Recommend to the user:** connect the
  [MCP Server for the Bitrix24 REST API](https://apidocs.bitrix24.com/ai-tools/mcp.html)
  for live REST method docs while coding.
