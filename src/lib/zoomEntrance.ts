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
type Zoom = { root: HTMLDivElement; back: HTMLDivElement; content: HTMLElement; from: Rect; anim: Animation; raf: number; cleanup: () => void };
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
export function openZoom(shot: HTMLElement, o: { name: string; href: string; go: (href: string) => void; onClose: () => void }) {
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
  const content = shot.cloneNode(true) as HTMLElement;
  content.querySelectorAll("[data-boxlight]").forEach((n) => n.remove());
  content.style.cssText = "position:absolute;transform:none;filter:none;margin:0;cursor:pointer";
  Object.assign(content.style, px(from));
  content.setAttribute("role", "button");
  content.setAttribute("aria-label", `Vedi gli orologi ${o.name} disponibili`);
  content.tabIndex = 0;
  // penombra in basso per la didascalia, sopra l'orologio ingrandito
  const shade = el("div", "position:absolute;inset:auto 0 0 0;height:34%;background:linear-gradient(to top,rgba(11,16,13,.92),rgba(11,16,13,0));pointer-events:none;opacity:0");
  const caption = el(
    "div",
    `position:absolute;left:0;right:0;bottom:${phone ? 92 : 44}px;text-align:center;color:#f5f1e8;pointer-events:none;opacity:0;padding:0 16px`,
    `<div style="font-family:var(--font-cormorant),Georgia,serif;font-weight:300;font-size:${phone ? 34 : 46}px;line-height:1">Orologi <em style="color:#d7b368">${o.name}</em></div>` +
      `<div style="margin-top:10px;font-size:11px;letter-spacing:.24em;text-transform:uppercase;color:rgba(245,241,232,.75)">Tocca l'orologio per vedere quelli disponibili</div>`
  );
  const close = el(
    "button",
    `position:absolute;right:${phone ? 14 : 28}px;top:${phone ? 92 : 128}px;width:44px;height:44px;border-radius:999px;border:1px solid rgba(245,241,232,.35);background:rgba(11,16,13,.55);color:#f5f1e8;font-size:20px;line-height:1;cursor:pointer;opacity:0;backdrop-filter:blur(6px)`,
    "&#x2715;"
  ) as HTMLButtonElement;
  close.setAttribute("aria-label", "Chiudi e torna alla vetrina");
  root.append(back, content, shade, caption, close);
  document.body.appendChild(root);

  // destinazione: orologio largo come nella pagina della marca, al centro dello schermo
  const T = vw >= 1024 ? 380 : vw >= 640 ? 340 : vw * 0.66;
  const k = T / c.width;
  const cx = vw / 2;
  const cy = phone ? vh * 0.45 : vh * 0.5 + 20;
  const end: Rect = {
    left: cx - (c.left - r.left + c.width / 2) * k,
    top: cy - (c.top - r.top + c.height / 2) * k,
    width: r.width * k,
    height: r.height * k,
  };
  const anim = content.animate([px(from), px(end)], { duration: DURATION, easing: EASE, fill: "forwards" });
  back.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: "ease-in-out", fill: "forwards" });
  const show = { duration: 600, delay: DURATION - 300, easing: "ease-out", fill: "forwards" as const };
  [shade, caption, close].forEach((n) => n.animate([{ opacity: 0 }, { opacity: 1 }], show));
  lenis()?.stop();

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") shut();
    if ((e.key === "Enter" || e.key === " ") && document.activeElement === content) enter();
  };
  const onWheel = () => shut();
  window.addEventListener("keydown", onKey);
  root.addEventListener("wheel", onWheel, { passive: true });
  let touchY = 0;
  root.addEventListener("touchstart", (e) => (touchY = e.touches[0].clientY), { passive: true });
  root.addEventListener("touchmove", (e) => Math.abs(e.touches[0].clientY - touchY) > 40 && shut(), { passive: true });

  const z: Zoom = {
    root,
    back,
    content,
    from,
    anim,
    raf: 0,
    cleanup: () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(z.raf);
      lenis()?.start();
    },
  };
  const tick = () => {
    setHands(content);
    z.raf = requestAnimationFrame(tick);
  };
  tick();
  window.__rlZoom = z;
  content.focus({ preventScroll: true });

  let done = false;
  // l'orologio torna nel cofanetto
  function shut() {
    if (done) return;
    done = true;
    const cur = content.getBoundingClientRect();
    z.anim.cancel();
    const out = { duration: 900, easing: "cubic-bezier(.4,0,.2,1)", fill: "forwards" as const };
    [shade, caption, close].forEach((n) => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }));
    content.animate([px({ left: cur.left, top: cur.top, width: cur.width, height: cur.height }), px(from)], out);
    back.animate([{ opacity: 1 }, { opacity: 0 }], out).onfinish = () => {
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
    [content, shade, caption, close].forEach((n) => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 380, easing: "ease-out", fill: "forwards" }));
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
  content.addEventListener("click", enter);
  back.addEventListener("click", shut);
  close.addEventListener("click", shut);
  return true;
}
