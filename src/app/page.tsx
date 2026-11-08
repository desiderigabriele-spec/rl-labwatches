import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import Gear from "@/components/Gear";
import RestorationSection from "@/components/RestorationSection";
import Reviews from "@/components/Reviews";
import BrandStrip from "@/components/BrandStrip";
import QuickContact from "@/components/QuickContact";
import Showcase from "@/components/Showcase";
import ServicesRail from "@/components/ServicesRail";
import SplitText from "@/components/SplitText";
import ParallaxImage from "@/components/ParallaxImage";
import IrisReveal from "@/components/IrisReveal";
import TrustBar from "@/components/TrustBar";
import BeforeAfter from "@/components/BeforeAfter";
import { WhatsAppIcon } from "@/components/WhatsAppButton";
import { products } from "@/data/products";
import { site, whatsappLink } from "@/data/site";
import { pageMeta } from "@/lib/seo";

export const metadata = {
  ...pageMeta({
    title: "Roberto Landi: Artigiano Orologi di Lusso a Pistoia | RL Lab Watches",
    description:
      "Roberto Landi, artigiano di orologi di lusso a Pistoia: restauro e riparazione di Rolex, Patek Philippe, Audemars Piguet e Omega. Preventivo gratuito.",
    path: "/",
  }),
  title: { absolute: "Roberto Landi: Artigiano Orologi di Lusso a Pistoia | RL Lab Watches" },
};

export default function Home() {
  return (
    <>
      {/* APERTURA: il volto di Roberto e un solo invito, mandare una foto */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-1/4 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[140px]" />
        <div className="relative mx-auto grid max-w-7xl px-4 pt-20 sm:px-8 sm:pt-28 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-end lg:gap-8">
          <div className="relative z-10 lg:self-center lg:pb-16">
            <Reveal>
              <p className="eyebrow">{site.owner} · Orologiaio a Pistoia</p>
            </Reveal>
            <h1 className="mt-5 font-display text-5xl font-light leading-[1.02] sm:text-7xl xl:text-[5.5rem]">
              <SplitText text="Il tuo orologio," className="block" delay={0.1} />{" "}
              <SplitText text="*nelle mie mani.*" className="block" delay={0.25} />
            </h1>
            {/* su telefono il testo sta a sinistra, accanto al ritratto */}
            <div className="relative mt-4 flex min-h-[50svh] items-end sm:mt-8 lg:block lg:min-h-0">
              <Reveal delay={0.45} className="relative z-10 max-w-[64%] pb-6 pr-3 sm:max-w-none lg:pb-0">
                <p className="max-w-md text-[0.95rem] leading-relaxed text-mute sm:text-lg">
                  Restauro e revisione di Rolex, Patek Philippe, Audemars Piguet e Omega. Ogni orologio lo apro io, e ti rispondo di persona.
                </p>
                <div className="mt-6 flex flex-col items-start gap-4 sm:mt-8 sm:flex-row sm:items-center sm:gap-6">
                  <a
                    href={whatsappLink("Buongiorno Roberto, le mando una foto del mio orologio per un preventivo.")}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-wa whitespace-nowrap"
                  >
                    <WhatsAppIcon className="h-5 w-5" />
                    <span>
                      <b>Mandami una foto</b>
                      <small>Rispondo io, su WhatsApp</small>
                    </span>
                  </a>
                  <Link href="/preventivo" className="btn-link">
                    o chiedi un preventivo
                  </Link>
                </div>
              </Reveal>
              <div className="absolute inset-y-0 right-[-18%] w-[72%] sm:right-[-6%] sm:w-[48%] lg:hidden">
                <Image
                  src="/images/roberto-landi-ritratto.webp"
                  alt="Roberto Landi, orologiaio a Pistoia"
                  fill
                  priority
                  sizes="50vw"
                  // la foto sfuma verso sinistra e in basso: niente riquadro dietro al testo
                  className="object-contain object-bottom [mask-composite:intersect] [mask-image:linear-gradient(90deg,transparent,black_38%),linear-gradient(to_bottom,black_80%,transparent)] [-webkit-mask-composite:source-in]"
                />
              </div>
            </div>
          </div>
          <div className="relative hidden h-[78dvh] lg:block">
            <Image
              src="/images/roberto-landi-ritratto.webp"
              alt="Roberto Landi, orologiaio a Pistoia"
              fill
              priority
              sizes="45vw"
              className="object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_82%,transparent)]"
            />
          </div>
        </div>
      </section>

      {/* le garanzie, subito: tolgono il rischio dove si decide */}
      <TrustBar />

      {/* la prova: prima e dopo, e come funziona in tre passi */}
      <BeforeAfter />

      {/* RESTAURO: sequenza guidata dallo scroll */}
      <RestorationSection />

      {/* le parole dei clienti prima di vetrina e servizi */}
      <Reviews />

      {/* SERVIZI: scorrimento orizzontale */}
      <ServicesRail />

      {/* VETRINA con i faretti */}
      <Showcase items={products.slice(0, 5)} />
      <div className="bg-[#0b100d] pb-20 text-center">
        <Link href="/shop" className="btn !border-cream/40 !text-cream hover:!bg-cream hover:!text-green-2">Tutti gli orologi</Link>
      </div>

      <BrandStrip />

      {/* IL MIO MONDO: chi è Roberto, al banco */}
      <section className="relative overflow-hidden py-16 sm:py-32">
        <Gear className="absolute -left-40 top-1/2 h-[480px] w-[480px] -translate-y-1/2 text-gold/15" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-8 lg:grid-cols-2">
          <IrisReveal>
            <ParallaxImage
              src="/images/roberto-landi-orologiaio-al-lavoro.jpg"
              alt="Roberto Landi al banco di lucidatura durante il restauro di un orologio di lusso"
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[16/11]"
              imgClassName="grayscale-[20%]"
            />
          </IrisReveal>
          <div>
            <Reveal>
              <p className="eyebrow">Il mio mondo</p>
            </Reveal>
            <SplitText
              as="h2"
              text="Ogni dettaglio conta. Curo ogni orologio *come se fosse il mio.*"
              className="mt-6 block font-display text-3xl font-light leading-snug sm:text-5xl"
            />
            <Reveal delay={0.2}>
              <p className="mt-6 leading-relaxed text-mute">
                Sono nato a Pistoia, in una famiglia di artigiani. Dopo gli studi artistici dedicati alla lavorazione dei metalli ho unito le forze con un amico d&apos;infanzia, con cui porto avanti un negozio di orologi di lusso riconosciuto a livello nazionale.
              </p>
              <p className="mt-4 leading-relaxed text-mute">
                Dal restauro estetico alla riparazione meccanica, nulla è lasciato al caso: è così che risveglio la bellezza di ogni orologio che passa tra le mie mani.
              </p>
              <Link href="/chi-sono" className="btn mt-8">La mia storia</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CONTATTI rapidi (il modulo completo è nelle pagine Contatti e Preventivo) */}
      <section className="relative overflow-hidden border-t border-line py-16 sm:py-28" aria-labelledby="contattami">
        <Gear className="absolute -right-40 -top-20 h-[460px] w-[460px] text-gold/10" teeth={28} reverse />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal>
            <p className="eyebrow">Contattami</p>
          </Reveal>
          <SplitText as="h2" id="contattami" text="Il tuo orologio merita *le mani giuste.*" className="mb-10 mt-4 block font-display text-4xl font-light sm:mb-14 sm:text-6xl" />
          <Reveal delay={0.1}>
            <QuickContact />
          </Reveal>
        </div>
      </section>
    </>
  );
}
