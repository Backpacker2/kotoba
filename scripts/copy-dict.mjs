// Kopieert het kuromoji-woordenboek (ingepakte .dat.gz-bestanden, ~17MB) naar
// public/dict. Draait automatisch vóór "dev" en "build" (zie package.json).
// Het woordenboek staat niet in Git (te groot); het komt uit node_modules.
//
// We houden de bestanden INGEPAKT (klein voor downloaden). De app pakt ze zelf
// slim uit — alleen als de server dat niet al deed. Zie src/lib/furigana.js.
import { cp, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const from = join(root, 'node_modules/@sglkc/kuromoji/dict');
const to = join(root, 'public/dict');

try {
  await access(join(to, 'base.dat.gz'));
  // Al gekopieerd: niets te doen.
} catch {
  await cp(from, to, { recursive: true });
  console.log('kuromoji-woordenboek gekopieerd naar public/dict');
}
