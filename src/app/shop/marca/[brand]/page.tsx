import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BrandEntrance from "@/components/BrandEntrance";
import JsonLd from "@/components/JsonLd";
import { BrandNav, EmptyBrand } from "@/components/ShopGrid";
import ShopFiltri from "@/components/ShopFiltri";
import { brandBySlug, brands } from "@/data/brands";
import { getCatalogo } from "@/data/catalogo";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappLink } from "@/data/site";

/** modelli che passano più spesso dal banco, per marca */
const MODELLI: Record<string, string[]> = {
  rolex: ["Submariner", "Daytona", "Datejust", "GMT-Master II", "Explorer", "Day-Date"],
  "patek-philippe": ["Nautilus", "Aquanaut", "Calatrava", "Complicazioni"],
  "audemars-piguet": ["Royal Oak", "Royal Oak Offshore", "Code 11.59"],
  cartier: ["Tank", "Santos", "Panthère", "Ballon Bleu"],
  tudor: ["Black Bay", "Pelagos", "Ranger"],
  omega: ["Speedmaster", "Seamaster", "Constellation"],
};

type Props = { params: Promise<{ brand: string }> };

export const revalidate = 60;

export function generateStaticParams() {
  return brands.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = brandBySlug((await params).brand);
  const { reale } = await getCatalogo();
  return b
    ? pageMeta({
        title: `${b.name} usati e revisionati a Pistoia`,
        description: `${b.name} usati selezionati a Pistoia: ogni pezzo è aperto, revisionato e garantito 12 mesi. Cerchi un modello preciso? Te lo trovo e lo controllo io.`,
        path: `/shop/marca/${b.slug}`,
        noindex: !reale,
      })
    : {};
}

export default async function BrandPage({ params }: Props) {
  const b = brandBySlug((await params).brand);
  if (!b) notFound();
  const { products } = await getCatalogo();
  const list = products.filter((p) => p.brand.toLowerCase() === b.name.toLowerCase());
  const crumbs = [
    { name: "Orologi", path: "/shop" },
    { name: b.name, path: `/shop/marca/${b.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />
      {/* fondo scuro sotto la pagina: arrivando dalla vetrina non si vede il lampo chiaro del cambio pagina */}
      <style>{"body{background:var(--color-night)}"}</style>
      {/* apertura scura, in continuità con la vetrina */}
      {/* apertura compatta: il cofanetto piccolo e che cosa si trova in questa pagina */}
      <section className="guilloche relative overflow-hidden bg-night pb-12 pt-20 text-cream sm:pb-16 sm:pt-36">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_0%,rgba(0,69,42,0.35),transparent_60%)]" />
        <div className="relative">
          <BrandEntrance slug={b.slug}>
            <nav aria-label="Percorso" className="text-xs uppercase tracking-[0.2em] text-cream/65">
              <Link href="/" className="inline-block py-1.5 hover:text-gold-3">Home</Link> <span aria-hidden>/</span>{" "}
              <Link href="/shop" className="inline-block py-1.5 hover:text-gold-3">Orologi</Link> <span aria-hidden>/</span> {b.name}
            </nav>
            <h1 className="mt-3 font-display text-display font-light leading-[1.05] sm:mt-4 sm:text-6xl">
              <em className="text-gold-3">{b.name}</em> usati e revisionati a Pistoia
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-cream/80 sm:mx-0 sm:mt-5 sm:max-w-2xl sm:text-base lg:text-lg">
              Qui trovi i {b.name} che ho selezionato e revisionato nel mio laboratorio di Pistoia, pronti da indossare. Per ogni orologio ci sono foto
              vere, referenza, anno, condizioni e corredo. Ti interessa un pezzo o ne cerchi uno preciso? Scrivimi e ti rispondo io.
            </p>
            <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-[0.18em] text-gold-3 sm:justify-start sm:gap-x-6 sm:text-xs">
              <li>Revisionati in laboratorio</li>
              <li>Garanzia 12 mesi</li>
              <li>Spedizione assicurata o ritiro a Pistoia</li>
            </ul>
          </BrandEntrance>
        </div>
      </section>

      <div className="bg-paper">
      <section id="disponibili" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <h2 className="font-display text-4xl font-light sm:text-5xl">
            {list.length ? `${list.length} ${list.length === 1 ? "orologio disponibile" : "orologi disponibili"}` : "Orologi disponibili"}
          </h2>
          <Link href="/shop" className="shrink-0 border-b border-line pb-1 text-xs uppercase tracking-[0.2em] text-mute hover:text-fg">
            Tutte le marche
          </Link>
        </div>
        <div className="mb-14">
          <BrandNav current={b.slug} />
        </div>
        {list.length ? <ShopFiltri products={list} senzaMarca /> : <EmptyBrand brand={b} />}
      </section>

      {/* restauro della marca: la pagina serve anche a chi un orologio ce l'ha già */}
      <section className="border-t border-line bg-paper-2">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-8 sm:py-20 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="eyebrow">Hai già un {b.name}?</p>
            <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">
              Restauro e revisione <em className="text-gold">{b.name}</em>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-mute">{b.text}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappLink(`Buongiorno Roberto, ho un ${b.name} da far vedere.`)} target="_blank" rel="noopener noreferrer" className="btn-wa whitespace-nowrap">
                <WhatsAppIcon className="h-5 w-5" />
                <span>
                  <b>Ho un {b.name}</b>
                  <small>Mandami una foto</small>
                </span>
              </a>
              <Link href="/servizi" className="btn self-center">I lavori che faccio</Link>
            </div>
          </div>
          {MODELLI[b.slug] && (
            <div>
              <p className="eyebrow">Passano spesso dal mio banco</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {MODELLI[b.slug].map((m) => (
                  <li key={m} className="rounded-full border border-line bg-paper px-4 py-2 text-sm">{b.name} {m}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
      </div>
    </>
  );
}
