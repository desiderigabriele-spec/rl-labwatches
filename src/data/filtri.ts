// Caratteristiche degli orologi usate dai filtri del negozio.
// Gli orologi dell'area clienti le hanno già; per gli esempi si ricavano dalla scheda tecnica.
import type { Product } from "./products";

const voce = (p: Product, chiave: string) => p.details?.find(([k]) => k.toLowerCase() === chiave.toLowerCase())?.[1] ?? "";

export type Caratteristiche = {
  marca: string; prezzo: number | null; disponibile: boolean; condizioni: string; corredo: string;
  movimento: string; materiale: string; diametro: number | null; quadrante: string; genere: string; anno: number | null;
};

export function caratteristiche(p: Product): Caratteristiche {
  const cassa = voce(p, "Cassa");
  const mm = p.diameter ?? (Number((cassa.match(/(\d{2}(?:[.,]\d)?)\s*mm/) ?? [])[1]?.replace(",", ".")) || null);
  const mat = p.caseMaterial ?? (/oro|gold/i.test(cassa) && /acciaio/i.test(cassa) ? "Acciaio e oro" : /oro/i.test(cassa) ? "Oro" : /titanio/i.test(cassa) ? "Titanio" : /acciaio/i.test(cassa) ? "Acciaio" : "");
  return {
    marca: p.brand,
    prezzo: p.price,
    disponibile: !p.sold,
    condizioni: p.condition,
    corredo: p.boxPapers ?? voce(p, "Corredo"),
    movimento: p.movement ?? voce(p, "Movimento"),
    materiale: mat,
    diametro: mm,
    quadrante: p.dialColor ?? voce(p, "Quadrante"),
    genere: p.gender ?? "",
    anno: parseInt(p.year, 10) || null,
  };
}

export const FASCE_PREZZO = [
  { id: "5", nome: "Fino a 5.000 €", ok: (x: number) => x <= 5000 },
  { id: "10", nome: "5.000 – 10.000 €", ok: (x: number) => x > 5000 && x <= 10000 },
  { id: "20", nome: "10.000 – 20.000 €", ok: (x: number) => x > 10000 && x <= 20000 },
  { id: "50", nome: "20.000 – 50.000 €", ok: (x: number) => x > 20000 && x <= 50000 },
  { id: "oltre", nome: "Oltre 50.000 €", ok: (x: number) => x > 50000 },
];
export const FASCE_DIAMETRO = [
  { id: "35", nome: "Fino a 35 mm", ok: (x: number) => x <= 35 },
  { id: "39", nome: "36 – 39 mm", ok: (x: number) => x > 35 && x < 40 },
  { id: "42", nome: "40 – 42 mm", ok: (x: number) => x >= 40 && x <= 42 },
  { id: "43", nome: "Oltre 42 mm", ok: (x: number) => x > 42 },
];

/** Motivi di fiducia mostrati vicino al prezzo (scheda e pagina dell'orologio). */
export function fiducia(p: Product) {
  const g = p.warrantyMonths ?? (parseInt(voce(p, "Garanzia del laboratorio"), 10) || 0);
  const revisionato = p.revised ?? g > 0;
  const corredo = p.boxPapers ?? voce(p, "Corredo");
  return {
    revisionato,
    garanzia: g > 0 ? `Garanzia ${g} mesi` : "",
    corredo,
    /** etichetta sulla foto: solo se il corredo è un punto di forza */
    etichettaCorredo: /garanzia|scatola/i.test(corredo) && !/senza/i.test(corredo) ? corredo : "",
    /** «Revisionato in laboratorio · Garanzia 12 mesi» */
    riga: [revisionato ? "Revisionato in laboratorio" : "", g > 0 ? `Garanzia ${g} mesi` : ""].filter(Boolean).join(" · "),
  };
}

/** Misura, materiale e movimento in una riga: «41 mm · Acciaio · Automatico» */
export function rigaSpecifiche(p: Product) {
  const c = caratteristiche(p);
  return [c.diametro ? `${String(c.diametro).replace(".", ",")} mm` : "", c.materiale, c.movimento].filter(Boolean).join(" · ");
}
