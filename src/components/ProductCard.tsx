import Image from "next/image";
import Link from "next/link";
import { formatPrice, spinFrames, type Product } from "@/data/products";
import { fiducia, rigaSpecifiche } from "@/data/filtri";

export function WatchPlaceholder() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3 text-gold/40" aria-hidden>
      <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="0.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={(100 + Math.sin(a) * 44).toFixed(2)} y1={(100 - Math.cos(a) * 44).toFixed(2)} x2={(100 + Math.sin(a) * 50).toFixed(2)} y2={(100 - Math.cos(a) * 50).toFixed(2)} stroke="currentColor" strokeWidth="1.5" />;
      })}
      <line x1="100" y1="100" x2="100" y2="68" stroke="currentColor" strokeWidth="2" />
      <line x1="100" y1="100" x2="124" y2="112" stroke="currentColor" strokeWidth="1.5" />
      <rect x="92" y="10" width="16" height="28" rx="3" fill="none" stroke="currentColor" />
      <rect x="92" y="162" width="16" height="28" rx="3" fill="none" stroke="currentColor" />
    </svg>
  );
}

/**
 * Scheda di fiducia: foto 4:5 con al massimo due etichette (corredo o «Venduto» a sinistra, sconto o 360° a destra),
 * marca e anno, modello, una riga con misura, materiale e movimento, prezzo su una riga sua e i motivi di fiducia in verde.
 */
export default function ProductCard({ product: p }: { product: Product }) {
  const cover = p.image ?? spinFrames(p)[0];
  const f = fiducia(p);
  const specifiche = rigaSpecifiche(p);
  const sconto = p.listPrice != null && p.price != null && p.listPrice > p.price ? Math.round((1 - p.price / p.listPrice) * 100) : 0;
  const etichetta = "absolute top-3 px-2.5 py-1 text-xs uppercase tracking-[0.2em]";
  return (
    <Link href={`/shop/${p.slug}`} className="group block">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-line bg-paper-2 transition-colors duration-500 group-hover:border-gold/50">
        {cover ? (
          <Image src={cover} alt={`${p.brand} ${p.name}`} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-105">
            <WatchPlaceholder />
          </div>
        )}
        {p.sold ? (
          <span className={`${etichetta} left-3 bg-fg text-paper`}>Venduto</span>
        ) : f.etichettaCorredo ? (
          <span className={`${etichetta} left-3 bg-paper/95 text-fg`}>{f.etichettaCorredo}</span>
        ) : null}
        {!p.sold && sconto > 0 ? (
          <span className={`${etichetta} right-3 bg-green text-cream`}>−{sconto}%</span>
        ) : p.spin ? (
          <span className={`${etichetta} right-3 bg-paper/95 text-fg`}>360°</span>
        ) : null}
      </div>
      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-mute">{[p.brand, p.year].filter(Boolean).join(" · ")}</p>
        <h3 className="mt-1 font-display text-3xl leading-tight">{p.name}</h3>
        {specifiche && <p className="mt-1.5 text-sm text-fg/70">{specifiche}</p>}
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 border-t border-line pt-3">
          <span className={`${p.price === null ? "font-display text-xl" : "tag-mono text-2xl"} ${p.sold ? "text-mute" : "text-green"}`}>{formatPrice(p.price)}</span>
          {!p.sold && p.listPrice != null && <s className="tag-mono text-xs text-mute">{formatPrice(p.listPrice)}</s>}
        </p>
        {!p.sold && f.riga && <p className="mt-2 text-xs text-green">✓ {f.riga}</p>}
      </div>
    </Link>
  );
}
