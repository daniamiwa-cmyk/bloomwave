import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Support — BloomWave',
  description:
    'Get help with BloomWave apps. Find answers to common questions about accounts, subscriptions, privacy, and more.',
}

const faqs = [
  {
    heading: 'Account & Getting Started',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Most BloomWave apps let you get started without creating an account. If the app supports accounts, you can sign up from the app\u2019s settings screen using your email address or Apple ID.',
      },
      {
        q: 'How do I reset my password?',
        a: 'If you signed up with email, tap "Forgot Password" on the sign-in screen. You\u2019ll receive a reset link at your registered email address. If you signed in with Apple ID, your access is managed through your Apple account.',
      },
      {
        q: 'Can I use the app on multiple devices?',
        a: 'Yes. If the app supports accounts, sign in with the same account on each device. Your subscription and data will sync automatically. For apps without accounts, data is stored locally on each device.',
      },
    ],
  },
  {
    heading: 'Subscriptions & Purchases',
    questions: [
      {
        q: 'How do subscriptions work?',
        a: 'Subscriptions are billed through the Apple App Store and renew automatically at the end of each billing period. You can cancel anytime from your Apple ID settings \u2014 your access continues until the end of the current period.',
      },
      {
        q: 'How do I cancel my subscription?',
        a: 'Open the Settings app on your iPhone \u2192 tap your name \u2192 Subscriptions. Find the BloomWave app and tap Cancel Subscription. Your premium features will remain active until the end of your current billing cycle.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Since subscriptions are processed through Apple, refund requests must go through Apple Support. Visit reportaproblem.apple.com to request a refund for a recent purchase.',
      },
      {
        q: 'I subscribed but my premium features aren\u2019t showing.',
        a: 'Try restoring your purchases from the app\u2019s settings screen. If that doesn\u2019t work, make sure you\u2019re signed into the same Apple ID you used to subscribe, then restart the app.',
      },
    ],
  },
  {
    heading: 'Privacy & Your Data',
    questions: [
      {
        q: 'What data do you collect?',
        a: 'Each app has its own privacy policy that explains exactly what data is collected and how it\u2019s used. You can find links to each app\u2019s privacy policy on our home page or in the app itself.',
      },
      {
        q: 'How do I delete my data?',
        a: 'You can delete your data from within each app\u2019s settings. If you\u2019d like us to delete all data associated with your account, email us and we\u2019ll process your request within 30 days.',
      },
      {
        q: 'Do you sell my data?',
        a: 'No. BloomWave does not sell, rent, or trade your personal information to third parties. See our privacy policies for full details.',
      },
    ],
  },
  {
    heading: 'General Questions',
    questions: [
      {
        q: 'Which devices are supported?',
        a: 'BloomWave apps are designed for iPhone and require iOS 17.0 or later. Some apps may also support iPad.',
      },
      {
        q: 'I found a bug. How do I report it?',
        a: 'We appreciate bug reports! Email us at the address below with a description of the issue, the app name, and your device/iOS version. Screenshots are always helpful.',
      },
      {
        q: 'Do you have an Android version?',
        a: 'Currently, BloomWave apps are only available on iOS. We may consider Android in the future, but we don\u2019t have a timeline to share yet.',
      },
    ],
  },
]

export default function SupportPage() {
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
          Support
        </h1>
        <p className="text-lg text-bark-300 mb-12">
          Find answers to common questions or get in touch with our team.
        </p>

        <div className="space-y-10 text-bark-500 leading-relaxed">
          {faqs.map((section) => (
            <section key={section.heading}>
              <h2 className="font-serif text-2xl text-bark-600 mb-5">
                {section.heading}
              </h2>
              <div className="space-y-5">
                {section.questions.map((faq) => (
                  <div key={faq.q}>
                    <h3 className="font-medium text-bark-600 mb-1">
                      {faq.q}
                    </h3>
                    <p className="text-sm">{faq.a}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">
              Still Need Help?
            </h2>
            <p className="mb-4">
              If you couldn&rsquo;t find the answer you&rsquo;re looking for,
              we&rsquo;re happy to help. Send us an email and we&rsquo;ll get
              back to you as soon as we can.
            </p>
            <div className="bg-cream-200/50 rounded-xl p-6 text-sm">
              <p className="font-medium text-bark-600">BloomWave Support</p>
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
              <p className="mt-3 text-bark-300">
                We typically respond within 1&ndash;2 business days.
              </p>
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
