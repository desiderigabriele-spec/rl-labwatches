"use client";
import { useEffect, useRef } from "react";

/**
 * L'orologio restaurato alla fine della sezione: foto frontale vera, con sopra il quadrante senza lancette
 * e lancette disegnate che segnano l'ora reale (i piccoli secondi a ore 9 scorrono come sul 6239).
 * Posizioni misurate sulle foto: quadrante centrato a (47.4%, 47.4%) con diametro 59.8% della foto.
 */
const PHOTO = "/models/daytona-6239/fronte.webp";
const DIAL = "/models/daytona-6239/quadrante.webp";
const DIAL_BOX = { left: 17.5, top: 17.5, size: 59.8 };
// in raggi del quadrante, y verso l'alto (come nel modello 3D)
const PIVOT = [0, 0.027] as const;
const SUB = { seconds: [-0.542, 0.0225], minutes: [0.54, 0.0225], hours: [0, -0.495] } as const;

/** lancetta a bastone in acciaio con inserto luminescente, punta in alto, perno in (0,0) */
function Baton({ len, w }: { len: number; w: number }) {
  return (
    <>
      <rect x={-w / 2} y={-len} width={w} height={len + 0.1} rx={w * 0.25} fill="url(#steel)" stroke="rgba(0,0,0,0.35)" strokeWidth={0.004} />
      <rect x={-w * 0.21} y={-len * 0.86} width={w * 0.42} height={len * 0.62} rx={w * 0.12} fill="#f1ead6" />
    </>
  );
}

export default function FinalWatch({ active }: { active: boolean }) {
  const hour = useRef<SVGGElement>(null);
  const minute = useRef<SVGGElement>(null);
  const second = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const tick = () => {
      const now = new Date();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;
      const m = now.getMinutes() + s / 60;
      const h = (now.getHours() % 12) + m / 60;
      hour.current?.setAttribute("transform", `rotate(${h * 30})`);
      minute.current?.setAttribute("transform", `rotate(${m * 6})`);
      second.current?.setAttribute("transform", `rotate(${s * 6})`);
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const at = (p: readonly [number, number]) => `translate(${p[0]} ${-p[1]})`;
  const sub = (len: number) => (
    <>
      <rect x={-0.011} y={-len} width={0.022} height={len + 0.07} rx={0.008} fill="#f4f1ea" />
      <circle r={0.024} fill="url(#steel)" />
    </>
  );

  return (
    <div className="relative aspect-square h-full w-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={PHOTO} alt="Il Daytona 6239 dopo il restauro" loading="lazy" className="absolute inset-0 h-full w-full mix-blend-multiply [mask-image:radial-gradient(circle,black_60%,transparent_71%)]" />
      <div
        className="absolute overflow-hidden rounded-full shadow-[inset_0_0_14px_rgba(0,0,0,0.45)]"
        style={{ left: `${DIAL_BOX.left}%`, top: `${DIAL_BOX.top}%`, width: `${DIAL_BOX.size}%`, height: `${DIAL_BOX.size}%` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={DIAL} alt="" aria-hidden className="h-full w-full" />
        <svg viewBox="-1 -1 2 2" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <linearGradient id="steel" x1="0" x2="1">
              <stop offset="0" stopColor="#9da1a6" />
              <stop offset="0.5" stopColor="#f4f5f6" />
              <stop offset="1" stopColor="#8a8e93" />
            </linearGradient>
            <radialGradient id="glass" cx="0.35" cy="0.25" r="0.9">
              <stop offset="0" stopColor="#ffffff" stopOpacity="0.32" />
              <stop offset="0.45" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>
          {/* contatori: piccoli secondi che scorrono, totalizzatori fermi a zero */}
          <g transform={at(SUB.seconds)}>
            <g ref={second}>{sub(0.25)}</g>
          </g>
          <g transform={at(SUB.minutes)}>{sub(0.25)}</g>
          <g transform={at(SUB.hours)}>{sub(0.25)}</g>
          <g transform={at(PIVOT)} style={{ filter: "drop-shadow(0.012px 0.02px 0.012px rgba(0,0,0,0.45))" }}>
            <g ref={hour}>
              <Baton len={0.5} w={0.058} />
            </g>
            <g ref={minute}>
              <Baton len={0.84} w={0.046} />
            </g>
            {/* lancetta del cronografo ferma a ore 12 */}
            <rect x={-0.006} y={-0.94} width={0.012} height={1.14} fill="#1f1f1f" />
            <path d="M -0.032 -0.86 L 0.032 -0.86 L 0 -0.95 Z" fill="#f1ead6" />
            <circle r={0.035} fill="url(#steel)" stroke="rgba(0,0,0,0.3)" strokeWidth={0.004} />
          </g>
          {/* riflesso del vetro bombato */}
          <circle r={1} fill="url(#glass)" />
        </svg>
      </div>
    </div>
  );
}
