import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use — SpellCraft Studio | BloomWave',
  description: 'Terms of use for SpellCraft Studio by BloomWave.',
}

export default function SpellCraftTermsPage() {
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
        <p className="text-lg text-bark-300 mb-2">SpellCraft Studio</p>
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
              By downloading, installing, or using SpellCraft Studio (the &ldquo;App&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the App. These Terms constitute a legally binding agreement between you and BloomWave (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
            </p>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Description of the App
            </h2>
            <p>
              SpellCraft Studio is an entertainment and self-reflection app featuring an encyclopedia of herbs, crystals, candles, oils, and other ingredients, along with tools for crafting personalized rituals. The App is designed for entertainment purposes only and does not provide medical, psychological, spiritual, or professional advice of any kind.
            </p>
          </section>

          {/* Subscriptions */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Subscriptions &amp; Payments
            </h2>
            <p className="mb-3">
              SpellCraft Studio offers a free tier with limited access and a Premium subscription that unlocks additional content and features.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>
                <strong>Premium Monthly:</strong> Auto-renewable subscription billed monthly.
              </li>
              <li>
                <strong>Premium Yearly:</strong> Auto-renewable subscription billed annually.
              </li>
            </ul>
            <p className="mt-3">
              Payment is charged to your Apple ID account at confirmation of purchase. Your subscription automatically renews unless you cancel at least 24 hours before the end of the current billing period. You can manage or cancel your subscription at any time through your device&rsquo;s Settings &gt; Apple ID &gt; Subscriptions.
            </p>
            <p className="mt-3">
              Prices are subject to change. We will notify you of any price changes in advance, and you will have the option to cancel before the new price takes effect. All payments are processed through Apple&rsquo;s App Store. We do not directly collect or store your payment information.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              User-Created Content
            </h2>
            <p>
              You retain ownership of any spells, rituals, notes, or other content you create within the App. By using the App, you grant us a limited license to store and display your content solely for the purpose of providing the service to you. Your custom content is private by default and visible only to you.
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
              <li>Attempt to reverse engineer, decompile, or disassemble any part of the App</li>
              <li>Interfere with or disrupt the App&rsquo;s functionality or servers</li>
              <li>Use the App to harass, abuse, or harm another person</li>
              <li>Reproduce, distribute, or create derivative works from the App&rsquo;s content without our written permission</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Intellectual Property
            </h2>
            <p>
              All content in the App, including but not limited to text, graphics, images, icons, ingredient descriptions, ritual templates, and the overall design, is owned by or licensed to BloomWave and is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from any App content without our prior written consent.
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
              The content within the App &mdash; including intentions, correspondences, ritual instructions, and ingredient information &mdash; is inspired by traditional herbalism and folk practices. It is provided for entertainment and self-reflection purposes only. Always consult qualified healthcare professionals for medical concerns. Essential oils and herbs may cause allergic reactions; research any substance before use.
            </p>
            <p className="mt-3">
              No guarantees are made regarding the efficacy of any ritual, spell, or practice described within the App. This App promotes only positive, nature-aligned intentions. We do not support or endorse any practice intended to cause harm.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, BloomWave shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from your use of the App.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Termination
            </h2>
            <p>
              We may terminate or suspend your access to the App at any time, with or without cause or notice. Upon termination, your right to use the App will immediately cease. You may stop using the App and delete it from your device at any time. Sections of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.
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
