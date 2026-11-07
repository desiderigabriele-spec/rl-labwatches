"use client";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { formatPrice, spinFrames, type Product } from "@/data/products";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

/**
 * Vetrina con faretti: gli orologi stanno su un ripiano in una stanza buia.
 * Entrando nella sezione i faretti si accendono uno dopo l'altro; passando sopra un orologio
 * (o toccandolo) il suo faretto si accende, l'orologio si illumina e ruota, gli altri si abbassano.
 * Il clic apre la scheda. Funziona al meglio con fotogrammi 360° scontornati (sfondo trasparente).
 */

type Light = "off" | "idle" | "on";

function Slot({
  p,
  light,
  selected,
  onHover,
  onSelect,
  reduced,
}: {
  p: Product;
  light: Light;
  selected: boolean;
  onHover: (h: boolean) => void;
  onSelect: () => void;
  reduced: boolean;
}) {
  const frames = spinFrames(p);
  const cover = frames[0] ?? p.image;
  const [frame, setFrame] = useState(0);
  const accent = p.accent ?? "#c29a45";

  // ruota quando è illuminato; quando si spegne torna (veloce) a mostrare il fronte
  useEffect(() => {
    if (reduced || frames.length < 2) return;
    if (light === "on") {
      const t = window.setInterval(() => setFrame((f) => (f + 1) % frames.length), 95);
      return () => window.clearInterval(t);
    }
    const t = window.setInterval(() => setFrame((f) => (f === 0 ? 0 : (f + 1) % frames.length)), 35);
    return () => window.clearInterval(t);
  }, [light, reduced, frames.length]);

  const src = frames.length ? frames[frame] : cover;

  return (
    <div className="relative flex w-[62vw] shrink-0 snap-center flex-col items-center px-3 sm:w-auto sm:px-2">
      <button
        type="button"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`${p.name}${p.brand !== "Esempio" ? ` – ${p.brand}` : ""}: accendi la luce e mostra i dettagli`}
        className="group relative block w-full cursor-pointer outline-none"
      >
        {/* plafoniera del faretto */}
        <span className="relative z-10 mx-auto block h-3 w-12 rounded-b-full bg-[#1c211e] shadow-[0_1px_0_rgba(255,255,255,0.06)]">
          <span
            className="absolute inset-x-2 bottom-0 h-1 rounded-full transition-all duration-500"
            style={{ background: light === "on" ? "#fff4dc" : light === "idle" ? "#8a7f6a" : "#2a2e2b", boxShadow: light === "on" ? "0 0 18px 4px rgba(255,236,200,0.75)" : "none" }}
          />
        </span>

        {/* cono di luce */}
        <span
          aria-hidden
          className={`pointer-events-none absolute left-1/2 top-2 h-[92%] w-[150%] -translate-x-1/2 ${light === "on" && !reduced ? "lamp-on" : ""}`}
          style={{
            clipPath: "polygon(46% 0, 54% 0, 100% 100%, 0 100%)",
            background: "linear-gradient(to bottom, rgba(255,244,220,0.55), rgba(255,240,210,0.14) 55%, rgba(255,240,210,0) 92%)",
            filter: "blur(7px)",
            mixBlendMode: "screen",
            opacity: light === "on" ? 1 : light === "idle" ? 0.22 : 0,
            transition: "opacity 600ms ease",
          }}
        />

        {/* orologio */}
        <span className="relative mt-6 block aspect-[3/4] w-full">
          {/* bagliore del colore del quadrante */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[38%] h-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
            style={{ background: `radial-gradient(closest-side, ${accent}, transparent)`, filter: "blur(28px)", opacity: light === "on" ? 0.75 : light === "idle" ? 0.12 : 0 }}
          />
          {src && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={`${p.brand} ${p.name}`}
              draggable={false}
              className="relative h-full w-full select-none object-contain transition-[filter,transform] duration-700 ease-out"
              style={{
                filter: light === "on" ? "brightness(1.08) contrast(1.05) drop-shadow(0 18px 24px rgba(0,0,0,0.55))" : light === "idle" ? "brightness(0.5) saturate(0.75)" : "brightness(0.16) saturate(0.4)",
                transform: light === "on" ? "translateY(-8px) scale(1.05)" : "none",
              }}
            />
          )}
        </span>

        {/* chiazza di luce sul ripiano */}
        <span
          aria-hidden
          className="absolute -bottom-2 left-1/2 z-20 h-5 w-[80%] -translate-x-1/2 rounded-[50%] transition-opacity duration-700"
          style={{ background: "radial-gradient(closest-side, rgba(255,240,210,0.55), transparent)", opacity: light === "on" ? 1 : light === "idle" ? 0.15 : 0 }}
        />
      </button>

      {/* ripiano in pietra (continuo da un orologio all'altro) */}
      <span aria-hidden className="relative z-10 -mx-3 mt-1 block h-3 w-[calc(100%+1.5rem)] bg-gradient-to-b from-[#3d4440] to-[#161a17] shadow-[0_18px_40px_rgba(0,0,0,0.6)] sm:-mx-2 sm:w-[calc(100%+1rem)]" />

      {/* etichetta sotto il ripiano */}
      <div className="mt-10 text-center">
        <p className={`font-display text-2xl transition-colors duration-500 ${light === "on" ? "text-cream" : "text-cream/45"}`}>{p.name}</p>
        <p className={`tag-mono mt-2 text-xs transition-colors duration-500 ${light === "on" ? "text-gold-3" : "text-cream/35"}`}>
          {p.brand === "Esempio" ? "Esempio" : p.brand} · {p.year}
        </p>
      </div>
    </div>
  );
}

export default function Showcase({
  items,
  eyebrow = "La vetrina",
  title = "Orologi selezionati",
  intro = "Ogni pezzo è controllato e revisionato nel mio laboratorio prima della vendita. Passa sopra un orologio, o toccalo, per accendere la luce.",
}: {
  items: Product[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [introLit, setIntroLit] = useState(-1); // quanti faretti si sono già accesi all'ingresso
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // all'ingresso i faretti si accendono uno dopo l'altro, poi restano a luce soffusa
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setIntroLit(items.length);
      return;
    }
    let i = 0;
    const t = window.setInterval(() => {
      i++;
      setIntroLit(i);
      if (i > items.length) window.clearInterval(t);
    }, 320);
    return () => window.clearInterval(t);
  }, [inView, items.length, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lightOf = (i: number): Light => {
    if (introLit < 0) return "off";
    if (introLit <= items.length && i === introLit - 1) return "on"; // quello che si sta accendendo
    if (i >= introLit && introLit <= items.length) return "off";
    if (selected !== null) return i === selected || i === hover ? "on" : "off";
    if (hover !== null) return i === hover ? "on" : "idle";
    return "idle";
  };

  const sel = selected !== null ? items[selected] : null;

  return (
    <section ref={ref} className="guilloche sheen relative overflow-hidden bg-[#0b100d] py-20 text-cream sm:py-32" aria-labelledby="vetrina-titolo">
      {/* parete e ripiano */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,69,42,0.35),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow !text-gold-3">{eyebrow}</p>
          <h2 id="vetrina-titolo" className="mt-4 font-display text-4xl font-light sm:text-6xl">{title}</h2>
          <p className="mt-6 leading-relaxed text-cream/60">{intro}</p>
        </div>

        <div className="relative mt-16">
          <div className="-mx-4 flex snap-x snap-mandatory overflow-x-auto px-[19vw] pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:snap-none sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
            {items.map((p, i) => (
              <Slot
                key={p.slug}
                p={p}
                light={lightOf(i)}
                selected={selected === i}
                reduced={reduced}
                onHover={(h) => setHover((cur) => (h ? i : cur === i ? null : cur))}
                onSelect={() => setSelected((s) => (s === i ? null : i))}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {sel && (
            <motion.div
              key={sel.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-14 grid gap-10 border-t border-cream/10 pt-10 md:grid-cols-[1.2fr_1fr]"
            >
              <div>
                <p className="eyebrow !text-gold-3">{sel.brand}</p>
                <h3 className="mt-3 font-display text-4xl font-light sm:text-5xl">{sel.name}</h3>
                <div className="mt-4 flex flex-wrap gap-2 text-cream/60">
                  <span className="chip">Ref. {sel.ref}</span>
                  <span className="chip">{sel.year}</span>
                </div>
                <p className="mt-5 max-w-xl leading-relaxed text-cream/65">{sel.description}</p>
              </div>
              <div>
                <p className="tag-mono text-2xl text-gold-3">{formatPrice(sel.price)}</p>
                {sel.details && (
                  <dl className="mt-5 divide-y divide-cream/10 border-y border-cream/10 text-sm">
                    {sel.details.map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-6 py-3">
                        <dt className="text-cream/50">{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={`/shop/${sel.slug}`} className="btn !border-gold-3 !bg-gold-3 !text-green-2 hover:!bg-cream">Vedi a 360°</Link>
                  <a href={whatsappLink(`Buongiorno, vorrei informazioni su ${sel.brand} ${sel.name}.`)} target="_blank" rel="noopener noreferrer" className="btn !border-cream/40 !text-cream hover:!bg-cream hover:!text-green-2">
                    <WhatsAppIcon className="h-4 w-4" /> Chiedi informazioni
                  </a>
                  <button type="button" onClick={() => setSelected(null)} className="px-3 text-xs uppercase tracking-[0.2em] text-cream/50 hover:text-cream">
                    Chiudi
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
