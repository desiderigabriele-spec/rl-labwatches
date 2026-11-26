"use client";
import { Fragment } from "react";
import { useRevealOnView } from "@/lib/useRevealOnView";

/**
 * Testo che compare parola per parola, salendo da una "fessura" (effetto editoriale).
 * Le parole tra *asterischi* vengono evidenziate in oro corsivo.
 * Nell'HTML le parole sono già al loro posto (visibili a Google e subito sullo schermo): l'ingresso si fa solo per
 * i titoli che a pagina caricata sono ancora più in basso, col CSS (.st, vedi globals.css e useRevealOnView).
 * La fessura ha margine sotto e ai lati, compensato con margini negativi: le code delle lettere non vengono tagliate.
 */
export default function SplitText({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
  id,
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
  id?: string;
}) {
  const ref = useRevealOnView<HTMLElement>("0px 0px -40px 0px");
  const words = text.split(" ");
  let gold = false;
  return (
    <Tag className={`st ${className}`} id={id} ref={ref as never} style={delay ? ({ "--rv-d": `${delay}s` } as React.CSSProperties) : undefined}>
      {words.map((w, i) => {
        const starts = w.startsWith("*");
        if (starts) gold = true;
        const isGold = gold;
        if (w.endsWith("*")) gold = false;
        const clean = w.replace(/\*/g, "");
        return (
          <Fragment key={i}>
            <span className="split-slot">
              <span className={`st-w inline-block ${isGold ? "gold-text italic" : ""}`} style={{ "--i": i } as React.CSSProperties}>
                {clean}
              </span>
            </span>
            {/* spazio reale tra le parole (fuori dal blocco animato, altrimenti il browser lo elimina) */}
            {i < words.length - 1 && " "}
          </Fragment>
        );
      })}
    </Tag>
  );
}
