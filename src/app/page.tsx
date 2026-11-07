import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import WatchScene from "@/components/WatchSceneLazy";
import Gear from "@/components/Gear";
import RestorationSection from "@/components/RestorationSection";
import Reviews from "@/components/Reviews";
import BrandStrip from "@/components/BrandStrip";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import { services } from "@/data/services";
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
      <section className="relative min-h-dvh overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-1/4 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[140px]" />
        <div className="relative mx-auto grid min-h-dvh max-w-7xl items-center gap-4 px-4 pt-28 pb-12 sm:px-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow">{site.owner} · Laboratorio di orologeria</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] sm:text-7xl xl:text-[5.5rem]">
                Artigiano di
                <br />
                <em className="gold-text font-normal">orologi di lusso</em>
                <span className="mt-3 block text-3xl sm:text-4xl">a Pistoia</span>
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-mute">
                La mia missione è far risplendere la bellezza intrinseca di ogni pezzo, combinando maestria artigianale e precisione tecnica.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
              <Link href="/preventivo" className="btn btn-solid">Richiedi un preventivo</Link>
              <Link href="/servizi" className="btn">Scopri i servizi</Link>
            </Reveal>
          </div>
          <div className="order-1 h-[42vh] sm:h-[52vh] lg:order-2 lg:h-[78vh]">
            <WatchScene />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.62rem] uppercase tracking-[0.3em] text-mute sm:flex">
          Scorri
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* MISSIONE */}
      <section className="relative overflow-hidden border-t border-line py-24 sm:py-32">
        <Gear className="absolute -left-40 top-1/2 h-[480px] w-[480px] -translate-y-1/2 text-gold/15" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[16/11] overflow-hidden">
              <Image
                src="/images/roberto-landi-orologiaio-al-lavoro.jpg"
                alt="Roberto Landi al banco di lucidatura durante il restauro di un orologio di lusso"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover grayscale-[20%]"
              />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Il mio mondo</p>
            <p className="mt-6 font-display text-3xl font-light leading-snug sm:text-4xl">
              Ogni dettaglio, dal restauro estetico alla riparazione meccanica, è curato con la massima attenzione.
            </p>
            <p className="mt-6 leading-relaxed text-mute">
              Questo è il mio mondo, dove l&apos;<span className="text-fg">arte dell&apos;orologeria</span> si fonde con la <span className="text-fg">passione per la perfezione</span>. Scopri i miei servizi e non esitare a contattarmi per qualsiasi necessità riguardante il tuo segnatempo.
            </p>
          </Reveal>
        </div>
      </section>

      {/* RESTAURO: sequenza 3D guidata dallo scroll */}
      <RestorationSection />

      {/* CHI SONO */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal className="lg:order-2">
            <div className="relative mx-auto aspect-[3/4] max-w-md overflow-hidden bg-green">
              <Image src="/images/roberto-landi-ritratto.jpg" alt="Ritratto di Roberto Landi, orologiaio a Pistoia" fill sizes="(min-width: 1024px) 35vw, 90vw" className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="lg:order-1">
            <p className="eyebrow">Salve, sono</p>
            <h2 className="mt-4 font-display text-5xl font-light sm:text-7xl">Roberto Landi</h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-mute">
              Nato in una famiglia di artigiani a Pistoia, la mia passione per l&apos;orologeria è stata alimentata fin dalla mia giovinezza. Dopo un percorso di studi artistici focalizzati sui metalli, ho unito le forze con un vecchio amico per portare avanti un negozio di orologi di lusso riconosciuto a livello nazionale.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-mute">
              Con l&apos;ausilio di tecnologie all&apos;avanguardia e una meticolosa attenzione ai dettagli, ci impegniamo per risvegliare la bellezza e il fascino di ogni orologio che passa tra le nostre mani.
            </p>
            <Link href="/chi-sono" className="btn mt-10">Scopri di più</Link>
          </Reveal>
        </div>
      </section>

      {/* SERVIZI */}
      <section className="border-t border-line bg-paper-2 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="eyebrow">I miei servizi</p>
              <h2 className="mt-4 font-display text-4xl font-light sm:text-6xl">Dalla riparazione alla manutenzione</h2>
              <p className="mt-6 text-mute">Ogni passaggio viene eseguito con passione e precisione per garantire il meglio per il tuo orologio.</p>
            </div>
            <Link href="/servizi" className="btn">Tutti i servizi</Link>
          </Reveal>
          <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={(i % 3) * 0.08}>
                <Link href={`/servizi#${s.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-paper-3">
                    <Image src={s.image} alt={s.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
                  </div>
                  <h3 className="mt-6 font-display text-2xl transition-colors group-hover:text-gold">{s.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-mute">{s.text}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <BrandStrip />
      <Reviews />

      {/* CONTATTI */}
      <section className="relative overflow-hidden border-t border-line py-28" aria-labelledby="contattami">
        <Gear className="absolute -right-40 -top-20 h-[460px] w-[460px] text-gold/10" teeth={28} reverse />
        <div className="relative mx-auto grid max-w-7xl gap-20 px-4 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
          <Reveal>
            <p className="eyebrow">Contattami</p>
            <h2 id="contattami" className="mb-12 mt-4 font-display text-4xl font-light sm:text-6xl">Il tuo orologio merita le mani giuste.</h2>
            <ContactInfo />
          </Reveal>
          <Reveal delay={0.1} className="lg:pt-32">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
