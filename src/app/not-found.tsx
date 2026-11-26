import Link from "next/link";

const LINKS = [
  ["/", "Home"],
  ["/servizi", "Restauro"],
  ["/shop", "Compravendita"],
  ["/contatti", "Contatti"],
] as const;

/** Un quadrante fermo: la pagina non c'è, ma il resto del laboratorio sì. */
export default function NotFound() {
  return (
    <section className="flex min-h-[85dvh] flex-col items-center justify-center px-4 pb-16 pt-32 text-center">
      <svg viewBox="0 0 120 120" className="h-40 w-40 sm:h-48 sm:w-48" aria-hidden>
        <circle cx="60" cy="60" r="56" fill="none" stroke="var(--color-gold)" strokeWidth="1.5" />
        <circle cx="60" cy="60" r="49" fill="none" stroke="var(--color-line)" strokeWidth="1" />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1="60" y1="14" x2="60" y2={i % 3 ? 19 : 22} stroke="var(--color-fg)" strokeWidth={i % 3 ? 1 : 2} transform={`rotate(${i * 30} 60 60)`} />
        ))}
        {/* 4:04 */}
        <line x1="60" y1="60" x2="60" y2="34" stroke="var(--color-fg)" strokeWidth="3" strokeLinecap="round" transform="rotate(122 60 60)" />
        <line x1="60" y1="60" x2="60" y2="20" stroke="var(--color-fg)" strokeWidth="2" strokeLinecap="round" transform="rotate(24 60 60)" />
        <circle cx="60" cy="60" r="3" fill="var(--color-gold)" />
      </svg>
      <p className="eyebrow mt-8">Errore 404</p>
      <h1 className="mt-4 font-display text-5xl font-light sm:text-7xl">
        Questa pagina <em className="text-gold">si è fermata.</em>
      </h1>
      <p className="mt-5 max-w-md text-mute">Forse l&apos;indirizzo è cambiato col nuovo sito. Riparti da qui:</p>
      <nav aria-label="Pagine principali" className="mt-8 flex flex-wrap justify-center gap-3">
        {LINKS.map(([href, name], i) => (
          <Link key={href} href={href} className={i === 0 ? "btn btn-solid" : "btn"}>
            {name}
          </Link>
        ))}
      </nav>
    </section>
  );
}
