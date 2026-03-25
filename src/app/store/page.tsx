'use client'

import { useState } from 'react'

function BuyButton({ product, price, label }: { product: string; price: string; label?: string }) {
  const [loading, setLoading] = useState(false)

  async function handleCheckout() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <div className="relative rounded-2xl border border-forest-400/20 bg-cream-100/80 p-8 sm:p-10 text-center overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-forest-400/40 via-forest-400 to-forest-400/40" />
      <h2 className="font-serif text-3xl sm:text-4xl text-bark-600 mb-3">{price}</h2>
      <p className="text-bark-300 text-sm mb-6">Free shipping &middot; Ships within 3&ndash;5 business days</p>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="inline-flex items-center gap-2 px-8 py-3 rounded-lg bg-forest-400 text-cream-50 font-medium hover:bg-forest-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Redirecting...' : label || 'Buy Now'}
      </button>
      <p className="text-bark-200 text-xs mt-4">
        Secure checkout powered by Stripe
      </p>
    </div>
  )
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-10">
      <div className="h-px flex-1 bg-cream-300" />
      <h2 className="font-serif text-lg text-bark-300">{label}</h2>
      <div className="h-px flex-1 bg-cream-300" />
    </div>
  )
}

export default function StorePage() {
  return (
    <div className="bg-cream-50 pt-24 pb-16">

      {/* ──────────────── BLOOM WITHIN ──────────────── */}

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

        <div className="flex justify-center gap-4 mb-10">
          <div className="rounded-2xl overflow-hidden shadow-lg shadow-bark-500/10 border border-cream-300/40 max-w-[200px]">
            <img src="/store/card-1.jpg" alt="Bloom Within card — I bloom in my own time, in my own way" className="w-full h-auto" />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg shadow-bark-500/10 border border-cream-300/40 max-w-[200px]">
            <img src="/store/card-2.jpg" alt="Bloom Within card — Imagine your doubts as autumn leaves drifting away in the wind" className="w-full h-auto" />
          </div>
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

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="What&rsquo;s Inside" />
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

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="Why 60 Cards?" />
        <p className="text-bark-300 leading-relaxed max-w-xl mx-auto text-center">
          Most oracle decks run 30–44 cards. Bloom Within gives you 60 — enough variety that your daily practice stays fresh across two full months before anything repeats. Because a practice that loops too quickly stops feeling like a practice.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="The Cards Themselves" />
        <div className="max-w-xl mx-auto text-center space-y-4 text-bark-300 leading-relaxed">
          <p>
            Printed on thick, premium stock with a soft sheen finish. Substantial in your hands. The kind of thing that feels intentional sitting on your desk or nightstand.
          </p>
          <p>Packaged and shipped with care.</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <BuyButton product="bloom-within" price="$65" />
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="A Note on This Run" />
        <p className="text-bark-300 leading-relaxed max-w-xl mx-auto text-center">
          These 20 decks are hand-packaged and shipped directly by me. When they&rsquo;re gone, I&rsquo;ll announce the next print run. If you want one, now is the time.
        </p>
      </section>

      {/* ──────────────── WOMEN & NATURE ──────────────── */}

      <section className="max-w-3xl mx-auto px-6 pt-8 mb-16">
        <div className="flex items-center justify-center gap-3 mb-16">
          <div className="w-16 h-px bg-forest-400/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-forest-400/30" />
          <div className="w-8 h-px bg-forest-400/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-forest-400/30" />
          <div className="w-16 h-px bg-forest-400/30" />
        </div>

        <div className="text-center mb-16">
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-bark-600 tracking-tight mb-6">
            Women &amp; Nature
          </h1>
          <p className="font-serif text-xl sm:text-2xl text-bark-300 mb-8">
            Affirmation Coloring Book for Strong Women
          </p>

          <div className="flex justify-center mb-10">
            <div className="rounded-2xl overflow-hidden shadow-lg shadow-bark-500/10 border border-cream-300/40 max-w-[240px]">
              <img src="/store/coloring-book-cover.jpg" alt="Women & Nature — Affirmation Coloring Book cover" className="w-full h-auto" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-px bg-forest-400/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-forest-400/40" />
            <div className="w-12 h-px bg-forest-400/40" />
          </div>

          <div className="max-w-xl mx-auto text-left space-y-4 text-bark-300 leading-relaxed">
            <p className="text-lg font-medium text-bark-500">
              Color. Write. Come back to yourself.
            </p>
            <p>
              This isn&rsquo;t a coloring book you pick up once and forget. It&rsquo;s a practice — one page at a time, at whatever pace your life allows.
            </p>
            <p>
              Each page pairs a nature-inspired illustration with an affirmation or journal prompt designed to meet you where you actually are. Not where you&rsquo;re supposed to be. Not some idealized version of healing. Just you, right now, with some colored pencils and a little space to breathe.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="What&rsquo;s Inside" />
        <div className="space-y-4">
          <div className="rounded-2xl border border-cream-300/60 bg-cream-100/80 p-6 sm:p-8">
            <ul className="space-y-3 text-bark-300 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-forest-400 mt-1 shrink-0">&#x2022;</span>
                Nature-themed botanical illustrations — flowers, trees, leaves, organic forms
              </li>
              <li className="flex items-start gap-3">
                <span className="text-forest-400 mt-1 shrink-0">&#x2022;</span>
                An affirmation or reflective prompt on every page
              </li>
              <li className="flex items-start gap-3">
                <span className="text-forest-400 mt-1 shrink-0">&#x2022;</span>
                Single-sided pages so your colors never bleed through
              </li>
              <li className="flex items-start gap-3">
                <span className="text-forest-400 mt-1 shrink-0">&#x2022;</span>
                Suitable for all skill levels — whether you color carefully or just scribble with abandon
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="Why Nature?" />
        <p className="text-bark-300 leading-relaxed max-w-xl mx-auto text-center">
          There&rsquo;s something that happens when we spend time with growing things — even illustrated ones. The natural world doesn&rsquo;t judge your pace or your progress. It just grows. This book borrows that energy and brings it to your desk, your couch, your quiet corner.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="A Beautiful Gift For" />
        <p className="text-bark-300 leading-relaxed max-w-xl mx-auto text-center">
          The woman in your life who keeps saying she needs to slow down. The one who&rsquo;s going through something. The one who already has everything except time for herself.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <BuyButton product="coloring-book" price="$14.99" />
      </section>

      {/* ──────────────── SHARED SECTIONS ──────────────── */}

      <section className="max-w-3xl mx-auto px-6 mb-16">
        <Divider label="Part of the Bloom Ecosystem" />
        <div className="max-w-xl mx-auto text-center space-y-4 text-bark-300 leading-relaxed">
          <p>
            Women &amp; Nature was created alongside the Bloom Within card deck and the Bloom Affirmations app — three tools that share the same philosophy: small, honest daily practices that don&rsquo;t demand perfection.
          </p>
          <p>Use them together or separately. They speak the same language either way.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
            <a
              href="https://apps.apple.com/us/app/bloom-affirmation/id6759355085"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-bark-600 text-cream-50 text-sm font-medium hover:bg-bark-500 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Bloom Affirmations — Free on the App Store
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 pb-8">
        <Divider label="About the Creator" />
        <div className="max-w-xl mx-auto text-center space-y-4 text-bark-300 leading-relaxed">
          <p>
            Dania Toscano Miwa is a leadership and growth coach, Master Reiki practitioner, and proudly AuDHD human who couldn&rsquo;t find a mindfulness practice designed for how her brain actually works.
          </p>
          <p>So she made her own.</p>
        </div>
      </section>
    </div>
  )
}
