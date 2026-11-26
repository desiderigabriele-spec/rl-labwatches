import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import QuoteWizard from "@/components/pages/QuoteWizard";
import { site } from "@/data/site";
import { breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Richiedi un preventivo gratuito",
  description:
    "Preventivo gratuito per riparare o restaurare il tuo orologio di lusso da Roberto Landi, orologiaio a Pistoia. Risposta via email o WhatsApp.",
  path: "/preventivo",
});

export default function PreventivoPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Preventivo", path: "/preventivo" }])} />
      <section className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-8 sm:pt-40">
        <Reveal>
          <nav aria-label="Percorso" className="mb-6 text-[0.68rem] uppercase tracking-[0.2em] text-mute">
            <Link href="/" className="hover:text-gold">Home</Link> <span aria-hidden>/</span> Preventivo
          </nav>
          <p className="eyebrow">Preventivo gratuito · un minuto</p>
          <h1 className="mt-5 font-display text-[2.4rem] font-light leading-[1.04] sm:text-6xl">
            Raccontami il tuo orologio, <em className="text-gold">ti dico io.</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">Tre passi brevi. Ti rispondo con intervento, tempi e costi, prima di iniziare. Gratis e senza impegno.</p>
        </Reveal>
        <Reveal delay={0.08} className="mt-10">
          <QuoteWizard />
        </Reveal>
        <p className="mt-8 text-center text-sm text-mute">
          Preferisci parlarne a voce? Chiama il{" "}
          <a className="text-green hover:text-gold" href={`tel:${site.phone.replace(/\s/g, "")}`}>
            {site.phone}
          </a>
          .
        </p>
      </section>
    </>
  );
}
