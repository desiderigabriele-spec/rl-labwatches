"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import SplitText from "./SplitText";
import Reveal from "./Reveal";

function Card({ s, i }: { s: (typeof services)[number]; i: number }) {
  return (
    <Link href={`/servizi#${s.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-3">
        <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 34vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
        <span className="absolute left-5 top-5 bg-paper/90 px-3 py-1 font-display text-sm text-green">{String(i + 1).padStart(2, "0")}</span>
      </div>
      <h3 className="mt-6 font-display text-3xl transition-colors group-hover:text-gold">{s.title}</h3>
      <p className="mt-2 text-sm italic text-gold">{s.tagline}</p>
      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-mute">{s.text}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-green">
        Scopri <span className="transition-transform group-hover:translate-x-1">→</span>
      </span>
    </Link>
  );
}

const Heading = () => (
  <>
    <p className="eyebrow">I miei servizi</p>
    <SplitText as="h2" text="Tutto ciò di cui il tuo *orologio* ha bisogno" className="mt-4 block font-display text-4xl font-light leading-tight sm:text-6xl" />
    <p className="mt-6 max-w-md text-mute">Dalla revisione del movimento alla lucidatura della cassa, ogni intervento è eseguito a mano, con passione e precisione.</p>
    <Link href="/servizi" className="btn mt-8">Tutti i servizi</Link>
  </>
);

/** Servizi in home: su schermi grandi scorrono in orizzontale mentre si scende con la pagina */
export default function ServicesRail() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, (v) => -v * distance);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const measure = () => track.current && setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <>
      {/* schermi grandi: scorrimento orizzontale fissato */}
      <section ref={section} className="relative hidden border-t border-line bg-paper-2 lg:block" style={{ height: `calc(100vh + ${distance}px)` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          <motion.div ref={track} style={{ x }} className="flex w-max items-center gap-16 pl-[max(2rem,calc((100vw-80rem)/2+2rem))] pr-24">
            <div className="w-[26rem] shrink-0">
              <Heading />
            </div>
            {services.map((s, i) => (
              <div key={s.slug} className="w-[30rem] shrink-0">
                <Card s={s} i={i} />
              </div>
            ))}
          </motion.div>
          <div className="absolute bottom-10 left-1/2 h-px w-48 -translate-x-1/2 bg-line">
            <motion.div style={{ width: bar }} className="h-full bg-gold" />
          </div>
        </div>
      </section>

      {/* telefono e tablet: griglia */}
      <section className="border-t border-line bg-paper-2 py-24 lg:hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Heading />
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 2) * 0.08}>
                <Card s={s} i={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
