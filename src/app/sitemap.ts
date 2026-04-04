import type { MetadataRoute } from 'next'
import { apps } from '@/data/apps'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://bloomwave.app'

  const appPages = apps
    .filter((app) => app.status !== 'in-development')
    .map((app) => ({
      url: `${baseUrl}/apps/${app.slug}`,
      lastModified: app.lastModified ? new Date(app.lastModified) : new Date(),
    }))

  return [
    { url: baseUrl, lastModified: new Date() },
    ...appPages,
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/support`, lastModified: new Date() },
  ]
}
