import AppCard from '@/components/AppCard'
import Newsletter from '@/components/Newsletter'
import { apps } from '@/data/apps'

export default function Home() {
  return (
    <>
      <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-14">
        <svg
          className="w-16 h-16 text-forest-400 mb-8 opacity-60"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <path d="M32 56V32" />
          <path d="M32 32C32 24 24 16 16 16C16 24 24 32 32 32Z" />
          <path d="M32 32C32 24 40 16 48 16C48 24 40 32 32 32Z" />
          <path d="M32 40C32 34 26 28 20 28C20 34 26 40 32 40Z" />
          <path d="M32 40C32 34 38 28 44 28C44 34 38 40 32 40Z" />
          <circle cx="32" cy="14" r="3" />
        </svg>

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-bark-600 tracking-tight">
          BloomWave
        </h1>

        <div className="flex items-center gap-3 my-8">
          <div className="w-12 h-px bg-forest-400/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-forest-400/40" />
          <div className="w-12 h-px bg-forest-400/40" />
        </div>

        <p className="font-sans text-lg sm:text-xl md:text-2xl text-bark-300 max-w-xl text-balance leading-relaxed">
          Apps for the curious, the mystical, and the beautifully weird.
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="relative rounded-2xl border border-forest-400/20 bg-cream-100/80 p-6 sm:p-8 text-center">
          <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-forest-400/40 via-forest-400 to-forest-400/40" />
          <div className="flex items-center justify-center gap-3 mb-3">
            <img
              src="/icons/bloom.jpg"
              alt="Bloom Affirmations icon"
              className="w-12 h-12 rounded-xl object-cover shadow-sm"
            />
            <span className="text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-forest-400/10 text-forest-500">
              Now Available
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-bark-600 mb-2">
            Bloom Affirmations is live
          </h3>
          <p className="text-sm text-bark-300 leading-relaxed max-w-md mx-auto mb-3">
            Our first app has landed on the App Store. Daily affirmations, AI coaching, mood check-ins, and journaling — start your intentional living journey today.
          </p>
          <a
            href="https://apps.apple.com/us/app/bloom-affirmation/id6759355085"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bark-600 text-cream-50 text-sm font-medium hover:bg-bark-500 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download on the App Store
          </a>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">Our Apps</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  )
}
