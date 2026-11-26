"use client";
import { useEffect, useState } from "react";

/** "Aperto ora" / "Chiuso ora · riapre…" secondo gli orari del laboratorio (lunedì–venerdì 9–18, ora italiana) */
export default function OpenNow() {
  const [label, setLabel] = useState<{ open: boolean; text: string } | null>(null);
  useEffect(() => {
    const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Rome" }));
    const d = now.getDay();
    const h = now.getHours() + now.getMinutes() / 60;
    const weekday = d >= 1 && d <= 5;
    if (weekday && h >= 9 && h < 18) return setLabel({ open: true, text: "Aperto ora · fino alle 18:00" });
    let when = "lunedì";
    if (weekday && h < 9) when = "oggi";
    else if (d >= 1 && d <= 4) when = "domani";
    setLabel({ open: false, text: `Chiuso ora · riapre ${when} alle 9:00` });
  }, []);
  if (!label) return <span className="inline-block h-5" />;
  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${label.open ? "text-green" : "text-gold"}`}>
      <span aria-hidden className={`h-2 w-2 rounded-full ${label.open ? "bg-[#1f9a5d]" : "bg-gold"}`} />
      {label.text}
    </span>
  );
}
