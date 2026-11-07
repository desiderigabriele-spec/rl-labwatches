import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { services } from "@/data/services";

export const metadata: Metadata = { title: "Servizi", description: "Revisione, restauro, riparazione e lucidatura di orologi a Pistoia." };

export default function ServiziPage() {
  return (
    <>
      <PageHero eyebrow="Servizi" title="Cura artigianale, dal movimento alla cassa." intro="Ogni intervento parte da una diagnosi accurata e viene eseguito a mano nel nostro laboratorio di Pistoia." />
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-8">
        {services.map((s, i) => (
          <Reveal key={s.slug}>
            <article id={s.slug} className="grid gap-8 border-b border-line py-14 md:grid-cols-[120px_1fr_1fr]">
              <p className="font-display text-5xl font-light text-gold/70">0{i + 1}</p>
              <div>
                <h2 className="font-display text-4xl">{s.title}</h2>
                <p className="mt-4 max-w-md leading-relaxed text-mute">{s.summary}</p>
              </div>
              <ul className="space-y-3 self-center">
                {s.details.map((d) => (
                  <li key={d} className="flex items-center gap-4 text-ivory/85">
                    <span className="h-px w-6 bg-gold" />
                    {d}
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
        <Reveal className="mt-20 text-center">
          <Link href="/contatti" className="btn btn-solid">Richiedi un preventivo</Link>
        </Reveal>
      </section>
    </>
  );
}
