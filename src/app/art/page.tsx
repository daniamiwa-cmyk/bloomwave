import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Art — BloomWave',
  description:
    'Hand-painted oil works on small canvases — stones, shells, and natural forms by the maker behind BloomWave.',
}

const paintings = [
  {
    src: '/art/painting-1.png',
    alt: 'Oval canvas with stones in amber, purple, and ochre tones',
    label: 'Stones I',
  },
  {
    src: '/art/painting-2.png',
    alt: 'Circular canvas with stones in warm reds, greens, and purples',
    label: 'Stones II',
  },
  {
    src: '/art/painting-3.png',
    alt: 'Square canvas with stones in orange and crimson',
    label: 'Stones III',
  },
  {
    src: '/art/painting-4.png',
    alt: 'Square canvas with shells and stones in gold and ochre',
    label: 'Shells & Stones',
  },
]

export default function ArtPage() {
  return (
    <section className="max-w-5xl mx-auto px-6 pt-28 pb-24">
      <h1 className="font-serif text-5xl sm:text-6xl text-bark-600 text-center tracking-tight">
        Art
      </h1>

      <div className="flex items-center gap-3 my-8 justify-center">
        <div className="w-12 h-px bg-forest-400/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-forest-400/40" />
        <div className="w-12 h-px bg-forest-400/40" />
      </div>

      <p className="text-center text-bark-300 max-w-lg mx-auto leading-relaxed mb-16">
        Hand-painted oil works on small canvases — oval, circle, and square.
        Stones, shells, and natural forms, painted by the same hand that builds
        the apps.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        {paintings.map((painting) => (
          <div key={painting.src} className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src={painting.src}
                alt={painting.alt}
                width={450}
                height={600}
                className="w-full h-auto drop-shadow-xl"
              />
            </div>
            <span className="text-sm text-bark-300 font-serif">
              {painting.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
