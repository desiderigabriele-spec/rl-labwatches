"use client";
import { Fragment, useRef } from "react";
import { motion, useInView } from "motion/react";

/**
 * Testo che compare parola per parola, salendo da una "fessura" (effetto editoriale).
 * Le parole tra *asterischi* vengono evidenziate in oro corsivo.
 * Parte quando il titolo intero entra nello schermo (non parola per parola: una parola corta nascosta nella sua
 * fessura non risulterebbe mai visibile e resterebbe vuota). La fessura ha margine sotto e ai lati, compensato
 * con margini negativi: le code delle lettere (g, p, f in corsivo) non vengono tagliate e l'impaginazione non cambia.
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
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -40px 0px" });
  const words = text.split(" ");
  let gold = false;
  return (
    <Tag className={className} id={id} ref={ref as never}>
      {words.map((w, i) => {
        const starts = w.startsWith("*");
        if (starts) gold = true;
        const isGold = gold;
        if (w.endsWith("*")) gold = false;
        const clean = w.replace(/\*/g, "");
        return (
          <Fragment key={i}>
            <span className="split-slot">
              <motion.span
                className={`inline-block ${isGold ? "gold-text italic" : ""}`}
                initial={{ y: "110%", rotate: 4 }}
                animate={inView ? { y: "0%", rotate: 0 } : { y: "110%", rotate: 4 }}
                transition={{ duration: 0.9, delay: delay + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              >
                {clean}
              </motion.span>
            </span>
            {/* spazio reale tra le parole (fuori dal blocco animato, altrimenti il browser lo elimina) */}
            {i < words.length - 1 && " "}
          </Fragment>
        );
      })}
    </Tag>
  );
}
