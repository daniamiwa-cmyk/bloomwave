import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'BloomWave — Apps for the curious, the mystical, and the beautifully weird.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: '#1a3a2a',
          color: '#faf8f1',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 96,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: 16,
          }}
        >
          BloomWave
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            opacity: 0.8,
            maxWidth: 600,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Apps for the curious, the mystical, and the beautifully weird.
        </div>
      </div>
    ),
    { ...size },
  )
}
