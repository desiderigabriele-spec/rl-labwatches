import Link from "next/link";
import Reveal from "./Reveal";
import { brands } from "@/data/brands";

// Marche come tipografia (niente loghi di terzi): elegante e leggibile da Google
export default function BrandStrip() {
  return (
    <section className="border-t border-line py-24" aria-labelledby="marche-titolo">
      <div className="mx-auto max-w-7xl px-4 text-center sm:px-8">
        <Reveal>
          <h2 id="marche-titolo" className="eyebrow">Specializzato nei migliori marchi internazionali</h2>
          <ul className="mx-auto mt-10 flex max-w-5xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {brands.map((b) => (
              <li key={b.name} className="font-display text-3xl font-light tracking-wide text-fg/80 sm:text-4xl">{b.name}</li>
            ))}
          </ul>
          <Link href="/marche" className="btn mt-12">Le marche che tratto</Link>
        </Reveal>
      </div>
    </section>
  );
}
