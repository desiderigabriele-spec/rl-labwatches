"use client";
import { useInView } from "motion/react";
import { sinceScroll, whenScrollIdle } from "@/lib/scrollIdle";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { works } from "@/data/works";

const N = works.length;
/** versione da 480 px della stessa foto (scripts/varianti-immagini.mjs), per gli schermi che non chiedono di più */
const small = (src: string) => src.replace(/\.webp$/, "-480.webp");
/** distanza (anche con la virgola) del lavoro i da quello davanti, sul giro: -N/2..N/2 */
const wrapD = (i: number, p: number) => {
  let d = (((i - p) % N) + N) % N;
  if (d > N / 2) d -= N;
  return d;
};
const mod = (k: number) => ((k % N) + N) % N;

/**
 * "Arco di galleria": i lavori stanno su un arco largo come quadri in una galleria curva. Restano dritti,
 * quelli ai lati sono più piccoli, lontani e spenti; quello scelto viene avanti al centro.
 * La posizione dipende solo dalla distanza d dal lavoro davanti, così trascinando l'arco scorre in continuo.
 */
function arc(d: number) {
  const a = Math.abs(d);
  const ang = d * 0.42;
  const p = Math.min(a, 1);
  return {
    transform: `translateX(${Math.sin(ang) * 118}%) translateY(${(1 - Math.cos(ang)) * 70}%) translateZ(${-(1 - Math.cos(ang)) * 520 - p * 60}px) rotateZ(${d * 3}deg) rotateY(${-d * 8}deg)`,
    opacity: a > 2.8 ? 0 : 1 - Math.max(0, a - 1.8),
    z: 100 - Math.round(a * 10),
    shade: p * 0.1,
    sat: 1 - p * 0.5,
  };
}

/**
 * Prima e dopo dei lavori del laboratorio. In alto il nome del lavoro e i cerchietti che scorrono da soli;
 * sotto l'arco, da sfogliare trascinando, toccando un lavoro di lato o un cerchietto (o con le frecce della tastiera). Sul lavoro davanti la linea del prima e dopo parte da sola e si trascina dal cerchio.
 * Si caricano solo le foto vicine a quella davanti.
 */
export default function WorksArc() {
  const stage = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const pos = useRef(0);
  const line = useRef(50);
  const anim = useRef(0);
  const lineAnim = useRef(0);
  const touched = useRef(false);
  const [cur, setCur] = useState(0);
  const inView = useInView(stage, { amount: 0.4 });
  const reduced = useRef(false);

  const paint = useCallback(() => {
    cards.current.forEach((el, i) => {
      if (!el) return;
      const d = wrapD(i, pos.current);
      const s = arc(d);
      el.style.transform = s.transform;
      el.style.opacity = String(s.opacity);
      el.style.zIndex = String(s.z);
      el.style.visibility = s.opacity <= 0 ? "hidden" : "visible";
      el.style.filter = s.sat < 0.999 ? `saturate(${s.sat})` : "none";
      const shade = el.querySelector<HTMLElement>("[data-shade]");
      if (shade) shade.style.opacity = String(s.shade);
    });
  }, []);

  const setLine = useCallback((x: number) => {
    line.current = x;
    const el = cards.current[mod(Math.round(pos.current))];
    const before = el?.querySelector<HTMLElement>("[data-before]");
    const ln = el?.querySelector<HTMLElement>("[data-line]");
    if (before) before.style.clipPath = `inset(0 ${100 - x}% 0 0)`;
    if (ln) ln.style.left = `${x}%`;
  }, []);

  useLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    paint();
  }, [paint]);

  // la linea del lavoro davanti mostra da sola prima e dopo, quando la sezione è sullo schermo
  useEffect(() => {
    setLine(50);
    if (!inView || touched.current || reduced.current) return;
    const keys = [50, 84, 16, 50];
    const T = 3400;
    let t0 = 0;
    let prev = 0;
    const step = (t: number) => {
      // se intanto si riprende a scorrere, la linea si ferma dov'è (niente ridisegno della foto) e riparte dopo
      if (sinceScroll() < 150) {
        t0 += t - prev;
        prev = t;
        lineAnim.current = requestAnimationFrame(step);
        return;
      }
      prev = t;
      const k = Math.min(1, (t - t0) / T);
      const seg = k * 3;
      const i = Math.min(2, Math.floor(seg));
      const f = seg - i;
      const e = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2;
      setLine(keys[i] + (keys[i + 1] - keys[i]) * e);
      if (k < 1) lineAnim.current = requestAnimationFrame(step);
    };
    // parte quando la pagina si ferma: ridisegnare la foto a ogni fotogramma mentre il dito scorre farebbe scattare
    const cancel = whenScrollIdle(() => {
      t0 = prev = performance.now();
      lineAnim.current = requestAnimationFrame(step);
    }, 300);
    return () => {
      cancel();
      cancelAnimationFrame(lineAnim.current);
    };
  }, [cur, inView, setLine]);

  const go = useCallback(
    (target: number) => {
      cancelAnimationFrame(anim.current);
      cancelAnimationFrame(lineAnim.current);
      touched.current = false;
      const from = pos.current;
      const dist = target - from;
      // parte subito e frena alla fine: dopo uno swipe l'arco "scatta" verso il lavoro, non si trascina
      const T = reduced.current ? 1 : Math.min(900, 380 + 140 * Math.abs(dist));
      const t0 = performance.now();
      setCur(mod(target)); // carica subito le foto vicine alla prossima
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / T);
        pos.current = from + dist * (1 - (1 - k) ** 3);
        paint();
        if (k < 1) anim.current = requestAnimationFrame(step);
        else {
          pos.current = target;
          paint();
        }
      };
      anim.current = requestAnimationFrame(step);
    },
    [paint]
  );

  // trascinamento: dal cerchio muove la linea, altrove sfoglia l'arco
  const drag = useRef<null | { mode: "line"; r: DOMRect } | { mode: "swipe"; x: number; p: number; t: number; vx: number; lx: number; moved: boolean; card: number }>(null);
  const size = () => cards.current[0]?.offsetWidth || 300;
  const onDown = (e: React.PointerEvent) => {
    const el = cards.current[mod(Math.round(pos.current))];
    const r = el?.getBoundingClientRect();
    const inside = r && e.clientX > r.left && e.clientX < r.right && e.clientY > r.top && e.clientY < r.bottom;
    if (r && inside && Math.abs(e.clientX - (r.left + (line.current / 100) * r.width)) < 30) {
      drag.current = { mode: "line", r };
      touched.current = true;
      cancelAnimationFrame(lineAnim.current);
    } else {
      const card = cards.current.findIndex((c) => c && c.contains(e.target as Node));
      drag.current = { mode: "swipe", x: e.clientX, p: pos.current, t: performance.now(), vx: 0, lx: e.clientX, moved: false, card };
      cancelAnimationFrame(anim.current);
    }
    stage.current?.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    if (d.mode === "line") {
      setLine(Math.max(0, Math.min(100, ((e.clientX - d.r.left) / d.r.width) * 100)));
      return;
    }
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    const now = performance.now();
    // velocità del dito, smussata sugli ultimi movimenti (px/ms)
    d.vx = d.vx * 0.35 + ((e.clientX - d.lx) / Math.max(1, now - d.t)) * 0.65;
    d.lx = e.clientX;
    d.t = now;
    // l'arco segue il dito più di una card intera: basta un trascinamento corto per sfogliare
    pos.current = d.p - dx / (size() * 0.62);
    paint();
  };
  const onUp = () => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.mode !== "swipe") return;
    if (!d.moved && d.card >= 0 && d.card !== mod(Math.round(pos.current))) {
      go(Math.round(pos.current) + wrapD(d.card, Math.round(pos.current)));
      return;
    }
    // un lavoro alla volta: basta un piccolo trascinamento o un colpo veloce; trascinando a lungo se ne passano di più
    const start = Math.round(d.p);
    const delta = pos.current - d.p;
    // inerzia: un colpo veloce fa scorrere più lavori (fino a 3), un tocco lento solo quello accanto
    const fling = (-d.vx * 260) / (size() * 0.62);
    let steps = Math.round(delta + fling);
    if (steps === 0 && (Math.abs(delta) > 0.12 || Math.abs(d.vx) > 0.25)) steps = Math.sign(delta || -d.vx);
    steps = Math.max(-3, Math.min(3, steps));
    go(start + steps);
  };

  const w = works[cur];
  return (
    <div className="mx-auto w-full min-w-0 max-w-[min(100%,34rem)]">
      {/* il lavoro davanti: che orologio e che lavoro */}
      <p key={w.slug} className="animate-[fade-up_0.5s_ease] text-center" aria-live="polite">
        <span className="block text-[0.66rem] font-medium uppercase tracking-[0.22em] text-gold">{w.watch}</span>
        <span className="mt-1 block font-display text-2xl leading-tight sm:text-[1.7rem]">{w.job}</span>
      </p>
      <div
        ref={stage}
        role="group"
        aria-roledescription="carosello"
        aria-label="Lavori prima e dopo"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(Math.round(pos.current) + 1);
          if (e.key === "ArrowLeft") go(Math.round(pos.current) - 1);
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative mt-3 aspect-[1/0.8] w-full cursor-grab lg:[mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)] touch-pan-y select-none outline-none [perspective:1300px] [perspective-origin:50%_40%]"
      >
        <div className="absolute inset-0 [transform-style:preserve-3d]">
          {works.map((wk, i) => {
            const d = Math.abs(wrapD(i, cur));
            const near = d <= 3;
            const front = i === cur;
            return (
              <div
                key={wk.slug}
                ref={(el) => {
                  cards.current[i] = el;
                }}
                aria-hidden={!front}
                className="absolute left-[18%] top-[4%] aspect-square w-[64%] rounded-md will-change-transform"
              >
                {/* stampa con il passe-partout avorio e il filo d'oro */}
                <div className="absolute inset-0 overflow-hidden rounded-md border-[9px] border-[#f8f2e4] bg-paper-2 shadow-[0_34px_60px_-26px_rgba(18,32,26,0.5),0_2px_6px_rgba(18,32,26,0.08)]">
                  {near && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={wk.after} srcSet={`${small(wk.after)} 480w, ${wk.after} 900w`} sizes="(min-width: 1024px) 340px, 60vw" loading="lazy" decoding="async" alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
                  )}
                  {front && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-before src={wk.before} srcSet={`${small(wk.before)} 480w, ${wk.before} 900w`} sizes="(min-width: 1024px) 340px, 60vw" loading="lazy" decoding="async" alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" style={{ clipPath: "inset(0 50% 0 0)" }} />
                      <span data-line aria-hidden className="absolute bottom-0 top-0 w-px bg-paper shadow-[0_0_0_1px_rgba(0,0,0,0.25)]" style={{ left: "50%" }}>
                        <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-fg text-paper shadow-lg">↔</span>
                      </span>
                      <span aria-hidden className="pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-paper/85 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-[#8a7350] backdrop-blur">
                        Prima
                      </span>
                      <span aria-hidden className="pointer-events-none absolute bottom-2.5 right-2.5 rounded-full bg-paper/85 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-green backdrop-blur">
                        Dopo
                      </span>
                    </>
                  )}
                  <span aria-hidden className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(134,102,31,0.45)]" />
                  <span data-shade aria-hidden className="pointer-events-none absolute inset-0 bg-[#f6efe0] opacity-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* frecce per sfogliare, più comode del trascinamento */}
      <div className="mt-1 flex items-center justify-center gap-5">
        <button type="button" aria-label="Lavoro precedente" onClick={() => go(Math.round(pos.current) - 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-lg transition-colors hover:border-fg active:bg-paper-2">
          ←
        </button>
        <span className="whitespace-nowrap font-display text-lg tabular-nums text-gold">
          {String(cur + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
        </span>
        <button type="button" aria-label="Lavoro successivo" onClick={() => go(Math.round(pos.current) + 1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-lg transition-colors hover:border-fg active:bg-paper-2">
          →
        </button>
      </div>
    </div>
  );
}
