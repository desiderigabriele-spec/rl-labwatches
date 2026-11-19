/**
 * Un solo "bilanciere" per tutte le lancette del sito. Invece di un ciclo a 60 fotogrammi al secondo per ogni
 * orologio (la lunetta dei contatti, i sei cofanetti della vetrina, l'orologio finale del restauro), un timer
 * per frequenza che scatta esattamente al prossimo battito (8 al secondo per i calibri a 28.800 alternanze,
 * 5 per il 722 del Daytona d'epoca) e aggiorna tutte le lancette nello stesso fotogramma.
 * Le lancette si muovevano già solo a ogni battito: a schermo è identico, ma il telefono si sveglia 8 volte al
 * secondo invece di 60 per ogni orologio. A scheda nascosta requestAnimationFrame si ferma da solo.
 */
type Tick = (now: Date) => void;

const groups = new Map<number, { subs: Set<Tick>; timer: number; raf: number }>();

function schedule(beats: number) {
  const g = groups.get(beats);
  if (!g || g.subs.size === 0) return;
  const period = 1000 / beats;
  // al prossimo confine di battito (in tempo reale), poi nel fotogramma successivo
  const wait = period - (Date.now() % period) + 1;
  g.timer = window.setTimeout(() => {
    g.raf = requestAnimationFrame(() => {
      const now = new Date();
      g.subs.forEach((f) => f(now));
      schedule(beats);
    });
  }, wait);
}

/** chiama `tick` a ogni battito (e subito una volta); restituisce la funzione per smettere */
export function onBeat(beats: number, tick: Tick): () => void {
  let g = groups.get(beats);
  if (!g) {
    g = { subs: new Set(), timer: 0, raf: 0 };
    groups.set(beats, g);
  }
  const first = g.subs.size === 0;
  g.subs.add(tick);
  tick(new Date());
  if (first) schedule(beats);
  return () => {
    const cur = groups.get(beats);
    if (!cur) return;
    cur.subs.delete(tick);
    if (cur.subs.size === 0) {
      window.clearTimeout(cur.timer);
      cancelAnimationFrame(cur.raf);
      groups.delete(beats);
    }
  };
}
