"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { brands, brandBySlug } from "@/data/brands";
import type { Product } from "@/data/products";
import { whatsappLink } from "@/data/site";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";
import { WhatsAppIcon } from "./WhatsAppButton";

/** Elenco degli orologi con il filtro per marca (?marca=rolex), che arriva anche dalla vetrina. */
export default function ShopGrid({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const brand = brandBySlug(params.get("marca"));
  const list = brand ? products.filter((p) => p.brand.toLowerCase() === brand.name.toLowerCase()) : products;

  const pick = (slug: string | null) => router.replace(slug ? `${pathname}?marca=${slug}` : pathname, { scroll: false });
  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors duration-300 ${active ? "border-fg bg-fg text-paper" : "border-line text-mute hover:border-fg hover:text-fg"}`;

  return (
    <>
      <div className="mb-12 flex flex-wrap gap-2" role="group" aria-label="Filtra per marca">
        <button type="button" onClick={() => pick(null)} aria-pressed={!brand} className={chip(!brand)}>
          Tutti
        </button>
        {brands.map((b) => (
          <button key={b.slug} type="button" onClick={() => pick(b.slug)} aria-pressed={brand?.slug === b.slug} className={chip(brand?.slug === b.slug)}>
            {b.name}
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.1}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="border border-line bg-paper-2 px-6 py-14 text-center sm:px-12">
          <p className="font-display text-3xl font-light">Al momento nessun {brand?.name} in vetrina.</p>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-mute">
            I pezzi migliori spesso partono prima di arrivare sul sito. Dimmi che modello cerchi: lo trovo, lo controllo in laboratorio e te lo propongo.
          </p>
          <a href={whatsappLink(`Buongiorno, cerco un orologio ${brand?.name ?? ""}.`)} target="_blank" rel="noopener noreferrer" className="btn-wa mt-8 inline-flex whitespace-nowrap">
            <WhatsAppIcon />
            <span>
              <b>Cerco un {brand?.name}</b>
              <small>Scrivimi su WhatsApp</small>
            </span>
          </a>
        </div>
      )}
    </>
  );
}
