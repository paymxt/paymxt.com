import { StoryblokVue, apiPlugin } from '@storyblok/vue'
import { defineNuxtPlugin, useRuntimeConfig, useRoute } from '#app'
import { StoryblokVue, apiPlugin } from '@storyblok/vue'
import { defineNuxtPlugin, useRuntimeConfig, useRoute } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()  // Get runtime config
  const route = useRoute()           // Get the current route

  // Access token from the public runtime config or the query string
  const accessToken = route.query.token || config.public.templateToken

  if (!accessToken) {
    console.warn('Storyblok access token is missing. Please check your configuration.')
    return
  }

  // Initialize Storyblok with Vue
  nuxtApp.vueApp.use(StoryblokVue, {
    accessToken,
    use: [apiPlugin],
  })
})
