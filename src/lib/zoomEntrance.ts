/**
 * Ingresso nella sezione di una marca: un ingrandimento vero, come un obiettivo che si avvicina.
 *
 * Nel cofanetto della vetrina l'orologio è già la foto ravvicinata ad alta definizione, rimpicciolita e allineata
 * quadrante su quadrante (vedi BoxPhoto). Al secondo tocco l'intera foto del cofanetto passa in un livello fisso e
 * si ingrandisce tutta, senza ritagli: i bordi del cofanetto escono dallo schermo mentre l'orologio arriva al centro.
 * La pagina della marca ha in apertura la stessa scena già ingrandita (BrandEntrance): il livello atterra esattamente
 * lì e poi sfuma, senza che si veda il passaggio.
 */
type Rect = { left: number; top: number; width: number; height: number };
type Zoom = { root: HTMLDivElement; back: HTMLDivElement; content: HTMLElement; anim: Animation; raf: number; t0: number };
declare global {
  interface Window {
    __rlZoom?: Zoom;
  }
}

const TOTAL = 1600; // durata complessiva, ms

export const zoomPending = () => typeof window !== "undefined" && !!window.__rlZoom;

/**
 * Misure dell'apertura della pagina di una marca (le stesse di BrandEntrance, in px):
 * larghezza dell'orologio ravvicinato e centro dell'orologio sullo schermo, con la pagina in cima.
 */
export function heroGeometry(vw: number) {
  const T = vw >= 1024 ? 380 : vw >= 640 ? 340 : vw * 0.66;
  const header = vw >= 640 ? 112 : 80;
  const inner = T * 1.5 * 1.22; // l'orologio occupa l'82% dell'altezza dell'apertura
  return { T, cx: vw / 2, cy: header + inner / 2 };
}

const px = (r: Rect) => ({ left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });

/** Lancette del contenuto copiato: continuano a segnare l'ora (8 scatti al secondo per i secondi) */
function setHands(root: HTMLElement) {
  const now = new Date();
  const s = now.getSeconds() + Math.floor((now.getMilliseconds() / 1000) * 8) / 8;
  const m = now.getMinutes() + now.getSeconds() / 60;
  const h = (now.getHours() % 12) + m / 60;
  const deg: Record<string, number> = { h: h * 30, m: m * 6, s: s * 6 };
  root.querySelectorAll<HTMLElement | SVGElement>("[data-hand]").forEach((el) => {
    const d = deg[el.dataset.hand ?? ""];
    if (d === undefined) return;
    if (el instanceof SVGElement) el.setAttribute("transform", `rotate(${d})`);
    else el.style.transform = `rotate(${d}deg)`;
  });
}

/** Parte dalla foto del cofanetto `shot` (che contiene [data-closeup]) e apre `href` con `go` poco dopo */
export function startZoom(shot: HTMLElement, href: string, go: (href: string) => void) {
  const piece = shot.querySelector<HTMLElement>("[data-closeup]");
  if (!piece) return go(href);
  const r = shot.getBoundingClientRect();
  const c = piece.getBoundingClientRect();

  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  // sotto intestazione, barra del telefono e bottone WhatsApp (z 40-50), sopra la pagina
  root.style.cssText = "position:fixed;inset:0;z-index:38;pointer-events:none;overflow:hidden";
  const back = document.createElement("div");
  back.style.cssText = "position:absolute;inset:0;background:#0b100d;opacity:0";
  const content = shot.cloneNode(true) as HTMLElement;
  content.querySelectorAll("[data-boxlight]").forEach((n) => n.remove());
  content.style.cssText = "position:absolute;transform:none;filter:none;margin:0";
  Object.assign(content.style, px(r));
  root.append(back, content);
  document.body.appendChild(root);

  // destinazione: la scena come la mostra l'apertura della pagina della marca
  const g = heroGeometry(window.innerWidth);
  const k = g.T / c.width;
  const end: Rect = {
    left: g.cx - (c.left - r.left + c.width / 2) * k,
    top: g.cy - (c.top - r.top + c.height / 2) * k,
    width: r.width * k,
    height: r.height * k,
  };
  const anim = content.animate([px(r), px(end)], { duration: TOTAL, easing: "cubic-bezier(.6,0,.2,1)", fill: "forwards" });
  back.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 560, easing: "ease-in-out", fill: "forwards" });

  const zoom: Zoom = { root, back, content, anim, raf: 0, t0: performance.now() };
  const tick = () => {
    setHands(content);
    zoom.raf = requestAnimationFrame(tick);
  };
  tick();
  window.__rlZoom = zoom;
  // la pagina nuova si apre solo quando il fondo è già scuro: sotto lo zoom non si intravede niente
  window.setTimeout(() => go(href), 600);
  // rete di sicurezza: se la pagina non arriva, il livello non resta mai sopra
  window.setTimeout(() => window.__rlZoom === zoom && finish(zoom), 6000);
}

function finish(z: Zoom, onDone?: () => void) {
  onDone?.();
  const fade = { duration: 600, easing: "ease-out", fill: "forwards" as const };
  z.content.animate([{ opacity: 1 }, { opacity: 0 }], fade);
  z.back.animate([{ opacity: 1 }, { opacity: 0 }], fade).onfinish = () => {
    cancelAnimationFrame(z.raf);
    z.root.remove();
  };
  if (window.__rlZoom === z) delete window.__rlZoom;
}

/** Chiamata dalla pagina della marca con la sua scena ingrandita: il livello atterra lì, poi sfuma */
export function landZoom(target: HTMLElement, onDone: () => void) {
  const z = window.__rlZoom;
  if (!z) return onDone();
  // la pagina nuova va in cima subito, senza lo scorrimento morbido, prima di misurare
  (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const t = target.getBoundingClientRect();
      const cur = z.content.getBoundingClientRect();
      z.anim.cancel();
      Object.assign(z.content.style, px(cur));
      const left = Math.max(450, TOTAL - (performance.now() - z.t0));
      const a = z.content.animate([px(cur), px({ left: t.left, top: t.top, width: t.width, height: t.height })], {
        duration: left,
        easing: "cubic-bezier(.2,.6,.25,1)",
        fill: "forwards",
      });
      a.onfinish = () => finish(z, onDone);
    })
  );
}
