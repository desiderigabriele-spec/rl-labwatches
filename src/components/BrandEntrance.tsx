"use client";
import { useLayoutEffect, useRef } from "react";
import { brandBySlug } from "@/data/brands";
import { landZoom, zoomPending } from "@/lib/zoomEntrance";
import BoxPhoto, { CloseUp } from "./BoxPhoto";
import BrandLogo from "./BrandLogo";
import Spotlight from "./Spotlight";

/**
 * Orologio al centro dell'apertura della sezione di una marca, sotto il faretto.
 * Arrivando dalla vetrina resta nascosto finché l'orologio che si sta ingrandendo non si posa esattamente qui.
 */
export default function BrandEntrance({ slug }: { slug: string }) {
  const brand = brandBySlug(slug)!;
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !zoomPending()) return;
    el.style.opacity = "0";
    landZoom(el, () => (el.style.opacity = "1"));
  }, []);

  return (
    <div className="relative mx-auto w-[min(72vw,19rem)] sm:w-[20rem] lg:w-[22rem]">
      <Spotlight level={1} spread={30} />
      <div className="relative mt-4">
        {brand.vicino ? (
          <CloseUp brand={brand} run ref={ref} />
        ) : brand.vetrina ? (
          <span className="relative block aspect-[840/1020] w-full">
            <BoxPhoto brand={brand} run eager />
          </span>
        ) : (
          <div className="flex aspect-[840/1020] items-center justify-center">
            <BrandLogo brand={brand} className={`text-cream/80 ${brand.ratio > 3 ? "h-8" : "h-20"}`} />
          </div>
        )}
      </div>
    </div>
  );
}
