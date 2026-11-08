import Reveal from "./Reveal";
import { GOOGLE_REVIEWS_URL, reviews, type Review } from "@/data/reviews";

/**
 * Recensioni vere da Google: due nastri che scorrono in direzioni opposte (si fermano al passaggio del mouse
 * o al tocco), ogni scheda con il logo Google e il link alla scheda originale per verificarla.
 */

function GoogleG({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

const Stars = ({ className = "" }: { className?: string }) => (
  <span className={`tracking-[0.12em] text-[#fbbc04] ${className}`} aria-label="5 stelle su 5">
    ★★★★★
  </span>
);

function Text({ r }: { r: Review }) {
  if (!r.highlight || !r.text.includes(r.highlight)) return <>{r.text}</>;
  const [before, after] = r.text.split(r.highlight);
  return (
    <>
      {before}
      <mark className="bg-transparent font-medium text-fg [background-image:linear-gradient(transparent_62%,rgba(189,146,60,0.28)_62%)]">{r.highlight}</mark>
      {after}
    </>
  );
}

function Card({ r }: { r: Review }) {
  return (
    <figure className="flex w-[19.5rem] shrink-0 flex-col rounded-2xl border border-line bg-paper p-6 shadow-[0_10px_30px_rgba(18,32,26,0.06)] sm:w-[23rem]">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-base font-medium text-white" style={{ background: r.color }} aria-hidden>
          {r.initial}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-semibold text-fg">{r.author}</span>
          <span className="block text-xs text-mute">{r.localGuide ? "Local Guide su Google" : "Cliente su Google"}</span>
        </span>
        <GoogleG className="h-5 w-5 shrink-0" />
      </div>
      <Stars className="mt-4 text-lg" />
      <blockquote className="mt-3 flex-1 text-[0.95rem] leading-relaxed text-mute">
        <Text r={r} />
      </blockquote>
      {r.reply && (
        <p className="mt-4 border-l-2 border-gold-2 pl-3 text-xs leading-relaxed text-mute">
          <b className="font-semibold text-fg">Risposta di Roberto:</b> {r.reply}
        </p>
      )}
      <figcaption className="mt-5 flex items-center gap-1.5 border-t border-line pt-4 text-xs text-mute">
        <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#1a73e8]" fill="currentColor" aria-hidden>
          <path d="M12 2 9.6 4.3 6.3 4l-.6 3.3L2.8 9l1.5 3-1.5 3 2.9 1.7.6 3.3 3.3-.3L12 22l2.4-2.3 3.3.3.6-3.3 2.9-1.7-1.5-3 1.5-3-2.9-1.7-.6-3.3-3.3.3zm-1.2 13.6-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4z" />
        </svg>
        Recensione pubblicata su Google
      </figcaption>
    </figure>
  );
}

/** nastro infinito: le schede sono ripetute due volte e il contenuto scorre di metà larghezza */
function Lane({ items: base, reverse = false, speed }: { items: Review[]; reverse?: boolean; speed: number }) {
  // ogni metà del nastro deve essere più larga dello schermo più largo: ripeto le schede fino ad almeno 8
  const items: Review[] = [];
  while (items.length < 8) items.push(...base);
  return (
    <div className="reviews-lane group relative overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
      <div className={`reviews-track flex w-max gap-5 ${reverse ? "is-reverse" : ""}`} style={{ animationDuration: `${speed}s` }}>
        {[...items, ...items].map((r, i) => (
          <div key={i} aria-hidden={i >= items.length} className="flex">
            <Card r={r} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Reviews() {
  const half = Math.ceil(reviews.length / 2);
  return (
    <section className="overflow-hidden border-t border-line bg-paper-2 py-16 sm:py-28" aria-labelledby="recensioni">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Recensioni Google</p>
            <h2 id="recensioni" className="mt-4 font-display text-4xl font-light sm:text-6xl">
              Le parole dei miei <em className="text-gold">clienti</em>
            </h2>
          </div>
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 self-start rounded-2xl border border-line bg-paper px-5 py-4 shadow-sm transition hover:border-gold-2 sm:self-auto"
          >
            <GoogleG className="h-9 w-9" />
            <span>
              <Stars className="block text-xl leading-none" />
              <span className="mt-1.5 block text-sm text-mute">
                Leggi tutte le recensioni <span className="text-green transition group-hover:translate-x-0.5">→</span>
              </span>
            </span>
          </a>
        </Reveal>
      </div>
      <div className="mt-10 grid gap-2 sm:mt-14">
        <Lane items={reviews.slice(0, half)} speed={70} />
        <Lane items={reviews.slice(half)} reverse speed={62} />
      </div>
    </section>
  );
}
