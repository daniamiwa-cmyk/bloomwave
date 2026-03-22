import Link from 'next/link'

interface DataCategory {
  category: string
  items: string[]
}

interface ThirdPartyService {
  name: string
  purpose: string
  url: string
}

export interface PrivacyPolicyProps {
  appName: string
  effectiveDate: string
  description: string
  dataCollected: DataCategory[]
  dataUsage: string[]
  thirdParties: ThirdPartyService[]
  childrenAge?: number
  retentionPeriod: string
  additionalSections?: { title: string; content: string }[]
}

export default function PrivacyPolicy({
  appName,
  effectiveDate,
  description,
  dataCollected,
  dataUsage,
  thirdParties,
  childrenAge = 13,
  retentionPeriod,
  additionalSections,
}: PrivacyPolicyProps) {
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
        <p className="text-lg text-bark-300 mb-2">{appName}</p>
        <p className="text-sm text-bark-200 mb-12">
          Effective Date: {effectiveDate}
        </p>

        <div className="prose-policy space-y-10 text-bark-500 leading-relaxed">
          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Introduction</h2>
            <p>
              BloomWave (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) operates {appName} (the &ldquo;App&rdquo;). {description}
            </p>
            <p className="mt-3">
              This Privacy Policy explains what information we collect, how we use it, and your choices regarding your data. By using the App, you agree to the collection and use of information as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Information We Collect</h2>
            {dataCollected.map((cat) => (
              <div key={cat.category} className="mb-6">
                <h3 className="font-medium text-bark-600 mb-2">{cat.category}</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {cat.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">How We Use Your Information</h2>
            <p className="mb-3">We use the information we collect for the following purposes:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {dataUsage.map((usage) => (
                <li key={usage}>{usage}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Data Storage &amp; Security</h2>
            <p>
              We take reasonable measures to protect your personal information from unauthorized access, use, or disclosure. Your data may be stored on secure cloud servers provided by reputable hosting services.
            </p>
            <p className="mt-3">
              While we implement industry-standard security measures including encryption in transit (TLS/SSL) and at rest, no method of electronic storage or transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
            </p>
            <p className="mt-3">
              Data that is stored locally on your device is protected by your device&rsquo;s built-in security features. We recommend keeping your device&rsquo;s operating system up to date and using a device passcode.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Third-Party Services</h2>
            <p className="mb-4">
              The App may use the following third-party services that may collect information about you:
            </p>
            {thirdParties.map((tp) => (
              <div key={tp.name} className="mb-3">
                <p className="text-sm">
                  <strong>{tp.name}</strong> &mdash; {tp.purpose}.{' '}
                  <a
                    href={tp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </p>
              </div>
            ))}
          </section>

          {additionalSections?.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-bark-600 mb-4">{section.title}</h2>
              <p>{section.content}</p>
            </section>
          ))}

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Children&rsquo;s Privacy</h2>
            <p>
              The App is not directed to children under the age of {childrenAge}. We do not knowingly collect personal information from children under {childrenAge}. If we become aware that we have collected personal information from a child under {childrenAge}, we will take steps to delete that information as soon as possible.
            </p>
            <p className="mt-3">
              If you are a parent or guardian and believe your child has provided us with personal information, please contact us at{' '}
              <a href="mailto:chibijumpstore@gmail.com" className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors">
                chibijumpstore@gmail.com
              </a>{' '}
              so we can take appropriate action.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Your Rights</h2>
            <p className="mb-3">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li><strong>Access:</strong> You may request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> You may request that we correct inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> You may request that we delete your personal data, subject to legal obligations.</li>
              <li><strong>Portability:</strong> You may request a copy of your data in a portable format.</li>
              <li><strong>Restriction:</strong> You may request that we restrict the processing of your data under certain circumstances.</li>
              <li><strong>Objection:</strong> You may object to the processing of your data for specific purposes.</li>
              <li><strong>Withdrawal of Consent:</strong> Where we rely on consent, you may withdraw it at any time.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:chibijumpstore@gmail.com" className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors">
                chibijumpstore@gmail.com
              </a>
              . We will respond to your request within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Data Retention</h2>
            <p>{retentionPeriod}</p>
            <p className="mt-3">
              If you delete your account or request data deletion, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (such as resolving disputes or enforcing agreements).
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. When we do, we will revise the &ldquo;Effective Date&rdquo; at the top of this page and, where appropriate, notify you through the App or via email.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-2xl text-bark-600 mb-4">Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:</p>
            <div className="mt-4 bg-cream-200/50 rounded-xl p-6 text-sm">
              <p className="font-medium text-bark-600">BloomWave</p>
              <p className="mt-1">
                Email:{' '}
                <a href="mailto:chibijumpstore@gmail.com" className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors">
                  chibijumpstore@gmail.com
                </a>
              </p>
              <p className="mt-1">
                Website:{' '}
                <a href="https://bloomwave.app" className="text-forest-500 hover:text-forest-600 underline underline-offset-2 transition-colors">
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
