"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Contatore delle visite per l'area clienti di Desideri&Code: solo numeri (pagine viste e tocchi su WhatsApp),
// niente cookie, niente dati personali. Conta solo sul sito pubblicato, non nelle anteprime.
const URL_AREA = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://newyirfmizuskwhqtzuw.supabase.co";
const CHIAVE = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_y-aklaOzeYvosZNk8dhQiA_45FrkjDU";
const CLIENTE = process.env.NEXT_PUBLIC_AREA_CLIENTE_ID ?? "2fa668d2-c0b8-442c-9cec-5953ddab1d2d";
const attivo = process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

function conta(tipo: "pagina" | "whatsapp") {
  if (!attivo) return;
  fetch(`${URL_AREA}/rest/v1/rpc/conta_visita`, {
    method: "POST",
    keepalive: true,
    headers: { apikey: CHIAVE, "content-type": "application/json" },
    body: JSON.stringify({ p_cliente: CLIENTE, p_tipo: tipo }),
  }).catch(() => {});
}

export default function ContatoreVisite() {
  const percorso = usePathname();
  useEffect(() => { conta("pagina"); }, [percorso]);
  useEffect(() => {
    const clic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (a && /wa\.me|whatsapp\.com/.test(a.getAttribute("href") ?? "")) conta("whatsapp");
    };
    document.addEventListener("click", clic, true);
    return () => document.removeEventListener("click", clic, true);
  }, []);
  return null;
}
