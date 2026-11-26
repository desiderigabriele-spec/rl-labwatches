import PageHero from "@/components/PageHero";
import FaqSearch from "@/components/pages/FaqSearch";
import JsonLd from "@/components/JsonLd";
import { faq } from "@/data/faq";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Domande frequenti: riparazione orologi",
  description:
    "Tempi, costi, garanzia di 12 mesi, ricambi originali e spedizione: le risposte di Roberto Landi, orologiaio a Pistoia, sulla riparazione degli orologi.",
  path: "/faq",
});

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqLd} />
      <PageHero h1="Domande frequenti su riparazione e restauro di orologi" title="Le risposte che *mi chiedono più spesso.*" intro="Tempi, costi, garanzia e spedizioni. Cerca o tocca un argomento." crumbs={[{ name: "FAQ", path: "/faq" }]} />
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-8 sm:py-20">
        <FaqSearch />
      </section>
    </>
  );
}
