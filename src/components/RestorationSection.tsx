"use client";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "motion/react";
import useOnScreen from "@/lib/useOnScreen";
import { useEffect, useRef, useState } from "react";
import RestorationStage from "./restauro/RestorationStage";
import IntakeStage, { defectAt } from "./restauro/IntakeStage";
import VerbBackdrop from "./restauro/VerbBackdrop";
import { CHAPTERS, CH_LEN, CH_START, DEFECTS, FINAL_START, INTAKE_END } from "./restauro/chapters";
import FinalWatch from "./restauro/FinalWatch";


// i passaggi seguono i tempi di restauro/chapters.ts (con un piccolo stacco tra uno e l'altro)
const steps = [
  { range: [0, INTAKE_END - 0.006], title: "Com'è arrivato", text: "Fermo da anni. Prima di toccarlo lo guardo sotto la lente e segno ogni difetto." },
  ...CHAPTERS.map((c, i) => ({ range: [CH_START + i * CH_LEN + 0.004, CH_START + (i + 1) * CH_LEN - 0.006], title: c.title, text: c.text })),
  { range: [FINAL_START, 1], title: "Torna a battere", text: "Rimontato, regolato e collaudato: pronto per altre generazioni." },
];
const pad = (n: number) => String(n).padStart(2, "0");

function Defect({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [defectAt(i) - 0.002, defectAt(i) + 0.004], [0.2, 1]);
  return (
    <motion.li style={{ opacity }} className="grid grid-cols-[1.4rem_1fr] items-baseline gap-1 sm:grid-cols-[2rem_1fr] sm:gap-2">
      <span className="font-mono text-xs font-semibold text-[#b8321f]">{pad(i + 1)}</span>
      <span>{DEFECTS[i].text}</span>
    </motion.li>
  );
}

function Step({ i, progress }: { i: number; progress: MotionValue<number> }) {
  const [a, b] = steps[i].range;
  const first = i === 0, last = i === steps.length - 1;
  // dissolvenze brevi: un passaggio esce prima che entri il successivo
  const input = [Math.max(0, a - 0.005), a + 0.012, b - 0.012, Math.min(1, b + 0.005)];
  const opacity = useTransform(progress, input, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(progress, input, [first ? 0 : 24, 0, 0, last ? 0 : -24]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:-translate-y-1/2">
      <p className="font-display text-lg text-gold">
        {pad(i + 1)} / {pad(steps.length)}
      </p>
      <h3 className={`mt-1 font-display text-4xl font-light sm:text-5xl lg:text-6xl ${first ? "lg:text-7xl" : ""}`}>
        {first ? (
          <>
            Com&apos;è <em className="text-[#b8321f]">arrivato</em>
          </>
        ) : (
          steps[i].title
        )}
      </h3>
      <p className={`mt-2 max-w-sm text-[0.95rem] leading-snug text-mute sm:text-base sm:leading-relaxed lg:mt-4 ${first ? "hidden sm:block" : ""}`}>{steps[i].text}</p>
      {first && (
        <ol className="mt-3 grid max-w-md grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:mt-5 sm:text-sm lg:grid-cols-1 lg:gap-2">
          {DEFECTS.map((_, k) => (
            <Defect key={k} i={k} progress={progress} />
          ))}
        </ol>
      )}
    </motion.div>
  );
}

export default function RestorationSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  // alla fine compare l'orologio restaurato
  const showDone = useTransform(scrollYProgress, [FINAL_START - 0.012, FINAL_START + 0.008], [0, 1]);
  const doneScale = useTransform(scrollYProgress, [FINAL_START - 0.012, 1], [0.92, 1.04]);
  // le lancette girano solo quando l'orologio finale è visibile
  const [finalOn, setFinalOn] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setFinalOn(v > FINAL_START - 0.015));

  // si carica quando la sezione è vicina e si ferma quando esce dallo schermo
  const near = useOnScreen(ref, "800px 0px");
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (near) setLoaded(true);
  }, [near]);

  return (
    <section ref={ref} className="relative h-[720vh] border-y border-line bg-paper-2 lg:h-[980vh]" aria-label="Il restauro, passo dopo passo">
      <div className="sticky top-0 flex h-dvh flex-col overflow-hidden">
        <div className="mx-auto w-full max-w-7xl px-4 pt-24 sm:px-8">
          <p className="eyebrow">Il restauro, passo dopo passo</p>
        </div>
        <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-rows-[1fr_auto] px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] sm:px-8 lg:pb-10 lg:grid-cols-[0.8fr_1.2fr] lg:grid-rows-1">
          <div className="relative order-2 h-52 lg:order-1 lg:h-auto">
            {steps.map((_, i) => (
              <Step key={i} i={i} progress={scrollYProgress} />
            ))}
          </div>
          <div className="relative order-1 min-h-0 lg:order-2">
            {/* lampada sul banco */}
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_50%,rgba(255,236,196,0.55),transparent_70%)]" />
            <VerbBackdrop progress={scrollYProgress} />
            <IntakeStage progress={scrollYProgress} />
            <motion.div style={{ opacity: showDone }} className="pointer-events-none absolute inset-0 p-2 sm:p-6">
              <div className="flex h-full w-full items-center justify-center" style={{ containerType: "size" }}>
                <motion.div style={{ scale: doneScale, width: "min(100cqw, 100cqh)" }} className="watch-done relative aspect-square">
                  <FinalWatch active={finalOn && near} />
                </motion.div>
              </div>
            </motion.div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 pb-1 pt-[24%] sm:p-6 sm:pt-[14%]">
              <div className="flex h-full w-full items-center justify-center" style={{ containerType: "size" }}>
                <RestorationStage progress={scrollYProgress} active={loaded && near} />
              </div>
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
