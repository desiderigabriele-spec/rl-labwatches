"use client";
import { useLayoutEffect, useRef } from "react";
import { brandBySlug } from "@/data/brands";
import { landZoom, zoomPending } from "@/lib/zoomEntrance";
import BoxPhoto from "./BoxPhoto";
import BrandLogo from "./BrandLogo";

/**
 * Apertura della sezione di una marca: l'interno del cofanetto, ingrandito come da un obiettivo, con l'orologio
 * ad alta definizione al centro e i titoli ai lati, nella penombra. È esattamente l'ultimo fotogramma dello zoom che
 * parte dalla vetrina (lib/zoomEntrance, heroGeometry: --T è la larghezza dell'orologio ravvicinato).
 */
export default function BrandEntrance({ slug, left, right }: { slug: string; left: React.ReactNode; right: React.ReactNode }) {
  const brand = brandBySlug(slug)!;
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !zoomPending()) return;
    el.style.opacity = "0";
    landZoom(el, () => (el.style.opacity = "1"));
  }, []);

  const close = brand.vicino && brand.dial ? brand.vicino : null;
  let scene: React.ReactNode;
  if (close && brand.dial) {
    // posizione della foto ravvicinata dentro la foto del cofanetto (frazioni), come in BoxPhoto
    const cw = brand.dial.r / close.r;
    const ch = cw * (1536 / 1024) * (840 / 1020);
    const ccx = brand.dial.x / 100 - (close.x / 100) * cw + cw / 2;
    const ccy = brand.dial.y / 100 - (close.y / 100) * ch + ch / 2;
    const B = `(var(--T) / ${cw.toFixed(5)})`;
    scene = (
      <span
        ref={ref}
        className="absolute block aspect-[840/1020]"
        style={{
          width: `calc${B}`,
          left: `calc(50% - ${B} * ${ccx.toFixed(5)})`,
          top: `calc(50% - ${B} * ${(1020 / 840).toFixed(5)} * ${ccy.toFixed(5)})`,
        }}
      >
        <BoxPhoto brand={brand} run eager />
      </span>
    );
  } else {
    scene = (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="aspect-[840/1020] h-[86%]">
          {brand.vetrina ? (
            <span className="relative block h-full w-full">
              <BoxPhoto brand={brand} run eager />
            </span>
          ) : (
            <span className="flex h-full items-center justify-center">
              <BrandLogo brand={brand} className={`text-cream/80 ${brand.ratio > 3 ? "h-8" : "h-20"}`} />
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative [--T:66vw] sm:[--T:340px] lg:[--T:380px]">
      <div className="relative w-full overflow-hidden" style={{ height: "calc(var(--T) * 1.83)" }}>
        {scene}
        {/* penombra: in alto e in basso sfuma nel buio; sul computer anche ai lati, dove stanno i titoli */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-[#0b100d]/80 to-transparent" />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-[#0b100d] to-transparent" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(90deg,#0b100d 0%,rgba(11,16,13,.88) 22%,rgba(11,16,13,0) 38%,rgba(11,16,13,0) 62%,rgba(11,16,13,.88) 78%,#0b100d 100%)" }}
        />
        <div className="absolute inset-y-0 left-[5%] hidden w-[27%] flex-col justify-center text-right lg:flex">{left}</div>
        <div className="absolute inset-y-0 right-[5%] hidden w-[25%] flex-col justify-center lg:flex">{right}</div>
      </div>
      {/* sul telefono i titoli stanno sotto l'orologio */}
      <div className="px-4 pb-4 pt-2 text-center sm:px-8 lg:hidden">
        {left}
        <div className="mt-6">{right}</div>
      </div>
    </div>
  );
}
