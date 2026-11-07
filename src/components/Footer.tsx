import Link from "next/link";
import { legalNav, nav, site, whatsappLink } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-green-2 text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/RL-completo-negativo.svg" alt="Roberto Landi Lab Watches" loading="lazy" width={1080} height={595} className="h-28 w-auto" />
          <p className="max-w-sm text-sm leading-relaxed text-cream/65">
            Artigiano di orologi di lusso a Pistoia: restauro, revisione e riparazione con spedizione sicura in tutto il mondo.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4 !text-gold-3">Laboratorio</p>
          <address className="not-italic text-sm leading-7 text-cream/80">
            {site.address.street}
            <br />
            {site.address.zip} {site.address.city} ({site.address.province})
            <br />
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-gold-3">{site.phone}</a>
            <br />
            <a href={`mailto:${site.email}`} className="hover:text-gold-3">{site.email}</a>
            <br />
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-gold-3">WhatsApp</a>
          </address>
          <p className="eyebrow mb-3 mt-8 !text-gold-3">Orari</p>
          <ul className="text-sm leading-7 text-cream/80">
            {site.hours.map((h) => (
              <li key={h.days}>{h.days}: {h.time}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4 !text-gold-3">Naviga</p>
          <ul className="space-y-2 text-sm text-cream/80">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-gold-3">{n.label}</Link></li>
            ))}
            <li><Link href="/preventivo" className="hover:text-gold-3">Richiedi un preventivo</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4 !text-gold-3">Informazioni</p>
          <ul className="space-y-2 text-sm text-cream/80">
            {legalNav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-gold-3">{n.label}</Link></li>
            ))}
            <li className="pt-3"><a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold-3">Instagram {site.instagramHandle}</a></li>
            <li><a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold-3">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-cream/55 sm:px-8">
          <p>© {new Date().getFullYear()} RL Lab Watches · {site.owner} · {site.address.city}, Italia</p>
        </div>
      </div>
    </footer>
  );
}
