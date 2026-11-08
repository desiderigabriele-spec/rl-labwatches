"use client";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import { useRef } from "react";
import { CHAPTERS, CH_LEN, CH_START, workOf } from "./chapters";

const clamp = (x: number) => Math.min(1, Math.max(0, x));

/**
 * Il verbo gigante dietro al pezzo (LAVARE, PULIRE, RICOSTRUIRE…): il contorno si riempie d'oro
 * mentre il lavoro avanza. La dimensione si adatta alla lunghezza della parola.
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
      box.current.style.setProperty("--len", String(w.length));
    }
    if (box.current) box.current.style.opacity = inRange ? String(Math.min(1, local / 0.06, (1 - local) / 0.06)) : "0";
    if (fill.current) fill.current.style.clipPath = `inset(0 ${100 - clamp(workOf(local)) * 100}% 0 0)`;
  });

  return (
    <div ref={box} aria-hidden className="verb-backdrop pointer-events-none w-full shrink-0 select-none" style={{ opacity: 0, ["--len" as string]: CHAPTERS[0].verb.length }}>
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
