import PrivacyPolicy from '@/components/PrivacyPolicy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Fated & Jaded | BloomWave',
  description:
    'Privacy policy for Fated & Jaded, an irreverent astrology app by BloomWave.',
}

export default function FatedAndJadedPrivacyPage() {
  return (
    <PrivacyPolicy
      appName="Fated & Jaded"
      effectiveDate="March 19, 2026"
      description="Fated & Jaded is an irreverent astrology app that delivers your cosmic truths without the fluff. The app is available as a free version with optional Pro subscription at $7.99/month."
      dataCollected={[
        {
          category: 'Information You Provide',
          items: [
            'Birth data including date of birth, time of birth, and location of birth used to calculate your natal chart',
            'Astrological preferences such as preferred zodiac system, house system, and content tone',
            'Account information such as name and email address if you create an account',
            'Subscription and purchase information',
          ],
        },
        {
          category: 'Automatically Collected Information',
          items: [
            'Device information (device model, operating system version, unique device identifiers)',
            'App usage data (features used, horoscopes viewed, session duration)',
            'Crash logs and performance diagnostics',
            'Subscription status and transaction receipts',
          ],
        },
      ]}
      dataUsage={[
        'Calculating and generating your natal chart, transits, and horoscope readings',
        'Personalizing astrological content and daily horoscopes based on your birth data',
        'Saving your astrological profile so you do not need to re-enter birth details',
        'Processing and managing your subscription and in-app purchases',
        'Improving app performance, stability, and user experience',
        'Analyzing aggregated, anonymized usage trends to improve the app',
      ]}
      thirdParties={[
        {
          name: 'Apple',
          purpose:
            'App distribution via the App Store, payment processing for subscriptions, and analytics',
          url: 'https://www.apple.com/legal/privacy/',
        },
        {
          name: 'RevenueCat',
          purpose:
            'Subscription management, in-app purchase processing, and entitlement tracking',
          url: 'https://www.revenuecat.com/privacy/',
        },
      ]}
      retentionPeriod="We retain your birth data and astrological preferences for as long as your account is active or as needed to provide you with the app's services. You can update or delete your birth data at any time from within the app settings. If you delete your account, all associated data will be removed within 30 days."
      additionalSections={[
        {
          title: 'Birth Data Sensitivity',
          content:
            'We understand that birth data — including your date, time, and location of birth — is personal information. This data is collected solely for the purpose of generating accurate astrological charts and personalized horoscope content. Your birth data is stored securely and is never sold to third parties, used for advertising or marketing purposes beyond the app, shared publicly or with other users, or used for identity verification or any non-astrological purpose. You may update or delete your birth data at any time through the app settings. If you choose not to provide your birth time or location, the app will still function with reduced astrological precision.',
        },
      ]}
    />
  )
}
