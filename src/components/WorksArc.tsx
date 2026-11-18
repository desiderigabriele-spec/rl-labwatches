"use client";
import { useInView } from "motion/react";
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
const ease = (k: number) => (k < 0.5 ? 8 * k ** 4 : 1 - (-2 * k + 2) ** 4 / 2);

/**
 * Prima e dopo dei lavori del laboratorio, da sfogliare sull'arco: si trascina, si usano le frecce o si tocca
 * un lavoro di lato. Sul lavoro davanti la linea del prima e dopo parte da sola e si trascina dal cerchio.
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
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / T);
      const seg = k * 3;
      const i = Math.min(2, Math.floor(seg));
      const f = seg - i;
      const e = f < 0.5 ? 2 * f * f : 1 - (-2 * f + 2) ** 2 / 2;
      setLine(keys[i] + (keys[i + 1] - keys[i]) * e);
      if (k < 1) lineAnim.current = requestAnimationFrame(step);
    };
    lineAnim.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(lineAnim.current);
  }, [cur, inView, setLine]);

  const go = useCallback(
    (target: number) => {
      cancelAnimationFrame(anim.current);
      cancelAnimationFrame(lineAnim.current);
      touched.current = false;
      const from = pos.current;
      const dist = target - from;
      const T = reduced.current ? 1 : 1000;
      const t0 = performance.now();
      setCur(mod(target)); // carica subito le foto vicine alla prossima
      const step = (t: number) => {
        const k = Math.min(1, (t - t0) / T);
        pos.current = from + dist * ease(k);
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
    d.vx = (e.clientX - d.lx) / Math.max(1, now - d.t);
    d.lx = e.clientX;
    d.t = now;
    pos.current = d.p - dx / (size() * 0.9);
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
    let steps = Math.round(delta);
    if (steps === 0 && (Math.abs(delta) > 0.18 || Math.abs(d.vx) > 0.35)) steps = Math.sign(delta || -d.vx);
    go(start + steps);
  };

  const w = works[cur];
  return (
    <div className="mx-auto w-full min-w-0 max-w-[min(100%,34rem)]">
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
        className="relative aspect-[1/0.92] w-full cursor-grab touch-pan-y select-none outline-none [perspective:1300px] [perspective-origin:50%_40%]"
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
                className="absolute left-[18%] top-[12%] aspect-square w-[64%] rounded-md will-change-transform"
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

      {/* il lavoro davanti e le frecce */}
      <div className="mt-2 flex items-center justify-between gap-4">
        <p key={w.slug} className="min-w-0 animate-[fade-up_0.5s_ease] text-sm" aria-live="polite">
          <b className="block font-display text-xl font-medium leading-tight">{w.watch}</b>
          <span className="text-mute">{w.job}</span>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button type="button" aria-label="Lavoro precedente" onClick={() => go(Math.round(pos.current) - 1)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper transition-colors hover:border-fg">
            ←
          </button>
          <span className="whitespace-nowrap px-1 text-center font-display text-lg tabular-nums text-gold">
            {String(cur + 1).padStart(2, "0")} / {String(N).padStart(2, "0")}
          </span>
          <button type="button" aria-label="Lavoro successivo" onClick={() => go(Math.round(pos.current) + 1)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper transition-colors hover:border-fg">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
