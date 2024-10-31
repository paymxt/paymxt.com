import dotenv from 'dotenv'
dotenv.config()

export async function fetchStories(
  routes: string[],
  cacheVersion: number,
  token: string,
  page: number = 1,
) {
  const version = 'published'
  const perPage = 100
  const toIgnore = ['home', 'en/settings']

  if (!token) {
    console.error(
      'Error: Storyblok token is not defined. Please check your environment variables.',
    )
    return
  }

  try {
    console.log(`Fetching stories from Storyblok (page ${page})...`)
    const response = await fetch(
      `https://api.storyblok.com/v2/cdn/links?token=${token}&version=${version}&per_page=${perPage}&page=${page}&cv=${cacheVersion}`,
    )

    if (!response.ok) {
      throw new Error('Could not fetch stories from Storyblok')
    }

    const data = await response.json()

    console.log(
      `Fetched ${Object.values(data.links).length} stories from Storyblok on page ${page}`,
    )

    // Add routes to the array
    Object.values(data.links).forEach((link: any) => {
      if (!toIgnore.includes(link.slug)) {
        routes.push('/' + link.slug)
      }
    })

    // Check if there are more pages with links
    const total = response.headers.get('total')
    const maxPage = Math.ceil(Number(total) / perPage)

    if (maxPage > page) {
      await fetchStories(routes, cacheVersion, token, page + 1)
    }
  } catch (error) {
    console.error('Error fetching stories:', error)
  }
}
