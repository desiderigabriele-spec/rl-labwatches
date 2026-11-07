import Link from "next/link";
import { legalNav, nav, site, whatsappLink } from "@/data/site";

export default function Footer() {
  return (
    <footer className="guilloche sheen relative bg-green-2 text-cream">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-12">
        <div className="col-span-2 space-y-5 lg:col-span-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/parti/RL-completo-negativo-trasparente.svg" alt="Roberto Landi Lab Watches" loading="lazy" width={1080} height={595} className="h-20 w-auto sm:h-28" />
          <p className="max-w-sm text-sm leading-relaxed text-cream/65">
            Artigiano di orologi di lusso a Pistoia: restauro, revisione e riparazione con spedizione sicura in tutto il mondo.
          </p>
        </div>
        <div className="col-span-2 lg:col-span-1">
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
          <ul className="space-y-1 text-sm text-cream/80">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="inline-block py-1 hover:text-gold-3">{n.label}</Link></li>
            ))}
            <li><Link href="/preventivo" className="hover:text-gold-3">Richiedi un preventivo</Link></li>
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-4 !text-gold-3">Informazioni</p>
          <ul className="space-y-1 text-sm text-cream/80">
            {legalNav.map((n) => (
              <li key={n.href}><Link href={n.href} className="inline-block py-1 hover:text-gold-3">{n.label}</Link></li>
            ))}
            <li className="pt-3"><a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold-3">Instagram {site.instagramHandle}</a></li>
            <li><a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold-3">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/15">
        <div className="mx-auto max-w-7xl px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-6 text-xs text-cream/55 sm:px-8 lg:pb-6">
          <p>© {new Date().getFullYear()} RL Lab Watches · {site.owner} · {site.address.city}, Italia{site.vat && ` · P.IVA ${site.vat}`}</p>
          <p className="mt-2 max-w-3xl text-cream/45">
            Laboratorio indipendente, non affiliato ai marchi citati. I nomi e i loghi delle marche appartengono ai rispettivi proprietari e sono usati solo per indicare gli orologi su cui intervengo.
          </p>
        </div>
      </div>
    </footer>
  );
}
