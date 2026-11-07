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
      <PageHero eyebrow="Chi sono" title="Roberto Landi" intro="Artigiano di orologi di lusso a Pistoia." crumbs={[{ name: "Chi sono", path: "/chi-sono" }]} />
      <section className="relative overflow-hidden">
        <Gear className="absolute -right-48 top-10 h-[560px] w-[560px] text-gold/10" teeth={30} />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-24 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden bg-fg">
              <Image src="/images/roberto-landi-artigiano-orologi-pistoia.jpg" alt="Roberto Landi, artigiano orologiaio a Pistoia" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <div className="space-y-6 text-lg leading-relaxed text-mute">
            <Reveal>
              <p>
                Nato a <strong className="font-medium text-fg">Pistoia</strong>, ho ereditato la <strong className="font-medium text-fg">passione per l&apos;artigianato</strong> e la cura per i dettagli da mio padre, un abile restauratore ed intarsiatore del legno. Questa dote naturale per la manualità, combinata con la mia innata creatività, mi ha guidato verso la scelta di un percorso di studi al Liceo Artistico, con un focus particolare sull&apos;arte dei metalli.
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p>
                Tuttavia, la mia vera passione è sempre stata l&apos;<strong className="font-medium text-fg">orologeria</strong>. Fortunatamente, ho avuto lo zio orologiaio che ha rivelato la mia vocazione. Le varie circostanze della vita mi hanno in seguito riunito con un vecchio amico d&apos;infanzia, che nel corso di oltre un decennio ha costruito un negozio di compravendita di orologi di grande importanza a livello nazionale. Oggi, insieme, stiamo portando avanti le nostre passioni con determinazione e impegno.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Incorporiamo servizi innovativi e di ultima generazione nel nostro lavoro, soddisfacendo qualsiasi desiderio che un cliente possa avere. La nostra <strong className="font-medium text-fg">meticolosa attenzione ai dettagli</strong> ci distingue nel settore, permettendoci di offrire un servizio che va oltre le semplici riparazioni, ma che mira a risvegliare la bellezza originale e il fascino di ogni orologio di lusso.
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
