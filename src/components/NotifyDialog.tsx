"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { whatsappLink } from "@/data/site";

/**
 * Finestra "Avvisami": la vetrina online apre a gennaio 2027; chi lascia email o telefono viene avvisato
 * quando gli orologi sono disponibili. Si apre sopra l'orologio ingrandito (zoom della vetrina) o da un bottone.
 * Invio con /api/avviso; se l'invio diretto non è configurato, apre WhatsApp con il messaggio già scritto.
 */
export default function NotifyDialog({ open, brand, onClose }: { open: boolean; brand?: string; onClose: () => void }) {
  const [contact, setContact] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    setState("idle");
    setError("");
    const t = window.setTimeout(() => input.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = contact.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || /^\+?[\d\s().-]{7,20}$/.test(value);
    if (!valid) return setError("Scrivi un'email o un numero di telefono validi.");
    if (!consent) return setError("Serve il consenso per poterti avvisare.");
    setError("");
    setState("sending");
    const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/avviso", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: value, brand, consent, website }),
      });
      if (res.ok) return setState("done");
      if (res.status === 503) {
        // invio diretto non ancora attivo: stesso messaggio su WhatsApp
        window.open(
          whatsappLink(`Buongiorno Roberto, vorrei essere avvisato quando la vetrina apre${brand ? ` (orologi ${brand})` : ""}. Il mio contatto: ${value}`),
          "_blank",
          "noopener"
        );
        return setState("done");
      }
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Invio non riuscito. Riprova tra poco.");
      setState("error");
    } catch {
      setError("Invio non riuscito. Controlla la connessione e riprova.");
      setState("error");
    }
  };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-3 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-t`}
        >
          <button type="button" aria-label="Chiudi" onClick={onClose} className="absolute inset-0 cursor-default bg-[#04120c]/60 backdrop-blur-[6px]" />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className="guilloche relative w-full max-w-md overflow-hidden rounded-[22px] border border-gold-3/30 bg-green-2 p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-cream shadow-[0_40px_80px_rgba(0,0,0,0.55)] sm:p-8"
          >
            <button type="button" onClick={onClose} aria-label="Chiudi" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-lg text-cream/80 hover:text-cream">
              ✕
            </button>
            <p className="eyebrow !text-gold-3">La vetrina · gennaio 2027</p>
            {state === "done" ? (
              <div className="mt-4">
                <h2 id={`${id}-t`} className="font-display text-3xl font-light leading-tight">
                  Grazie, <em className="text-gold-3">ti avviso io.</em>
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-cream/70">
                  Appena gli orologi{brand ? ` ${brand}` : ""} saranno disponibili ti scrivo. Se nel frattempo cerchi un modello preciso, chiedimelo pure.
                </p>
                <button type="button" onClick={onClose} className="btn mt-7 !border-gold-3 !bg-gold-3 !text-green-2 hover:!bg-cream">
                  Torna alla vetrina
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-4">
                <h2 id={`${id}-t`} className="pr-10 font-display text-3xl font-light leading-tight">
                  Gli orologi{brand ? <> <em className="text-gold-3">{brand}</em></> : null} arrivano a gennaio.
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-cream/70">
                  La vetrina online apre a gennaio 2027. Lasciami la tua email o il tuo numero: ti avviso io quando ci sono gli orologi disponibili.
                </p>
                <label htmlFor={`${id}-c`} className="mt-6 block text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold-3">
                  Email o telefono
                </label>
                <input
                  ref={input}
                  id={`${id}-c`}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  autoComplete="email"
                  inputMode="email"
                  placeholder="nome@email.it oppure 333 1234567"
                  className="mt-2 w-full rounded-xl border border-cream/25 bg-cream/[0.06] px-4 py-3.5 text-base text-cream placeholder:text-cream/35 focus:border-gold-3 focus:outline-none"
                />
                {/* antispam: invisibile alle persone */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />
                <label className="mt-4 flex items-start gap-3 text-xs leading-relaxed text-cream/65">
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#d7b368]" />
                  <span>
                    Acconsento a essere contattato solo per questo avviso. Leggi l&apos;
                    <Link href="/privacy" className="underline underline-offset-2 hover:text-gold-3" onClick={onClose}>
                      informativa sulla privacy
                    </Link>
                    .
                  </span>
                </label>
                {error && <p className="mt-3 text-sm text-[#f0b9a8]">{error}</p>}
                <button type="submit" disabled={state === "sending"} className="btn mt-6 w-full justify-center !border-gold-3 !bg-gold-3 !text-green-2 hover:!bg-cream disabled:opacity-60">
                  {state === "sending" ? "Invio…" : "Avvisami"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
