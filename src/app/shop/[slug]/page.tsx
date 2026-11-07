import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import ProductGallery from "@/components/ProductGallery";
import JsonLd from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { formatPrice, products, SHOP_READY, spinFrames } from "@/data/products";
import { breadcrumbLd, pageMeta } from "@/lib/seo";
import { site, whatsappLink } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  return p ? pageMeta({ title: `${p.brand} ${p.name}`, description: p.description, path: `/shop/${p.slug}`, noindex: !SHOP_READY }) : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  const subject = encodeURIComponent(`Richiesta informazioni: ${p.brand} ${p.name} (${p.ref})`);
  const frames = spinFrames(p);
  const photos = [...(p.image ? [p.image] : []), ...(p.photos ?? [])];
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.brand} ${p.name}`,
    brand: { "@type": "Brand", name: p.brand },
    sku: p.ref,
    description: p.description,
    image: [...photos, ...frames.slice(0, 1)].map((u) => `${site.url}${u}`),
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
      {SHOP_READY && <JsonLd data={productLd} />}
      <JsonLd data={breadcrumbLd([{ name: "Orologi", path: "/shop" }, { name: `${p.brand} ${p.name}`, path: `/shop/${p.slug}` }])} />
      <Link href="/shop" className="text-xs uppercase tracking-[0.24em] text-mute hover:text-gold">← Tutti gli orologi</Link>
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
            <span className="chip">{p.condition}</span>
          </div>
          <p className="tag-mono mt-6 text-3xl text-green">{formatPrice(p.price)}</p>
          <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
            {([["Marca", p.brand], ["Referenza", p.ref], ["Anno", p.year], ["Condizioni", p.condition], ...(p.details ?? [])] as [string, string][]).map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-3.5">
                <dt className="text-mute">{k}</dt>
                <dd className="tag-mono text-right">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 leading-relaxed text-mute">{p.description}</p>
          {p.sold ? (
            <p className="mt-10 text-sm uppercase tracking-[0.2em] text-mute">Questo orologio è stato venduto.</p>
          ) : (
            <div className="mt-10 flex flex-wrap gap-4">
              <a href={whatsappLink(`Buongiorno, vorrei informazioni su ${p.brand} ${p.name} (${p.ref}).`)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                <WhatsAppIcon className="h-4 w-4" /> Chiedi su WhatsApp
              </a>
              <a href={`mailto:${site.email}?subject=${subject}`} className="btn">Richiedi via email</a>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
