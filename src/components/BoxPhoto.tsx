"use client";
import type { Brand } from "@/data/brands";
import LiveHands from "./LiveHands";

/**
 * Foto del cofanetto di una marca (riquadro 840×1020, vedi scripts/vetrina.mjs) con, se c'è il quadrante
 * senza lancette, le lancette che segnano l'ora reale.
 */
export default function BoxPhoto({ brand, run, eager = false }: { brand: Brand; run: boolean; eager?: boolean }) {
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
      {brand.dial && (
        // x e r in % della larghezza, y in % dell'altezza del riquadro
        <span
          className="absolute"
          style={{
            left: `${brand.dial.x - brand.dial.r}%`,
            width: `${brand.dial.r * 2}%`,
            top: `${brand.dial.y - brand.dial.r * (840 / 1020)}%`,
            height: `${brand.dial.r * 2 * (840 / 1020)}%`,
          }}
        >
          <LiveHands style={brand.dial.hands} beats={brand.dial.beats} run={run} />
        </span>
      )}
    </>
  );
}
