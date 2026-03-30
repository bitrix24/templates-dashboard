<script setup lang="ts">
import type { Member } from '../../types'
import SearchIcon from '@bitrix24/b24icons-vue/outline/SearchIcon'

const { data: members } = await useFetch<Member[]>('/api/members', { default: () => [] })

const q = ref('')

const filteredMembers = computed(() => {
  return members.value.filter((member) => {
    return member.name.search(new RegExp(q.value, 'i')) !== -1 || member.username.search(new RegExp(q.value, 'i')) !== -1
  })
})
</script>

<template>
  <div>
    <!-- @todo: B24PageCard after UI update fix :b24ui -->
    <B24PageCard
      title="Members"
      description="Invite new members by email address."
      variant="tinted-alt"
      orientation="horizontal"
      class="mb-0 base-mode "
      :b24ui="{
        root: 'rounded-none sm:rounded-t-3xl',
        container: 'py-4 sm:py-2 items-center grid grid-cols-[1fr_auto]',
        title: 'text-(--ui-color-palette-gray-70)',
        description: 'text-(--ui-color-palette-gray-70)'
      }"
    >
      <SettingIcon class="flex-1 ml-auto size-[80px]" />
    </B24PageCard>
    <B24PageCard
      variant="outline-no-accent"
      class="base-mode"
      :b24ui="{
        root: 'rounded-none sm:rounded-b-3xl',
        container: 'p-0 sm:p-0 gap-y-0 mb-4',
        wrapper: 'items-stretch',
        header: 'p-4 mb-0 border-b border-(--ui-color-divider-accent) dark:border-(--ui-color-divider-default)'
      }"
    >
      <template #header>
        <div class="flex flex-row flex-nowrap gap-2">
          <B24Input
            v-model="q"
            :icon="SearchIcon"
            placeholder="Search members"
            autofocus
            class="w-full"
          />
          <B24Button
            label="Invite"
            color="air-primary"
            class="w-fit lg:ms-auto"
          />
        </div>
      </template>

      <SettingsMembersList :members="filteredMembers" />
    </B24PageCard>
  </div>
</template>
