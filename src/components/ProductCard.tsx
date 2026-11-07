import Image from "next/image";
import Link from "next/link";
import { formatPrice, spinFrames, type Product } from "@/data/products";

export function WatchPlaceholder() {
  return (
    <svg viewBox="0 0 200 200" className="h-2/3 w-2/3 text-gold/40" aria-hidden>
      <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="100" cy="100" r="52" fill="none" stroke="currentColor" strokeWidth="0.5" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={100 + Math.sin(a) * 44} y1={100 - Math.cos(a) * 44} x2={100 + Math.sin(a) * 50} y2={100 - Math.cos(a) * 50} stroke="currentColor" strokeWidth="1.5" />;
      })}
      <line x1="100" y1="100" x2="100" y2="68" stroke="currentColor" strokeWidth="2" />
      <line x1="100" y1="100" x2="124" y2="112" stroke="currentColor" strokeWidth="1.5" />
      <rect x="92" y="10" width="16" height="28" rx="3" fill="none" stroke="currentColor" />
      <rect x="92" y="162" width="16" height="28" rx="3" fill="none" stroke="currentColor" />
    </svg>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const cover = product.image ?? spinFrames(product)[0];
  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-line bg-paper-2 transition-colors duration-500 group-hover:border-gold/50">
        {cover ? (
          <Image src={cover} alt={`${product.brand} ${product.name}`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center transition-transform duration-700 group-hover:scale-105">
            <WatchPlaceholder />
          </div>
        )}
        {product.spin && (
          <span className="absolute right-4 top-4 bg-paper/90 px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-fg">360°</span>
        )}
        {product.sold && <span className="absolute left-4 top-4 bg-fg px-3 py-1 text-[0.65rem] uppercase tracking-[0.2em] text-paper">Venduto</span>}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-mute">{product.brand} · {product.year}</p>
          <h3 className="mt-1 font-display text-2xl">{product.name}</h3>
        </div>
        <p className="shrink-0 pt-1 text-sm text-gold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
