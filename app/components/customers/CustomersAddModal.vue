<script setup lang="ts">
import type { FormSubmitEvent } from '@bitrix24/b24ui-nuxt'
import * as z from 'zod'
import CheckLIcon from '@bitrix24/b24icons-vue/outline/CheckLIcon'
import PlusLIcon from '@bitrix24/b24icons-vue/outline/PlusLIcon'

const toast = useToast()

const schema = z.object({
  name: z.string().min(2, 'Too short'),
  email: z.email('Invalid email')
})
const open = ref(false)

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: '',
  email: ''
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  toast.add({ title: 'Success', description: `New customer ${event.data.name} added`, icon: CheckLIcon, color: 'air-primary-success' })
  open.value = false
}
</script>

<template>
  <B24Modal v-model:open="open" title="New customer" description="Add a new customer to the CRM">
    <B24Button label="New customer" color="air-primary" :icon="PlusLIcon" />

    <template #body>
      <B24Form
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <B24FormField label="Name" name="name">
          <B24Input v-model="state.name" placeholder="John Doe" class="w-full" />
        </B24FormField>
        <B24FormField label="Email" name="email">
          <B24Input v-model="state.email" placeholder="john.doe@example.com" class="w-full" />
        </B24FormField>
        <div class="pt-4.5 mt-4.5 mb-4 flex items-center justify-start gap-2.5 border-t-1 border-t-(--ui-color-divider-default)">
          <B24Button
            label="Create"
            color="air-primary"
            size="lg"
            type="submit"
          />
          <B24Button
            label="Cancel"
            color="air-tertiary"
            size="lg"
            @click="open = false"
          />
        </div>
      </B24Form>
    </template>
  </B24Modal>
</template>
