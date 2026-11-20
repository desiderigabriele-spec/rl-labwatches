import { NextResponse } from "next/server";
import { site } from "@/data/site";

/**
 * "Avvisami quando arriva la vetrina": chi lascia email o telefono riceve un avviso quando gli orologi saranno
 * disponibili (gennaio 2027). La richiesta arriva a Roberto per email, con Resend, come il modulo contatti
 * (stesse variabili: RESEND_API_KEY, CONTACT_FROM, CONTACT_TO). Senza RESEND_API_KEY risponde 503 e il modulo
 * ripiega su WhatsApp con il messaggio già scritto.
 */
const clean = (v: unknown, max = 200) => (typeof v === "string" ? v.replace(/[\r\n]+/g, " ").trim().slice(0, max) : "");
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const isPhone = (v: string) => /^\+?[\d\s().-]{7,20}$/.test(v);

export async function POST(req: Request) {
  let data: { contact?: string; brand?: string; consent?: boolean; website?: string };
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Richiesta non valida" }, { status: 400 });
  }
  if (data.website) return NextResponse.json({ ok: true }); // antispam

  const contact = clean(data.contact, 120);
  const brand = clean(data.brand, 60);
  if (!(isEmail(contact) || isPhone(contact)) || data.consent !== true) {
    return NextResponse.json({ ok: false, error: "Scrivi un'email o un numero di telefono validi e dai il consenso." }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ ok: false, error: "Invio diretto non configurato" }, { status: 503 });

  const lines = [
    "Nuova richiesta di avviso per la vetrina (gennaio 2027)",
    "",
    `Contatto: ${contact}`,
    `Marca di interesse: ${brand || "qualsiasi"}`,
    "",
    "Ha dato il consenso a essere contattato per questo avviso.",
  ];
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Sito RL Lab Watches <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || site.email],
      ...(isEmail(contact) ? { reply_to: contact } : {}),
      subject: `Avviso vetrina${brand ? ` – ${brand}` : ""} – ${contact}`,
      text: lines.join("\n"),
    }),
  });
  if (!res.ok) {
    console.error("Resend:", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, error: "Invio non riuscito" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
