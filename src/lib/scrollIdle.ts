/**
 * La pagina sta scorrendo? Un solo ascoltatore passivo per tutto il sito (pagina e file orizzontali: lo scroll si
 * cattura su window). Serve a non far partire animazioni automatiche (la capsula della lunetta, la linea del prima e
 * dopo) proprio mentre il dito scorre: in quel momento il telefono deve fare il meno possibile.
 */
let last = 0;
let installed = false;

function install() {
  if (installed || typeof window === "undefined") return;
  installed = true;
  window.addEventListener("scroll", () => (last = performance.now()), { passive: true, capture: true });
}

/** millisecondi dall'ultimo scorrimento (pagina o qualunque fila orizzontale) */
export function sinceScroll() {
  install();
  return performance.now() - last;
}

/** chiama `fn` quando nulla scorre da almeno `ms` (subito, se è già tutto fermo); restituisce la funzione per annullare */
export function whenScrollIdle(fn: () => void, ms = 250) {
  install();
  let t = 0;
  let cancelled = false;
  const check = () => {
    if (cancelled) return;
    const d = performance.now() - last;
    if (d >= ms) fn();
    else t = window.setTimeout(check, ms - d + 16);
  };
  check();
  return () => {
    cancelled = true;
    window.clearTimeout(t);
  };
}
