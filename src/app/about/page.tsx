import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — BloomWave',
  description:
    'BloomWave is a one-person studio built by Dania — apps for the curious, the mystical, and the beautifully weird, made in Portland, Oregon.',
}

export default function AboutPage() {
  return (
    <div className="pt-24 pb-24">
      <article className="max-w-2xl mx-auto px-6">

        {/* Name */}
        <div className="mb-16 mt-8">
          <h1 className="font-serif text-5xl sm:text-6xl text-bark-600 tracking-tight mb-6">
            Hi. I&rsquo;m Dania.
          </h1>
          <div className="h-px w-16 bg-forest-400/40" />
        </div>

        {/* Bio */}
        <div className="space-y-6 text-bark-400 leading-relaxed text-lg">
          <p>
            I build apps, paint in oils, photograph on 4&times;5 film, make small Waldorf gnomes,
            fuse glass, knit things, needle felt other things, coach humans through their messiest
            chapters, advise on travel, and recently acquired a 3D printer. I&rsquo;m told I have
            too many interests. I prefer &ldquo;thoroughly curious.&rdquo;
          </p>

          <p>
            I was a highly successful consultant until the pandemic kindly dismantled everything
            I&rsquo;d built, which turned out to be the best thing that ever happened to me. I
            discovered I&rsquo;m AuDHD, got an ICF coaching credential, and started making apps
            instead of PowerPoints.
          </p>

          <p>
            BloomWave is what happens when someone with too many interests and not enough interest
            in picking just one decides to build tools instead.
          </p>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-14">
          <div className="h-px flex-1 bg-cream-300" />
          <div className="w-1.5 h-1.5 rounded-full bg-forest-400/40" />
          <div className="h-px flex-1 bg-cream-300" />
        </div>

        {/* Studio statement */}
        <div className="space-y-6 text-bark-400 leading-relaxed text-lg">
          <p>
            All of these apps were made by one human — designed, imagined, and released into the
            wild from a studio in downtown Portland, Oregon.
          </p>

          <p>
            They&rsquo;re for the curious, the mystical, and the beautifully weird.
          </p>

          <p className="font-serif text-2xl text-bark-600">
            Which is to say: they&rsquo;re for people like me.
          </p>
        </div>

        {/* Links */}
        <div className="mt-16 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-forest-400 text-cream-50 text-sm font-medium hover:bg-forest-500 transition-colors"
          >
            See the Apps
          </Link>
          <Link
            href="/art"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cream-300 text-bark-400 text-sm font-medium hover:border-forest-400 hover:text-forest-500 transition-colors"
          >
            See the Art
          </Link>
          <a
            href="https://ko-fi.com/bloomwave"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-cream-300 text-bark-400 text-sm font-medium hover:border-forest-400 hover:text-forest-500 transition-colors"
          >
            Support on Ko-fi
          </a>
        </div>

      </article>
    </div>
  )
}
