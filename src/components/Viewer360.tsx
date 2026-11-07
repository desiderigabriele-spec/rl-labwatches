"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Visualizzatore a 360°: una sequenza di foto scattate girando l'orologio
 * (consigliate 24–36, a intervalli regolari) che il visitatore ruota trascinando.
 * - mouse/dito: trascina a destra o sinistra · tastiera: frecce
 * - gira da solo lentamente finché il visitatore non lo tocca (non con "riduci movimento")
 */
export default function Viewer360({ frames, alt }: { frames: string[]; alt: string }) {
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [touched, setTouched] = useState(false);
  const drag = useRef<{ x: number; start: number } | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const n = frames.length;
  const ready = loaded >= n;

  // precarica tutti i fotogrammi, così la rotazione è fluida
  useEffect(() => {
    let alive = true;
    frames.forEach((src) => {
      const img = new Image();
      img.onload = img.onerror = () => alive && setLoaded((l) => l + 1);
      img.src = src;
    });
    return () => {
      alive = false;
    };
  }, [frames]);

  // rotazione automatica lenta
  useEffect(() => {
    if (!ready || touched || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % n), 110);
    return () => window.clearInterval(t);
  }, [ready, touched, n]);

  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  const onDown = (e: React.PointerEvent) => {
    setTouched(true);
    drag.current = { x: e.clientX, start: index };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !box.current) return;
    // un giro completo trascinando circa per la larghezza dell'immagine
    const perFrame = box.current.clientWidth / n / 1.1;
    go(drag.current.start - Math.round((e.clientX - drag.current.x) / perFrame));
  };
  const onUp = () => {
    drag.current = null;
  };

  return (
    <div
      ref={box}
      role="slider"
      tabIndex={0}
      aria-label={`${alt} – vista a 360°, usa le frecce per ruotare`}
      aria-valuemin={1}
      aria-valuemax={n}
      aria-valuenow={index + 1}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { setTouched(true); go(index + 1); }
        if (e.key === "ArrowLeft") { setTouched(true); go(index - 1); }
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      className="relative h-full w-full cursor-grab touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-gold active:cursor-grabbing"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={frames[index]} alt={alt} draggable={false} className="pointer-events-none h-full w-full object-contain" />

      {!ready && (
        <div className="absolute inset-x-8 bottom-6 h-px bg-line">
          <div className="h-full bg-gold transition-[width]" style={{ width: `${(loaded / n) * 100}%` }} />
        </div>
      )}
      {ready && !touched && (
        <p className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-paper/85 px-4 py-2 text-[0.7rem] uppercase tracking-[0.2em] text-fg/80 backdrop-blur">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M3 12c0 2.2 4 4 9 4s9-1.8 9-4-4-4-9-4" />
            <path d="M15 5l-3 3 3 3" />
          </svg>
          Trascina per ruotare · 360°
        </p>
      )}
    </div>
  );
}
