import { NextResponse } from "next/server";
import { site } from "@/data/site";

/**
 * Invio del modulo contatti/preventivo via email con Resend (https://resend.com).
 * Variabili d'ambiente da impostare su Vercel (Settings → Environment Variables):
 *  - RESEND_API_KEY   chiave API di Resend (obbligatoria per l'invio diretto)
 *  - CONTACT_FROM     mittente, es. "Sito RL Lab Watches <sito@rl-labwatches.it>"
 *                     (dominio da verificare su Resend; senza, si usa onboarding@resend.dev)
 *  - CONTACT_TO       destinatario (predefinito: l'email del laboratorio)
 * Senza RESEND_API_KEY risponde 503 e il modulo ripiega sull'app di posta / WhatsApp.
 */

type Payload = {
  kind?: "contatto" | "preventivo";
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  brand?: string;
  model?: string;
  service?: string;
  message?: string;
  website?: string; // campo nascosto antispam: deve restare vuoto
};

const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export async function POST(req: Request) {
  let data: Payload;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Richiesta non valida" }, { status: 400 });
  }

  // antispam: i bot compilano anche il campo nascosto
  if (data.website) return NextResponse.json({ ok: true });

  const name = clean(data.name, 120);
  const email = clean(data.email, 200);
  const message = typeof data.message === "string" ? data.message.trim().slice(0, 5000) : "";
  if (!name || !isEmail(email) || message.length < 3) {
    return NextResponse.json({ ok: false, error: "Compila nome, email e messaggio." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "Invio diretto non configurato" }, { status: 503 });

  const quote = data.kind === "preventivo";
  const watch = [clean(data.brand), clean(data.model)].filter(Boolean).join(" ");
  const subject = quote ? `Richiesta preventivo${watch ? ` – ${watch}` : ""} – ${name}` : `${clean(data.subject) || "Messaggio dal sito"} – ${name}`;
  const lines = [quote ? "Nuova richiesta di preventivo dal sito" : "Nuovo messaggio dal sito", "", `Nome: ${name}`, `Email: ${email}`];
  if (data.phone) lines.push(`Telefono: ${clean(data.phone, 40)}`);
  if (quote) lines.push(`Orologio: ${watch || "-"}`);
  if (quote && data.service) lines.push(`Servizio: ${clean(data.service)}`);
  lines.push("", message);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Sito RL Lab Watches <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || site.email],
      reply_to: email,
      subject,
      text: lines.join("\n"),
    }),
  });

  if (!res.ok) {
    console.error("Resend:", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, error: "Invio non riuscito" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
