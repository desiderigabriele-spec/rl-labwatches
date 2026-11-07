"use client";
import { useState } from "react";
import { site } from "@/data/site";

// Il modulo apre il programma di posta con il messaggio già compilato.
// Per l'invio diretto dal sito si può collegare in seguito un servizio email (es. Resend).
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", watch: "", message: "" });
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Richiesta dal sito – ${form.name}${form.watch ? ` (${form.watch})` : ""}`;
    const body = `${form.message}\n\nNome: ${form.name}\nEmail: ${form.email}\nOrologio: ${form.watch || "-"}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const field = "w-full border-b border-line bg-transparent py-3 text-ivory outline-none transition-colors placeholder:text-mute/60 focus:border-gold";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <label className="block">
          <span className="eyebrow">Nome</span>
          <input required className={field} value={form.name} onChange={set("name")} autoComplete="name" />
        </label>
        <label className="block">
          <span className="eyebrow">Email</span>
          <input required type="email" className={field} value={form.email} onChange={set("email")} autoComplete="email" />
        </label>
      </div>
      <label className="block">
        <span className="eyebrow">Orologio (marca e modello)</span>
        <input className={field} value={form.watch} onChange={set("watch")} placeholder="es. cronografo anni '60" />
      </label>
      <label className="block">
        <span className="eyebrow">Messaggio</span>
        <textarea required rows={5} className={`${field} resize-none`} value={form.message} onChange={set("message")} />
      </label>
      <button type="submit" className="btn btn-solid">Invia richiesta</button>
    </form>
  );
}
