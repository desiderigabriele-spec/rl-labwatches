"use client";
import { useMemo, useState } from "react";
import { faq } from "@/data/faq";

/** Domande frequenti con ricerca e argomenti da toccare */
export default function FaqSearch() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("Tutte");
  const cats = useMemo(() => ["Tutte", ...Array.from(new Set(faq.map((f) => f.cat)))], []);
  const t = q.trim().toLowerCase();
  const list = faq.filter((f) => (cat === "Tutte" || f.cat === cat) && (!t || (f.q + " " + f.a).toLowerCase().includes(t)));
  const openChat = () => document.querySelector<HTMLButtonElement>('button[aria-controls="chat-roberto"]')?.click();
  return (
    <div>
      <label htmlFor="faq-q" className="sr-only">Cerca tra le domande</label>
      <input
        id="faq-q"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cerca: garanzia, spedizione, quanto costa…"
        className="w-full rounded-full border border-line bg-paper-2 px-5 py-3.5 text-base outline-none placeholder:text-mute/60 focus:border-gold"
      />
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Argomenti">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className={`rounded-full border px-4 py-2 text-sm transition-colors ${cat === c ? "border-green bg-green text-cream" : "border-line hover:border-gold"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-8 border-t border-line">
        {list.map((f, i) => (
          <details key={f.q} className="group border-b border-line py-6" open={i === 0 && !t && cat === "Tutte"}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden">
              <h2 className="font-display text-2xl sm:text-3xl">{f.q}</h2>
              <span className="mt-1 text-2xl text-gold transition-transform duration-300 group-open:rotate-45" aria-hidden>+</span>
            </summary>
            <p className="mt-4 max-w-2xl leading-relaxed text-mute">{f.a}</p>
          </details>
        ))}
        {!list.length && <p className="py-8 text-mute">Nessuna risposta per &ldquo;{q}&rdquo;. Chiedimelo in chat, ti rispondo io.</p>}
      </div>
      <div className="mt-14 rounded-2xl bg-paper-2 p-8 text-center">
        <p className="font-display text-3xl font-light">Non trovi la risposta?</p>
        <button type="button" onClick={openChat} className="btn btn-solid mt-5">Chiedimelo in chat</button>
      </div>
    </div>
  );
}
