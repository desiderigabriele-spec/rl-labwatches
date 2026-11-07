import Reveal from "./Reveal";
import SwipeRow from "./SwipeRow";
import { reviews } from "@/data/reviews";

export default function Reviews() {
  return (
    <section className="border-t border-line bg-paper-2 py-16 sm:py-28" aria-labelledby="recensioni">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          <p className="eyebrow">Feedback e recensioni</p>
          <h2 id="recensioni" className="mt-4 font-display text-4xl font-light sm:text-6xl">Le parole dei miei clienti</h2>
        </Reveal>
        <div className="mt-12">
          <SwipeRow label="Recensioni dei clienti" gridClass="md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0" itemClass="w-[86%] sm:w-[60%] md:w-auto" controlsClass="md:hidden">
            {reviews.map((r) => (
              <figure key={r.author} className="flex h-full flex-col border border-line bg-paper p-7 sm:p-10">
                <p className="font-display text-5xl leading-none text-gold-2" aria-hidden>“</p>
                <h3 className="font-display text-2xl">{r.title}</h3>
                <blockquote className="mt-4 flex-1 leading-relaxed text-mute">{r.text}</blockquote>
                <figcaption className="mt-6 text-xs uppercase tracking-[0.24em] text-gold">{r.author}</figcaption>
              </figure>
            ))}
          </SwipeRow>
        </div>
      </div>
    </section>
  );
}
