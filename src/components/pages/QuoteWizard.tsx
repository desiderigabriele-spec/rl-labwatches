"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { brands } from "@/data/brands";
import { services } from "@/data/services";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "@/components/WhatsAppButton";

/**
 * Preventivo in tre passi brevi: che orologio è, cosa serve, come ti rispondo.
 * Invio con /api/contatto (email a Roberto); se l'invio diretto non è attivo si apre WhatsApp con tutto già scritto.
 * Le foto si mandano su WhatsApp (un tocco, messaggio già pronto).
 */
const BRANDS = [...brands.map((b) => b.name), "Altra marca"];
const NEEDS = [...services.filter((s) => s.slug !== "consegna-e-ritiro").map((s) => s.title), "Non so, da valutare"];

export default function QuoteWizard() {
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [need, setNeed] = useState("");
  const [f, setF] = useState({ name: "", email: "", phone: "", message: "", website: "" });
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  // servizio già scelto dalla pagina Restauro (?servizio=...)
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("servizio");
    if (s && NEEDS.includes(s)) setNeed(s);
  }, []);

  const watch = [brand, model.trim()].filter(Boolean).join(" ");
  const summary = `Richiesta di preventivo. Orologio: ${watch || "-"}. Intervento: ${need || "-"}.${f.message.trim() ? ` ${f.message.trim()}` : ""}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = f.email.trim();
    const phone = f.phone.trim();
    if (!f.name.trim()) return setError("Scrivi il tuo nome.");
    if (!email && !phone) return setError("Lasciami l'email o il telefono: basta uno dei due.");
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError("Controlla l'email: non sembra giusta.");
    setError("");
    setState("sending");
    const payload = { kind: "preventivo", name: f.name.trim(), email, phone, brand, model: model.trim(), service: need, message: f.message.trim() || "(nessuna descrizione)", website: f.website };
    try {
      const res = await fetch("/api/contatto", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) return setState("sent");
      if (res.status === 503) {
        window.open(whatsappLink(`Buongiorno Roberto, sono ${payload.name}. ${summary}`), "_blank", "noopener");
        return setState("sent");
      }
      setError("Invio non riuscito: riprova, oppure usa WhatsApp qui sotto.");
    } catch {
      setError("Invio non riuscito: controlla la connessione, oppure usa WhatsApp qui sotto.");
    }
    setState("idle");
  };

  const chip = (on: boolean) => `rounded-full border px-4 py-2.5 text-sm transition-colors ${on ? "border-green bg-green text-cream" : "border-line bg-paper hover:border-gold"}`;
  const field = "mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-3 text-base text-fg outline-none placeholder:text-mute/60 focus:border-gold";
  const label = "text-xs font-semibold uppercase tracking-[0.2em] text-mute";
  const titles = ["Che orologio è?", "Cosa ti serve?", "Come ti rispondo"];

  if (state === "sent")
    return (
      <div className="rounded-2xl border border-line bg-paper-2 p-10 text-center" role="status">
        <p className="font-display text-4xl font-light">Grazie, <em className="text-gold">ci penso io.</em></p>
        <p className="mx-auto mt-3 max-w-md text-mute">Ti rispondo entro la giornata lavorativa. Se vuoi, intanto mandami qualche foto: aiuta a darti una stima precisa.</p>
        <a href={whatsappLink(`Buongiorno Roberto, ti mando le foto per il preventivo (${watch || "il mio orologio"}).`)} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6 inline-flex">
          <WhatsAppIcon className="h-5 w-5" />
          <span><b>Mando le foto</b><small>su WhatsApp</small></span>
        </a>
      </div>
    );

  return (
    <div className="rounded-2xl border border-line bg-paper-2 p-6 sm:p-10">
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow">Passo {step + 1} di 3</p>
        {step > 0 && (
          <button type="button" onClick={() => setStep(step - 1)} className="text-sm text-mute underline underline-offset-2 hover:text-gold">
            Indietro
          </button>
        )}
      </div>
      <h2 className="mt-2 font-display text-4xl font-light">{titles[step]}</h2>
      <div className="mt-4 h-[3px] overflow-hidden rounded-full bg-line">
        <span className="block h-full bg-gold transition-[width] duration-500" style={{ width: `${((step + 1) / 3) * 100}%` }} />
      </div>

      {step === 0 && (
        <div className="mt-8">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Marca">
            {BRANDS.map((b) => (
              <button key={b} type="button" aria-pressed={brand === b} onClick={() => setBrand(b)} className={chip(brand === b)}>
                {b}
              </button>
            ))}
          </div>
          <label className="mt-6 block">
            <span className={label}>Modello o referenza (se lo sai)</span>
            <input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Es. Submariner 16610" className={field} />
          </label>
          <button type="button" disabled={!brand} onClick={() => setStep(1)} className="btn btn-solid mt-8 disabled:opacity-40">
            Avanti →
          </button>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8">
          <p className="text-mute">{watch}</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Intervento">
            {NEEDS.map((n) => (
              <button key={n} type="button" aria-pressed={need === n} onClick={() => { setNeed(n); setStep(2); }} className={chip(need === n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={submit} noValidate className="mt-8 space-y-5">
          <p className="text-mute">{watch} · {need}</p>
          <label className="block">
            <span className={label}>Raccontami il problema (facoltativo)</span>
            <textarea rows={3} value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} placeholder="Es. si ferma dopo un giorno, vetro graffiato…" className={`${field} resize-none`} />
          </label>
          <input name="website" value={f.website} onChange={(e) => setF({ ...f, website: e.target.value })} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className={label}>Nome</span>
              <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" className={field} />
            </label>
            <label className="block">
              <span className={label}>Email</span>
              <input type="email" inputMode="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" className={field} />
            </label>
            <label className="block">
              <span className={label}>Telefono</span>
              <input type="tel" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" className={field} />
            </label>
          </div>
          <p className="text-xs text-mute">
            Email o telefono: basta uno dei due. Uso i tuoi dati solo per risponderti, come spiegato nell&apos;
            <Link href="/privacy" className="underline hover:text-gold">informativa sulla privacy</Link>.
          </p>
          {error && <p className="text-sm text-red-700" role="alert">{error}</p>}
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={state === "sending"} className="btn btn-solid disabled:opacity-60">
              {state === "sending" ? "Invio…" : "Invia la richiesta"}
            </button>
            <a href={whatsappLink(`Buongiorno Roberto. ${summary} Ti mando le foto.`)} target="_blank" rel="noopener noreferrer" className="btn">
              <WhatsAppIcon className="h-4 w-4" /> Oppure su WhatsApp, con le foto
            </a>
          </div>
        </form>
      )}
    </div>
  );
}
