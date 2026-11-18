// Catalogo degli orologi in vendita, gestito da Roberto dall'area clienti di Desideri&Code
// (area.desidericode.it → Orologi in vetrina). Il sito lo rilegge ogni 60 secondi.
// Se l'area non risponde o non ci sono ancora orologi pubblicati, mostra gli esempi di products.ts.
import { products as esempi, SHOP_READY as ESEMPI_PRONTI, type Product } from "./products";

// Indirizzo e chiave pubblica (fatta per stare nel codice: legge solo gli orologi pubblicati)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://newyirfmizuskwhqtzuw.supabase.co";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_y-aklaOzeYvosZNk8dhQiA_45FrkjDU";
const CLIENTE_ID = process.env.AREA_CLIENTE_ID ?? "2fa668d2-c0b8-442c-9cec-5953ddab1d2d";

type Riga = {
  slug: string; nome: string; marca: string; referenza: string; anno: string; condizione: string; descrizione: string;
  prezzo_cent: number | null; sconto_percento: number; stato: "in_vendita" | "su_richiesta" | "venduto";
  foto: string[]; colore: string | null; dettagli: [string, string][]; vista360: Product["spin"] | null;
};

function inProdotto(r: Riga): Product {
  const suRichiesta = r.stato === "su_richiesta" || r.prezzo_cent == null;
  const pieno = r.prezzo_cent == null ? null : r.prezzo_cent / 100;
  const scontato = pieno != null && r.sconto_percento > 0 ? Math.round(pieno * (100 - r.sconto_percento)) / 100 : null;
  return {
    slug: r.slug,
    name: r.nome,
    brand: r.marca,
    ref: r.referenza,
    year: r.anno,
    condition: r.condizione,
    description: r.descrizione,
    price: suRichiesta ? null : scontato ?? pieno,
    listPrice: !suRichiesta && scontato != null ? pieno : null,
    image: r.foto[0],
    photos: r.foto.slice(1),
    spin: r.vista360 ?? undefined,
    accent: r.colore ?? undefined,
    details: r.dettagli,
    sold: r.stato === "venduto",
  };
}

export async function getCatalogo(): Promise<{ products: Product[]; reale: boolean }> {
  try {
    const url = `${SUPABASE_URL}/rest/v1/orologi?cliente_id=eq.${CLIENTE_ID}&pubblicato=eq.true&order=ordine.asc,created_at.desc&select=*`;
    const r = await fetch(url, { headers: { apikey: SUPABASE_KEY }, next: { revalidate: 60, tags: ["catalogo"] } });
    if (r.ok) {
      const righe = (await r.json()) as Riga[];
      if (righe.length) return { products: righe.map(inProdotto), reale: true };
    }
  } catch {
    // area non raggiungibile: si usano gli esempi
  }
  return { products: esempi, reale: ESEMPI_PRONTI };
}

/** Indirizzo assoluto di una foto (quelle dell'area lo sono già, quelle nel sito iniziano con «/»). */
export const assoluto = (u: string, base: string) => (u.startsWith("http") ? u : `${base}${u}`);
