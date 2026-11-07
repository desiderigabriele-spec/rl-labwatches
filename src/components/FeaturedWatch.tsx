import Link from "next/link";
import Reveal from "./Reveal";
import SplitText from "./SplitText";
import Viewer360 from "./Viewer360";
import { formatPrice, spinFrames, type Product } from "@/data/products";
import { whatsappLink } from "@/data/site";
import { WhatsAppIcon } from "./WhatsAppButton";

/** "Il pezzo del mese": un solo orologio presentato in grande, in stile editoriale */
export default function FeaturedWatch({ p }: { p: Product }) {
  const frames = spinFrames(p);
  const month = new Intl.DateTimeFormat("it-IT", { month: "long", year: "numeric" }).format(new Date());
  return (
    <section className="relative overflow-hidden border-t border-line py-16 sm:py-28" aria-labelledby="pezzo-del-mese">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
        <div className="min-w-0">
          <Reveal>
            <p className="eyebrow">Il pezzo del mese · <span className="tag-mono normal-case tracking-normal">{month}</span></p>
          </Reveal>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-mute">{p.brand}</p>
          <SplitText as="h2" id="pezzo-del-mese" text={p.name} className="mt-2 block font-display text-6xl font-light leading-[0.95] sm:text-8xl xl:text-9xl" />
          <Reveal delay={0.15}>
            <div className="mt-6 flex flex-wrap gap-2 text-fg/70">
              <span className="chip">Ref. {p.ref}</span>
              <span className="chip">{p.year}</span>
              <span className="chip">{p.condition}</span>
            </div>
            {p.story && <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{p.story}</p>}
            <p className="tag-mono mt-8 text-3xl text-green">{formatPrice(p.price)}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/shop/${p.slug}`} className="btn btn-solid">Scopri l&apos;orologio</Link>
              <a href={whatsappLink(`Buongiorno, vorrei informazioni su ${p.brand} ${p.name} (Ref. ${p.ref}).`)} target="_blank" rel="noopener noreferrer" className="btn">
                <WhatsAppIcon className="h-4 w-4" /> Chiedi informazioni
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1} className="order-first lg:order-none">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-sm bg-[radial-gradient(closest-side,var(--color-paper-3),transparent)] sm:max-w-md">
            {frames.length > 0 && <Viewer360 frames={frames} alt={`${p.brand} ${p.name}`} />}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
