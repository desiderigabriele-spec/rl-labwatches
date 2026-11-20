"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { onBeat } from "@/lib/beatClock";
import { WhatsAppIcon } from "./WhatsAppButton";

/** raggio dell'arco su cui si aprono i contatti, in px dal centro della lunetta */
const ARC = 104;
/** Chiama a sinistra, Preventivo in alto al centro, WhatsApp a destra: gradi dalla verticale */
const ANGLES = [-58, 0, 58];
/** su computer la lunetta sta nell'angolo in basso a destra: il ventaglio si apre in alto e a sinistra */
const ARC_DESK = 112;
const ANGLES_DESK = [-90, -45, 0];
/** scritte del richiamo, a turno: riga piccola in maiuscoletto, riga grande in corsivo */
const MESSAGES = [
  ["Chiedi a", "Roberto"],
  ["Preventivo", "gratuito"],
] as const;
/** scatti dei secondi al secondo, come un calibro a 28.800 alternanze */
const BEATS = 8;

/**
 * Contatti: una lunetta da subacqueo in basso al centro su telefono, nell'angolo in basso a destra (più grande)
 * su computer.
 * Ghiera, quadrante e lancette sono foto (public/lunetta, originali in VETRINA/lunetta) e le lancette
 * segnano l'ora vera. Al tocco la ghiera ruota a scatti come una vera ghiera e si aprono a ventaglio
 * Chiama, Preventivo e WhatsApp. Resta sempre visibile e ogni tanto si apre in una capsula con una scritta.
 */
export default function ContactBezel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // richiamo: 0 = fermo, 1 = si apre in capsula con la scritta, 2 = torna lunetta
  const [pill, setPill] = useState(0);
  const [msg, setMsg] = useState(0);
  const usedRef = useRef(false);
  const dock = useRef<HTMLDivElement>(null);
  const pillText = useRef<HTMLSpanElement>(null);
  // capsula larga quanto la scritta: 76px per la lunetta a sinistra, poi il testo e 26px di margine.
  // La lunetta rotola fino al bordo sinistro (metà capsula meno metà lunetta) e la ghiera gira di conseguenza
  useLayoutEffect(() => {
    const fit = () => {
      const t = pillText.current;
      const d = dock.current;
      if (!t || !d) return;
      // b = diametro della lunetta (68px su telefono, 88px su computer)
      const b = d.offsetWidth || 68;
      const w = Math.ceil(b + 8 + t.scrollWidth + 26);
      // su telefono la capsula si apre da entrambi i lati; su computer, nell'angolo, solo verso sinistra
      const corner = window.matchMedia("(min-width: 1024px)").matches;
      const pillX = corner ? -(w - b) / 2 : 0;
      const shift = corner ? -(w - b) : -(w / 2 - b / 2);
      d.style.setProperty("--pill-w", `${w}px`);
      d.style.setProperty("--pill-x", `${pillX}px`);
      d.style.setProperty("--pill-shift", `${shift}px`);
      d.style.setProperty("--pill-roll", `${(shift / (Math.PI * b)) * 360}deg`);
    };
    fit();
    document.fonts?.ready.then(fit); // rimisura quando i caratteri sono caricati
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [msg]);
  const hourHand = useRef<HTMLImageElement>(null);
  const minuteHand = useRef<HTMLImageElement>(null);
  const secondHand = useRef<HTMLImageElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // ora vera: si aggiorna solo quando i secondi scattano, non a ogni fotogramma
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const beats = reduced ? 1 : BEATS;
    let lastBeat = -1;
    // un solo timer condiviso con le lancette della vetrina (lib/beatClock), invece di un ciclo a ogni fotogramma
    return onBeat(beats, (now) => {
      const beat = Math.floor((now.getTime() * beats) / 1000);
      if (beat === lastBeat) return;
      lastBeat = beat;
      const sec = now.getSeconds() + Math.floor((now.getMilliseconds() / 1000) * beats) / beats;
      const min = now.getMinutes() + now.getSeconds() / 60;
      const hr = (now.getHours() % 12) + min / 60;
      if (hourHand.current) hourHand.current.style.transform = `rotate(${hr * 30}deg)`;
      if (minuteHand.current) minuteHand.current.style.transform = `rotate(${min * 6}deg)`;
      if (secondHand.current) secondHand.current.style.transform = `rotate(${sec * 6}deg)`;
    });
  }, []);

  // resta sempre visibile; se la pagina scorre mentre i contatti sono aperti, si richiudono
  useEffect(() => {
    if (!open) return;
    const y0 = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - y0) > 12 && setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // ogni tanto la lunetta rotola a sinistra e si apre in una capsula con la scritta (Contatta Roberto, poi
  // Preventivo gratuito, a turno), poi torna lunetta. Il primo dopo 4 secondi, poi ogni 16; dopo che hai
  // aperto i contatti una volta non serve più
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers: number[] = [];
    let n = 0;
    const play = () => {
      if (usedRef.current || document.hidden) return;
      setMsg(n++ % MESSAGES.length);
      setPill(1);
      timers.push(window.setTimeout(() => setPill(2), 3400));
      timers.push(window.setTimeout(() => setPill(0), 4200));
    };
    timers.push(window.setTimeout(play, 4000));
    const every = window.setInterval(play, 16000);
    return () => {
      timers.forEach(clearTimeout);
      window.clearInterval(every);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    usedRef.current = true;
    setPill(0);
    setOpen((v) => !v);
    navigator.vibrate?.(8); // lo scatto si sente, dove il telefono lo permette
  };

  const items = [
    { label: "Chiama", href: `tel:${site.phone.replace(/\s/g, "")}`, icon: <PhoneIcon />, external: false },
    { label: "Preventivo", href: "/preventivo", icon: <QuoteIcon />, primary: true, external: false },
    { label: "WhatsApp", href: whatsappLink("Buongiorno Roberto, vorrei un'informazione sul mio orologio."), icon: <WhatsAppIcon className="h-5 w-5" />, external: true },
  ];

  return (
    <div>
      {/* sfondo: la pagina si sfoca e si scurisce, restano in evidenza solo i contatti */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-[#04120c]/55 backdrop-blur-[6px] transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        ref={dock}
        style={{ viewTransitionName: "mobile-bar" }}
        className={`bezel-dock fixed bottom-[calc(14px+env(safe-area-inset-bottom))] left-1/2 z-40 h-[68px] w-[68px] -translate-x-1/2 lg:bottom-8 lg:left-auto lg:right-8 lg:h-[60px] lg:w-[60px] lg:translate-x-0 ${open ? "is-open" : ""} ${
          pill && !open ? "is-pill-anim" : ""
        } ${pill === 1 && !open ? "is-pill" : ""}`}
      >
        <p
          aria-hidden={!open}
          className="bezel-ask pointer-events-none absolute bottom-[170px] left-1/2 w-max -translate-x-1/2 font-display text-[1.35rem] italic text-cream"
        >
          Come preferisci contattarmi?
        </p>
        <ul id="contatti-lunetta" aria-label="Contatti">
          {items.map((it, i) => {
            const a = (ANGLES[i] * Math.PI) / 180;
            const ad = (ANGLES_DESK[i] * Math.PI) / 180;
            const style = {
              "--x": `${Math.sin(a) * ARC}px`,
              "--y": `${-Math.cos(a) * ARC}px`,
              "--xd": `${Math.sin(ad) * ARC_DESK}px`,
              "--yd": `${-Math.cos(ad) * ARC_DESK}px`,
              "--d": `${i * 45}ms`,
            } as React.CSSProperties;
            const cls = `bezel-item ${it.primary ? "is-primary" : ""}`;
            const inner = (
              <>
                <span className="bezel-medal">{it.icon}</span>
                <span className="bezel-label">{it.label}</span>
              </>
            );
            return (
              <li key={it.label} style={style} className="absolute left-1/2 top-1/2">
                {it.external || it.href.startsWith("tel:") ? (
                  <a href={it.href} tabIndex={open ? 0 : -1} className={cls} {...(it.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} onClick={() => setOpen(false)}>
                    {inner}
                  </a>
                ) : (
                  <Link href={it.href} tabIndex={open ? 0 : -1} className={cls} onClick={() => setOpen(false)}>
                    {inner}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* su computer, al passaggio del mouse: cosa fa la lunetta */}
        <span aria-hidden className="bezel-hint">Contattami</span>

        {/* capsula del richiamo: si allarga dietro la lunetta, che rotola sul lato sinistro */}
        <button type="button" tabIndex={-1} aria-hidden onClick={toggle} className="bezel-pill">
          <span ref={pillText} className="bezel-pill-text">
            <small>{MESSAGES[msg][0]}</small>
            <em>{MESSAGES[msg][1]}</em>
          </span>
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls="contatti-lunetta"
          aria-label={open ? "Chiudi i contatti" : "Contatti: chiama, WhatsApp o preventivo"}
          className="bezel-btn absolute inset-0 rounded-full"
        >
          {/* quadrante soleil, fermo, sotto la ghiera */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/lunetta/quadrante.webp" alt="" draggable={false} className="absolute inset-[12.8%] h-[74.4%] w-[74.4%] rounded-full" />
          {/* lancette vere sopra il quadrante (immagini quadrate con il perno al centro, a mezzogiorno) */}
          <span className="bezel-hands absolute inset-[12.8%]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={hourHand} src="/lunetta/ore.webp" alt="" draggable={false} className="absolute inset-0 h-full w-full" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={minuteHand} src="/lunetta/minuti.webp" alt="" draggable={false} className="absolute inset-0 h-full w-full" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={secondHand} src="/lunetta/secondi.webp" alt="" draggable={false} className="absolute inset-0 h-full w-full" />
            {/* rubino al centro del perno */}
            <span className="absolute left-1/2 top-1/2 h-[5%] w-[5%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fbe7ad,#a67b2c)]" />
          </span>
          {/* ghiera girevole con il bordo zigrinato e il triangolo luminoso */}
          <span className="bezel-ring absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/lunetta/ghiera.webp" alt="" draggable={false} className="absolute inset-0 h-full w-full" />
            {/* il punto luminoso del triangolo che ogni tanto si accende */}
            <span className="bezel-lume absolute left-[50.5%] top-[7.7%] h-[7%] w-[7%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
          </span>
          <span aria-hidden className="bezel-glint absolute inset-0 overflow-hidden rounded-full" />
        </button>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  );
}

function QuoteIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M7 3.5h7l4 4v13H7z" />
      <path d="M14 3.5v4h4M9.5 12h6M9.5 15.5h6" />
    </svg>
  );
}
