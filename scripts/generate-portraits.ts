/**
 * Persona Portrait Generator
 *
 * Generates 3 portrait candidates per persona using fal.ai FLUX.2 Pro.
 * Saves candidates to assets/portraits/candidates/{slug}/ for manual curation.
 *
 * Prerequisites:
 *   npm install @fal-ai/client
 *   export FAL_KEY="your-fal-ai-api-key"
 *
 * Usage:
 *   npx tsx scripts/generate-portraits.ts                  # Generate all
 *   npx tsx scripts/generate-portraits.ts --slug kai       # Generate one persona
 *   npx tsx scripts/generate-portraits.ts --tier 1         # Generate one tier
 *   npx tsx scripts/generate-portraits.ts --pick           # Copy picked files to final/
 */

import { createFalClient } from '@fal-ai/client';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import http from 'http';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const CANDIDATES_PER_PERSONA = 3;
const IMAGE_SIZE = 'square_hd'; // 1024x1024
const MODEL_ID = 'fal-ai/flux-pro/v1.1';
const CANDIDATES_DIR = path.join(__dirname, '..', 'assets', 'portraits', 'candidates');
const FINAL_DIR = path.join(__dirname, '..', 'assets', 'portraits', 'final');
const PERSONAS_PATH = path.join(__dirname, 'personas.json');

// Delay between API calls to avoid rate limiting (ms)
const DELAY_MS = 1500;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Persona {
  slug: string;
  name: string;
  avatar_emoji: string;
  color: string;
  gender: string;
  orientation: string;
  archetype: string;
  tagline: string;
  backstory: string;
  tier: number;
}

// ---------------------------------------------------------------------------
// Prompt building
// ---------------------------------------------------------------------------

const ARCHETYPE_VISUAL_CUES: Record<string, string> = {
  protector: 'strong and grounded presence, calm confident expression, protective posture',
  muse: 'dreamy and inspired expression, creative energy, soft artistic lighting',
  trickster: 'mischievous knowing smile, playful glint in eyes, dynamic angle',
  sage: 'wise and thoughtful expression, contemplative gaze, serene composure',
  rebel: 'bold and defiant expression, edgy style, unconventional look',
  nurturer: 'warm gentle smile, soft open expression, approachable and kind',
  explorer: 'adventurous and curious expression, windswept look, bright eyes',
  lover: 'intimate and tender expression, soft warm gaze, romantic lighting',
  healer: 'serene and compassionate expression, gentle eyes, calming presence',
  provocateur: 'intense and magnetic expression, sharp gaze, confident smirk',
};

function extractAppearanceHints(backstory: string): string {
  // Pull age/ethnicity/cultural hints from backstory for prompt accuracy
  const hints: string[] = [];

  // Age clues
  if (backstory.includes('mid-thirties') || backstory.includes('my mid-thirties')) hints.push('mid-thirties');
  else if (backstory.includes('early thirties') || backstory.includes('my early thirties')) hints.push('early thirties');
  else if (backstory.includes('late twenties')) hints.push('late twenties');
  else if (backstory.includes('early twenties')) hints.push('early twenties');
  else if (backstory.includes('forties')) hints.push('forties');
  else hints.push('late twenties to early thirties');

  // Cultural/origin clues for accurate representation
  const origins: [RegExp, string][] = [
    [/O'ahu|Hawaiian|Hale'iwa/, 'Hawaiian/Pacific Islander heritage'],
    [/South Side of Chicago/, 'Black American'],
    [/Sapporo|Japan|Hokkaido/, 'Japanese'],
    [/Medellín|Colombia|Bogotá/, 'Colombian'],
    [/Lagos|Nigeria|Yoruba/, 'Nigerian'],
    [/Seoul|Korea/, 'Korean'],
    [/Mumbai|India|Hindi/, 'Indian'],
    [/Paris|French|France/, 'French'],
    [/Berlin|German|Germany/, 'German'],
    [/London|British|England/, 'British'],
    [/Stockholm|Sweden|Swedish/, 'Swedish'],
    [/Copenhagen|Danish|Denmark/, 'Danish/Scandinavian'],
    [/Rio|Brazil|São Paulo/, 'Brazilian'],
    [/Tehran|Iran|Persian/, 'Iranian/Persian'],
    [/Cairo|Egypt|Egyptian/, 'Egyptian'],
    [/Beijing|China|Chinese/, 'Chinese'],
    [/Mexico|Mexican/, 'Mexican'],
    [/Jamaica|Jamaican/, 'Jamaican'],
    [/Ghana|Ghanaian|Accra/, 'Ghanaian'],
    [/Kenya|Nairobi/, 'Kenyan'],
    [/Ethiopia|Addis/, 'Ethiopian'],
    [/Morocco|Marrakech/, 'Moroccan'],
    [/Spain|Madrid|Spanish/, 'Spanish'],
    [/Italy|Rome|Italian|Milan/, 'Italian'],
    [/Greece|Greek|Athens/, 'Greek'],
    [/Turkey|Istanbul|Turkish/, 'Turkish'],
    [/Vietnam|Hanoi|Saigon/, 'Vietnamese'],
    [/Thailand|Bangkok|Thai/, 'Thai'],
    [/Philippines|Filipino|Manila/, 'Filipino'],
    [/Cuba|Havana|Cuban/, 'Cuban'],
    [/Puerto Rico|Boricua/, 'Puerto Rican'],
    [/Dominican|Santo Domingo/, 'Dominican'],
    [/Trinidad/, 'Trinidadian'],
    [/Igbo|Igbo/, 'Igbo Nigerian'],
    [/Somali|Somalia|Mogadishu/, 'Somali'],
    [/Arab|Arabic|Lebanese|Beirut/, 'Arab/Lebanese'],
    [/Vancouver|Canada|Canadian/, 'Canadian'],
    [/New York|Brooklyn|Manhattan/, 'from New York'],
    [/Los Angeles|LA/, 'from Los Angeles'],
    [/New Orleans|Louisiana/, 'from New Orleans'],
    [/Portland|Oregon/, 'from Portland'],
    [/Austin|Texas/, 'from Texas'],
  ];

  for (const [pattern, label] of origins) {
    if (pattern.test(backstory)) {
      hints.push(label);
      break;
    }
  }

  return hints.join(', ');
}

function buildPrompt(persona: Persona): string {
  const genderDesc = persona.gender === 'nonbinary' ? 'nonbinary person' : persona.gender === 'male' ? 'man' : 'woman';
  const visualCues = ARCHETYPE_VISUAL_CUES[persona.archetype] || '';
  const appearanceHints = extractAppearanceHints(persona.backstory);

  return [
    `Portrait of ${persona.name}, a ${appearanceHints} ${genderDesc}.`,
    `${visualCues}.`,
    `Stylized digital illustration, painterly style, soft cinematic lighting,`,
    `upper body portrait, looking at or near the viewer,`,
    `rich color palette centered on ${persona.color},`,
    `warm atmospheric background, high detail face and expression,`,
    `character concept art quality, artstation trending style.`,
    `No text, no watermark, no frame, no border.`,
  ].join(' ');
}

// ---------------------------------------------------------------------------
// Image download
// ---------------------------------------------------------------------------

function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);
    client.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImage(redirectUrl, filepath).then(resolve).catch(reject);
          return;
        }
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// ---------------------------------------------------------------------------
// Generation
// ---------------------------------------------------------------------------

async function generateForPersona(persona: Persona, fal: ReturnType<typeof createFalClient>): Promise<void> {
  const personaDir = path.join(CANDIDATES_DIR, persona.slug);
  fs.mkdirSync(personaDir, { recursive: true });

  // Check how many candidates already exist
  const existing = fs.readdirSync(personaDir).filter(f => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.webp'));
  if (existing.length >= CANDIDATES_PER_PERSONA) {
    console.log(`  ✓ ${persona.name} — already has ${existing.length} candidates, skipping`);
    return;
  }

  const prompt = buildPrompt(persona);
  const startFrom = existing.length;

  for (let i = startFrom; i < CANDIDATES_PER_PERSONA; i++) {
    console.log(`  Generating ${persona.name} candidate ${i + 1}/${CANDIDATES_PER_PERSONA}...`);

    try {
      const result = await fal.subscribe(MODEL_ID, {
        input: {
          prompt,
          image_size: IMAGE_SIZE,
          num_images: 1,
          safety_tolerance: 5,
        },
      }) as any;

      const imageUrl = result?.data?.images?.[0]?.url ?? result?.images?.[0]?.url;
      if (!imageUrl) {
        console.log(`    ⚠ No image URL returned for ${persona.name} candidate ${i + 1}`);
        continue;
      }

      const ext = imageUrl.includes('.png') ? 'png' : 'jpg';
      const filename = `${persona.slug}_${i + 1}.${ext}`;
      const filepath = path.join(personaDir, filename);

      await downloadImage(imageUrl, filepath);
      console.log(`    ✓ Saved: ${filename}`);

    } catch (err: any) {
      console.error(`    ✗ Error generating ${persona.name} candidate ${i + 1}: ${err.message}`);
    }

    // Rate limit delay
    if (i < CANDIDATES_PER_PERSONA - 1) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }
}

// ---------------------------------------------------------------------------
// Pick mode — copy chosen candidates to final/
// ---------------------------------------------------------------------------

function showPickInstructions(): void {
  console.log('\n📋 Pick Mode');
  console.log('============');
  console.log('Review the candidates in: assets/portraits/candidates/{slug}/');
  console.log('');
  console.log('For each persona, rename your preferred candidate to:');
  console.log('  {slug}_pick.{ext}  (e.g., kai_pick.jpg)');
  console.log('');
  console.log('Then re-run with --pick to copy all picks to assets/portraits/final/');
  console.log('');

  // Check current pick status
  if (!fs.existsSync(CANDIDATES_DIR)) {
    console.log('No candidates generated yet. Run without --pick first.');
    return;
  }

  const slugDirs = fs.readdirSync(CANDIDATES_DIR).filter(
    d => fs.statSync(path.join(CANDIDATES_DIR, d)).isDirectory()
  );

  let picked = 0;
  let unpicked = 0;

  for (const slug of slugDirs) {
    const dir = path.join(CANDIDATES_DIR, slug);
    const files = fs.readdirSync(dir);
    const pickFile = files.find(f => f.includes('_pick.'));
    if (pickFile) {
      picked++;
    } else {
      unpicked++;
    }
  }

  console.log(`Status: ${picked} picked, ${unpicked} still need picks (${slugDirs.length} total)`);

  if (unpicked > 0) {
    console.log('\nUnpicked personas:');
    for (const slug of slugDirs) {
      const dir = path.join(CANDIDATES_DIR, slug);
      const files = fs.readdirSync(dir);
      const pickFile = files.find(f => f.includes('_pick.'));
      if (!pickFile) {
        console.log(`  - ${slug}/`);
      }
    }
  }

  // Copy picks to final/
  if (picked > 0) {
    fs.mkdirSync(FINAL_DIR, { recursive: true });
    let copied = 0;
    for (const slug of slugDirs) {
      const dir = path.join(CANDIDATES_DIR, slug);
      const files = fs.readdirSync(dir);
      const pickFile = files.find(f => f.includes('_pick.'));
      if (pickFile) {
        const ext = path.extname(pickFile);
        const src = path.join(dir, pickFile);
        const dst = path.join(FINAL_DIR, `${slug}${ext}`);
        fs.copyFileSync(src, dst);
        copied++;
      }
    }
    console.log(`\n✓ Copied ${copied} portraits to assets/portraits/final/`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);

  // Parse args
  const pickMode = args.includes('--pick');
  const slugFilter = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;
  const tierFilter = args.includes('--tier') ? parseInt(args[args.indexOf('--tier') + 1]) : null;

  if (pickMode) {
    showPickInstructions();
    return;
  }

  // Validate FAL_KEY
  if (!process.env.FAL_KEY) {
    console.error('Error: FAL_KEY environment variable is required.');
    console.error('Get your key at https://fal.ai/dashboard/keys');
    process.exit(1);
  }

  const fal = createFalClient({ credentials: process.env.FAL_KEY });

  // Load personas
  const personas: Persona[] = JSON.parse(fs.readFileSync(PERSONAS_PATH, 'utf-8'));
  let filtered = personas;

  if (slugFilter) {
    filtered = personas.filter(p => p.slug === slugFilter);
    if (filtered.length === 0) {
      console.error(`No persona found with slug: ${slugFilter}`);
      process.exit(1);
    }
  } else if (tierFilter) {
    filtered = personas.filter(p => p.tier === tierFilter);
  }

  console.log(`\n🎨 Persona Portrait Generator`);
  console.log(`   Model: ${MODEL_ID}`);
  console.log(`   Personas: ${filtered.length}`);
  console.log(`   Candidates per persona: ${CANDIDATES_PER_PERSONA}`);
  console.log(`   Total images: ${filtered.length * CANDIDATES_PER_PERSONA}`);
  console.log(`   Est. cost: ~$${(filtered.length * CANDIDATES_PER_PERSONA * 0.03).toFixed(2)}`);
  console.log(`   Output: ${CANDIDATES_DIR}`);
  console.log('');

  fs.mkdirSync(CANDIDATES_DIR, { recursive: true });

  let completed = 0;
  for (const persona of filtered) {
    console.log(`[${++completed}/${filtered.length}] ${persona.name} (${persona.archetype}, tier ${persona.tier})`);
    await generateForPersona(persona, fal);

    // Delay between personas
    if (completed < filtered.length) {
      await new Promise(r => setTimeout(r, DELAY_MS));
    }
  }

  console.log(`\n✓ Done! Generated candidates for ${completed} personas.`);
  console.log(`\nNext steps:`);
  console.log(`  1. Browse candidates: open assets/portraits/candidates/`);
  console.log(`  2. For each persona, rename your favorite to {slug}_pick.{ext}`);
  console.log(`  3. Run: npx tsx scripts/generate-portraits.ts --pick`);
}

main().catch(console.error);
