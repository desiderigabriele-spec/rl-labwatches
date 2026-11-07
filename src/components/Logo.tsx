"use client";
import { useEffect, useId, useState } from "react";
import {
  GRADIENTS,
  HAND_START,
  HOUR_HAND,
  MINUTE_HAND,
  PIVOT,
  PIVOT_RING,
  SYMBOL,
  VIEWBOX,
  VARIANTS,
  WORDMARK,
  paint,
  type Role,
  type Shape,
  type Variant,
} from "@/brand/logo.ts";

/**
 * Logo ufficiale Roberto Landi · Lab Watches (geometria in src/brand/logo.ts).
 * SVG inline per animare le lancette, che ruotano intorno al perno.
 */

function timeAngles() {
  const d = new Date();
  const m = d.getMinutes() + d.getSeconds() / 60;
  return { hour: (d.getHours() % 12) * 30 + m * 0.5, minute: m * 6 };
}

export default function Logo({
  variant = "principale",
  wordmark = true,
  live = false,
  delay = 0,
  className = "",
}: {
  variant?: Variant;
  /** false = solo il simbolo (icona) */
  wordmark?: boolean;
  /** lancette sull'ora reale (si aggiornano ogni minuto, non di continuo) */
  live?: boolean;
  /** ritardo in ms prima che le lancette si muovano; "afterIntro" aspetta la fine dell'intro se è in corso */
  delay?: number | "afterIntro";
  className?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const gid = (r: Role) => `${uid}-${r}`;
  const [angles, setAngles] = useState<{ hour: number; minute: number }>(HAND_START);

  useEffect(() => {
    if (!live) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // le lancette girano sempre in avanti (mai all'indietro, anche al cambio d'ora)
    const set = () => {
      const t = timeAngles();
      setAngles((prev) => {
        let { hour, minute } = t;
        while (hour < prev.hour) hour += 360;
        while (minute < prev.minute) minute += 360;
        return { hour, minute };
      });
    };
    const introSeen = document.documentElement.dataset.intro === "seen";
    const wait = delay === "afterIntro" ? (introSeen ? 400 : 2900) : delay;
    const first = window.setTimeout(set, reduce ? 0 : wait);
    const every = window.setInterval(set, 60_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(every);
    };
  }, [live, delay]);

  const usesGradients = !VARIANTS[variant].color;
  const draw = (shapes: Shape[]) =>
    shapes.map((s, i) => <path key={i} d={s.d} fill={paint(variant, s.role, gid)} fillRule={s.evenodd ? "evenodd" : undefined} />);

  const hand = (deg: number): React.CSSProperties => ({
    transform: `rotate(${deg}deg)`,
    transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`,
    transformBox: "view-box",
    transition: "transform 1.8s cubic-bezier(.22,1,.36,1)",
  });

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={wordmark ? VIEWBOX.full : VIEWBOX.icon}
      role="img"
      aria-label="Roberto Landi Lab Watches"
      className={className}
    >
      {usesGradients && (
        <defs>
          {(Object.keys(GRADIENTS) as Role[]).map((r) => (
            <linearGradient key={r} id={gid(r)} x1="0" y1="0" x2={GRADIENTS[r].x2} y2={GRADIENTS[r].y2}>
              {GRADIENTS[r].stops.map(([c, o]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </linearGradient>
          ))}
        </defs>
      )}
      {draw(SYMBOL)}
      <g style={hand(angles.hour)}>{draw(HOUR_HAND)}</g>
      <g style={hand(angles.minute)}>{draw(MINUTE_HAND)}</g>
      {draw([PIVOT_RING])}
      {wordmark && draw(WORDMARK)}
    </svg>
  );
}
