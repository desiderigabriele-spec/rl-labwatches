import Reveal from "./Reveal";

export default function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-36 pb-16 sm:pt-44 sm:pb-24">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl font-light leading-[1.05] sm:text-7xl">{title}</h1>
          {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">{intro}</p>}
        </Reveal>
      </div>
    </section>
  );
}
