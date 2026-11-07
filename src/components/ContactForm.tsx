"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { services } from "@/data/services";
import { brands } from "@/data/brands";
import { WhatsAppIcon } from "./WhatsAppButton";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Modulo contatti / preventivo.
 * Invia direttamente via email (route /api/contatto). Se l'invio diretto non è configurato
 * o non riesce, apre l'app di posta con il messaggio già scritto. In alternativa: WhatsApp.
 */
export default function ContactForm({ quote = false }: { quote?: boolean }) {
  const empty = { name: "", email: "", phone: "", subject: "", brand: "", model: "", service: "", message: "", website: "" };
  const [f, setF] = useState(empty);
  const [status, setStatus] = useState<Status>("idle");

  // servizio precompilato dal link "Richiedi un preventivo" della pagina Servizi
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("servizio");
    if (quote && s && services.some((x) => x.title === s)) setF((v) => ({ ...v, service: s }));
  }, [quote]);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((v) => ({ ...v, [k]: e.target.value }));

  const compose = () => {
    const watch = [f.brand, f.model].filter(Boolean).join(" ");
    const subject = quote ? `Richiesta preventivo${watch ? ` – ${watch}` : ""}` : f.subject || "Richiesta dal sito";
    const lines = [f.message, "", `Nome: ${f.name}`, `Email: ${f.email}`];
    if (f.phone) lines.push(`Telefono: ${f.phone}`);
    if (quote) lines.push(`Orologio: ${watch || "-"}`);
    if (quote && f.service) lines.push(`Servizio: ${f.service}`);
    return { subject, body: lines.join("\n") };
  };

  const openMailApp = () => {
    const { subject, body } = compose();
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contatto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...f, kind: quote ? "preventivo" : "contatto" }),
      });
      if (res.ok) {
        setStatus("sent");
        setF(empty);
        return;
      }
      if (res.status === 503) {
        // invio diretto non ancora configurato: si usa l'app di posta
        setStatus("idle");
        openMailApp();
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  const sendWhatsApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form;
    if (form && !form.reportValidity()) return;
    const { subject, body } = compose();
    window.open(whatsappLink(`${subject}\n\n${body}`), "_blank", "noopener");
  };

  if (status === "sent") {
    return (
      <div className="border border-line bg-paper-2 p-10 text-center" role="status">
        <p className="font-display text-4xl">Grazie!</p>
        <p className="mt-4 text-mute">
          {quote ? "La tua richiesta di preventivo" : "Il tuo messaggio"} è stato inviato. Ti risponderò il prima possibile.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn mt-8">Invia un altro messaggio</button>
      </div>
    );
  }

  const field =
    "mt-1 w-full border-b border-line bg-transparent py-3 text-fg outline-none transition-colors placeholder:text-mute/60 focus:border-gold";

  return (
    <form onSubmit={submit} className="space-y-7">
      {/* campo trappola per lo spam: invisibile alle persone */}
      <input type="text" name="website" value={f.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="grid gap-7 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Nome *</span>
          <input required className={field} value={f.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="block">
          <span className="eyebrow">Email *</span>
          <input required type="email" className={field} value={f.email} onChange={set("email")} autoComplete="email" />
        </label>
        <label className="block">
          <span className="eyebrow">Telefono</span>
          <input type="tel" className={field} value={f.phone} onChange={set("phone")} autoComplete="tel" />
        </label>
        {quote ? (
          <label className="block">
            <span className="eyebrow">Servizio</span>
            <select className={field} value={f.service} onChange={set("service")}>
              <option value="">Non so / da valutare</option>
              {services.map((s) => (
                <option key={s.slug}>{s.title}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="block">
            <span className="eyebrow">Oggetto</span>
            <input className={field} value={f.subject} onChange={set("subject")} />
          </label>
        )}
        {quote && (
          <>
            <label className="block">
              <span className="eyebrow">Marca *</span>
              <input required list="marche" className={field} value={f.brand} onChange={set("brand")} placeholder="es. Rolex" />
              <datalist id="marche">{brands.map((b) => <option key={b.name} value={b.name} />)}</datalist>
            </label>
            <label className="block">
              <span className="eyebrow">Modello / referenza</span>
              <input className={field} value={f.model} onChange={set("model")} placeholder="es. Submariner 16610" />
            </label>
          </>
        )}
      </div>
      <label className="block">
        <span className="eyebrow">{quote ? "Descrivi il problema o l'intervento *" : "Messaggio *"}</span>
        <textarea required rows={5} className={`${field} resize-none`} value={f.message} onChange={set("message")} />
      </label>
      {quote && (
        <p className="text-sm text-mute">
          Se vuoi aggiungere qualche foto dell&apos;orologio, inviala su WhatsApp: aiuta a fare una stima più precisa.
        </p>
      )}
      <p className="text-xs text-mute">
        Inviando il modulo i tuoi dati saranno usati solo per rispondere alla richiesta, come descritto nell&apos;
        <Link href="/privacy" className="underline hover:text-gold">informativa sulla privacy</Link>.
      </p>
      {status === "error" && (
        <p className="text-sm text-red-700" role="alert">
          L&apos;invio non è riuscito.{" "}
          <button type="button" onClick={openMailApp} className="underline">Invia con la tua app di posta</button> oppure su WhatsApp.
        </p>
      )}
      <div className="flex flex-wrap gap-4">
        <button type="submit" disabled={status === "sending"} className="btn btn-solid disabled:opacity-60">
          {status === "sending" ? "Invio in corso…" : quote ? "Invia la richiesta" : "Invia il messaggio"}
        </button>
        <button type="button" onClick={sendWhatsApp} className="btn">
          <WhatsAppIcon className="h-4 w-4" /> Invia su WhatsApp
        </button>
      </div>
    </form>
  );
}
