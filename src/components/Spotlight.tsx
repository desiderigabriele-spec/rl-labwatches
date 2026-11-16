"use client";

/**
 * Faretto da vetrina "vero": plafoniera incassata con la lente che si accende, fascio conico con i bordi
 * morbidi (gradiente conico che parte dalla lente), nucleo più luminoso, pulviscolo che galleggia nella luce,
 * alone sulla parete. Va messo come primo figlio di un contenitore relativo; il cono scende fino al ripiano.
 * level: 0 spento, 0.25 luce soffusa, 1 acceso.
 */
export default function Spotlight({ level, flicker = false, spread = 30 }: { level: number; flicker?: boolean; spread?: number }) {
  const on = level > 0.5;
  // forma del cono: gradiente conico centrato verso il basso (180°), largo `spread` gradi per lato
  const cone = (inner: number, outer: number, a: number) =>
    `conic-gradient(from ${180 - outer}deg at 50% 0%, transparent 0deg, rgba(255,238,205,${a * 0.5}) ${outer - inner}deg, rgba(255,244,222,${a}) ${outer}deg, rgba(255,238,205,${a * 0.5}) ${outer + inner}deg, transparent ${outer * 2}deg)`;
  const fade = "linear-gradient(to bottom, #000 0%, #000 60%, rgba(0,0,0,0.6) 85%, transparent 100%)";
  return (
    <>
      {/* alone sulla parete intorno alla plafoniera */}
      <span
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-28 w-56 -translate-x-1/2 -translate-y-1/3 rounded-full transition-opacity duration-700"
        style={{ background: "radial-gradient(closest-side, rgba(255,236,200,0.35), transparent)", opacity: level }}
      />
      {/* plafoniera incassata: anello metallico scuro e lente */}
      <span aria-hidden className="relative z-10 mx-auto block h-3.5 w-14 rounded-b-[999px] bg-gradient-to-b from-[#2a2f2c] to-[#121513] shadow-[0_2px_4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]">
        <span
          className="absolute inset-x-2.5 bottom-[3px] h-1.5 rounded-[999px] transition-all duration-500"
          style={{
            background: on ? "radial-gradient(ellipse at 50% 40%, #fffdf6, #ffe9bf 60%, #d9b46b)" : level > 0 ? "#6f6656" : "#2a2e2b",
            boxShadow: on ? "0 0 6px 2px rgba(255,240,205,0.95), 0 0 22px 8px rgba(255,226,170,0.45), 0 6px 30px 10px rgba(255,226,170,0.25)" : "none",
          }}
        />
      </span>
      {/* fascio: alone largo + nucleo stretto, con dissolvenza verso il basso */}
      <span
        aria-hidden
        className={`pointer-events-none absolute left-1/2 top-2 h-[96%] w-[220%] -translate-x-1/2 ${flicker ? "lamp-on" : ""}`}
        style={{ opacity: level, transition: "opacity 700ms ease", mixBlendMode: "screen", maskImage: fade, WebkitMaskImage: fade }}
      >
        <span className="absolute inset-0" style={{ background: cone(spread * 0.7, spread, 0.5), filter: "blur(8px)" }} />
        <span className="absolute inset-0" style={{ background: cone(spread * 0.4, spread * 0.6, 0.32), filter: "blur(4px)" }} />
        {/* pulviscolo nella luce */}
        <span
          className="spot-dust absolute inset-0"
          style={{
            // il pulviscolo si muove solo nel faretto acceso
            animationPlayState: on ? "running" : "paused",
            maskImage: `conic-gradient(from ${180 - spread}deg at 50% 0%, transparent 0deg, #000 ${spread * 0.5}deg, #000 ${spread * 1.5}deg, transparent ${spread * 2}deg)`,
            WebkitMaskImage: `conic-gradient(from ${180 - spread}deg at 50% 0%, transparent 0deg, #000 ${spread * 0.5}deg, #000 ${spread * 1.5}deg, transparent ${spread * 2}deg)`,
          }}
        />
      </span>
    </>
  );
}

/** Pozza di luce sul ripiano con l'ombra del cofanetto: va messa in fondo al contenitore, sopra il ripiano */
export function LightPool({ level }: { level: number }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-3 left-1/2 z-20 h-7 w-[118%] -translate-x-1/2 rounded-[50%] transition-opacity duration-700"
        style={{ background: "radial-gradient(closest-side, rgba(255,242,215,0.55), rgba(255,236,200,0.18) 65%, transparent)", opacity: level, mixBlendMode: "screen" }}
      />
      {/* ombra di contatto: il cofanetto poggia davvero sul ripiano */}
      <span aria-hidden className="pointer-events-none absolute -bottom-1 left-1/2 z-20 h-3 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/55 blur-[5px]" />
    </>
  );
}

/**
 * Luce del faretto sul cofanetto: illumina solo la parte che sta dentro il cono (stessa forma del fascio,
 * con il vertice sulla lente, `apex` px sopra il riquadro) e lascia in ombra quella fuori, come i bordi
 * alti del coperchio. Entrambi i livelli stanno solo dentro la sagoma della foto.
 */
export function BoxLight({ src, level, apex = 28, spread = 30 }: { src: string; level: number; apex?: number; spread?: number }) {
  const at = `50% -${apex}px`;
  const from = 180 - spread;
  const inside = `conic-gradient(from ${from}deg at ${at}, transparent 0deg, #000 ${spread * 0.4}deg, #000 ${spread * 1.6}deg, transparent ${spread * 2}deg)`;
  const outside = `conic-gradient(from ${from}deg at ${at}, #000 0deg, transparent ${spread * 0.5}deg, transparent ${spread * 1.5}deg, #000 ${spread * 2}deg)`;
  const layer = (shape: string): React.CSSProperties => ({
    maskImage: `url(${src}), ${shape}`,
    WebkitMaskImage: `url(${src}), ${shape}`,
    maskSize: "contain, 100% 100%",
    WebkitMaskSize: "contain, 100% 100%",
    maskPosition: "center bottom, 0 0",
    WebkitMaskPosition: "center bottom, 0 0",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    maskComposite: "intersect",
    WebkitMaskComposite: "source-in",
  });
  const lit = Math.max(0, (level - 0.22) / 0.78);
  return (
    <>
      {/* dentro il fascio: luce calda dall'alto */}
      <span
        aria-hidden
        data-boxlight
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{
          ...layer(inside),
          opacity: level,
          mixBlendMode: "soft-light",
          background: "radial-gradient(ellipse 70% 60% at 50% 15%, rgba(255,247,228,1), rgba(255,240,210,0.45) 60%, rgba(0,0,0,0.25) 100%)",
        }}
      />
      {/* fuori dal fascio: in ombra */}
      <span
        aria-hidden
        data-boxlight
        className="pointer-events-none absolute inset-0 transition-opacity duration-700"
        style={{ ...layer(outside), opacity: lit, background: "rgba(4,8,6,0.62)" }}
      />
    </>
  );
}
