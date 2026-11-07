/** Controls one inline SVG. No dependencies. Angles are clockwise from 12. */
export function animateLogo(svg, {mode = 'intro', duration = 1800} = {}) {
  const hour = svg.querySelector('[id="hour-hand"]');
  const minute = svg.querySelector('[id="minute-hand"]');
  if (!hour || !minute) throw new Error('Use a logo containing the clock symbol');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let frame = 0, disposed = false;
  const baseHour = Math.atan2(471 - 628, 607 - 491) * 180 / Math.PI;
  const baseMinute = Math.atan2(818 - 628, 607 - 457) * 180 / Math.PI;
  const apply = (h, m) => {
    hour.setAttribute('transform', `rotate(${h} 628 607)`);
    minute.setAttribute('transform', `rotate(${m} 628 607)`);
  };
  function stop() { cancelAnimationFrame(frame); }
  function reset() { stop(); apply(0, 0); }
  function setTime(date = new Date()) {
    const seconds = date.getSeconds() + date.getMilliseconds() / 1000;
    const minutes = date.getMinutes() + seconds / 60;
    apply((date.getHours() % 12) * 30 + minutes / 2 - baseHour,
          minutes * 6 - baseMinute);
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
    reset(); if (reduced) return;
    const start = performance.now();
    const tick = now => {
      if (disposed) return;
      const p = Math.min(1, (now - start) / Math.max(1, duration));
      const ease = 1 - Math.pow(1 - p, 4);
      apply(-360 * (1 - ease), -720 * (1 - ease));
      if (p < 1) frame = requestAnimationFrame(tick); else apply(0,0);
    };
    frame = requestAnimationFrame(tick);
  }
  if (mode === 'clock') live(); else if (mode === 'intro') intro();
  return {intro, live, setTime, reset, destroy() {disposed = true; stop();}};
}
/** Make gradient/mask IDs unique before mounting repeated inline instances. */
export function namespaceLogo(svg, prefix = 'rl-' + Math.random().toString(36).slice(2)) {
  for (const el of svg.querySelectorAll('defs [id]')) {
    const old = el.id; const id = prefix + '-' + old; el.id = id;
    for (const node of svg.querySelectorAll('*')) {
      for (const attr of [...node.attributes]) {
        if (attr.value.includes('url(#' + old + ')'))
          node.setAttribute(attr.name, attr.value.replaceAll('url(#' + old + ')', 'url(#' + id + ')'));
      }
    }
  }
  return svg;
}
