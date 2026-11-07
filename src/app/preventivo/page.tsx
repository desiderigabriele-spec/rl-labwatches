import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { pageMeta } from "@/lib/seo";
import { site } from "@/data/site";

export const metadata = pageMeta({
  title: "Richiedi un preventivo gratuito",
  description:
    "Preventivo gratuito per riparare o restaurare il tuo orologio di lusso da Roberto Landi, orologiaio a Pistoia. Risposta via email o WhatsApp.",
  path: "/preventivo",
});

const steps = [
  ["Descrivi l'orologio", "Marca, modello e cosa vorresti fare. Qualche foto aiuta molto."],
  ["Ricevi la valutazione", "Ti rispondo con una stima dei tempi e dei costi, senza impegno."],
  ["Consegna o spedizione", "Su appuntamento in laboratorio a Pistoia, oppure con spedizione assicurata."],
];

export default function PreventivoPage() {
  return (
    <>
      <PageHero
        eyebrow="Preventivo gratuito"
        title="Richiedi un preventivo"
        intro="Compila tutti i campi: ti risponderò con una valutazione dell'intervento sul tuo orologio."
        crumbs={[{ name: "Preventivo", path: "/preventivo" }]}
      />
      <section className="mx-auto grid max-w-7xl gap-20 px-4 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <ol className="space-y-10">
            {steps.map(([t, d], i) => (
              <li key={t} className="flex gap-6">
                <span className="font-display text-4xl font-light text-gold-2">{i + 1}</span>
                <div>
                  <h2 className="font-display text-2xl">{t}</h2>
                  <p className="mt-2 text-mute">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-12 text-sm text-mute">
            Preferisci parlarne a voce? Chiama il <a className="text-green hover:text-gold" href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm quote />
        </Reveal>
      </section>
    </>
  );
}
