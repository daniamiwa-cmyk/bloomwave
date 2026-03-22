import PrivacyPolicy from '@/components/PrivacyPolicy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Bloom Affirmations | BloomWave',
  description:
    'Privacy policy for Bloom Affirmations, a daily affirmations app with AI coaching, mood check-ins, and journaling by BloomWave.',
}

export default function BloomPrivacyPage() {
  return (
    <PrivacyPolicy
      appName="Bloom Affirmations"
      effectiveDate="March 19, 2026"
      description="Bloom Affirmations is a daily affirmations app featuring an AI coach, mood check-ins, and journaling to support your personal growth and mental wellness. The app is available as a free version with optional Pro subscription at $4.99/month."
      dataCollected={[
        {
          category: 'Information You Provide',
          items: [
            'Mood check-in data (mood selections, timestamps, and any notes you add)',
            'Journal entries and reflections you write within the app',
            'AI coaching conversations and prompts you submit',
            'Account information such as name and email address if you create an account',
            'Affirmation preferences and customization settings',
            'Subscription and purchase information',
          ],
        },
        {
          category: 'Automatically Collected Information',
          items: [
            'Device information (device model, operating system version, unique device identifiers)',
            'App usage data (features used, session duration, frequency of use)',
            'Crash logs and performance diagnostics',
            'Subscription status and transaction receipts',
          ],
        },
      ]}
      dataUsage={[
        'Providing and personalizing daily affirmations based on your mood and preferences',
        'Powering AI coaching conversations and generating personalized guidance',
        'Tracking your mood patterns and journaling history to surface insights',
        'Processing and managing your subscription and in-app purchases',
        'Improving app performance, stability, and user experience',
        'Sending optional notifications such as daily affirmation reminders',
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
        {
          name: 'OpenAI',
          purpose:
            'AI-powered coaching conversations, affirmation generation, and personalized guidance',
          url: 'https://openai.com/privacy/',
        },
      ]}
      retentionPeriod="We retain your mood data, journal entries, and AI coaching conversations for as long as your account is active or as needed to provide you with the app's services. You can delete individual journal entries or mood records at any time from within the app. If you delete your account, all associated data will be removed within 30 days."
      additionalSections={[
        {
          title: 'Subscription Information',
          content:
            'Bloom Affirmations offers a free tier and an optional Pro subscription at $4.99/month. Subscriptions are processed through Apple and managed via RevenueCat. We do not directly collect or store your payment card details. Your subscription status is used to unlock Pro features such as unlimited AI coaching sessions, advanced mood analytics, and premium affirmation content. You can manage or cancel your subscription at any time through your Apple ID settings.',
        },
        {
          title: 'AI Coaching Data',
          content:
            'When you interact with the AI coach, your conversation messages are sent to OpenAI for processing. We send only the content necessary to generate a helpful response. OpenAI processes this data according to their privacy policy and data usage agreements. Your coaching conversations are stored on our servers to maintain conversation history and context. We do not use your coaching conversations to train AI models. You can delete your coaching conversation history at any time from the app settings.',
        },
      ]}
    />
  )
}
