import { createFalClient } from '@fal-ai/client';
import * as fs from 'fs';
import * as path from 'path';
import https from 'https';
import http from 'http';

const fal = createFalClient({ credentials: process.env.FAL_KEY! });
const CANDIDATES_DIR = path.join(__dirname, '..', 'assets', 'portraits', 'candidates');
const MODEL_ID = 'fal-ai/flux-pro/v1.1';

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
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
  });
}

const regens: { slug: string; prompt: string }[] = [
  {
    slug: 'anya',
    prompt: `Portrait of Anya, a Polish woman in her early thirties with sharp Slavic features, light skin, high cheekbones, and ash-blonde hair in a messy bob. Intense blue-grey eyes with a fierce determined expression. Edgy modern style, leather jacket. Bold and defiant expression, unconventional look. Stylized digital illustration, painterly style, soft cinematic lighting, upper body portrait, looking at the viewer, rich color palette centered on #831843 deep rose, warm atmospheric background, high detail face and expression, character concept art quality, artstation trending style. No text, no watermark, no frame, no border.`
  },
  {
    slug: 'celine',
    prompt: `Portrait of Céline, a French woman in her early thirties with warm olive skin, dark wavy brown hair past her shoulders, hazel-green eyes, and a soft thoughtful expression. Classic Parisian elegance with an artistic bohemian touch, delicate features, natural beauty. Dreamy and inspired expression, creative energy, soft artistic lighting. Stylized digital illustration, painterly style, soft cinematic lighting, upper body portrait, looking at or near the viewer, rich color palette centered on #C7A0D4 soft lavender, warm atmospheric background, high detail face and expression, character concept art quality, artstation trending style. No text, no watermark, no frame, no border.`
  },
  {
    slug: 'camille',
    prompt: `Portrait of Camille, an Algerian-French woman in her early thirties with warm brown skin, dark curly hair, deep brown eyes, and strong expressive features reflecting her North African heritage. Bold confident expression with a hint of defiance, modern Parisian streetwear style. Bold and defiant expression, edgy style, unconventional look. Stylized digital illustration, painterly style, soft cinematic lighting, upper body portrait, looking at the viewer, rich color palette centered on #BE123C crimson, warm atmospheric background, high detail face and expression, character concept art quality, artstation trending style. No text, no watermark, no frame, no border.`
  }
];

async function main() {
  for (const { slug, prompt } of regens) {
    const dir = path.join(CANDIDATES_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\nGenerating ${slug}...`);
    console.log(`  Prompt: ${prompt.substring(0, 80)}...`);
    
    for (let i = 1; i <= 3; i++) {
      console.log(`  Candidate ${i}/3...`);
      try {
        const result = await fal.subscribe(MODEL_ID, {
          input: { prompt, image_size: 'square_hd', num_images: 1, safety_tolerance: 5 }
        }) as any;
        const imageUrl = result?.data?.images?.[0]?.url ?? result?.images?.[0]?.url;
        if (!imageUrl) { console.log('    ✗ No image URL'); continue; }
        const ext = 'jpg';
        const filepath = path.join(dir, `${slug}_${i}.${ext}`);
        await downloadImage(imageUrl, filepath);
        console.log(`    ✓ Saved: ${slug}_${i}.${ext}`);
      } catch (err: any) {
        console.log(`    ✗ Error: ${err.message || err}`);
      }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  console.log('\n✓ Done!');
}

main();
