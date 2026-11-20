import Image from "next/image";
import Reveal from "./Reveal";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

/**
 * "Vendilo con me": la compravendita spiegata in quattro tappe su una linea d'oro, subito dopo l'apertura.
 * Il passo che la concorrenza non fa (il restauro prima della vendita) è in evidenza.
 * La vetrina online apre a gennaio 2027: intanto si può già affidare a Roberto un orologio da vendere.
 */
const steps = [
  { img: "/vendi/valutazione.webp", title: "Valutazione gratuita", text: "Mi mandi le foto o me lo porti: ti dico quanto vale oggi, e quanto può valere dopo." },
  { img: "/vendi/restauro.webp", title: "Restauro prima della vendita", text: "Movimento, lucidatura, ricambi originali. Lo facciamo solo se conviene.", badge: "Solo da me" },
  { img: "/vendi/vetrina.webp", title: "In vetrina", text: "Foto curate e scheda completa sul sito, con la vetrina online da gennaio 2027." },
  { img: "/vendi/canali.webp", title: "Su ogni mio canale", text: "Lo promuovo su Instagram, su Facebook e sul sito, finché non trova il suo nuovo polso." },
];

const SELL_MSG = "Buongiorno Roberto, vorrei affidarle un orologio da vendere.";

export default function SellWithMe() {
  return (
    <section id="vendi" aria-labelledby="vendi-titolo" className="relative scroll-mt-24 overflow-hidden bg-paper py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
          <Reveal>
            <p className="eyebrow">Compravendita</p>
            <h2 id="vendi-titolo" className="mt-4 font-display text-[2.4rem] font-light leading-[1.02] sm:text-6xl">
              Vendilo con me.
              <br />
              <em className="text-gold-2">Prima lo restauro.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-md text-[0.95rem] leading-relaxed text-mute sm:text-base">
              La vetrina online apre a gennaio 2027. Vuoi vendere un orologio? Affidamelo già da ora: lo restauro, lo espongo e lo promuovo su ogni mio
              canale.
            </p>
          </Reveal>
        </div>

        {/* le quattro tappe su una linea d'oro: su telefono scorrono di lato */}
        <div className="sell-track -mx-4 mt-8 overflow-x-auto px-4 pb-2 pt-3 sm:mx-0 sm:mt-12 sm:overflow-visible sm:px-0">
          <ol className="sell-rail relative grid min-w-[56rem] grid-cols-4 gap-6 sm:min-w-0">
            {steps.map((s, i) => (
              <li key={s.title} className={`sell-step ${s.badge ? "is-key" : ""}`}>
                <Reveal delay={0.08 * i}>
                  <span className="sell-bead">
                    <Image src={s.img} alt="" width={240} height={240} sizes="112px" className="h-full w-full object-cover" />
                  </span>
                  <span className="mt-5 block font-mono text-[0.7rem] tracking-[0.12em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  {s.badge && <span className="sell-badge">{s.badge}</span>}
                  <h3 className="mt-2 font-display text-[1.6rem] leading-[1.08]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{s.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-line pt-7 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p className="sell-notice">
            <i aria-hidden />
            Vetrina online da gennaio 2027
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <a href={whatsappLink(SELL_MSG)} target="_blank" rel="noopener noreferrer" className="btn btn-solid">
              <WhatsAppIcon className="h-4 w-4" />
              Affidami il tuo orologio
            </a>
            <a href="/contatti" className="btn-link">
              o vieni in laboratorio
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
