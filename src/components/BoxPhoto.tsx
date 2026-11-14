"use client";
import type { Brand } from "@/data/brands";
import LiveHands from "./LiveHands";

type Dial = { x: number; y: number; r: number };

/** Lancette vive sopra un quadrante: x e r in % della larghezza della foto, y in % dell'altezza; aspect = larghezza/altezza */
function DialHands({ dial, aspect, brand, run }: { dial: Dial; aspect: number; brand: Brand; run: boolean }) {
  if (!brand.dial) return null;
  return (
    <span
      className="absolute"
      style={{
        left: `${dial.x - dial.r}%`,
        width: `${dial.r * 2}%`,
        top: `${dial.y - dial.r * aspect}%`,
        height: `${dial.r * 2 * aspect}%`,
      }}
    >
      <LiveHands style={brand.dial.hands} beats={brand.dial.beats} sprites={brand.dial.sprites} run={run} />
    </span>
  );
}

/**
 * Foto del cofanetto di una marca (riquadro 840×1020, vedi scripts/vetrina.mjs) con le lancette che segnano l'ora reale.
 * Con `zoomed` sopra il quadrante sfuma la foto ravvicinata dello stesso orologio, allineata quadrante su quadrante:
 * ingrandendo il riquadro si arriva sull'orologio nitido invece che su una foto sfocata.
 */
export default function BoxPhoto({ brand, run, eager = false, zoomed = false }: { brand: Brand; run: boolean; eager?: boolean; zoomed?: boolean }) {
  const close = brand.vicino && brand.dial ? brand.vicino : null;
  // dimensioni della foto ravvicinata nel riquadro, perché il suo quadrante coincida con quello del cofanetto
  const w = close && brand.dial ? brand.dial.r / close.r : 0; // in frazioni della larghezza del riquadro
  const h = w * (1536 / 1024) * (840 / 1020); // in frazioni dell'altezza del riquadro
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={brand.vetrina}
        alt={`Cofanetto ${brand.name}`}
        draggable={false}
        loading={eager ? "eager" : "lazy"}
        className="h-full w-full select-none object-contain object-bottom drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]"
      />
      {brand.dial && !zoomed && <DialHands dial={brand.dial} aspect={840 / 1020} brand={brand} run={run} />}
      {close && brand.dial && zoomed && (
        <span
          className="absolute"
          style={{
            left: `${brand.dial.x - close.x * w}%`,
            top: `${brand.dial.y - close.y * h}%`,
            width: `${w * 100}%`,
            height: `${h * 100}%`,
            animation: "box-zoom-in 450ms ease-out 180ms both",
            maskImage: "radial-gradient(ellipse 50% 50% at 50% 42%, #000 70%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 50% 50% at 50% 42%, #000 70%, transparent 100%)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={close.src} alt="" aria-hidden draggable={false} className="h-full w-full" />
          <DialHands dial={close} aspect={1024 / 1536} brand={brand} run={run} />
        </span>
      )}
    </>
  );
}

/** Foto ravvicinata di una marca, a sé (apertura della sezione), con le lancette vive */
export function CloseUp({ brand, run }: { brand: Brand; run: boolean }) {
  const close = brand.vicino;
  if (!close) return null;
  return (
    <span className="relative block aspect-[1024/1536] w-full overflow-hidden rounded-[1.25rem] shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={close.src} alt={`Orologio ${brand.name} da vicino`} draggable={false} className="h-full w-full select-none object-cover" />
      {brand.dial && <DialHands dial={close} aspect={1024 / 1536} brand={brand} run={run} />}
    </span>
  );
}
