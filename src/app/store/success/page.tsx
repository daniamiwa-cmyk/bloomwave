import Link from 'next/link'

export default function SuccessPage() {
  return (
    <div className="bg-cream-50 min-h-screen pt-24 pb-16">
      <section className="max-w-2xl mx-auto px-6 text-center">
        <div className="rounded-2xl border border-forest-400/20 bg-cream-100/80 p-8 sm:p-12">
          <svg
            className="w-16 h-16 text-forest-400 mx-auto mb-6 opacity-80"
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

          <h1 className="font-serif text-3xl sm:text-4xl text-bark-600 mb-4">
            Thank you for your order
          </h1>
          <p className="text-bark-300 leading-relaxed mb-2">
            Your Bloom Within deck is on its way. You&rsquo;ll receive a confirmation email from Stripe with your order details.
          </p>
          <p className="text-bark-300 leading-relaxed mb-8">
            Decks are hand-packaged and ship within 3–5 business days.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-forest-400 text-cream-50 text-sm font-medium hover:bg-forest-500 transition-colors"
          >
            Back to BloomWave
          </Link>
        </div>
      </section>
    </div>
  )
}
