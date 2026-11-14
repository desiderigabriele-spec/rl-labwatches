// Prepara la foto di un orologio nel suo cofanetto per la vetrina della home.
//   node scripts/vetrina.mjs <foto.png> <slug-marca> <px-per-mm> [x,y,r]
//   es. node scripts/vetrina.mjs rolex.png rolex 5.32 512,857,84
//
// Tutte le foto vanno alla STESSA SCALA (3 px per millimetro reale), così in vetrina gli orologi
// risultano grandi uguali e i cofanetti hanno le loro proporzioni vere.
// <px-per-mm> si misura sulla foto con l'orologio come righello: pixel della cassa ÷ millimetri reali
// (es. lunetta del Submariner 218 px ÷ 41 mm = 5,32).
// La foto deve avere lo sfondo trasparente: il bordo vuoto viene tagliato e il cofanetto
// appoggiato in basso al centro di un riquadro 840×1020 (280 × 340 mm), salvato in public/vetrina/<slug>.webp.
// Poi in src/data/brands.ts si scrive vetrina: "/vetrina/<slug>.webp" per quella marca.
import sharp from "sharp";
import { mkdirSync } from "node:fs";

// [x,y,r] = centro del quadrante e raggio (bordo interno della lunetta) in pixel sulla foto originale:
// lo script stampa dove cadono nella foto finale, da copiare in brands.ts (dial) per le lancette animate.
const [src, slug, pxmm, dialArg] = process.argv.slice(2);
if (!src || !slug || !Number(pxmm)) {
  console.error("Uso: node scripts/vetrina.mjs <foto.png> <slug-marca> <px-per-mm>");
  process.exit(1);
}
const SCALE = 3; // px per mm nella vetrina
const W = 840, H = 1020;
const k = SCALE / Number(pxmm);

const trimmed = await sharp(src).ensureAlpha().trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
const w = Math.round(trimmed.info.width * k), h = Math.round(trimmed.info.height * k);
if (w > W || h > H) console.warn(`attenzione: il cofanetto (${w}×${h}) esce dal riquadro ${W}×${H}`);
const fitted = await sharp(trimmed.data).resize(Math.min(w, W), Math.min(h, H), { fit: "inside" }).toBuffer({ resolveWithObject: true });

mkdirSync("public/vetrina", { recursive: true });
const out = `public/vetrina/${slug}.webp`;
await sharp({ create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
  .composite([{ input: fitted.data, left: Math.round((W - fitted.info.width) / 2), top: H - fitted.info.height }])
  .webp({ quality: 88, alphaQuality: 90 })
  .toFile(out);
if (dialArg) {
  const [dx, dy, dr] = dialArg.split(",").map(Number);
  const f = fitted.info.width / trimmed.info.width;
  const left = Math.round((W - fitted.info.width) / 2), top = H - fitted.info.height;
  const ox = left + (dx + (trimmed.info.trimOffsetLeft ?? 0)) * f, oy = top + (dy + (trimmed.info.trimOffsetTop ?? 0)) * f;
  const pct = (v, t) => +((v / t) * 100).toFixed(2);
  console.log(`dial: { x: ${pct(ox, W)}, y: ${pct(oy, H)}, r: ${pct(dr * f, W)} }`);
}
console.log(`${out}: cofanetto ${(fitted.info.width / SCALE / 10).toFixed(1)} × ${(fitted.info.height / SCALE / 10).toFixed(1)} cm`);
