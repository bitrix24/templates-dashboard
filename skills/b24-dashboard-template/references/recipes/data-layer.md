# Recipe: wire the data layer (mock → real CRM)

The template must render **standalone on mock data** and, on the REST-API target,
read real CRM data through the same interface. Build the mock path first, then
layer the real path behind it. The reference implementation is
`app/composables/useDealStats/`.

> On the **Vibecoding** target there is no JS SDK — implement the mock path only
> and stop after step 2.

## Option A — simple list (server mock)

For static/list data, a Nitro endpoint + `useFetch` is enough:

1. `server/api/<name>.json.get.ts`:

   ```ts
   import type { User } from '~/types'

   const rows: User[] = [ /* typed fixtures */ ]
   export default eventHandler(async () => rows)
   ```

2. Read it in the page:

   ```ts
   const { data, status } = await useFetch<User[]>('/api/<name>.json', { lazy: true })
   ```

3. If the route is prerendered, add `/api/<name>.json` to
   `nitro.prerender.routes` in `nuxt.config.ts`.

## Option B — CRM data with mock fallback (composable)

For data that comes from the CRM on the REST-API target, mirror the
`useDealStats/` structure — split by responsibility:

```
app/composables/use<Feature>/
├── index.ts       # public composable: state, mock-vs-real switch, computed for template
├── api.ts         # B24 REST calls (accept B24Frame; JSDoc + REST/vibecode links)
├── formatters.ts  # locale-aware formatting (currency, dates, stripTags)
├── helpers.ts     # pure data shaping (ranges, chart building, sorting)
└── mocks.ts       # generateMock*(): standalone/demo data
```

### The mock-vs-real switch

Gate the real branch on `useB24().isInit()` and fall back to mocks:

```ts
import type { B24Frame } from '@bitrix24/b24jssdk'
import { createSharedComposable } from '@vueuse/core'
import { useB24 } from '../useB24'
import { fetchInRange } from './api'
import { generateMock } from './mocks'

const _useFeature = () => {
  const b24 = useB24()
  const isConnected = computed(() => b24.isInit())
  const rows = ref([])

  async function load() {
    if (!isConnected.value) {
      rows.value = generateMock()          // standalone / demo
      return
    }
    const $b24 = b24.get() as B24Frame
    rows.value = await fetchInRange($b24)  // real REST
  }

  return { rows, load }
}

export const useFeature = createSharedComposable(_useFeature)
```

### `api.ts` requirements

- Accept the `B24Frame`; paginate where the CRM returns many rows.
- Map raw responses into `app/types` shapes; keep formatting out (that's
  `formatters.ts`).
- Catch `SdkError`; surface failures via `useToast()` + `buildLogger()`.
- **JSDoc on every SDK-calling function**, linking the concrete REST method
  (<https://apidocs.bitrix24.com/>) and the vibecoding entity docs
  (<https://vibecode.bitrix24.tech/docs/entities/…>). See
  [conventions › JSDoc](../guidelines/conventions.md#jsdoc-on-bitrix24-js-sdk-code).

## Checklist

```
- [ ] Renders standalone on mock data (mock path first)
- [ ] Real CRM path gated on useB24().isInit(); same return shape as mock
- [ ] Composable split api/formatters/helpers/mocks/index (Option B)
- [ ] Types in app/types; imported via ~/types
- [ ] SDK functions carry JSDoc with REST + vibecode links (REST-API target)
- [ ] pnpm lint && pnpm typecheck pass
```
