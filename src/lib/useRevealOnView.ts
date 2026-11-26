"use client";
import { useEffect, useRef } from "react";

/**
 * Animazione d'ingresso che NON nasconde niente nell'HTML: la pagina arriva già visibile (Google, motori AI,
 * telefoni lenti e LCP la vedono subito). Dopo il caricamento, al primo controllo, solo gli elementi ancora
 * fuori dallo schermo vengono messi "in attesa" (classe `wait`, invisibile perché non si vedono comunque)
 * e si animano col CSS quando entrano. Quello che è già a schermo resta com'è: nessun lampeggio.
 */
export function useRevealOnView<T extends HTMLElement>(margin = "0px 0px -80px 0px") {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let first = true;
    const io = new IntersectionObserver(
      ([e]) => {
        if (first) {
          first = false;
          // già a schermo (anche solo in parte): resta visibile
          if (e.boundingClientRect.top < window.innerHeight && e.boundingClientRect.bottom > 0) return io.disconnect();
          el.classList.add("rv-wait");
          return;
        }
        if (e.isIntersecting) {
          el.classList.add("rv-in");
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return ref;
}
