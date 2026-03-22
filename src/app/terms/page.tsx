import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use — BloomWave',
  description: 'Terms of use for all BloomWave apps.',
}

const apps = [
  { name: 'Bloom Affirmations', slug: 'bloom' },
  { name: 'SpellCraft Studio', slug: 'spellcraft' },
  { name: 'Amaia', slug: 'amaia' },
  { name: 'Fated & Jaded', slug: 'fated-and-jaded' },
  { name: 'Root & Rune', slug: 'root-and-rune' },
  { name: 'Chibi Jump', slug: 'chibi-jump' },
]

export default function TermsPage() {
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
        <p className="text-lg text-bark-300 mb-2">BloomWave</p>
        <p className="text-sm text-bark-200 mb-12">
          Effective Date: March 19, 2026
        </p>

        <div className="prose-policy space-y-10 text-bark-500 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Agreement to Terms
            </h2>
            <p>
              By downloading, installing, or using any application published by BloomWave (each an &ldquo;App,&rdquo; and collectively the &ldquo;Apps&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the Apps. These Terms constitute a legally binding agreement between you and BloomWave (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
            </p>
            <p className="mt-3">
              These Terms apply to all BloomWave Apps, including but not limited to Bloom Affirmations, SpellCraft Studio, Amaia, Fated &amp; Jaded, Root &amp; Rune, and Chibi Jump. Individual Apps may have additional terms specific to their features, which are linked below.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Description of the Apps
            </h2>
            <p>
              BloomWave publishes mobile applications focused on wellness, self-reflection, education, and entertainment. Our Apps may include features such as affirmations, journaling, AI-powered coaching, astrology, tarot, herbalism references, and casual games. All content is provided for entertainment and self-reflection purposes only and does not constitute medical, psychological, spiritual, or professional advice of any kind.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Subscriptions &amp; Payments
            </h2>
            <p className="mb-3">
              Some BloomWave Apps offer free tiers with limited access and optional Premium subscriptions that unlock additional content and features. Subscription options and pricing vary by App and are displayed within each App before purchase.
            </p>
            <p>
              Payment is charged to your Apple ID account at confirmation of purchase. Your subscription automatically renews unless you cancel at least 24 hours before the end of the current billing period. You can manage or cancel your subscription at any time through your device&rsquo;s Settings &gt; Apple ID &gt; Subscriptions.
            </p>
            <p className="mt-3">
              Prices are subject to change. We will notify you of any price changes in advance, and you will have the option to cancel before the new price takes effect. All payments are processed through Apple&rsquo;s App Store. We do not directly collect or store your payment information.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              User-Created Content
            </h2>
            <p>
              You retain ownership of any content you create within the Apps, including journal entries, rituals, notes, and other personal data. By using the Apps, you grant us a limited license to store and display your content solely for the purpose of providing the service to you. Your content is private by default and visible only to you.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              AI-Powered Features
            </h2>
            <p>
              Some of our Apps include AI-powered features such as coaching, conversations, and personalized content generation. AI-generated content is provided for entertainment and self-reflection purposes only. It is not a substitute for professional advice, therapy, or medical care. AI responses may occasionally be inaccurate or incomplete. You should not rely on AI-generated content for important decisions regarding your health, finances, or safety.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Acceptable Use
            </h2>
            <p className="mb-3">You agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Use the Apps for any unlawful purpose or in violation of any applicable laws</li>
              <li>Attempt to reverse engineer, decompile, or disassemble any part of the Apps</li>
              <li>Interfere with or disrupt the Apps&rsquo; functionality or servers</li>
              <li>Use the Apps to harass, abuse, or harm another person</li>
              <li>Reproduce, distribute, or create derivative works from the Apps&rsquo; content without our written permission</li>
              <li>Attempt to circumvent any subscription or access restrictions</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Intellectual Property
            </h2>
            <p>
              All content in the Apps, including but not limited to text, graphics, images, icons, descriptions, templates, and the overall design, is owned by or licensed to BloomWave and is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from any App content without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Disclaimers
            </h2>
            <p>
              The Apps are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the Apps will be uninterrupted, error-free, or free of harmful components.
            </p>
            <p className="mt-3">
              Content within the Apps &mdash; including affirmations, astrological readings, tarot interpretations, ritual instructions, and ingredient information &mdash; is provided for entertainment and self-reflection purposes only. Always consult qualified healthcare professionals for medical concerns. Essential oils, herbs, and other substances referenced in the Apps may cause allergic reactions; research any substance before use.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, BloomWave shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the Apps.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Termination
            </h2>
            <p>
              We may terminate or suspend your access to any App at any time, with or without cause or notice. Upon termination, your right to use the App will immediately cease. You may stop using the Apps and delete them from your device at any time. Sections of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Changes to These Terms
            </h2>
            <p>
              We may update these Terms from time to time. When we do, we will revise the &ldquo;Effective Date&rdquo; at the top of this page. Your continued use of the Apps after any changes constitutes acceptance of the updated Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Governing Law
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
            </p>
          </section>

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

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              App-Specific Terms
            </h2>
            <p className="mb-4">
              Each app has its own specific terms of use:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              {apps.map((app) => (
                <li key={app.slug}>
                  <Link
                    href={`/terms/${app.slug}`}
                    className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                  >
                    {app.name} &mdash; Terms of Use
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </article>
    </div>
  )
}
