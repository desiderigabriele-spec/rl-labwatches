"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

// Ingranaggio decorativo che ruota con lo scroll
export default function Gear({ className = "", teeth = 24, reverse = false }: { className?: string; teeth?: number; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], reverse ? [180, -180] : [-180, 180]);

  const r = 46;
  const path = Array.from({ length: teeth }, (_, i) => {
    const a0 = (i / teeth) * Math.PI * 2;
    const a1 = a0 + (Math.PI / teeth) * 0.55;
    const a2 = a0 + (Math.PI / teeth) * 1.0;
    const a3 = a0 + (Math.PI / teeth) * 1.55;
    // coordinate arrotondate: server e browser calcolano seno e coseno con ultime cifre diverse
    const p = (a: number, rr: number) => `${(50 + Math.sin(a) * rr).toFixed(2)},${(50 - Math.cos(a) * rr).toFixed(2)}`;
    return `${i === 0 ? "M" : "L"}${p(a0, r - 5)} L${p(a1, r)} L${p(a2, r)} L${p(a3, r - 5)}`;
  }).join(" ");

  return (
    <motion.div ref={ref} style={{ rotate }} className={`pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 100 100" className="h-full w-full">
        <path d={`${path} Z`} fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="6" fill="none" stroke="currentColor" strokeWidth="0.4" />
        {Array.from({ length: 5 }, (_, i) => {
          const a = (i / 5) * Math.PI * 2;
          return (
            <line key={i} x1={(50 + Math.sin(a) * 6).toFixed(2)} y1={(50 - Math.cos(a) * 6).toFixed(2)} x2={(50 + Math.sin(a) * 30).toFixed(2)} y2={(50 - Math.cos(a) * 30).toFixed(2)} stroke="currentColor" strokeWidth="0.4" />
          );
        })}
      </svg>
    </motion.div>
  );
}
