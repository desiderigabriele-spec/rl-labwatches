/**
 * Genera il logo:
 *  1. converte i testi in tracciati (Montserrat SemiBold), così il logo è identico ovunque
 *     anche senza il font installato → src/brand/logo-text.ts
 *  2. scrive tutte le varianti SVG in public/brand/ e la favicon in src/app/icon.svg
 * Uso: node scripts/build-logo.mts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import opentype from "opentype.js";

const root = new URL("../", import.meta.url);
const buf = readFileSync(new URL("node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff", root));
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const CAP = font.tables.os2.sCapHeight / font.unitsPerEm;

/** Testo in tracciato, adattato esattamente al riquadro misurato sull'originale (bordi dell'inchiostro) */
function fitText(text: string, left: number, right: number, capTop: number, baseline: number): string {
  const size = (baseline - capTop) / CAP;
  const glyphs = font.stringToGlyphs(text);
  const scale = size / font.unitsPerEm;
  const layout = (spacing: number) => {
    let x = 0;
    const pos: number[] = [];
    glyphs.forEach((g, i) => {
      pos.push(x);
      x += (g.advanceWidth ?? 0) * scale + spacing;
      if (i < glyphs.length - 1) x += font.getKerningValue(g, glyphs[i + 1]) * scale;
    });
    const first = glyphs[0].getBoundingBox(), last = glyphs[glyphs.length - 1].getBoundingBox();
    const inkL = first.x1 * scale, inkR = pos[pos.length - 1] + last.x2 * scale;
    return { pos, inkL, inkR };
  };
  // spaziatura che porta la larghezza dell'inchiostro a quella dell'originale
  const a = layout(0), b = layout(10);
  const spacing = ((right - left - (a.inkR - a.inkL)) / (b.inkR - b.inkL - (a.inkR - a.inkL))) * 10;
  const { pos, inkL } = layout(spacing);
  const offset = left - inkL;
  return glyphs
    .map((g, i) => g.getPath(offset + pos[i], baseline, size).toPathData(2))
    .filter(Boolean)
    .join("");
}

const roberto = fitText("ROBERTO LANDI", 117, 1139, 676, 762);
const lab = fitText("LAB WATCHES", 321, 936, 805, 842);
writeFileSync(
  new URL("src/brand/logo-text.ts", root),
  `// File generato da scripts/build-logo.mts — non modificare a mano.\n// Montserrat SemiBold convertito in tracciati, misure dall'originale.\nexport const ROBERTO_LANDI =\n  "${roberto}";\nexport const LAB_WATCHES =\n  "${lab}";\n`
);

const { logoSvg, VARIANTS } = await import("../src/brand/logo.ts");
mkdirSync(new URL("public/brand/", root), { recursive: true });
for (const v of Object.keys(VARIANTS) as (keyof typeof VARIANTS)[]) {
  writeFileSync(new URL(`public/brand/logo_${v}.svg`, root), logoSvg(v));
  writeFileSync(new URL(`public/brand/icona_${v}.svg`, root), logoSvg(v, { wordmark: false }));
}
// favicon quadrata: simbolo su fondo verde
writeFileSync(new URL("src/app/icon.svg", root), logoSvg("scuro", { wordmark: false, viewBox: "245 85 760 760" }));
console.log("Logo generato.");
