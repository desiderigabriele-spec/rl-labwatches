"use client";
import { animate, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/data/site";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import { WhatsAppIcon } from "./WhatsAppButton";

import { works } from "@/data/works";

const steps = [
  { n: "1", title: "Mi mandi una foto", text: "Su WhatsApp, anche dal telefono." },
  { n: "2", title: "Preventivo gratuito", text: "Ti dico cosa serve e quanto costa." },
  { n: "3", title: "Ritiro assicurato", text: "Lo restauro e te lo riconsegno, ovunque tu sia." },
];

/** Prima e dopo su lavori veri: la linea scorre da sola, si trascina col dito, sotto si sceglie il lavoro */
export default function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, amount: 0.5 });
  const pos = useMotionValue(50); // percentuale da sinistra: a sinistra il "prima"
  const [x, setX] = useState(50);
  const [i, setI] = useState(0);
  const w = works[i];
  const touched = useRef(false);
  useMotionValueEvent(pos, "change", setX);

  // a ogni lavoro (e all'ingresso) la linea mostra da sola prima e dopo
  useEffect(() => {
    if (!inView || touched.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(pos, [50, 88, 12, 50], { duration: 4.2, ease: "easeInOut" });
    return () => a.stop();
  }, [inView, pos, i]);
  const pick = (k: number) => {
    touched.current = false;
    setI(k);
  };

  const drag = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    touched.current = true;
    pos.stop();
    pos.set(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <section className="relative overflow-hidden py-16 sm:py-28" aria-labelledby="prima-dopo">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div
          ref={box}
          className="relative mx-auto aspect-square w-full min-w-0 max-w-[min(100%,34rem)] cursor-ew-resize touch-pan-y select-none"
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture?.(e.pointerId);
            drag(e);
          }}
          onPointerMove={(e) => e.buttons && drag(e)}
          role="img"
          aria-label={`${w.watch}: ${w.job}, prima e dopo`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={w.after} src={w.after} alt="" draggable={false} className={`absolute inset-[6%] h-[88%] w-[88%] object-cover shadow-[0_30px_60px_rgba(0,0,0,0.18)] ${w.round ? "rounded-full" : "rounded-2xl"}`} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img key={w.before} src={w.before} alt="" draggable={false} className={`absolute inset-[6%] h-[88%] w-[88%] object-cover ${w.round ? "rounded-full" : "rounded-2xl"}`} style={{ clipPath: `inset(0 ${Math.min(100, Math.max(0, 100 - ((x - 6) / 88) * 100))}% 0 0)` }} />
          {/* la linea resta dentro la foto */}
          <span aria-hidden className="absolute bottom-[6%] top-[6%] w-px bg-paper shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" style={{ left: `${Math.min(94, Math.max(6, x))}%` }}>
            <span className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-paper shadow-lg">↔</span>
          </span>
          {/* etichette piccole dentro la foto, in basso: non coprono il lavoro */}
          <span aria-hidden className="pointer-events-none absolute bottom-[9%] left-[9%] rounded-full bg-paper/85 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[#8a7350] shadow-sm backdrop-blur transition-opacity" style={{ opacity: x > 14 ? 1 : 0 }}>
            Prima
          </span>
          <span aria-hidden className="pointer-events-none absolute bottom-[9%] right-[9%] rounded-full bg-paper/85 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-green shadow-sm backdrop-blur transition-opacity" style={{ opacity: x < 86 ? 1 : 0 }}>
            Dopo
          </span>
        </div>

        <div className="min-w-0">
          <Reveal>
            <p className="eyebrow">Prima e dopo</p>
          </Reveal>
          <SplitText as="h2" id="prima-dopo" text="Com'era. *Com'è tornato.*" className="mt-4 block font-display text-4xl font-light leading-tight sm:text-6xl" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md leading-relaxed text-mute">
              Lavori veri del mio laboratorio. Trascina la linea per vedere la differenza.
            </p>
            {/* il lavoro mostrato */}
            <p className="mt-6 text-sm" aria-live="polite">
              <b className="font-semibold text-fg">{w.watch}</b>
              <span className="text-mute"> · {w.job}</span>
            </p>
            {/* i lavori: miniature tonde, si sceglie quale vedere */}
            <div className="-mx-4 mt-3 flex gap-2.5 overflow-x-auto px-4 pb-2 pt-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="Lavori">
              {works.map((wk, k) => (
                <button
                  key={wk.slug}
                  type="button"
                  role="tab"
                  aria-selected={k === i}
                  aria-label={`${wk.watch}: ${wk.job}`}
                  title={`${wk.watch} · ${wk.job}`}
                  onClick={() => pick(k)}
                  className={`h-12 w-12 shrink-0 overflow-hidden rounded-full ring-offset-2 ring-offset-paper transition ${k === i ? "ring-2 ring-gold-2" : "opacity-70 ring-1 ring-line hover:opacity-100"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={wk.after} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-display text-3xl leading-none text-gold">{s.n}</span>
                  <span className="text-sm leading-snug text-mute">
                    <b className="block font-semibold text-fg">{s.title}</b>
                    {s.text}
                  </span>
                </li>
              ))}
            </ol>
            <a
              href={whatsappLink("Buongiorno Roberto, le mando una foto del mio orologio per un preventivo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-8"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span>
                <b>Mandami una foto</b>
                <small>Preventivo gratuito su WhatsApp</small>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
