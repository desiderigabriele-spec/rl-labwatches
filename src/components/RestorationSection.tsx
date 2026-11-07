"use client";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";

const RestorationScene = dynamic(() => import("./RestorationScene"), { ssr: false });

const steps = [
  { range: [0, 0.13], title: "Arriva in laboratorio", text: "Graffi, sporco, un vetro ingiallito dal tempo. È fermo da anni, ma ha ancora molto da raccontare." },
  { range: [0.16, 0.34], title: "Lo smonto", text: "Ogni componente viene separato, pulito e ispezionato. Nulla sfugge allo sguardo." },
  { range: [0.37, 0.59], title: "Lo restauro", text: "Lucidatura e satinatura della cassa, recupero del quadrante, revisione del movimento." },
  { range: [0.62, 0.8], title: "Lo rimonto", text: "Pezzo dopo pezzo, con la lubrificazione e la regolazione che il movimento richiede." },
  { range: [0.84, 1], title: "Torna a battere", text: "Collaudato e pronto a misurare il tempo per altre generazioni." },
] as const;

function Step({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const [a, b] = steps[i].range;
  const first = i === 0, last = i === steps.length - 1;
  // gli offset devono restare tra 0 e 1 (animazioni accelerate dallo scroll del browser)
  const input = [Math.max(0, a - 0.03), a + 0.01, b - 0.01, Math.min(1, b + 0.03)];
  const opacity = useTransform(progress, input, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, input, [first ? 0 : 24, 0, 0, last ? 0 : -24]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
      <p className="font-display text-lg text-gold">0{i + 1} / 0{steps.length}</p>
      <h3 className="mt-2 font-display text-4xl font-light sm:text-5xl lg:text-6xl">{steps[i].title}</h3>
      <p className="mt-4 max-w-sm leading-relaxed text-mute">{steps[i].text}</p>
    </motion.div>
  );
}

export default function RestorationSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[520vh] border-y border-line bg-paper-2" aria-label="Il restauro, passo dopo passo">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-8">
          <p className="eyebrow">Il restauro, passo dopo passo</p>
        </div>
        <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-rows-[1fr_auto] px-4 pb-10 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-1">
          <div className="relative order-2 h-44 lg:order-1 lg:h-auto">
            {steps.map((_, i) => (
              <Step key={i} i={i} progress={scrollYProgress} />
            ))}
          </div>
          <div className="order-1 min-h-0 lg:order-2">
            <RestorationScene progress={scrollYProgress} />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-line">
          <motion.div style={{ width: bar }} className="h-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
