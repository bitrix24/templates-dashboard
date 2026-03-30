<script setup lang="ts">
import type { Mail } from '../types'
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
import MailOpenIcon from '@bitrix24/b24icons-vue/outline/MailOpenIcon'

const tabItems = [{
  label: 'All',
  value: 'all'
}, {
  label: 'Unread',
  value: 'unread'
}]
const selectedTab = ref('all')

const { data: mails } = await useFetch<Mail[]>('/api/mails', { default: () => [] })

// Filter mails based on the selected tab
const filteredMails = computed(() => {
  if (selectedTab.value === 'unread') {
    return mails.value.filter(mail => !!mail.unread)
  }

  return mails.value
})

const selectedMail = ref<Mail | null>()

const isMailPanelOpen = computed({
  get() {
    return !!selectedMail.value
  },
  set(value: boolean) {
    if (!value) {
      selectedMail.value = null
    }
  }
})

// Reset selected mail if it's not in the filtered mails
watch(filteredMails, () => {
  if (!filteredMails.value.find(mail => mail.id === selectedMail.value?.id)) {
    selectedMail.value = null
  }
})

// @todo fix this
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
</script>

<template>
  <B24DashboardPanel
    id="inbox-1"
    :default-size="320"
    :min-size="400"
    :max-size="480"
    resizable
    class="base-mode bg-(--ui-color-bg-content-primary)"
  >
    <B24DashboardNavbar
      title="Inbox"
      class="border-b border-(--ui-color-divider-default)"
    >
      <template #trailing>
        <B24Badge :label="filteredMails.length" color="air-secondary" />
      </template>

      <template #right>
        <B24Tabs
          v-model="selectedTab"
          :items="tabItems"
          :content="false"
          size="xs"
        />
      </template>
    </B24DashboardNavbar>

    <InboxList v-model="selectedMail" :mails="filteredMails" />
  </B24DashboardPanel>

  <InboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
  <div v-else class="hidden base-mode bg-(--ui-color-bg-content-primary) lg:flex flex-1 items-center justify-center border-s border-(--ui-color-divider-default)">
    <MailOpenIcon class="size-64 text-dimmed" />
  </div>

  <B24Modal
    v-if="isMobile"
    v-model:open="isMailPanelOpen"
    fullscreen
    :b24ui="{
      content: 'p-0 pt-0'
    }"
  >
    <template #content>
      <InboxMail v-if="selectedMail" :mail="selectedMail" @close="selectedMail = null" />
    </template>
  </B24Modal>
</template>
