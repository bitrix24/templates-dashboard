<script setup lang="ts">
defineProps<{
  title: string
}>()

const emit = defineEmits<{
  close: [confirmed: boolean]
}>()
</script>

<template>
  <B24Modal
    :title="title"
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
          @click="emit('close', true)"
        />
        <B24Button
          label="Cancel"
          color="air-secondary-accent"
          block
          @click="emit('close', false)"
        />
      </div>
    </template>
  </B24Modal>
</template>
