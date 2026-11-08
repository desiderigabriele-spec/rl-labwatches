"use client";
import type { MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { CHAPTERS, CH_LEN, CH_START, TOOLS, workOf } from "./chapters";
import type { FxCtx, Img, Tools } from "./effects";

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
  const imgs = useRef<{ clean: Img; worn: Img; frames: Img[] }[] | null>(null);
  const tools = useRef<Tools>({ brush: null, oiler: null, pegwood: null, polisher: null, disc: null });

  // immagini caricate solo quando la sezione si avvicina
  useEffect(() => {
    if (!active || imgs.current) return;
    imgs.current = [];
    Promise.all(CHAPTERS.map(async (c) => ({ clean: await load(c.clean), worn: await load(c.worn), frames: await Promise.all((c.frames ?? []).map(load)) }))).then((r) => (imgs.current = r));
    (Object.keys(TOOLS) as (keyof Tools)[]).forEach((k) => load(TOOLS[k]).then((img) => (tools.current[k] = img)));
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
      const p = workOf(local);
      cv.style.opacity = String(ss(0, 0.07, local) * (1 - ss(0.93, 1, local)));
      g.clearRect(0, 0, S, S);
      const im = imgs.current?.[i];
      const ch = CHAPTERS[i];
      if (!im || (ch.worn && !im.worn) || (ch.frames && !im.frames[0])) return;
      CHAPTERS[i].fx({ g, lg, layer, S, p, t: time / 1000, clean: im.clean, worn: im.worn, frames: im.frames, tools: tools.current });
      cv.setAttribute("aria-label", CHAPTERS[i].label);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [active, progress]);

  return <canvas ref={ref} role="img" aria-label={CHAPTERS[0].label} className="mx-auto block aspect-square" style={{ opacity: 0, width: "min(100cqw, 100cqh)" }} />;
}
