import Link from "next/link";
import { brands, type Brand } from "@/data/brands";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/data/site";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppButton";

/** Collegamenti alle sezioni delle marche (la marca aperta è evidenziata) */
export function BrandNav({ current }: { current?: string }) {
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${active ? "border-fg bg-fg text-paper" : "border-line text-mute hover:border-fg hover:text-fg"}`;
  return (
    <nav aria-label="Marche" className="flex flex-wrap gap-2">
      <Link href="/shop#orologi" className={chip(!current)} aria-current={!current ? "page" : undefined}>
        Tutti
      </Link>
      {brands.map((b) => (
        <Link key={b.slug} href={`/shop/marca/${b.slug}`} className={chip(current === b.slug)} aria-current={current === b.slug ? "page" : undefined}>
          {b.name}
        </Link>
      ))}
    </nav>
  );
}

/** Nessun orologio disponibile di una marca: invito a scrivere per cercarne uno */
export function EmptyBrand({ brand }: { brand: Brand }) {
  return (
    <div className="border border-line bg-paper-2 px-6 py-14 text-center sm:px-12">
      <p className="font-display text-3xl font-light">Al momento nessun {brand.name} disponibile.</p>
      <p className="mx-auto mt-4 max-w-xl leading-relaxed text-mute">
        I pezzi migliori spesso partono prima di arrivare sul sito. Dimmi che modello cerchi: lo trovo, lo controllo in laboratorio e te lo propongo.
      </p>
      <a href={whatsappLink(`Buongiorno, cerco un orologio ${brand.name}.`)} target="_blank" rel="noopener noreferrer" className="btn-wa mt-8 inline-flex whitespace-nowrap">
        <WhatsAppIcon />
        <span>
          <b>Cerco un {brand.name}</b>
          <small>Scrivimi su WhatsApp</small>
        </span>
      </a>
    </div>
  );
}

/** Griglia degli orologi in vendita */
export default function ShopGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p, i) => (
        <Reveal key={p.slug} delay={(i % 3) * 0.1}>
          <ProductCard product={p} />
        </Reveal>
      ))}
    </div>
  );
}
