import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-100/80 backdrop-blur-md border-b border-cream-300/50">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="font-serif text-xl text-bark-600 hover:text-forest-500 transition-colors">
          BloomWave
        </Link>
        <nav className="flex items-center gap-5">
          <Link
            href="/about"
            className="text-sm text-bark-300 hover:text-forest-500 transition-colors"
          >
            About
          </Link>
          <Link
            href="/art"
            className="text-sm text-bark-300 hover:text-forest-500 transition-colors"
          >
            Art
          </Link>
          <Link
            href="/store"
            className="text-sm text-bark-300 hover:text-forest-500 transition-colors"
          >
            Shop
          </Link>
          <Link
            href="/support"
            className="text-sm text-bark-300 hover:text-forest-500 transition-colors"
          >
            Support
          </Link>
          <a
            href="mailto:daniamiwa@bloomwave.app"
            className="text-sm text-bark-300 hover:text-forest-500 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>
    </header>
  )
}
