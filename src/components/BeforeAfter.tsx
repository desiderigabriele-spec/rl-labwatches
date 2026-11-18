"use client";
import { whatsappLink } from "@/data/site";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import { WhatsAppIcon } from "./WhatsAppButton";
import WorksArc from "./WorksArc";

const steps = [
  { n: "1", title: "Mi mandi una foto", text: "Su WhatsApp, anche dal telefono." },
  { n: "2", title: "Preventivo gratuito", text: "Ti dico cosa serve e quanto costa." },
  { n: "3", title: "Ritiro assicurato", text: "Lo restauro e te lo riconsegno, ovunque tu sia." },
];

/** Prima e dopo su lavori veri: si sfogliano sull'arco (WorksArc), la linea scorre da sola e si trascina col dito */
export default function BeforeAfter() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-28" aria-labelledby="prima-dopo">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        {/* i lavori su un arco di galleria: si sfogliano, e su quello davanti si trascina la linea del prima e dopo */}
        <WorksArc />

        <div className="min-w-0">
          <Reveal>
            <p className="eyebrow">Prima e dopo</p>
          </Reveal>
          <SplitText as="h2" id="prima-dopo" text="Com'era. *Com'è tornato.*" className="mt-4 block font-display text-4xl font-light leading-tight sm:text-6xl" />
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-md leading-relaxed text-mute">
              Lavori veri del mio laboratorio. Sfoglia i lavori e trascina la linea per vedere la differenza.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ol className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="grid grid-cols-[2rem_1fr] gap-2">
                  <span className="font-display text-3xl leading-none text-gold">{s.n}</span>
                  <span className="text-sm leading-snug text-mute">
                    <b className="block font-semibold text-fg">{s.title}</b>
                    {s.text}
                  </span>
                </li>
              ))}
            </ol>
            <a
              href={whatsappLink("Buongiorno Roberto, le mando una foto del mio orologio per un preventivo.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa mt-8"
            >
              <WhatsAppIcon className="h-5 w-5" />
              <span>
                <b>Mandami una foto</b>
                <small>Preventivo gratuito su WhatsApp</small>
              </span>
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
