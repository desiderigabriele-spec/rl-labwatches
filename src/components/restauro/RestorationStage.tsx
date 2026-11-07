"use client";
import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { BRUSH, CHAPTERS, CH_LEN, CH_START } from "./chapters";
import type { FxCtx, Img } from "./effects";

const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const load = (src?: string) =>
  new Promise<Img>((ok) => {
    if (!src) return ok(null);
    const i = new Image();
    i.decoding = "async";
    i.onload = () => ok(i);
    i.onerror = () => ok(null);
    i.src = src;
  });

/** Il banco di restauro: un canvas che, seguendo lo scroll, mostra un lavoro alla volta */
export default function RestorationStage({ progress, active }: { progress: MotionValue<number>; active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const imgs = useRef<{ clean: Img; worn: Img }[] | null>(null);
  const brush = useRef<Img>(null);

  // immagini caricate solo quando la sezione si avvicina
  useEffect(() => {
    if (!active || imgs.current) return;
    imgs.current = [];
    Promise.all(CHAPTERS.map(async (c) => ({ clean: await load(c.clean), worn: await load(c.worn) }))).then((r) => (imgs.current = r));
    load(BRUSH).then((b) => (brush.current = b));
  }, [active]);

  useEffect(() => {
    if (!active) return;
    const cv = ref.current!;
    const g = cv.getContext("2d")!;
    const layer = document.createElement("canvas");
    const lg = layer.getContext("2d")!;
    let raf = 0;
    const size = () => {
      const s = Math.min(1100, Math.round(cv.clientWidth * Math.min(2, window.devicePixelRatio || 1)));
      if (s > 0 && cv.width !== s) cv.width = cv.height = layer.width = layer.height = s;
    };
    const ro = new ResizeObserver(size);
    ro.observe(cv);
    size();
    const frame = (time: number) => {
      raf = requestAnimationFrame(frame);
      const v = progress.get();
      const S = cv.width;
      const i = Math.min(CHAPTERS.length - 1, Math.max(0, Math.floor((v - CH_START) / CH_LEN)));
      const local = (v - CH_START - i * CH_LEN) / CH_LEN;
      // il lavoro occupa la parte centrale del capitolo; ai bordi il pezzo appare e scompare
      const p = clamp((local - 0.12) / 0.72);
      cv.style.opacity = String(ss(0, 0.07, local) * (1 - ss(0.93, 1, local)));
      g.clearRect(0, 0, S, S);
      const im = imgs.current?.[i];
      if (!im || !im.worn) return;
      CHAPTERS[i].fx({ g, lg, layer, S, p, t: time / 1000, clean: im.clean, worn: im.worn, tools: { brush: brush.current } });
      cv.setAttribute("aria-label", CHAPTERS[i].label);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, progress]);

  return <canvas ref={ref} role="img" aria-label={CHAPTERS[0].label} className="mx-auto block aspect-square w-full max-w-[min(100%,62vh)]" style={{ opacity: 0 }} />;
}
