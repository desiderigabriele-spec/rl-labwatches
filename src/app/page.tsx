import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import WatchScene from "@/components/WatchSceneLazy";
import Gear from "@/components/Gear";
import RestorationSection from "@/components/RestorationSection";
import Reviews from "@/components/Reviews";
import BrandStrip from "@/components/BrandStrip";
import QuickContact from "@/components/QuickContact";
import Showcase from "@/components/Showcase";
import ServicesRail from "@/components/ServicesRail";
import SplitText from "@/components/SplitText";
import ParallaxImage from "@/components/ParallaxImage";
import Stats from "@/components/Stats";
import IrisReveal from "@/components/IrisReveal";
import { products } from "@/data/products";
import { site } from "@/data/site";
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
      {/* HERO */}
      <section className="relative overflow-hidden lg:min-h-dvh">
        <div className="pointer-events-none absolute right-[-10%] top-1/4 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[140px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-2 px-4 pb-10 pt-20 sm:px-8 sm:pt-28 lg:min-h-dvh lg:grid-cols-2 lg:gap-4 lg:pb-12">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow">{site.owner} · Laboratorio di orologeria a Pistoia</p>
            </Reveal>
            <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] sm:text-7xl xl:text-[5.5rem]">
              <SplitText text="Artigiano di" className="block" delay={0.1} />{" "}
              <SplitText text="*orologi di lusso*" className="block" delay={0.25} />{" "}
              <SplitText text="a Pistoia" className="mt-3 block text-3xl sm:text-4xl" delay={0.45} />
            </h1>
            <Reveal delay={0.5}>
              <p className="mt-6 max-w-md text-base leading-relaxed text-mute sm:mt-8 sm:text-lg">
                Restauro, revisione e riparazione di orologi di pregio. Ogni pezzo che entra nel mio laboratorio ne esce con la bellezza e la precisione del primo giorno.
              </p>
            </Reveal>
            <Reveal delay={0.6} className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <Link href="/preventivo" className="btn btn-solid">Richiedi un preventivo gratuito</Link>
              <Link href="/shop" className="btn">Entra in vetrina</Link>
            </Reveal>
          </div>
          <div className="order-1 h-[32vh] sm:h-[46vh] lg:order-2 lg:h-[78vh]">
            <WatchScene />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.7rem] uppercase tracking-[0.3em] text-mute sm:flex">
          Scorri
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      <Stats />

      {/* IL MIO MONDO */}
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
                La mia missione è far risplendere la bellezza intrinseca di ogni pezzo, unendo maestria artigianale e precisione tecnica. Dal restauro estetico alla riparazione meccanica, nulla è lasciato al caso: questo è il mio mondo, dove l&apos;<span className="text-fg">arte dell&apos;orologeria</span> incontra la <span className="text-fg">passione per la perfezione</span>.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* RESTAURO: sequenza 3D guidata dallo scroll */}
      <RestorationSection />

      {/* CHI SONO */}
      <section className="relative overflow-hidden py-16 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="lg:order-2">
            <div className="relative mx-auto aspect-[3/4] max-w-md">
              <Image
                src="/images/roberto-landi-ritratto.webp"
                alt="Ritratto di Roberto Landi, orologiaio a Pistoia"
                fill
                sizes="(min-width: 1024px) 35vw, 90vw"
                className="object-contain object-bottom [mask-image:linear-gradient(to_bottom,black_80%,transparent)]"
              />
            </div>
          </Reveal>
          <div className="lg:order-1">
            <Reveal>
              <p className="eyebrow">Salve, sono</p>
            </Reveal>
            <SplitText as="h2" text="Roberto Landi" className="mt-4 block font-display text-5xl font-light sm:text-7xl" />
            <Reveal delay={0.15}>
              <p className="mt-8 max-w-xl text-lg leading-relaxed text-mute">
                Sono nato a Pistoia, in una famiglia di artigiani, e la passione per l&apos;orologeria mi accompagna da quando ero ragazzo. Dopo gli studi artistici dedicati alla lavorazione dei metalli ho unito le forze con un amico d&apos;infanzia, con cui porto avanti un negozio di orologi di lusso riconosciuto a livello nazionale.
              </p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-mute">
                Tecnologie all&apos;avanguardia e un&apos;attenzione meticolosa ai dettagli: è così che risveglio la bellezza e il fascino di ogni orologio che passa tra le mie mani.
              </p>
              <Link href="/chi-sono" className="btn mt-10">La mia storia</Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* SERVIZI: scorrimento orizzontale */}
      <ServicesRail />

      {/* VETRINA con i faretti */}
      <Showcase items={products.slice(0, 5)} />
      <div className="bg-[#0b100d] pb-20 text-center">
        <Link href="/shop" className="btn !border-cream/40 !text-cream hover:!bg-cream hover:!text-green-2">Tutti gli orologi</Link>
      </div>

      <BrandStrip />
      <Reviews />

      {/* CONTATTI rapidi (il modulo completo è nelle pagine Contatti e Preventivo) */}
      <section className="relative overflow-hidden border-t border-line py-16 sm:py-28" aria-labelledby="contattami">
        <Gear className="absolute -right-40 -top-20 h-[460px] w-[460px] text-gold/10" teeth={28} reverse />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal>
            <p className="eyebrow">Contattami</p>
          </Reveal>
          <SplitText as="h2" id="contattami" text="Il tuo orologio merita *le mani giuste.*" className="mb-10 mt-4 block max-w-3xl font-display text-4xl font-light sm:mb-14 sm:text-6xl" />
          <Reveal delay={0.1}>
            <QuickContact />
          </Reveal>
        </div>
      </section>
    </>
  );
}
