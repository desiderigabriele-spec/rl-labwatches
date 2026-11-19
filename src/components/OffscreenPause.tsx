"use client";
import { useEffect } from "react";

/**
 * Mette in pausa le animazioni CSS infinite quando l'elemento è fuori dallo schermo (attributo data-offscreen,
 * regola in globals.css) e le riprende appena sta per rientrare. A schermo non cambia niente: un riflesso o
 * un nastro che ripartono da dove erano sono identici, ma fuori schermo il browser non ricalcola più stili
 * e layout 60 volte al secondo (misurato: CPU a riposo in cima alla home dal 44% al 23% sul telefono simulato).
 * Elementi: il riflesso .sheen, il nastro .marquee, l'orologio che fluttua e i pallini del restauro, e qualunque
 * elemento con data-pause-offscreen. Gli elementi aggiunti dopo (cambio pagina, sezioni che si richiudono)
 * vengono trovati con un MutationObserver.
 */
const SELECTOR = ".sheen, .marquee, .watch-done, .defect-pin, [data-pause-offscreen]";

export default function OffscreenPause() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) e.target.removeAttribute("data-offscreen");
          else e.target.setAttribute("data-offscreen", "");
        }
      },
      // riprende un po' prima di rientrare, così l'animazione è già in moto quando si vede
      { rootMargin: "200px 0px" }
    );
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    scan();
    let queued = 0;
    const mo = new MutationObserver(() => {
      if (!queued) queued = requestAnimationFrame(() => ((queued = 0), scan()));
    });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(queued);
      mo.disconnect();
      io.disconnect();
    };
  }, []);
  return null;
}
