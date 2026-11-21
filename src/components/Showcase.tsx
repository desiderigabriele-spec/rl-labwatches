"use client";
import { useRouter } from "next/navigation";
import { useInView } from "motion/react";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useWarm, warmSoon } from "@/lib/warm";
import { brands, type Brand } from "@/data/brands";
import BrandLogo from "./BrandLogo";
import { openZoom } from "@/lib/zoomEntrance";
import { CloseupPiece } from "./BoxPhoto";
import NotifyDialog, { type Intent } from "./NotifyDialog";

/**
 * Vetrina: una fila di cofanetti, uno per marca, che scorre (da sola su computer, col dito su telefono) sotto un
 * faretto fermo al centro. Il cofanetto che passa sotto il faretto è in piena luce, gli altri in penombra.
 * Toccando un cofanetto l'orologio si ingrandisce (lib/zoomEntrance); toccandolo ancora, l'avviso di gennaio
 * (o la pagina della marca, quando la vetrina sarà aperta).
 *
 * Perché scorra fluida anche su iPhone, la fila è "piatta": ogni cofanetto è una sola foto già composta
 * (scripts/vetrina-fila.mjs: foto ravvicinata, ombra e lancetta ferma già dentro) più due lancette piccole.
 * Dentro la fila niente filtri, maschere, sfocature o fusioni di luce, e mentre scorre nessun lavoro JavaScript:
 * il telefono sposta soltanto immagini già disegnate. Faretti, fascio, pulviscolo, pozza di luce e penombra
 * stanno in due strati fermi, dietro e davanti alla fila, che durante lo scorrimento non cambiano mai.
 */

const FILA = (b: Brand) => `/vetrina/fila/${b.slug}.webp`;
const LOGO_CHIARO = (b: Brand) => `/marche/chiaro/${b.slug}.png`;
/** plafoniere sul soffitto della vetrina: una per cofanetto, accesa solo quella al centro */
const LAMPS = [-3, -2, -1, 0, 1, 2, 3];

/** Cofanetto disegnato: segnaposto per una marca che non ha ancora la foto */
function Cofanetto({ brand }: { brand: Brand }) {
  const leather = "linear-gradient(160deg,#145238 0%,#0b3424 45%,#06231a 100%)";
  return (
    <span aria-hidden className="absolute inset-0">
      <span className="absolute inset-x-[10%] top-[8%] h-[46%] rounded-t-[14px]" style={{ background: leather }}>
        <span className="absolute inset-x-[7%] bottom-0 top-[7%] rounded-t-[10px]" style={{ background: "linear-gradient(180deg,#f3ead8 0%,#dccfb2 70%,#c8b993 100%)" }}>
          <span className="absolute inset-x-0 top-[16%] text-center font-display text-[0.95rem] tracking-[0.25em] text-[#a8843c]">RL</span>
        </span>
      </span>
      <span className="absolute inset-x-[8%] top-[50%] h-[14%] rounded-[6px]" style={{ background: "linear-gradient(180deg,#b9a780,#e6dac0)" }} />
      <span className="absolute inset-x-[20%] top-[40%] flex h-[26%] items-center justify-center rounded-[42%]" style={{ background: "radial-gradient(ellipse at 50% 35%,#f4ead6,#dcccab 75%)" }}>
        <BrandLogo brand={brand} className={`text-[#1b2a22]/80 ${brand.ratio > 3 ? "h-[22%]" : "h-[46%]"}`} />
      </span>
      <span className="absolute inset-x-[5%] bottom-[5%] top-[58%] rounded-b-[12px] rounded-t-[4px]" style={{ background: leather }} />
    </span>
  );
}

/** Lancette ore e minuti, piccole: girano con le variabili --h e --m della fila, aggiornate una volta al minuto */
function StripHands({ brand }: { brand: Brand }) {
  const d = brand.dial;
  if (!d?.sprites) return null;
  const a = 840 / 1020; // il quadrante è rotondo: in altezza è r * larghezza/altezza del riquadro
  return (
    <span aria-hidden className="vet-hands" style={{ left: `${d.x - d.r}%`, width: `${2 * d.r}%`, top: `${d.y - d.r * a}%`, height: `${2 * d.r * a}%` }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/vetrina/fila/${brand.slug}-ore.webp`} alt="" draggable={false} decoding="async" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/vetrina/fila/${brand.slug}-minuti.webp`} alt="" draggable={false} decoding="async" />
    </span>
  );
}

/** Un cofanetto della fila: foto già composta, lancette, ripiano e targhetta. Non cambia mai mentre la fila scorre. */
const Slot = memo(function Slot({
  brand,
  k,
  copy = false,
  armed,
  locked,
  onPick,
  onHover,
}: {
  brand: Brand;
  k: number;
  /** copia che serve solo al giro infinito: nascosta ai lettori di schermo e fuori dal tasto Tab */
  copy?: boolean;
  /** toccato: si monta la foto ravvicinata vera, quella che lib/zoomEntrance ingrandisce */
  armed: boolean;
  locked: boolean;
  onPick: (k: number) => void;
  onHover: (k: number | null) => void;
}) {
  return (
    <div data-slot className="vet-slot" aria-hidden={copy || undefined}>
      <button
        type="button"
        tabIndex={copy ? -1 : undefined}
        onClick={() => onPick(k)}
        onMouseEnter={() => onHover(k)}
        onMouseLeave={() => onHover(null)}
        onFocus={() => onHover(k)}
        onBlur={() => onHover(null)}
        aria-label={locked ? `${brand.name}: guarda l'orologio da vicino` : `${brand.name}: guarda gli orologi in vendita`}
        className="vet-box"
      >
        <span data-boxshot className="vet-shot">
          {brand.vetrina ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FILA(brand)} alt={`Cofanetto ${brand.name}`} width={840} height={1200} draggable={false} decoding="async" className="vet-photo" />
              <StripHands brand={brand} />
              {armed && <CloseupPiece brand={brand} run eager />}
            </>
          ) : (
            <span className="absolute inset-x-[15%] bottom-0 top-[24%]">
              <Cofanetto brand={brand} />
            </span>
          )}
        </span>
      </button>
      {/* ripiano, continuo da un cofanetto all'altro, con l'ombra di contatto del cofanetto */}
      <span aria-hidden className="vet-ledge" />
      {/* targhetta sotto il ripiano */}
      <span className="vet-plate">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={LOGO_CHIARO(brand)}
          alt={brand.name}
          draggable={false}
          decoding="async"
          className={brand.ratio > 3 ? "h-4 lg:h-6" : "h-8 lg:h-12"}
          style={{ aspectRatio: `${brand.ratio}` }}
        />
      </span>
    </div>
  );
});

type IconKind = "valuta" | "restauro" | "vetrina" | "canali";
/**
 * Icone a filo d'oro delle quattro tappe, disegnate per questo laboratorio:
 * la lente sull'orologio (valutazione), pinzetta e ruota del movimento (restauro), il cofanetto aperto sotto il
 * faretto (vetrina), il telefono che trasmette (promozione sui canali).
 */
function SellIcon({ kind }: { kind: IconKind }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-[58%] w-[58%]">
      {kind === "valuta" && (
        <g {...p}>
          <circle cx="9.5" cy="14" r="5.2" />
          <path d="M8 8.9 8.6 6.2h1.8l.6 2.7M8 19.1l.6 2.7h1.8l.6-2.7" />
          <path d="M9.5 14v-2.6M9.5 14l1.9 1.1" />
          <circle cx="16.3" cy="7.7" r="3.4" />
          <path d="M18.7 10.1 21.4 12.8" strokeWidth={1.8} />
        </g>
      )}
      {kind === "restauro" && (
        <g {...p}>
          <circle cx="9" cy="15" r="2.4" />
          <path d="M9 10.6v1.4M9 18v1.4M4.6 15H6M12 15h1.4M5.9 11.9l1 1M11.1 17.1l1 1M5.9 18.1l1-1M11.1 12.9l1-1" />
          <path d="M20.6 3.4 13.5 10.5M21.4 4.4l-7 7.1" />
          <path d="M13.5 10.5 12.4 12.5l2-1" />
        </g>
      )}
      {kind === "vetrina" && (
        <g {...p}>
          <path d="M12 1.8v1.4M8.2 3.1l.8 1.1M15.8 3.1 15 4.2" />
          <path d="M5.5 11.5V7.3a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v4.2" />
          <rect x="4.2" y="11.5" width="15.6" height="8.4" rx="1.2" />
          <circle cx="12" cy="14.9" r="2.1" />
          <path d="M12 14.9v-1M12 14.9l.8.5M10.6 11.5v1.4M13.4 11.5v1.4" />
        </g>
      )}
      {kind === "canali" && (
        <g {...p}>
          <rect x="5.5" y="2.8" width="9.6" height="18.4" rx="2" />
          <path d="M9.3 18.6h2" />
          <path d="M10.3 12.6s-2.4-1.4-2.4-3a1.25 1.25 0 0 1 2.4-.5 1.25 1.25 0 0 1 2.4.5c0 1.6-2.4 3-2.4 3Z" />
          <path d="M17.6 8.6a3.6 3.6 0 0 1 0 5.6M19.7 6.6a6.6 6.6 0 0 1 0 9.6" />
        </g>
      )}
    </svg>
  );
}

/** le quattro tappe di chi vende, sotto il ripiano */
const SELL_STEPS: { img: string; icon: IconKind; title: string; text: string; badge?: string }[] = [
  { icon: "valuta", img: "/vendi/valutazione.webp", title: "Valutazione gratuita", text: "Mi mandi le foto o me lo porti: ti dico quanto vale oggi, e quanto può valere dopo." },
  { icon: "restauro", img: "/vendi/restauro.webp", title: "Restauro, se vuoi", text: "Puoi venderlo così com'è, oppure farlo restaurare prima: movimento, lucidatura, ricambi. Vale di più.", badge: "Solo da me" },
  { icon: "vetrina", img: "/vendi/vetrina.webp", title: "In vetrina", text: "Foto curate e scheda completa sul sito, con la vetrina online da gennaio 2027." },
  { icon: "canali", img: "/vendi/canali.webp", title: "Su ogni mio canale", text: "Lo promuovo su Instagram, su Facebook e sul sito, finché non trova il suo nuovo polso." },
];

const WARM_VETRINA = [
  "/vetrina/fila/fascio.webp",
  ...brands.flatMap((b) => (b.vetrina ? [FILA(b), `/vetrina/fila/${b.slug}-ore.webp`, `/vetrina/fila/${b.slug}-minuti.webp`, LOGO_CHIARO(b)] : [LOGO_CHIARO(b)])),
];

/** copie della fila: si scorre su quella in mezzo e al bordo si salta di una copia, senza che si veda */
const COPIES = 3;
/** velocità dello scorrimento automatico, in px al millisecondo */
const SPEED = 0.032;

export default function Showcase({
  eyebrow = "Compravendita · vetrina da gennaio 2027",
  title = "",
  intro = "Ogni orologio in vetrina è aperto, controllato e revisionato da me. Gli orologi in vendita arrivano a gennaio 2027. Vuoi vendere il tuo? Lo metto in vendita così com'è, oppure, se vuoi, prima lo restauro: vale di più.",
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
  // una copia della fila: tutte le marche (l'invito a vendere è nella fascia "Vuoi vendere il tuo?" sotto)
  const one: readonly Brand[] = items;
  const slots = Array.from({ length: one.length * COPIES }, (_, k) => one[k % one.length]);
  const ref = useRef<HTMLElement>(null);
  // i faretti si accendono quando la vetrina arriva sullo schermo
  const inView = useInView(ref, { once: true, amount: 0.25 });
  const visible = useInView(ref, { amount: 0.05 }); // scorre e le lancette girano solo con la vetrina sullo schermo
  // cofanetti, lancette e loghi: in cache quando la vetrina è a due schermate e mezzo, così all'arrivo sono già lì
  useWarm(WARM_VETRINA, ref, { idle: false, margin: "250% 0px" });
  const [center, setCenter] = useState(-1); // cofanetto sotto il faretto
  const [hover, setHover] = useState<number | null>(null);
  const [reduced, setReduced] = useState(false);
  // cofanetto toccato: si monta la sua foto ravvicinata e parte l'ingrandimento
  const [entering, setEntering] = useState<number | null>(null);
  const [notify, setNotify] = useState<{ open: boolean; brand?: string; watch?: Brand; image?: string; intent?: Intent }>({ open: false });
  const router = useRouter();

  const openNotify = (o: { brand?: Brand; intent?: Intent } = {}) =>
    setNotify({ open: true, brand: o.brand?.name, watch: o.brand, image: o.brand?.vicino?.src ?? (o.intent === "vendere" ? "/vendi/restauro.webp" : undefined), intent: o.intent });
  const href = (k: number) => `/shop/marca/${slots[k]?.slug}`;

  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  // la fila scorre da sola, all'infinito (solo su computer); si ferma sotto il mouse o al tocco e riparte da sola
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
  // scorrimento comandato da noi (marchio scelto): fino a questo istante non conta come scorrimento a mano
  const autoUntil = useRef(0);
  const busy = entering !== null || notify.open;
  const busyRef = useRef(busy);
  busyRef.current = busy;

  // primo tocco: l'orologio si ingrandisce; toccandolo, l'avviso (fino a gennaio) o la marca
  const pick = (k: number) => {
    if (entering !== null) return;
    const b = slots[k];
    if (!locked) router.prefetch(href(k));
    // senza foto ravvicinata (o con "riduci movimento") niente ingrandimento: subito l'avviso o la marca
    if (!b.vicino || !b.dial || reduced) return locked ? openNotify({ brand: b }) : router.push(href(k));
    pauseUntil.current = performance.now() + 6000;
    setEntering(k);
  };
  // i cofanetti sono memorizzati (memo): ricevono sempre le stesse funzioni, che chiamano quella aggiornata
  const pickRef = useRef(pick);
  pickRef.current = pick;
  const onPick = useCallback((k: number) => pickRef.current(k), []);
  const onHover = useCallback((k: number | null) => {
    setHover(k);
    hovering.current = k !== null;
  }, []);

  // foto ravvicinata montata nel cofanetto toccato: appena è pronta (di solito è già in cache) parte l'ingrandimento
  useEffect(() => {
    if (entering === null) return;
    const k = entering;
    const shot = strip.current?.querySelectorAll<HTMLElement>("[data-slot]")[k]?.querySelector<HTMLElement>("[data-boxshot]");
    const img = shot?.querySelector<HTMLImageElement>("[data-closeup] img");
    let started = false;
    const start = () => {
      if (started) return;
      started = true;
      const ok =
        !!shot &&
        openZoom(shot, {
          name: slots[k].name,
          href: href(k),
          go: (h) => router.push(h),
          onClose: () => setEntering(null),
          onTap: locked ? () => openNotify({ brand: slots[k] }) : undefined,
        });
      if (!ok) setEntering(null);
    };
    const t = window.setTimeout(start, 900);
    (img?.decode ? img.decode() : Promise.resolve()).catch(() => {}).then(() => {
      window.clearTimeout(t);
      start();
    });
    return () => {
      window.clearTimeout(t);
      started = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entering]);

  // porta sotto il faretto il cofanetto della marca scelta (la copia più vicina a dove sei)
  const goTo = (slug: string) => {
    const el = strip.current;
    if (!el) return;
    const all = el.querySelectorAll<HTMLElement>("[data-slot]");
    let best = -1;
    let dist = Infinity;
    slots.forEach((b, k) => {
      if (b.slug !== slug) return;
      const d = Math.abs(k - (center < 0 ? one.length : center));
      if (d < dist) {
        dist = d;
        best = k;
      }
    });
    const slot = all[best];
    if (!slot) return;
    pauseUntil.current = performance.now() + 6000;
    autoUntil.current = performance.now() + 900;
    el.scrollTo({ left: slot.offsetLeft - (el.clientWidth - slot.offsetWidth) / 2, behavior: "smooth" });
  };

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
    // A fila ferma: salto di una copia ai bordi (non si vede: le copie sono uguali) e cofanetto al centro.
    // Mai durante lo scorrimento: su iPhone scrivere scrollLeft durante l'inerzia la blocca a scatti.
    let settle = 0;
    let manual = false;
    const settled = () => {
      manual = false;
      const v = el.scrollLeft;
      if (v < copy.current * 0.5) el.scrollLeft = v + copy.current;
      else if (v > copy.current * 1.5) el.scrollLeft = v - copy.current;
      x.current = written.current = el.scrollLeft;
      findCenter();
    };
    // durante lo scorrimento a mano qui si fa il minimo: niente stato React, niente classi, niente misure
    const onScroll = () => {
      const v = el.scrollLeft;
      // scorrimento automatico del computer (posizione scritta da noi): il centro si aggiorna subito, costa poco
      if (!manual && performance.now() >= autoUntil.current && Math.abs(v - written.current) <= 2) {
        findCenter();
        return;
      }
      // dito, trackpad, freccia o marchio: pausa, e il resto a fila ferma
      if (performance.now() >= autoUntil.current) {
        manual = true;
        pauseUntil.current = performance.now() + 4000;
      }
      x.current = written.current = v;
      window.clearTimeout(settle);
      settle = window.setTimeout(settled, 160);
    };
    // dove c'è, "scrollend" arriva appena la fila si ferma (anche dopo l'aggancio al cofanetto)
    const onEnd = () => {
      if (!manual) return;
      window.clearTimeout(settle);
      settled();
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", onEnd);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener("resize", measure);
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // su telefono la fila non scorre da sola: si sceglie il marchio qui sopra o si scorre col dito
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

  // lancette della fila: ore e minuti, una volta al minuto (variabili CSS sulla fila, nessun componente si ridisegna)
  useEffect(() => {
    const el = strip.current;
    if (!el || !visible) return;
    let t = 0;
    const set = () => {
      const now = new Date();
      const m = now.getMinutes() + now.getSeconds() / 60;
      const h = (now.getHours() % 12) + m / 60;
      el.style.setProperty("--m", `${(m * 6).toFixed(1)}deg`);
      el.style.setProperty("--h", `${(h * 30).toFixed(1)}deg`);
      t = window.setTimeout(set, 60200 - (now.getSeconds() * 1000 + now.getMilliseconds()));
    };
    set();
    return () => window.clearTimeout(t);
  }, [visible]);

  // i sei cofanetti già decodificati prima che la vetrina arrivi sullo schermo: scorrendo veloce nessun cofanetto
  // compare vuoto per un attimo (le copie della fila usano la stessa immagine, decodificata una volta sola)
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (e) => {
        if (!e.some((x) => x.isIntersecting)) return;
        io.disconnect();
        for (const b of one) {
          if (!b.vetrina) continue;
          const img = new Image();
          img.src = FILA(b);
          img.decode?.().catch(() => {});
        }
      },
      { rootMargin: "120% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // la foto ravvicinata del cofanetto sotto il faretto (o sotto il mouse) si scarica subito: al tocco è già pronta
  const near = hover ?? center;
  useEffect(() => {
    const b = slots[near];
    if (b?.vicino) warmSoon([b.vicino.src]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [near]);

  const title2 = title || null;

  return (
    <section id="vetrina" ref={ref} className="guilloche relative scroll-mt-20 overflow-hidden bg-[#0b100d] py-16 text-cream sm:py-24" aria-labelledby="vetrina-titolo">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,69,42,0.35),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow !text-gold-3">{eyebrow}</p>
            <h2 id="vetrina-titolo" className="mt-4 font-display text-4xl font-light leading-[1.04] sm:text-6xl">
              {title2 ?? (
                <>
                  Compra e vendi
                  <br />
                  <em className="text-gold-3">con chi li apre ogni giorno.</em>
                </>
              )}
            </h2>
          </div>
          <div>
            <p className="text-[0.95rem] leading-relaxed text-cream/60 sm:text-base">{intro}</p>
            {locked && (
              <div className="mt-6 flex items-center gap-2.5 sm:gap-3">
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

      {/* scelta del marchio: tocchi il marchio e la fila va a quell'orologio; scorrendo, si accende il marchio al centro */}
      <div className="relative mx-auto mt-10 max-w-7xl px-4 sm:mt-14 sm:px-8">
        <p className="text-center text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-gold-3">Scegli il marchio per vedere l&apos;orologio</p>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6" role="group" aria-label="Marchi in vetrina">
          {items.map((b) => {
            const on = slots[hover ?? center]?.slug === b.slug;
            return (
              <button key={b.slug} type="button" onClick={() => goTo(b.slug)} aria-pressed={on} className={`brand-chip ${on ? "is-on" : ""}`}>
                <BrandLogo brand={b} className={b.ratio > 3 ? "h-3 sm:h-4" : "h-6 sm:h-7"} />
                <span className="sr-only">{b.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* la fila, a tutta larghezza; dietro e davanti, due strati di luce che non si muovono mai */}
      <div className="vet-stage" data-lit={inView ? "" : undefined} data-pause-offscreen>
        <div aria-hidden className="vet-back">
          {LAMPS.map((i) => (
            <span key={i} className={i === 0 ? "vet-lamp is-on" : "vet-lamp"} style={{ "--i": i } as React.CSSProperties} />
          ))}
          <span className="vet-halo vet-light" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/vetrina/fila/fascio.webp" alt="" draggable={false} className="vet-beam vet-light" />
          <span className="vet-dust vet-light">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </span>
        </div>
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
          className="vet-strip"
        >
          {slots.map((b, k) => (
            <Slot key={k} brand={b} k={k} copy={k < one.length || k >= one.length * 2} armed={entering === k} locked={locked} onPick={onPick} onHover={onHover} />
          ))}
        </div>
        <div aria-hidden className="vet-front">
          <span className="vet-pool vet-light" />
        </div>
        {/* frecce: un cofanetto avanti o indietro */}
        {(["prev", "next"] as const).map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => step(d === "next" ? 1 : -1)}
            aria-label={d === "next" ? "Cofanetto successivo" : "Cofanetto precedente"}
            className={`vet-arrow ${d === "next" ? "right-3 sm:right-6" : "left-3 sm:left-6"}`}
          >
            {d === "next" ? "→" : "←"}
          </button>
        ))}
      </div>

      {/* chi vende: una fascia compatta sotto il ripiano, con le quattro tappe in piccolo */}
      {locked && (
        <div id="vendi" className="relative mx-auto mt-10 max-w-7xl scroll-mt-24 px-4 sm:mt-14 sm:px-8">
          <div className="sell-band">
            <div className="min-w-0">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-gold-3">Vuoi vendere il tuo?</p>
              <p className="mt-1.5 font-display text-2xl font-light leading-tight sm:text-[1.9rem]">
                Così com&apos;è, <em className="text-gold-3">o restaurato.</em>
              </p>
            </div>
            <ol className="sell-mini" aria-label="Come funziona">
              {SELL_STEPS.map((st) => (
                <li key={st.title} className={st.badge ? "is-key" : ""}>
                  <span className="sell-mini-bead">
                    <SellIcon kind={st.icon} />
                  </span>
                  <span>{st.title}</span>
                </li>
              ))}
            </ol>
            <button type="button" onClick={() => openNotify({ intent: "vendere" })} className="btn-gold shrink-0">
              Affidamelo <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      )}

      {cta && <div className="relative mt-12 text-center sm:mt-16">{cta}</div>}
      <NotifyDialog open={notify.open} brand={notify.brand} watch={notify.watch} image={notify.image} intent={notify.intent} onClose={() => setNotify((n) => ({ ...n, open: false }))} />
    </section>
  );
}
