import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { products, SHOP_READY } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
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
    ...(SHOP_READY ? [page("/shop", 0.8, "weekly"), ...products.map((p) => page(`/shop/${p.slug}`, 0.6, "weekly"))] : []),
  ];
}
