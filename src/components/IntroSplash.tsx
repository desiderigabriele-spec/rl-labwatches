"use client";
import { useEffect, useState } from "react";

/**
 * Intro "la lunetta": su carta crema la lunetta dei contatti, grande al centro. La ghiera scatta, le lancette
 * girano veloci e si fermano sull'ora vera, poi la lunetta scende al suo posto (in basso al centro su telefono,
 * in basso a destra su computer) e diventa il pulsante dei contatti. Tutto in CSS (globals.css, "Intro"):
 * parte anche prima che il JavaScript sia pronto. Una volta per sessione, saltabile con un tocco,
 * assente con "riduci movimento".
 */
// ora d'arrivo delle lancette, calcolata subito nell'HTML (prima che parta l'animazione)
const SET_TIME = `(function(){var e=document.currentScript.parentNode,n=new Date(),s=n.getSeconds()+1.9,m=n.getMinutes()+s/60,h=n.getHours()%12+m/60;e.style.setProperty("--intro-h",h*30+"deg");e.style.setProperty("--intro-m",m*6+"deg");e.style.setProperty("--intro-s",s*6+"deg")})()`;

export default function IntroSplash() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("rl-intro", "1");
    } catch {}
  }, []);

  if (gone) return null;

  // fine (o salto): la lunetta vera dei contatti compare subito
  const end = () => {
    document.documentElement.dataset.intro = "seen";
    setGone(true);
  };

  return (
    <div
      className="intro-splash fixed inset-0 z-[70]"
      onClick={end}
      onAnimationEnd={(e) => e.animationName === "intro-lun-out" && end()}
      aria-hidden
      suppressHydrationWarning
    >
      <div className="intro-paper absolute inset-0" />
      <p className="intro-name absolute inset-x-0 text-center">
        <b className="font-display">ROBERTO LANDI</b>
        <span>Lab Watches · Pistoia</span>
      </p>
      <div className="intro-lun">
        {/* eslint-disable @next/next/no-img-element */}
        <img src="/lunetta/quadrante.webp" alt="" draggable={false} className="intro-dial" />
        <img src="/lunetta/ore.webp" alt="" draggable={false} className="intro-hand intro-h" />
        <img src="/lunetta/minuti.webp" alt="" draggable={false} className="intro-hand intro-m" />
        <img src="/lunetta/secondi.webp" alt="" draggable={false} className="intro-hand intro-s" />
        <img src="/lunetta/ghiera.webp" alt="" draggable={false} className="intro-ring" />
        {/* eslint-enable @next/next/no-img-element */}
      </div>
      <button type="button" tabIndex={-1} className="intro-skip">
        Salta
      </button>
      <script dangerouslySetInnerHTML={{ __html: SET_TIME }} />
    </div>
  );
}
