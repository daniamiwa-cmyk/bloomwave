import { ImageResponse } from 'next/og'
import { apps } from '@/data/apps'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return apps
    .filter((app) => app.status === 'available')
    .map((app) => ({ slug: app.slug }))
}

export default async function OgImage({ params }: { params: { slug: string } }) {
  const app = apps.find((a) => a.slug === params.slug)

  if (!app) {
    return new ImageResponse(
      <div style={{ display: 'flex', width: '100%', height: '100%', backgroundColor: '#1C3726', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: '#faf8f1', fontSize: 48, fontFamily: 'serif' }}>BloomWave</span>
      </div>,
      { ...size }
    )
  }

  // Fetch the real app icon for use in the OG image
  let iconSrc: string | null = null
  if (app.iconImage) {
    try {
      const res = await fetch(`https://bloomwave.app${app.iconImage}`)
      const buffer = await res.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const mimeType = app.iconImage.endsWith('.png') ? 'image/png' : 'image/jpeg'
      iconSrc = `data:${mimeType};base64,${base64}`
    } catch {
      iconSrc = null
    }
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          backgroundColor: '#1C3726',
          position: 'relative',
        }}
      >
        {/* Color accent panel */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '42%',
            height: '100%',
            backgroundColor: app.iconBg,
            opacity: 0.15,
            display: 'flex',
          }}
        />

        {/* Decorative circle */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 380,
            height: 380,
            borderRadius: '50%',
            backgroundColor: app.iconBg,
            opacity: 0.12,
            display: 'flex',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            width: '100%',
            position: 'relative',
          }}
        >
          {/* App icon + name + tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {/* Icon */}
            {iconSrc ? (
              <img
                src={iconSrc}
                width={100}
                height={100}
                style={{ borderRadius: 24, objectFit: 'cover', display: 'flex' }}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  width: 100,
                  height: 100,
                  borderRadius: 24,
                  backgroundColor: app.iconBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 52,
                }}
              >
                {app.icon}
              </div>
            )}

            {/* Text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div
                style={{
                  fontSize: 74,
                  fontWeight: 700,
                  color: '#FFFDF7',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.05,
                  fontFamily: 'serif',
                  display: 'flex',
                  maxWidth: 900,
                }}
              >
                {app.name}
              </div>
              <div
                style={{
                  fontSize: 26,
                  color: '#7BA88A',
                  lineHeight: 1.45,
                  maxWidth: 700,
                  display: 'flex',
                }}
              >
                {app.tagline}
              </div>
            </div>
          </div>

          {/* Bottom: BloomWave label + price */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 1, backgroundColor: '#4A8C5C', display: 'flex' }} />
              <div style={{ fontSize: 20, color: '#4A8C5C', letterSpacing: '0.05em', display: 'flex' }}>
                BloomWave
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 18,
                color: '#FFFDF7',
                backgroundColor: '#2d5a3d',
                padding: '8px 20px',
                borderRadius: 100,
              }}
            >
              {app.price}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
