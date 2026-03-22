import PrivacyPolicy from '@/components/PrivacyPolicy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Amaia | BloomWave',
  description:
    'Privacy policy for Amaia, an AI companion who remembers you, with coaching and daily check-ins by BloomWave.',
}

export default function AmaiaPrivacyPage() {
  return (
    <PrivacyPolicy
      appName="Amaia"
      effectiveDate="March 19, 2026"
      description="Amaia is an AI companion who remembers you, offering personalized coaching and daily check-ins to support your well-being. The app is available for free with optional in-app purchases."
      dataCollected={[
        {
          category: 'Information You Provide',
          items: [
            'Conversation history with Amaia, including messages you send and responses received',
            'Personal information you voluntarily share during conversations (such as your name, interests, life events, and goals)',
            'Daily check-in data (mood, energy level, notes, and timestamps)',
            'Memory data that Amaia stores to remember details about you and personalize future conversations',
            'Account information such as name and email address if you create an account',
            'In-app purchase information',
          ],
        },
        {
          category: 'Automatically Collected Information',
          items: [
            'Device information (device model, operating system version, unique device identifiers)',
            'App usage data (features used, session duration, frequency of check-ins)',
            'Crash logs and performance diagnostics',
            'Purchase receipts and entitlement status',
          ],
        },
      ]}
      dataUsage={[
        'Powering Amaia\'s AI conversations and generating personalized, context-aware responses',
        'Maintaining Amaia\'s memory of your preferences, goals, and personal details to create a continuous relationship',
        'Tracking your daily check-in patterns and surfacing insights about your well-being over time',
        'Processing and managing in-app purchases',
        'Improving app performance, stability, and user experience',
        'Analyzing aggregated, anonymized usage trends to improve the app',
      ]}
      thirdParties={[
        {
          name: 'Apple',
          purpose:
            'App distribution via the App Store, payment processing for in-app purchases, and analytics',
          url: 'https://www.apple.com/legal/privacy/',
        },
        {
          name: 'RevenueCat',
          purpose:
            'In-app purchase management, receipt validation, and entitlement tracking',
          url: 'https://www.revenuecat.com/privacy/',
        },
        {
          name: 'OpenAI',
          purpose:
            'AI language model processing for generating conversational responses and coaching guidance',
          url: 'https://openai.com/privacy/',
        },
        {
          name: 'Anthropic',
          purpose:
            'AI language model processing for generating conversational responses and personalized interactions',
          url: 'https://www.anthropic.com/privacy',
        },
      ]}
      retentionPeriod="We retain your conversation history, memory data, and daily check-in records for as long as your account is active or as needed to provide you with the app's services. Because Amaia's core experience depends on remembering you, your memory data is retained to maintain continuity. You can review, edit, or delete specific memories at any time from within the app. If you delete your account, all associated data — including conversation history and memory data — will be permanently removed within 30 days."
      additionalSections={[
        {
          title: 'AI Data Processing',
          content:
            'Amaia uses AI language models provided by OpenAI and Anthropic to generate conversational responses. When you send a message, relevant conversation context and memory data are sent to these providers to generate a meaningful response. These providers process your data according to their respective privacy policies and our data processing agreements with them. We do not use your conversations to train third-party AI models. Amaia\'s AI processing is designed to be helpful and supportive, but it is not a substitute for professional medical, psychological, or therapeutic advice.',
        },
        {
          title: 'Memory Control',
          content:
            'Amaia remembers details you share across conversations to create a personalized, continuous companion experience. You have full control over what Amaia remembers. You can view all stored memories at any time within the app, edit or correct any memory that is inaccurate, delete individual memories you no longer want Amaia to retain, or clear all memories entirely to start fresh. When you delete a memory, it is permanently removed and will no longer influence future conversations.',
        },
        {
          title: 'Sensitive Information',
          content:
            'Please be mindful that Amaia is an AI companion and conversations may feel personal and intimate. While we take strong measures to protect your data, we encourage you to exercise discretion when sharing highly sensitive information such as financial details, medical records, passwords, or government identification numbers. Amaia is designed for emotional support, personal growth, and companionship — not for handling confidential or regulated information. If you do share sensitive information, it will be treated with the same security measures as all other data, but we recommend against sharing information that could put you at risk if disclosed.',
        },
      ]}
    />
  )
}
