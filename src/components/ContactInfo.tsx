import { site, whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

export default function ContactInfo() {
  const mapQuery = encodeURIComponent(`Roberto Landi Lab Watches, ${site.address.street}, ${site.address.zip} ${site.address.city}`);
  return (
    <div className="space-y-10">
      <div>
        <p className="eyebrow">Laboratorio</p>
        <address className="mt-3 not-italic font-display text-2xl leading-snug">
          {site.address.street}
          <br />
          {site.address.zip} {site.address.city} ({site.address.province}), {site.address.country}
        </address>
        <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-gold hover:underline">
          Apri in Google Maps →
        </a>
      </div>
      <div>
        <p className="eyebrow">Scrivimi o chiamami</p>
        <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-3 block font-display text-2xl hover:text-gold">{site.phone}</a>
        <a href={`mailto:${site.email}`} className="mt-1 block font-display text-2xl hover:text-gold">{site.email}</a>
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm text-green hover:text-gold">
          <WhatsAppIcon /> WhatsApp
        </a>
      </div>
      <div>
        <p className="eyebrow">Orari di apertura</p>
        <ul className="mt-3 space-y-1">
          {site.hours.map((h) => (
            <li key={h.days} className="flex gap-6"><span className="w-36 text-mute">{h.days}</span>{h.time}</li>
          ))}
        </ul>
        <p className="mt-2 text-sm text-mute">Consegna e ritiro degli orologi su appuntamento.</p>
      </div>
      <div className="flex gap-6 text-sm uppercase tracking-[0.2em]">
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a>
        <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Facebook</a>
      </div>
    </div>
  );
}
