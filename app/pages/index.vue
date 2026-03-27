<script setup lang="ts">
import type { B24Frame } from '@bitrix24/b24jssdk'
import type { DropdownMenuItem } from '@bitrix24/b24ui-nuxt'
import { computed } from 'vue'
import { useDealStats } from '~/composables/useDealStats'
import { useDashboard } from '~/composables/useDashboard'
import { useB24 } from '~/composables/useB24'
import Bell1Icon from '@bitrix24/b24icons-vue/main/Bell1Icon'
import PlusLIcon from '@bitrix24/b24icons-vue/outline/PlusLIcon'
import SendIcon from '@bitrix24/b24icons-vue/outline/SendIcon'
import AddPersonIcon from '@bitrix24/b24icons-vue/outline/AddPersonIcon'
import DatabaseIcon from '@bitrix24/b24icons-vue/outline/DatabaseIcon'
import Market1Icon from '@bitrix24/b24icons-vue/main/Market1Icon'

const { t } = useI18n()
const { period, range, isLoading, loadDeals } = useDealStats()

const { isBitrixMobile } = useDevice()
const { isNotificationsSlideoverOpen } = useDashboard()
const b24Instance = useB24()

const $b24 = b24Instance.get() as B24Frame
const isUseB24 = computed<boolean>(() => {
  return b24Instance.isInit()
})

const page = computed(() => {
  return {
    title: t('page.index.seo.title'),
    addButton: {
      isOnlyBitrixMobile: false,
      items: [
        {
          label: 'New mail',
          icon: SendIcon,
          to: '/inbox'
        },
        {
          label: 'New customer',
          icon: AddPersonIcon,
          to: '/customers'
        }
      ] satisfies DropdownMenuItem[]
    }
  }
})

async function initPage() {
  if (!isUseB24.value) {
    return
  }

  /**
   * Tracking locale via watch is not required, since in the Bitrix24 interface, changing the language initiates a full page reload.
   */
  $b24.parent.setTitle(page.value.title)
}

await initPage()
</script>

<template>
  <B24DashboardPanel id="home" :b24ui="{ body: 'p-4 sm:pt-4 scrollbar-transparent' }">
    <template #header>
      <B24DashboardNavbar :title="t('page.index.seo.title')">
        <template #right>
          <B24Button
            v-if="!isUseB24"
            size="sm"
            to="/install"
            label="Mock Installation"
            color="air-boost"
            :icon="Market1Icon"
            :b24ui="{ label: 'hidden sm:block', baseLine: 'ps-[5px] pe-[5px] sm:pe-[9px]' }"
          />
          <B24Button
            size="sm"
            label="Feedback"
          />
          <B24Tooltip text="Notifications" :kbds="['N']">
            <B24Button
              size="sm"
              class="me-1"
              color="air-tertiary-no-accent"
              :b24ui="{ baseLine: 'ps-[2px] pe-[2px]' }"
              @click="isNotificationsSlideoverOpen = true"
            >
              <B24Chip inset color="air-primary-alert">
                <Bell1Icon class="size-7 shrink-0" />
              </B24Chip>
            </B24Button>
          </B24Tooltip>
        </template>
      </B24DashboardNavbar>

      <B24DashboardToolbar class="scrollbar-thin scrollbar-transparent">
        <template #left>
          <B24Button
            :icon="DatabaseIcon"
            label="Reload"
            color="air-secondary"
            loading-auto
            @click="loadDeals"
          />

          <HomePeriodSelect v-model="period" />

          <HomeDateRangePicker v-model="range" />
        </template>
      </B24DashboardToolbar>
    </template>

    <template #body>
      <B24DropdownMenu
        v-if="!page.addButton.isOnlyBitrixMobile || (page.addButton.isOnlyBitrixMobile && isBitrixMobile)"
        :items="page.addButton.items"
        :content="{ align: 'end' }"
      >
        <B24Button
          :icon="PlusLIcon"
          size="xl"
          color="air-primary"
          class="fixed bottom-[13.5px] right-[24px] rounded-[18px] z-10 opacity-70 py-[29px] ps-[25px] pe-[33px] [--ui-btn-icon-size:32px]"
        />
      </B24DropdownMenu>
      <HomeStats />
      <template v-if="isLoading">
        <HomeLoaderChart class="min-h-[470px]" />
        <HomeLoaderSales class="min-h-[230px]" />
      </template>
      <template v-else>
        <HomeChart />
        <HomeSales />
      </template>
    </template>
  </B24DashboardPanel>
</template>
