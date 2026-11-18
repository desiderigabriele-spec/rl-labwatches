"use client";
import { useInView } from "motion/react";
import { useEffect, useRef } from "react";
import Reveal from "./Reveal";
import { GOOGLE_REVIEWS_URL, reviews, type Review } from "@/data/reviews";

/**
 * Recensioni vere da Google su un solo nastro che scorre da solo, all'infinito. Si può anche scorrere col dito
 * (o con la rotellina) e con le frecce sotto: appena lo tocchi si ferma, così si legge con calma.
 * Ogni scheda ha il logo Google e il link alla scheda originale per verificarla.
 */

function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`tracking-[0.12em] text-[#fbbc04] ${className}`} aria-label="5 stelle su 5">
    ★★★★★
  </span>
);

function Text({ r }: { r: Review }) {
  if (!r.highlight || !r.text.includes(r.highlight)) return <>{r.text}</>;
  const [before, after] = r.text.split(r.highlight);
  return (
    <>
      {before}
      <mark className="bg-transparent font-medium text-fg [background-image:linear-gradient(transparent_62%,rgba(189,146,60,0.28)_62%)]">{r.highlight}</mark>
      {after}
    </>
  );
}

function Card({ r }: { r: Review }) {
  return (
    <figure className="flex w-[19.5rem] shrink-0 flex-col rounded-2xl border border-line bg-paper p-6 shadow-[0_10px_30px_rgba(18,32,26,0.06)] sm:w-[23rem]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-base font-medium text-white" style={{ background: r.color }} aria-hidden>
          {r.initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-fg">{r.author}</span>
          <span className="block text-xs text-mute">{r.localGuide ? "Local Guide su Google" : "Cliente su Google"}</span>
        </span>
        <GoogleG className="h-5 w-5 shrink-0" />
      </div>
      <Stars className="mt-4 text-lg" />
      <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-mute">
        <Text r={r} />
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-xs text-mute">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1a73e8]" fill="currentColor" aria-hidden>
          <path d="M12 2 9.6 4.3 6.3 4l-.6 3.3L2.8 9l1.5 3-1.5 3 2.9 1.7.6 3.3 3.3-.3L12 22l2.4-2.3 3.3.3.6-3.3 2.9-1.7-1.5-3 1.5-3-2.9-1.7-.6-3.3-3.3.3zm-1.2 13.6-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4z" />
        </svg>
        Recensione pubblicata su Google
      </figcaption>
    </figure>
  );
}

/** nastro infinito: tre copie delle schede, si scorre su quella in mezzo e al bordo si salta di una copia */
function Strip() {
  const box = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { amount: 0.2 });
  const stopped = useRef(false);
  const x = useRef(0);
  const written = useRef(0);
  const copy = useRef(0);
  const settle = useRef(0);

  useEffect(() => {
    const measure = () => {
      const el = box.current;
      const ul = list.current;
      if (!el || !ul) return;
      const prev = copy.current;
      copy.current = ul.scrollWidth / 3;
      x.current = prev ? (x.current / prev) * copy.current : copy.current;
      el.scrollLeft = x.current;
      written.current = el.scrollLeft;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      const el = box.current;
      if (el && !stopped.current && copy.current) {
        x.current += dt * 0.03;
        if (x.current > copy.current * 1.5) x.current -= copy.current;
        el.scrollLeft = x.current;
        written.current = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  const stop = () => {
    stopped.current = true;
  };
  // scorrendolo a mano resta infinito: a scorrimento finito, se si è vicini al bordo si salta di una copia
  const onScroll = () => {
    // scorrimento che non è il nostro (dito, rotellina, inerzia): si ferma
    if (box.current && Math.abs(box.current.scrollLeft - written.current) > 2) stop();
    if (!stopped.current) return;
    window.clearTimeout(settle.current);
    settle.current = window.setTimeout(() => {
      const el = box.current;
      if (!el || !copy.current) return;
      if (el.scrollLeft < copy.current * 0.5) el.scrollLeft += copy.current;
      else if (el.scrollLeft > copy.current * 1.5) el.scrollLeft -= copy.current;
      x.current = written.current = el.scrollLeft;
    }, 160);
  };
  const step = (dir: number) => {
    stop();
    const card = list.current?.firstElementChild as HTMLElement | null;
    const w = card ? card.offsetWidth + 20 : 340;
    box.current?.scrollBy({ left: dir * w, behavior: "smooth" });
  };

  return (
    <>
      <div
        ref={box}
        onPointerDown={stop}
        onWheel={stop}
        onTouchStart={stop}
        onScroll={onScroll}
        className="overflow-x-auto py-3 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label="Recensioni dei clienti"
      >
        <div ref={list} className="flex w-max gap-5 px-6">
          {[0, 1, 2].map((c) =>
            reviews.map((r, i) => (
              <div key={`${c}-${i}`} aria-hidden={c !== 1} className="flex">
                <Card r={r} />
              </div>
            ))
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <button type="button" aria-label="Recensione precedente" onClick={() => step(-1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-lg transition-colors hover:border-fg active:bg-paper-2">
          ←
        </button>
        <button type="button" aria-label="Recensione successiva" onClick={() => step(1)} className="grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-lg transition-colors hover:border-fg active:bg-paper-2">
          →
        </button>
      </div>
    </>
  );
}

export default function Reviews() {
  return (
    <section className="overflow-hidden border-t border-line bg-paper-2 py-16 sm:py-28" aria-labelledby="recensioni">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Recensioni Google</p>
            <h2 id="recensioni" className="mt-4 font-display text-4xl font-light sm:text-6xl">
              Le parole dei miei <em className="text-gold">clienti</em>
            </h2>
          </div>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 self-start rounded-2xl border border-line bg-paper px-5 py-4 shadow-sm transition hover:border-gold-2 sm:self-auto"
          >
            <GoogleG className="h-9 w-9" />
            <span>
              <Stars className="block text-xl leading-none" />
              <span className="mt-1.5 block text-sm text-mute">
                Leggi tutte le recensioni <span className="text-green transition group-hover:translate-x-0.5">→</span>
              </span>
            </span>
          </a>
        </Reveal>
      </div>
      <div className="mt-10 sm:mt-14">
        <Strip />
      </div>
    </section>
  );
}
