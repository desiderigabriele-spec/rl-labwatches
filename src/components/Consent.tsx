"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CONSENT_KEY } from "@/lib/consenso";

/**
 * Consenso ai cookie di statistica (Google Analytics e Microsoft Clarity).
 * Finché non accetti non si carica niente: nessuno script, nessun cookie. La scelta resta nel browser
 * (localStorage "rl-consenso": "si" | "no") e si cambia da "Preferenze cookie" nel piè di pagina.
 * Gli script si caricano a pagina ferma (requestIdleCallback), così non tolgono fluidità allo scorrimento.
 * ID: NEXT_PUBLIC_GA_ID (Analytics di RL Lab Watches), NEXT_PUBLIC_GTM_ID (spento) e NEXT_PUBLIC_CLARITY_ID (predefinito il progetto di Roberto).
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-RMM6K4FQH5";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || ""; // vuoto: Analytics va diretto con GA_ID (un solo tag Google per pagina)
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "zh3obcyaoc";
const KEY = CONSENT_KEY;
const attivo = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

type W = Window & { dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; clarity?: unknown; __rlStats?: boolean };

function loadStats() {
  const w = window as W;
  if (!attivo || w.__rlStats) return;
  w.__rlStats = true;
  const go = () => {
    if (GA_ID) {
      w.dataLayer = w.dataLayer || [];
      w.gtag = function () {
        // eslint-disable-next-line prefer-rest-params
        w.dataLayer!.push(arguments);
      };
      w.gtag("js", new Date());
      w.gtag("config", GA_ID, { anonymize_ip: true });
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    }
    if (GTM_ID) {
      // contenitore Google (Tag Manager) del nuovo account Analytics
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
      document.head.appendChild(s);
    }
    if (CLARITY_ID) {
      const c = ((w as unknown as Record<string, unknown>).clarity ||= function (...a: unknown[]) {
        const f = (w as unknown as { clarity: { q?: unknown[] } }).clarity;
        (f.q = f.q || []).push(a);
      });
      void c;
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.clarity.ms/tag/${CLARITY_ID}`;
      document.head.appendChild(s);
    }
  };
  const ric = (window as { requestIdleCallback?: (f: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
  if (ric) ric(go, { timeout: 4000 });
  else setTimeout(go, 2000);
}

const read = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};
const write = (v: string | null) => {
  try {
    if (v) localStorage.setItem(KEY, v);
    else localStorage.removeItem(KEY);
  } catch {}
};

/** dal piè di pagina: riapre la scelta */
export function openConsent() {
  window.dispatchEvent(new Event("rl-consenso"));
}

/**
 * Il banner è già nell'HTML e si vede dal primo disegno della pagina: se comparisse dopo qualche secondo
 * diventerebbe "l'elemento più grande" e Google conterebbe la pagina come lenta (LCP).
 * Chi ha già scelto non lo vede mai: lo script CONSENT_HEAD, in <head>, mette data-consenso su <html>
 * prima del disegno e il CSS lo nasconde (vedi lib/consenso.ts e globals.css).
 */

export default function Consent() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const v = read();
    if (v === "si") loadStats();
    if (v) setShow(false);
    const reopen = () => {
      document.documentElement.removeAttribute("data-consenso");
      setShow(true);
    };
    window.addEventListener("rl-consenso", reopen);
    return () => window.removeEventListener("rl-consenso", reopen);
  }, []);

  const choose = (v: "si" | "no") => {
    const before = read();
    write(v);
    setShow(false);
    if (v === "si") loadStats();
    // revoca dopo un consenso: gli script già caricati si tolgono solo ricaricando la pagina
    else if (before === "si") window.location.reload();
  };

  if (!show) return null;
  return (
    <div
      role="dialog"
      aria-label="Cookie di statistica"
      className="rl-consent fixed inset-x-3 bottom-[calc(96px+env(safe-area-inset-bottom))] z-[45] mx-auto max-w-lg rounded-2xl border border-gold-3/30 bg-[#0b100d]/95 p-4 text-cream shadow-[0_20px_50px_rgba(0,0,0,0.45)] sm:bottom-6 sm:left-6 sm:right-auto sm:p-5"
    >
      <p className="text-sm leading-relaxed text-cream/80">
        Uso cookie di statistica (Google Analytics e Microsoft Clarity) per capire come viene usato il sito e
        migliorarlo. Si attivano solo se accetti.{" "}
        <Link href="/cookie" className="underline underline-offset-2 hover:text-gold-3">
          Informativa cookie
        </Link>
      </p>
      <div className="mt-3 flex gap-2.5">
        <button type="button" onClick={() => choose("si")} className="btn-gold flex-1 justify-center !py-2.5">
          Accetta
        </button>
        <button type="button" onClick={() => choose("no")} className="btn-gold btn-gold-quiet flex-1 justify-center !py-2.5">
          Rifiuta
        </button>
      </div>
    </div>
  );
}

/** "Preferenze cookie" nel piè di pagina */
export function ConsentButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={openConsent} className={className}>
      Preferenze cookie
    </button>
  );
}
