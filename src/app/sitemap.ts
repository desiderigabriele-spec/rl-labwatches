import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { getCatalogo } from "@/data/catalogo";
import { brands } from "@/data/brands";

export const revalidate = 3600;

/**
 * Data dell'ultima modifica vera di ogni pagina: aggiornala quando cambi il contenuto di una pagina
 * (una data sempre uguale a "oggi" Google la ignora).
 */
const MODIFICATA: Record<string, string> = {
  "": "2026-11-26",
  "/servizi": "2026-11-26",
  "/marche": "2026-11-26",
  "/preventivo": "2026-11-26",
  "/contatti": "2026-11-26",
  "/chi-sono": "2026-11-26",
  "/faq": "2026-11-26",
  "/spedizioni-e-consegna": "2026-11-21",
  "/privacy": "2026-11-21",
  "/termini-di-servizio": "2026-11-21",
  "/cookie": "2026-11-26",
  "/note-legali": "2026-11-26",
  "/shop": "2026-11-26",
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { products, reale } = await getCatalogo();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: new Date(MODIFICATA[path] ?? MODIFICATA["/shop"]),
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "weekly"),
    page("/servizi", 0.9),
    page("/marche", 0.8),
    page("/preventivo", 0.8),
    page("/contatti", 0.8),
    page("/chi-sono", 0.7),
    page("/faq", 0.7),
    page("/spedizioni-e-consegna", 0.4, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/termini-di-servizio", 0.2, "yearly"),
    page("/cookie", 0.2, "yearly"),
    page("/note-legali", 0.2, "yearly"),
    ...(reale ? [page("/shop", 0.8, "weekly"), ...brands
          .filter((b) => products.some((p) => p.brand.toLowerCase() === b.name.toLowerCase()))
          .map((b) => page(`/shop/marca/${b.slug}`, 0.7, "weekly")), ...products.map((p) => page(`/shop/${p.slug}`, 0.6, "weekly"))] : []),
  ];
}
