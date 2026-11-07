import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { brands } from "@/data/brands";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Marche: Rolex, Patek Philippe, Audemars Piguet",
  description:
    "Riparazione e restauro di orologi Rolex, Patek Philippe, Audemars Piguet, Cartier, Tudor e Omega a Pistoia. Servizio su misura per ogni grande marchio.",
  path: "/marche",
});

export default function MarchePage() {
  return (
    <>
      <PageHero
        eyebrow="Specializzato nei migliori marchi internazionali"
        title="Riparazione e restauro di *orologi di lusso*"
        intro={
          <>
            <p>Ogni Maison ha i suoi segreti: calibri, finiture, tolleranze. La mia esperienza mi permette di intervenire con sicurezza sui modelli di tutte le principali case orologiere.</p>
            <p className="mt-4">Questi sono i marchi che passano più spesso sul mio banco di lavoro.</p>
          </>
        }
        crumbs={[{ name: "Marche", path: "/marche" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        <div className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {brands.map((b, i) => (
            <Reveal key={b.name} delay={(i % 2) * 0.08} className="h-full">
              <article className="h-full bg-paper p-8 sm:p-12">
                <h2 className="font-display text-4xl font-light tracking-wide sm:text-5xl">{b.name}</h2>
                <span className="mt-5 block h-px w-12 bg-gold-2" />
                <p className="mt-6 leading-relaxed text-mute">{b.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-16 text-center">
          <p className="text-mute">Il tuo orologio è di un altro marchio? Lavoro su modelli di tutte le principali case orologiere.</p>
          <Link href="/preventivo" className="btn btn-solid mt-6">Richiedi un preventivo</Link>
        </Reveal>
      </section>
    </>
  );
}
