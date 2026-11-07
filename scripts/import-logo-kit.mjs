/**
 * Importa il kit vettoriale del logo nel progetto.
 * Uso: node scripts/import-logo-kit.mjs <cartella Roberto_Landi_Vector_Kit>
 *
 * - copia i 24 SVG originali (non modificati) in public/brand/
 * - per le versioni animate separa il quadrante (lancette, inline nella pagina, ~1 KB)
 *   dalle scritte (immagine SVG in cache): stesse coordinate, composizione invariata
 * - crea la favicon e copia PDF, anteprime e note del kit in docs/brand/
 */
import { cpSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const kit = process.argv[2];
if (!kit) throw new Error("Indica la cartella del kit");
const root = new URL("../", import.meta.url).pathname;
const pub = join(root, "public/brand");

rmSync(pub, { recursive: true, force: true });
mkdirSync(join(pub, "parti"), { recursive: true });
for (const f of readdirSync(join(kit, "SVG"))) cpSync(join(kit, "SVG", f), join(pub, f));

/** rimuove un gruppo <g id="..."> con i suoi sottogruppi */
function removeGroup(svg, id) {
  const start = svg.indexOf(`<g id="${id}"`);
  if (start < 0) return svg;
  let depth = 0, i = start;
  while (i < svg.length) {
    if (svg.startsWith("<g", i) && /[\s>]/.test(svg[i + 2])) depth++;
    else if (svg.startsWith("</g>", i) && --depth === 0) return svg.slice(0, start) + svg.slice(i + 4);
    i++;
  }
  throw new Error(`Gruppo ${id} non chiuso`);
}
const removeBackground = (svg) => svg.replace(/<rect x="[^"]*" y="[^"]*" width="[^"]*" height="[^"]*" fill="[^"]*"\/>/, "");

const parts = {};
for (const name of ["RL-orizzontale-metallo", "RL-completo-metallo", "RL-completo-negativo"]) {
  const src = readFileSync(join(kit, "SVG", `${name}.svg`), "utf8");
  // scritte (+ eventuale fondo): file statico
  let words = ["clock-face", "hands", "hand-pivot"].reduce(removeGroup, src);
  writeFileSync(join(pub, "parti", `${name}-scritte.svg`), words);
  // quadrante con lancette: markup inline
  let dial = removeBackground(["wordmark", "tagline"].reduce(removeGroup, src));
  const viewBox = dial.match(/viewBox="([^"]*)"/)[1];
  const inner = dial.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "").replace(/<title>[\s\S]*?<\/title>/, "");
  parts[name] = { viewBox, dial: inner, words: `/brand/parti/${name}-scritte.svg` };
}
mkdirSync(join(root, "src/brand"), { recursive: true });
writeFileSync(
  join(root, "src/brand/logo-parts.ts"),
  `// File generato da scripts/import-logo-kit.mjs — non modificare a mano.\n// Quadrante (lancette animabili) separato dalle scritte; geometria originale del kit.\nexport const LOGO_PARTS = ${JSON.stringify(parts, null, 2)} as const;\n\nexport type LogoVersion = keyof typeof LOGO_PARTS;\n`
);

// favicon: simbolo negativo su fondo quadrato
const icon = readFileSync(join(kit, "SVG", "RL-simbolo-negativo.svg"), "utf8")
  .replace(/viewBox="[^"]*"/, 'viewBox="250 92 750 750"')
  .replace(/<rect x="[^"]*" y="[^"]*" width="[^"]*" height="[^"]*" fill="([^"]*)"\/>/, '<rect x="250" y="92" width="750" height="750" fill="$1"/>');
writeFileSync(join(root, "src/app/icon.svg"), icon);

// documentazione e file per la stampa
const docs = join(root, "docs/brand");
rmSync(docs, { recursive: true, force: true });
mkdirSync(docs, { recursive: true });
for (const d of ["PDF", "PREVIEW", "WEB"]) cpSync(join(kit, d), join(docs, d.toLowerCase()), { recursive: true });
cpSync(join(kit, "LEGGIMI.md"), join(docs, "LEGGIMI.md"));
cpSync(join(kit, "CLAUDE_CODE.md"), join(docs, "CLAUDE_CODE.md"));
console.log("Kit importato:", Object.keys(parts).join(", "));
