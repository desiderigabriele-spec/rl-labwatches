import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
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
