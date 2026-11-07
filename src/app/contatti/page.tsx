import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Contatti", description: `Contatta ${site.name} a ${site.address.city}: preventivi per restauro e riparazione orologi.` };

export default function ContattiPage() {
  const mapQuery = encodeURIComponent(`${site.address.street}, ${site.address.zip} ${site.address.city}`);
  return (
    <>
      <PageHero eyebrow="Contatti" title="Parliamo del tuo orologio." intro="Scrivici per una valutazione o un preventivo. Ti risponderemo il prima possibile." />
      <section className="mx-auto grid max-w-7xl gap-20 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal className="space-y-10">
          <div>
            <p className="eyebrow">Laboratorio</p>
            <p className="mt-3 font-display text-2xl leading-snug">
              {site.address.street}
              <br />
              {site.address.zip} {site.address.city}
            </p>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-gold hover:underline">
              Apri in Google Maps →
            </a>
          </div>
          <div>
            <p className="eyebrow">Scrivici</p>
            <a href={`mailto:${site.email}`} className="mt-3 block font-display text-2xl hover:text-gold">{site.email}</a>
            {site.phone && <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="mt-1 block font-display text-2xl hover:text-gold">{site.phone}</a>}
          </div>
          <div>
            <p className="eyebrow">Orari</p>
            <ul className="mt-3 space-y-1 text-ivory/85">
              {site.hours.map((h) => (
                <li key={h.days} className="flex gap-6"><span className="w-20 text-mute">{h.days}</span>{h.time}</li>
              ))}
            </ul>
          </div>
          <div className="flex gap-6 text-sm uppercase tracking-[0.2em]">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a>
            <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Facebook</a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
