"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

/**
 * Chat dei contatti, al posto della lunetta: un piccolo dialogo guidato (di cosa hai bisogno, che orologio è) che
 * finisce su WhatsApp, email o telefono con il messaggio già scritto. Nessun servizio esterno e nessuna libreria:
 * il pannello si monta solo quando lo apri, il pulsante è un elemento fermo (niente animazioni continue).
 */
const TOPICS = [
  { k: "restauro", label: "Restauro o riparazione", ask: "Che orologio è e cosa ha? Marca, modello e il problema, se lo sai." },
  { k: "revisione", label: "Revisione / manutenzione", ask: "Che orologio è? Marca e modello, e da quanto non viene revisionato." },
  { k: "vendere", label: "Vendere il mio orologio", ask: "Che orologio vuoi vendere? Marca, modello e anno, se lo sai." },
  { k: "comprare", label: "Comprare un orologio", ask: "Che orologio cerchi? Marca, modello o budget." },
  { k: "altro", label: "Altro", ask: "Scrivimi pure la tua domanda." },
] as const;
type Topic = (typeof TOPICS)[number];
type Msg = { from: "me" | "you"; text: string };

const SEEN = "rl-chat-hint";

function ChatIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 12a8 8 0 0 1-11.6 7.1L4 20l1-4.1A8 8 0 1 1 20 12Z" />
      <path d="M8.5 10.5h7M8.5 13.5h4.5" />
    </svg>
  );
}

export default function Chat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [watch, setWatch] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const body = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => setOpen(false), [pathname]);

  // un invito discreto, una volta per visita, dopo qualche secondo
  useEffect(() => {
    let seen = false;
    try {
      seen = !!sessionStorage.getItem(SEEN);
    } catch {}
    if (seen) return;
    const show = window.setTimeout(() => setHint(true), 7000);
    const hide = window.setTimeout(() => setHint(false), 15000);
    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    setHint(false);
    try {
      sessionStorage.setItem(SEEN, "1");
    } catch {}
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // l'ultima risposta sempre in vista
  useEffect(() => {
    body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" });
    if (topic && watch === null) input.current?.focus({ preventScroll: true });
  }, [topic, watch, open]);

  const restart = () => {
    setTopic(null);
    setWatch(null);
    setDraft("");
  };
  const send = (e?: React.FormEvent) => {
    e?.preventDefault();
    setWatch(draft.trim());
  };

  const msgs: Msg[] = [{ from: "you", text: "Ciao, sono Roberto. Di cosa hai bisogno? Rispondi qui sotto, oppure usa i pulsanti in alto." }];
  if (topic) {
    msgs.push({ from: "me", text: topic.label }, { from: "you", text: topic.ask });
    if (watch !== null) {
      if (watch) msgs.push({ from: "me", text: watch });
      msgs.push({ from: "you", text: "Perfetto. Come preferisci continuare? Ti rispondo io, di persona." });
    }
  }

  const text = topic
    ? `Buongiorno Roberto, ti scrivo dal sito. ${topic.label}.${watch ? ` ${watch}` : ""}`
    : "Buongiorno Roberto, ti scrivo dal sito.";
  const mail = `mailto:${site.email}?subject=${encodeURIComponent(`Richiesta dal sito: ${topic?.label ?? "informazioni"}`)}&body=${encodeURIComponent(`${text}\n\n`)}`;

  return (
    <>
      {/* invito, una volta per visita */}
      {hint && !open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="chat-hint fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] right-4 z-40 max-w-[15rem] rounded-2xl rounded-br-md border border-gold-3/30 bg-[#0b100d] px-4 py-3 text-left text-sm leading-snug text-cream shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:right-6"
        >
          Un orologio da sistemare, vendere o trovare? <span className="text-gold-3">Scrivimi qui.</span>
        </button>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="chat-roberto"
        aria-label={open ? "Chiudi la chat" : "Scrivi a Roberto"}
        className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex h-14 items-center gap-2.5 rounded-full border border-gold-3/60 bg-[#0b3424] pl-4 pr-5 text-cream shadow-[0_12px_28px_rgba(0,30,18,0.4)] transition-colors hover:bg-[#0d4a33] sm:right-6"
      >
        {open ? <span className="grid h-6 w-6 place-items-center text-lg leading-none">✕</span> : <ChatIcon />}
        <span className="text-sm font-medium tracking-[0.04em]">{open ? "Chiudi" : "Scrivimi"}</span>
      </button>

      {open && (
        <div
          id="chat-roberto"
          role="dialog"
          aria-label="Chat con Roberto"
          data-lenis-prevent
          className="chat-panel fixed inset-x-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-50 flex max-h-[min(34rem,calc(100dvh-8rem))] flex-col overflow-hidden rounded-2xl border border-gold-3/25 bg-[#0b100d] text-cream shadow-[0_30px_60px_rgba(0,0,0,0.5)] sm:inset-x-auto sm:right-6 sm:w-[22rem]"
        >
          <div className="flex items-center gap-3 border-b border-cream/10 px-4 py-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/roberto-chat.webp" alt="" width={40} height={40} className="h-10 w-10 rounded-full bg-[#1a2a22] object-cover" onError={(e) => (e.currentTarget.style.visibility = "hidden")} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-tight">Roberto Landi</p>
              <p className="text-xs text-cream/65">Orologiaio a Pistoia · rispondo io, di persona</p>
            </div>
            {topic && (
              <button type="button" onClick={restart} className="text-xs text-cream/65 underline underline-offset-2 hover:text-gold-3">
                Ricomincia
              </button>
            )}
          </div>

          {/* subito, senza domande: chi sa già cosa vuole */}
          <div className="grid grid-cols-4 gap-1.5 border-b border-cream/10 px-3 py-2.5">
            <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className="chat-quick">
              <WhatsAppIcon className="h-[18px] w-[18px]" />
              WhatsApp
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="chat-quick">
              <span aria-hidden className="text-base leading-[18px]">☏</span>
              Chiama
            </a>
            <a href={mail} className="chat-quick">
              <span aria-hidden className="text-base leading-[18px]">✉</span>
              Email
            </a>
            <Link href="/preventivo" onClick={() => setOpen(false)} className="chat-quick">
              <span aria-hidden className="text-base leading-[18px]">✎</span>
              Preventivo
            </Link>
          </div>

          <div ref={body} className="flex-1 space-y-2.5 overflow-y-auto overscroll-contain px-4 py-4">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={`chat-msg max-w-[85%] rounded-2xl px-3.5 py-2.5 text-base leading-snug ${
                  m.from === "you" ? "rounded-bl-md bg-cream/[0.07]" : "ml-auto rounded-br-md bg-[#0b3424] text-cream"
                }`}
              >
                {m.text}
              </p>
            ))}

            {!topic && (
              <div className="flex flex-wrap gap-2 pt-1">
                {TOPICS.map((t) => (
                  <button key={t.k} type="button" onClick={() => setTopic(t)} className="chat-chip">
                    {t.label}
                  </button>
                ))}
              </div>
            )}

            {topic && watch !== null && (
              <div className="grid gap-2 pt-1">
                <a href={whatsappLink(text)} target="_blank" rel="noopener noreferrer" className="chat-go bg-[#1f7a4d] text-white hover:bg-[#18663f]">
                  <WhatsAppIcon className="h-5 w-5" /> Continua su WhatsApp
                </a>
                <a href={mail} className="chat-go border border-gold-3/50 hover:bg-gold-3/10">
                  <span aria-hidden>✉</span> Scrivimi un&apos;email
                </a>
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="chat-go border border-cream/20 hover:bg-cream/5">
                  <span aria-hidden>☏</span> Chiamami · {site.phone}
                </a>
                <Link href="/preventivo" onClick={() => setOpen(false)} className="pt-1 text-center text-xs text-cream/65 underline underline-offset-2 hover:text-gold-3">
                  Preferisci un preventivo con le foto? Compila il modulo
                </Link>
              </div>
            )}
          </div>

          {topic && watch === null && (
            <form onSubmit={send} className="flex items-end gap-2 border-t border-cream/10 p-3">
              <label htmlFor="chat-testo" className="sr-only">
                Il tuo messaggio
              </label>
              <textarea
                id="chat-testo"
                ref={input}
                rows={1}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) send(e);
                }}
                placeholder="Es. Rolex Submariner, si ferma dopo un giorno"
                className="max-h-28 min-h-[2.75rem] flex-1 resize-none rounded-xl border border-cream/20 bg-cream/[0.05] px-3 py-2.5 text-base text-cream placeholder:text-cream/50 focus:border-gold-3 focus:outline-none sm:text-base"
              />
              <button type="submit" className="h-11 shrink-0 rounded-xl bg-gold-3 px-4 text-sm font-semibold text-[#0b100d]">
                {draft.trim() ? "Invia" : "Salta"}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
