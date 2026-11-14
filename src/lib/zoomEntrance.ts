/**
 * Ingresso nella sezione di una marca, come una telecamera che entra nel cofanetto, senza stacchi.
 *
 * Nel cofanetto della vetrina l'orologio è già la foto ravvicinata ad alta definizione, rimpicciolita e allineata
 * quadrante su quadrante (vedi BoxPhoto). Al secondo tocco l'intera foto del cofanetto viene copiata in un livello
 * fisso: una "finestra" che si stringe sull'orologio mentre il contenuto si ingrandisce, finché nella finestra resta
 * solo la foto ravvicinata, intera. Intanto si apre la pagina della marca, che dice dove sta il suo orologio:
 * la finestra atterra lì, poi il livello sfuma e resta la pagina vera.
 */
type Rect = { left: number; top: number; width: number; height: number };
type Zoom = {
  root: HTMLDivElement;
  back: HTMLDivElement;
  frame: HTMLDivElement;
  content: HTMLElement;
  close: Rect; // posizione della foto ravvicinata dentro il contenuto, a scala 1 (px)
  base: Rect; // misura del contenuto a scala 1
  anims: Animation[];
  raf: number;
  t0: number;
};
declare global {
  interface Window {
    __rlZoom?: Zoom;
  }
}

const TOTAL = 1500; // durata complessiva, ms
const EASE_IN_OUT = "cubic-bezier(.65,0,.25,1)";
const EASE_OUT = "cubic-bezier(.2,.65,.25,1)";
const RADIUS = 18;

export const zoomPending = () => typeof window !== "undefined" && !!window.__rlZoom;

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

/** Contenuto (relativo alla finestra) quando la finestra `t` mostra esattamente la foto ravvicinata */
function contentFor(z: Zoom, t: Rect): Rect {
  const k = t.width / z.close.width;
  return { left: -z.close.left * k, top: -z.close.top * k, width: z.base.width * k, height: z.base.height * k };
}

/**
 * Parte dalla foto del cofanetto `shot` (che contiene [data-closeup]) e apre `href` con `go` poco dopo.
 */
export function startZoom(shot: HTMLElement, href: string, go: (href: string) => void) {
  const piece = shot.querySelector<HTMLElement>("[data-closeup]");
  if (!piece) return go(href);
  const r = shot.getBoundingClientRect();
  const c = piece.getBoundingClientRect();

  const root = document.createElement("div");
  root.setAttribute("aria-hidden", "true");
  // sotto intestazione, barra del telefono e bottone WhatsApp (z 40-50), sopra la pagina
  root.style.cssText = "position:fixed;inset:0;z-index:38;pointer-events:none";
  const back = document.createElement("div");
  back.style.cssText = "position:absolute;inset:0;background:#0b100d;opacity:0";
  const frame = document.createElement("div");
  frame.style.cssText = "position:absolute;overflow:hidden;border-radius:0px";
  Object.assign(frame.style, px(r));
  const content = shot.cloneNode(true) as HTMLElement;
  content.querySelectorAll("[data-boxlight]").forEach((n) => n.remove());
  content.style.cssText = "position:absolute;left:0;top:0;transform:none;filter:none;margin:0";
  content.style.width = `${r.width}px`;
  content.style.height = `${r.height}px`;
  frame.appendChild(content);
  root.append(back, frame);
  document.body.appendChild(root);

  const zoom: Zoom = {
    root,
    back,
    frame,
    content,
    close: { left: c.left - r.left, top: c.top - r.top, width: c.width, height: c.height },
    base: { left: 0, top: 0, width: r.width, height: r.height },
    anims: [],
    raf: 0,
    t0: performance.now(),
  };
  // destinazione: dove la pagina della marca mette il suo orologio (stesse misure di BrandEntrance e della pagina),
  // così lo zoom va subito nel punto giusto; all'arrivo la pagina conferma la posizione esatta
  const vw = window.innerWidth;
  const W = vw >= 1024 ? 352 : vw >= 640 ? 320 : Math.min(vw * 0.72, 304);
  const H = (W * c.height) / c.width;
  const target: Rect = { left: (vw - W) / 2, top: (vw >= 640 ? 128 : 96) + 63, width: W, height: H };
  animateTo(zoom, target, TOTAL, EASE_IN_OUT);
  back.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: "ease-out", fill: "forwards" });

  const tick = () => {
    setHands(content);
    zoom.raf = requestAnimationFrame(tick);
  };
  tick();
  window.__rlZoom = zoom;
  window.setTimeout(() => go(href), 300);
  // rete di sicurezza: se la pagina non arriva, il livello non resta mai sopra
  window.setTimeout(() => window.__rlZoom === zoom && finish(zoom), 6000);
}

/** Porta finestra e contenuto alla destinazione `t`, partendo da dove sono adesso */
function animateTo(z: Zoom, t: Rect, duration: number, easing: string) {
  const fr = z.frame.getBoundingClientRect();
  const cr = z.content.getBoundingClientRect();
  const from: Rect = { left: fr.left, top: fr.top, width: fr.width, height: fr.height };
  const cFrom: Rect = { left: cr.left - fr.left, top: cr.top - fr.top, width: cr.width, height: cr.height };
  const radius = parseFloat(getComputedStyle(z.frame).borderRadius) || 0;
  const fade = getComputedStyle(z.content.querySelector<HTMLElement>("[data-closeup]")!).maskSize;
  z.anims.forEach((a) => a.cancel());
  Object.assign(z.frame.style, px(from));
  Object.assign(z.content.style, px(cFrom));
  const o = { duration, easing, fill: "forwards" as const };
  const piece = z.content.querySelector<HTMLElement>("[data-closeup]")!;
  z.anims = [
    z.frame.animate(
      [
        { ...px(from), borderRadius: `${radius}px`, boxShadow: "0 0 0 rgba(0,0,0,0)" },
        { ...px(t), borderRadius: `${RADIUS}px`, boxShadow: "0 30px 60px rgba(0,0,0,0.55)" },
      ],
      o
    ),
    z.content.animate([px(cFrom), px(contentFor(z, t))], o),
    // la sfumatura che fonde l'orologio nel cuscino si allarga fino a sparire: resta la foto intera
    piece.animate([{ maskSize: fade && fade !== "auto" ? fade : "100% 100%" }, { maskSize: "340% 340%" }], o),
  ];
  return z.anims[0];
}

function finish(z: Zoom, onDone?: () => void) {
  onDone?.();
  const fade = { duration: 500, easing: "ease-out", fill: "forwards" as const };
  z.frame.animate([{ opacity: 1 }, { opacity: 0 }], fade);
  z.back.animate([{ opacity: 1 }, { opacity: 0 }], fade).onfinish = () => {
    cancelAnimationFrame(z.raf);
    z.root.remove();
  };
  if (window.__rlZoom === z) delete window.__rlZoom;
}

/** Chiamata dalla pagina della marca: la finestra atterra sul suo orologio, poi il livello sfuma */
export function landZoom(target: HTMLElement, onDone: () => void) {
  const z = window.__rlZoom;
  if (!z) return onDone();
  // la pagina nuova va in cima subito, senza lo scorrimento morbido, prima di misurare dove sta l'orologio
  (window as unknown as { __lenis?: { scrollTo: (t: number, o?: object) => void } }).__lenis?.scrollTo(0, { immediate: true, force: true });
  window.scrollTo(0, 0);
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const t = target.getBoundingClientRect();
      const left = Math.max(500, TOTAL - (performance.now() - z.t0));
      animateTo(z, { left: t.left, top: t.top, width: t.width, height: t.height }, left, EASE_OUT).onfinish = () => finish(z, onDone);
    })
  );
}
