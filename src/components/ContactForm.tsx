"use client";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { services } from "@/data/services";
import { brands } from "@/data/brands";
import { WhatsAppIcon } from "./WhatsAppButton";

/**
 * Modulo contatti / preventivo. Senza server: compone il messaggio e lo apre
 * nell'app di posta oppure in WhatsApp, a scelta del cliente.
 * (In seguito si può collegare l'invio diretto via email, es. Resend.)
 */
export default function ContactForm({ quote = false }: { quote?: boolean }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", subject: "", brand: "", model: "", service: "", message: "" });
  // servizio precompilato dal link "Richiedi un preventivo" della pagina Servizi
  useEffect(() => {
    const s = new URLSearchParams(window.location.search).get("servizio");
    if (quote && s && services.some((x) => x.title === s)) setF((v) => ({ ...v, service: s }));
  }, [quote]);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setF((v) => ({ ...v, [k]: e.target.value }));

  const compose = () => {
    const subject = quote ? `Richiesta preventivo – ${f.brand} ${f.model}`.trim() : f.subject || "Richiesta dal sito";
    const lines = [
      f.message,
      "",
      `Nome: ${f.name}`,
      `Email: ${f.email}`,
      f.phone && `Telefono: ${f.phone}`,
      quote && `Orologio: ${[f.brand, f.model].filter(Boolean).join(" ") || "-"}`,
      quote && f.service && `Servizio: ${f.service}`,
    ].filter((l) => l !== false && l !== "" && l !== undefined) as string[];
    return { subject, body: lines.join("\n") };
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    const { subject, body } = compose();
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  const sendWhatsApp = (e: React.MouseEvent<HTMLButtonElement>) => {
    const form = e.currentTarget.form;
    if (form && !form.reportValidity()) return;
    const { subject, body } = compose();
    window.open(whatsappLink(`${subject}\n\n${body}`), "_blank", "noopener");
  };

  const field =
    "mt-1 w-full border-b border-line bg-transparent py-3 text-fg outline-none transition-colors placeholder:text-mute/60 focus:border-gold";

  return (
    <form onSubmit={sendEmail} className="space-y-7">
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
      {quote && <p className="text-sm text-mute">Se puoi, allega qualche foto dell&apos;orologio nella mail o su WhatsApp: aiuta a fare una stima più precisa.</p>}
      <div className="flex flex-wrap gap-4">
        <button type="submit" className="btn btn-solid">{quote ? "Invia richiesta via email" : "Invia via email"}</button>
        <button type="button" onClick={sendWhatsApp} className="btn">
          <WhatsAppIcon className="h-4 w-4" /> Invia su WhatsApp
        </button>
      </div>
    </form>
  );
}
