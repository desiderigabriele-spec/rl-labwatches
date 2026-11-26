import Link from "next/link";
import Reveal from "./Reveal";
import JsonLd from "./JsonLd";
import SplitText from "./SplitText";
import { breadcrumbLd } from "@/lib/seo";
import Filigrana from "./Filigrana";

export default function PageHero({
  eyebrow,
  h1,
  title,
  intro,
  crumbs,
}: {
  eyebrow?: string;
  /** titolo per Google (keyword + città): prende il posto del sopratitolo, con lo stesso aspetto; lo slogan grande resta */
  h1?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  /** percorso della pagina per il breadcrumb (es. [{ name: "Servizi", path: "/servizi" }]) */
  crumbs?: { name: string; path: string }[];
}) {
  return (
    <section className="relative overflow-hidden border-b border-line pt-36 pb-16 sm:pt-44 sm:pb-24">
      {crumbs && <JsonLd data={breadcrumbLd(crumbs)} />}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-gold/10 blur-[120px]" />
      <Filigrana className="absolute right-[-30%] top-[-30%] h-[150%] w-auto opacity-[0.14] sm:right-[-8%] lg:right-[2%]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <Reveal>
          {crumbs && (
            <nav aria-label="Percorso" className="mb-6 text-xs uppercase tracking-[0.2em] text-mute">
              <Link href="/" className="inline-block py-1.5 hover:text-gold">Home</Link>
              {crumbs.map((c) => (
                <span key={c.path}> <span aria-hidden>/</span> {c.name}</span>
              ))}
            </nav>
          )}
          {h1 ? <h1 className="eyebrow">{h1}</h1> : <p className="eyebrow">{eyebrow}</p>}
          {h1 ? (
            <p className="mt-5 font-display text-display font-light leading-[1.05] sm:text-6xl">
              {typeof title === "string" ? <SplitText text={title} delay={0.1} /> : title}
            </p>
          ) : (
            <h1 className="mt-5 font-display text-display font-light leading-[1.05] sm:text-6xl">
              {typeof title === "string" ? <SplitText text={title} delay={0.1} /> : title}
            </h1>
          )}
          {intro && <div className="mt-6 max-w-2xl text-lg leading-relaxed text-mute">{intro}</div>}
        </Reveal>
      </div>
    </section>
  );
}
