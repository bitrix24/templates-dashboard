<script setup lang="ts">
const config = useRuntimeConfig()

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: `${config.public.baseUrl}favicon.ico` }
  ],
  htmlAttrs: {
    lang: 'en',
    class: 'light'
  }
})

const title = 'Nuxt Dashboard Template'
const description = 'A professional dashboard template built with Bitrix24 UI, featuring multiple pages, data visualization, and comprehensive management capabilities for creating powerful admin interfaces.'

/**
 * @todo fix img
 */
useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://bitrix24.github.io/b24ui/assets/templates/nuxt/dashboard-light.png',
  twitterImage: 'https://bitrix24.github.io/b24ui/assets/templates/nuxt/dashboard-light.png',
  twitterCard: 'summary_large_image'
})
</script>

<template>
  <B24App>
    <NuxtLoadingIndicator />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </B24App>
</template>
