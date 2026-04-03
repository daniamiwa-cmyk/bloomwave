import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — All Days | BloomWave',
  description:
    'Privacy policy for All Days, a holiday calendar app by BloomWave.',
}

export default function AllDaysPrivacyPage() {
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
        <p className="text-lg text-bark-300 mb-2">All Days</p>
        <p className="text-sm text-bark-200 mb-12">
          Last updated: April 3, 2026
        </p>

        <div className="prose-policy space-y-10 text-bark-500 leading-relaxed">
          {/* Data We Collect */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              1. Data We Collect
            </h2>
            <p className="mb-3">
              All Days is designed to be a low-data app. We collect only what is
              necessary to provide the service:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Your tradition preferences</strong> &mdash; the
                traditions and cultures you choose to follow are stored locally
                on your device and are not transmitted to our servers
              </li>
              <li>
                <strong>Calendar access</strong> &mdash; if you use All Days+ to
                export holidays to your calendar, the app requests permission to
                write events to Apple Calendar, Google Calendar, or Outlook.
                This access is used solely to add the events you request and is
                not used to read your existing calendar data.
              </li>
              <li>
                <strong>Purchase history</strong> &mdash; managed by Apple to
                verify your All Days+ subscription status
              </li>
              <li>
                <strong>Push notification tokens</strong> &mdash; used to
                deliver holiday reminders (if enabled)
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
                To provide, maintain, and improve the All Days app experience
              </li>
              <li>
                To remember your tradition filters and calendar preferences
                across sessions (stored locally on your device)
              </li>
              <li>
                To export holiday observances to your calendar of choice when
                you request it (All Days+)
              </li>
              <li>
                To process in-app purchases and manage your subscription
              </li>
              <li>
                To send push notifications you have opted into (upcoming holiday
                reminders)
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
              All Days uses the following third-party services to operate:
            </p>
            <div className="mb-3">
              <p className="text-sm">
                <strong>RevenueCat</strong> &mdash; manages in-app purchases and
                All Days+ subscription verification.{' '}
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
              Your tradition preferences and filter settings are stored locally
              on your device and are not retained on our servers. If you delete
              the app, this data is removed with it. Subscription status is
              managed by Apple and RevenueCat and is subject to their respective
              retention policies.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              5. Children&rsquo;s Privacy
            </h2>
            <p>
              All Days is not directed at children under the age of 13. We do
              not knowingly collect personal information from children under 13.
              If you believe a child under 13 is using the app and submitting
              data inappropriately, please contact us at{' '}
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
              Because All Days stores your preferences locally on your device,
              you can remove all app data by deleting the app. For any
              server-side data or questions, you may contact us at{' '}
              <a
                href="mailto:support@bloomwave.app"
                className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
              >
                support@bloomwave.app
              </a>
              .
            </p>
          </section>

          {/* Security */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              7. Security
            </h2>
            <p>
              We use industry-standard measures to protect any data transmitted
              through the app, including encryption in transit (TLS/HTTPS).
              Calendar access permissions follow Apple&rsquo;s system-level
              security model and can be revoked at any time in your device
              settings. While no system is perfectly secure, we take reasonable
              precautions to protect your information.
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
