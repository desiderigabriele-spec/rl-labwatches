// Prepara la foto di un orologio sul cofanetto per la vetrina della home.
//   node scripts/vetrina.mjs <foto.png> <slug-marca>      es. node scripts/vetrina.mjs rolex.png rolex
// La foto deve avere lo sfondo trasparente: il bordo vuoto viene tagliato e il cofanetto
// appoggiato in basso al centro di un riquadro 900×1200 (3:4), salvato in public/vetrina/<slug>.webp.
// Poi in src/data/brands.ts si scrive vetrina: "/vetrina/<slug>.webp" per quella marca.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const [src, slug] = process.argv.slice(2);
if (!src || !slug) {
  console.error("Uso: node scripts/vetrina.mjs <foto.png> <slug-marca>");
  process.exit(1);
}
const W = 900, H = 1200, PAD = 40;
const trimmed = await sharp(src).ensureAlpha().trim({ threshold: 10 }).toBuffer();
const fitted = await sharp(trimmed).resize(W - PAD * 2, H - PAD * 2, { fit: "inside" }).toBuffer({ resolveWithObject: true });
mkdirSync("public/vetrina", { recursive: true });
const out = `public/vetrina/${slug}.webp`;
await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: fitted.data, left: Math.round((W - fitted.info.width) / 2), top: H - PAD - fitted.info.height }])
  .webp({ quality: 86, alphaQuality: 90 })
  .toFile(out);
console.log(`${out}  (${fitted.info.width}×${fitted.info.height} nel riquadro ${W}×${H})`);
