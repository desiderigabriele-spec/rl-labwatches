"use client";
import dynamic from "next/dynamic";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import useOnScreen from "@/lib/useOnScreen";
import { useEffect, useRef, useState } from "react";
import RestorationStage from "./restauro/RestorationStage";
import { ARRIVE_END, CHAPTERS, CH_LEN, CH_START, FINAL_START } from "./restauro/chapters";

const WorkshopScene = dynamic(() => import("./restauro/WorkshopScene"), { ssr: false });

// i passaggi seguono i tempi di restauro/chapters.ts (con un piccolo stacco tra uno e l'altro)
const steps = [
  { range: [0, ARRIVE_END], title: "Arriva in laboratorio", text: "Graffi, sporco, un vetro ingiallito dal tempo. È fermo da anni, ma ha ancora molto da raccontare." },
  ...CHAPTERS.map((c, i) => ({ range: [CH_START + i * CH_LEN + 0.004, CH_START + (i + 1) * CH_LEN - 0.006], title: c.title, text: c.text })),
  { range: [FINAL_START, 1], title: "Torna a battere", text: "Rimontato, regolato e collaudato: pronto a misurare il tempo per altre generazioni." },
];

function Step({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const [a, b] = steps[i].range;
  const first = i === 0, last = i === steps.length - 1;
  // dissolvenze brevi: un passaggio esce prima che entri il successivo
  const input = [Math.max(0, a - 0.005), a + 0.012, b - 0.012, Math.min(1, b + 0.005)];
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
  // il 3D si vede all'arrivo e alla fine, il banco di lavoro nel mezzo
  const show3d = useTransform(scrollYProgress, [0, ARRIVE_END, CH_START, FINAL_START - 0.01, FINAL_START + 0.01, 1], [1, 1, 0, 0, 1, 1]);
  const [threeOn, setThreeOn] = useState(true);
  useMotionValueEvent(show3d, "change", (v) => setThreeOn(v > 0.01));

  // si carica quando la sezione è vicina e si ferma quando esce dallo schermo
  const near = useOnScreen(ref, "800px 0px");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (near) setLoaded(true);
  }, [near]);

  return (
    <section ref={ref} className="relative h-[620vh] border-y border-line bg-paper-2 lg:h-[840vh]" aria-label="Il restauro, passo dopo passo">
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
          <div className="relative order-1 min-h-0 lg:order-2">
            {/* lampada sul banco */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,rgba(255,236,196,0.55),transparent_70%)]" />
            <motion.div style={{ opacity: show3d }} className="absolute inset-0">
              {loaded && <WorkshopScene progress={scrollYProgress} active={near && threeOn} />}
            </motion.div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-2 sm:p-6">
              <RestorationStage progress={scrollYProgress} active={loaded && near} />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-line">
          <motion.div style={{ width: bar }} className="h-full bg-gold" />
        </div>
      </div>
    </section>
  );
}
