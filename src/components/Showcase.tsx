"use client";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useWarm } from "@/lib/warm";
import { brands, type Brand } from "@/data/brands";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";
import BrandLogo from "./BrandLogo";
import { openZoom } from "@/lib/zoomEntrance";
import BoxPhoto from "./BoxPhoto";
import Spotlight, { BoxLight, LightPool } from "./Spotlight";
import NotifyDialog, { type Intent } from "./NotifyDialog";
import Image from "next/image";

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
  lite = false,
}: {
  running: boolean;
  /** lontano dal centro: solo la foto del cofanetto, senza faretto, luci né lancette (memoria su iPhone) */
  lite?: boolean;
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
    <div data-slot className="relative flex w-[66vw] shrink-0 flex-col items-center px-3 sm:w-[40vw] lg:w-[25vw] lg:px-6 xl:w-[22rem]">
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
        <Spotlight level={lvl} flicker={light === "on" && !reduced} lite={lite} />

        {/* cofanetto con l'orologio */}
        <span className="relative mt-6 block aspect-[840/1020] w-full">
          {/* bagliore del colore del quadrante (solo vicino al centro: la sfocatura costa memoria) */}
          {!lite && (
            <span
              aria-hidden
              className="absolute left-1/2 top-[45%] h-1/2 w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full transition-opacity duration-700"
              style={{ background: `radial-gradient(closest-side, ${brand.accent}, transparent)`, filter: "blur(28px)", opacity: light === "on" ? 0.6 : light === "idle" ? 0.1 : 0 }}
            />
          )}
          <span
            data-boxshot
            className="absolute inset-0 transition-[filter,transform] duration-700 ease-out"
            style={{
              filter: light === "on" ? "brightness(1.06) contrast(1.04)" : light === "idle" ? "brightness(0.55) saturate(0.75)" : "brightness(0.16) saturate(0.4)",
              // secondo tocco: si "entra" nel cofanetto, ingrandendo verso il quadrante
              transform: light === "on" ? "translateY(-6px) scale(1.04)" : "none",
            }}
          >
            {photo && lite ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={`Cofanetto ${brand.name}`} draggable={false} decoding="async" className="h-full w-full select-none object-contain object-bottom" />
            ) : photo ? (
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
        {!lite && <LightPool level={lvl} />}
      </button>

      {/* ripiano in pietra (continuo da una nicchia all'altra) */}
      <span aria-hidden className="relative z-10 mt-1 block h-3 w-[calc(100%+1.5rem)] bg-gradient-to-b from-[#3d4440] to-[#161a17] shadow-[0_18px_40px_rgba(0,0,0,0.6)] lg:w-[calc(100%+3rem)]" />

      {/* targhetta sotto il ripiano: logo della marca */}
      <div className="mt-9 flex flex-col items-center text-center">
        <span className="flex h-9 items-center lg:h-14">
          <BrandLogo brand={brand} className={`transition-colors duration-500 ${light === "on" ? "text-cream" : "text-cream/40"} ${brand.ratio > 3 ? "h-4 lg:h-6" : "h-8 lg:h-12"}`} />
        </span>
        <p className={`mt-3 h-4 text-[0.65rem] uppercase tracking-[0.22em] text-gold-3 transition-opacity duration-500 ${selected && !brand.vicino ? "opacity-100" : "opacity-0"}`}>Tocca di nuovo</p>
      </div>
    </div>
  );
}

/** Nicchia vuota nella fila: "Il tuo orologio qui?". Toccandola si apre l'avviso con "vendere" già scelto. */
function EmptySlot({ light, onSelect, lite = false }: { light: Light; onSelect: () => void; lite?: boolean }) {
  const lvl = light === "on" ? 1 : light === "idle" ? 0.22 : 0;
  const on = light === "on";
  return (
    <div data-slot className="relative flex w-[66vw] shrink-0 flex-col items-center px-3 sm:w-[40vw] lg:w-[25vw] lg:px-6 xl:w-[22rem]">
      <button type="button" onClick={onSelect} aria-label="Il tuo orologio qui? Vendilo con me" className="group relative block w-full cursor-pointer outline-none">
        <Spotlight level={lvl} flicker={false} lite={lite} />
        <span className="relative mt-6 block aspect-[840/1020] w-full">
          <span
            className={`absolute inset-x-[14%] bottom-[2%] top-[26%] grid place-items-center rounded-2xl border-[1.5px] border-dashed text-center transition-[border-color,background-color] duration-700 ${
              on ? "border-gold-3/80 bg-[radial-gradient(ellipse_at_50%_0%,rgba(255,236,180,0.18),transparent_70%)]" : "border-gold-3/35"
            }`}
          >
            <span className="px-4">
              <span className={`mx-auto grid h-11 w-11 place-items-center rounded-full border text-2xl transition-colors duration-700 ${on ? "border-gold-3 text-gold-3" : "border-gold-3/40 text-gold-3/50"}`}>+</span>
              <span className={`mt-4 block font-display text-[1.6rem] italic leading-[1.05] transition-colors duration-700 ${on ? "text-[#f6e5b0]" : "text-cream/45"}`}>Il tuo orologio qui?</span>
              <span className="mt-3 block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold-3">Vendilo con me</span>
            </span>
          </span>
        </span>
        {!lite && <LightPool level={lvl} />}
      </button>
      <span aria-hidden className="relative z-10 mt-1 block h-3 w-[calc(100%+1.5rem)] bg-gradient-to-b from-[#3d4440] to-[#161a17] shadow-[0_18px_40px_rgba(0,0,0,0.6)] lg:w-[calc(100%+3rem)]" />
      <div className="mt-9 flex h-9 items-center lg:h-14">
        <span className={`font-display text-xl italic transition-colors duration-500 lg:text-2xl ${on ? "text-gold-3" : "text-gold-3/45"}`}>Il tuo</span>
      </div>
    </div>
  );
}

/** le quattro tappe di chi vende, sotto il ripiano */
const SELL_STEPS = [
  { img: "/vendi/valutazione.webp", title: "Valutazione gratuita", text: "Mi mandi le foto o me lo porti: ti dico quanto vale oggi, e quanto può valere dopo." },
  { img: "/vendi/restauro.webp", title: "Restauro prima della vendita", text: "Movimento, lucidatura, ricambi originali. Lo facciamo solo se conviene.", badge: "Solo da me" },
  { img: "/vendi/vetrina.webp", title: "In vetrina", text: "Foto curate e scheda completa sul sito, con la vetrina online da gennaio 2027." },
  { img: "/vendi/canali.webp", title: "Su ogni mio canale", text: "Lo promuovo su Instagram, su Facebook e sul sito, finché non trova il suo nuovo polso." },
];

const WARM_VETRINA = brands.flatMap((b) => [b.vetrina, ...(b.dial?.sprites ? Object.values(b.dial.sprites) : [])]).filter(Boolean) as string[];

/** copie della fila: si scorre su quella in mezzo e al bordo si salta di una copia, senza che si veda */
const COPIES = 3;
/** velocità dello scorrimento automatico, in px al millisecondo */
const SPEED = 0.032;

export default function Showcase({
  eyebrow = "Compravendita · vetrina da gennaio 2027",
  title = "",
  intro = "Ogni orologio in vetrina passa dal mio banco. Tocca un cofanetto per avvicinarlo: gli orologi in vendita arrivano a gennaio 2027. E se vuoi vendere il tuo, prima lo restauro: vale di più.",
  cta,
  locked = true,
}: {
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** pulsante in fondo alla vetrina, dentro la stessa sezione (stesso fondo e stessa trama) */
  cta?: React.ReactNode;
  /** vetrina non ancora aperta (fino a gennaio 2027): il tocco sull'orologio apre l'avviso invece della marca */
  locked?: boolean;
}) {
  const items = brands;
  // una copia della fila: due marche, la nicchia vuota ("il tuo orologio qui?"), le altre marche
  const one: (Brand | null)[] = [...items.slice(0, 2), null, ...items.slice(2)];
  const slots = Array.from({ length: one.length * COPIES }, (_, k) => one[k % one.length]);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const visible = useInView(ref, { amount: 0.05 }); // scorre e le lancette girano solo con la vetrina sullo schermo
  // cofanetti e lancette: in cache quando la vetrina è a due schermate e mezzo, così all'arrivo sono già lì (lib/warm)
  useWarm(WARM_VETRINA, ref, { idle: false, margin: "250% 0px" });
  const [center, setCenter] = useState(-1); // cofanetto al centro della fila: ha la luce piena
  const [hover, setHover] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  const [entering, setEntering] = useState<number | null>(null);
  const [notify, setNotify] = useState<{ open: boolean; brand?: string; image?: string; intent?: Intent }>({ open: false });
  const router = useRouter();

  const openNotify = (o: { brand?: Brand; intent?: Intent } = {}) =>
    setNotify({ open: true, brand: o.brand?.name, image: o.brand?.vicino?.src ?? (o.intent === "vendere" ? "/vendi/restauro.webp" : undefined), intent: o.intent });
  const href = (k: number) => `/shop/marca/${slots[k]?.slug}`;
  const zoom = (k: number) => {
    const shot = ref.current?.querySelectorAll<HTMLElement>("[data-slot]")[k]?.querySelector<HTMLElement>("[data-boxshot]");
    if (reduced || !shot) return false;
    return openZoom(shot, {
      name: slots[k]!.name,
      href: href(k),
      go: (h) => router.push(h),
      onClose: () => setEntering(null),
      onTap: locked ? () => openNotify({ brand: slots[k]! }) : undefined,
    });
  };
  // primo tocco: luce e ingrandimento dell'orologio; toccandolo, l'avviso (fino a gennaio) o la marca
  const pick = (k: number) => {
    if (entering !== null) return;
    const b = slots[k];
    // la nicchia vuota: vendere
    if (!b) return openNotify({ intent: "vendere" });
    if (!locked) router.prefetch(href(k));
    if (!b.vicino || reduced) {
      if (selected === k) return locked ? openNotify({ brand: b }) : router.push(href(k));
      return setSelected(k);
    }
    setSelected(k);
    setEntering(k);
    // prima si accende il faretto, poi parte l'ingrandimento
    window.setTimeout(() => {
      if (!zoom(k)) setEntering(null);
    }, 420);
  };

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);
  // quanti cofanetti per lato hanno faretto, luci e lancette: su telefono se ne vede uno e mezzo, su computer quattro
  const [radius, setRadius] = useState(1);
  useEffect(() => {
    const fit = () => setRadius(window.innerWidth >= 1024 ? 2 : 1);
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  // la fila scorre da sola, all'infinito; si ferma sotto il mouse o al tocco e riparte da sola.
  // Il cofanetto che passa al centro si accende, gli altri restano a luce soffusa.
  const strip = useRef<HTMLDivElement>(null);
  const x = useRef(0);
  const written = useRef(0);
  const copy = useRef(0);
  const pauseUntil = useRef(0);
  const hovering = useRef(false);
  // trascinamento col mouse (tieni premuto e sposta): niente clic sul cofanetto se hai trascinato
  const dragging = useRef(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pauseUntil.current = performance.now() + 4000;
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, left: strip.current?.scrollLeft ?? 0, moved: false };
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const el = strip.current;
    if (!d || !el) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) < 6) return;
    if (!d.moved) {
      d.moved = true;
      dragging.current = true;
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = d.left - dx;
    pauseUntil.current = performance.now() + 4000;
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    dragging.current = false;
    strip.current?.releasePointerCapture?.(e.pointerId);
    // il rilascio dopo un trascinamento non è un clic sul cofanetto
    const stop = (ev: MouseEvent) => {
      ev.stopPropagation();
      ev.preventDefault();
    };
    window.addEventListener("click", stop, { capture: true, once: true });
    window.setTimeout(() => window.removeEventListener("click", stop, { capture: true }), 50);
  };
  // frecce: un cofanetto avanti o indietro
  const step = (dir: 1 | -1) => {
    const el = strip.current;
    const w = el?.querySelector<HTMLElement>("[data-slot]")?.offsetWidth ?? 300;
    pauseUntil.current = performance.now() + 4000;
    el?.scrollBy({ left: dir * w, behavior: "smooth" });
  };
  // su telefono (niente mouse) la fila avanza di un cofanetto alla volta invece di scorrere a ogni fotogramma
  const autoUntil = useRef(0);
  const busy = entering !== null || notify.open;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  const findCenter = () => {
    const el = strip.current;
    const first = el?.querySelector<HTMLElement>("[data-slot]");
    if (!el || !first) return;
    const w = first.offsetWidth;
    const k = Math.round((el.scrollLeft + el.clientWidth / 2 - first.offsetLeft - w / 2) / w);
    setCenter((c) => (c === k ? c : k));
  };

  useEffect(() => {
    const el = strip.current;
    if (!el) return;
    const measure = () => {
      copy.current = el.scrollWidth / COPIES;
      if (!x.current) x.current = copy.current;
      el.scrollLeft = x.current;
      written.current = el.scrollLeft;
      findCenter();
    };
    measure();
    window.addEventListener("resize", measure);
    // scorrimento a mano (dito, rotellina, trackpad): pausa, e salto di una copia ai bordi
    const onScroll = () => {
      // passo automatico in corso (telefono): non è un tocco, non mette in pausa
      if (performance.now() < autoUntil.current) {
        x.current = written.current = el.scrollLeft;
        findCenter();
        return;
      }
      const v = el.scrollLeft;
      if (Math.abs(v - written.current) > 2) {
        pauseUntil.current = performance.now() + 4000;
        if (v < copy.current * 0.5) el.scrollLeft = v + copy.current;
        else if (v > copy.current * 1.5) el.scrollLeft = v - copy.current;
        x.current = written.current = el.scrollLeft;
      }
      findCenter();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("resize", measure);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  // telefono: un cofanetto ogni 3 secondi, con scorrimento morbido che si ferma centrato (scroll-snap)
  useEffect(() => {
    if (!visible || reduced || !window.matchMedia("(hover: none)").matches) return;
    const id = window.setInterval(() => {
      const el = strip.current;
      const w = el?.querySelector<HTMLElement>("[data-slot]")?.offsetWidth;
      if (!el || !w || !copy.current || busyRef.current || performance.now() < pauseUntil.current) return;
      // salto di una copia, a fila ferma, prima del passo
      if (el.scrollLeft > copy.current * 1.5) el.scrollLeft -= copy.current;
      else if (el.scrollLeft < copy.current * 0.5) el.scrollLeft += copy.current;
      autoUntil.current = performance.now() + 1100;
      el.scrollBy({ left: w, behavior: "smooth" });
    }, 3000);
    return () => window.clearInterval(id);
  }, [visible, reduced]);

  useEffect(() => {
    if (!visible || reduced || window.matchMedia("(hover: none)").matches) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(50, t - last);
      last = t;
      const el = strip.current;
      if (el && copy.current && !dragging.current && !busyRef.current && t > pauseUntil.current) {
        // col mouse sopra rallenta (si sceglie con calma), ma non si ferma
        x.current += dt * SPEED * (hovering.current ? 0.3 : 1);
        if (x.current > copy.current * 1.5) x.current -= copy.current;
        el.scrollLeft = x.current;
        written.current = el.scrollLeft;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lightOf = (k: number): Light => {
    if (!inView) return "off";
    if (selected !== null) return k === selected ? "on" : "idle";
    if (hover !== null) return k === hover ? "on" : "idle";
    return k === center ? "on" : "idle";
  };

  // il riquadro della marca sotto la vetrina compare quando l'ingrandimento è chiuso, non mentre è aperto
  const sel = selected !== null && entering === null ? slots[selected] : null;
  const title2 = title || null;

  return (
    <section id="vetrina" ref={ref} className="guilloche sheen relative scroll-mt-20 overflow-hidden bg-[#0b100d] py-16 text-cream sm:py-24" aria-labelledby="vetrina-titolo">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,69,42,0.35),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow !text-gold-3">{eyebrow}</p>
            <h2 id="vetrina-titolo" className="mt-4 font-display text-4xl font-light leading-[1.04] sm:text-6xl">
              {title2 ?? (
                <>
                  Compri o vendi.
                  <br />
                  <em className="text-gold-3">Sempre passato dal mio banco.</em>
                </>
              )}
            </h2>
          </div>
          <div>
            <p className="text-[0.95rem] leading-relaxed text-cream/60 sm:text-base">{intro}</p>
            {locked && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => openNotify()} className="btn-gold">
                  Avvisami quando apre <span aria-hidden>→</span>
                </button>
                <a href="#vendi" className="btn-gold btn-gold-quiet">
                  Vendi il tuo
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* la fila: a tutta larghezza, una sola riga anche su computer */}
      <div className="relative">
      <div
        ref={strip}
        onPointerEnter={(e) => e.pointerType === "mouse" && (hovering.current = true)}
        onPointerLeave={(e) => {
          if (e.pointerType !== "mouse") return;
          hovering.current = false;
          pauseUntil.current = performance.now() + 900;
        }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        // spazio sopra le plafoniere: l'alone dei faretti sfuma invece di essere tagliato dal bordo della fila
        className="vet-strip relative mt-0 flex cursor-grab overflow-x-auto pb-4 pt-14 [scrollbar-width:none] active:cursor-grabbing sm:mt-4 [&::-webkit-scrollbar]:hidden"
      >
        {slots.map((b, k) =>
          b === null ? (
            <EmptySlot key={k} light={lightOf(k)} onSelect={() => pick(k)} lite={Math.abs(k - center) > radius} />
          ) : (
          <Slot
            key={k}
            brand={b}
            light={lightOf(k)}
            selected={selected === k}
            reduced={reduced}
            running={visible && Math.abs(k - center) <= radius}
            lite={center < 0 ? k > 2 * radius : Math.abs(k - center) > radius}
            onHover={(h) => setHover((cur) => (h ? k : cur === k ? null : cur))}
            onSelect={() => pick(k)}
          />
          )
        )}
      </div>
        {/* frecce: un cofanetto avanti o indietro */}
        {(["prev", "next"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => step(d === "next" ? 1 : -1)}
            aria-label={d === "next" ? "Cofanetto successivo" : "Cofanetto precedente"}
            className={`vet-arrow absolute top-[42%] z-20 ${d === "next" ? "right-3 sm:right-6" : "left-3 sm:left-6"}`}
          >
            {d === "next" ? "→" : "←"}
          </button>
        ))}
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <AnimatePresence mode="wait">
          {sel && (
            <motion.div
              key={sel.slug}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-10 grid gap-8 border-t border-cream/10 pt-10 md:grid-cols-[1.2fr_1fr]"
            >
              <div>
                <BrandLogo brand={sel} className={`text-gold-3 ${sel.ratio > 3 ? "h-6" : "h-12"}`} />
                <h3 className="mt-5 font-display text-4xl font-light sm:text-5xl">
                  Orologi <em className="text-gold-3">{sel.name}</em>
                </h3>
                <p className="mt-5 max-w-xl leading-relaxed text-cream/65">
                  Ogni {sel.name} in vendita sarà controllato e revisionato nel mio laboratorio prima di arrivare in vetrina, con 12 mesi di garanzia.
                </p>
              </div>
              <div className="flex flex-col justify-end">
                <p className="leading-relaxed text-cream/60">
                  {locked
                    ? "Gli orologi disponibili arrivano a gennaio 2027. Cerchi un modello preciso? Scrivimi: se non ce l\u2019ho, lo cerco per te."
                    : "Entra per vedere i pezzi disponibili, con le foto di ogni orologio. Cerchi un modello preciso? Scrivimi: se non ce l\u2019ho, lo cerco per te."}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  {locked ? (
                    <button type="button" onClick={() => openNotify({ brand: sel })} className="btn-gold">
                      Avvisami · orologi {sel.name} <span aria-hidden>→</span>
                    </button>
                  ) : (
                    <button type="button" onClick={() => selected !== null && router.push(href(selected))} className="btn !border-gold-3 !bg-gold-3 !text-green-2 hover:!bg-cream">
                      Entra: orologi {sel.name}
                    </button>
                  )}
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

      {/* chi vende: le quattro tappe, sullo stesso fondo, sotto il ripiano */}
      {locked && (
        <div id="vendi" className="relative mx-auto mt-14 max-w-7xl scroll-mt-24 px-4 sm:mt-20 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-5 border-t border-cream/10 pt-10">
            <h3 className="font-display text-3xl font-light leading-[1.05] sm:text-5xl">
              Vuoi vendere il tuo? <em className="text-gold-3">Prima lo restauro.</em>
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-cream/60">Un rivenditore lo compra com&apos;è. Io prima lo valuto e, se conviene, lo restauro: si vende meglio e a un prezzo più alto.</p>
          </div>
          <div className="sell-track sell-dark -mx-4 mt-8 overflow-x-auto px-4 pb-2 pt-3 sm:mx-0 sm:mt-12 sm:overflow-visible sm:px-0">
            <ol className="sell-rail relative grid min-w-[56rem] grid-cols-4 gap-6 sm:min-w-0">
              {SELL_STEPS.map((st, i) => (
                <li key={st.title} className={`sell-step ${st.badge ? "is-key" : ""}`}>
                  <span className="sell-bead">
                    <Image src={st.img} alt="" width={240} height={240} sizes="112px" className="h-full w-full object-cover" />
                  </span>
                  <span className="mt-5 block font-mono text-[0.7rem] tracking-[0.12em] text-gold-3">{String(i + 1).padStart(2, "0")}</span>
                  {st.badge && <span className="sell-badge">{st.badge}</span>}
                  <h4 className="mt-2 font-display text-[1.55rem] leading-[1.08]">{st.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-cream/60">{st.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-9 flex flex-wrap items-center gap-5">
            <button type="button" onClick={() => openNotify({ intent: "vendere" })} className="btn-gold">
              Affidami il tuo orologio <span aria-hidden>→</span>
            </button>
            <a href={whatsappLink("Buongiorno Roberto, vorrei affidarle un orologio da vendere.")} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-cream/70 hover:text-gold-3">
              <WhatsAppIcon className="h-4 w-4" /> o scrivimi su WhatsApp
            </a>
          </div>
        </div>
      )}

      {cta && <div className="relative mt-12 text-center sm:mt-16">{cta}</div>}
      <NotifyDialog open={notify.open} brand={notify.brand} image={notify.image} intent={notify.intent} onClose={() => setNotify((n) => ({ ...n, open: false }))} />
    </section>
  );
}
