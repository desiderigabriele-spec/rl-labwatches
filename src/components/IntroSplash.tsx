"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";

/**
 * Intro con il logo: le lancette girano fino all'ora attuale, poi il pannello scorre via.
 * L'uscita è un'animazione CSS (funziona anche se JS è lento o assente).
 * Mostrata una volta per sessione; saltata con "riduci movimento".
 */
export default function IntroSplash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("rl-intro", "1");
    } catch {}
  }, []);

  if (gone) return null;

  return (
    <div
      className="intro-splash guilloche sheen fixed inset-0 z-[70] flex items-center justify-center bg-green-2"
      onAnimationEnd={(e) => e.target === e.currentTarget && setGone(true)}
      onClick={() => setGone(true)}
      aria-hidden
    >
      <Logo version="RL-completo-negativo" animate="intro" delay={150} className="intro-logo w-[min(80vw,560px)]" />
    </div>
  );
}
