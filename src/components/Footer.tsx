import Link from "next/link";
import Logo from "./Logo";
import { nav, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2 space-y-4">
          <Logo />
          <p className="max-w-sm text-sm leading-relaxed text-mute">{site.description}</p>
        </div>
        <div>
          <p className="eyebrow mb-4">Laboratorio</p>
          <address className="not-italic text-sm leading-7 text-ivory/80">
            {site.address.street}
            <br />
            {site.address.zip} {site.address.city}
            <br />
            <a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a>
            {site.phone && (
              <>
                <br />
                <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-gold">{site.phone}</a>
              </>
            )}
          </address>
        </div>
        <div>
          <p className="eyebrow mb-4">Naviga</p>
          <ul className="space-y-2 text-sm text-ivory/80">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-gold">{n.label}</Link></li>
            ))}
            <li><a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a></li>
            <li><a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-mute sm:flex-row sm:justify-between sm:px-8">
          <p>© {new Date().getFullYear()} {site.name} · {site.owner}</p>
          <p className="space-x-4">
            <Link href="/privacy" className="hover:text-gold">Privacy</Link>
            <Link href="/termini" className="hover:text-gold">Termini di servizio</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
