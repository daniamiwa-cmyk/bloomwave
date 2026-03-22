import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use — Chibi Jump | BloomWave',
  description: 'Terms of use for Chibi Jump by BloomWave.',
}

export default function ChibiJumpTermsPage() {
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
        <p className="text-lg text-bark-300 mb-2">Chibi Jump</p>
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
              By downloading, installing, or using Chibi Jump (the &ldquo;App&rdquo;), you agree to be bound by these Terms of Use (&ldquo;Terms&rdquo;). If you do not agree to these Terms, do not use the App. These Terms constitute a legally binding agreement between you and BloomWave (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;).
            </p>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Description of the App
            </h2>
            <p>
              Chibi Jump is a free old-school platformer game starring a jumping spider. Navigate through levels, avoid obstacles, and enjoy a simple, fun gaming experience. The App is suitable for all ages and designed as a casual, family-friendly game.
            </p>
          </section>

          {/* No Purchases */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              No Purchases
            </h2>
            <p>
              Chibi Jump is completely free to download and play. The App contains no in-app purchases, no subscriptions, and no advertisements. There are no hidden fees or premium tiers. All game content is available to all users at no cost.
            </p>
          </section>

          {/* User Content */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Your Content &amp; Game Data
            </h2>
            <p>
              Your game progress, including level completion and high scores, is stored locally on your device. No account creation is required to play Chibi Jump.
            </p>
            <p className="mt-3">
              The App supports optional Game Center integration for leaderboards and achievements. If you choose to connect Game Center, your scores may be shared with Apple&rsquo;s Game Center service in accordance with Apple&rsquo;s terms and privacy policy. Game Center integration is entirely optional and the App is fully functional without it.
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
              <li>Exploit bugs or glitches to manipulate leaderboards or game functionality</li>
              <li>Interfere with or disrupt the App&rsquo;s functionality</li>
              <li>Reproduce, distribute, or create derivative works from the App&rsquo;s content without our written permission</li>
            </ul>
          </section>

          {/* Age Requirement */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Age Requirement
            </h2>
            <p>
              Chibi Jump is suitable for ages 4 and up. No personal data is required to play the game. Children under 13 may use the App without parental consent, as the App does not collect, store, or transmit any personal information. If Game Center is used, it is governed by Apple&rsquo;s own terms and parental controls.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Intellectual Property
            </h2>
            <p>
              All content in the App, including but not limited to character designs, sprites, level designs, music, sound effects, graphics, and the overall design, is owned by or licensed to BloomWave and is protected by copyright and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from any App content without our prior written consent.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Disclaimers
            </h2>
            <p>
              The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the App will be uninterrupted, error-free, or free of harmful components. Game progress stored locally on your device may be lost if the App is deleted or your device is reset. We are not responsible for any loss of locally stored game data.
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
              We may terminate or suspend access to the App at any time, with or without cause or notice, including for violations of these Terms. You may stop using the App and delete it from your device at any time. Upon deletion, locally stored game data will be permanently removed. Sections of these Terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability.
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
