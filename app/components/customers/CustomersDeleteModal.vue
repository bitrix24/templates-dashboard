<script setup lang="ts">
import { sleepAction } from '../../utils'

withDefaults(defineProps<{
  count?: number
}>(), {
  count: 0
})

const open = ref(false)

async function onSubmit() {
  await sleepAction(1000)
  open.value = false
}
</script>

<template>
  <B24Modal
    v-model:open="open"
    :title="`Confirm deletion of ${count} customer${count > 1 ? 's' : ''}?`"
    :close="false"
    :b24ui="{ content: 'max-w-[420px]' }"
  >
    <slot />

    <template #body>
      <ProseP accent="less">
        Proceeding will result in complete loss of all customer data.
      </ProseP>
      <div class="mt-4.5 mb-4 flex items-center justify-center gap-2.5">
        <B24Button
          label="Confirm"
          color="air-primary"
          size="lg"
          loading-auto
          block
          @click="onSubmit"
        />
        <B24Button
          label="Cancel"
          color="air-secondary-accent"
          block
          @click="open = false"
        />
      </div>
    </template>
  </B24Modal>
</template>
