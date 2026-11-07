import Link from "next/link";
import { brands } from "@/data/brands";

// Marche in scorrimento continuo (tipografia, niente loghi di terzi)
export default function BrandStrip() {
  const row = [...brands, ...brands];
  return (
    <section className="overflow-hidden border-t border-line py-24" aria-labelledby="marche-titolo">
      <h2 id="marche-titolo" className="eyebrow text-center">Specializzato nei grandi marchi dell&apos;alta orologeria</h2>
      <div className="marquee mt-12 flex w-max" aria-hidden>
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 items-center">
            {row.map((b, i) => (
              <li key={`${k}-${i}`} className="flex items-center font-display text-5xl font-light text-fg/80 sm:text-7xl">
                <span className="px-8 transition-colors hover:text-gold sm:px-12">{b.name}</span>
                <span className="text-xl text-gold-2">◆</span>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <p className="sr-only">{brands.map((b) => b.name).join(", ")}</p>
      <div className="mt-12 text-center">
        <Link href="/marche" className="btn">Le marche che tratto</Link>
      </div>
    </section>
  );
}
