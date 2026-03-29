import type { MetadataRoute } from 'next'
import { apps } from '@/data/apps'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bloomwave.app'

  const appPages = apps
    .filter((app) => app.status !== 'in-development')
    .map((app) => ({
      url: `${baseUrl}/apps/${app.slug}`,
      lastModified: new Date(),
    }))

  return [
    { url: baseUrl, lastModified: new Date() },
    ...appPages,
    { url: `${baseUrl}/support`, lastModified: new Date() },
  ]
}
