import Link from "next/link";
import Reveal from "@/components/Reveal";
import WatchScene from "@/components/WatchSceneLazy";
import Gear from "@/components/Gear";
import ProductCard from "@/components/ProductCard";
import { services } from "@/data/services";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-dvh overflow-hidden">
        <div className="pointer-events-none absolute right-[-10%] top-1/4 h-[600px] w-[600px] rounded-full bg-gold/10 blur-[140px]" />
        <div className="relative mx-auto grid min-h-dvh max-w-7xl items-center gap-4 px-4 pt-24 pb-12 sm:px-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="eyebrow">Laboratorio di orologeria · {site.address.city}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <h1 className="mt-6 font-display text-5xl font-light leading-[1.02] sm:text-7xl xl:text-8xl">
                Il tempo,
                <br />
                <em className="gold-text not-italic font-normal italic">restaurato</em>
                <br />
                a mano.
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-md text-lg leading-relaxed text-mute">
                {site.owner} si prende cura di orologi meccanici e di lusso: revisione, restauro d&apos;epoca e riparazione, con la
                precisione di un tempo.
              </p>
            </Reveal>
            <Reveal delay={0.3} className="mt-10 flex flex-wrap gap-4">
              <Link href="/contatti" className="btn btn-solid">Richiedi un preventivo</Link>
              <Link href="/shop" className="btn">Scopri lo shop</Link>
            </Reveal>
          </div>
          <div className="order-1 h-[46vh] sm:h-[56vh] lg:order-2 lg:h-[80vh] [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
            <WatchScene />
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[0.62rem] uppercase tracking-[0.3em] text-mute sm:flex">
          Scorri
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* MANIFESTO */}
      <section className="relative overflow-hidden border-y border-line bg-ink-2 py-28 sm:py-36">
        <Gear className="absolute -left-40 top-1/2 h-[480px] w-[480px] -translate-y-1/2 text-gold/15" />
        <Gear className="absolute -right-24 -bottom-24 h-[300px] w-[300px] text-gold/10" teeth={16} reverse />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-8">
          <Reveal>
            <p className="eyebrow">Il laboratorio</p>
            <p className="mt-8 font-display text-3xl font-light leading-snug sm:text-5xl">
              Ogni orologio racconta una storia. Il nostro lavoro è far sì che continui a battere —
              <span className="gold-text"> con rispetto per l&apos;originale</span> e cura per ogni dettaglio.
            </p>
          </Reveal>
        </div>
      </section>

      {/* SERVIZI */}
      <section className="mx-auto max-w-7xl px-4 py-28 sm:px-8">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Servizi</p>
            <h2 className="mt-4 font-display text-4xl font-light sm:text-6xl">Cosa facciamo</h2>
          </div>
          <Link href="/servizi" className="btn">Tutti i servizi</Link>
        </Reveal>
        <div className="mt-16 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.08} className="h-full">
              <div className="group h-full bg-ink p-8 transition-colors duration-500 hover:bg-ink-2 sm:p-12">
                <p className="font-display text-sm text-gold">0{i + 1}</p>
                <h3 className="mt-6 font-display text-3xl">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-mute">{s.summary}</p>
                <span className="mt-8 block h-px w-10 bg-gold transition-all duration-500 group-hover:w-24" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SHOP */}
      <section className="border-t border-line bg-ink-2 py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Shop</p>
              <h2 className="mt-4 font-display text-4xl font-light sm:text-6xl">Orologi selezionati</h2>
            </div>
            <Link href="/shop" className="btn">Vai allo shop</Link>
          </Reveal>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.1}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-32">
        <Gear className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 text-gold/[0.07]" teeth={32} />
        <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-8">
          <h2 className="font-display text-4xl font-light sm:text-6xl">Il tuo orologio merita le mani giuste.</h2>
          <p className="mx-auto mt-6 max-w-xl text-mute">
            Raccontaci il tuo orologio: ti risponderemo con una valutazione e un preventivo senza impegno.
          </p>
          <Link href="/contatti" className="btn btn-solid mt-10">Contattaci</Link>
        </Reveal>
      </section>
    </>
  );
}
