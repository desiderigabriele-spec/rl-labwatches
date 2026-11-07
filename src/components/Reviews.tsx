import Reveal from "./Reveal";
import { reviews } from "@/data/reviews";

export default function Reviews() {
  return (
    <section className="border-t border-line bg-paper-2 py-28" aria-labelledby="recensioni">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="eyebrow">Feedback e recensioni</p>
          <h2 id="recensioni" className="mt-4 font-display text-4xl font-light sm:text-6xl">Alcuni dei miei clienti soddisfatti</h2>
        </Reveal>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.1} className="h-full">
              <figure className="flex h-full flex-col border border-line bg-paper p-8 sm:p-10">
                <p className="font-display text-6xl leading-none text-gold-2" aria-hidden>“</p>
                <h3 className="font-display text-2xl">{r.title}</h3>
                <blockquote className="mt-4 flex-1 leading-relaxed text-mute">{r.text}</blockquote>
                <figcaption className="mt-8 text-xs uppercase tracking-[0.24em] text-gold">{r.author}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
