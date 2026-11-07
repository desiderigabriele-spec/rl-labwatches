/**
 * Prepara le foto di un orologio per il sito.
 *
 * Uso:
 *   node scripts/aggiungi-orologio.mjs <slug> [--foto <cartella>] [--360 <cartella>]
 *
 *   <slug>        nome dell'orologio nell'indirizzo, es. rolex-submariner-16610
 *   --foto        cartella con le foto normali (la prima in ordine alfabetico diventa la copertina)
 *   --360         cartella con i fotogrammi della rotazione (18–36 foto, in ordine di scatto).
 *                 Se sono PNG scontornati (sfondo trasparente) la trasparenza viene mantenuta:
 *                 così l'orologio può stare nella vetrina con i faretti.
 *   --accento     colore del bagliore in vetrina, es. "#1f8a5a" (facoltativo)
 *
 * Le foto vengono raddrizzate, ridimensionate, compresse e copiate in public/orologi/<slug>/.
 * Alla fine stampa il blocco da incollare in src/data/products.ts.
 */
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, extname } from "node:path";
import sharp from "sharp";

const [slug, ...rest] = process.argv.slice(2);
if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Indica uno slug con lettere minuscole, numeri e trattini, es. rolex-submariner-16610");
  process.exit(1);
}
const opt = (name) => {
  const i = rest.indexOf(name);
  return i >= 0 ? rest[i + 1] : undefined;
};
const photosDir = opt("--foto");
const spinDir = opt("--360");
if (!photosDir && !spinDir) {
  console.error("Indica almeno --foto <cartella> oppure --360 <cartella>");
  process.exit(1);
}

const IMG = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".tif", ".tiff"]);
const list = (dir) =>
  readdirSync(dir)
    .filter((f) => IMG.has(extname(f).toLowerCase()) && !f.startsWith("."))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

const root = new URL("../", import.meta.url).pathname;
const out = join(root, "public/orologi", slug);
mkdirSync(out, { recursive: true });

const saveWebp = (src, dst, size) =>
  sharp(src).rotate().resize({ width: size, height: size, fit: "inside", withoutEnlargement: true }).webp({ quality: 80, alphaQuality: 90 }).toFile(dst);
const save = (src, dst, size) =>
  sharp(src).rotate().resize({ width: size, height: size, fit: "inside", withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(dst);

const snippet = { image: undefined, photos: [], spin: undefined };

if (photosDir) {
  const files = list(photosDir);
  for (const [i, f] of files.entries()) {
    const name = i === 0 ? "cover.jpg" : `foto-${i}.jpg`;
    await save(join(photosDir, f), join(out, name), 1800);
    if (i === 0) snippet.image = `/orologi/${slug}/cover.jpg`;
    else snippet.photos.push(`/orologi/${slug}/${name}`);
  }
  console.log(`Foto: ${files.length}`);
}

if (spinDir) {
  const files = list(spinDir);
  const dir = join(out, "360");
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  for (const [i, f] of files.entries()) await saveWebp(join(spinDir, f), join(dir, `${String(i + 1).padStart(3, "0")}.webp`), 800);
  snippet.spin = { dir: `/orologi/${slug}/360`, frames: files.length };
  console.log(`Fotogrammi 360°: ${files.length}${files.length < 18 ? " (consigliati almeno 18 per una rotazione fluida)" : ""}`);
}

console.log(`\nFatto: public/orologi/${slug}/\n\nIncolla in src/data/products.ts (e completa i campi):\n`);
console.log(`  {
    slug: "${slug}",
    name: "",
    brand: "",
    ref: "",
    year: "",
    price: null, // oppure il prezzo in euro, es. 8500
    condition: "",
    description: "",${snippet.image ? `\n    image: "${snippet.image}",` : ""}${snippet.photos.length ? `\n    photos: ${JSON.stringify(snippet.photos)},` : ""}${snippet.spin ? `\n    spin: { dir: "${snippet.spin.dir}", frames: ${snippet.spin.frames}, ext: "webp" },` : ""}${opt("--accento") ? `\n    accent: "${opt("--accento")}",` : ""}
    details: [["Cassa", ""], ["Movimento", ""], ["Corredo", "Scatola e garanzia"]],
  },`);
