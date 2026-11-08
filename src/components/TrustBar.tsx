import { site } from "@/data/site";

/** Le garanzie che tolgono il rischio, subito sotto l'apertura (al posto della griglia dei numeri) */
const items = [
  { icon: "✓", title: "Preventivo gratuito", text: "senza impegno" },
  { icon: "12", title: "Garanzia 12 mesi", text: "su ogni riparazione" },
  { icon: "⛟", title: "Spedizione assicurata", text: "ritiro e riconsegna in tutta Italia" },
  { icon: "RL", title: "Rispondo io", text: `${site.owner}, di persona` },
];

export default function TrustBar() {
  return (
    <section aria-label="Le mie garanzie" className="border-y border-line bg-paper-2">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-4 px-4 py-6 sm:px-8 lg:grid-cols-4 lg:py-8">
        {items.map((it) => (
          <li key={it.title} className="grid grid-cols-[2.25rem_1fr] items-center gap-3">
            <span aria-hidden className="grid h-9 w-9 place-items-center rounded-full border border-gold-2 font-mono text-xs text-gold">
              {it.icon}
            </span>
            <span className="text-[0.8rem] leading-snug text-mute sm:text-sm">
              <b className="block font-semibold text-fg">{it.title}</b>
              {it.text}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
