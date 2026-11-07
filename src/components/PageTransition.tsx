"use client";
import { usePathname } from "next/navigation";
import { animate, motion, useMotionTemplate, useMotionValue, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Transizione tra le pagine "a lancetta": al cambio di pagina un velo verde copre lo schermo
 * e una lancetta d'oro, facendo un giro completo, lo spazza via scoprendo la pagina nuova.
 * Non compare al primo caricamento (c'è l'intro col logo) né con "riduci movimento".
 */
export default function PageTransition() {
  const pathname = usePathname();
  const first = useRef(true);
  const [on, setOn] = useState(false);
  const sweep = useMotionValue(0);
  const mask = useMotionTemplate`conic-gradient(transparent ${sweep}deg, #000 ${sweep}deg)`;
  const handRotate = useTransform(sweep, (v) => `${180 + v}deg`);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    sweep.set(0);
    setOn(true);
    const c = animate(sweep, 360, { duration: 0.95, ease: [0.65, 0, 0.25, 1], delay: 0.08, onComplete: () => setOn(false) });
    return () => c.stop();
  }, [pathname, sweep]);

  if (!on) return null;
  return (
    <motion.div
      aria-hidden
      className="guilloche pointer-events-none fixed inset-0 z-[65] bg-green-2"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {/* lancetta: perno al centro dello schermo */}
      <motion.div className="absolute left-1/2 top-1/2 h-[75vmax] w-[2px] origin-top -translate-x-1/2" style={{ rotate: handRotate }}>
        <div className="h-full w-full bg-gradient-to-b from-gold-3 via-gold-3/70 to-transparent" />
      </motion.div>
      <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold-3 bg-green-2" />
    </motion.div>
  );
}
