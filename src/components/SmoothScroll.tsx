"use client";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scorrimento morbido della pagina con la rotellina del mouse (disattivato con "riduci movimento").
 * Solo con mouse o trackpad: su telefono e tablet lo scorrimento del sistema è già morbido e va lasciato fare a lui.
 * Lenis registra ascoltatori del tocco "non passivi" su tutta la pagina: il browser deve aspettare JavaScript a ogni
 * tocco prima di poter scorrere, e su iPhone questo si sente come un ritardo e qualche scatto (misurato: con Lenis
 * sul telefono simulato si perdeva il 39% dei fotogrammi scorrendo la pagina, senza l'11%).
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: { offset: -96 } });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);
  return null;
}
