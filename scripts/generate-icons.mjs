import sharp from 'sharp'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const OUT_DIR = fileURLToPath(new URL('../public/icons/', import.meta.url))
mkdirSync(OUT_DIR, { recursive: true })

// Full-bleed square (required for maskable icons): navy ground, a
// hexagram drawn in the app's sky-to-emerald accent gradient, sized to
// stay inside the ~80%-diameter maskable safe zone.
function starSvg(size) {
  const cx = size / 2
  const cy = size / 2
  const R = size * 0.293
  const stroke = size * 0.035

  const pt = (deg) => {
    const rad = (deg * Math.PI) / 180
    return [cx + R * Math.cos(rad), cy - R * Math.sin(rad)]
  }
  const up = [pt(90), pt(210), pt(330)].map((p) => p.join(',')).join(' ')
  const down = [pt(270), pt(30), pt(150)].map((p) => p.join(',')).join(' ')

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="55%" stop-color="#34d399" />
        <stop offset="100%" stop-color="#fbbf24" />
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="#0f172a" />
    <polygon points="${up}" fill="none" stroke="url(#g)" stroke-width="${stroke}" stroke-linejoin="round" />
    <polygon points="${down}" fill="none" stroke="url(#g)" stroke-width="${stroke}" stroke-linejoin="round" />
  </svg>`
}

const targets = [
  { file: 'icon-192.png', size: 192 },
  { file: 'icon-512.png', size: 512 },
  { file: 'icon-maskable-512.png', size: 512 },
  { file: 'apple-touch-icon.png', size: 180 },
]

for (const t of targets) {
  const svg = Buffer.from(starSvg(t.size))
  await sharp(svg).png().toFile(OUT_DIR + t.file)
  console.log('wrote', t.file)
}
