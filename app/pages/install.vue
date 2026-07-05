<script setup lang="ts">
/**
 * Bitrix24 application install page (client-only).
 *
 * Based on the reference implementation in `bitrix24/b24-ai-starter`:
 * https://github.com/bitrix24/b24-ai-starter/blob/main/frontend/app/pages/install.client.vue
 *
 * IMPORTANT — intentional difference: this template is **client-only**, so the
 * reference's `serverSide` phase (posting the auth tokens / license to a backend
 * via `apiStore.postInstall()`) is deliberately omitted. Everything here runs
 * inside the Bitrix24 frame on the client. Do not re-add a server-side step
 * unless this template gains a backend.
 *
 * Install flow: init → placement → userFields → finish. Without a Bitrix24 frame
 * (standalone / demo mode) the steps are simulated and the user is redirected home.
 */
import type { IStep } from '../types'
import type { ProgressProps } from '@bitrix24/b24ui-nuxt'
import type { B24Frame } from '@bitrix24/b24jssdk'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { withoutTrailingSlash } from 'ufo'
import { useB24 } from '../composables/useB24'
import { sleepAction } from '../utils'
import Market1Icon from '@bitrix24/b24icons-vue/main/Market1Icon'
import CloudErrorIcon from '@bitrix24/b24icons-vue/main/CloudErrorIcon'

definePageMeta({
  layout: 'clear'
})

const { t } = useI18n()
useHead({ title: t('page.install.seo.title') })

// region Init ////
const router = useRouter()
const toast = useToast()
const confetti = useConfetti()
const b24Instance = useB24()
const $logger = b24Instance.buildLogger('install')

const isUseB24 = computed<boolean>(() => b24Instance.isInit())

/**
 * Base app URL used to build placement / user-field handler URLs. Comes from the
 * public runtime config (`NUXT_PUBLIC_SITE_URL`).
 */
const appUrl = withoutTrailingSlash(useRuntimeConfig().public.siteUrl || '')

const isShowDebug = ref(false)
const progressColor = ref<ProgressProps['color']>('air-primary')
const progressValue = ref<null | number>(null)

/**
 * Returns the active B24Frame instance, fetched at call time. The frame may not
 * exist yet when the component is created, so it must never be cached at setup.
 * Call only behind the `isUseB24` guard (the step actions below all do).
 *
 * @returns the initialized B24Frame instance
 * @throws {Error} when the Bitrix24 frame is not initialized
 */
function requireB24(): B24Frame {
  const b24 = b24Instance.get()
  if (!b24) {
    throw new Error('Bitrix24 frame is not initialized')
  }
  return b24
}
// endregion ////

// region Types ////
interface InstallInitData {
  // Index signature so the object is assignable to IStep['data'] (Record<string, unknown>).
  [key: string]: unknown
  appInfo: {
    ID: number
    CODE: string
    VERSION: string
    STATUS: string
    LICENSE: string
    LICENSE_FAMILY: string
    INSTALLED: boolean
  }
  profile: {
    ID: number
    ADMIN: boolean
    LAST_NAME?: string
    NAME?: string
  }
  userFieldTypeList: {
    USER_TYPE_ID: string
    HANDLER: string
    TITLE: string
    DESCRIPTION: string
  }[]
  placementList: {
    placement: string
    userId: number
    handler: string
    options: unknown
    title: string
    description: string
  }[]
}
// endregion ////

// region Steps ////
const steps = ref<Record<string, IStep>>({
  init: {
    caption: t('page.install.step.init.caption'),
    action: makeInit
  },
  placement: {
    caption: t('page.install.step.placement.caption'),
    action: makePlacement
  },
  userFields: {
    caption: t('page.install.step.userFields.caption'),
    action: makeUserFields
  },
  finish: {
    caption: t('page.install.step.finish.caption'),
    action: makeFinish
  }
})
const stepCode = ref<string>('init' as const)
// endregion ////

// region Actions ////
/**
 * Loads app context (app info, profile, user-field types, placements) so the
 * later steps can decide whether to bind or update.
 */
async function makeInit(): Promise<void> {
  if (!isUseB24.value) {
    return
  }

  const b24 = requireB24()
  await b24.parent.setTitle(t('page.install.seo.title'))

  if (steps.value.init) {
    const response = await b24.callBatch({
      appInfo: { method: 'app.info' },
      profile: { method: 'profile' },
      userFieldTypeList: { method: 'userfieldtype.list' },
      placementList: { method: 'placement.get' }
    })

    steps.value.init.data = response.getData() as unknown as InstallInitData
  }
}

/**
 * Binds (or re-binds) the demo CRM deal-detail-tab placement. Re-binding first
 * unbinds an existing handler so the install stays idempotent.
 */
async function makePlacement(): Promise<void> {
  if (!isUseB24.value) {
    return
  }

  const b24 = requireB24()
  const placement = 'CRM_DEAL_DETAIL_TAB'
  const handler = `${appUrl}/handler/placement-crm-deal-detail-tab`
  const placementList = (steps.value.init?.data as InstallInitData | undefined)?.placementList ?? []
  const exists = placementList.some(item => item.placement === placement && item.handler === handler)

  const calls = [
    ...(exists ? [{ method: 'placement.unbind', params: { PLACEMENT: placement } }] : []),
    {
      method: 'placement.bind',
      params: {
        PLACEMENT: placement,
        HANDLER: handler,
        TITLE: '[demo] Some Tab',
        OPTIONS: {
          errorHandlerUrl: `${appUrl}/handler/background-some-problem`
        }
      }
    }
  ]

  await b24.callBatch(calls, true)
}

/**
 * Adds (or updates) the demo custom user-field type.
 */
async function makeUserFields(): Promise<void> {
  if (!isUseB24.value) {
    return
  }

  const b24 = requireB24()
  const env = import.meta.dev ? 'dev' : 'prod'
  const typeId = `some_type_${env}`
  const typeList = (steps.value.init?.data as InstallInitData | undefined)?.userFieldTypeList ?? []
  const exists = typeList.some(item => item.USER_TYPE_ID === typeId)

  await b24.callBatch([
    {
      method: exists ? 'userfieldtype.update' : 'userfieldtype.add',
      params: {
        USER_TYPE_ID: typeId,
        HANDLER: `${appUrl}/handler/uf.demo`,
        TITLE: `[${env}] Some Type`,
        DESCRIPTION: 'Some Description',
        OPTIONS: {
          height: 105
        }
      }
    }
  ], false)
}

/**
 * Completes the installation: success animation, then `installFinish()` so
 * Bitrix24 marks the app installed.
 */
async function makeFinish(): Promise<void> {
  if (!isUseB24.value) {
    return
  }

  progressColor.value = 'air-primary-success'
  progressValue.value = 100

  confetti.fire()
  await sleepAction(3000)

  await requireB24().installFinish()
}

const stepsData = computed(() => {
  return Object.entries(steps.value).map(([index, row]) => {
    return {
      step: index,
      data: row?.data
    }
  })
})
// endregion ////

// region Lifecycle Hooks ////
onMounted(async () => {
  const stepKeys = Object.keys(steps.value)

  try {
    if (!isUseB24.value) {
      // region mock ////
      toast.add({
        id: 'install-warning-mock',
        title: t('mock.toast.title'),
        description: t('mock.toast.description'),
        icon: Market1Icon,
        color: 'air-primary-warning',
        duration: 0,
        close: false
      })

      let mockIndex = 0
      for (const key of stepKeys) {
        stepCode.value = key
        progressValue.value = Math.round((++mockIndex / stepKeys.length) * 99)
        await sleepAction(600)
      }

      progressColor.value = 'air-primary-warning'
      progressValue.value = 99

      confetti.fire()
      await sleepAction(3000)

      toast.remove('install-warning-mock')
      return router.replace('/')
      // endregion ////
    }

    let index = 0
    for (const [key, step] of Object.entries(steps.value)) {
      stepCode.value = key
      // Leave the final 100% to makeFinish so the success color lands with it.
      if (key !== 'finish') {
        progressValue.value = Math.round((index / stepKeys.length) * 100)
      }
      await step.action()
      index++
    }
  } catch (error: unknown) {
    progressColor.value = 'air-primary-alert'
    $logger.error('Install failed', { error })
    toast.add({
      title: t('page.install.toast.errorTitle'),
      description: error instanceof Error ? error.message : String(error),
      icon: CloudErrorIcon,
      color: 'air-primary-alert',
      duration: 0
    })
  }
})
// endregion ////
</script>

<template>
  <B24DashboardPanel
    id="install"
    :b24ui="{ body: 'p-4 sm:pt-4 items-center justify-center gap-1 sm:gap-1 scrollbar-transparent' }"
  >
    <template #body>
      <AppLogo
        class="size-[208px]"
        :class="[stepCode === 'finish' ? 'text-(--ui-color-accent-main-success)' : 'text-(--ui-color-accent-soft-green-1)']"
      />
      <B24Progress
        v-model="progressValue"
        size="xs"
        animation="elastic"
        :color="progressColor"
        class="w-1/2 sm:w-1/3"
      />
      <div class="mt-6 flex flex-col items-center justify-center gap-2">
        <ProseH1 class="text-nowrap mb-0">
          {{ $t('page.install.ui.title') }}
        </ProseH1>
        <ProseP small accent="less">
          {{ steps[stepCode]?.caption || '...' }}
        </ProseP>
      </div>

      <ProsePre v-if="isShowDebug">
        {{ stepsData }}
      </ProsePre>
    </template>
  </B24DashboardPanel>
</template>
