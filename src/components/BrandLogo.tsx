import { brands } from "@/data/brands";

type Brand = (typeof brands)[number];

/**
 * Logo di una marca, colorato con il colore del testo (currentColor):
 * così può essere scuro su fondo chiaro, chiaro su fondo scuro, oro al passaggio del mouse.
 */
export default function BrandLogo({ brand, className = "h-12" }: { brand: Brand; className?: string }) {
  const mask = `url(${brand.logo}) center / contain no-repeat`;
  return (
    <span
      role="img"
      aria-label={brand.name}
      className={`inline-block bg-current ${className}`}
      style={{ aspectRatio: `${brand.ratio}`, mask, WebkitMask: mask }}
    />
  );
}
