import Link from "next/link";
import { site, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

const mapQuery = encodeURIComponent(`Roberto Landi Lab Watches, ${site.address.street}, ${site.address.zip} ${site.address.city}`);

/** Contatti rapidi: tre azioni grandi e gli orari, senza modulo (il modulo è in /contatti e /preventivo) */
export default function QuickContact() {
  const actions = [
    {
      href: `tel:${site.phone.replace(/\s/g, "")}`,
      label: "Chiama il laboratorio",
      detail: site.phone,
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
        </svg>
      ),
    },
    { href: whatsappLink("Buongiorno Roberto, vorrei un'informazione sul mio orologio."), label: "Scrivimi su WhatsApp", detail: "Puoi mandare anche le foto", icon: <WhatsAppIcon className="h-6 w-6" />, external: true },
    {
      href: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
      label: "Vieni in laboratorio",
      detail: `${site.address.street}, ${site.address.city}`,
      icon: (
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      ),
      external: true,
    },
  ];
  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
      <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        {actions.map((a) => (
          <li key={a.label}>
            <a
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex items-center gap-4 border border-line bg-paper px-5 py-4 transition-colors hover:border-green hover:bg-green hover:text-cream"
            >
              <span className="text-green transition-colors group-hover:text-gold-3">{a.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-xl leading-tight">{a.label}</span>
                <span className="tag-mono block truncate text-xs text-mute group-hover:text-cream/70">{a.detail}</span>
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </li>
        ))}
      </ul>
      <div className="space-y-6">
        <div>
          <p className="eyebrow">Orari</p>
          <ul className="mt-3 space-y-1 text-sm">
            {site.hours.map((h) => (
              <li key={h.days} className="flex justify-between gap-6 border-b border-line pb-1"><span className="text-mute">{h.days}</span><span className="tag-mono">{h.time}</span></li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/preventivo" className="btn btn-solid">Preventivo gratuito</Link>
          <Link href="/contatti" className="btn">Scrivimi un messaggio</Link>
        </div>
      </div>
    </div>
  );
}
