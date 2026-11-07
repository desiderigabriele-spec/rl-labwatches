import Link from "next/link";
import { brands } from "@/data/brands";
import BrandLogo from "./BrandLogo";

// Loghi delle marche in scorrimento continuo
export default function BrandStrip() {
  const row = [...brands, ...brands];
  return (
    <section className="overflow-hidden border-t border-line py-24" aria-labelledby="marche-titolo">
      <h2 id="marche-titolo" className="eyebrow text-center">Specializzato nei grandi marchi dell&apos;alta orologeria</h2>
      <div className="marquee mt-14 flex w-max">
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {row.map((b, i) => (
              <li key={`${k}-${i}`} className="flex items-center px-10 sm:px-16">
                <BrandLogo brand={b} className={`text-fg/70 transition-colors duration-300 hover:text-gold ${b.ratio > 3 ? "h-9 sm:h-12" : "h-14 sm:h-20"}`} />
              </li>
            ))}
          </ul>
        ))}
      </div>
      <div className="mt-14 text-center">
        <Link href="/marche" className="btn">Le marche che tratto</Link>
      </div>
    </section>
  );
}
