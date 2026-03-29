import Image from 'next/image'
import AppCard from '@/components/AppCard'
import BannerCarousel from '@/components/BannerCarousel'
import Newsletter from '@/components/Newsletter'
import { apps } from '@/data/apps'

export default function Home() {
  return (
    <>
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 pt-14 overflow-hidden">
        {/* Floating painting decorations — desktop only */}
        <Image
          src="/art/painting-1.png"
          alt=""
          width={240}
          height={180}
          className="hidden md:block absolute -left-4 lg:left-8 top-1/4 opacity-30 -rotate-12 pointer-events-none select-none"
          aria-hidden="true"
        />
        <Image
          src="/art/painting-2.png"
          alt=""
          width={160}
          height={213}
          className="hidden md:block absolute -right-4 lg:right-8 top-1/3 opacity-30 rotate-12 pointer-events-none select-none"
          aria-hidden="true"
        />

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

      <BannerCarousel />

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

      <section className="max-w-2xl mx-auto px-6 pb-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">Support the Studio</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <div className="text-center space-y-4">
          <p className="text-bark-300 leading-relaxed max-w-lg mx-auto">
            BloomWave is a one-person studio. Every app is designed, built, and maintained by a single human who cares deeply about making beautiful, honest tools. If any of this resonates with you, a small contribution goes a long way.
          </p>
          <a
            href="https://ko-fi.com/bloomwave"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-400 text-cream-50 font-medium hover:bg-forest-500 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Buy Me a Coffee on Ko-fi
          </a>
          <p className="text-xs text-bark-200">
            No account needed. One-time or recurring — whatever feels right.
          </p>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
