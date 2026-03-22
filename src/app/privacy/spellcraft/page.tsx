import PrivacyPolicy from '@/components/PrivacyPolicy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — SpellCraft Studio | BloomWave',
  description:
    'Privacy policy for SpellCraft Studio, a modern witchcraft app with herbs, stones, and spells encyclopedia by BloomWave.',
}

export default function SpellCraftPrivacyPage() {
  return (
    <PrivacyPolicy
      appName="SpellCraft Studio"
      effectiveDate="March 19, 2026"
      description="SpellCraft Studio is a modern witchcraft app featuring a comprehensive encyclopedia of herbs, stones, and spells to support your magical practice. The app is available as a free version with optional Pro subscription at $5.99/month."
      dataCollected={[
        {
          category: 'Information You Provide',
          items: [
            'User preferences such as favorite herbs, stones, and spell categories',
            'Saved collections and bookmarked encyclopedia entries',
            'Custom spells you create, including ingredients, instructions, and notes',
            'Account information such as name and email address if you create an account',
            'Subscription and purchase information',
          ],
        },
        {
          category: 'Automatically Collected Information',
          items: [
            'Device information (device model, operating system version, unique device identifiers)',
            'App usage data (features used, search queries, session duration)',
            'Crash logs and performance diagnostics',
            'Subscription status and transaction receipts',
          ],
        },
      ]}
      dataUsage={[
        'Providing and personalizing encyclopedia content based on your preferences',
        'Saving and syncing your collections and custom spells across sessions',
        'Processing and managing your subscription and in-app purchases',
        'Improving search results and content recommendations',
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
      retentionPeriod="We retain your user preferences, saved collections, and custom spells for as long as your account is active or as needed to provide you with the app's services. You can delete individual items from your collections or custom spells at any time from within the app. If you delete your account, all associated data will be removed within 30 days."
      additionalSections={[
        {
          title: 'User-Created Content',
          content:
            'SpellCraft Studio allows you to create and save custom spells, collections, and notes. This user-created content is stored to provide you with a persistent and personalized experience. Your custom content is private to your account and is not shared with other users unless you explicitly choose to share it. We do not claim ownership of any content you create within the app. You retain full rights to your custom spells, collections, and notes, and you may delete them at any time. If you choose to export your content, it will be provided in a standard format for your personal use.',
        },
      ]}
    />
  )
}
