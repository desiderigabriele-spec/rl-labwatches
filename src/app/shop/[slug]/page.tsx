import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { WatchPlaceholder } from "@/components/ProductCard";
import { formatPrice, products } from "@/data/products";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  return p ? { title: `${p.brand} ${p.name}`, description: p.description } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  const subject = encodeURIComponent(`Richiesta informazioni: ${p.brand} ${p.name} (${p.ref})`);

  return (
    <section className="mx-auto max-w-7xl px-4 pt-32 pb-24 sm:px-8">
      <Link href="/shop" className="text-xs uppercase tracking-[0.24em] text-mute hover:text-gold">← Torna allo shop</Link>
      <div className="mt-10 grid gap-14 lg:grid-cols-2">
        <Reveal>
          <div className="relative flex aspect-square items-center justify-center border border-line bg-ink-2">
            {p.image ? <Image src={p.image} alt={p.name} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /> : <WatchPlaceholder />}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="lg:pt-8">
          <p className="eyebrow">{p.brand} · {p.year}</p>
          <h1 className="mt-4 font-display text-5xl font-light sm:text-6xl">{p.name}</h1>
          <p className="mt-6 text-2xl text-gold">{formatPrice(p.price)}</p>
          <dl className="mt-10 divide-y divide-line border-y border-line text-sm">
            {[
              ["Referenza", p.ref],
              ["Epoca", p.year],
              ["Condizioni", p.condition],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between py-4">
                <dt className="text-mute">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-8 leading-relaxed text-mute">{p.description}</p>
          {p.sold ? (
            <p className="mt-10 text-sm uppercase tracking-[0.2em] text-mute">Questo orologio è stato venduto.</p>
          ) : (
            <a href={`mailto:${site.email}?subject=${subject}`} className="btn btn-solid mt-10">Richiedi disponibilità</a>
          )}
        </Reveal>
      </div>
    </section>
  );
}
