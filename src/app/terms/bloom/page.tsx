import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use — Bloom Affirmations | BloomWave',
  description: 'Terms of use for Bloom Affirmations by BloomWave.',
}

export default function BloomTermsPage() {
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
          Terms of Use
        </h1>
        <p className="text-lg text-bark-300 mb-2">Bloom Affirmations</p>
        <p className="text-sm text-bark-200 mb-12">
          Effective Date: March 19, 2026
        </p>

        <div className="prose-policy space-y-10 text-bark-500 leading-relaxed">
          {/* Agreement */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Agreement to Terms
            </h2>
            <p>
              By downloading, installing, or using Bloom Affirmations (the &ldquo;App&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the App. These Terms constitute a legally binding agreement between you and BloomWave (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
            </p>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Description of the App
            </h2>
            <p>
              Bloom Affirmations is a daily affirmations app that combines AI-powered coaching, mood check-ins, and journaling to support your personal growth and emotional well-being. The App delivers personalized affirmations, helps you track your mood over time, and provides a private space for reflective journaling. Bloom Affirmations is designed as a wellness and self-improvement tool. It is not a licensed therapist, counselor, or medical professional and does not provide medical, psychological, or professional advice of any kind.
            </p>
          </section>

          {/* Subscriptions */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Subscriptions &amp; Payments
            </h2>
            <p className="mb-3">
              Bloom Affirmations offers a free tier with limited features and a Pro subscription that unlocks the full experience.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Pro is available as an auto-renewable subscription at $4.99 per month.</li>
              <li>Payment is charged to your Apple ID account at confirmation of purchase.</li>
              <li>Your subscription automatically renews unless canceled at least 24 hours before the end of the current billing period.</li>
              <li>You can manage or cancel your subscription at any time through your Apple ID account settings.</li>
              <li>Any unused portion of a free trial period, if offered, will be forfeited when you purchase a subscription.</li>
            </ul>
            <p className="mt-3">
              All payments are processed through Apple&rsquo;s App Store. We do not directly collect or store your payment information. Prices are displayed in your local currency and may vary by region. We reserve the right to change subscription pricing at any time, with notice provided before any price change takes effect on your next renewal.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Your Content
            </h2>
            <p>
              You retain ownership of all content you create through the App, including journal entries, mood check-in data, and any personal reflections. By using the App, you grant us a limited license to store, process, and transmit your content solely for the purpose of providing and improving the service.
            </p>
            <p className="mt-3">
              Your journal entries and mood data are private and visible only to you. You may export or delete your content at any time from within the App.
            </p>
          </section>

          {/* AI-Powered Coaching */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              AI-Powered Coaching
            </h2>
            <p>
              Bloom Affirmations uses artificial intelligence to generate personalized affirmations, coaching insights, and wellness suggestions. While we strive for helpful, thoughtful, and supportive content, AI-generated responses may occasionally be inaccurate, incomplete, or not suited to your specific situation. You should not rely on AI coaching as a substitute for professional advice, including but not limited to medical, psychological, or mental health guidance.
            </p>
            <p className="mt-3">
              If you are experiencing a mental health crisis, please contact a qualified professional, call 988 (Suicide &amp; Crisis Lifeline), text HOME to 741741 (Crisis Text Line), or go to your nearest emergency room. Bloom Affirmations is not equipped to handle emergencies.
            </p>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Use the App for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to manipulate the AI into generating harmful, illegal, or explicitly inappropriate content</li>
              <li>Use the App if you are under 13 years of age</li>
              <li>Attempt to reverse engineer, decompile, or disassemble any part of the App</li>
              <li>Interfere with or disrupt the App&rsquo;s functionality or servers</li>
              <li>Use the App to harass, abuse, or harm another person</li>
              <li>Reproduce, distribute, or create derivative works from the App&rsquo;s content without our written permission</li>
              <li>Share or redistribute AI-generated coaching content for commercial purposes</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Intellectual Property
            </h2>
            <p>
              All content in the App, including but not limited to text, graphics, images, icons, affirmation libraries, and the overall design, is owned by or licensed to BloomWave and is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from any App content without our prior written consent.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Disclaimers
            </h2>
            <p>
              The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of harmful components.
            </p>
            <p className="mt-3">
              Bloom Affirmations is a wellness tool designed to support personal growth through affirmations, mood awareness, and reflective journaling. It is not a medical device and is not intended to diagnose, treat, cure, or prevent any disease or mental health condition. The AI coaching feature provides general wellness suggestions and is not a substitute for professional therapy, counseling, or medical treatment. We make no guarantees regarding the accuracy, completeness, or appropriateness of any AI-generated content.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, BloomWave shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the App, including but not limited to any actions taken or not taken based on AI-generated coaching, affirmations, or wellness suggestions.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Termination
            </h2>
            <p>
              We may terminate or suspend your access to the App at any time, with or without cause or notice, including for violations of these Terms. Upon termination, your right to use the App will immediately cease. Termination does not automatically cancel your subscription; you must cancel your subscription through your Apple ID account settings to avoid further charges. You may stop using the App and delete it from your device at any time. Sections of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. When we do, we will revise the &ldquo;Effective Date&rdquo; at the top of this page. Your continued use of the App after any changes constitutes acceptance of the updated Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
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
                  href="mailto:chibijumpstore@gmail.com"
                  className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                >
                  chibijumpstore@gmail.com
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
