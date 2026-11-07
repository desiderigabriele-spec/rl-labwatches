import type { Metadata } from "next";
import PageHero from "@/components/PageHero";

export const metadata: Metadata = { title: "Informativa sulla privacy", robots: { index: false } };

// TODO: incollare qui il testo legale dal vecchio sito Wix (da far verificare a un consulente).
export default function Page() {
  return (
    <>
      <PageHero eyebrow="Legale" title="Informativa sulla privacy" />
      <section className="mx-auto max-w-3xl px-4 py-20 text-mute sm:px-8">
        <p>Testo in aggiornamento.</p>
      </section>
    </>
  );
}
