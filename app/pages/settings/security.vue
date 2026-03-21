<script setup lang="ts">
import * as z from 'zod'
import { reactive } from 'vue'
import type { FormError } from '@bitrix24/b24ui-nuxt'

const passwordSchema = z.object({
  current: z.string().min(8, 'Must be at least 8 characters'),
  new: z.string().min(8, 'Must be at least 8 characters')
})

type PasswordSchema = z.output<typeof passwordSchema>

const password = reactive<Partial<PasswordSchema>>({
  current: '',
  new: ''
})

const validate = (state: Partial<PasswordSchema>): FormError[] => {
  const errors: FormError[] = []
  if (state.current && state.new && state.current === state.new) {
    errors.push({ name: 'new', message: 'Passwords must be different' })
  }
  return errors
}
</script>

<template>
  <!-- @todo: B24PageCard after UI update fix :b24ui -->
  <B24PageCard
    title="Password"
    description="Confirm your current password before setting a new one."
    variant="tinted-no-accent"
    :b24ui="{ root: 'rounded-none sm:rounded-3xl bg-(--ui-color-bg-content-primary) light:bg-(--ui-color-gray-02)' }"
    class="mb-4 base-mode"
  >
    <B24Form
      :schema="passwordSchema"
      :state="password"
      :validate="validate"
      class="flex flex-col gap-1.5 max-w-[320px]"
    >
      <B24FormField name="current">
        <B24Input
          v-model="password.current"
          type="password"
          placeholder="Current password"
          class="w-full"
        />
      </B24FormField>

      <B24FormField name="new">
        <B24Input
          v-model="password.new"
          type="password"
          placeholder="New password"
          class="w-full"
        />
      </B24FormField>

      <B24Button
        label="Update"
        color="air-primary"
        class="w-fit mt-4"
        type="submit"
      />
    </B24Form>
  </B24PageCard>

  <B24PageCard
    title="Account"
    description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
    variant="tinted-alert"
    class="base-mode"
    :b24ui="{
      root: 'rounded-none sm:rounded-3xl',
    }"
  >
    <template #footer>
      <B24Button label="Delete account" color="air-primary-alert" />
    </template>
  </B24PageCard>
</template>
