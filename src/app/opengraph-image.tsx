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
          width: '100%',
          height: '100%',
          backgroundColor: '#1C3726',
          padding: '72px 80px',
          justifyContent: 'space-between',
          position: 'relative',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: '#2d5a3d',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 280,
            height: 280,
            borderRadius: '50%',
            backgroundColor: '#2d5a3d',
            display: 'flex',
          }}
        />

        {/* Center content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            gap: 24,
            position: 'relative',
          }}
        >
          {/* Leaf icon */}
          <div style={{ display: 'flex', marginBottom: 8 }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              stroke="#4A8C5C"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <path d="M32 56V32" />
              <path d="M32 32C32 24 24 16 16 16C16 24 24 32 32 32Z" />
              <path d="M32 32C32 24 40 16 48 16C48 24 40 32 32 32Z" />
              <path d="M32 40C32 34 26 28 20 28C20 34 26 40 32 40Z" />
              <path d="M32 40C32 34 38 28 44 28C44 34 38 40 32 40Z" />
              <circle cx="32" cy="14" r="3" />
            </svg>
          </div>

          <div
            style={{
              fontSize: 88,
              fontWeight: 700,
              color: '#FFFDF7',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              fontFamily: 'serif',
              display: 'flex',
            }}
          >
            BloomWave
          </div>

          <div
            style={{
              fontSize: 28,
              color: '#7BA88A',
              lineHeight: 1.4,
              textAlign: 'center',
              maxWidth: 640,
              display: 'flex',
            }}
          >
            Apps for the curious, the mystical, and the beautifully weird.
          </div>
        </div>

        {/* Bottom: app icons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            position: 'relative',
          }}
        >
          {['🌸', '✨', '🌿'].map((icon, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                width: 52,
                height: 52,
                borderRadius: 14,
                backgroundColor: '#2d5a3d',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 26,
              }}
            >
              {icon}
            </div>
          ))}
          <div
            style={{
              display: 'flex',
              width: 1,
              height: 28,
              backgroundColor: '#3d7a50',
              margin: '0 4px',
            }}
          />
          <div
            style={{
              fontSize: 18,
              color: '#4A8C5C',
              letterSpacing: '0.06em',
              display: 'flex',
            }}
          >
            bloomwave.app
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}
