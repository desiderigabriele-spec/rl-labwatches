import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { DarkHero, EndCta, StepsBand } from "@/components/pages/Bits";
import ProblemPicker from "@/components/pages/ProblemPicker";
import { services } from "@/data/services";
import JsonLd from "@/components/JsonLd";
import { pageMeta, servicesLd } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Riparazione e restauro orologi a Pistoia",
  description:
    "Revisione del movimento, restauro di cassa e bracciale, vetro, impermeabilità e ricambi originali per orologi di lusso nel mio laboratorio di Pistoia.",
  path: "/servizi",
});

/** i servizi raccolti in tre famiglie: il movimento, cassa e bracciale, ricambi e vetro */
const FAMILIES = [
  { k: "Il movimento", d: "Il cuore dell'orologio: revisione, tenuta all'acqua, autenticità.", slugs: ["revisione-completa", "prova-impermeabilita", "verifica-autenticita"] },
  { k: "Cassa e bracciale", d: "L'aspetto originale, senza perdere linee e spigoli.", slugs: ["restauro-estetico", "saldatura-artigianale", "rimagliatura-bracciale"] },
  { k: "Ricambi e vetro", d: "Pezzi originali, anche difficili da trovare.", slugs: ["sostituzione-vetro", "ricambi"] },
];

export default function ServiziPage() {
  const bySlug = Object.fromEntries(services.map((s) => [s.slug, s]));
  const consegna = bySlug["consegna-e-ritiro"];
  return (
    <>
      <JsonLd data={servicesLd(services)} />
      <DarkHero
        h1="Riparazione e restauro di orologi di lusso a Pistoia"
        title={
          <>
            Ogni orologio lo apro io. <em className="text-gold-3">E lo richiudo meglio di prima.</em>
          </>
        }
        intro="Revisione, restauro e ricambi per Rolex, Patek Philippe, Audemars Piguet, Omega e gli altri grandi marchi. A mano, nel mio laboratorio, con garanzia di 12 mesi su ogni lavoro."
        image="/images/revisione-completa-movimento-rolex-daytona.jpg"
        alt="Movimento di un Rolex Daytona aperto sul banco durante la revisione"
        crumbs={[{ name: "Restauro", path: "/servizi" }]}
        whatsapp="Buongiorno Roberto, le mando una foto del mio orologio per un preventivo."
        cta={<Link href="/preventivo" className="btn-gold">Preventivo con le foto <span aria-hidden>→</span></Link>}
      />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="eyebrow">Da dove partiamo?</p>
          <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">
            Che cosa ha <em className="text-gold">il tuo orologio?</em>
          </h2>
        </Reveal>
        <Reveal delay={0.08} className="mt-8">
          <ProblemPicker />
        </Reveal>
      </section>

      {FAMILIES.map((f, fi) => (
        <section key={f.k} className={`border-t border-line ${fi % 2 ? "bg-paper-2" : ""}`}>
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
            <Reveal>
              <p className="eyebrow">{String(fi + 1).padStart(2, "0")} · {f.k}</p>
              <p className="mt-3 max-w-xl font-display text-2xl text-mute">{f.d}</p>
            </Reveal>
            <div className={`mt-10 grid gap-8 ${f.slugs.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {f.slugs.map((slug, i) => {
                const s = bySlug[slug];
                if (!s) return null;
                return (
                  <Reveal key={slug} delay={i * 0.06}>
                    <article id={slug} className="scroll-mt-28">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper-2">
                        <Image src={s.image} alt={s.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 hover:scale-[1.03]" />
                      </div>
                      <h3 className="mt-5 font-display text-3xl font-light">{s.title}</h3>
                      <p className="mt-1 font-display text-lg italic text-gold">{s.tagline}</p>
                      <p className="mt-3 text-base leading-relaxed text-mute">{s.text}</p>
                      <Link href={`/preventivo?servizio=${encodeURIComponent(s.title)}`} className="mt-2 inline-flex min-h-11 items-center text-sm uppercase tracking-[0.2em] text-green hover:text-gold">
                        Chiedi il preventivo →
                      </Link>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <StepsBand />

      {consegna && (
        <section id={consegna.slug} className="mx-auto grid max-w-7xl scroll-mt-28 items-center gap-10 px-4 py-16 sm:px-8 sm:py-20 md:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-paper-2">
              <Image src={consegna.image} alt={consegna.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="eyebrow">Da tutta Italia e dall&apos;estero</p>
            <h2 className="mt-3 font-display text-4xl font-light sm:text-5xl">{consegna.title}</h2>
            <p className="mt-2 font-display text-lg italic text-gold">{consegna.tagline}</p>
            <p className="mt-4 leading-relaxed text-mute">{consegna.text}</p>
          </Reveal>
        </section>
      )}

      <EndCta
        title={<>Mandami una foto, <em className="text-gold">ti dico io.</em></>}
        text="La prima valutazione e il preventivo sono gratuiti. Rispondo io, di persona."
        whatsapp="Buongiorno Roberto, le mando una foto del mio orologio per un preventivo."
      />
    </>
  );
}
