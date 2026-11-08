"use client";
import { animate, useInView, useMotionValue, useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { whatsappLink } from "@/data/site";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import { WhatsAppIcon } from "./WhatsAppButton";

const WORN = "/models/daytona-6239/quadrante-usurato.webp";
const NEW = "/models/daytona-6239/quadrante.webp";

const steps = [
  { n: "1", title: "Mi mandi una foto", text: "Su WhatsApp, anche dal telefono." },
  { n: "2", title: "Preventivo gratuito", text: "Ti dico cosa serve e quanto costa." },
  { n: "3", title: "Ritiro assicurato", text: "Lo restauro e te lo riconsegno, ovunque tu sia." },
];

/** Prima e dopo sul quadrante vero: la linea scorre da sola la prima volta, poi si trascina col dito */
export default function BeforeAfter() {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, amount: 0.5 });
  const pos = useMotionValue(50); // percentuale da sinistra: a sinistra il "prima"
  const [x, setX] = useState(50);
  const touched = useRef(false);
  useMotionValueEvent(pos, "change", setX);

  useEffect(() => {
    if (!inView || touched.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = animate(pos, [50, 88, 12, 50], { duration: 4.2, ease: "easeInOut" });
    return () => a.stop();
  }, [inView, pos]);

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
          className="relative mx-auto aspect-square w-full max-w-[min(100%,34rem)] cursor-ew-resize touch-pan-y select-none"
          onPointerDown={(e) => {
            (e.target as Element).setPointerCapture?.(e.pointerId);
            drag(e);
          }}
          onPointerMove={(e) => e.buttons && drag(e)}
          role="img"
          aria-label="Quadrante del Daytona 6239 prima e dopo il restauro"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={NEW} alt="" draggable={false} className="absolute inset-[6%] h-[88%] w-[88%] rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.18)]" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={WORN} alt="" draggable={false} className="absolute inset-[6%] h-[88%] w-[88%] rounded-full" style={{ clipPath: `inset(0 ${100 - ((x - 6) / 88) * 100}% 0 0)` }} />
          <span aria-hidden className="absolute bottom-0 top-0 w-px bg-fg" style={{ left: `${x}%` }}>
            <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-fg text-paper shadow-lg">↔</span>
          </span>
          <span aria-hidden className="absolute left-0 top-0 font-display text-3xl text-[#8a7350] sm:text-5xl" style={{ opacity: 0.35 + 0.65 * Math.min(1, x / 50) }}>
            Prima
          </span>
          <span aria-hidden className="absolute right-0 top-0 font-display text-3xl text-green sm:text-5xl" style={{ opacity: 0.35 + 0.65 * Math.min(1, (100 - x) / 50) }}>
            Dopo
          </span>
        </div>

        <div>
          <Reveal>
            <p className="eyebrow">Prima e dopo</p>
          </Reveal>
          <SplitText as="h2" id="prima-dopo" text="Com'era. *Com'è tornato.*" className="mt-4 block font-display text-4xl font-light leading-tight sm:text-6xl" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md leading-relaxed text-mute">
              Un quadrante originale del 1968, ripulito senza perdere la sua storia. Trascina la linea per vedere la differenza.
            </p>
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
