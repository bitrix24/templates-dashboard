<script setup lang="ts">
import type { Notification } from '~/types'
import { formatTimeAgo } from '@vueuse/core'

const { isNotificationsSlideoverOpen, isBxMobile } = useDashboard()

const { data: notifications } =  await useFetch<Notification[]>('/api/notifications')
</script>

<template>
  <B24Slideover
    v-model:open="isNotificationsSlideoverOpen"
    title="Notifications"
    :inset="isBxMobile"
    :b24ui="{
      content: 'sm:max-w-[470px]',
      body: 'scrollbar-thin scrollbar-transparent'
    }"
  >
    <template #body>
      <B24Card class="base-mode" :b24ui="{ body: '!px-0 !py-0' }">
        <NuxtLink
          v-for="notification in notifications"
          :key="notification.id"
          :to="`/inbox?id=${notification.id}`"
          class="relative flex items-start px-3 py-2 hover:bg-(--ui-color-bg-content-secondary) border-b border-(--ui-color-divider-default) last:border-b-0"
        >
          <B24Chip
            color="air-primary-alert"
            :show="!!notification.unread"
            inset
          >
            <B24Avatar
              v-bind="notification.sender.avatar"
              :alt="notification.sender.name"
              size="lg"
              class="flex-shrink-0 mt-0.5"
            />
          </B24Chip>
          <div class="ms-2 flex-grow overflow-hidden">
            <div class="flex justify-between items-baseline">
              <ProseH6 class="mb-0 truncate text-label font-bold">
                {{ notification.sender.name }}
              </ProseH6>
              <time
                :datetime="notification.date"
                class="text-(length:--ui-font-size-xs) text-description"
                v-text="formatTimeAgo(new Date(notification.date))"
              />
            </div>
            <p class="text-sm text-description text-pretty mt-0.5">
              {{ notification.body }}
            </p>
          </div>
        </NuxtLink>
      </B24Card>
    </template>
  </B24Slideover>
</template>
