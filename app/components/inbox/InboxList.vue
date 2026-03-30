<script setup lang="ts">
import type { Mail } from '../../types'
import { format, isToday } from 'date-fns'

const props = defineProps<{
  mails: Mail[]
}>()

const mailsRefs = ref<Record<number, Element | null>>({})

const selectedMail = defineModel<Mail | null>()

watch(selectedMail, () => {
  if (!selectedMail.value) {
    return
  }
  const ref = mailsRefs.value[selectedMail.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})

defineShortcuts({
  arrowdown: () => {
    const index = props.mails.findIndex((mail: Mail) => mail.id === selectedMail.value?.id)

    if (index === -1) {
      selectedMail.value = props.mails[0]
    } else if (index < props.mails.length - 1) {
      selectedMail.value = props.mails[index + 1]
    }
  },
  arrowup: () => {
    const index = props.mails.findIndex((mail: Mail) => mail.id === selectedMail.value?.id)

    if (index === -1) {
      selectedMail.value = props.mails[props.mails.length - 1]
    } else if (index > 0) {
      selectedMail.value = props.mails[index - 1]
    }
  }
})
</script>

<template>
  <div class="overflow-y-auto divide-y divide-(--ui-color-divider-default) scrollbar-thin">
    <div
      v-for="(mail, index) in mails"
      :key="index"
      :ref="(el) => { mailsRefs[mail.id] = el as Element | null }"
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          selectedMail && selectedMail.id === mail.id
            ? 'border-(--ui-color-design-selection-stroke) bg-(--ui-color-design-selection-bg)'
            : 'border-(--ui-color-divider-accent) hover:border-(--ui-color-design-selection-stroke) hover:bg-(--ui-color-design-selection-bg)'
        ]"
        @click="selectedMail = mail"
      >
        <div class="flex items-center justify-between" :class="[mail.unread && 'font-semibold']">
          <div class="flex items-center gap-3">
            <ProseP small accent="less" class="mb-0">
              {{ mail.from.name }}
            </ProseP>

            <B24Chip v-if="mail.unread" />
          </div>

          <ProseP small accent="less" class="mb-0">
            {{ isToday(new Date(mail.date)) ? format(new Date(mail.date), 'HH:mm') : format(new Date(mail.date), 'dd MMM') }}
          </ProseP>
        </div>
        <ProseP class="mb-0 truncate" :class="[mail.unread ? 'font-semibold text-label' : 'text-legend']">
          {{ mail.subject }}
        </ProseP>
        <ProseP class="mb-0 line-clamp-1 text-description">
          {{ mail.body }}
        </ProseP>
      </div>
    </div>
  </div>
</template>
