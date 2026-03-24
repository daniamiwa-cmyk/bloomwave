'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function StorePage() {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="bg-cream-50 pt-24 pb-16">
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 text-center mb-16">
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-bark-600 tracking-tight mb-6">
          Bloom Within
        </h1>
        <p className="font-serif text-xl sm:text-2xl text-bark-300 mb-8">
          A 60-Card Daily Practice Deck
        </p>

        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-px bg-forest-400/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-forest-400/40" />
          <div className="w-12 h-px bg-forest-400/40" />
        </div>

        <div className="max-w-xl mx-auto text-left space-y-4 text-bark-300 leading-relaxed">
          <p className="text-lg font-medium text-bark-500">
            Pull one card. That&rsquo;s it.
          </p>
          <p>
            Bloom Within is a 60-card deck designed for people who want a small, honest daily practice — without the overwhelm of figuring out how to begin.
          </p>
          <p>
            No book. No required ritual. No wrong way to use it.
          </p>
          <p>
            Just pull a card in the morning before the day gets loud. Or pull one when you&rsquo;re stuck. Or when you need something to wonder about.
          </p>
        </div>
      </section>

      {/* What's Inside */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">What&rsquo;s Inside</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-cream-300/60 bg-cream-100/80 p-6 sm:p-8">
            <h3 className="font-serif text-xl text-bark-600 mb-3">20 Affirmation Cards</h3>
            <p className="text-bark-300 leading-relaxed mb-3">
              Not generic positivity. These are invitations — words that ask you to consider something true about yourself, even on the days that feels hard.
            </p>
            <p className="text-bark-200 italic text-sm">
              &ldquo;I am not behind. I am on my perfect path.&rdquo;
            </p>
          </div>

          <div className="rounded-2xl border border-cream-300/60 bg-cream-100/80 p-6 sm:p-8">
            <h3 className="font-serif text-xl text-bark-600 mb-3">20 Mini-Meditation Cards</h3>
            <p className="text-bark-300 leading-relaxed mb-3">
              Short, doable, no experience required. Each card is a 5-minute practice you can do anywhere — a grounding exercise, a breathing practice, a moment of intentional stillness.
            </p>
            <p className="text-bark-200 italic text-sm">
              &ldquo;Picture yourself walking barefoot through a meadow filled with wildflowers of every kind.&rdquo;
            </p>
          </div>

          <div className="rounded-2xl border border-cream-300/60 bg-cream-100/80 p-6 sm:p-8">
            <h3 className="font-serif text-xl text-bark-600 mb-3">20 Creative Prompt Cards</h3>
            <p className="text-bark-300 leading-relaxed mb-3">
              Because sometimes the fastest path into yourself is through play. These prompts open doors you didn&rsquo;t know needed opening.
            </p>
            <p className="text-bark-200 italic text-sm">
              &ldquo;Write about a time you belonged.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* Why 60 Cards */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">Why 60 Cards?</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <p className="text-bark-300 leading-relaxed max-w-xl mx-auto text-center">
          Most oracle decks run 30–44 cards. Bloom Within gives you 60 — enough variety that your daily practice stays fresh across two full months before anything repeats. Because a practice that loops too quickly stops feeling like a practice.
        </p>
      </section>

      {/* The Cards Themselves */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">The Cards Themselves</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <div className="max-w-xl mx-auto text-center space-y-4 text-bark-300 leading-relaxed">
          <p>
            Printed on thick, premium stock with a soft sheen finish. Substantial in your hands. The kind of thing that feels intentional sitting on your desk or nightstand.
          </p>
          <p>Packaged and shipped with care.</p>
        </div>
      </section>

      {/* Buy CTA */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="relative rounded-2xl border border-forest-400/20 bg-cream-100/80 p-8 sm:p-10 text-center overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-forest-400/40 via-forest-400 to-forest-400/40" />
          <h2 className="font-serif text-3xl sm:text-4xl text-bark-600 mb-3">$65</h2>
          <p className="text-bark-300 text-sm mb-6">Free shipping · Ships within 3–5 business days</p>
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-forest-400 text-cream-50 font-medium hover:bg-forest-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Redirecting...' : 'Buy Now'}
          </button>
          <p className="text-bark-200 text-xs mt-4">
            Secure checkout powered by Stripe
          </p>
        </div>
      </section>

      {/* Limited Run Note */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">A Note on This Run</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <p className="text-bark-300 leading-relaxed max-w-xl mx-auto text-center">
          These 20 decks are hand-packaged and shipped directly by me. When they&rsquo;re gone, I&rsquo;ll announce the next print run. If you want one, now is the time.
        </p>
      </section>

      {/* Companion App */}
      <section className="max-w-3xl mx-auto px-6 mb-16">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">The Companion App</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <div className="max-w-xl mx-auto text-center space-y-4 text-bark-300 leading-relaxed">
          <p>
            Bloom Within has a free digital companion — the Bloom Affirmations app, available on the App Store. The app draws from the same card system daily, so you can use the physical deck at home and carry the practice in your pocket wherever you go.
          </p>
          <p>They work beautifully together. Neither requires the other.</p>
          <a
            href="https://apps.apple.com/us/app/bloom-affirmation/id6759355085"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bark-600 text-cream-50 text-sm font-medium hover:bg-bark-500 transition-colors mt-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Download Bloom Affirmations — Free on the App Store
          </a>
        </div>
      </section>

      {/* About the Creator */}
      <section className="max-w-3xl mx-auto px-6 pb-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">About the Creator</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <div className="max-w-xl mx-auto text-center space-y-4 text-bark-300 leading-relaxed">
          <p>
            Bloom Within was created by Dania Toscano Miwa — leadership and growth coach, Master Reiki practitioner, and proudly AuDHD human who couldn&rsquo;t find a mindfulness practice designed for how her brain actually works.
          </p>
          <p>This deck is what she made instead.</p>
        </div>
      </section>
    </div>
  )
}
