"use client";
import { motion, useReducedMotion } from "motion/react";
import { brandBySlug } from "@/data/brands";
import BoxPhoto, { CloseUp } from "./BoxPhoto";
import BrandLogo from "./BrandLogo";
import Spotlight from "./Spotlight";

/**
 * Apertura della sezione di una marca: il cofanetto arriva dall'ingrandimento della vetrina
 * (parte grande, centrato sul quadrante, e si ricompone sotto il faretto).
 */
export default function BrandEntrance({ slug }: { slug: string }) {
  const brand = brandBySlug(slug)!;
  const reduced = useReducedMotion();
  const origin = brand.dial ? `${brand.dial.x}% ${brand.dial.y}%` : "50% 62%";
  return (
    <div className={`relative mx-auto w-full ${brand.vicino ? "max-w-[17rem] sm:max-w-[24rem]" : "max-w-[15rem] sm:max-w-[22rem]"}`}>
      {/* faretto */}
      <Spotlight level={1} spread={30} />
      {brand.vicino ? (
        // arrivando dalla vetrina: l'orologio da vicino, nitido, che si assesta sotto il faretto
        <motion.div
          className="relative mt-6 w-full"
          initial={reduced ? false : { scale: 1.35, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${brand.vicino.x}% ${brand.vicino.y}%` }}
        >
          <CloseUp brand={brand} run />
        </motion.div>
      ) : (
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
      )}
      {!brand.vicino && <span aria-hidden className="relative z-10 -mx-8 mt-1 block h-3 bg-gradient-to-b from-[#3d4440] to-[#161a17] shadow-[0_18px_40px_rgba(0,0,0,0.6)]" />}
    </div>
  );
}
