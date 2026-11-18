"use client";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useRef } from "react";
import { CHAPTERS, CH_LEN, CH_START, workOf } from "./chapters";

const clamp = (x: number) => Math.min(1, Math.max(0, x));
/** tutti i verbi hanno la stessa altezza: quella che fa stare nello schermo il più lungo (RICOSTRUIRE) */
const LONGEST = Math.max(...CHAPTERS.map((c) => c.verb.length));

/**
 * Il verbo gigante dietro al pezzo (LAVARE, PULIRE, RICOSTRUIRE…): inciso nella carta, si riempie d'oro
 * lucido mentre il lavoro avanza ("oro colato"). Tutti i verbi hanno la stessa grandezza, quella del più lungo.
 */
export default function VerbBackdrop({ progress }: { progress: MotionValue<number> }) {
  const box = useRef<HTMLDivElement>(null);
  const outline = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLSpanElement>(null);
  const last = useRef(-1);

  useMotionValueEvent(progress, "change", (v) => {
    const raw = (v - CH_START) / CH_LEN;
    const i = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor(raw)));
    const local = raw - i;
    const inRange = raw >= 0 && raw < CHAPTERS.length;
    if (i !== last.current && outline.current && fill.current && box.current) {
      last.current = i;
      const w = CHAPTERS[i].verb;
      outline.current.textContent = fill.current.textContent = w;
    }
    if (box.current) box.current.style.opacity = inRange ? String(Math.min(1, local / 0.06, (1 - local) / 0.06)) : "0";
    if (fill.current) {
      // l'oro avanza con un bordo morbido, come metallo fuso che riempie l'incisione
      const x = clamp(workOf(local)) * 118 - 9;
      const m = `linear-gradient(90deg, #000 ${x - 9}%, transparent ${x + 9}%)`;
      fill.current.style.maskImage = m;
      fill.current.style.setProperty("-webkit-mask-image", m);
    }
  });

  return (
    <div ref={box} aria-hidden className="verb-backdrop pointer-events-none w-full shrink-0 select-none" style={{ opacity: 0, ["--len" as string]: LONGEST }}>
      <div className="verb-line">
        <span ref={outline} className="verb-word verb-outline">
          {CHAPTERS[0].verb}
        </span>
        <span ref={fill} className="verb-word verb-fill" aria-hidden>
          {CHAPTERS[0].verb}
        </span>
      </div>
    </div>
  );
}
