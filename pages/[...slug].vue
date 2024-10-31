<script setup>
const [slug, processedSlug, language, releaseId] = await Promise.all([
  getSlug(),
  getProcessedSlug(),
  getLanguage(await getSlug()),
  getReleaseId()
])
const resolveRelations = [
  'banner-reference.banners',
  'featured-articles-section.articles',
  'featured-capabilities-section.capabilities',
  'article-page.categories',
  'article-page.author',
]
const story = ref(null)
const storyblokApi = useStoryblokApi()

const apiParams = {
  version: getVersion(),
  language: language,
  fallback_lang: 'default',
  resolve_relations: resolveRelations,
  resolve_links: 'url',
  from_release: releaseId,
}

const error404 = ref(false)
const { customParent } = useRuntimeConfig().public

try {
  if (processedSlug === 'error-404') error404.value = true
  const { data } = await storyblokApi.get(
    'cdn/stories/' + processedSlug,
    apiParams,
  )
  story.value = data.story
} catch (error) {
  if (error.status === 404) error404.value = true
  const { data } = await storyblokApi.get('cdn/stories/error-404', apiParams)
  story.value = data.story
}

onMounted(() => {
  useStoryblokBridge(story.value?.id, (evStory) => (story.value = evStory), {
    resolveRelations: resolveRelations,
    customParent,
    preventClicks: false,
  })
})

const viewingSiteConfig = ref(story.value.content.component === 'site-config')
const defineViewingSiteConfigState = useState(
  'viewingSiteConfig',
  () => viewingSiteConfig.value,
)

const enableBreadcrumbs = useState('enableBreadcrumbs')
const breadcrumbsExcludedStories = useState('breadcrumbsExcludedStories')
const enableBreadcrumbsForStory = computed(() => {
  if (viewingSiteConfig.value) return false
  if (error404.value === true) return false
  if (!enableBreadcrumbs.value) return false
  const found = breadcrumbsExcludedStories.value.find(
    (storyUuid) => storyUuid === story.value.uuid,
  )
  if (!found) return true
})
//TODO check how to leverage this for capbilities/ sections
const breadCrumbsAltStyle = computed(
  () => processedSlug.startsWith('articles/') && processedSlug.length > 9,
)
</script>

<template>
  <Error404 v-if="error404">
    Unfortunately, this page could not be found.
  </Error404>
  <Breadcrumbs
    v-if="enableBreadcrumbsForStory"
    :slug="processedSlug"
    :alt-style="breadCrumbsAltStyle"
  />
  <StoryblokComponent v-if="story" :blok="story.content" :uuid="story.uuid" />
</template>
