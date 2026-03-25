<script setup lang="ts">
import type { IStep } from '../types'
import type { ProgressProps } from '@bitrix24/b24ui-nuxt'
import type { B24Frame } from '@bitrix24/b24jssdk'
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// @todo test this ////
// import { definePage } from 'vue-router/auto'
import { useI18n } from 'vue-i18n'
import { useHead } from '@unhead/vue'
import { useB24 } from '../composables/useB24'
import { sleepAction } from '../utils'
// import { withoutTrailingSlash } from 'ufo'
import Market1Icon from '@bitrix24/b24icons-vue/main/Market1Icon'

definePageMeta({
  layout: 'clear'
})

const { t } = useI18n()
useHead({ title: t('page.install.seo.title') })
// definePage({ meta: { layout: 'clear' } })

// region Init ////
const router = useRouter()
const toast = useToast()
const confetti = useConfetti()
const b24Instance = useB24()

const $b24 = b24Instance.get() as B24Frame
const isUseB24 = computed<boolean>(() => {
  return b24Instance.isInit()
})

const isShowDebug = ref(false)
const progressColor = ref<ProgressProps['color']>('air-primary')
const progressValue = ref<null | number>(null)
// endregion ////

// region Steps ////
/**
 * @todo add jsDocs
 * @todo refactor code
 */
const steps = ref<Record<string, IStep>>({
  init: {
    caption: t('page.install.step.init.caption'),
    action: makeInit
  },
  // events: {
  //   caption: t('page.install.step.events.caption'),
  //   action: async () => {
  //     /**
  //      * Registering onAppInstall | onAppUninstall
  //      */
  //     await $b24.callBatch([
  //       {
  //         method: 'event.unbind',
  //         params: {
  //           event: 'ONAPPINSTALL',
  //           handler: `${appUrl}/api/event/onAppInstall`
  //         }
  //       },
  //       {
  //         method: 'event.unbind',
  //         params: {
  //           event: 'ONAPPUNINSTALL',
  //           handler: `${appUrl}/api/event/onAppUninstall`
  //         }
  //       },
  //       {
  //         method: 'event.bind',
  //         params: {
  //           event: 'ONAPPINSTALL',
  //           handler: `${appUrl}/api/event/onAppInstall`
  //         }
  //       },
  //       {
  //         method: 'event.bind',
  //         params: {
  //           event: 'ONAPPUNINSTALL',
  //           handler: `${appUrl}/api/event/onAppUninstall`
  //         }
  //       }
  //     ])
  //   }
  // },
  // placement: {
  //   caption: t('page.install.step.placement.caption'),
  //   action: async () => {
  //     const key = {
  //       placement: 'CRM_DEAL_DETAIL_TAB',
  //       handler: `${appUrl}/handler/placement-crm-deal-detail-tab`
  //     }
  //     const exists = (steps.value.init?.data?.placementList as { placement: string, handler: string }[]).some(item => item.placement === key.placement && item.handler === key.handler )
  //     if (exists) {
  //       await $b24.actions.v2.batch.make({
  //         calls: [
  //           {
  //             method: 'placement.unbind',
  //             params: {
  //               PLACEMENT: key.placement
  //             }
  //           },
  //           {
  //             method: 'placement.bind',
  //             params: {
  //               PLACEMENT: key.placement,
  //               HANDLER: key.handler,
  //               TITLE: '[demo] Some Tab',
  //               OPTIONS: {
  //                 errorHandlerUrl: `${appUrl}/handler/background-some-problem`
  //               }
  //             }
  //           }
  //         ],
  //         options: {
  //           isHaltOnError: true
  //         }
  //       })
  //
  //       return
  //     }
  //
  //     await $b24.actions.v2.batch.make({
  //       calls: [
  //         {
  //           method: 'placement.bind',
  //           params: {
  //             PLACEMENT: key.placement,
  //             HANDLER: key.handler,
  //             TITLE: '[demo] Some Tab',
  //             OPTIONS: {
  //               errorHandlerUrl: `${appUrl}/handler/background-some-problem`
  //             }
  //           }
  //         }
  //       ],
  //       options: {
  //         isHaltOnError: true
  //       }
  //     })
  //   }
  // },
  // userFields: {
  //   caption: t('page.install.step.userFields.caption'),
  //   action: async () => {
  //     const typeId = `some_type_${import.meta.dev ? 'dev' : 'prod'}`
  //
  //     const exists = (steps.value.init?.data?.userFieldTypeList as { USER_TYPE_ID: string }[]).some(item => item.USER_TYPE_ID === typeId)
  //     if (exists) {
  //       await $b24.callBatch([
  //         {
  //           method: 'userfieldtype.update',
  //           params: {
  //             USER_TYPE_ID: typeId,
  //             HANDLER: `${appUrl}/handler/uf.demo`,
  //             TITLE: `[${import.meta.dev ? 'dev' : 'prod'}] Some Type`,
  //             DESCRIPTION: `Some Description`,
  //             OPTIONS: {
  //               height: 105
  //             }
  //           }
  //         }
  //       ], false)
  //
  //       return
  //     }
  //
  //     await $b24.callBatch([
  //       {
  //         method: 'userfieldtype.add',
  //         params: {
  //           USER_TYPE_ID: typeId,
  //           HANDLER: `${appUrl}/handler/uf.demo`,
  //           TITLE: `[${import.meta.dev ? 'dev' : 'prod'}] Some Type`,
  //           DESCRIPTION: `Some Description`,
  //           OPTIONS: {
  //             height: 105
  //           }
  //         }
  //       }
  //     ], false)
  //   }
  // },
  // crm: {
  //   caption: t('page.install.step.crm.caption'),
  //   action: async () => {
  //     /**
  //      * Some actions for crm
  //      */
  //     if (steps.value.crm) {
  //       steps.value.crm.data = {
  //         par31: 'val31',
  //         par32: 'val32'
  //       }
  //     }
  //     return sleepAction()
  //   }
  // },
  serverSide: {
    caption: t('page.install.step.serverSide.caption'),
    action: async () => {
      const authData = $b24.auth.getAuthData()

      if(authData === false) {
        throw new Error('Some problem with auth. See App logic')
      }

      // await apiStore.postInstall({
      //   DOMAIN: withoutTrailingSlash(authData.domain).replace('https://', '').replace('http://', ''),
      //   PROTOCOL: authData.domain.includes('https://') ? 1 : 0,
      //   LICENSE: steps.value.init?.data?.appInfo.LICENSE,
      //   LICENSE_FAMILY: steps.value.init?.data?.appInfo.LICENSE_FAMILY,
      //   LANG: $b24.getLang(),
      //   APP_SID: $b24.getAppSid(),
      //   AUTH_ID: authData.access_token,
      //   AUTH_EXPIRES: authData.expires_in,
      //   REFRESH_ID: authData.refresh_token,
      //   REFRESH_TOKEN: authData.refresh_token,
      //   member_id: authData.member_id,
      //   user_id: Number(steps.value.init?.data?.profile.ID),
      //   status: steps.value.init?.data?.appInfo.STATUS,
      //   appVersion: Number(steps.value.init?.data?.appInfo.VERSION),
      //   appCode: steps.value.init?.data?.appInfo.CODE,
      //   appId: Number(steps.value.init?.data?.appInfo.ID),
      //   PLACEMENT: $b24.placement.title,
      //   PLACEMENT_OPTIONS: $b24.placement.options
      // })
    }
  },
  finish: {
    caption: t('page.install.step.finish.caption'),
    action: makeFinish
  }
})
const stepCode = ref<string>('init' as const)
// endregion ////

// region Actions ////
async function makeInit(): Promise<void> {
  if (!isUseB24.value) {
    return
  }

  $b24.parent.setTitle(t('page.install.seo.title'))

  if (steps.value.init) {
    const response = await $b24.callBatch({
      appInfo: { method: 'app.info' },
      profile: { method: 'profile' },
      userFieldTypeList: { method: 'userfieldtype.list' },
      placementList: { method: 'placement.get' }
    })

    steps.value.init.data = response.getData() as {
      appInfo: {
        ID: number
        CODE: string
        VERSION: string
        STATUS: string
        LICENSE: string
        LICENSE_FAMILY: string
        INSTALLED: boolean
      },
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
  }
}

async function makeFinish(): Promise<void> {
  if (!isUseB24.value) {
    return
  }

  progressColor.value = 'air-primary-success'
  progressValue.value = 100

  confetti.fire()
  await sleepAction(3000)

  await $b24.installFinish()
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

      for (const key of Object.keys(steps.value)) {
        stepCode.value = key
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

    await $b24.parent.setTitle(t('page.install.seo.title'))

    for (const [key, step] of Object.entries(steps.value)) {
      stepCode.value = key
      await step.action()
    }
  } catch (error: unknown) {
    console.error(error)
    throw error
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
      <Logo
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
