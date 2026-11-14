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
      <section className="relative overflow-hidden bg-[#0b100d] pt-20 text-cream sm:pt-28">
        <BrandEntrance
          slug={b.slug}
          left={
            <>
              <nav aria-label="Percorso" className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/45">
                <Link href="/" className="hover:text-gold-3">Home</Link> <span aria-hidden>/</span>{" "}
                <Link href="/shop" className="hover:text-gold-3">Orologi</Link> <span aria-hidden>/</span> {b.name}
              </nav>
              <BrandLogo brand={b} className={`mx-auto mt-6 text-gold-3 lg:ml-auto lg:mr-0 ${b.ratio > 3 ? "h-7" : "h-12 lg:h-14"}`} />
              <h1 className="mt-5 font-display text-5xl font-light leading-[1.05] sm:text-6xl xl:text-7xl">
                Orologi <em className="text-gold-3">{b.name}</em>
              </h1>
            </>
          }
          right={
            <>
              <p className="mx-auto max-w-md leading-relaxed text-cream/70 lg:mx-0 lg:text-lg">
                Ogni {b.name} in vendita è selezionato da me, controllato e revisionato nel mio laboratorio prima di arrivare in vetrina, con 12 mesi di garanzia.
              </p>
              <a href="#disponibili" className="btn mt-8 self-center !border-gold-3 !bg-gold-3 !text-green-2 hover:!bg-cream lg:self-start">
                Orologi disponibili
              </a>
            </>
          }
        />
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
