import Image from "next/image";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { whatsappLink } from "@/data/site";
import { breadcrumbLd } from "@/lib/seo";

/**
 * Pezzi in comune delle pagine interne, nello stile della home: apertura scura con la foto (come la vetrina),
 * banda verde con le quattro tappe del lavoro, invito finale.
 */

export function DarkHero({
  eyebrow,
  h1,
  title,
  intro,
  image,
  alt,
  crumbs,
  whatsapp,
  cta,
}: {
  eyebrow?: string;
  /** titolo per Google (keyword + città): prende il posto del sopratitolo, con lo stesso aspetto; lo slogan grande resta */
  h1?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image?: string;
  alt?: string;
  crumbs: { name: string; path: string }[];
  /** testo del messaggio WhatsApp del pulsante principale */
  whatsapp?: string;
  cta?: React.ReactNode;
}) {
  return (
    <section className="guilloche relative overflow-hidden bg-night pb-16 pt-32 text-cream sm:pb-20 sm:pt-40">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,69,42,0.4),transparent_60%)]" />
      <div className={`relative mx-auto grid max-w-7xl gap-10 px-4 sm:px-8 ${image ? "lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-16" : ""}`}>
        <Reveal>
          <nav aria-label="Percorso" className="mb-6 text-xs uppercase tracking-[0.2em] text-cream/65">
            <Link href="/" className="inline-block py-1.5 hover:text-gold-3">Home</Link>
            {crumbs.map((c) => (
              <span key={c.path}> <span aria-hidden>/</span> {c.name}</span>
            ))}
          </nav>
          {h1 ? <h1 className="eyebrow !text-gold-3">{h1}</h1> : <p className="eyebrow !text-gold-3">{eyebrow}</p>}
          {h1 ? (
            <p className="mt-5 font-display text-display font-light leading-[1.04] sm:text-6xl">{title}</p>
          ) : (
            <h1 className="mt-5 font-display text-display font-light leading-[1.04] sm:text-6xl">{title}</h1>
          )}
          {intro && <div className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">{intro}</div>}
          {(whatsapp || cta) && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {whatsapp && (
                <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-wa whitespace-nowrap">
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>
                    <b>Mandami una foto</b>
                    <small>Rispondo io, su WhatsApp</small>
                  </span>
                </a>
              )}
              {cta}
            </div>
          )}
        </Reveal>
        {image && (
          <Reveal delay={0.15}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-gold-3/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
              <Image src={image} alt={alt ?? ""} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

const STEPS = [
  ["Mi scrivi", "Una foto su WhatsApp, una chiamata o una visita in laboratorio."],
  ["Lo apro", "Valutazione gratuita e preventivo chiaro, prima di iniziare."],
  ["Lo lavoro", "A mano, nel mio laboratorio di Pistoia. Ti aggiorno io."],
  ["Torna a te", "Garanzia 12 mesi. Ritiro a Pistoia o spedizione assicurata."],
];

export function StepsBand({ title = "Come funziona" }: { title?: string }) {
  return (
    <section className="guilloche relative bg-green-2 text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20">
        <Reveal>
          <p className="eyebrow !text-gold-3">{title}</p>
        </Reveal>
        <ol className="mt-8 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([t, d], i) => (
            <Reveal as="li" key={t} delay={i * 0.06} className="border-t border-gold-3/50 pt-5">
                <p className="font-display text-3xl font-light">
                  <span className="text-gold-3">{i + 1}.</span> {t}
                </p>
                <p className="mt-2 text-base leading-relaxed text-cream/80">{d}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/** invito finale delle pagine: WhatsApp e preventivo */
export function EndCta({ title, text, whatsapp }: { title: React.ReactNode; text: string; whatsapp: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-8">
      <Reveal>
        <h2 className="font-display text-4xl font-light sm:text-5xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-mute">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={whatsappLink(whatsapp)} target="_blank" rel="noopener noreferrer" className="btn-wa whitespace-nowrap">
            <WhatsAppIcon className="h-5 w-5" />
            <span>
              <b>Scrivimi su WhatsApp</b>
              <small>Rispondo io, di persona</small>
            </span>
          </a>
          <Link href="/preventivo" className="btn self-center">Preventivo con le foto</Link>
        </div>
      </Reveal>
    </section>
  );
}
