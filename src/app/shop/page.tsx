import PageHero from "@/components/PageHero";
import { Suspense } from "react";
import ShopGrid from "@/components/ShopGrid";
import ProductCard from "@/components/ProductCard";
import Showcase from "@/components/Showcase";
import { products, SHOP_READY } from "@/data/products";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Orologi di lusso selezionati e revisionati",
  description: "Orologi di lusso e d'epoca selezionati da Roberto Landi a Pistoia, controllati e revisionati in laboratorio prima della vendita.",
  path: "/shop",
  noindex: !SHOP_READY,
});

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Orologi"
        title="Orologi selezionati e revisionati."
        intro="Ogni pezzo è controllato e revisionato nel mio laboratorio prima della vendita."
        crumbs={[{ name: "Orologi", path: "/shop" }]}
      />
      <Showcase eyebrow="In vetrina" title="Scegli la tua marca" />
      <section id="orologi" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-8">
        <h2 className="mb-8 font-display text-4xl font-light">Tutti gli orologi</h2>
        <Suspense
          fallback={
            <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          }
        >
          <ShopGrid products={products} />
        </Suspense>
      </section>
    </>
  );
}
