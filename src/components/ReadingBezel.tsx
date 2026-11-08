"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const R = 21;
const C = 2 * Math.PI * R;

/**
 * Ghiera di lettura: una piccola lunetta che si riempie mentre scorri la pagina.
 * Compare solo nelle pagine lunghe; toccandola torni in cima.
 *  - "floating": su computer, in basso a sinistra
 *  - "header":   su telefono, nell'intestazione accanto al menu, così non copre mai il testo
 */
export default function ReadingBezel({ variant = "floating" }: { variant?: "floating" | "header" }) {
  const pathname = usePathname();
  const [p, setP] = useState(0);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const long = max > window.innerHeight * 1.5;
      setShow(long && window.scrollY > 300);
      setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const toTop = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label={`Torna in cima (letto il ${Math.round(p * 100)}%)`}
      tabIndex={show ? 0 : -1}
      className={`${
        variant === "header"
          ? "relative grid h-10 w-10 lg:hidden"
          : "fixed bottom-6 left-6 z-40 hidden h-14 w-14 border border-line bg-paper/90 shadow-lg backdrop-blur lg:grid"
      } place-items-center rounded-full transition-all duration-500 ${show ? "opacity-100" : `pointer-events-none opacity-0 ${variant === "header" ? "scale-75" : "translate-y-3"}`}`}
    >
      <svg viewBox="0 0 48 48" className="absolute inset-0.5 -rotate-90" aria-hidden>
        <circle cx="24" cy="24" r={R} fill="none" className="stroke-line" strokeWidth="2" />
        {/* tacche dei minuti, come su una lunetta */}
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="24" y1="1.5" x2="24" y2="4.5" className="stroke-mute/50" strokeWidth="1" transform={`rotate(${i * 30} 24 24)`} />
        ))}
        <circle cx="24" cy="24" r={R} fill="none" className="stroke-gold-2" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
      </svg>
      <span className={`tag-mono relative text-fg ${variant === "header" ? "text-[0.62rem]" : "text-[0.7rem]"}`}>{p > 0.97 ? "↑" : `${Math.round(p * 100)}`}</span>
    </button>
  );
}
