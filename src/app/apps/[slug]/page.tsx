import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { apps } from '@/data/apps'
import FadeIn, { FadeInStagger, FadeInItem } from '@/components/FadeIn'

export function generateStaticParams() {
  return apps
    .filter((app) => app.status === 'available')
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
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    ...(app.appStoreUrl && { url: app.appStoreUrl }),
    ...(app.iconImage && { image: `https://bloomwave.app${app.iconImage}` }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}

const AppStoreButton = ({ href, size = 'md' }: { href: string; size?: 'sm' | 'md' | 'lg' }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-2 rounded-xl bg-bark-600 text-cream-50 font-medium hover:bg-bark-500 active:scale-95 transition-all ${
      size === 'lg'
        ? 'px-7 py-3.5 text-base'
        : size === 'sm'
        ? 'px-4 py-2 text-sm'
        : 'px-5 py-2.5 text-sm'
    }`}
  >
    <svg
      className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
    Download on the App Store
  </a>
)

export default function AppPage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug)

  if (!app || app.status === 'in-development') {
    notFound()
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <AppJsonLd app={app} />

      {/* Hero */}
      <section
        className="pt-32 pb-20 px-6 text-center relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${app.iconBg}40 0%, transparent 100%)` }}
      >
        <div className="max-w-3xl mx-auto">
          <FadeIn delay={0.05}>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-bark-300 hover:text-forest-500 transition-colors mb-10"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M10 12L6 8l4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Apps
            </Link>
          </FadeIn>

          <FadeIn delay={0.1}>
            {app.iconImage ? (
              <img
                src={app.iconImage}
                alt={`${app.name} icon`}
                className="w-28 h-28 rounded-[28px] object-cover shadow-2xl shadow-bark-500/20 mx-auto mb-8"
              />
            ) : (
              <div
                className="w-28 h-28 rounded-[28px] flex items-center justify-center text-6xl shadow-2xl shadow-bark-500/20 mx-auto mb-8"
                style={{ backgroundColor: app.iconBg }}
              >
                {app.icon}
              </div>
            )}
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-bark-600 tracking-tight mb-4">
              {app.name}
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="text-lg text-bark-300 max-w-lg mx-auto leading-relaxed mb-2">
              {app.tagline}
            </p>
            <p className="text-sm text-bark-200 mb-8">{app.price}</p>
          </FadeIn>

          {app.appStoreUrl && (
            <FadeIn delay={0.4}>
              <AppStoreButton href={app.appStoreUrl} size="lg" />
            </FadeIn>
          )}
        </div>
      </section>

      {/* About */}
      <FadeIn>
        <section className="max-w-2xl mx-auto px-6 py-16 text-center">
          <p className="text-bark-400 leading-relaxed text-lg">
            {app.description || app.tagline}
          </p>
        </section>
      </FadeIn>

      {/* Features */}
      {app.features && app.features.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <FadeIn>
            <div className="flex items-center gap-3 mb-12">
              <div className="h-px flex-1 bg-cream-300" />
              <h2 className="font-serif text-lg text-bark-300">What&rsquo;s Inside</h2>
              <div className="h-px flex-1 bg-cream-300" />
            </div>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {app.features.map((feature) => (
              <FadeInItem key={feature.title}>
                <div className="bg-cream-100/80 border border-cream-300/60 rounded-2xl p-6 h-full">
                  <span className="text-3xl mb-4 block">{feature.icon}</span>
                  <h3 className="font-serif text-lg text-bark-600 mb-2">{feature.title}</h3>
                  <p className="text-sm text-bark-300 leading-relaxed">{feature.description}</p>
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </section>
      )}

      {/* Screenshots */}
      {app.screenshots && app.screenshots.length > 0 && (
        <section className="pb-20">
          <FadeIn>
            <div className="flex items-center gap-3 mb-12 max-w-5xl mx-auto px-6">
              <div className="h-px flex-1 bg-cream-300" />
              <h2 className="font-serif text-lg text-bark-300">Inside the App</h2>
              <div className="h-px flex-1 bg-cream-300" />
            </div>
          </FadeIn>

          <FadeInStagger className="flex gap-5 overflow-x-auto px-6 pb-4 snap-x snap-mandatory md:grid md:overflow-visible md:pb-0 md:max-w-5xl md:mx-auto md:justify-items-center"
            style={{ gridTemplateColumns: `repeat(${app.screenshots.length}, minmax(0, 240px))` } as React.CSSProperties}
          >
            {app.screenshots.map((screenshot) => (
              <FadeInItem key={screenshot.src}>
                <div className="snap-center flex-shrink-0 w-[200px] sm:w-[220px] md:w-full rounded-3xl overflow-hidden shadow-2xl shadow-bark-500/10 border border-cream-300/40">
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              </FadeInItem>
            ))}
          </FadeInStagger>
        </section>
      )}

      {/* Bottom CTA */}
      {app.appStoreUrl && (
        <FadeIn>
          <section className="max-w-xl mx-auto px-6 pb-20 text-center">
            <div
              className="rounded-2xl p-10"
              style={{ background: `linear-gradient(135deg, ${app.iconBg}50 0%, ${app.iconBg}20 100%)` }}
            >
              <h2 className="font-serif text-3xl text-bark-600 mb-3">Ready to get started?</h2>
              <p className="text-bark-300 text-sm mb-6">Free to download. Available on iOS.</p>
              <AppStoreButton href={app.appStoreUrl} size="lg" />
            </div>
          </section>
        </FadeIn>
      )}

      {/* Legal links */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
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
