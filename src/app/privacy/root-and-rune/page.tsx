import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Root & Rune | BloomWave',
  description:
    'Privacy policy for Root & Rune, a gamified education app for astrology, tarot, hedge witchery, and dream work by BloomWave.',
}

export default function RootAndRunePrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-lg text-bark-300 mb-2">Root &amp; Rune</p>
        <p className="text-sm text-bark-200 mb-12">
          Last updated: March 13, 2026
        </p>

        <div className="prose-policy space-y-10 text-bark-500 leading-relaxed">
          {/* Data We Collect */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              1. Data We Collect
            </h2>
            <p className="mb-3">
              We collect the following information when you use Root &amp; Rune:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Purchase history</strong> &mdash; managed by Apple to
                verify your subscription status
              </li>
              <li>
                <strong>App preferences</strong> &mdash; your selected paths,
                lesson progress, streak data, and journal entries, stored
                locally on your device
              </li>
              <li>
                <strong>Push notification tokens</strong> &mdash; used to
                deliver streak reminders and daily practice notifications (if
                enabled)
              </li>
            </ul>
          </section>

          {/* How We Use Your Data */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              2. How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                To provide, maintain, and improve the Root &amp; Rune app
                experience
              </li>
              <li>
                To track your lesson progress, streaks, rune collection, and
                journal entries
              </li>
              <li>
                To process in-app purchases and manage your subscription
              </li>
              <li>
                To send push notifications you have opted into (streak
                reminders, daily practice)
              </li>
              <li>
                We do NOT sell, rent, or share your personal data with third
                parties for advertising or marketing purposes
              </li>
            </ul>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              3. Third-Party Services
            </h2>
            <p className="mb-4">
              Root &amp; Rune uses the following third-party services to
              operate:
            </p>
            <div className="mb-3">
              <p className="text-sm">
                <strong>Apple StoreKit</strong> &mdash; manages in-app purchases
                and subscription verification.{' '}
                <a
                  href="https://www.apple.com/legal/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
            <div className="mb-3">
              <p className="text-sm">
                <strong>Apple Push Notification Service (APNs)</strong> &mdash;
                delivers push notifications to your device.{' '}
                <a
                  href="https://www.apple.com/legal/privacy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
            <p className="mt-3 text-sm">
              These services process data only as necessary to provide their
              respective functions.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              4. Data Retention
            </h2>
            <p>
              Your lesson progress, journal entries, and preferences are stored
              locally on your device. We do not maintain user accounts or store
              personal data on external servers. Deleting the app removes all
              locally stored data.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              5. Children&rsquo;s Privacy
            </h2>
            <p>
              Root &amp; Rune is not intended for children under the age of 13.
              We do not knowingly collect personal information from children
              under 13. If you believe a child under 13 is using the app
              inappropriately, please contact us at{' '}
              <a
                href="mailto:support@rootrune.app"
                className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
              >
                support@rootrune.app
              </a>
              .
            </p>
          </section>

          {/* Data Deletion */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              6. Data Deletion
            </h2>
            <p>
              Because Root &amp; Rune stores data locally on your device, you
              can delete all app data at any time by deleting the app. You may
              also contact us at{' '}
              <a
                href="mailto:support@rootrune.app"
                className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
              >
                support@rootrune.app
              </a>{' '}
              with any data-related requests.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              7. Security
            </h2>
            <p>
              We use industry-standard measures to protect any data transmitted
              by the app, including encryption in transit (TLS/HTTPS). Since
              your data is stored locally on your device, its security is also
              protected by your device&rsquo;s built-in security features.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              8. Changes to This Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of material changes by updating the &ldquo;Last
              updated&rdquo; date above. Your continued use of the app after
              changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at:
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
