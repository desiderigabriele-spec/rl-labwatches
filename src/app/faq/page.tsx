import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";
import { faq } from "@/data/faq";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "FAQ riparazione orologi di lusso",
  description:
    "Tempi, costi, garanzia di 12 mesi, ricambi originali, spedizione e pagamenti: le risposte alle domande frequenti sulla riparazione di orologi di lusso.",
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
      <PageHero eyebrow="FAQ" title="Domande *frequenti*" intro="Tempi, costi, garanzia e spedizioni: le risposte alle domande che i clienti mi fanno più spesso." crumbs={[{ name: "FAQ", path: "/faq" }]} />
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-8">
        {faq.map((f, i) => (
          <Reveal key={f.q} delay={i * 0.03}>
            <details className="group border-b border-line py-7" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
                <h2 className="font-display text-2xl sm:text-3xl">{f.q}</h2>
                <span className="mt-2 text-2xl text-gold transition-transform duration-300 group-open:rotate-45" aria-hidden>+</span>
              </summary>
              <p className="mt-4 max-w-2xl leading-relaxed text-mute">{f.a}</p>
            </details>
          </Reveal>
        ))}
        <Reveal className="mt-16 text-center">
          <p className="text-mute">Non trovi la risposta che cerchi?</p>
          <Link href="/contatti" className="btn btn-solid mt-6">Contattami</Link>
        </Reveal>
      </section>
    </>
  );
}
