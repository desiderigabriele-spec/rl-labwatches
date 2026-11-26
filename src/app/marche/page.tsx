import Link from "next/link";
import Reveal from "@/components/Reveal";
import { DarkHero, EndCta } from "@/components/pages/Bits";
import { brands } from "@/data/brands";
import { whatsappLink } from "@/data/site";
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
      <DarkHero
        eyebrow="Le marche del mio banco"
        title={
          <>
            Ogni maison ha i suoi segreti. <em className="text-gold-3">Li conosco a memoria.</em>
          </>
        }
        intro="Calibri, finiture, tolleranze: ogni casa orologiera ha le sue. Questi sono i marchi che passano più spesso sul mio banco, ma lavoro su tutti i movimenti di qualità."
        crumbs={[{ name: "Marche", path: "/marche" }]}
      />
      <section className="guilloche relative bg-[#0b100d] pb-20 text-cream">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
          {brands.map((b, i) => (
            <Reveal key={b.slug} delay={(i % 3) * 0.06} className="h-full">
              <article className="flex h-full flex-col rounded-2xl border border-gold-3/20 bg-cream/[0.03] p-6">
                {b.vetrina && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/vetrina/fila/${b.slug}.webp`} alt={`Cofanetto ${b.name}`} width={840} height={1200} loading="lazy" decoding="async" className="mx-auto aspect-[840/1020] h-auto w-[70%] object-cover object-top" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/marche/chiaro/${b.slug}.webp`} alt={b.name} loading="lazy" className={`mx-auto mt-5 w-auto opacity-90 ${b.ratio > 3 ? "h-5" : "h-10"}`} style={{ aspectRatio: `${b.ratio}` }} />
                <h2 className="sr-only">Riparazione e restauro {b.name}</h2>
                <p className="mt-5 flex-1 text-[0.92rem] leading-relaxed text-cream/70">{b.text}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  <a href={whatsappLink(`Buongiorno Roberto, ho un ${b.name} da far vedere.`)} target="_blank" rel="noopener noreferrer" className="btn-gold !px-4 !py-2 text-[0.8rem]">
                    Ho un {b.name}
                  </a>
                  <Link href={`/shop/marca/${b.slug}`} className="btn-gold btn-gold-quiet !px-4 !py-2 text-[0.8rem]">
                    In vendita
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <EndCta
        title={<>Un&apos;altra <em className="text-gold">marca?</em></>}
        text="Lavoro su tutti i movimenti meccanici e automatici di qualità. Mandami una foto e ti dico subito."
        whatsapp="Buongiorno Roberto, ho un orologio di un'altra marca da far vedere."
      />
    </>
  );
}
