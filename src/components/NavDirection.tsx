"use client";
import { useEffect } from "react";
import { navDirection } from "@/lib/navDirection";
import { zoomPending } from "@/lib/zoomEntrance";

/**
 * Scrive su <html data-nav="…"> da che parte deve entrare la pagina nuova (vedi lib/navDirection):
 * i movimenti in globals.css lo leggono. Si aggancia al momento in cui cambia l'indirizzo, che con
 * Next.js avviene dentro la transizione, prima che partano le animazioni: così vale per i link,
 * per router.push e per i tasti avanti/indietro del browser.
 *
 * Con avanti/indietro, se Next.js riceve l'evento del browser nello stesso istante, React aggiorna la
 * pagina subito e senza animazione: lo fermo e glielo ripasso un attimo dopo, così anche tornando
 * indietro la pagina scorre (nel verso opposto all'andata).
 */
export default function NavDirection() {
  useEffect(() => {
    const root = document.documentElement;
    let last = location.pathname;
    const set = (to: string) => {
      if (to === last) return;
      root.dataset.nav = zoomPending() ? "none" : navDirection(last, to);
      last = to;
    };
    type Fn = History["pushState"];
    const wrap = (fn: Fn, isPush: boolean): Fn =>
      function (this: History, data, unused, url) {
        if (url != null) {
          const u = new URL(String(url), location.href);
          if (u.origin === location.origin && u.pathname !== last) {
            set(u.pathname);
            // pagina nuova da un link: in cima subito, prima che il browser la fotografi per lo scorrimento
            // (Next.js lo farebbe un attimo dopo, e si vedrebbe la pagina saltare)
            if (isPush && !u.hash) {
              (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis?.scrollTo(0, { immediate: true, force: true });
              window.scrollTo({ top: 0, behavior: "instant" });
            }
          }
        }
        return fn.call(this, data, unused, url);
      };
    const push = history.pushState;
    const replace = history.replaceState;
    history.pushState = wrap(push, true);
    history.replaceState = wrap(replace, false);
    let replaying = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onPop = (e: PopStateEvent) => {
      if (replaying) return; // è l'evento che ripasso io a Next.js
      const to = location.pathname;
      const from = last;
      // sull'iPhone il gesto per tornare indietro ha già la sua animazione: non ne aggiungo un'altra
      if ((e as PopStateEvent & { hasUAVisualTransition?: boolean }).hasUAVisualTransition) {
        root.dataset.nav = "none";
        last = to;
        return;
      }
      set(to);
      if (to === from || root.dataset.nav === "none" || reduced || !document.startViewTransition) return;
      // React fa partire l'animazione solo se l'evento non arriva dentro quello del browser:
      // lo fermo e lo ripasso a Next.js un istante dopo
      e.stopImmediatePropagation();
      const state = e.state;
      window.setTimeout(() => {
        replaying = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state }));
        replaying = false;
      }, 0);
    };
    window.addEventListener("popstate", onPop, true);
    return () => {
      history.pushState = push;
      history.replaceState = replace;
      window.removeEventListener("popstate", onPop, true);
    };
  }, []);
  return null;
}
