import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Gear from "@/components/Gear";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Chi sono",
  description:
    "Roberto Landi, artigiano di Pistoia specializzato in riparazione e restauro di orologi di lusso: la mia storia e la passione per l'orologeria.",
  path: "/chi-sono",
});
metadata.title = { absolute: "Chi sono | Roberto Landi, orologiaio a Pistoia" };

export default function ChiSonoPage() {
  return (
    <>
      <PageHero eyebrow="Chi sono" title="Roberto Landi" intro="Artigiano di orologi di lusso a Pistoia. Mani da artigiano, cuore da orologiaio." crumbs={[{ name: "Chi sono", path: "/chi-sono" }]} />
      <section className="relative overflow-hidden">
        <Gear className="absolute -right-48 top-10 h-[560px] w-[560px] text-gold/10" teeth={30} />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-fg">
              <Image src="/images/roberto-landi-artigiano-orologi-pistoia.jpg" alt="Roberto Landi, artigiano orologiaio a Pistoia" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover transition-transform duration-[2s] hover:scale-105" />
            </div>
          </Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-mute">
            <Reveal>
              <p>
                Sono nato a <strong className="font-medium text-fg">Pistoia</strong> e la <strong className="font-medium text-fg">passione per l&apos;artigianato</strong> l&apos;ho respirata in casa: mio padre era un abile restauratore e intarsiatore del legno, e da lui ho imparato la pazienza e la cura per ogni dettaglio. Quella manualità, unita alla creatività, mi ha portato al Liceo Artistico, dove mi sono specializzato nell&apos;arte dei metalli.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                Ma la mia vera passione è sempre stata l&apos;<strong className="font-medium text-fg">orologeria</strong>. A rivelarmi questa vocazione è stato mio zio, orologiaio. La vita mi ha poi riportato accanto a un amico d&apos;infanzia che, in oltre dieci anni, ha costruito un negozio di compravendita di orologi tra i più importanti a livello nazionale. Oggi portiamo avanti insieme le nostre passioni, con determinazione e impegno.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Nel mio lavoro unisco il sapere artigiano a strumenti e servizi di ultima generazione, per rispondere a ogni esigenza. È la <strong className="font-medium text-fg">meticolosa attenzione ai dettagli</strong> a fare la differenza: non mi limito a riparare, ma cerco di risvegliare la bellezza originale e il fascino di ogni orologio di lusso che mi viene affidato.
              </p>
            </Reveal>
            <Reveal delay={0.15} className="flex flex-wrap gap-4 pt-4">
              <Link href="/servizi" className="btn btn-solid">I miei servizi</Link>
              <Link href="/contatti" className="btn">Contattami</Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
