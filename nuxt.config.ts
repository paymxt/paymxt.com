import dotenv from 'dotenv'
dotenv.config()
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    [
      '@storyblok/nuxt',
      {
        accessToken:
          process.env.NODE_ENV === 'production'
            ? (process.env.STORYBLOK_TOKEN_PROD as string)
            : (process.env.STORYBLOK_TOKEN_DEV as string),
        usePlugin: true, // Use the official Storyblok plugin
      },
    ],
    '@nuxtjs/tailwindcss',
    '@tresjs/nuxt',
  ],

  ssr: false,
  target: 'static',

  css: ['@/assets/css/fonts.css'],

  runtimeConfig: {
    public: {
      templateToken:
        process.env.NODE_ENV === 'production'
          ? (process.env.STORYBLOK_TOKEN_PROD as string)
          : (process.env.STORYBLOK_TOKEN_DEV as string),
      customParent: process.env.STORYBLOK_CUSTOM_PARENT as string,
      shopifyDomain: process.env.SHOPIFY_DOMAIN as string,
      shopifyToken: process.env.SHOPIFY_TOKEN as string,
    },
  },

  nitro: {
    output: {
      publicDir: '.output/public', // Ensure the output directory is `.output/public`
    },
    prerender: {
      crawlLinks: true, // Enable crawling to identify all pages automatically
      failOnError: false, // Prevent the build from failing due to prerender errors
    },
  },

  vite: {
    optimizeDeps: { exclude: ['fsevents'] },
  },

  compatibilityDate: '2024-07-24',

  hooks: {
    async 'nitro:config'(nitroConfig) {
      if (!nitroConfig || nitroConfig.dev) {
        return
      }
      const token =
        process.env.NODE_ENV === 'production'
          ? process.env.STORYBLOK_TOKEN_PROD
          : process.env.STORYBLOK_TOKEN_DEV

      let cache_version = 0

      // Other routes that are not in Storyblok with their slug.
      let routes = ['/'] // Adds home directly but with / instead of /home
      try {
        const result = await fetch(
          `https://api.storyblok.com/v2/cdn/spaces/me?token=${token}`,
        )

        if (!result.ok) {
          throw new Error('Could not fetch Storyblok data')
        }
        // Timestamp of latest publish
        const space = await result.json()
        console.log('SPACE', space)
        cache_version = space.space.version
        console.log('CV', cache_version)

        // Fetch all stories from Storyblok
        let page = 1
        let stories = []
        let totalStories = 0

        do {
          const res = await fetch(
            `https://api.storyblok.com/v2/cdn/stories?token=${token}&cv=${cache_version}&per_page=100&page=${page}`,
          )
          if (!res.ok) {
            throw new Error('Could not fetch stories from Storyblok')
          }
          const data = await res.json()
          console.log('Fetched data:', data) // Log entire response to understand the structure

          stories = data.stories || [] // Ensure stories is an array, even if empty
          totalStories = data.total || 0 // Set totalStories to 0 if not provided by the API

          console.log('Fetched stories:', stories)
          console.log('Total stories:', totalStories)

          stories.forEach((story) => {
            routes.push(`/${story.full_slug}`)
            console.log('story.full_slug', story.full_slug)
          })
          page++
        } while (stories.length > 0 && routes.length < totalStories)

        // Adds the routes to the prerenderer
        nitroConfig.prerender.routes.push(...routes)
      } catch (error) {
        console.error('Error during Storyblok route generation:', error)
      }
    },

    'generate:before': () => {
      console.log('Generating static pages for hosting...')
    },
    'generate:done': () => {
      console.log('Static pages generation completed. Ready for hosting!')
    },
  },
})
