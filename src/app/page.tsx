import AppCard, { AppInfo } from '@/components/AppCard'
import Newsletter from '@/components/Newsletter'

const apps: AppInfo[] = [
  {
    name: 'Bloom Affirmations',
    slug: 'bloom',
    tagline:
      'Daily affirmations, AI coaching, mood check-ins, and journaling — your pocket companion for intentional living.',
    price: 'Free + Pro $4.99/mo',

    icon: '\u{1F338}',
    iconBg: '#F5E0E0',
    iconImage: '/icons/bloom.jpg',
  },
  {
    name: 'SpellCraft Studio',
    slug: 'spellcraft',
    tagline:
      'A modern witchcraft companion — explore herbs, stones, and spells with a beautifully curated encyclopedia.',
    price: 'Free + Pro $5.99/mo',

    icon: '\u2728',
    iconBg: '#E6DFEF',
    iconImage: '/icons/spellcraft.png',
  },
  {
    name: 'Amaia',
    slug: 'amaia',
    tagline:
      'An AI companion who actually remembers you. Gentle coaching, daily check-ins, and real conversations.',
    price: 'Free + In-App Purchases',

    icon: '\u{1F319}',
    iconBg: '#DDE8F0',
    iconImage: '/icons/amaia.png',
  },
  {
    name: 'Fated & Jaded',
    slug: 'fated-and-jaded',
    tagline:
      'Irreverent astrology for people who don\u2019t believe in astrology. Sarcasm-forward cosmic guidance.',
    price: 'Free + Pro $7.99/mo',

    icon: '\u{1F52E}',
    iconBg: '#F0E0DD',
    iconImage: '/icons/fatedjaded.png',
    status: 'in-development',
  },
  {
    name: 'Root & Rune',
    slug: 'root-and-rune',
    tagline:
      'Gamified education in astrology, tarot, hedge witchery, and dream work. Learn at your own pace.',
    price: 'Free (3 snails/day) + Premium $9.99/mo',

    icon: '\u{1F33F}',
    iconBg: '#DDE8DD',
    iconImage: '/icons/rootandrune.png',
  },
  {
    name: 'Chibi Jump',
    slug: 'chibi-jump',
    tagline:
      'An old-school platformer starring a tiny, determined jumping spider. Simple. Addictive. Adorable.',
    price: 'Free',

    icon: '\u{1F577}\uFE0F',
    iconBg: '#F0ECD5',
    iconImage: '/icons/chibijump.png',
    status: 'in-development',
  },
]

interface Screenshot {
  src: string
  alt: string
}

const showcases: { name: string; screenshots: Screenshot[] }[] = [
  {
    name: 'SpellCraft Studio',
    screenshots: [
      { src: '/screenshots/spellcraft-home.png', alt: 'SpellCraft home screen showing moon phase and daily wisdom' },
      { src: '/screenshots/spellcraft-craft.png', alt: 'Craft a spell interface with intention categories' },
      { src: '/screenshots/spellcraft-encyclopedia.png', alt: 'Encyclopedia of herbs, crystals, and oils' },
    ],
  },
]

export default function Home() {
  return (
    <>
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 pt-14">
        <svg
          className="w-16 h-16 text-forest-400 mb-8 opacity-60"
          viewBox="0 0 64 64"
          fill="none"
          stroke="currentColor"
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

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-bark-600 tracking-tight">
          BloomWave
        </h1>

        <div className="flex items-center gap-3 my-8">
          <div className="w-12 h-px bg-forest-400/40" />
          <div className="w-1.5 h-1.5 rounded-full bg-forest-400/40" />
          <div className="w-12 h-px bg-forest-400/40" />
        </div>

        <p className="font-sans text-lg sm:text-xl md:text-2xl text-bark-300 max-w-xl text-balance leading-relaxed">
          Apps for the curious, the mystical, and the beautifully weird.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-12">
          <div className="h-px flex-1 bg-cream-300" />
          <h2 className="font-serif text-lg text-bark-300">Our Apps</h2>
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {apps.map((app) => (
            <AppCard key={app.slug} app={app} />
          ))}
        </div>
      </section>

      {showcases.map((showcase) => (
        <section key={showcase.name} className="max-w-6xl mx-auto px-6 pb-24">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px flex-1 bg-cream-300" />
            <h2 className="font-serif text-lg text-bark-300">
              Inside {showcase.name}
            </h2>
            <div className="h-px flex-1 bg-cream-300" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 justify-items-center">
            {showcase.screenshots.map((screenshot) => (
              <div
                key={screenshot.src}
                className="relative rounded-3xl overflow-hidden shadow-xl shadow-bark-500/10 border border-cream-300/40 max-w-[280px]"
              >
                <img
                  src={screenshot.src}
                  alt={screenshot.alt}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </section>
      ))}

      <Newsletter />
    </>
  )
}
