"use client";
import type { Brand } from "@/data/brands";
import LiveHands from "./LiveHands";

type Dial = { x: number; y: number; r: number };

/** Lancette vive sopra un quadrante: x e r in % della larghezza della foto, y in % dell'altezza; aspect = larghezza/altezza */
function DialHands({ dial, aspect, brand, run, eager }: { dial: Dial; aspect: number; brand: Brand; run: boolean; eager?: boolean }) {
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
      <LiveHands style={brand.dial.hands} beats={brand.dial.beats} sprites={brand.dial.sprites} seconds={!("seconds" in brand.dial) || brand.dial.seconds !== false} run={run} eager={eager} />
    </span>
  );
}

/** Bordo morbido della foto ravvicinata: nel cofanetto si fonde con il cuscino, nella pagina della marca galleggia nel buio */
export const FEATHER = "radial-gradient(ellipse 50% 50% at 50% 42%, #000 70%, transparent 100%)";

/**
 * Foto del cofanetto di una marca (riquadro 840×1020, vedi scripts/vetrina.mjs). Se c'è la foto ravvicinata,
 * l'orologio nel cofanetto è già quella, rimpicciolita e allineata quadrante su quadrante, con le lancette vive:
 * entrando nella marca si ingrandisce proprio questo pezzo, senza stacchi (vedi lib/zoomEntrance).
 */
export default function BoxPhoto({ brand, run, eager = false }: { brand: Brand; run: boolean; eager?: boolean }) {
  const close = brand.vicino && brand.dial ? brand.vicino : null;
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
      {brand.dial && !close && <DialHands dial={brand.dial} aspect={840 / 1020} brand={brand} run={run} eager={eager} />}
      <CloseupPiece brand={brand} run={run} eager={eager} />
    </>
  );
}

/**
 * La foto ravvicinata dentro il cofanetto, sfumata ai bordi e allineata quadrante su quadrante, con le lancette vive.
 * È il pezzo che lib/zoomEntrance ingrandisce ([data-closeup]). Nella fila della vetrina c'è già, cotto nella foto
 * (scripts/vetrina-fila.mjs): questo si monta solo sul cofanetto toccato, un attimo prima dell'ingrandimento.
 */
export function CloseupPiece({ brand, run, eager = false }: { brand: Brand; run: boolean; eager?: boolean }) {
  const close = brand.vicino && brand.dial ? brand.vicino : null;
  if (!close || !brand.dial) return null;
  // dimensioni della foto ravvicinata nel riquadro, perché il suo quadrante coincida con quello del cofanetto
  const w = brand.dial.r / close.r; // in frazioni della larghezza del riquadro
  const h = w * (1536 / 1024) * (840 / 1020); // in frazioni dell'altezza del riquadro
  return (
    <span
      data-closeup
      className="absolute"
      style={{
        left: `${brand.dial.x - close.x * w}%`,
        top: `${brand.dial.y - close.y * h}%`,
        width: `${w * 100}%`,
        height: `${h * 100}%`,
        // la sfumatura si allarga (maskSize) mentre si entra nella marca, fino a mostrare la foto intera
        maskImage: FEATHER,
        WebkitMaskImage: FEATHER,
        maskSize: "100% 100%",
        WebkitMaskSize: "100% 100%",
        maskPosition: "50% 42%",
        WebkitMaskPosition: "50% 42%",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={close.src} alt="" aria-hidden draggable={false} loading={eager ? "eager" : "lazy"} className="h-full w-full" />
      <DialHands dial={close} aspect={1024 / 1536} brand={brand} run={run} eager={eager} />
    </span>
  );
}

/** Foto ravvicinata di una marca, intera, a sé (apertura della sezione), con le lancette vive */
export function CloseUp({ brand, run, ref }: { brand: Brand; run: boolean; ref?: React.Ref<HTMLSpanElement> }) {
  const close = brand.vicino;
  if (!close) return null;
  return (
    <span ref={ref} className="relative block aspect-[1024/1536] w-full overflow-hidden rounded-[18px] shadow-[0_30px_60px_rgba(0,0,0,0.55)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={close.src} alt={`Orologio ${brand.name} da vicino`} draggable={false} className="h-full w-full select-none" />
      {brand.dial && <DialHands dial={close} aspect={1024 / 1536} brand={brand} run={run} eager />}
    </span>
  );
}
