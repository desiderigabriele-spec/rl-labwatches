// Versioni leggere delle immagini più pesanti (per srcset e formati moderni). Rilanciabile: rigenera tutto.
// node scripts/varianti-immagini.mjs
import sharp from "sharp";
import { readdirSync } from "node:fs";

const jobs = [];
// foto prima/dopo dei lavori: 900 px → 480 px per i telefoni
for (const f of readdirSync("public/lavori").filter((f) => /\.webp$/.test(f) && !/-480\.webp$/.test(f)))
  jobs.push([`public/lavori/${f}`, `public/lavori/${f.replace(".webp", "-480.webp")}`, { width: 480 }]);
// (le immagini del restauro del Daytona restano a piena risoluzione: le precarica useWarm con il loro indirizzo
// esatto, e su un telefono con schermo denso servono comunque intere)
// loghi delle marche: da PNG a WebP (quelli chiari della vetrina a 100 px di altezza, bastano anche su schermi densi)
for (const f of readdirSync("public/marche").filter((f) => f.endsWith(".png")))
  jobs.push([`public/marche/${f}`, `public/marche/${f.replace(".png", ".webp")}`, null]);
for (const f of readdirSync("public/marche/chiaro").filter((f) => f.endsWith(".png")))
  jobs.push([`public/marche/chiaro/${f}`, `public/marche/chiaro/${f.replace(".png", ".webp")}`, { height: 100 }]);

for (const [src, out, resize] of jobs) {
  let img = sharp(src);
  if (resize) img = img.resize({ ...resize, withoutEnlargement: true });
  const info = await img.webp({ quality: 82, alphaQuality: 90, effort: 6 }).toFile(out);
  console.log(out, `${info.width}×${info.height}`, `${Math.round(info.size / 1024)} KB`);
}
