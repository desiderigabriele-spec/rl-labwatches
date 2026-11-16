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
/** anello della lettura: quanto della pagina hai già letto */
const PR = 33.5;
const PC = 2 * Math.PI * PR;

/**
 * Contatti su telefono: una lunetta da subacqueo in basso al centro, al posto della barra.
 * L'anello ruota a scatti come una vera ghiera, le lancette fanno un giro e si aprono a ventaglio
 * Chiama, Preventivo e WhatsApp. L'arco d'oro sull'anello si riempie man mano che leggi la pagina.
 * Si nasconde mentre scorri verso il basso e torna appena ti fermi o risali, come la barra di prima.
 */
export default function ContactBezel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [nudge, setNudge] = useState(false);
  const progress = useRef<SVGCircleElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // nascondi scorrendo in giù, mostra appena ti fermi; aggiorna l'arco della lettura
  useEffect(() => {
    let last = window.scrollY;
    let idle = 0;
    let raf = 0;
    const paint = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      progress.current?.setAttribute("stroke-dashoffset", String(PC * (1 - p)));
    };
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
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      cancelAnimationFrame(raf);
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
          <svg viewBox="-50 -50 100 100" className="h-full w-full overflow-visible" aria-hidden>
            <defs>
              <linearGradient id="bz-edge" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f6e5b0" />
                <stop offset=".32" stopColor="#c19443" />
                <stop offset=".58" stopColor="#6c501b" />
                <stop offset=".82" stopColor="#e2c27a" />
                <stop offset="1" stopColor="#8a6826" />
              </linearGradient>
              <radialGradient id="bz-insert" cx=".5" cy=".38" r=".62">
                <stop offset="0" stopColor="#13563b" />
                <stop offset=".7" stopColor="#06291b" />
                <stop offset="1" stopColor="#02140d" />
              </radialGradient>
              <radialGradient id="bz-dial" cx=".42" cy=".32" r=".75">
                <stop offset="0" stopColor="#0f7149" />
                <stop offset=".55" stopColor="#034128" />
                <stop offset="1" stopColor="#011a10" />
              </radialGradient>
              <linearGradient id="bz-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f7e6b4" />
                <stop offset="1" stopColor="#b78f3e" />
              </linearGradient>
            </defs>
            {/* bordo zigrinato in oro */}
            <circle r="49" fill="url(#bz-edge)" />
            <circle r="47.6" fill="none" stroke="#3f2e0d" strokeOpacity=".55" strokeWidth="2.4" strokeDasharray="1.25 1.24" />
            <circle r="46.3" fill="none" stroke="#fbeec6" strokeOpacity=".55" strokeWidth=".5" />
            {/* ghiera girevole: inserto verde con le tacche dei minuti e il triangolo luminoso */}
            <g className="bezel-ring">
              <circle r="45.6" fill="url(#bz-insert)" />
              {Array.from({ length: 60 }, (_, i) => {
                if (i === 0) return null;
                const r = `rotate(${i * 6})`;
                if (i % 5 === 0) return <rect key={i} x="-.85" y="-44" width="1.7" height="5.2" fill="url(#bz-gold)" transform={r} />;
                if (i < 15) return <circle key={i} cy="-42" r=".7" fill="#e8cf8f" transform={r} />;
                return <rect key={i} x="-.3" y="-43.6" width=".6" height="2.2" fill="#e8cf8f" opacity=".75" transform={r} />;
              })}
              <path d="M0 -44.2 L4 -37.6 L-4 -37.6 Z" fill="url(#bz-gold)" />
              <circle className="bezel-lume" cy="-39.9" r="1.35" fill="#fffbea" />
              {/* quanto hai letto della pagina */}
              <circle r={PR} fill="none" stroke="#d7b368" strokeOpacity=".16" strokeWidth="1.1" />
              <circle
                ref={progress}
                r={PR}
                fill="none"
                stroke="#e9cd86"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeDasharray={PC}
                strokeDashoffset={PC}
                transform="rotate(-90)"
              />
            </g>
            {/* quadrante soleil, fermo */}
            <circle r="31.8" fill="#010c07" opacity=".6" />
            <circle r="31" fill="url(#bz-dial)" />
            <g stroke="#fff" strokeOpacity=".05" strokeWidth=".6">
              {Array.from({ length: 36 }, (_, i) => (
                <line key={i} y1="-5" y2="-30" transform={`rotate(${i * 10})`} />
              ))}
            </g>
            {[0, 90, 180, 270].map((d) => (
              <rect key={d} x="-.8" y="-28.5" width="1.6" height="4.5" rx=".4" fill="url(#bz-gold)" transform={`rotate(${d})`} />
            ))}
            {/* lancette come nel logo: alle 10 e 10, all'apertura fanno un giro e si fermano a mezzogiorno */}
            <g className="bezel-hand bezel-h">
              <circle r="26" fill="none" />
              <path d="M-1.7 3.5 L-1.15 -14.5 L0 -17 L1.15 -14.5 L1.7 3.5 Z" fill="url(#bz-gold)" />
            </g>
            <g className="bezel-hand bezel-m">
              <circle r="26" fill="none" />
              <path d="M-1.3 4.5 L-.8 -22.5 L0 -25 L.8 -22.5 L1.3 4.5 Z" fill="url(#bz-gold)" />
            </g>
            <circle r="2.6" fill="url(#bz-gold)" />
            <circle r=".9" fill="#04241a" />
            {/* riflesso del vetro */}
            <ellipse cx="-9" cy="-15" rx="19" ry="8" fill="#fff" opacity=".07" transform="rotate(-28 -9 -15)" />
          </svg>
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
