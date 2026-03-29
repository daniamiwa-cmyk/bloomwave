import { ImageResponse } from 'next/og'
import { apps } from '@/data/apps'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug)

  if (!app) {
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#1a3a2a', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#faf8f1', fontSize: 48 }}>BloomWave</span>
      </div>,
      { ...size }
    )
  }

  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: '#1C3726',
        padding: '64px 72px',
        justifyContent: 'space-between',
      }}
    >
      {/* Top: app icon + name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div
          style={{
            display: 'flex',
            width: 96,
            height: 96,
            borderRadius: 24,
            backgroundColor: app.iconBg,
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 52,
          }}
        >
          {app.icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#FFFDF7',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {app.name}
          </div>
          <div
            style={{
              fontSize: 28,
              color: '#8BAE8B',
              lineHeight: 1.4,
              maxWidth: 800,
            }}
          >
            {app.tagline}
          </div>
        </div>
      </div>

      {/* Bottom: BloomWave studio label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div style={{ width: 40, height: 1, backgroundColor: '#4A8C5C' }} />
        <div style={{ fontSize: 22, color: '#4A8C5C', letterSpacing: '0.05em' }}>
          BloomWave
        </div>
      </div>
    </div>,
    { ...size }
  )
}
