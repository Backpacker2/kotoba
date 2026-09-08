// Genereert de app-iconen (PNG) voor de installeerbare app (PWA), uit een
// simpele SVG in de stijl van Kotoba: washi-achtergrond met het rode accent.
// Draai met: npm run icons
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#f6f3ec"/>
  <circle cx="256" cy="256" r="150" fill="#c1352b"/>
  <circle cx="256" cy="256" r="150" fill="none" stroke="#9c2a22" stroke-width="6"/>
</svg>`;

const buf = Buffer.from(svg);
const targets = [
  ['pwa-192.png', 192],
  ['pwa-512.png', 512],
  ['pwa-maskable-512.png', 512],
  ['apple-touch-icon.png', 180],
];

for (const [name, size] of targets) {
  await sharp(buf).resize(size, size).png().toFile(join(pub, name));
  console.log(`icoon gemaakt: ${name} (${size}px)`);
}
