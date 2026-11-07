import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export const metadata: Metadata = { title: "Shop", description: "Orologi d'epoca e di lusso selezionati, revisionati nel nostro laboratorio." };

export default function ShopPage() {
  return (
    <>
      <PageHero eyebrow="Shop" title="Orologi selezionati e revisionati." intro="Ogni pezzo è controllato e revisionato nel nostro laboratorio prima della vendita." />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.1}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
