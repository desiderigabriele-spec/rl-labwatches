"use client";
import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

const stats: { value: number | string; suffix?: string; label: string }[] = [
  { value: 12, suffix: " mesi", label: "di garanzia su ogni riparazione" },
  { value: 9, label: "servizi, dal movimento al bracciale" },
  { value: 6, label: "grandi marchi trattati ogni giorno" },
  { value: "Mondo", label: "spedizioni assicurate ovunque" },
];

export default function Stats() {
  return (
    <section className="border-y border-line bg-paper-2">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-paper-2 px-6 py-12 text-center sm:px-10">
            <dt className="sr-only">{s.label}</dt>
            <dd>
              <span className="block font-display text-5xl font-light text-green sm:text-6xl">
                {typeof s.value === "number" ? <Count to={s.value} suffix={s.suffix} /> : s.value}
              </span>
              <span className="mt-3 block text-xs uppercase tracking-[0.2em] text-mute">{s.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
