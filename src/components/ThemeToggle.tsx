"use client";
import { useEffect, useState } from "react";

/** Selettore del tema: chiaro (predefinito) o "nero luxury". La scelta resta salvata nel browser del visitatore. */
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [nero, setNero] = useState(false);
  useEffect(() => setNero(document.documentElement.dataset.tema === "nero"), []);

  const toggle = () => {
    const next = !nero;
    setNero(next);
    if (next) document.documentElement.dataset.tema = "nero";
    else delete document.documentElement.dataset.tema;
    try {
      localStorage.setItem("rl-tema", next ? "nero" : "chiaro");
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={nero}
      aria-label={nero ? "Passa al tema chiaro" : "Passa al tema nero luxury"}
      title={nero ? "Tema chiaro" : "Nero luxury"}
      className={`group flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors duration-300 hover:border-gold ${className}`}
    >
      {/* mezzo quadrante: metà oro, metà nera; ruota quando cambia il tema */}
      <svg viewBox="0 0 24 24" className={`h-5 w-5 transition-transform duration-500 ${nero ? "rotate-180" : ""}`} aria-hidden>
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="var(--color-gold-2)" strokeWidth="1.2" />
        <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="var(--color-gold-2)" />
        <path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill="var(--color-fg)" opacity="0.85" />
      </svg>
    </button>
  );
}
