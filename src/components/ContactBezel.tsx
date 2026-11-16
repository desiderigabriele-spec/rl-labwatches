"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

/** raggio dell'arco su cui si aprono i contatti, in px dal centro della lunetta */
const ARC = 104;
/** Chiama a sinistra, Preventivo in alto al centro, WhatsApp a destra: gradi dalla verticale */
const ANGLES = [-58, 0, 58];
/** scatti dei secondi al secondo, come un calibro a 28.800 alternanze */
const BEATS = 8;

/**
 * Contatti su telefono: una lunetta da subacqueo in basso al centro, al posto della barra.
 * Ghiera, quadrante e lancette sono foto (public/lunetta, originali in VETRINA/lunetta) e le lancette
 * segnano l'ora vera. Al tocco la ghiera ruota a scatti come una vera ghiera e si aprono a ventaglio
 * Chiama, Preventivo e WhatsApp. Si nasconde mentre scorri verso il basso e torna appena ti fermi o risali.
 */
export default function ContactBezel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [nudge, setNudge] = useState(false);
  const hourHand = useRef<HTMLImageElement>(null);
  const minuteHand = useRef<HTMLImageElement>(null);
  const secondHand = useRef<HTMLImageElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // ora vera: si aggiorna solo quando i secondi scattano, non a ogni fotogramma
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const beats = reduced ? 1 : BEATS;
    let lastBeat = -1;
    let raf = 0;
    const tick = () => {
      const now = new Date();
      const beat = Math.floor((now.getTime() * beats) / 1000);
      if (beat !== lastBeat) {
        lastBeat = beat;
        const sec = now.getSeconds() + Math.floor((now.getMilliseconds() / 1000) * beats) / beats;
        const min = now.getMinutes() + now.getSeconds() / 60;
        const hr = (now.getHours() % 12) + min / 60;
        if (hourHand.current) hourHand.current.style.transform = `rotate(${hr * 30}deg)`;
        if (minuteHand.current) minuteHand.current.style.transform = `rotate(${min * 6}deg)`;
        if (secondHand.current) secondHand.current.style.transform = `rotate(${sec * 6}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // nascondi scorrendo in giù, mostra appena ti fermi
  useEffect(() => {
    let last = window.scrollY;
    let idle = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (Math.abs(y - last) >= 6) {
        setHidden(y > last && y > 240 && !atBottom);
        setOpen(false);
        last = y;
      }
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setHidden(false), 350);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, [pathname]);

  // un solo scatto della ghiera poco dopo l'apertura del sito, per far capire che si tocca
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const a = window.setTimeout(() => setNudge(true), 2600);
    const b = window.setTimeout(() => setNudge(false), 3300);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const toggle = () => {
    setOpen((v) => !v);
    navigator.vibrate?.(8); // lo scatto si sente, dove il telefono lo permette
  };

  const items = [
    { label: "Chiama", href: `tel:${site.phone.replace(/\s/g, "")}`, icon: <PhoneIcon />, external: false },
    { label: "Preventivo", href: "/preventivo", icon: <QuoteIcon />, primary: true, external: false },
    { label: "WhatsApp", href: whatsappLink("Buongiorno Roberto, vorrei un'informazione sul mio orologio."), icon: <WhatsAppIcon className="h-5 w-5" />, external: true },
  ];

  return (
    <div className="lg:hidden">
      {/* sfondo: la pagina si sfoca e si scurisce, restano in evidenza solo i contatti */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-[#04120c]/55 backdrop-blur-[6px] transition-opacity duration-500 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        style={{ viewTransitionName: "mobile-bar" }}
        className={`bezel-dock fixed bottom-[calc(14px+env(safe-area-inset-bottom))] left-1/2 z-40 h-[68px] w-[68px] -translate-x-1/2 transition-transform duration-500 ${
          hidden && !open ? "translate-y-[150%]" : ""
        } ${open ? "is-open" : ""} ${nudge && !open ? "is-nudge" : ""}`}
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
            const style = { "--x": `${Math.sin(a) * ARC}px`, "--y": `${-Math.cos(a) * ARC}px`, "--d": `${i * 45}ms` } as React.CSSProperties;
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
