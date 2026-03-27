import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — WildMind | BloomWave',
  description:
    'Privacy policy for WildMind, a nature oracle and field journal app by BloomWave.',
}

export default function WildMindPrivacyPage() {
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
        <p className="text-lg text-bark-300 mb-2">WildMind</p>
        <p className="text-sm text-bark-200 mb-12">
          Last updated: March 27, 2026
        </p>

        <div className="prose-policy space-y-10 text-bark-500 leading-relaxed">
          {/* Data We Collect */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              1. Data We Collect
            </h2>
            <p className="mb-3">
              We collect the following information when you use WildMind:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Email address and name</strong> &mdash; used to create
                and manage your account
              </li>
              <li>
                <strong>Journal entries and observations</strong> &mdash; the
                nature observations, reflections, and animal logs you create,
                stored securely in our cloud database
              </li>
              <li>
                <strong>Photos</strong> &mdash; if you choose to attach photos
                to journal entries using your camera or photo library, these are
                stored securely in our cloud storage
              </li>
              <li>
                <strong>Purchase history</strong> &mdash; managed by Apple to
                verify your subscription status
              </li>
              <li>
                <strong>Push notification tokens</strong> &mdash; used to
                deliver daily reminders (if enabled)
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
                To provide, maintain, and improve the WildMind app experience
              </li>
              <li>
                To store and sync your journal entries, oracle card history, and
                observations across sessions
              </li>
              <li>
                To process in-app purchases and manage your subscription
              </li>
              <li>
                To send push notifications you have opted into (daily reminders)
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
              WildMind uses the following third-party services to operate:
            </p>
            <div className="mb-3">
              <p className="text-sm">
                <strong>Supabase</strong> &mdash; provides authentication, database
                storage, and file storage for your account and journal data.{' '}
                <a
                  href="https://supabase.com/privacy"
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
                <strong>RevenueCat</strong> &mdash; manages in-app purchases and
                subscription verification.{' '}
                <a
                  href="https://www.revenuecat.com/privacy"
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
              Your account data, journal entries, and uploaded photos are stored
              securely in our cloud database for as long as you maintain an
              active account. If you delete your account, all associated data
              will be permanently removed from our servers within 30 days.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              5. Children&rsquo;s Privacy
            </h2>
            <p>
              WildMind is not intended for children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you believe a child under 13 is using the app inappropriately,
              please contact us at{' '}
              <a
                href="mailto:support@bloomwave.app"
                className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
              >
                support@bloomwave.app
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
              You can request deletion of your account and all associated data
              at any time by contacting us at{' '}
              <a
                href="mailto:support@bloomwave.app"
                className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
              >
                support@bloomwave.app
              </a>
              . You may also delete individual journal entries and photos from
              within the app.
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              7. Security
            </h2>
            <p>
              We use industry-standard measures to protect your data, including
              encryption in transit (TLS/HTTPS) and secure cloud storage.
              Authentication tokens are stored securely on your device. While no
              system is perfectly secure, we take reasonable precautions to
              protect your information.
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
                  href="mailto:support@bloomwave.app"
                  className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                >
                  support@bloomwave.app
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
