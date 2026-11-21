// Prepara le immagini della fila della vetrina (home e /shop), già composte, così scorrendo il telefono sposta
// soltanto foto ferme: niente filtri, maschere o fusioni di luce da ricalcolare a ogni fotogramma.
//   node --no-warnings scripts/vetrina-fila.mjs
// Da rilanciare quando cambia una foto della vetrina (scripts/vetrina.mjs) o si aggiunge una marca.
//
// Per ogni marca di src/data/brands.ts con la foto del cofanetto:
//  - public/vetrina/fila/<slug>.webp (840×1200): il cofanetto (840×1020, come la foto originale) con dentro la foto
//    ravvicinata sfumata, allineata quadrante su quadrante come in BoxPhoto, la lancetta ferma del cronografo e
//    sotto l'ombra portata (prima era un drop-shadow CSS, ricalcolato dal telefono).
//  - public/vetrina/fila/<slug>-ore.webp e -minuti.webp (128×128): lancette piccole con la loro ombra.
//  - public/marche/chiaro/<slug>.png: logo color crema (prima era una maschera CSS su ogni cofanetto).
// Una volta sola:
//  - public/vetrina/fila/fascio.webp: il fascio del faretto, già sfumato, per lo strato di luce fermo al centro.
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { brands } from "../src/data/brands.ts";

const W = 840;
const H = 1020;
const FULL = 1200; // 180 px sotto il cofanetto per l'ombra
const OUT = "public/vetrina/fila";
mkdirSync(OUT, { recursive: true });
mkdirSync("public/marche/chiaro", { recursive: true });

// scala tipica a schermo (px CSS per px della foto): telefono ≈ 0,28, computer ≈ 0,36
const VIEW = 0.32;
const css = (px) => px / VIEW;

/** ombra di un'immagine RGBA grezza: nera, alfa * forza, spostata in basso e sfocata, su una tela più alta */
async function shadowOf(rgba, w, h, outH, { dy, sigma, strength }) {
  const buf = Buffer.alloc(w * outH * 4);
  for (let y = 0; y < h; y++) {
    const ty = y + Math.round(dy);
    if (ty < 0 || ty >= outH) continue;
    for (let x = 0; x < w; x++) buf[(ty * w + x) * 4 + 3] = Math.round(rgba[(y * w + x) * 4 + 3] * strength);
  }
  return sharp(buf, { raw: { width: w, height: outH, channels: 4 } }).blur(Math.max(0.3, sigma)).raw().toBuffer();
}

/** foto ravvicinata ridimensionata e sfumata ai bordi: stessa ellisse di FEATHER in BoxPhoto */
async function feathered(src, cw, ch) {
  const rgb = await sharp(`public${src}`).resize(cw, ch, { kernel: "lanczos3", fit: "fill" }).removeAlpha().raw().toBuffer();
  const out = Buffer.alloc(cw * ch * 4);
  for (let y = 0; y < ch; y++)
    for (let x = 0; x < cw; x++) {
      // radial-gradient(ellipse 50% 50% at 50% 42%, #000 70%, transparent 100%)
      const d = Math.hypot((x + 0.5 - cw / 2) / (cw / 2), (y + 0.5 - ch * 0.42) / (ch / 2));
      const a = d <= 0.7 ? 1 : d >= 1 ? 0 : (1 - d) / 0.3;
      const i = y * cw + x;
      out[i * 4] = rgb[i * 3];
      out[i * 4 + 1] = rgb[i * 3 + 1];
      out[i * 4 + 2] = rgb[i * 3 + 2];
      out[i * 4 + 3] = Math.round(a * 255);
    }
  return out;
}

/** lancetta (immagine quadrata col perno al centro) ridotta a `size` px, con l'ombra come il drop-shadow di LiveHands */
async function hand(src, size, dialCss) {
  const k = size / dialCss; // px dell'immagine per px CSS
  const rgba = await sharp(`public${src}`).ensureAlpha().resize(size, size, { kernel: "lanczos3" }).raw().toBuffer();
  const sh = await shadowOf(rgba, size, size, size, { dy: 1.5 * k, sigma: 0.75 * k, strength: 0.6 });
  return sharp(sh, { raw: { width: size, height: size, channels: 4 } })
    .composite([{ input: rgba, raw: { width: size, height: size, channels: 4 } }])
    .webp({ quality: 92, alphaQuality: 95 });
}

for (const b of brands) {
  if (!b.vetrina) continue;
  const layers = [];
  const dial = b.dial;
  // foto ravvicinata dentro il cofanetto (vedi BoxPhoto)
  if (b.vicino && dial) {
    const c = b.vicino;
    const w = dial.r / c.r; // frazione della larghezza del riquadro
    const h = w * (1536 / 1024) * (W / H); // frazione dell'altezza
    const cw = Math.round(w * W);
    const ch = Math.round(h * H);
    const left = Math.round(((dial.x - c.x * w) / 100) * W);
    const top = Math.round(((dial.y - c.y * h) / 100) * H);
    layers.push({ input: await feathered(c.src, cw, ch), raw: { width: cw, height: ch, channels: 4 }, left, top });
  }
  // lancetta ferma (cronografo dell'Omega): non gira mai, va nella foto
  if (dial?.sprites && "fermo" in dial.sprites && dial.sprites.fermo) {
    const side = Math.round(((2 * dial.r) / 100) * W);
    const img = await (await hand(dial.sprites.fermo, side, side * VIEW)).toBuffer();
    layers.push({ input: img, left: Math.round((dial.x / 100) * W - side / 2), top: Math.round((dial.y / 100) * H - side / 2) });
  }
  const box = await sharp(`public${b.vetrina}`).ensureAlpha().composite(layers).raw().toBuffer();
  // ombra portata: drop-shadow(0 18px 24px rgba(0,0,0,.55)) alla scala tipica
  const sh = await shadowOf(box, W, H, FULL, { dy: css(18), sigma: css(12), strength: 0.55 });
  await sharp(sh, { raw: { width: W, height: FULL, channels: 4 } })
    .composite([{ input: box, raw: { width: W, height: H, channels: 4 }, left: 0, top: 0 }])
    .webp({ quality: 86, alphaQuality: 90, effort: 6 })
    .toFile(`${OUT}/${b.slug}.webp`);

  // lancette piccole per la fila: il quadrante è largo 2r% del cofanetto, ~26 px CSS sul telefono
  if (dial?.sprites) {
    const dialCss = ((2 * dial.r) / 100) * W * 0.28;
    await (await hand(dial.sprites.ore, 128, dialCss)).toFile(`${OUT}/${b.slug}-ore.webp`);
    await (await hand(dial.sprites.minuti, 128, dialCss)).toFile(`${OUT}/${b.slug}-minuti.webp`);
  }

  // logo crema
  const { data, info } = await sharp(`public${b.logo}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 245;
    data[i + 1] = 241;
    data[i + 2] = 232;
  }
  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(`public/marche/chiaro/${b.slug}.png`);
  console.log(b.slug, "ok");
}

// Fascio del faretto (come il vecchio Spotlight: alone largo ±30° e nucleo ±18°, dissolto verso il basso).
// Vertice in alto al centro; l'altezza dell'immagine è la distanza tra lente e ripiano.
{
  const BH = 600;
  const BW = 880;
  const warm = [255, 241, 213];
  const profile = (phi, peak, half, edge) => (phi >= edge ? 0 : phi <= half ? peak - (peak / 2) * (phi / half) : (peak / 2) * ((edge - phi) / (edge - half)));
  const wide = Buffer.alloc(BW * BH);
  const core = Buffer.alloc(BW * BH);
  for (let y = 0; y < BH; y++)
    for (let x = 0; x < BW; x++) {
      const phi = (Math.abs(Math.atan2(x + 0.5 - BW / 2, y + 0.5)) * 180) / Math.PI;
      wide[y * BW + x] = Math.round(profile(phi, 0.5, 21, 30) * 255);
      core[y * BW + x] = Math.round(profile(phi, 0.32, 12, 18) * 255);
    }
  // un canale solo in uscita (sharp altrimenti lo converte in RGB)
  const blur = (buf, s) => sharp(buf, { raw: { width: BW, height: BH, channels: 1 } }).blur(s).extractChannel(0).raw().toBuffer();
  const [bw, bc] = await Promise.all([blur(wide, 9), blur(core, 4.5)]);
  const out = Buffer.alloc(BW * BH * 4);
  for (let y = 0; y < BH; y++) {
    const t = y / BH;
    const fade = t <= 0.6 ? 1 : t <= 0.85 ? 1 - 0.4 * ((t - 0.6) / 0.25) : 0.6 * (1 - (t - 0.85) / 0.15);
    for (let x = 0; x < BW; x++) {
      const i = y * BW + x;
      // due strati sommati come "screen", poi la dissolvenza in basso
      const a = (1 - (1 - bw[i] / 255) * (1 - bc[i] / 255)) * fade;
      out[i * 4] = warm[0];
      out[i * 4 + 1] = warm[1];
      out[i * 4 + 2] = warm[2];
      out[i * 4 + 3] = Math.round(a * 255);
    }
  }
  await sharp(out, { raw: { width: BW, height: BH, channels: 4 } }).webp({ quality: 80, alphaQuality: 85, effort: 6 }).toFile(`${OUT}/fascio.webp`);
  console.log("fascio ok");
}
