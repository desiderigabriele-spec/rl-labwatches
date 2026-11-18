"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { caratteristiche, FASCE_DIAMETRO, FASCE_PREZZO, type Caratteristiche } from "@/data/filtri";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

/**
 * Filtri del negozio, come nei negozi di orologi usati: marca, prezzo, condizioni, corredo, movimento,
 * materiale, diametro, genere, solo disponibili e ordinamento. Un filtro compare solo se tra gli orologi
 * in vendita ci sono almeno due valori diversi (niente menu con una sola voce).
 */
type Chiave = "marca" | "prezzo" | "condizioni" | "corredo" | "movimento" | "materiale" | "diametro" | "genere";
const ORDINI = [
  { id: "novita", nome: "Novità" },
  { id: "prezzo-su", nome: "Prezzo crescente" },
  { id: "prezzo-giu", nome: "Prezzo decrescente" },
  { id: "anno", nome: "Più recenti (anno)" },
];

const valori = (lista: Caratteristiche[], k: keyof Caratteristiche) =>
  [...new Set(lista.map((c) => c[k]).filter((v): v is string => typeof v === "string" && v !== ""))].sort((a, b) => a.localeCompare(b, "it"));

export default function ShopFiltri({ products, senzaMarca = false }: { products: Product[]; senzaMarca?: boolean }) {
  const righe = useMemo(() => products.map((p) => ({ p, c: caratteristiche(p) })), [products]);
  const tutte = righe.map((r) => r.c);
  const [scelti, setScelti] = useState<Partial<Record<Chiave, string>>>({});
  const [soloDisponibili, setSoloDisponibili] = useState(false);
  const [ordine, setOrdine] = useState("novita");

  const prezzi = tutte.map((c) => c.prezzo).filter((x): x is number => x != null);
  const diametri = tutte.map((c) => c.diametro).filter((x): x is number => x != null);
  type Menu = { k: Chiave; nome: string; opzioni: { id: string; nome: string }[] };
  const menu = ([
    ...(senzaMarca ? [] : [{ k: "marca" as const, nome: "Marca", opzioni: valori(tutte, "marca").map((v) => ({ id: v, nome: v })) }]),
    { k: "prezzo", nome: "Prezzo", opzioni: [...FASCE_PREZZO.filter((f) => prezzi.some(f.ok)), ...(prezzi.length < tutte.length ? [{ id: "richiesta", nome: "Su richiesta", ok: () => false }] : [])] },
    { k: "condizioni", nome: "Condizioni", opzioni: valori(tutte, "condizioni").map((v) => ({ id: v, nome: v })) },
    { k: "corredo", nome: "Corredo", opzioni: valori(tutte, "corredo").map((v) => ({ id: v, nome: v })) },
    { k: "movimento", nome: "Movimento", opzioni: valori(tutte, "movimento").map((v) => ({ id: v, nome: v })) },
    { k: "materiale", nome: "Materiale", opzioni: valori(tutte, "materiale").map((v) => ({ id: v, nome: v })) },
    { k: "diametro", nome: "Diametro", opzioni: FASCE_DIAMETRO.filter((f) => diametri.some(f.ok)) },
    { k: "genere", nome: "Per", opzioni: valori(tutte, "genere").map((v) => ({ id: v, nome: v })) },
  ] as Menu[]).filter((m) => m.opzioni.length >= 2 || (m.k in scelti));

  const visibili = righe
    .filter(({ c }) => {
      if (soloDisponibili && !c.disponibile) return false;
      for (const [k, v] of Object.entries(scelti) as [Chiave, string][]) {
        if (!v) continue;
        if (k === "prezzo") {
          if (v === "richiesta") { if (c.prezzo != null) return false; continue; }
          const f = FASCE_PREZZO.find((x) => x.id === v);
          if (!f || c.prezzo == null || !f.ok(c.prezzo)) return false;
        } else if (k === "diametro") {
          const f = FASCE_DIAMETRO.find((x) => x.id === v);
          if (!f || c.diametro == null || !f.ok(c.diametro)) return false;
        } else if (c[k] !== v) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (ordine === "prezzo-su") return (a.c.prezzo ?? Infinity) - (b.c.prezzo ?? Infinity);
      if (ordine === "prezzo-giu") return (b.c.prezzo ?? -1) - (a.c.prezzo ?? -1);
      if (ordine === "anno") return (b.c.anno ?? 0) - (a.c.anno ?? 0);
      return 0;
    })
    .map((r) => r.p);

  const attivi = Object.values(scelti).filter(Boolean).length + (soloDisponibili ? 1 : 0);
  const azzera = () => { setScelti({}); setSoloDisponibili(false); };
  const sel = "h-11 w-full rounded-sm border border-line bg-paper-2/60 px-3 text-sm text-fg focus:border-fg focus:outline-none";

  return (
    <div>
      {products.length > 1 && (
        <div className="mb-10 border-y border-line py-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {menu.map((m) => (
              <label key={m.k} className="grid gap-1.5">
                <span className="text-[0.7rem] uppercase tracking-[0.2em] text-mute">{m.nome}</span>
                <select className={sel} value={scelti[m.k] ?? ""} onChange={(e) => setScelti((s) => ({ ...s, [m.k]: e.target.value }))}>
                  <option value="">Tutti</option>
                  {m.opzioni.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
                </select>
              </label>
            ))}
            <label className="grid gap-1.5">
              <span className="text-[0.7rem] uppercase tracking-[0.2em] text-mute">Ordina per</span>
              <select className={sel} value={ordine} onChange={(e) => setOrdine(e.target.value)}>
                {ORDINI.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input type="checkbox" className="h-5 w-5 accent-[var(--color-green)]" checked={soloDisponibili} onChange={(e) => setSoloDisponibili(e.target.checked)} />
              Solo disponibili
            </label>
            <span className="text-mute" aria-live="polite">
              {visibili.length} {visibili.length === 1 ? "orologio" : "orologi"}
              {attivi > 0 && <button type="button" onClick={azzera} className="ml-4 underline underline-offset-4 hover:text-gold">Azzera filtri</button>}
            </span>
          </div>
        </div>
      )}
      {visibili.length ? (
        <div className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {visibili.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 3) * 0.1}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="border border-line bg-paper-2 px-6 py-14 text-center">
          <p className="font-display text-3xl font-light">Nessun orologio con questi filtri.</p>
          <button type="button" onClick={azzera} className="btn mt-8">Azzera filtri</button>
        </div>
      )}
    </div>
  );
}
