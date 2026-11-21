"use client";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { whatsappLink } from "@/data/site";

export type Intent = "acquistare" | "vendere";

/**
 * Finestra "Avvisami" della vetrina (apre a gennaio 2027): a sinistra l'orologio da vicino, a destra il modulo.
 * Nome, cognome, email o telefono, e se interessa acquistare, vendere o entrambe le cose.
 * Invio con /api/avviso (email a Roberto); se l'invio diretto non è configurato, apre WhatsApp con il messaggio
 * già scritto. Dove finiscono i dati è spiegato nell'informativa privacy (sezione "Avviso di apertura della vetrina").
 */
export default function NotifyDialog({
  open,
  brand,
  image,
  intent,
  onClose,
}: {
  open: boolean;
  brand?: string;
  /** foto ravvicinata dell'orologio (a sinistra); senza, il cofanetto illuminato */
  image?: string;
  /** scelta già spuntata all'apertura */
  intent?: Intent;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [contact, setContact] = useState("");
  const [buy, setBuy] = useState(true);
  const [sell, setSell] = useState(false);
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);
  const first = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!open) return;
    setState("idle");
    setError("");
    setBuy(intent !== "vendere");
    setSell(intent === "vendere");
    const t = window.setTimeout(() => first.current?.focus(), 350);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, intent, onClose]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = contact.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) || /^\+?[\d\s().-]{7,20}$/.test(value);
    if (!nome.trim() || !cognome.trim()) return setError("Scrivi nome e cognome.");
    if (!valid) return setError("Scrivi un'email o un numero di telefono validi.");
    if (!buy && !sell) return setError("Scegli se ti interessa acquistare, vendere o entrambe le cose.");
    if (!consent) return setError("Serve il consenso per poterti avvisare.");
    setError("");
    setState("sending");
    const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    const payload = { nome: nome.trim(), cognome: cognome.trim(), contact: value, acquistare: buy, vendere: sell, brand, consent, website };
    try {
      const res = await fetch("/api/avviso", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) return setState("done");
      if (res.status === 503) {
        // invio diretto non ancora attivo: stesso messaggio su WhatsApp
        const what = [buy && "acquistare", sell && "vendere"].filter(Boolean).join(" e ");
        window.open(
          whatsappLink(
            `Buongiorno Roberto, sono ${payload.nome} ${payload.cognome}. Vorrei essere avvisato quando apre la vetrina${brand ? ` (orologi ${brand})` : ""}: mi interessa ${what}. Il mio contatto: ${value}`
          ),
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

  const field =
    "mt-1.5 w-full rounded-xl border border-cream/20 bg-cream/[0.05] px-3.5 py-3 text-[0.95rem] text-cream placeholder:text-cream/35 focus:border-gold-3 focus:outline-none";
  const label = "block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-gold-3";

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${id}-t`}
        >
          <button type="button" aria-label="Chiudi" onClick={onClose} className="absolute inset-0 cursor-default bg-[#04120c]/65 backdrop-blur-[6px]" />
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            data-lenis-prevent
            className="relative grid max-h-[92dvh] w-full max-w-[46rem] overflow-y-auto rounded-t-[22px] border border-gold-3/25 bg-[#0b100d] text-cream shadow-[0_40px_80px_rgba(0,0,0,0.6)] sm:grid-cols-[0.82fr_1.18fr] sm:rounded-[22px]"
          >
            {/* l'orologio da vicino */}
            <div className="relative h-40 overflow-hidden bg-[#111] sm:h-auto sm:min-h-[30rem]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image || "/vendi/vetrina.webp"} alt="" className="absolute inset-0 h-full w-full object-cover object-[50%_32%]" />
              <span aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0b100d] sm:bg-gradient-to-r" />
              <span className="absolute bottom-3 left-3 rounded-full bg-[#0b100d]/70 px-3 py-1.5 text-[0.56rem] font-semibold uppercase tracking-[0.24em] text-gold-3 backdrop-blur-sm">
                In vetrina · gennaio 2027
              </span>
            </div>

            <div className="relative px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-7 sm:pb-7 sm:pt-8">
              <button type="button" onClick={onClose} aria-label="Chiudi" className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-cream/25 text-base text-cream/80 hover:text-cream">
                ✕
              </button>
              <p className="eyebrow !text-gold-3">{brand || (intent === "vendere" ? "Compravendita" : "La vetrina")}</p>
              {state === "done" ? (
                <div className="mt-3">
                  <h2 id={`${id}-t`} className="font-display text-3xl font-light leading-tight">
                    Grazie, <em className="text-gold-3">ti avviso io.</em>
                  </h2>
                  <p className="mt-4 text-sm leading-relaxed text-cream/70">
                    Appena gli orologi{brand ? ` ${brand}` : ""} sono in vetrina ti scrivo. Se nel frattempo cerchi un modello preciso o vuoi far valutare il tuo, chiedimelo pure.
                  </p>
                  <button type="button" onClick={onClose} className="btn-gold mt-7">
                    Torna alla vetrina <span aria-hidden>→</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} noValidate className="mt-3">
                  <h2 id={`${id}-t`} className="pr-10 font-display text-[2rem] font-light leading-[1.05]">
                    {intent === "vendere" ? (
                      <>
                        Vendilo con me. <em className="text-gold-3">Così com&apos;è, o restaurato.</em>
                      </>
                    ) : (
                      <>
                        Arriva <em className="text-gold-3">a gennaio.</em>
                      </>
                    )}
                  </h2>
                  <p className="mt-2.5 text-[0.85rem] leading-relaxed text-cream/65">La vetrina online apre a gennaio 2027. Lasciami i tuoi dati: ti avviso io appena è disponibile.</p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`${id}-n`} className={label}>Nome</label>
                      <input ref={first} id={`${id}-n`} value={nome} onChange={(e) => setNome(e.target.value)} autoComplete="given-name" className={field} />
                    </div>
                    <div>
                      <label htmlFor={`${id}-s`} className={label}>Cognome</label>
                      <input id={`${id}-s`} value={cognome} onChange={(e) => setCognome(e.target.value)} autoComplete="family-name" className={field} />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label htmlFor={`${id}-c`} className={label}>Email o telefono</label>
                    <input id={`${id}-c`} value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" placeholder="nome@email.it oppure 333 1234567" className={field} />
                  </div>

                  {/* acquistare, vendere o tutte e due */}
                  <fieldset className="mt-4">
                    <legend className={label}>Mi interessa</legend>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {(
                        [
                          ["Acquistare", buy, setBuy],
                          ["Vendere", sell, setSell],
                        ] as const
                      ).map(([t, on, set]) => (
                        <label key={t} className={`notify-pick ${on ? "is-on" : ""}`}>
                          <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="sr-only" />
                          <span aria-hidden className="notify-tick">{on ? "✓" : ""}</span>
                          {t}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  {/* antispam: invisibile alle persone */}
                  <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="absolute left-[-9999px] h-0 w-0 opacity-0" />

                  <label className="mt-4 flex items-start gap-3 text-[0.72rem] leading-relaxed text-cream/60">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-[#d7b368]" />
                    <span>
                      Ho letto l&apos;
                      <Link href="/privacy" className="underline underline-offset-2 hover:text-gold-3" onClick={onClose}>
                        informativa sulla privacy
                      </Link>{" "}
                      e acconsento al trattamento dei miei dati per ricevere l&apos;avviso di apertura della vetrina ed essere ricontattato per
                      l&apos;acquisto o la vendita indicati. Niente newsletter né pubblicità; posso revocare il consenso quando voglio.
                    </span>
                  </label>
                  {error && <p className="mt-3 text-sm text-[#f0b9a8]">{error}</p>}
                  <button type="submit" disabled={state === "sending"} className="btn-gold mt-5 w-full justify-center disabled:opacity-60">
                    {state === "sending" ? "Invio…" : "Avvisami"} <span aria-hidden>→</span>
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
