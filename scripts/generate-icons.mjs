// Generates PWA icons from scripts/icon.svg using sharp (no extra deps).
// Usage: node scripts/generate-icons.mjs
import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const svgPath = path.join(root, 'scripts', 'icon.svg');
const outDir = path.join(root, 'public', 'icons');

const targets = [
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-192.png', size: 192 },
  { file: 'apple-touch-icon.png', size: 180 },
];

const svgBuffer = await readFile(svgPath);

for (const { file, size } of targets) {
  const png = await sharp(svgBuffer, { density: 300 })
    .resize(size, size, { fit: 'cover' })
    .png()
    .toBuffer();
  const out = path.join(outDir, file);
  await writeFile(out, png);
  const { size: bytes } = await stat(out);
  console.log(`${out} — ${bytes} bytes`);
}
console.log('done: 3 icons rendered');
