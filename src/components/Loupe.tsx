"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Lente dell'orologiaio: passando sopra la foto (o tenendo premuto col dito)
 * compare una lente d'ingrandimento che segue il puntatore.
 */
export default function Loupe({ src, children, zoom = 2.4, className = "" }: { src: string; children: React.ReactNode; zoom?: number; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const size = 170;
  // proporzioni della foto (dall'immagine già mostrata), per ingrandire senza deformarla;
  // la foto ad alta risoluzione per la lente si scarica solo quando la lente viene usata davvero
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  useEffect(() => {
    if (!pos || natural) return;
    const shown = box.current?.querySelector("img");
    if (shown && shown.naturalWidth) setNatural({ w: shown.naturalWidth, h: shown.naturalHeight });
    else {
      const img = new Image();
      img.onload = () => setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      img.src = src;
    }
  }, [pos, natural, src]);

  const move = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  };

  return (
    <div
      ref={box}
      className={`relative ${className}`}
      onPointerMove={(e) => (e.pointerType === "mouse" || pos) && move(e)}
      onPointerDown={(e) => e.pointerType !== "mouse" && move(e)}
      onPointerLeave={() => setPos(null)}
      onPointerUp={(e) => e.pointerType !== "mouse" && setPos(null)}
      onPointerCancel={() => setPos(null)}
      style={{ cursor: pos ? "none" : undefined }}
    >
      {children}
      {pos && natural && (() => {
        const s = Math.max(pos.w / natural.w, pos.h / natural.h);
        const rw = natural.w * s, rh = natural.h * s;
        const ox = (pos.w - rw) / 2, oy = (pos.h - rh) / 2;
        return (
        <span
          aria-hidden
          className="pointer-events-none absolute z-10 rounded-full border-[3px] border-gold-2 shadow-[0_12px_30px_rgba(0,0,0,0.35),inset_0_0_0_6px_rgba(255,255,255,0.22)]"
          style={{
            width: size,
            height: size,
            left: pos.x - size / 2,
            top: pos.y - size / 2,
            backgroundImage: `url(${src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${rw * zoom}px ${rh * zoom}px`,
            backgroundPosition: `${size / 2 - (pos.x - ox) * zoom}px ${size / 2 - (pos.y - oy) * zoom}px`,
          }}
        />
        );
      })()}
      <span className="tag-mono pointer-events-none absolute bottom-3 left-3 bg-paper/85 px-2 py-1 text-[0.7rem] uppercase tracking-[0.12em] text-fg/80 backdrop-blur">
        <span className="hidden sm:inline">Passa sopra per ingrandire</span>
        <span className="sm:hidden">Tieni premuto per ingrandire</span>
      </span>
    </div>
  );
}
