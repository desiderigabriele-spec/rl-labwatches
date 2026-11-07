import type { MetadataRoute } from "next";
import { site } from "@/data/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/servizi", "/shop", "/chi-siamo", "/contatti"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, lastModified: new Date() })),
    ...products.map((p) => ({ url: `${site.url}/shop/${p.slug}`, lastModified: new Date() })),
  ];
}
