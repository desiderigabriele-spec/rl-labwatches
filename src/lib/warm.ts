"use client";
import { useEffect } from "react";

/**
 * Riscaldamento della cache delle immagini più in basso nella pagina.
 * Le <img> di quelle sezioni sono loading="lazy" (così React non le mette tra i preload in testa alla pagina e non
 * rubano banda al ritratto, che è l'elemento LCP). Per non farle mai arrivare in ritardo, qui si scaricano:
 *  - appena la pagina ha finito di caricare (dopo l'evento "load", quando il ritratto è già arrivato), oppure
 *  - prima, se la sezione si avvicina allo schermo (scorrimento veloce).
 * Quando l'<img> lazy entra in gioco trova il file già in cache: si vede subito, come prima.
 */
const started = new Set<string>();
type Job = { src: string; then?: () => void };
const queue: Job[] = [];
let active = 0;
const MAX = 4; // download in parallelo, per non saturare la rete del telefono

function pump() {
  while (active < MAX && queue.length) {
    const job = queue.shift()!;
    active++;
    const img = new Image();
    img.decoding = "async";
    const done = () => {
      active--;
      job.then?.();
      pump();
    };
    img.onload = img.onerror = done;
    img.src = job.src;
  }
}

function warm(srcs: string[], first = false, serial = false) {
  const todo = srcs.filter((s) => s && !started.has(s));
  if (!todo.length) return;
  // in fila: uno alla volta, nell'ordine in cui servono (il primo arriva prima invece di dividere la banda)
  const jobs: Job[] = serial ? [{ src: todo[0], then: () => warm(todo.slice(1), first, true) }] : todo.map((src) => ({ src }));
  jobs.forEach((j) => started.add(j.src));
  // quelli richiesti perché la sezione è vicina passano davanti agli altri
  if (first) queue.unshift(...jobs);
  else queue.push(...jobs);
  pump();
}

let idle: Promise<void> | null = null;
/** subito dopo l'evento "load": l'elemento LCP è già arrivato, la banda ora è libera */
function afterLoadIdle() {
  if (!idle)
    idle = new Promise<void>((res) => {
      const go = () => window.setTimeout(res, 0);
      if (document.readyState === "complete") go();
      else window.addEventListener("load", go, { once: true });
    });
  return idle;
}

/**
 * Scarica `srcs` dopo il caricamento della pagina, oppure subito se `ref` arriva a `margin` dallo schermo.
 * `idle = false`: solo quando la sezione si avvicina (per le sezioni molto in basso).
 * `serial = true`: uno dopo l'altro nell'ordine dato (per poche immagini grandi che servono in sequenza).
 */
export function useWarm(srcs: string[], ref: React.RefObject<Element | null>, { margin = "150% 0px", idle = true, serial = false } = {}) {
  const key = srcs.join("|");
  useEffect(() => {
    const list = key.split("|").filter(Boolean);
    let cancelled = false;
    if (idle) afterLoadIdle().then(() => !cancelled && warm(list, false, serial));
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return () => void (cancelled = true);
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          warm(list, true, serial);
          io.disconnect();
        }
      },
      { rootMargin: margin }
    );
    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [key, ref, margin, idle, serial]);
}
