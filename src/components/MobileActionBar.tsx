"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { site, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

/**
 * Barra delle azioni su telefono: Chiama · WhatsApp · Preventivo.
 * È sempre visibile: si nasconde solo mentre scorri verso il basso e ricompare
 * appena ti fermi, quando risali o quando arrivi in fondo alla pagina.
 */
export default function MobileActionBar() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    let last = window.scrollY;
    let idle = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const atBottom = y + window.innerHeight >= document.documentElement.scrollHeight - 80;
      if (Math.abs(y - last) >= 6) {
        setHidden(y > last && y > 240 && !atBottom);
        last = y;
      }
      // appena smetti di scorrere, la barra torna
      window.clearTimeout(idle);
      idle = window.setTimeout(() => setHidden(false), 350);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
    };
  }, []);

  const item = "flex flex-col items-center justify-center gap-1 text-[0.7rem] font-medium uppercase tracking-[0.12em]";
  return (
    <nav
      aria-label="Azioni rapide"
      className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-[1fr_1fr_1.3fr] border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-500 lg:hidden ${hidden ? "translate-y-full" : ""}`}
    >
      <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={`${item} h-16 text-fg`}>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
        Chiama
      </a>
      <a href={whatsappLink("Buongiorno Roberto, vorrei un'informazione sul mio orologio.")} target="_blank" rel="noopener noreferrer" className={`${item} h-16 text-fg`}>
        <WhatsAppIcon className="h-5 w-5" />
        WhatsApp
      </a>
      <Link href="/preventivo" className={`${item} h-16 bg-green text-cream`}>
        <span className="font-display text-base normal-case tracking-normal">Preventivo</span>
        <span className="text-[0.7rem] text-cream/70">gratuito</span>
      </Link>
    </nav>
  );
}
