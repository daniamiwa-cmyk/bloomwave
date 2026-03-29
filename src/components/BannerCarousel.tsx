'use client'

import { useState, useEffect, useCallback } from 'react'

const slides = [
  {
    id: 'bloom',
    icon: '/icons/bloom.jpg',
    iconAlt: 'Bloom Affirmations icon',
    badge: 'Now Available',
    title: 'Bloom Affirmations is live',
    tagline:
      'Daily affirmations, AI coaching, mood check-ins, and journaling — start your intentional living journey today.',
    cta: {
      label: 'Download on the App Store',
      href: 'https://apps.apple.com/us/app/bloom-affirmation/id6759355085',
      style: 'app-store' as const,
    },
  },
  {
    id: 'spellcraft',
    icon: '/icons/spellcraft.png',
    iconAlt: 'SpellCraft Studio icon',
    badge: 'Now Available',
    title: 'SpellCraft Studio is live',
    tagline:
      'A modern witchcraft companion — explore herbs, stones, and spells with a beautifully curated encyclopedia.',
    cta: {
      label: 'Download on the App Store',
      href: 'https://apps.apple.com/us/app/spell-craft-studio/id6760242229',
      style: 'app-store' as const,
    },
  },
  {
    id: 'support',
    icon: null,
    iconAlt: '',
    badge: null,
    title: 'Support the Studio',
    tagline:
      'BloomWave is a one-person studio. Every app is designed, built, and maintained by a single human who cares deeply about making beautiful, honest tools. If any of this resonates with you, a small contribution goes a long way.',
    cta: {
      label: 'Buy Me a Coffee on Ko-fi',
      href: 'https://ko-fi.com/bloomwave',
      style: 'kofi' as const,
    },
  },
]

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <section className="max-w-2xl mx-auto px-6 pb-16">
      <div
        className="relative rounded-2xl border border-forest-400/20 bg-cream-100/80 overflow-hidden"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-forest-400/40 via-forest-400 to-forest-400/40" />

        <div className="relative min-h-[300px] sm:min-h-[280px]">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="absolute inset-0 pt-10 px-6 sm:px-8 pb-16 flex flex-col items-center justify-center text-center transition-opacity duration-500 ease-in-out"
              style={{
                opacity: i === current ? 1 : 0,
                pointerEvents: i === current ? 'auto' : 'none',
              }}
              aria-hidden={i !== current}
            >
              <div className="flex items-center justify-center gap-3 mb-3">
                {slide.icon && (
                  <img
                    src={slide.icon}
                    alt={slide.iconAlt}
                    className="w-12 h-12 rounded-xl object-cover shadow-sm"
                  />
                )}
                {slide.badge && (
                  <span className="text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full bg-forest-400/10 text-forest-500">
                    {slide.badge}
                  </span>
                )}
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-bark-600 mb-2">
                {slide.title}
              </h3>

              <p className="text-sm text-bark-300 leading-relaxed max-w-md mx-auto mb-5">
                {slide.tagline}
              </p>

              <div className="flex justify-center gap-2 mb-5">
                {slides.map((dot, j) => (
                  <button
                    key={dot.id}
                    onClick={() => setCurrent(j)}
                    aria-label={`Go to slide ${j + 1}`}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      j === current
                        ? 'bg-forest-400'
                        : 'bg-bark-200 hover:bg-bark-300'
                    }`}
                  />
                ))}
              </div>

              {slide.cta.style === 'app-store' ? (
                <a
                  href={slide.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bark-600 text-cream-50 text-sm font-medium hover:bg-bark-500 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                  </svg>
                  {slide.cta.label}
                </a>
              ) : (
                <a
                  href={slide.cta.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-forest-400 text-cream-50 font-medium hover:bg-forest-500 transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {slide.cta.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
