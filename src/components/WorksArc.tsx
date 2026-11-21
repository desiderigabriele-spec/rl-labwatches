"use client";
import { useInView } from "motion/react";
import { sinceScroll, whenScrollIdle } from "@/lib/scrollIdle";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { works } from "@/data/works";

const N = works.length;
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
      {/* i cerchietti (metà prima e metà dopo) scorrono da soli all'infinito; si fermano se li tocchi, toccandone uno l'arco va lì */}
      <Reel cur={cur} onPick={(k) => go(Math.round(pos.current) + wrapD(k, Math.round(pos.current)))} />
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
                    <img src={wk.after} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
                  )}
                  {front && (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img data-before src={wk.before} alt="" draggable={false} className="pointer-events-none absolute inset-0 h-full w-full object-cover" style={{ clipPath: "inset(0 50% 0 0)" }} />
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

/**
 * Miniature dei lavori (metà prima, metà dopo) in un nastro che scorre da solo, all'infinito (tre copie: si
 * scorre su quella in mezzo e si salta di una copia al bordo, senza che si veda). Appena lo tocchi o lo scorri
 * col dito si ferma, così si sceglie bene, e riparte da solo dopo 5 secondi; si muove solo quando è sullo schermo.
 */
function Reel({ cur, onPick }: { cur: number; onPick: (k: number) => void }) {
  const reel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const inView = useInView(reel, { amount: 0.2 });
  const paused = useRef(false);
  const x = useRef(0);
  const written = useRef(0);
  const copy = useRef(0);

  useEffect(() => {
    const el = reel.current;
    const ul = list.current;
    if (!el || !ul) return;
    const measure = () => {
      copy.current = ul.scrollWidth / 3;
      if (!x.current) x.current = copy.current;
      el.scrollLeft = x.current;
      written.current = el.scrollLeft;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    // su telefono e tablet i tondini non scorrono da soli: si sfogliano col dito
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      const el = reel.current;
      if (el && !paused.current && copy.current) {
        x.current += dt * 0.028;
        if (x.current > copy.current * 1.5) x.current -= copy.current;
        el.scrollLeft = x.current;
        written.current = el.scrollLeft; // quello che il browser ha davvero applicato (arrotonda)
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  // appena lo tocchi o lo scorri si ferma, così si sceglie con calma; se per 5 secondi non lo tocchi più
  // riprende a scorrere da solo, da dove l'hai lasciato
  const idle = useRef(0);
  const settle = useRef(0);
  const pause = () => {
    paused.current = true;
    window.clearTimeout(idle.current);
    idle.current = window.setTimeout(() => {
      if (reel.current) x.current = written.current = reel.current.scrollLeft;
      paused.current = false;
    }, 5000);
  };
  useEffect(
    () => () => {
      window.clearTimeout(idle.current);
      window.clearTimeout(settle.current);
    },
    []
  );
  const onScroll = () => {
    const el = reel.current;
    if (!el || !copy.current) return;
    // lo scorrimento non è il nostro (dito, rotellina, inerzia dopo il dito): si ferma
    if (Math.abs(el.scrollLeft - written.current) > 2) pause();
    if (!paused.current) return;
    x.current = el.scrollLeft;
    // resta infinito anche a mano: a scorrimento finito, vicino al bordo salta di una copia (senza che si veda)
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const v = el.scrollLeft;
      if (v < copy.current * 0.5) el.scrollLeft = v + copy.current;
      else if (v > copy.current * 1.5) el.scrollLeft = v - copy.current;
      x.current = written.current = el.scrollLeft;
    }, 180);
  };

  return (
    <div className="relative mt-4">
      <div
        ref={reel}
        onPointerDown={pause}
        onWheel={pause}
        onTouchStart={pause}
        onScroll={onScroll}
        // niente mask-image qui: su iPhone (WebKit) una maschera su un elemento che scorre gli fa perdere tocchi e scorrimento
        className="overflow-x-auto [scrollbar-width:none] [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden"
      >
        <ul ref={list} className="flex w-max gap-3 px-6 py-1.5" aria-label="Lavori">
          {[0, 1, 2].map((c) =>
            works.map((wk, k) => (
              <li key={`${c}-${wk.slug}`}>
                <button
                  type="button"
                  tabIndex={c === 1 ? 0 : -1}
                  aria-hidden={c !== 1}
                  aria-label={`${wk.watch}: ${wk.job}`}
                  aria-current={k === cur}
                  onClick={() => {
                    onPick(k);
                    pause();
                  }}
                  className={`block h-12 w-12 overflow-hidden rounded-full bg-paper-2 transition duration-300 ${
                    k === cur ? "scale-105 opacity-100 shadow-[0_0_0_2px_var(--color-paper),0_0_0_3.5px_var(--color-gold-2)]" : "opacity-60 shadow-[0_0_0_1px_var(--color-line)] hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/lavori/mini/${wk.slug}.webp`} alt="" loading="lazy" draggable={false} className="pointer-events-none h-full w-full object-cover" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
      {/* sfumatura ai bordi: veli del colore della pagina, che non intercettano i tocchi */}
      <span aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-paper to-transparent" />
      <span aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-paper to-transparent" />
    </div>
  );
}
