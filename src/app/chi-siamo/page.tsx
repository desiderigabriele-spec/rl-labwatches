import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Gear from "@/components/Gear";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Chi siamo", description: `${site.owner}, artigiano orologiaio a Pistoia.` };

const values = [
  { title: "Rispetto dell'originale", text: "Interveniamo preservando l'autenticità di ogni orologio, soprattutto sui pezzi d'epoca." },
  { title: "Trasparenza", text: "Diagnosi chiara, preventivo prima di ogni intervento e documentazione del lavoro svolto." },
  { title: "Precisione", text: "Strumenti professionali e controlli di marcia per restituire un orologio affidabile." },
];

export default function ChiSiamoPage() {
  return (
    <>
      <PageHero eyebrow="Chi siamo" title={`${site.owner}, orologiaio.`} intro="Testo provvisorio: inserire qui la storia del laboratorio dal vecchio sito." />
      <section className="relative overflow-hidden">
        <Gear className="absolute -right-48 top-10 h-[560px] w-[560px] text-gold/10" teeth={30} />
        <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-24 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="font-display text-3xl font-light leading-snug sm:text-4xl">
              Un laboratorio a {site.address.city} dove gli orologi meccanici tornano a vivere, un componente alla volta.
            </p>
          </Reveal>
          <div className="space-y-10">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <h2 className="font-display text-2xl text-gold">{v.title}</h2>
                <p className="mt-3 leading-relaxed text-mute">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
