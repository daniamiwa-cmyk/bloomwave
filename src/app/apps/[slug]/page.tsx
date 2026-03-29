import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { apps } from '@/data/apps'

export function generateStaticParams() {
  return apps
    .filter((app) => app.status !== 'in-development')
    .map((app) => ({ slug: app.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const app = apps.find((a) => a.slug === params.slug)
  if (!app) return {}
  const description = app.description ?? app.tagline
  return {
    title: `${app.name} — BloomWave`,
    description,
    openGraph: {
      title: `${app.name} — BloomWave`,
      description,
      images: [`/apps/${app.slug}/opengraph-image`],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${app.name} — BloomWave`,
      description,
    },
  }
}

function AppJsonLd({ app }: { app: (typeof apps)[number] }) {
  if (app.status !== 'available') return null

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: app.name,
    description: app.description || app.tagline,
    operatingSystem: 'iOS',
    applicationCategory: 'LifestyleApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    ...(app.appStoreUrl && { url: app.appStoreUrl }),
    ...(app.iconImage && {
      image: `https://bloomwave.app${app.iconImage}`,
    }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug)

  if (!app || app.status === 'in-development') {
    notFound()
  }

  return (
    <div className="bg-cream-50 pt-24 pb-16">
      <AppJsonLd app={app} />
      {/* Header */}
      <section className="max-w-3xl mx-auto px-6 text-center mb-12">
        <div className="flex justify-center mb-6">
          {app.iconImage ? (
            <img
              src={app.iconImage}
              alt={`${app.name} icon`}
              className="w-24 h-24 rounded-3xl object-cover shadow-lg"
            />
          ) : (
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg"
              style={{ backgroundColor: app.iconBg }}
            >
              {app.icon}
            </div>
          )}
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-bark-600 tracking-tight mb-4">
          {app.name}
        </h1>

        <p className="font-sans text-lg text-bark-300 mb-2">{app.price}</p>

        {app.appStoreUrl && (
          <a
            href={app.appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-bark-600 text-cream-50 text-sm font-medium hover:bg-bark-500 transition-colors mt-4"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on the App Store
          </a>
        )}
      </section>

      {/* Description */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">About</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <p className="text-bark-300 leading-relaxed max-w-xl mx-auto text-center">
          {app.description || app.tagline}
        </p>
      </section>

      {/* Screenshots */}
      {app.screenshots && app.screenshots.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-cream-300" />
            <h2 className="font-serif text-lg text-bark-300">Inside the App</h2>
            <div className="h-px flex-1 bg-cream-300" />
          </div>

          <div className={`grid gap-6 justify-items-center ${app.screenshots.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-1 sm:grid-cols-3'}`}>
            {app.screenshots.map((screenshot) => (
              <div
                key={screenshot.src}
                className="relative rounded-3xl overflow-hidden shadow-xl shadow-bark-500/10 border border-cream-300/40 max-w-[240px]"
              >
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Links */}
      <section className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-center gap-6 text-sm text-bark-300">
          <Link href={`/terms/${app.slug}`} className="hover:text-forest-500 transition-colors">
            Terms of Use
          </Link>
          <span className="text-cream-300">|</span>
          <Link href={`/privacy/${app.slug}`} className="hover:text-forest-500 transition-colors">
            Privacy Policy
          </Link>
          <span className="text-cream-300">|</span>
          <Link href="/" className="hover:text-forest-500 transition-colors">
            All Apps
          </Link>
        </div>
      </section>
    </div>
  )
}
