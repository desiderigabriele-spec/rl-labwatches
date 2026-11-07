"use client";
import { Fragment } from "react";
import { motion } from "motion/react";

/**
 * Testo che compare parola per parola, salendo da una "fessura" (effetto editoriale).
 * Le parole tra *asterischi* vengono evidenziate in oro corsivo.
 */
export default function SplitText({
  text,
  className = "",
  delay = 0,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p";
}) {
  const words = text.split(" ");
  let gold = false;
  return (
    <Tag className={className}>
      {words.map((w, i) => {
        const starts = w.startsWith("*");
        if (starts) gold = true;
        const isGold = gold;
        if (w.endsWith("*")) gold = false;
        const clean = w.replace(/\*/g, "");
        return (
          <Fragment key={i}>
          <span className="inline-block overflow-hidden pb-[0.12em] align-top">
            <motion.span
              className={`inline-block ${isGold ? "gold-text italic" : ""}`}
              initial={{ y: "110%", rotate: 4 }}
              whileInView={{ y: "0%", rotate: 0 }}
              viewport={{ once: true, margin: "-40px" }}
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
