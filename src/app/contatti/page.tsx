import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import OpenNow from "@/components/pages/OpenNow";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { site, whatsappLink } from "@/data/site";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contatti e orari: orologiaio a Pistoia",
  description:
    "Laboratorio in Via Padre Giovanni Antonelli 69 a Pistoia, aperto dal lunedì al venerdì 9–18. Chiama, scrivi su WhatsApp o mandami una foto dell'orologio.",
  path: "/contatti",
});

export default function ContattiPage() {
  const mapQuery = encodeURIComponent(`Roberto Landi Lab Watches, ${site.address.street}, ${site.address.zip} ${site.address.city}`);
  const maps = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;
  const tel = `tel:${site.phone.replace(/\s/g, "")}`;
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Contatti", path: "/contatti" }])} />
      <section className="mx-auto max-w-7xl px-4 pb-12 pt-32 sm:px-8 sm:pt-40">
        <Reveal>
          <nav aria-label="Percorso" className="mb-6 text-[0.68rem] uppercase tracking-[0.2em] text-mute">
            <Link href="/" className="hover:text-gold">Home</Link> <span aria-hidden>/</span> Contatti
          </nav>
          <h1 className="eyebrow">Contatti del laboratorio di orologeria a Pistoia</h1>
          <p className="mt-5 font-display text-[2.4rem] font-light leading-[1.04] sm:text-6xl">
            Scrivimi, chiamami <em className="text-gold">o passa in laboratorio.</em>
          </p>
          <p className="mt-5">
            <OpenNow />
          </p>
        </Reveal>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Reveal>
            <a href={whatsappLink("Buongiorno Roberto, le scrivo dal sito.")} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col gap-2 rounded-2xl bg-[#1f7a4d] p-7 text-white transition-colors hover:bg-[#18663f]">
              <WhatsAppIcon className="h-7 w-7" />
              <span className="mt-2 font-display text-3xl">WhatsApp</span>
              <span className="text-sm text-white/80">La via più veloce: mandami anche una foto dell&apos;orologio.</span>
            </a>
          </Reveal>
          <Reveal delay={0.06}>
            <a href={tel} className="guilloche flex h-full flex-col gap-2 rounded-2xl bg-green-2 p-7 text-cream transition-opacity hover:opacity-95">
              <span aria-hidden className="text-2xl text-gold-3">☏</span>
              <span className="mt-2 font-display text-3xl">Chiama</span>
              <span className="text-sm text-cream/75">{site.phone}</span>
            </a>
          </Reveal>
          <Reveal delay={0.12}>
            <a href={maps} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-paper-2 p-7 transition-colors hover:border-gold">
              <span aria-hidden className="text-2xl text-gold">⌖</span>
              <span className="mt-2 font-display text-3xl">Vieni in laboratorio</span>
              <span className="text-sm text-mute">
                {site.address.street}, {site.address.city} · consegna e ritiro su appuntamento
              </span>
            </a>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-paper-2">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="space-y-8">
            <div>
              <p className="eyebrow">Laboratorio</p>
              <address className="mt-3 font-display text-2xl not-italic leading-snug">
                {site.address.street}
                <br />
                {site.address.zip} {site.address.city} ({site.address.province})
              </address>
              <a href={maps} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-green hover:text-gold">
                Apri in Google Maps →
              </a>
            </div>
            <div>
              <p className="eyebrow">Orari</p>
              <ul className="mt-3 space-y-1">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex gap-6">
                    <span className="w-36 text-mute">{h.days}</span>
                    {h.time}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow">Email</p>
              <a href={`mailto:${site.email}`} className="mt-3 block font-display text-2xl hover:text-gold">{site.email}</a>
            </div>
            <div className="flex gap-6 text-sm uppercase tracking-[0.2em]">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Instagram</a>
              <a href={site.social.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-gold">Facebook</a>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mb-8 font-display text-3xl">Preferisci scrivere qui?</h2>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
