'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AppInfo } from '@/data/apps'

export default function AppCard({ app }: { app: AppInfo }) {
  const router = useRouter()
  const isDev = app.status === 'in-development'
  const isAvailable = app.status === 'available'
  const isClickable = !isDev

  return (
    <div
      className={`group rounded-2xl border border-cream-300/60 p-6 flex flex-col transition-all duration-300 ${isDev ? 'bg-cream-100/50 opacity-50' : 'bg-cream-50 hover:shadow-lg hover:shadow-bark-500/5 hover:-translate-y-1'} ${isClickable ? 'cursor-pointer' : ''}`}
      onClick={isClickable ? () => router.push(`/apps/${app.slug}`) : undefined}
    >
      {app.iconImage ? (
        <img
          src={app.iconImage}
          alt={`${app.name} icon`}
          className={`w-16 h-16 rounded-2xl object-cover mb-5 shadow-sm ${isDev ? 'grayscale' : ''}`}
        />
      ) : (
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-5 shadow-sm ${isDev ? 'grayscale' : ''}`}
          style={{ backgroundColor: app.iconBg }}
        >
          {app.icon}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-serif text-xl text-bark-600">{app.name}</h3>
        <span className={`text-[10px] font-medium uppercase tracking-wider px-2 py-1 rounded-full whitespace-nowrap ${isAvailable ? 'bg-forest-400/10 text-forest-500' : isDev ? 'bg-bark-100/50 text-bark-300' : 'bg-cream-300 text-bark-400'}`}>
          {isAvailable ? 'Available Now' : isDev ? 'In Development' : 'Coming Soon'}
        </span>
      </div>

      <p className="text-sm text-bark-300 leading-relaxed mb-4 flex-1">
        {isDev ? 'Coming soon.' : app.tagline}
      </p>

      <p className="text-xs text-bark-200 mb-4">{app.price}</p>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-cream-200">
        {app.appStoreUrl ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bark-600 text-cream-50 text-[11px] font-medium">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            App Store
          </span>
        ) : isAvailable ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest-400/10 text-forest-500 text-[11px] font-medium">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Available on the App Store
          </span>
        ) : isDev ? (
          <span className="text-[11px] text-bark-200 italic">
            In Development
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cream-200/60 text-bark-300 text-[11px] font-medium">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            Coming Soon
          </span>
        )}

        <div className="flex gap-3">
          <Link
            href={`/terms/${app.slug}`}
            className="text-xs text-bark-300 hover:text-forest-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Terms
          </Link>
          <Link
            href={`/privacy/${app.slug}`}
            className="text-xs text-bark-300 hover:text-forest-500 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy
          </Link>
        </div>
      </div>
    </div>
  )
}
