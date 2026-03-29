import type { Metadata } from 'next'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const dmSerif = DM_Serif_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://bloomwave.app'),
  title: 'BloomWave — Apps for the curious, the mystical, and the beautifully weird.',
  description:
    'BloomWave is a mobile app studio crafting warm, beautiful apps for the curious, the mystical, and the beautifully weird.',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'BloomWave',
    description: 'Apps for the curious, the mystical, and the beautifully weird.',
    url: 'https://bloomwave.app',
    siteName: 'BloomWave',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BloomWave',
    description: 'Apps for the curious, the mystical, and the beautifully weird.',
  },
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BloomWave',
  url: 'https://bloomwave.app',
  logo: 'https://bloomwave.app/favicon.svg',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${dmSans.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
