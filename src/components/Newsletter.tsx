'use client'

import { useState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/subscribe'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await subscribeToNewsletter(email)
      setStatus('success')
      setEmail('')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  return (
    <section className="max-w-6xl mx-auto px-6 pb-24">
      <div className="rounded-2xl border border-cream-300/60 bg-cream-50 p-8 sm:p-12 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl text-bark-600 mb-3">
          Stay in the Loop
        </h2>
        <p className="text-sm sm:text-base text-bark-300 max-w-md mx-auto mb-8">
          Get notified when we launch new apps, drop updates, or do something
          beautifully weird.
        </p>

        {status === 'success' ? (
          <p className="text-forest-400 font-medium">You're in. Talk soon.</p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-cream-300 bg-cream-100 text-bark-600 placeholder:text-bark-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400/40 focus:border-forest-400 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-6 py-3 rounded-xl bg-forest-400 text-cream-50 text-sm font-medium hover:bg-forest-500 active:bg-forest-600 transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? 'Joining…' : 'Notify Me'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-500 text-xs mt-3">{errorMsg}</p>
        )}

        <p className="text-xs text-bark-200 mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
