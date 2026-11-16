"use client";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { brands, type Brand } from "@/data/brands";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";
import BrandLogo from "./BrandLogo";
import { openZoom } from "@/lib/zoomEntrance";
import BoxPhoto from "./BoxPhoto";
import Spotlight, { BoxLight, LightPool } from "./Spotlight";

/**
 * Vetrina con faretti, una nicchia per marca: su ogni ripiano c'è il modello più famoso della marca,
 * legato al cuscino di un cofanetto. Entrando nella sezione i faretti si accendono uno dopo l'altro;
 * passando sopra (o toccando) una nicchia la sua luce si accende e le altre si abbassano.
 * Il clic apre la scheda della marca con il link agli orologi di quella marca.
 * La foto (scontornata, sfondo trasparente) è brands[].vetrina; finché manca si vede un cofanetto con il logo.
 */

type Light = "off" | "idle" | "on";

/** Cofanetto disegnato: segnaposto finché non c'è la foto dell'orologio */
function Cofanetto({ brand, lit }: { brand: Brand; lit: boolean }) {
  const leather = "linear-gradient(160deg,#145238 0%,#0b3424 45%,#06231a 100%)";
  return (
    <span aria-hidden className="absolute inset-0 transition-[filter] duration-700" style={{ filter: lit ? "none" : "brightness(0.55)" }}>
      {/* coperchio aperto, con la fodera in raso */}
      <span className="absolute inset-x-[10%] top-[8%] h-[46%] rounded-t-[14px] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" style={{ background: leather }}>
        <span className="absolute inset-x-[7%] bottom-0 top-[7%] rounded-t-[10px]" style={{ background: "linear-gradient(180deg,#f3ead8 0%,#dccfb2 70%,#c8b993 100%)" }}>
          <span className="absolute inset-x-0 top-[16%] text-center font-display text-[0.95rem] tracking-[0.25em] text-[#a8843c]">RL</span>
          <span className="absolute left-1/2 top-[30%] h-px w-[26%] -translate-x-1/2 bg-[#a8843c]/60" />
        </span>
      </span>
      {/* fondo interno */}
      <span className="absolute inset-x-[8%] top-[50%] h-[14%] rounded-[6px]" style={{ background: "linear-gradient(180deg,#b9a780,#e6dac0)" }} />
      {/* cuscino in camoscio, con il logo della marca */}
      <span
        className="absolute inset-x-[20%] top-[40%] flex h-[26%] items-center justify-center rounded-[42%] shadow-[0_10px_18px_rgba(0,0,0,0.35),inset_0_-6px_12px_rgba(120,98,60,0.35),inset_0_4px_8px_rgba(255,255,255,0.5)]"
        style={{ background: "radial-gradient(ellipse at 50% 35%,#f4ead6,#dcccab 75%)" }}
      >
        <BrandLogo brand={brand} className={`text-[#1b2a22]/80 ${brand.ratio > 3 ? "h-[22%]" : "h-[46%]"}`} />
      </span>
      {/* fronte della scatola, in pelle, con filetto e chiusura in oro */}
      <span className="absolute inset-x-[5%] bottom-[5%] top-[58%] rounded-b-[12px] rounded-t-[4px] shadow-[0_20px_30px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.15)]" style={{ background: leather }}>
        <span className="absolute inset-x-[6%] top-[16%] h-px bg-[#c29a45]/70" />
        <span className="absolute left-1/2 top-[8%] h-[18%] w-[9%] -translate-x-1/2 rounded-b-[3px] bg-gradient-to-b from-[#e2c27a] to-[#a8843c]" />
      </span>
    </span>
  );
}

function Slot({
  brand,
  light,
  selected,
  onHover,
  onSelect,
  reduced,
  running,
}: {
  running: boolean;
  brand: Brand;
  light: Light;
  selected: boolean;
  onHover: (h: boolean) => void;
  onSelect: () => void;
  reduced: boolean;
}) {
  const photo: string = brand.vetrina;
  const lvl = light === "on" ? 1 : light === "idle" ? 0.22 : 0;
  return (
    <div data-slot className="relative flex w-[78vw] shrink-0 snap-center flex-col items-center px-3 sm:w-[46vw] lg:w-auto lg:px-6">
      <button
        type="button"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={selected ? `${brand.name}: entra e guarda gli orologi in vendita` : `${brand.name}: accendi la luce`}
        className="group relative block w-full cursor-pointer outline-none"
      >
        {/* faretto: plafoniera, fascio conico e pulviscolo */}
        <Spotlight level={lvl} flicker={light === "on" && !reduced} />

        {/* cofanetto con l'orologio */}
        <span className="relative mt-6 block aspect-[840/1020] w-full">
          {/* bagliore del colore del quadrante */}
          <span
            aria-hidden
            className="absolute left-1/2 top-[45%] h-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
            style={{ background: `radial-gradient(closest-side, ${brand.accent}, transparent)`, filter: "blur(28px)", opacity: light === "on" ? 0.6 : light === "idle" ? 0.1 : 0 }}
          />
          <span
            data-boxshot
            className="absolute inset-0 transition-[filter,transform] duration-700 ease-out"
            style={{
              filter: light === "on" ? "brightness(1.06) contrast(1.04)" : light === "idle" ? "brightness(0.55) saturate(0.75)" : "brightness(0.16) saturate(0.4)",
              // secondo tocco: si "entra" nel cofanetto, ingrandendo verso il quadrante
              transform: light === "on" ? "translateY(-6px) scale(1.04)" : "none",
            }}
          >
            {photo ? (
              <>
                <BoxPhoto brand={brand} run={running && !reduced} />
                <BoxLight src={photo} level={lvl} />
              </>
            ) : (
              <span className="absolute inset-x-[15%] bottom-0 top-[24%]">
                <Cofanetto brand={brand} lit={light === "on"} />
              </span>
            )}
          </span>
        </span>

        {/* pozza di luce sul ripiano e ombra del cofanetto */}
        <LightPool level={lvl} />
      </button>

      {/* ripiano in pietra (continuo da una nicchia all'altra) */}
      <span aria-hidden className="relative z-10 -mx-3 mt-1 block h-3 w-[calc(100%+1.5rem)] bg-gradient-to-b from-[#3d4440] to-[#161a17] shadow-[0_18px_40px_rgba(0,0,0,0.6)] lg:-mx-6 lg:w-[calc(100%+3rem)]" />

      {/* targhetta sotto il ripiano: logo della marca */}
      <div className="mt-9 flex flex-col items-center text-center">
        <span className="flex h-9 items-center">
          <BrandLogo brand={brand} className={`transition-colors duration-500 ${light === "on" ? "text-cream" : "text-cream/40"} ${brand.ratio > 3 ? "h-4" : "h-8"}`} />
        </span>
        <p className={`mt-3 h-4 text-[0.65rem] uppercase tracking-[0.22em] text-gold-3 transition-opacity duration-500 ${selected && !brand.vicino ? "opacity-100" : "opacity-0"}`}>Tocca di nuovo per entrare</p>
      </div>
    </div>
  );
}

export default function Showcase({
  eyebrow = "La vetrina",
  title = "Scegli la tua marca",
  intro = "Ogni orologio in vendita è selezionato e revisionato nel mio laboratorio. Tocca un cofanetto: si accende la luce e l\u2019orologio si avvicina. Toccalo ancora per vedere gli orologi disponibili di quella marca.",
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
}) {
  const items = brands;
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const visible = useInView(ref, { amount: 0.05 }); // le lancette girano solo con la vetrina sullo schermo
  const [introLit, setIntroLit] = useState(-1); // quanti faretti si sono già accesi all'ingresso
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const [entering, setEntering] = useState<number | null>(null);
  const router = useRouter();

  // primo tocco: luce e ingrandimento dell'orologio; toccandolo si va agli orologi disponibili della marca
  const href = (i: number) => `/shop/marca/${items[i].slug}`;
  const zoom = (i: number) => {
    const shot = ref.current?.querySelectorAll<HTMLElement>("[data-slot]")[i]?.querySelector<HTMLElement>("[data-boxshot]");
    if (reduced || !shot) return false;
    return openZoom(shot, { name: items[i].name, href: href(i), go: (h) => router.push(h), onClose: () => setEntering(null) });
  };
  const pick = (i: number) => {
    if (entering !== null) return;
    router.prefetch(`/shop/marca/${items[i].slug}`);
    // marche senza foto ravvicinata: primo tocco la luce, secondo tocco la sezione
    if (!items[i].vicino || reduced) {
      if (selected === i) return router.push(href(i));
      return setSelected(i);
    }
    setSelected(i);
    setEntering(i);
    // prima si accende il faretto, poi parte l'ingrandimento
    window.setTimeout(() => {
      if (!zoom(i)) setEntering(null);
    }, 420);
  };
  const enter = (i: number) => router.push(href(i));

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // all'ingresso i faretti si accendono uno dopo l'altro, poi restano a luce soffusa
  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setIntroLit(items.length + 1);
      return;
    }
    let i = 0;
    const t = window.setInterval(() => {
      i++;
      setIntroLit(i);
      if (i > items.length) window.clearInterval(t);
    }, 300);
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

  // il riquadro della marca sotto la vetrina compare quando l'ingrandimento è chiuso, non mentre è aperto
  const sel = selected !== null && entering === null ? items[selected] : null;

  return (
    <section ref={ref} className="guilloche sheen relative overflow-hidden bg-[#0b100d] py-20 text-cream sm:py-32" aria-labelledby="vetrina-titolo">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,69,42,0.35),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="max-w-2xl">
          <p className="eyebrow !text-gold-3">{eyebrow}</p>
          <h2 id="vetrina-titolo" className="mt-4 font-display text-4xl font-light sm:text-6xl">{title}</h2>
          <p className="mt-6 leading-relaxed text-cream/60">{intro}</p>
        </div>

        <div className="relative mt-16">
          <div className="-mx-4 flex snap-x snap-mandatory overflow-x-auto px-[11vw] pb-4 [scrollbar-width:none] sm:-mx-8 sm:px-[27vw] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-y-16 lg:snap-none lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
            {items.map((b, i) => (
              <Slot
                key={b.slug}
                brand={b}
                light={lightOf(i)}
                selected={selected === i}
                reduced={reduced}
                running={visible}
                onHover={(h) => setHover((cur) => (h ? i : cur === i ? null : cur))}
                onSelect={() => pick(i)}
              />
            ))}
          </div>
          <p className="mt-6 text-center text-[0.7rem] uppercase tracking-[0.2em] text-cream/30">Immagini illustrative</p>
        </div>

        <AnimatePresence mode="wait">
          {sel && (
            <motion.div
              key={sel.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-12 grid gap-10 border-t border-cream/10 pt-10 md:grid-cols-[1.2fr_1fr]"
            >
              <div>
                <BrandLogo brand={sel} className={`text-gold-3 ${sel.ratio > 3 ? "h-6" : "h-12"}`} />
                <h3 className="mt-5 font-display text-4xl font-light sm:text-5xl">
                  Orologi <em className="text-gold-3">{sel.name}</em>
                </h3>
                <p className="mt-5 max-w-xl leading-relaxed text-cream/65">
                  Ogni {sel.name} in vendita è controllato e revisionato nel mio laboratorio prima di arrivare in vetrina, con 12 mesi di garanzia.
                </p>
              </div>
              <div className="flex flex-col justify-end">
                <p className="leading-relaxed text-cream/60">Entra per vedere i pezzi disponibili, con le foto di ogni orologio. Cerchi un modello preciso? Scrivimi: se non ce l&apos;ho, lo cerco per te.</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <button type="button" onClick={() => selected !== null && enter(selected)} className="btn !border-gold-3 !bg-gold-3 !text-green-2 hover:!bg-cream">Entra: orologi {sel.name}</button>
                  <a href={whatsappLink(`Buongiorno, cerco un orologio ${sel.name}.`)} target="_blank" rel="noopener noreferrer" className="btn !border-cream/40 !text-cream hover:!bg-cream hover:!text-green-2">
                    <WhatsAppIcon className="h-4 w-4" /> Scrivimi
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
