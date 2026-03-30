<template>
  <B24Card
    ref="cardRef"
    class="base-mode shrink-0"
    :b24ui="{ root: 'overflow-visible', body: '!px-0 !pt-0 !pb-3' }"
  >
    <template #header>
      <div>
        <p class="text-xs text-(--b24ui-typography-label-color) uppercase mb-1.5">
          Revenue
        </p>
        <p class="text-3xl text-(--b24ui-typography-legend-color) font-semibold">
          ---
        </p>
      </div>
    </template>

    <div class="h-96" />
  </B24Card>
</template>
