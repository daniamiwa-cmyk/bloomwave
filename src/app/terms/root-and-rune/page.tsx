import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — Root & Rune | BloomWave',
  description: 'Terms of service for Root & Rune by BloomWave.',
}

export default function RootAndRuneTermsPage() {
  return (
    <div className="pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-6">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm text-forest-500 hover:text-forest-600 transition-colors"
          >
            &larr; Back to BloomWave
          </Link>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl text-bark-600 mb-3">
          Terms of Service
        </h1>
        <p className="text-lg text-bark-300 mb-2">Root &amp; Rune</p>
        <p className="text-sm text-bark-200 mb-12">
          Last updated: March 13, 2026
        </p>

        <div className="prose-policy space-y-10 text-bark-500 leading-relaxed">
          {/* Acceptance */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              1. Acceptance of Terms
            </h2>
            <p>
              By downloading or using Root &amp; Rune, you agree to these Terms
              of Service and our Privacy Policy. If you do not agree, do not use
              the app.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              2. Eligibility
            </h2>
            <p>
              You must be at least 13 years old to use Root &amp; Rune. By using
              the app, you confirm that you meet the applicable age requirement.
            </p>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              3. Description of Service
            </h2>
            <p>
              Root &amp; Rune is a spiritual education app offering gamified
              lessons across topics including tarot, astrology, herbalism, dream
              work, energy practices, and nature wisdom. All content is for
              educational and personal enrichment purposes only. Root &amp; Rune
              is not a substitute for professional medical, psychological, legal,
              or financial advice.
            </p>
          </section>

          {/* In-App Purchases */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              4. In-App Purchases
            </h2>
            <p className="mb-3">
              Root &amp; Rune offers optional premium subscriptions.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                Subscriptions are processed through Apple&rsquo;s App Store and
                are subject to Apple&rsquo;s terms and conditions.
              </li>
              <li>
                Subscriptions automatically renew unless canceled at least 24
                hours before the end of the current billing period.
              </li>
              <li>
                You can manage or cancel subscriptions in your Apple ID account
                settings.
              </li>
              <li>
                Refund requests for App Store purchases must be submitted
                through Apple.
              </li>
            </ul>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              5. Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Use the app for any unlawful purpose</li>
              <li>
                Attempt to exploit, harm, or reverse-engineer the app or its
                systems
              </li>
              <li>
                Use the app if you are under the minimum required age
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              6. Intellectual Property
            </h2>
            <p>
              The Root &amp; Rune app, including its design, code,
              illustrations, lesson content, and all other creative materials,
              is owned by Miwa Studio and protected by applicable intellectual
              property laws. You may not copy, modify, distribute, or create
              derivative works from any part of the app.
            </p>
          </section>

          {/* Disclaimer */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              7. Disclaimer of Warranties
            </h2>
            <p>
              Root &amp; Rune is provided &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; without warranties of any kind, whether express or
              implied. We do not warrant that the app will be uninterrupted,
              error-free, or free of harmful components.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              8. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, we shall not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages arising from your use of the app, including but
              not limited to loss of data or loss of profits.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              9. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate access to the app at
              any time, with or without cause, with or without notice.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              10. Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. We will notify you of
              material changes by updating the &ldquo;Last updated&rdquo; date.
              Your continued use of the app after changes constitutes acceptance
              of the updated terms.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 bg-cream-200/50 rounded-xl p-6 text-sm">
              <p className="font-medium text-bark-600">BloomWave</p>
              <p className="mt-1">
                Email:{' '}
                <a
                  href="mailto:support@rootrune.app"
                  className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                >
                  support@rootrune.app
                </a>
              </p>
              <p className="mt-1">
                Website:{' '}
                <a
                  href="https://bloomwave.app"
                  className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                >
                  bloomwave.app
                </a>
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
