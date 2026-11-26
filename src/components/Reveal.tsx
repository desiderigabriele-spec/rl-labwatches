"use client";
import { useRevealOnView } from "@/lib/useRevealOnView";

/**
 * Fa comparire il contenuto quando entra nello schermo. Nell'HTML il contenuto è sempre visibile:
 * l'attesa vale solo per quello che, a pagina caricata, è ancora più in basso (vedi useRevealOnView).
 * `as="li"` per usarlo direttamente dentro una lista.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const ref = useRevealOnView<HTMLDivElement>();
  const Tag = as;
  return (
    <Tag ref={ref as never} className={`rv ${className ?? ""}`} style={delay ? ({ "--rv-d": `${delay}s` } as React.CSSProperties) : undefined}>
      {children}
    </Tag>
  );
}
