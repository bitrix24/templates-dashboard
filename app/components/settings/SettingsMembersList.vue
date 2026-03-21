<script setup lang="ts">
import type { Member } from '../../types'
import type { DropdownMenuItem } from '@bitrix24/b24ui-nuxt'
import MoreVerticalLIcon from '@bitrix24/b24icons-vue/outline/MoreVerticalLIcon'
import PersonSettingsIcon from '@bitrix24/b24icons-vue/outline/PersonSettingsIcon'
import TrashcanIcon from '@bitrix24/b24icons-vue/outline/TrashcanIcon'

defineProps<{
  members: Member[]
}>()

const items = [
  {
    label: 'Edit member',
    icon: PersonSettingsIcon,
    onSelect: () => console.log('Edit member')
  },
  {
    label: 'Remove member',
    color: 'air-primary-alert' as const,
    icon: TrashcanIcon,
    onSelect: () => console.log('Remove member')
  }
] satisfies DropdownMenuItem[]
</script>

<template>
  <ul role="list" class="w-full sm:max-w-full divide-y divide-(--ui-color-divider-accent) dark:divide-(--ui-color-divider-default)">
    <li
      v-for="(member, index) in members"
      :key="index"
      class="flex items-center justify-between gap-3 py-3 px-2 sm:px-6"
    >
      <div class="flex items-center gap-3 min-w-0">
        <B24Avatar
          v-bind="member.avatar"
          size="md"
        />

        <div class="text-sm min-w-0">
          <p class="text-highlighted font-medium truncate">
            {{ member.name }}
          </p>
          <p class="text-muted truncate">
            {{ member.username }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1.5">
        <B24Select
          :model-value="member.role"
          :items="['member', 'owner']"
          size="sm"
          :content="{ align: 'end', side: 'bottom' }"
          :b24ui="{ value: 'capitalize', item: 'capitalize' }"
        />

        <B24DropdownMenu
          :items="items"
          :content="{ align: 'end', side: 'bottom', sideOffset: -2 }"
        >
          <B24Button
            :icon="MoreVerticalLIcon"
            color="air-tertiary"
          />
        </B24DropdownMenu>
      </div>
    </li>
  </ul>
</template>
