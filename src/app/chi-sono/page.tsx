import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { EndCta } from "@/components/pages/Bits";
import { GOOGLE_REVIEWS_URL, reviews } from "@/data/reviews";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Chi sono",
  description:
    "Roberto Landi, artigiano di Pistoia specializzato in riparazione e restauro di orologi di lusso: la mia storia e la passione per l'orologeria.",
  path: "/chi-sono",
});
metadata.title = { absolute: "Chi sono | Roberto Landi, orologiaio a Pistoia" };

const STORY = [
  ["L'inizio", "La bottega di famiglia", "Mio padre era un abile restauratore e intarsiatore del legno: da lui ho imparato la pazienza e la cura per ogni dettaglio."],
  ["La scuola", "Il Liceo Artistico", "La manualità e la creatività mi hanno portato a specializzarmi nell'arte dei metalli."],
  ["La vocazione", "L'orologeria", "A rivelarmela è stato mio zio, orologiaio. Da lì non ho più smesso."],
  ["Oggi", "Il laboratorio di Pistoia", "Restauro e compravendita di orologi di lusso, insieme a un amico d'infanzia che in oltre dieci anni ha costruito un negozio tra i più importanti in Italia."],
];

export default function ChiSonoPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Chi sono", path: "/chi-sono" }])} />
      <section className="relative overflow-hidden pt-32 sm:pt-40">
        <div className="mx-auto grid max-w-7xl items-end gap-10 px-4 sm:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <Reveal className="pb-6 lg:pb-20">
            <nav aria-label="Percorso" className="mb-6 text-[0.68rem] uppercase tracking-[0.2em] text-mute">
              <Link href="/" className="hover:text-gold">Home</Link> <span aria-hidden>/</span> Chi sono
            </nav>
            <p className="eyebrow">Roberto Landi · orologiaio a Pistoia</p>
            <h1 className="mt-5 font-display text-[2.4rem] font-light italic leading-[1.08] sm:text-6xl">
              &ldquo;Non mi limito a riparare: <span className="text-gold">risveglio la bellezza</span> di ogni orologio.&rdquo;
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">
              Mani da artigiano, cuore da orologiaio. Sapere artigiano e strumenti di ultima generazione, con una meticolosa attenzione ai dettagli. E a ogni
              cliente rispondo io.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-[931/1475] w-[72%] max-w-sm lg:w-full">
              <Image src="/images/roberto-landi-ritratto.webp" alt="Roberto Landi, orologiaio a Pistoia" fill priority sizes="(min-width: 1024px) 30vw, 70vw" className="object-contain object-bottom" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="guilloche bg-green-2 text-cream">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 text-center sm:grid-cols-3 sm:px-8">
          <div>
            <p className="font-display text-5xl font-light text-gold-3">12 mesi</p>
            <p className="mt-1 text-sm text-cream/70">di garanzia su ogni lavoro</p>
          </div>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="group">
            <p className="font-display text-5xl font-light text-gold-3">★★★★★</p>
            <p className="mt-1 text-sm text-cream/70 group-hover:text-cream">{reviews.length} recensioni su Google · leggile</p>
          </a>
          <div>
            <p className="font-display text-5xl font-light text-gold-3">Gratis</p>
            <p className="mt-1 text-sm text-cream/70">la prima valutazione e il preventivo</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-8 lg:grid-cols-2">
        <ol className="space-y-8 border-l border-gold/50 pl-6">
          {STORY.map(([k, t, d], i) => (
            <Reveal as="li" key={t} delay={i * 0.06}>
                <p className="text-[0.68rem] uppercase tracking-[0.22em] text-gold">{k}</p>
                <h2 className="mt-1 font-display text-3xl font-light">{t}</h2>
                <p className="mt-2 leading-relaxed text-mute">{d}</p>
            </Reveal>
          ))}
        </ol>
        <Reveal delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-paper-2">
            <Image src="/images/roberto-landi-orologiaio-al-lavoro.jpg" alt="Roberto Landi al banco da orologiaio" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </div>
        </Reveal>
      </section>

      <EndCta
        title={<>Il tuo orologio, <em className="text-gold">nelle mie mani.</em></>}
        text="Raccontamelo con una foto: ti rispondo io, di persona."
        whatsapp="Buongiorno Roberto, le scrivo dal sito per un orologio."
      />
    </>
  );
}
