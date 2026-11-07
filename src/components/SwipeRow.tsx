"use client";
import { Children, useRef, useState } from "react";

/**
 * Fila di schede da scorrere col dito (telefono), con contatore "01 / 09".
 * Su schermi grandi diventa una griglia normale se `gridFrom` è indicato.
 */
export default function SwipeRow({
  children,
  label,
  gridClass = "",
  itemClass = "w-[82%] sm:w-[46%]",
  controlsClass = "",
}: {
  children: React.ReactNode;
  label: string;
  /** classi per trasformare la fila in griglia da una certa larghezza in su, es. "lg:grid lg:grid-cols-3" */
  gridClass?: string;
  itemClass?: string;
  /** classi per nascondere contatore e frecce quando la fila diventa griglia, es. "lg:hidden" */
  controlsClass?: string;
}) {
  const items = Children.toArray(children);
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const n = items.length;

  const onScroll = () => {
    const el = ref.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    setI(Math.min(n - 1, Math.round(el.scrollLeft / w)));
  };
  const go = (d: number) => {
    const el = ref.current;
    if (!el || !el.firstElementChild) return;
    const w = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    el.scrollTo({ left: Math.max(0, Math.min(n - 1, i + d)) * w, behavior: "smooth" });
  };
  const pad = (x: number) => String(x).padStart(2, "0");

  return (
    <div>
      <div
        ref={ref}
        onScroll={onScroll}
        role="region"
        aria-label={label}
        tabIndex={0}
        className={`-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 outline-none [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:px-8 [&::-webkit-scrollbar]:hidden ${gridClass}`}
      >
        {items.map((c, k) => (
          <div key={k} className={`shrink-0 snap-start ${itemClass}`}>
            {c}
          </div>
        ))}
      </div>
      <div className={`mt-5 flex items-center justify-between ${controlsClass}`}>
        <span className="tag-mono text-xs text-mute">
          {pad(i + 1)} / {pad(n)}
        </span>
        <span className="flex gap-2">
          <button type="button" onClick={() => go(-1)} disabled={i === 0} aria-label="Precedente" className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-gold disabled:opacity-30">←</button>
          <button type="button" onClick={() => go(1)} disabled={i === n - 1} aria-label="Successivo" className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-fg transition-colors hover:border-gold disabled:opacity-30">→</button>
        </span>
      </div>
    </div>
  );
}
