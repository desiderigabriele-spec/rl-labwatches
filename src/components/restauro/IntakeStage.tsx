"use client";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { DEFECTS, DIAL_WORN, INTAKE_END } from "./chapters";

/** soglia (in avanzamento della sezione) a cui compare il difetto i */
export const defectAt = (i: number) => INTAKE_END * (0.32 + i * 0.12);

/** Arrivo in laboratorio: la foto vera del quadrante, una luce che lo scansiona e i difetti segnati uno a uno */
export default function IntakeStage({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, INTAKE_END - 0.012, INTAKE_END], [1, 1, 0]);
  const scanTop = useTransform(progress, [0, INTAKE_END * 0.32], ["0%", "100%"]);
  const scanOpacity = useTransform(progress, [0, 0.004, INTAKE_END * 0.3, INTAKE_END * 0.32], [0, 1, 1, 0]);
  const pins = useRef<(HTMLSpanElement | null)[]>([]);
  const stamp = useRef<HTMLSpanElement>(null);
  useMotionValueEvent(progress, "change", (v) => {
    pins.current.forEach((el, i) => el?.classList.toggle("is-on", v > defectAt(i)));
    stamp.current?.classList.toggle("is-on", v > INTAKE_END * 0.88);
  });

  return (
    <motion.div style={{ opacity }} className="pointer-events-none absolute inset-0 p-2 sm:p-6">
      {/* il quadrante si adatta al lato più corto dello spazio disponibile */}
      <div className="flex h-full w-full items-center justify-center" style={{ containerType: "size" }}>
      <div className="relative aspect-square" style={{ width: "min(100cqw, 100cqh)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DIAL_WORN} alt="Quadrante del Daytona 6239 com'è arrivato in laboratorio" className="h-full w-full rounded-full shadow-[0_30px_60px_rgba(0,0,0,0.18)]" />
        <motion.span
          aria-hidden
          style={{ top: scanTop, opacity: scanOpacity }}
          className="absolute -inset-x-[4%] h-[3px] bg-[linear-gradient(90deg,transparent,rgba(255,236,190,0.95),transparent)] shadow-[0_0_18px_6px_rgba(255,226,160,0.5)]"
        />
        {DEFECTS.map((d, i) => (
          <span
            key={i}
            ref={(el) => {
              pins.current[i] = el;
            }}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            className="defect-pin"
          >
            {i + 1}
            <span className={`defect-label ${d.side === "left" ? "is-left" : ""}`}>{d.short}</span>
          </span>
        ))}
        <span ref={stamp} className="intake-stamp">
          Preso in carico
        </span>
      </div>
      </div>
    </motion.div>
  );
}
