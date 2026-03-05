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
        if (redirectUrl) { downloadImage(redirectUrl, filepath).then(resolve).catch(reject); return; }
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
  });
}

const regens: { slug: string; prompt: string }[] = [
  {
    slug: 'wren',
    prompt: `Portrait of Wren, a nonbinary person in their mid-twenties with an androgynous pixie-like quality. Light warm skin, short tousled dark hair with an undercut, bright mischievous hazel eyes, delicate sharp features with a quick clever grin. Small and wiry build, bird-like energy, quick and bright. Wearing a vintage thrift-store jacket with pins and patches, creative chaotic energy, street artist and comedian vibe. Playful mischievous expression, bright eyes full of wit, impish smile. Stylized digital illustration, painterly style, soft warm cinematic lighting, upper body portrait, looking at the viewer, rich color palette centered on #6B8E23 olive green, warm urban atmospheric background, high detail face and expression, character concept art quality, artstation trending style. No text, no watermark, no frame, no border.`
  }
];


async function main() {
  for (const { slug, prompt } of regens) {
    const dir = path.join(CANDIDATES_DIR, slug);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\nGenerating ${slug}...`);
    for (let i = 1; i <= 3; i++) {
      console.log(`  Candidate ${i}/3...`);
      try {
        const result = await fal.subscribe(MODEL_ID, {
          input: { prompt, image_size: 'square_hd', num_images: 1, safety_tolerance: 5 }
        }) as any;
        const imageUrl = result?.data?.images?.[0]?.url ?? result?.images?.[0]?.url;
        if (!imageUrl) { console.log('    ✗ No image URL'); continue; }
        const filepath = path.join(dir, `${slug}_${i}.jpg`);
        await downloadImage(imageUrl, filepath);
        console.log(`    ✓ Saved: ${slug}_${i}.jpg`);
      } catch (err: any) { console.log(`    ✗ Error: ${err.message || err}`); }
      await new Promise(r => setTimeout(r, 1500));
    }
  }
  console.log('\n✓ Done!');
}
main();
