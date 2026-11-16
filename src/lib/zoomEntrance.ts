/**
 * Ingrandimento del cofanetto in vetrina, come un obiettivo che si avvicina.
 *
 * Nel cofanetto l'orologio è già la foto ravvicinata ad alta definizione, rimpicciolita e allineata quadrante su
 * quadrante (vedi BoxPhoto). Al primo tocco l'intera foto del cofanetto passa in un livello fisso e si ingrandisce
 * tutta, senza ritagli: i bordi escono dallo schermo e l'orologio arriva al centro, nitido.
 * Toccando l'orologio ingrandito si va alla pagina degli orologi della marca (apertura compatta con il cofanetto
 * piccolo e la lista subito sotto); con ✕, Esc, il fondo o
 * scorrendo, l'orologio torna nel cofanetto.
 */
type Rect = { left: number; top: number; width: number; height: number };
type Zoom = { root: HTMLDivElement; raf: number; cleanup: () => void };
declare global {
  interface Window {
    __rlZoom?: Zoom;
  }
}

const DURATION = 1300;
const EASE = "cubic-bezier(.6,0,.2,1)";
type LenisLike = { stop: () => void; start: () => void; scrollTo: (t: string | number, o?: object) => void };
const lenis = () => (window as unknown as { __lenis?: LenisLike }).__lenis;

/** C'è un ingrandimento aperto o un passaggio in corso: la pagina nuova non deve fare la sua dissolvenza */
export const zoomPending = () => typeof window !== "undefined" && !!window.__rlZoom;

const place = (n: HTMLElement, r: Rect) =>
  Object.assign(n.style, { position: "absolute", left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px`, margin: "0", transformOrigin: "0 0", willChange: "transform" });
const move = (dx: number, dy: number, s: number) => ({ transform: `translate(${dx}px,${dy}px) scale(${s})` });

/** Lancette del contenuto copiato: continuano a segnare l'ora (8 scatti al secondo per i secondi) */
let lastBeat = -1;
function setHands(root: HTMLElement) {
  const now = new Date();
  const beat = Math.floor(now.getTime() / 125); // si aggiorna solo quando la lancetta scatta, non a ogni fotogramma
  if (beat === lastBeat) return;
  lastBeat = beat;
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

const el = (tag: string, css: string, html = "") => {
  const n = document.createElement(tag);
  n.style.cssText = css;
  n.innerHTML = html;
  return n;
};

/**
 * Ingrandisce la foto del cofanetto `shot` (che contiene [data-closeup]).
 * Toccando l'orologio si apre `href` con `go`; `onClose` quando l'orologio torna nel cofanetto.
 */
export function openZoom(
  shot: HTMLElement,
  o: { name: string; href: string; go: (href: string) => void; onClose: () => void }
) {
  const piece = shot.querySelector<HTMLElement>("[data-closeup]");
  if (!piece || window.__rlZoom) return false;
  const r = shot.getBoundingClientRect();
  const c = piece.getBoundingClientRect();
  const from: Rect = { left: r.left, top: r.top, width: r.width, height: r.height };
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const phone = vw < 640;

  // sotto intestazione, barra del telefono e bottone WhatsApp (z 40-50), sopra la pagina
  const root = el("div", "position:fixed;inset:0;z-index:38;overflow:hidden") as HTMLDivElement;
  root.setAttribute("role", "dialog");
  root.setAttribute("aria-label", `Orologi ${o.name}`);
  const back = el("div", "position:absolute;inset:0;background:#0b100d;opacity:0;cursor:zoom-out") as HTMLDivElement;
  // Due strati che si ingrandiscono con transform (scheda grafica, niente ridisegno a ogni fotogramma):
  // - il cofanetto, impaginato piccolo come in vetrina e ingrandito: la sua foto non ha più dettaglio di così;
  // - la foto ravvicinata, impaginata già alla misura finale e rimpicciolita all'inizio: arriva nitida.
  // Nessuno dei due supera la misura dello schermo, così anche Safari su iPhone li disegna senza fatica.
  const boxEl = shot.cloneNode(true) as HTMLElement;
  boxEl.querySelectorAll("[data-boxlight],[data-closeup]").forEach((n) => n.remove());
  boxEl.style.cssText = "filter:none;transform:none;transition:none;cursor:pointer";
  boxEl.querySelectorAll("img").forEach((i) => (i.style.filter = "none"));
  const closeEl = piece.cloneNode(true) as HTMLElement;
  closeEl.querySelectorAll("img").forEach((i) => (i.loading = "eager"));
  closeEl.style.cursor = "pointer";
  closeEl.setAttribute("role", "button");
  closeEl.setAttribute("aria-label", `Vedi gli orologi ${o.name} disponibili`);
  closeEl.tabIndex = 0;
  // penombra in basso per la didascalia, sopra l'orologio ingrandito
  const shade = el("div", "position:absolute;inset:auto 0 0 0;height:34%;background:linear-gradient(to top,rgba(11,16,13,.92),rgba(11,16,13,0));pointer-events:none;opacity:0");
  const caption = el(
    "div",
    `position:absolute;left:0;right:0;bottom:${phone ? 92 : 44}px;text-align:center;color:#f5f1e8;pointer-events:none;opacity:0;padding:0 16px`,
    `<div style="font-family:var(--font-cormorant),Georgia,serif;font-weight:300;font-size:${phone ? 34 : 46}px;line-height:1">Orologi <em style="color:#d7b368">${o.name}</em></div>` +
      // invito ben visibile: bottone dorato che pulsa, con la mano che tocca
      `<button type="button" data-cta class="zoom-cta" style="pointer-events:auto;margin-top:${phone ? 14 : 18}px;display:inline-flex;align-items:center;gap:10px;white-space:nowrap;border:0;border-radius:999px;background:#d7b368;color:#0b100d;padding:${phone ? "12px 18px" : "14px 26px"};font:600 ${phone ? 11 : 12}px/1.2 var(--font-montserrat),system-ui,sans-serif;letter-spacing:.16em;text-transform:uppercase;cursor:pointer">` +
      `<svg class="zoom-tap" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11"/><path d="M12 10.5V9a1.5 1.5 0 0 1 3 0v2"/><path d="M15 10.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L3.6 14.6a1.5 1.5 0 0 1 2.5-1.7L9 16"/><path d="M6 4.5 4.5 3M13 3.5 14.5 2M9.5 2V.5" opacity=".7"/></svg>` +
      `${phone ? "Tocca · vedi i disponibili" : "Tocca l'orologio · vedi quelli disponibili"}</button>`
  );
  const close = el(
    "button",
    `position:absolute;right:${phone ? 14 : 28}px;top:${phone ? 92 : 128}px;width:44px;height:44px;border-radius:999px;border:1px solid rgba(245,241,232,.35);background:rgba(11,16,13,.7);color:#f5f1e8;font-size:20px;line-height:1;cursor:pointer;opacity:0`,
    "&#x2715;"
  ) as HTMLButtonElement;
  close.setAttribute("aria-label", "Chiudi e torna alla vetrina");
  root.append(back, boxEl, closeEl, shade, caption, close);
  document.body.appendChild(root);

  // destinazione: orologio largo come nella pagina della marca, al centro dello schermo
  const T = vw >= 1024 ? 380 : vw >= 640 ? 340 : vw * 0.66;
  const k = T / c.width;
  const cx = vw / 2;
  const cy = phone ? vh * 0.45 : vh * 0.5 + 20;
  const endLeft = cx - (c.left - r.left + c.width / 2) * k;
  const endTop = cy - (c.top - r.top + c.height / 2) * k;
  const endC: Rect = { left: endLeft + (c.left - r.left) * k, top: endTop + (c.top - r.top) * k, width: c.width * k, height: c.height * k };
  place(boxEl, from);
  place(closeEl, endC);
  const opts = { duration: DURATION, easing: EASE, fill: "forwards" as const };
  const anims = [
    boxEl.animate([move(0, 0, 1), move(endLeft - r.left, endTop - r.top, k)], opts),
    closeEl.animate([move(c.left - endC.left, c.top - endC.top, 1 / k), move(0, 0, 1)], opts),
  ];
  // a ingrandimento finito, quando niente si muove (nasconderla costa un attimo di calcolo)
  anims[0].onfinish = () => {
    if (!done && under) under.style.visibility = "hidden";
  };
  let done = false;
  // quando il fondo è opaco la vetrina sotto non si vede: la nascondo, così il telefono non la ridisegna
  const under = shot.closest("section") as HTMLElement | null;
  back.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: "ease-in-out", fill: "forwards" });
  const reveal = () => under && (under.style.visibility = "");
  const show = { duration: 600, delay: DURATION - 300, easing: "ease-out", fill: "forwards" as const };
  [shade, caption, close].forEach((n) => n.animate([{ opacity: 0 }, { opacity: 1 }], show));
  lenis()?.stop();

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") shut();
    if ((e.key === "Enter" || e.key === " ") && document.activeElement === closeEl) enter();
  };
  const onWheel = () => shut();
  window.addEventListener("keydown", onKey);
  root.addEventListener("wheel", onWheel, { passive: true });
  let touchY = 0;
  root.addEventListener("touchstart", (e) => (touchY = e.touches[0].clientY), { passive: true });
  root.addEventListener("touchmove", (e) => Math.abs(e.touches[0].clientY - touchY) > 40 && shut(), { passive: true });

  const z: Zoom = {
    root,
    raf: 0,
    cleanup: () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(z.raf);
      lenis()?.start();
    },
  };
  const tick = () => {
    setHands(closeEl);
    z.raf = requestAnimationFrame(tick);
  };
  tick();
  window.__rlZoom = z;
  closeEl.focus({ preventScroll: true });

  // l'orologio torna nel cofanetto
  function shut() {
    if (done) return;
    done = true;
    reveal();
    [shade, caption, close].forEach((n) => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }));
    // stesso percorso all'indietro, un po' più veloce
    anims.forEach((a) => {
      a.reverse();
      a.updatePlaybackRate(-1.45);
    });
    back.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 900, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" });
    anims[0].onfinish = () => {
      z.cleanup();
      root.remove();
      if (window.__rlZoom === z) delete window.__rlZoom;
      o.onClose();
    };
  }
  // alla pagina degli orologi della marca: si apre in cima, con il cofanetto piccolo e la lista sotto
  function enter() {
    if (done) return;
    done = true;
    [boxEl, closeEl, shade, caption, close].forEach((n) => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-out", fill: "forwards" }));
    window.setTimeout(() => o.go(o.href), 340);
    window.setTimeout(() => {
      lenis()?.start();
      lenis()?.scrollTo(0, { immediate: true, force: true });
      window.scrollTo(0, 0);
      back.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: "ease-out", fill: "forwards" }).onfinish = () => {
        z.cleanup();
        root.remove();
        if (window.__rlZoom === z) delete window.__rlZoom;
      };
    }, 900);
  }
  boxEl.addEventListener("click", enter);
  closeEl.addEventListener("click", enter);
  caption.querySelector("[data-cta]")?.addEventListener("click", enter);
  back.addEventListener("click", shut);
  close.addEventListener("click", shut);
  return true;
}
