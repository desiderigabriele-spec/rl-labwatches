"use client";
import { useEffect, useId, useMemo, useRef } from "react";
import { LOGO_PARTS, type LogoVersion } from "@/brand/logo-parts";
import { animateLogo, type LogoController } from "@/brand/logo-animation";

/**
 * Logo ufficiale Roberto Landi · Lab Watches (kit vettoriale in /public/brand, note in docs/brand).
 * Il quadrante con le lancette è inline (animabile), le scritte sono l'SVG del kit sovrapposto
 * con le stesse coordinate: la composizione resta quella originale.
 *
 * animate:
 *  - "intro": all'apertura le lancette girano, rallentano e si fermano nella posa originale
 *  - "hover": la stessa animazione al passaggio del mouse (o al tocco)
 *  - "none":  logo fermo nella posa originale
 */
export default function Logo({
  version = "RL-orizzontale-metallo",
  animate = "none",
  delay = 0,
  className = "",
}: {
  version?: LogoVersion;
  animate?: "intro" | "hover" | "none";
  delay?: number;
  className?: string;
}) {
  const part = LOGO_PARTS[version];
  const svgRef = useRef<SVGSVGElement>(null);
  const ctrl = useRef<LogoController | null>(null);
  const prefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  // ID univoci per ogni copia (gradienti, maschera e gruppi delle lancette)
  const markup = useMemo(
    () => part.dial.replace(/id="([^"]+)"/g, `id="${prefix}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${prefix}-$1)`),
    [part.dial, prefix]
  );
  const [, , w, h] = part.viewBox.split(" ").map(Number);

  useEffect(() => {
    if (!svgRef.current) return;
    const c = animateLogo(svgRef.current, { mode: "static", duration: window.matchMedia("(max-width: 1023px)").matches ? 1150 : 1800 });
    ctrl.current = c;
    const t = animate === "intro" ? window.setTimeout(() => c.intro(), delay) : 0;
    return () => {
      window.clearTimeout(t);
      c.destroy();
      ctrl.current = null;
    };
  }, [animate, delay]);

  const spin = animate === "hover" ? () => ctrl.current?.intro() : undefined;

  return (
    <span
      role="img"
      aria-label="Roberto Landi Lab Watches"
      className={`relative inline-block ${className}`}
      style={{ aspectRatio: `${w} / ${h}` }}
      onMouseEnter={spin}
      onTouchStart={spin}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={part.words} alt="" aria-hidden className="absolute inset-0 h-full w-full" draggable={false} loading={animate === "intro" ? "lazy" : undefined} />
      <svg
        ref={svgRef}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={part.viewBox}
        aria-hidden
        className="absolute inset-0 h-full w-full"
        dangerouslySetInnerHTML={{ __html: markup }}
      />
    </span>
  );
}
