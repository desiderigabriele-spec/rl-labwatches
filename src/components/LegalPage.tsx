import PageHero from "./PageHero";
import type { LegalPage as LP } from "@/content/legal";

const slug = (t: string) =>
  t
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** Testo legale invariato; sopra un "in breve" (dove c'è) e a lato l'indice dei capitoli. */
export default function LegalPage({ page, path }: { page: LP; path: string }) {
  const heads = page.blocks.filter(([t]) => t === "h").map(([, text]) => text);
  return (
    <>
      <PageHero eyebrow="Informazioni legali" title={page.title} crumbs={[{ name: page.title, path }]} />
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 sm:px-8 sm:py-20 lg:grid-cols-[15rem_1fr]">
        {heads.length > 2 && (
          <nav aria-label="Indice" className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">Indice</p>
            <ol className="mt-4 space-y-2 border-l border-line pl-4 text-sm">
              {heads.map((h) => (
                <li key={h}>
                  <a href={`#${slug(h)}`} className="text-mute transition-colors hover:text-gold">{h}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <article className="max-w-3xl">
          {page.summary && (
            <div className="mb-14 rounded-2xl border border-line bg-paper-2 p-7 sm:p-9">
              <p className="eyebrow">In breve</p>
              <ul className="mt-4 space-y-3">
                {page.summary.map((t) => (
                  <li key={t} className="flex gap-3 text-lg leading-relaxed">
                    <span aria-hidden className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {t}
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-sm text-mute">Qui sotto il testo completo, che è quello che vale.</p>
            </div>
          )}
          {page.blocks.map(([type, text], i) =>
            type === "h" ? (
              <h2 key={i} id={slug(text)} className="mt-14 scroll-mt-28 font-display text-3xl font-light text-fg first:mt-0">{text}</h2>
            ) : type === "note" ? (
              <p key={i} className="mt-12 border-t border-line pt-6 text-sm text-mute">{text}</p>
            ) : (
              <p key={i} className="mt-4 text-base leading-[1.8] text-mute">{text}</p>
            )
          )}
        </article>
      </div>
    </>
  );
}
