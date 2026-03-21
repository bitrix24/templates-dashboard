<script setup lang="ts">
import type { Mail } from '../../types'
import type { DropdownMenuItem } from '@bitrix24/b24ui-nuxt'
import { ref } from 'vue'
import { format } from 'date-fns'
import { sleepAction } from '../../utils'
import CircleCheckIcon from '@bitrix24/b24icons-vue/outline/CircleCheckIcon'
import CrossLIcon from '@bitrix24/b24icons-vue/outline/CrossLIcon'
import MoveToIcon from '@bitrix24/b24icons-vue/outline/MoveToIcon'
import ReplyIcon from '@bitrix24/b24icons-vue/outline/ReplyIcon'
import MoreVerticalLIcon from '@bitrix24/b24icons-vue/outline/MoreVerticalLIcon'
import AttachIcon from '@bitrix24/b24icons-vue/outline/AttachIcon'
import SendIcon from '@bitrix24/b24icons-vue/outline/SendIcon'
import AlertAccentIcon from '@bitrix24/b24icons-vue/outline/AlertAccentIcon'
import SoundOffIcon from '@bitrix24/b24icons-vue/outline/SoundOffIcon'
import ChatsIcon from '@bitrix24/b24icons-vue/outline/ChatsIcon'
import Favorite0Icon from '@bitrix24/b24icons-vue/main/Favorite0Icon'

defineProps<{
  mail: Mail
}>()

const emits = defineEmits(['close'])

const dropdownItems = [
  { label: 'Mark as unread', icon: ChatsIcon },
  { label: 'Mark as important', icon: AlertAccentIcon },
  { type: 'separator' },
  { label: 'Add to Favorites', icon: Favorite0Icon },
  { label: 'Mute', icon: SoundOffIcon }
] as DropdownMenuItem[]

const toast = useToast()

const reply = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true

  await sleepAction(1000)
  toast.add({
    title: 'Email sent',
    description: 'Your email has been sent successfully',
    icon: CircleCheckIcon,
    color: 'air-primary-success'
  })

  reply.value = ''
  loading.value = false
}
</script>

<template>
  <B24DashboardPanel id="inbox-2" class="base-mode bg-(--ui-color-bg-content-primary) lg:border-e lg:border-(--ui-color-divider-default)">
    <B24DashboardNavbar
      :title="mail.subject"
      :toggle="false"
      class="border-b border-(--ui-color-divider-default)"
    >
      <template #leading>
        <B24Button
          :icon="CrossLIcon"
          color="air-tertiary-no-accent"
          class="-ms-1.5"
          @click="emits('close')"
        />
      </template>

      <template #right>
        <B24Tooltip text="Archive">
          <B24Button
            :icon="MoveToIcon"
            color="air-tertiary-no-accent"
          />
        </B24Tooltip>

        <B24Tooltip text="Reply">
          <B24Button
            :icon="ReplyIcon"
            color="air-tertiary-no-accent"
          />
        </B24Tooltip>

        <B24DropdownMenu
          :items="dropdownItems"
          :content="{ align: 'end', side: 'bottom', sideOffset: -2 }"
        >
          <B24Button
            :icon="MoreVerticalLIcon"
            color="air-tertiary-no-accent"
          />
        </B24DropdownMenu>
      </template>
    </B24DashboardNavbar>

    <div class="flex flex-row justify-between gap-2 p-3 sm:px-6 sm:py-4 border-b border-(--ui-color-divider-default)">
      <div class="flex items-start gap-4 sm:my-1.5">
        <B24Avatar
          v-bind="mail.from.avatar"
          :alt="mail.from.name"
          size="md"
          class="mt-1"
        />

        <div class="min-w-0">
          <ProseP accent="default" class="mb-0 font-semibold">
            {{ mail.from.name }}
          </ProseP>
          <ProseP accent="less" small class="mb-0">
            {{ mail.from.email }}
          </ProseP>
        </div>
      </div>

      <ProseP accent="less-more" small class="mb-0 sm:mt-2">
        {{ format(new Date(mail.date), 'dd MMM HH:mm') }}
      </ProseP>
    </div>

    <div class="shrink-0 max-h-[250px] bitrix-mobile:max-h-[230px] p-3 sm:p-6 sm:py-4 sm:max-h-max overflow-y-auto scrollbar-thin">
      <ProseP class="whitespace-pre-wrap">
        {{ mail.body }}
      </ProseP>
    </div>

    <!-- @todo: B24PageCard after UI update fix :b24ui -->
    <B24Card
      variant="tinted-no-accent"
      class="base-mode mt-auto mx-2 mb-2 flex-1 max-sm:max-h-[250px] md:max-h-[230px] "
      :b24ui="{
        root: 'dark:bg-(--ui-color-base-black-fixed) bg-(--ui-color-gray-02)',
        header: 'p-3 sm:p-3 flex items-center gap-1.5',
        body: 'p-0 sm:p-0 '
      }"
    >
      <template #header>
        <ReplyIcon class="size-5" />

        <span class="text-sm truncate">
          Reply to {{ mail.from.name }} ({{ mail.from.email }})
        </span>
      </template>

      <form @submit.prevent="onSubmit">
        <B24Textarea
          v-model="reply"
          required
          :autoresize="false"
          placeholder="Write your reply..."
          padding
          no-border
          :rows="6"
          :maxrows="6"
          :disabled="loading"
          class="w-full"
          :b24ui="{ base: 'resize-none' }"
        />

        <div class="flex items-center justify-between px-3 py-0.5">
          <B24Tooltip text="Attach file">
            <B24Button
              color="air-tertiary-no-accent"
              :disabled="loading"
              :icon="AttachIcon"
            />
          </B24Tooltip>

          <div class="flex items-center justify-end gap-2">
            <B24Button
              color="air-tertiary-no-accent"
              :disabled="loading"
              label="Save draft"
            />
            <B24Button
              type="submit"
              color="air-primary"
              :loading="loading"
              label="Send"
              :icon="SendIcon"
            />
          </div>
        </div>
      </form>
    </B24Card>
  </B24DashboardPanel>
</template>
