"use client";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { caratteristiche, FASCE_DIAMETRO, FASCE_PREZZO, type Caratteristiche } from "@/data/filtri";
import ProductCard from "./ProductCard";
import Reveal from "./Reveal";

/**
 * Filtri del negozio: scorciatoie a un tocco (marche più presenti, «Scatola e garanzia») e un pannello «Filtri»
 * dove si spuntano più valori insieme (Rolex o Tudor). I filtri attivi restano sempre in vista con la ✕.
 * Un gruppo compare solo se tra gli orologi ci sono almeno due valori diversi.
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

type Scelti = Partial<Record<Chiave, string[]>>;

function passa(c: Caratteristiche, scelti: Scelti, soloDisponibili: boolean) {
  if (soloDisponibili && !c.disponibile) return false;
  for (const [k, lista] of Object.entries(scelti) as [Chiave, string[]][]) {
    if (!lista?.length) continue;
    const ok = lista.some((v) => {
      if (k === "prezzo") {
        if (v === "richiesta") return c.prezzo == null;
        const f = FASCE_PREZZO.find((x) => x.id === v);
        return !!f && c.prezzo != null && f.ok(c.prezzo);
      }
      if (k === "diametro") {
        const f = FASCE_DIAMETRO.find((x) => x.id === v);
        return !!f && c.diametro != null && f.ok(c.diametro);
      }
      return c[k] === v;
    });
    if (!ok) return false;
  }
  return true;
}

export default function ShopFiltri({ products, senzaMarca = false }: { products: Product[]; senzaMarca?: boolean }) {
  const righe = useMemo(() => products.map((p) => ({ p, c: caratteristiche(p) })), [products]);
  const tutte = righe.map((r) => r.c);
  const ciSonoVenduti = tutte.some((c) => !c.disponibile) && tutte.some((c) => c.disponibile);
  const [scelti, setScelti] = useState<Scelti>({});
  const [soloDisponibili, setSoloDisponibili] = useState(true);
  const [ordine, setOrdine] = useState("novita");
  const [aperto, setAperto] = useState(false);

  // pannello aperto: niente scorrimento della pagina sotto, Esc chiude
  useEffect(() => {
    if (!aperto) return;
    const prima = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setAperto(false);
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = prima; window.removeEventListener("keydown", esc); };
  }, [aperto]);

  const prezzi = tutte.map((c) => c.prezzo).filter((x): x is number => x != null);
  const diametri = tutte.map((c) => c.diametro).filter((x): x is number => x != null);
  type Menu = { k: Chiave; nome: string; opzioni: { id: string; nome: string }[] };
  const menu = ([
    ...(senzaMarca ? [] : [{ k: "marca" as const, nome: "Marca", opzioni: valori(tutte, "marca").map((v) => ({ id: v, nome: v })) }]),
    { k: "corredo", nome: "Corredo", opzioni: valori(tutte, "corredo").map((v) => ({ id: v, nome: v })) },
    { k: "prezzo", nome: "Prezzo", opzioni: [...FASCE_PREZZO.filter((f) => prezzi.some(f.ok)), ...(prezzi.length < tutte.length ? [{ id: "richiesta", nome: "Su richiesta" }] : [])] },
    { k: "condizioni", nome: "Condizioni", opzioni: valori(tutte, "condizioni").map((v) => ({ id: v, nome: v })) },
    { k: "movimento", nome: "Movimento", opzioni: valori(tutte, "movimento").map((v) => ({ id: v, nome: v })) },
    { k: "materiale", nome: "Materiale", opzioni: valori(tutte, "materiale").map((v) => ({ id: v, nome: v })) },
    { k: "diametro", nome: "Diametro", opzioni: FASCE_DIAMETRO.filter((f) => diametri.some(f.ok)) },
    { k: "genere", nome: "Per", opzioni: valori(tutte, "genere").map((v) => ({ id: v, nome: v })) },
  ] as Menu[]).filter((m) => m.opzioni.length >= 2 || (scelti[m.k]?.length ?? 0) > 0);

  // scorciatoie: le 4 marche con più orologi e «Scatola e garanzia»
  const conteggio = (k: Chiave, v: string) => tutte.filter((c) => c[k as keyof Caratteristiche] === v).length;
  const scorciatoie: { k: Chiave; id: string; nome: string }[] = [
    ...(senzaMarca ? [] : (menu.find((m) => m.k === "marca")?.opzioni ?? []).map((o) => ({ ...o, n: conteggio("marca", o.id) }))
      .sort((a, b) => b.n - a.n).slice(0, 4).map((o) => ({ k: "marca" as Chiave, id: o.id, nome: o.nome }))),
    ...(menu.find((m) => m.k === "corredo")?.opzioni.some((o) => o.id === "Scatola e garanzia") ? [{ k: "corredo" as Chiave, id: "Scatola e garanzia", nome: "Scatola e garanzia" }] : []),
  ];

  const ha = (k: Chiave, v: string) => scelti[k]?.includes(v) ?? false;
  const cambia = (k: Chiave, v: string) =>
    setScelti((s) => ({ ...s, [k]: ha(k, v) ? (s[k] ?? []).filter((x) => x !== v) : [...(s[k] ?? []), v] }));
  const nomeDi = (k: Chiave, v: string) => menu.find((m) => m.k === k)?.opzioni.find((o) => o.id === v)?.nome ?? v;

  const visibili = righe
    .filter(({ c }) => passa(c, scelti, soloDisponibili && ciSonoVenduti))
    .sort((a, b) => {
      if (ordine === "prezzo-su") return (a.c.prezzo ?? Infinity) - (b.c.prezzo ?? Infinity);
      if (ordine === "prezzo-giu") return (b.c.prezzo ?? -1) - (a.c.prezzo ?? -1);
      if (ordine === "anno") return (b.c.anno ?? 0) - (a.c.anno ?? 0);
      return 0;
    })
    .map((r) => r.p);

  const attivi = (Object.entries(scelti) as [Chiave, string[]][]).flatMap(([k, l]) => (l ?? []).map((v) => ({ k, v })));
  const azzera = () => { setScelti({}); setSoloDisponibili(true); };
  const parola = (n: number) => `${n} ${n === 1 ? "orologio" : "orologi"}`;
  const pillola = "inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap border px-4 text-sm transition-colors";

  return (
    <div>
      {products.length > 1 && (
        <div className="mb-10 grid gap-4 border-y border-line py-5">
          {/* scorciatoie a un tocco */}
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            <button type="button" onClick={() => setAperto(true)} aria-haspopup="dialog"
              className={`${pillola} border-fg bg-fg text-paper hover:bg-green hover:border-green`}>
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden><path d="M2 4h12M4 8h8M6 12h4" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
              Filtri{attivi.length ? ` · ${attivi.length}` : ""}
            </button>
            {scorciatoie.map((s) => (
              <button key={s.k + s.id} type="button" aria-pressed={ha(s.k, s.id)} onClick={() => cambia(s.k, s.id)}
                className={`${pillola} ${ha(s.k, s.id) ? "border-green bg-green text-cream" : "border-line bg-paper-2/60 text-fg hover:border-fg"}`}>
                {s.nome}
              </button>
            ))}
          </div>

          {/* filtri attivi, sempre in vista */}
          {attivi.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm">
              {attivi.map(({ k, v }) => (
                <button key={k + v} type="button" onClick={() => cambia(k, v)} className="inline-flex min-h-8 items-center gap-2 border border-green px-3 text-green hover:bg-green hover:text-cream" aria-label={`Togli il filtro ${nomeDi(k, v)}`}>
                  {nomeDi(k, v)} <span aria-hidden>✕</span>
                </button>
              ))}
              <button type="button" onClick={azzera} className="ml-1 underline underline-offset-4 hover:text-gold">Azzera</button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-mute" aria-live="polite">{parola(visibili.length)}</span>
            <label className="flex items-center gap-2">
              <span className="text-mute">Ordina</span>
              <select className="h-10 border border-line bg-paper-2/60 px-2 text-sm text-fg focus:border-fg focus:outline-none" value={ordine} onChange={(e) => setOrdine(e.target.value)}>
                {ORDINI.map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
            </label>
          </div>
        </div>
      )}

      {/* pannello dei filtri: dal basso sul telefono, da destra sul computer */}
      {aperto && (
        <div className="fixed inset-0 z-[60] flex items-end justify-end sm:items-stretch" role="dialog" aria-modal="true" aria-label="Filtri">
          <button type="button" className="absolute inset-0 bg-fg/40" aria-label="Chiudi i filtri" onClick={() => setAperto(false)} />
          <div className="relative flex max-h-[88vh] w-full flex-col bg-paper sm:max-h-none sm:max-w-md">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <p className="font-display text-2xl">Filtri</p>
              <button type="button" onClick={() => setAperto(false)} className="min-h-10 min-w-10 text-xl" aria-label="Chiudi">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-2">
              {ciSonoVenduti && (
                <label className="flex min-h-12 cursor-pointer items-center justify-between gap-3 border-b border-line text-sm">
                  Solo disponibili
                  <input type="checkbox" className="h-5 w-5 accent-[var(--color-green)]" checked={soloDisponibili} onChange={(e) => setSoloDisponibili(e.target.checked)} />
                </label>
              )}
              {menu.map((m) => (
                <fieldset key={m.k} className="border-b border-line py-4">
                  <legend className="float-left mb-2 w-full text-xs uppercase tracking-[0.2em] text-mute">{m.nome}</legend>
                  <div className="clear-both grid gap-1">
                    {m.opzioni.map((o) => {
                      const n = righe.filter(({ c }) => passa(c, { ...scelti, [m.k]: [o.id] }, soloDisponibili && ciSonoVenduti)).length;
                      return (
                        <label key={o.id} className={`flex min-h-10 cursor-pointer items-center gap-3 text-sm ${n === 0 && !ha(m.k, o.id) ? "text-mute/60" : ""}`}>
                          <input type="checkbox" className="h-5 w-5 accent-[var(--color-green)]" checked={ha(m.k, o.id)} onChange={() => cambia(m.k, o.id)} />
                          <span className="flex-1">{o.nome}</span>
                          <span className="tag-mono text-xs text-mute">{n}</span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              ))}
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-3 border-t border-line px-5 py-4">
              <button type="button" onClick={azzera} className="btn">Azzera</button>
              <button type="button" onClick={() => setAperto(false)} className="btn btn-solid">Mostra {parola(visibili.length)}</button>
            </div>
          </div>
        </div>
      )}

      {visibili.length ? (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
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
