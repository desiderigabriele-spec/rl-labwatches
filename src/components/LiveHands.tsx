"use client";
import { useEffect, useRef } from "react";

/**
 * Lancette disegnate sopra la foto di un quadrante senza lancette, che segnano l'ora reale.
 * Coordinate: viewBox -1..1, raggio 1 = bordo interno della lunetta, perno al centro.
 * La lancetta dei secondi scatta come il calibro vero (8 volte al secondo per i Rolex a 28.800 alternanze).
 */
export type HandStyle = "submariner";

const STEEL = "url(#lh-steel)";
const LUME = "#f2eee2";

function Submariner({ hour, minute, second }: { hour: React.Ref<SVGGElement>; minute: React.Ref<SVGGElement>; second: React.Ref<SVGGElement> }) {
  return (
    <>
      {/* ore: "Mercedes" */}
      <g ref={hour}>
        <rect x={-0.035} y={-0.27} width={0.07} height={0.33} fill={STEEL} />
        <circle cy={-0.37} r={0.105} fill={LUME} stroke="#dfe2e6" strokeWidth={0.03} />
        <path d="M0 -0.37 V-0.475 M0 -0.37 L0.09 -0.318 M0 -0.37 L-0.09 -0.318" stroke="#dfe2e6" strokeWidth={0.026} />
        <path d="M-0.05 -0.465 L0 -0.56 L0.05 -0.465 Z" fill={LUME} stroke="#dfe2e6" strokeWidth={0.02} />
      </g>
      {/* minuti: a spada */}
      <g ref={minute}>
        <path d="M-0.04 0.06 L-0.045 -0.6 L0 -0.8 L0.045 -0.6 L0.04 0.06 Z" fill={STEEL} />
        <path d="M-0.022 -0.12 L-0.026 -0.6 L0 -0.72 L0.026 -0.6 L0.022 -0.12 Z" fill={LUME} />
      </g>
      {/* secondi: con il punto luminoso */}
      <g ref={second}>
        <rect x={-0.011} y={-0.84} width={0.022} height={1.06} fill={STEEL} />
        <circle cy={-0.6} r={0.052} fill={LUME} stroke="#dfe2e6" strokeWidth={0.02} />
      </g>
    </>
  );
}

export default function LiveHands({ style, run, beats = 8 }: { style: HandStyle; run: boolean; beats?: number }) {
  const hour = useRef<SVGGElement>(null);
  const minute = useRef<SVGGElement>(null);
  const second = useRef<SVGGElement>(null);

  useEffect(() => {
    const set = () => {
      const now = new Date();
      const s = now.getSeconds() + Math.floor((now.getMilliseconds() / 1000) * beats) / beats;
      const m = now.getMinutes() + now.getSeconds() / 60;
      const h = (now.getHours() % 12) + m / 60;
      hour.current?.setAttribute("transform", `rotate(${h * 30})`);
      minute.current?.setAttribute("transform", `rotate(${m * 6})`);
      second.current?.setAttribute("transform", `rotate(${s * 6})`);
    };
    set();
    if (!run) return;
    let raf = 0;
    const tick = () => {
      set();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [run, beats]);

  return (
    <svg viewBox="-1 -1 2 2" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="lh-steel" x1="0" x2="1">
          <stop offset="0" stopColor="#9aa0a6" />
          <stop offset="0.5" stopColor="#f6f7f8" />
          <stop offset="1" stopColor="#8c9196" />
        </linearGradient>
      </defs>
      <g style={{ filter: "drop-shadow(0.02px 0.04px 0.025px rgba(0,0,0,0.55))" }}>
        {style === "submariner" && <Submariner hour={hour} minute={minute} second={second} />}
        <circle r={0.055} fill={STEEL} stroke="rgba(0,0,0,0.35)" strokeWidth={0.01} />
      </g>
    </svg>
  );
}
