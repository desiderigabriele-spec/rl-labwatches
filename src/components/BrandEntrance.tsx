"use client";
import { motion, useReducedMotion } from "motion/react";
import { brandBySlug } from "@/data/brands";
import BoxPhoto from "./BoxPhoto";
import BrandLogo from "./BrandLogo";

/**
 * Apertura della sezione di una marca: il cofanetto arriva dall'ingrandimento della vetrina
 * (parte grande, centrato sul quadrante, e si ricompone sotto il faretto).
 */
export default function BrandEntrance({ slug }: { slug: string }) {
  const brand = brandBySlug(slug)!;
  const reduced = useReducedMotion();
  const origin = brand.dial ? `${brand.dial.x}% ${brand.dial.y}%` : "50% 62%";
  return (
    <div className="relative mx-auto w-full max-w-[15rem] sm:max-w-[22rem]">
      {/* faretto */}
      <span aria-hidden className="mx-auto block h-3 w-12 rounded-b-full bg-[#1c211e]">
        <span className="mx-2 block h-1 translate-y-2 rounded-full bg-[#fff4dc] shadow-[0_0_18px_4px_rgba(255,236,200,0.75)]" />
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-2 h-[96%] w-[160%] -translate-x-1/2"
        style={{
          clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
          background: "linear-gradient(to bottom, rgba(255,244,220,0.5), rgba(255,240,210,0.12) 55%, rgba(255,240,210,0) 92%)",
          filter: "blur(7px)",
          mixBlendMode: "screen",
        }}
      />
      <motion.div
        className="relative mt-6 aspect-[840/1020] w-full"
        style={{ transformOrigin: origin }}
        initial={reduced ? false : { scale: 3.2, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      >
        {brand.vetrina ? (
          <BoxPhoto brand={brand} run eager />
        ) : (
          <div className="flex h-full items-end justify-center pb-[18%]">
            <BrandLogo brand={brand} className={`text-cream/80 ${brand.ratio > 3 ? "h-8" : "h-20"}`} />
          </div>
        )}
      </motion.div>
      <span aria-hidden className="relative z-10 -mx-8 mt-1 block h-3 bg-gradient-to-b from-[#3d4440] to-[#161a17] shadow-[0_18px_40px_rgba(0,0,0,0.6)]" />
    </div>
  );
}
