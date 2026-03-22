import PrivacyPolicy from '@/components/PrivacyPolicy'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Chibi Jump | BloomWave',
  description:
    'Privacy policy for Chibi Jump, a free old school platformer starring a jumping spider by BloomWave.',
}

export default function ChibiJumpPrivacyPage() {
  return (
    <PrivacyPolicy
      appName="Chibi Jump"
      effectiveDate="March 19, 2026"
      description="Chibi Jump is a free old school platformer starring a jumping spider. The game is completely free with no in-app purchases, no subscriptions, and no advertising."
      dataCollected={[
        {
          category: 'Information You Provide',
          items: [
            'Game progress including level completion and unlocked content',
            'High scores and personal best records',
          ],
        },
        {
          category: 'Automatically Collected Information',
          items: [
            'Device information (device model, operating system version)',
            'Basic app usage data (sessions, play time)',
            'Crash logs and performance diagnostics',
          ],
        },
      ]}
      dataUsage={[
        'Saving your game progress and high scores so you can continue where you left off',
        'Improving app performance and fixing bugs through crash log analysis',
        'Ensuring the game runs correctly on your device',
      ]}
      thirdParties={[
        {
          name: 'Apple',
          purpose:
            'App distribution via the App Store and basic analytics',
          url: 'https://www.apple.com/legal/privacy/',
        },
      ]}
      childrenAge={4}
      retentionPeriod="Chibi Jump stores game progress and high scores locally on your device. We do not maintain user accounts or store personal data on external servers. Locally stored data persists until you delete the app from your device."
      additionalSections={[
        {
          title: 'Minimal Data Collection',
          content:
            'Chibi Jump is designed with minimal data collection in mind. The game does not require an account, does not collect personal information such as names or email addresses, and does not track your behavior for advertising or analytics purposes beyond basic crash reporting. Game progress and high scores are stored locally on your device and are not transmitted to external servers. We believe games can be fun without collecting unnecessary data.',
        },
        {
          title: 'COPPA Compliance',
          content:
            'Chibi Jump is designed to be safe for players of all ages, including children as young as 4 years old. In compliance with the Children\'s Online Privacy Protection Act (COPPA) and similar international regulations, the app does not collect personal information from children, does not include any social features such as chat, messaging, or user-generated content sharing, does not contain advertising or links to external websites, does not include in-app purchases or any form of monetization, and does not use analytics that track individual users. Parents and guardians can feel confident that their children can enjoy Chibi Jump without privacy concerns.',
        },
        {
          title: 'No Advertising',
          content:
            'Chibi Jump does not display any advertisements. We do not integrate with any advertising networks or ad mediation platforms. No advertising identifiers (such as IDFA) are collected or used. The game is entirely free and supported without ads, so your gameplay experience is never interrupted and your data is never shared with advertisers.',
        },
      ]}
    />
  )
}
