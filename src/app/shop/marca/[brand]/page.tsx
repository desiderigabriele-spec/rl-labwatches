import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandEntrance from "@/components/BrandEntrance";
import BrandLogo from "@/components/BrandLogo";
import JsonLd from "@/components/JsonLd";
import ShopGrid, { BrandNav, EmptyBrand } from "@/components/ShopGrid";
import { brandBySlug, brands } from "@/data/brands";
import { products, SHOP_READY } from "@/data/products";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

type Props = { params: Promise<{ brand: string }> };

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = brandBySlug((await params).brand);
  return b
    ? pageMeta({
        title: `Orologi ${b.name} selezionati e revisionati`,
        description: `Orologi ${b.name} in vendita a Pistoia: ogni pezzo è selezionato da Roberto Landi, revisionato in laboratorio e garantito 12 mesi.`,
        path: `/shop/marca/${b.slug}`,
        noindex: !SHOP_READY,
      })
    : {};
}

export default async function BrandPage({ params }: Props) {
  const b = brandBySlug((await params).brand);
  if (!b) notFound();
  const list = products.filter((p) => p.brand.toLowerCase() === b.name.toLowerCase());
  const crumbs = [
    { name: "Orologi", path: "/shop" },
    { name: b.name, path: `/shop/marca/${b.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      {/* fondo scuro sotto la pagina: arrivando dalla vetrina non si vede il lampo chiaro del cambio pagina */}
      <style>{"body{background:#0b100d}"}</style>
      {/* apertura scura, in continuità con la vetrina */}
      {/* apertura compatta: il cofanetto piccolo e che cosa si trova in questa pagina */}
      <section className="guilloche relative overflow-hidden bg-[#0b100d] pb-10 pt-24 text-cream sm:pb-16 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(0,69,42,0.35),transparent_60%)]" />
        <div className="relative">
          <BrandEntrance slug={b.slug}>
            <nav aria-label="Percorso" className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/45">
              <Link href="/" className="hover:text-gold-3">Home</Link> <span aria-hidden>/</span>{" "}
              <Link href="/shop" className="hover:text-gold-3">Orologi</Link> <span aria-hidden>/</span> {b.name}
            </nav>
            <h1 className="mt-3 font-display text-[2rem] font-light leading-[1.05] sm:mt-4 sm:text-5xl lg:text-6xl">
              Orologi <em className="text-gold-3">{b.name}</em> in vendita
            </h1>
            <p className="mt-4 max-w-2xl text-[0.9rem] leading-relaxed text-cream/70 sm:mt-5 sm:text-base lg:text-lg">
              Qui trovi i {b.name} che ho selezionato e revisionato nel mio laboratorio di Pistoia, pronti da indossare. Per ogni orologio ci sono foto
              vere, referenza, anno, condizioni e corredo. Ti interessa un pezzo o ne cerchi uno preciso? Scrivimi e ti rispondo io.
            </p>
            <ul className="mt-4 hidden flex-wrap gap-x-6 gap-y-2 text-[0.72rem] uppercase tracking-[0.18em] text-gold-3 sm:mt-6 sm:flex">
              <li>Revisionati in laboratorio</li>
              <li>Garanzia 12 mesi</li>
              <li>Spedizione assicurata o ritiro a Pistoia</li>
            </ul>
          </BrandEntrance>
        </div>
      </section>

      <div className="bg-paper">
      <section id="disponibili" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-4xl font-light">
            {list.length ? `${list.length} ${list.length === 1 ? "orologio disponibile" : "orologi disponibili"}` : "Orologi disponibili"}
          </h2>
          <BrandNav current={b.slug} />
        </div>
        {list.length ? <ShopGrid products={list} /> : <EmptyBrand brand={b} />}
      </section>
      </div>
    </>
  );
}
