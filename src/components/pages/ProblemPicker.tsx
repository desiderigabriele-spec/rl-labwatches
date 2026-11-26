"use client";
import Link from "next/link";
import { useState } from "react";
import { whatsappLink } from "@/data/site";

/** "Che cosa ha il tuo orologio?": tocchi il problema e ti dico che lavoro serve (pagina Restauro) */
const PROBLEMS = [
  { p: "Si ferma o perde tempo", s: "Revisione Completa", a: "revisione-completa", t: "Smonto, pulisco e lubrifico il movimento, poi lo regolo. È il lavoro che riporta l'orologio alla sua precisione originale." },
  { p: "Vetro graffiato o rotto", s: "Sostituzione del Vetro", a: "sostituzione-vetro", t: "Vetro adatto al tuo modello e guarnizioni nuove, poi la prova di impermeabilità. Polvere e umidità restano fuori." },
  { p: "Cassa e bracciale rovinati", s: "Restauro Estetico Completo", a: "restauro-estetico", t: "Lucidatura e satinatura come in origine, rispettando spigoli e bisellature. Torna il tuo orologio, non uno rifatto." },
  { p: "Bracciale lento o rotto", s: "Rimagliatura del Bracciale", a: "rimagliatura-bracciale", t: "Rimagliatura di precisione e, se serve, saldatura artigianale: il bracciale torna saldo al polso." },
  { p: "È entrata acqua", s: "Intervento urgente", a: "prova-impermeabilita", t: "Scrivimi subito: prima si apre, meno danni fa l'umidità. Poi revisione e prova di tenuta." },
  { p: "È autentico?", s: "Verifica d'Autenticità", a: "verifica-autenticita", t: "Apro l'orologio e controllo movimento, numeri e componenti. Ti spiego cosa ho trovato, con le foto." },
  { p: "Manca un pezzo", s: "Fornitura di Ricambi", a: "ricambi", t: "Ricambi originali, anche difficili da trovare, e personalizzazioni su richiesta." },
];

export default function ProblemPicker() {
  const [i, setI] = useState<number | null>(null);
  const cur = i === null ? null : PROBLEMS[i];
  return (
    <div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Problemi dell'orologio">
        {PROBLEMS.map((x, k) => (
          <button
            key={x.p}
            type="button"
            onClick={() => setI(k)}
            aria-pressed={i === k}
            className={`rounded-full border px-4 py-2.5 text-sm transition-colors ${i === k ? "border-green bg-green text-cream" : "border-line bg-paper hover:border-gold"}`}
          >
            {x.p}
          </button>
        ))}
      </div>
      <div className="mt-6 min-h-[8.5rem] rounded-2xl border border-gold/40 bg-paper p-6 sm:p-8" aria-live="polite">
        {cur ? (
          <>
            <p className="eyebrow">Il lavoro che serve</p>
            <p className="mt-2 font-display text-3xl font-light">{cur.s}</p>
            <p className="mt-2 max-w-2xl leading-relaxed text-mute">{cur.t} Tempi e costo te li dico dopo averlo visto: il preventivo è gratuito.</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={whatsappLink(`Buongiorno Roberto, il mio orologio: ${cur.p.toLowerCase()}. Ti mando una foto.`)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
                Mandami una foto
              </a>
              <Link href={`#${cur.a}`} className="btn">Leggi di più</Link>
            </div>
          </>
        ) : (
          <p className="text-mute">
            <span className="font-display text-2xl text-fg">Tocca un problema qui sopra.</span>
            <br />
            Ti dico che lavoro serve e come procediamo.
          </p>
        )}
      </div>
    </div>
  );
}
