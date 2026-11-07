import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import ContactInfo from "@/components/ContactInfo";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contatti: orologiaio a Pistoia",
  description:
    "Roberto Landi, orologiaio a Pistoia in Via Padre Giovanni Antonelli 69. Telefono, WhatsApp ed email per un preventivo gratuito o un consiglio.",
  path: "/contatti",
});

export default function ContattiPage() {
  return (
    <>
      <PageHero
        eyebrow="Contatti"
        title="Contattami"
        intro="Sono qui per rispondere a tutte le tue domande e discutere le tue esigenze di restauro e riparazione. Scrivimi per un preventivo gratuito o un consiglio."
        crumbs={[{ name: "Contatti", path: "/contatti" }]}
      />
      <section className="mx-auto grid max-w-7xl gap-20 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <ContactInfo />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mb-8 font-display text-3xl">Inviami un messaggio</h2>
          <ContactForm />
        </Reveal>
      </section>
    </>
  );
}
