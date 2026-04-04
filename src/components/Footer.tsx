import Link from 'next/link'

const apps = [
  { name: 'All Days', slug: 'all-days' },
  { name: 'Amaia', slug: 'amaia' },
  { name: 'Bloom Affirmations', slug: 'bloom' },
  { name: 'Chibi Jump', slug: 'chibi-jump' },
  { name: 'Fated & Jaded', slug: 'fated-and-jaded' },
  { name: 'Root & Rune', slug: 'root-and-rune' },
  { name: 'SpellCraft Studio', slug: 'spellcraft' },
  { name: 'WildMind', slug: 'wildmind' },
]

export default function Footer() {
  return (
    <footer className="border-t border-cream-300 bg-cream-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div>
            <p className="font-serif text-lg text-bark-600">BloomWave</p>
            <p className="text-sm text-bark-300 mt-1">
              Apps for the curious, the mystical,
              <br />
              and the beautifully weird.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-bark-300 mb-3">
                Privacy Policies
              </p>
              <ul className="space-y-2 text-sm">
                {apps.map((app) => (
                  <li key={app.slug}>
                    <Link href={`/privacy/${app.slug}`} className="text-bark-400 hover:text-forest-500 transition-colors">
                      {app.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-bark-300 mb-3">
                Terms of Use
              </p>
              <ul className="space-y-2 text-sm">
                {apps.map((app) => (
                  <li key={app.slug}>
                    <Link href={`/terms/${app.slug}`} className="text-bark-400 hover:text-forest-500 transition-colors">
                      {app.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-bark-300 mb-3">
                Help
              </p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/support"
                    className="text-bark-400 hover:text-forest-500 transition-colors"
                  >
                    Support &amp; FAQ
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:daniamiwa@bloomwave.app"
                    className="text-bark-400 hover:text-forest-500 transition-colors"
                  >
                    daniamiwa@bloomwave.app
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-cream-300 text-center">
          <p className="text-xs text-bark-300">
            &copy; {new Date().getFullYear()} BloomWave. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
