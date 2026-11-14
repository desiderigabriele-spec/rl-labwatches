"use client";
import { brandBySlug } from "@/data/brands";
import BoxPhoto from "./BoxPhoto";
import BrandLogo from "./BrandLogo";
import Spotlight, { LightPool } from "./Spotlight";

/**
 * Apertura compatta della sezione di una marca: il cofanetto piccolo sotto il suo faretto, sul ripiano.
 * Il testo (titolo e descrizione della pagina) lo passa la pagina come children e sta accanto (sotto, sul telefono).
 */
export default function BrandEntrance({ slug, children }: { slug: string; children: React.ReactNode }) {
  const brand = brandBySlug(slug)!;
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr] items-center gap-5 px-4 sm:gap-12 sm:px-8 lg:gap-16">
      <div className="relative mx-auto w-[6.25rem] sm:w-[11rem] lg:w-[13rem]">
        <Spotlight level={1} spread={30} />
        <span className="relative mt-4 block aspect-[840/1020] w-full">
          {brand.vetrina ? (
            <BoxPhoto brand={brand} run eager />
          ) : (
            <span className="flex h-full items-center justify-center">
              <BrandLogo brand={brand} className={`text-cream/80 ${brand.ratio > 3 ? "h-6" : "h-14"}`} />
            </span>
          )}
          <LightPool level={1} />
        </span>
        {/* ripiano */}
        <span aria-hidden className="relative z-10 -mx-3 mt-1 block h-1.5 sm:-mx-6 sm:h-2 bg-gradient-to-b from-[#3d4440] to-[#161a17] shadow-[0_14px_30px_rgba(0,0,0,0.6)]" />
      </div>
      <div className="min-w-0 text-left">{children}</div>
    </div>
  );
}
