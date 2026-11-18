"use client";
import { useEffect, useRef } from "react";

/**
 * Lancette sopra la foto di un quadrante senza lancette, che segnano l'ora reale.
 * Coordinate: viewBox -1..1, raggio 1 = bordo interno della lunetta, perno al centro.
 * Con `sprites` ore e minuti sono le lancette vere ritagliate dalla foto (immagini quadrate 2r con il perno
 * al centro, a mezzogiorno); altrimenti sono disegnate. I secondi scattano come il calibro vero
 * (8 volte al secondo per i Rolex a 28.800 alternanze).
 */
export type HandStyle = "submariner" | "nautilus";
/** fermo: lancetta che non gira e sta sopra le altre (il cronografo dello Speedmaster, fermo sulle 12) */
export type HandSprites = { ore: string; minuti: string; secondi?: string; fermo?: string };

const STEEL = "url(#lh-steel)";
const LUME = "#f2eee2";

function SubmarinerDrawn({ hour, minute }: { hour: React.Ref<SVGGElement>; minute: React.Ref<SVGGElement> }) {
  return (
    <>
      {/* ore: "Mercedes" */}
      <g ref={hour} data-hand="h">
        <rect x={-0.035} y={-0.27} width={0.07} height={0.33} fill={STEEL} />
        <circle cy={-0.37} r={0.105} fill={LUME} stroke="#dfe2e6" strokeWidth={0.03} />
        <path d="M0 -0.37 V-0.475 M0 -0.37 L0.09 -0.318 M0 -0.37 L-0.09 -0.318" stroke="#dfe2e6" strokeWidth={0.026} />
        <path d="M-0.05 -0.465 L0 -0.56 L0.05 -0.465 Z" fill={LUME} stroke="#dfe2e6" strokeWidth={0.02} />
      </g>
      {/* minuti: a spada */}
      <g ref={minute} data-hand="m">
        <path d="M-0.04 0.06 L-0.045 -0.6 L0 -0.8 L0.045 -0.6 L0.04 0.06 Z" fill={STEEL} />
        <path d="M-0.022 -0.12 L-0.026 -0.6 L0 -0.72 L0.026 -0.6 L0.022 -0.12 Z" fill={LUME} />
      </g>
    </>
  );
}

/** Patek Philippe Nautilus: ore e minuti a bastone in oro bianco con il luminescente */
function NautilusDrawn({ hour, minute }: { hour: React.Ref<SVGGElement>; minute: React.Ref<SVGGElement> }) {
  return (
    <>
      <g ref={hour} data-hand="h">
        <path d="M-0.04 0.05 L-0.04 -0.53 L0 -0.585 L0.04 -0.53 L0.04 0.05 Z" fill={STEEL} />
        <path d="M-0.02 -0.14 L-0.02 -0.52 L0 -0.55 L0.02 -0.52 L0.02 -0.14 Z" fill={LUME} />
      </g>
      <g ref={minute} data-hand="m">
        <path d="M-0.034 0.05 L-0.034 -0.79 L0 -0.84 L0.034 -0.79 L0.034 0.05 Z" fill={STEEL} />
        <path d="M-0.017 -0.16 L-0.017 -0.78 L0 -0.81 L0.017 -0.78 L0.017 -0.16 Z" fill={LUME} />
      </g>
    </>
  );
}

/** seconds = false per gli orologi senza lancetta dei secondi (es. Royal Oak 16202: solo ore e minuti) */
export default function LiveHands({
  style,
  run,
  beats = 8,
  sprites,
  seconds = true,
}: {
  style: HandStyle;
  run: boolean;
  beats?: number;
  sprites?: HandSprites | null;
  seconds?: boolean;
}) {
  const hour = useRef<SVGGElement>(null);
  const minute = useRef<SVGGElement>(null);
  const second = useRef<SVGGElement>(null);
  const hourImg = useRef<HTMLImageElement>(null);
  const minuteImg = useRef<HTMLImageElement>(null);
  const secondImg = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let lastBeat = -1;
    const set = () => {
      const now = new Date();
      // si aggiorna solo quando i secondi scattano, non a ogni fotogramma: molto meno lavoro sul telefono
      const beat = Math.floor((now.getTime() * beats) / 1000);
      if (beat === lastBeat) return;
      lastBeat = beat;
      const s = now.getSeconds() + Math.floor((now.getMilliseconds() / 1000) * beats) / beats;
      const m = now.getMinutes() + now.getSeconds() / 60;
      const h = (now.getHours() % 12) + m / 60;
      hour.current?.setAttribute("transform", `rotate(${h * 30})`);
      minute.current?.setAttribute("transform", `rotate(${m * 6})`);
      second.current?.setAttribute("transform", `rotate(${s * 6})`);
      if (hourImg.current) hourImg.current.style.transform = `rotate(${h * 30}deg)`;
      if (minuteImg.current) minuteImg.current.style.transform = `rotate(${m * 6}deg)`;
      if (secondImg.current) secondImg.current.style.transform = `rotate(${s * 6}deg)`;
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

  const shadow = "drop-shadow(0 1.5px 1.5px rgba(0,0,0,0.6))";
  return (
    <span className="absolute inset-0" aria-hidden>
      {sprites && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={hourImg} data-hand="h" src={sprites.ore} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={{ filter: shadow }} />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={minuteImg} data-hand="m" src={sprites.minuti} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={{ filter: shadow }} />
          {sprites.secondi && (
            // eslint-disable-next-line @next/next/no-img-element
            <img ref={secondImg} data-hand="s" src={sprites.secondi} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={{ filter: shadow }} />
          )}
        </>
      )}
      <svg viewBox="-1 -1 2 2" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id="lh-steel" x1="0" x2="1">
            <stop offset="0" stopColor="#9aa0a6" />
            <stop offset="0.5" stopColor="#f6f7f8" />
            <stop offset="1" stopColor="#8c9196" />
          </linearGradient>
        </defs>
        <g style={{ filter: "drop-shadow(0.02px 0.04px 0.025px rgba(0,0,0,0.55))" }}>
          {!sprites && style === "submariner" && <SubmarinerDrawn hour={hour} minute={minute} />}
          {!sprites && style === "nautilus" && <NautilusDrawn hour={hour} minute={minute} />}
          {sprites?.secondi || !seconds ? null : style === "nautilus" ? (
            // secondi del Nautilus: asta sottile con la punta luminescente e il contrappeso corto
            <g ref={second} data-hand="s">
              <rect x={-0.006} y={-0.94} width={0.012} height={1.2} fill={STEEL} />
              <rect x={-0.012} y={-0.9} width={0.024} height={0.14} rx={0.006} fill={LUME} />
            </g>
          ) : (
            // secondi del Submariner: sottile, con il punto luminoso e il contrappeso
            <g ref={second} data-hand="s">
              <rect x={-0.007} y={-0.9} width={0.014} height={1.12} fill={STEEL} />
              <circle cy={-0.6} r={0.048} fill={LUME} stroke="#d9dde1" strokeWidth={0.016} />
              <rect x={-0.016} y={0.12} width={0.032} height={0.12} rx={0.01} fill={STEEL} />
            </g>
          )}
          {/* perno: con le lancette vere resta piccolo, così si vedono i loro anelli */}
          {/* il Nautilus ha il cappuccio del perno più grande, come nella foto */}
          {!sprites?.fermo && (
            <>
              <circle r={sprites ? (style === "nautilus" ? 0.06 : 0.034) : 0.075} fill={STEEL} stroke="rgba(0,0,0,0.4)" strokeWidth={0.008} />
              <circle r={sprites ? (style === "nautilus" ? 0.022 : 0.013) : 0.028} fill="#6d7277" />
            </>
          )}
        </g>
      </svg>
      {sprites?.fermo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img data-hand="f" src={sprites.fermo} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={{ filter: shadow }} />
      )}
    </span>
  );
}
