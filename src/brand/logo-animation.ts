/**
 * Controller delle lancette del logo — basato su docs/brand/web/logo-animation.js (kit).
 * Differenze rispetto al kit:
 *  - trova le lancette anche con ID prefissati ("…hour-hand"), necessari con più copie del logo;
 *  - l'intro non fa giri completi (le lancette passavano sopra le scritte): le lancette partono
 *    insieme dalle ore 9, salgono come l'ago di un quadrante e si fermano nella posa originale
 *    con un piccolo rimbalzo, restando sempre nella metà superiore del quadrante.
 * Angoli in senso orario dalle ore 12; rotazione intorno al perno 628 607 (coordinate del kit).
 */
export type LogoController = {
  intro: () => void;
  live: () => void;
  setTime: (date?: Date) => void;
  reset: () => void;
  destroy: () => void;
};

export function animateLogo(
  svg: SVGSVGElement,
  { mode = "intro", duration = 1800 }: { mode?: "intro" | "clock" | "static"; duration?: number } = {}
): LogoController {
  const hour = svg.querySelector('[id$="hour-hand"]');
  const minute = svg.querySelector('[id$="minute-hand"]');
  if (!hour || !minute) throw new Error("Use a logo containing the clock symbol");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let frame = 0, disposed = false;
  const baseHour = (Math.atan2(471 - 628, 607 - 491) * 180) / Math.PI;
  const baseMinute = (Math.atan2(818 - 628, 607 - 457) * 180) / Math.PI;
  const apply = (h: number, m: number) => {
    hour.setAttribute("transform", `rotate(${h} 628 607)`);
    minute.setAttribute("transform", `rotate(${m} 628 607)`);
  };
  function stop() {
    cancelAnimationFrame(frame);
  }
  function reset() {
    stop();
    apply(0, 0);
  }
  function setTime(date = new Date()) {
    const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
    const minutes = date.getMinutes() + seconds / 60;
    apply((date.getHours() % 12) * 30 + minutes / 2 - baseHour, minutes * 6 - baseMinute);
  }
  function live() {
    stop();
    const tick = () => {
      if (disposed) return;
      setTime();
      if (!reduced) frame = requestAnimationFrame(tick);
    };
    tick();
  }
  function intro() {
    reset();
    if (reduced) return;
    // partenza: entrambe le lancette alle ore 9 (orizzontali, a sinistra)
    const fromHour = -90 - baseHour;
    const fromMinute = -90 - baseMinute;
    const start = performance.now();
    const tick = (now: number) => {
      if (disposed) return;
      const p = Math.min(1, (now - start) / Math.max(1, duration));
      // easeOutBack: arriva con un piccolo rimbalzo, senza mai scendere sotto l'orizzontale
      const c1 = 1.3, c3 = c1 + 1;
      const ease = 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
      apply(fromHour * (1 - ease), fromMinute * (1 - ease));
      if (p < 1) frame = requestAnimationFrame(tick);
      else apply(0, 0);
    };
    frame = requestAnimationFrame(tick);
  }
  if (mode === "clock") live();
  else if (mode === "intro") intro();
  return { intro, live, setTime, reset, destroy() { disposed = true; stop(); } };
}
