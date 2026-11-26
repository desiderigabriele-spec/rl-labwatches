import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { BrandNav } from "@/components/ShopGrid";
import ShopFiltri from "@/components/ShopFiltri";
import Showcase from "@/components/Showcase";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { getCatalogo } from "@/data/catalogo";
import { whatsappLink } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const revalidate = 60;

export async function generateMetadata() {
  const { reale } = await getCatalogo();
  return pageMeta({
    title: "Compravendita orologi di lusso a Pistoia",
    description: "Orologi di lusso usati e d'epoca selezionati a Pistoia: ognuno aperto, controllato e revisionato in laboratorio prima della vendita, con garanzia scritta.",
    path: "/shop",
    noindex: !reale,
  });
}

const PROMISE = [
  ["Revisionato in laboratorio", "Ogni orologio lo apro, lo controllo e lo regolo prima di metterlo in vendita."],
  ["Garanzia 12 mesi", "Scritta, sul movimento e sul lavoro fatto."],
  ["Autenticità verificata", "Controllo movimento, numeri e componenti, con le foto."],
  ["Ritiro o spedizione assicurata", "A Pistoia su appuntamento, oppure con corriere assicurato."],
];

export default async function ShopPage() {
  const { products, reale } = await getCatalogo();
  return (
    <>
      <PageHero
        h1="Compravendita di orologi di lusso a Pistoia"
        title="Orologi aperti, controllati *e revisionati da me.*"
        intro="La vetrina online apre a gennaio 2027. Intanto puoi chiedermi un modello preciso, o affidarmi il tuo da vendere."
        crumbs={[{ name: "Orologi", path: "/shop" }]}
      />
      <Showcase eyebrow="In vetrina" title="Scegli la tua marca" />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="eyebrow">Come compri da me</p>
          <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">
            Prima di venderlo, <em className="text-gold">lo apro io.</em>
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISE.map(([t, d], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className="h-full rounded-2xl border border-line bg-paper-2 p-6">
                <p className="font-display text-2xl">{t}</p>
                <p className="mt-2 text-base leading-relaxed text-mute">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="guilloche bg-green-2 text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-14 sm:px-8 md:grid-cols-[1.2fr_0.8fr]">
          <Reveal>
            <h2 className="font-display text-4xl font-light sm:text-5xl">Cerchi un modello preciso?</h2>
            <p className="mt-3 max-w-xl text-cream/80">Dimmi cosa cerchi e il budget: lo trovo io, e prima di proportelo lo apro e lo controllo in laboratorio.</p>
          </Reveal>
          <Reveal delay={0.08} className="flex flex-wrap gap-3 md:justify-end">
            <a href={whatsappLink("Buongiorno Roberto, cerco un orologio: ")} target="_blank" rel="noopener noreferrer" className="btn-wa whitespace-nowrap">
              <WhatsAppIcon className="h-5 w-5" />
              <span>
                <b>Cercamelo</b>
                <small>Scrivimi su WhatsApp</small>
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      {/* la lista degli orologi compare solo quando ci sono quelli veri (fino ad allora erano esempi) */}
      {reale && (
        <section id="orologi" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 sm:px-8">
          <h2 className="mb-8 font-display text-4xl font-light sm:text-5xl">Tutti gli orologi</h2>
          <div className="mb-12">
            <BrandNav />
          </div>
          <ShopFiltri products={products} />
        </section>
      )}
    </>
  );
}
