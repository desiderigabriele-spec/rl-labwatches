import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import ProductGallery from "@/components/ProductGallery";
import JsonLd from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { formatPrice, spinFrames } from "@/data/products";
import { assoluto, getCatalogo } from "@/data/catalogo";
import { fiducia, rigaSpecifiche } from "@/data/filtri";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { site, whatsappLink } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 60;

export async function generateStaticParams() {
  const { products } = await getCatalogo();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products, reale } = await getCatalogo();
  const p = products.find((x) => x.slug === slug);
  return p ? pageMeta({ title: `${p.brand} ${p.name}`, description: p.description, path: `/shop/${p.slug}`, noindex: !reale }) : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { products, reale } = await getCatalogo();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  const subject = encodeURIComponent(`Richiesta informazioni: ${p.brand} ${p.name} (${p.ref})`);
  const frames = spinFrames(p);
  const f = fiducia(p);
  const photos = [...(p.image ? [p.image] : []), ...(p.photos ?? [])];
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.name}`,
    brand: { "@type": "Brand", name: p.brand },
    sku: p.ref,
    description: p.description,
    image: [...photos, ...frames.slice(0, 1)].map((u) => assoluto(u, site.url)),
    itemCondition: "https://schema.org/UsedCondition",
    ...(p.price !== null && {
      offers: {
        "@type": "Offer",
        price: p.price,
        priceCurrency: "EUR",
        availability: p.sold ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
        url: `${site.url}/shop/${p.slug}`,
        seller: { "@id": `${site.url}/#business` },
      },
    }),
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-8">
      {reale && <JsonLd data={productLd} />}
      <JsonLd data={breadcrumbLd([{ name: "Orologi", path: "/shop" }, { name: `${p.brand} ${p.name}`, path: `/shop/${p.slug}` }])} />
      <Link href="/shop" className="text-xs uppercase tracking-[0.2em] text-mute hover:text-gold">← Tutti gli orologi</Link>
      <div className="mt-10 grid gap-14 lg:grid-cols-2">
        <Reveal>
          <ProductGallery name={`${p.brand} ${p.name}`} frames={frames} photos={photos} />
        </Reveal>
        <Reveal delay={0.1} className="lg:pt-8">
          <p className="eyebrow">{p.brand}</p>
          <h1 className="mt-4 font-display text-5xl font-light sm:text-7xl">{p.name}</h1>
          <div className="mt-5 flex flex-wrap gap-2 text-fg/65">
            <span className="chip">Ref. {p.ref}</span>
            <span className="chip">{p.year}</span>
            {rigaSpecifiche(p) && <span className="chip">{rigaSpecifiche(p)}</span>}
            <span className="chip">{p.condition}</span>
          </div>
          {/* prezzo chiaro e rassicurante: barrato, cifra grande, risparmio in euro, motivi di fiducia, un solo pulsante */}
          <div className="mt-8 border-y border-line py-6">
            {!p.sold && p.listPrice != null && <s className="tag-mono block text-base text-mute">{formatPrice(p.listPrice)}</s>}
            <p className={`${p.price === null ? "font-display text-4xl" : "tag-mono text-4xl sm:text-display"} leading-tight ${p.sold ? "text-mute" : "text-green"}`}>{formatPrice(p.price)}</p>
            {!p.sold && p.listPrice != null && p.price != null && (
              <p className="mt-3"><span className="bg-green px-2.5 py-1 text-xs uppercase tracking-[0.14em] text-cream">Risparmi {formatPrice(p.listPrice - p.price)}</span></p>
            )}
            {!p.sold && (
              <ul className="mt-5 grid gap-1.5 text-sm text-green">
                {f.revisionato && <li>✓ Revisionato nel laboratorio di {site.owner.split(" ")[0]}</li>}
                {(f.garanzia || f.corredo) && <li>✓ {[f.garanzia, f.corredo].filter(Boolean).join(" · ")}</li>}
                <li>✓ Spedizione assicurata o ritiro a {site.address.city}</li>
              </ul>
            )}
            {p.sold ? (
              <div className="mt-2 grid gap-4">
                <p className="text-sm uppercase tracking-[0.2em] text-mute">Questo orologio è stato venduto.</p>
                <a href={whatsappLink(`Buongiorno, ho visto che ${p.brand} ${p.name} è stato venduto: cerco un orologio simile.`)} target="_blank" rel="noopener noreferrer" className="btn self-start">
                  <WhatsAppIcon className="h-4 w-4" /> Cerchi un orologio simile?
                </a>
              </div>
            ) : (
              <div className="mt-6 grid gap-3">
                <a href={whatsappLink(`Buongiorno, vorrei informazioni su ${p.brand} ${p.name} (${p.ref}).`)} target="_blank" rel="noopener noreferrer" className="btn btn-solid w-full sm:w-auto sm:self-start">
                  <WhatsAppIcon className="h-4 w-4" /> {p.price === null ? "Chiedi il prezzo su WhatsApp" : "Chiedi su WhatsApp"}
                </a>
                <a href={`mailto:${site.email}?subject=${subject}`} className="text-sm text-mute underline underline-offset-4 hover:text-gold">oppure scrivi un'email</a>
              </div>
            )}
          </div>
          <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
            {([["Marca", p.brand], ["Referenza", p.ref], ["Anno", p.year], ["Condizioni", p.condition], ...(p.details ?? [])] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3.5">
                <dt className="text-mute">{k}</dt>
                <dd className="tag-mono text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 leading-relaxed text-mute">{p.description}</p>
        </Reveal>
      </div>
    </section>
  );
}
