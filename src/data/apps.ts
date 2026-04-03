export interface AppInfo {
  name: string
  slug: string
  tagline: string
  description?: string
  price: string
  icon: string
  iconBg: string
  iconImage?: string
  status?: 'coming-soon' | 'in-development' | 'available'
  appStoreUrl?: string
  screenshots?: { src: string; alt: string }[]
  lastModified?: string
}

export const apps: AppInfo[] = [
  {
    name: 'Bloom Affirmations',
    slug: 'bloom',
    tagline:
      'Daily affirmations, AI coaching, mood check-ins, and journaling — your pocket companion for intentional living.',
    description:
      'Bloom Affirmations is your daily practice companion. Each morning, you receive three new cards — an affirmation, a mini-meditation, and a creative prompt — designed to meet you where you are. Reflect on what resonates, journal your thoughts with built-in mood check-ins, and talk through whatever is on your mind with an AI coach grounded in real coaching principles. No toxic positivity. No performative wellness. Just a quiet, honest space to come back to yourself.',
    price: 'Free + Pro $4.99/mo',
    icon: '\u{1F338}',
    iconBg: '#F5E0E0',
    iconImage: '/icons/bloom.jpg',
    status: 'available',
    appStoreUrl: 'https://apps.apple.com/us/app/bloom-affirmation/id6759355085',
    lastModified: '2025-11-01',
    screenshots: [
      { src: '/screenshots/bloom-home.png', alt: 'Bloom home screen with daily affirmation card' },
      { src: '/screenshots/bloom-journal-entry.png', alt: 'Journal entry with mood check-in' },
      { src: '/screenshots/bloom-coach.png', alt: 'AI coaching conversation' },
      { src: '/screenshots/bloom-journal.png', alt: 'Journal entries list' },
    ],
  },
  {
    name: 'SpellCraft Studio',
    slug: 'spellcraft',
    tagline:
      'A modern witchcraft companion — explore herbs, stones, and spells with a beautifully curated encyclopedia.',
    description:
      'SpellCraft Studio is a beautifully designed companion for modern witchcraft practitioners. Browse a curated encyclopedia of herbs, crystals, oils, and magical correspondences. Craft your own spells with guided intention-setting, track moon phases, and build your personal grimoire. Whether you are a seasoned practitioner or just beginning to explore, SpellCraft meets you with warmth, beauty, and zero gatekeeping.',
    price: 'Free + Pro $5.99/mo',
    icon: '\u2728',
    iconBg: '#E6DFEF',
    iconImage: '/icons/spellcraft.png',
    status: 'available',
    appStoreUrl: 'https://apps.apple.com/us/app/spell-craft-studio/id6760242229',
    lastModified: '2025-12-01',
    screenshots: [
      { src: '/screenshots/spellcraft-home.png', alt: 'SpellCraft home screen showing moon phase and daily wisdom' },
      { src: '/screenshots/spellcraft-craft.png', alt: 'Craft a spell interface with intention categories' },
      { src: '/screenshots/spellcraft-encyclopedia.png', alt: 'Encyclopedia of herbs, crystals, and oils' },
    ],
  },
  {
    name: 'Amaia',
    slug: 'amaia',
    tagline:
      'An AI companion who actually remembers you. Gentle coaching, daily check-ins, and real conversations.',
    description:
      'Amaia is an AI companion app built around the idea that meaningful conversation requires memory. Choose from unique AI characters — each with their own personality and conversation style — and build a real relationship over time. They remember what you have told them, follow up on things that matter to you, and meet you where you are. Free daily gems keep the conversation going, with packs available when you want more.',
    price: 'Free + In-App Purchases',
    icon: '\u{1F319}',
    iconBg: '#DDE8F0',
    iconImage: '/icons/amaia.png',
    screenshots: [],
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
    description:
      'Root & Rune turns the study of astrology, tarot, hedge witchery, and dream work into a beautiful, gamified learning experience. Progress through structured lessons at your own pace, practice with interactive exercises, and track your growth across disciplines. Designed for curious minds who want depth without dogma — whether you are a complete beginner or deepening an existing practice.',
    price: 'Pro $7.99/mo \u00b7 Annual $49.99',
    icon: '\u{1F33F}',
    iconBg: '#DDE8DD',
    iconImage: '/icons/rootandrune.png',
    lastModified: '2026-02-01',
    screenshots: [
      { src: '/screenshots/rootandrune-learn.png', alt: 'Root & Rune learn screen with moon phase, archives, and lesson progress' },
      { src: '/screenshots/rootandrune-paths.png', alt: 'Dream Worker path with structured lessons' },
      { src: '/screenshots/rootandrune-codex.png', alt: 'Codex with Flora, Fauna, Dreams, Arcana, Stones, and Stars categories' },
      { src: '/screenshots/rootandrune-lesson.png', alt: 'Energy Work lesson with illustration and content' },
    ],
  },
  {
    name: 'WildMind',
    slug: 'wildmind',
    tagline:
      'A nature oracle and field journal — pull a daily card, log what you notice outside, and let the animals teach you things.',
    description:
      'WildMind is a nature-focused oracle and journaling app. Each day, pull a card from an animal oracle deck spanning four realms — Ocean, Forest, Sky, and Desert — and discover what the natural world is trying to tell you. Log your observations, reflect on prompted questions, and build a personal field journal over time. Go outside. Notice something. Let it mean something.',
    price: 'Free + Premium',
    icon: '\u{1F43E}',
    iconBg: '#DDE8DD',
    iconImage: '/icons/wildmind.png',
    status: 'in-development',
  },
  {
    name: 'All Days',
    slug: 'all-days',
    tagline: 'Every tradition. Every day.',
    description:
      'All Days is a holiday calendar for everyone — spanning 33 world religions and cultures, from Western Christianity and Islam to Hmong, Somali, Korean, and Brazilian traditions. Whether you want to understand what a colleague observes, stay connected to your own roots, or simply be more aware of the world around you, All Days keeps you informed year-round. Browse 221 holidays across 33 traditions in Agenda, Daily, Weekly, and Monthly views. Filter by the traditions that matter to you, read holiday details with cultural context, and add observances directly to your Apple Calendar, Google Calendar, or Outlook with All Days+.',
    price: 'Free + All Days+ $3.99/mo · $29.99/yr',
    icon: '🌈',
    iconBg: '#1a1a2e',
    iconImage: '/icons/alldays.png',
    status: 'in-development',
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
