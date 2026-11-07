import PageHero from "./PageHero";
import type { LegalPage as LP } from "@/content/legal";

export default function LegalPage({ page, path }: { page: LP; path: string }) {
  return (
    <>
      <PageHero eyebrow="Informazioni legali" title={page.title} crumbs={[{ name: page.title, path }]} />
      <article className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
        {page.blocks.map(([type, text], i) =>
          type === "h" ? (
            <h2 key={i} className="mt-10 font-display text-2xl text-fg first:mt-0">{text}</h2>
          ) : type === "note" ? (
            <p key={i} className="mt-10 text-sm text-mute">{text}</p>
          ) : (
            <p key={i} className="mt-4 leading-relaxed text-mute">{text}</p>
          )
        )}
      </article>
    </>
  );
}
