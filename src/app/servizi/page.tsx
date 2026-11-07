import Image from "next/image";
import IrisReveal from "@/components/IrisReveal";
import Loupe from "@/components/Loupe";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { services } from "@/data/services";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Restauro e riparazione orologi di lusso",
  description:
    "Revisione, restauro estetico, sostituzione vetro, verifica d'autenticità, impermeabilità, ricambi, saldatura e rimagliatura del bracciale a Pistoia.",
  path: "/servizi",
});

export default function ServiziPage() {
  return (
    <>
      <PageHero
        eyebrow="I miei servizi"
        title="Cura artigianale, dal movimento al *bracciale.*"
        intro="Ogni orologio ha una storia e merita un intervento su misura. Dalla revisione del movimento al restauro della cassa, ogni passaggio è eseguito a mano nel mio laboratorio di Pistoia, con passione e precisione."
        crumbs={[{ name: "Servizi", path: "/servizi" }]}
      />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
        {services.map((s, i) => (
          <article id={s.slug} key={s.slug} className="scroll-mt-28 grid items-center gap-10 border-b border-line py-16 last:border-0 md:grid-cols-2 md:gap-16">
            <Reveal className={i % 2 ? "md:order-2" : ""}>
              <IrisReveal>
                <Loupe src={s.image} className="aspect-[4/3] overflow-hidden bg-paper-2">
                  <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                </Loupe>
              </IrisReveal>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="font-display text-xl text-gold">{String(i + 1).padStart(2, "0")}</p>
              <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">{s.title}</h2>
              <p className="mt-3 font-display text-xl italic text-gold">{s.tagline}</p>
              <p className="mt-5 max-w-lg leading-relaxed text-mute">{s.text}</p>
              <Link href={`/preventivo?servizio=${encodeURIComponent(s.title)}`} className="mt-8 inline-block text-sm uppercase tracking-[0.2em] text-green hover:text-gold">
                Richiedi un preventivo →
              </Link>
            </Reveal>
          </article>
        ))}
      </section>
    </>
  );
}
