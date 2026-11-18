import PageHero from "@/components/PageHero";
import ShopGrid, { BrandNav } from "@/components/ShopGrid";
import Showcase from "@/components/Showcase";
import { getCatalogo } from "@/data/catalogo";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  const { reale } = await getCatalogo();
  return pageMeta({
  title: "Orologi di lusso selezionati e revisionati",
  description: "Orologi di lusso e d'epoca selezionati da Roberto Landi a Pistoia, controllati e revisionati in laboratorio prima della vendita.",
  path: "/shop",
  noindex: !reale,
  });
}

export default async function ShopPage() {
  const { products } = await getCatalogo();
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
        <div className="mb-12">
          <BrandNav />
        </div>
        <ShopGrid products={products} />
      </section>
    </>
  );
}
