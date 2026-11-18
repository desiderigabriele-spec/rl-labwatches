import Link from "next/link";
import { brands, type Brand } from "@/data/brands";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/data/site";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppButton";
import BrandLogo from "./BrandLogo";

/**
 * Scelta della marca con i loghi, in tessere tutte uguali: tre per riga sul telefono, sei in fila sul computer.
 * La marca aperta è la tessera scura con il logo dorato. I loghi hanno proporzioni diverse (Audemars Piguet è
 * una scritta lunga, Cartier quasi quadrato): l'altezza cambia perché sembrino tutti della stessa grandezza.
 */
export function BrandNav({ current }: { current?: string }) {
  return (
    <nav aria-label="Marche" className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
      {brands.map((b) => {
        const on = current === b.slug;
        // Patek Philippe ha la scritta sottile e piccola sotto la croce: un po' più grande per pareggiare il peso
        const size = b.ratio > 3 ? "h-[1.15rem] sm:h-6" : b.ratio < 1.5 || b.slug === "patek-philippe" ? "h-10 sm:h-12" : "h-7 sm:h-9";
        return (
          <Link
            key={b.slug}
            // si resta sulla lista degli orologi: cambia la marca, non si torna in cima alla pagina
            href={`/shop/marca/${b.slug}#disponibili`}
            aria-current={on ? "page" : undefined}
            className={`group flex h-[4.25rem] items-center justify-center rounded-sm border px-2 transition-colors duration-300 sm:h-24 ${
              on ? "border-fg bg-fg text-gold-3" : "border-line bg-paper-2/60 text-fg/60 hover:border-fg/40 hover:text-fg"
            }`}
          >
            <BrandLogo brand={b} className={`max-w-full ${size}`} />
          </Link>
        );
      })}
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
