import type { Metadata } from "next";
import { site } from "@/data/site";
import { services } from "@/data/services";
import { brands } from "@/data/brands";

export const OG_IMAGE = { url: "/og-image.png", width: 1200, height: 630, alt: "Roberto Landi Lab Watches – Restauro e riparazione orologi di lusso a Pistoia" };

/** Metadati di pagina con URL canonico e anteprima social coerenti */
export function pageMeta({ title, description, path, noindex = false }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website", locale: "it_IT", siteName: site.name, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path === "/" ? "" : it.path}`,
    })),
  };
}

/** Scheda dell'attività per Google (ricerca locale e Maps) */
export const localBusinessLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${site.url}/#business`,
  name: site.name,
  alternateName: [site.shortName, "Roberto Landi orologiaio"],
  description: site.description,
  url: site.url,
  email: site.email,
  telephone: site.phone.replace(/\s/g, ""),
  image: [`${site.url}/images/roberto-landi-orologiaio-al-lavoro.jpg`, `${site.url}/og-image.png`],
  logo: `${site.url}/brand/RL-completo-metallo.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: site.address.province,
    postalCode: site.address.zip,
    addressCountry: "IT",
  },
  openingHoursSpecification: site.hours
    .filter((h) => "schema" in h)
    .map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.schema!.days, opens: h.schema!.opens, closes: h.schema!.closes })),
  areaServed: [{ "@type": "City", name: "Pistoia" }, { "@type": "Country", name: "Italia" }],
  founder: { "@type": "Person", name: site.owner, jobTitle: "Artigiano orologiaio" },
  knowsAbout: ["Restauro orologi di lusso", "Riparazione orologi", ...brands.map((b) => `Orologi ${b.name}`)],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Servizi di orologeria",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.title, description: s.text, url: `${site.url}/servizi#${s.slug}` },
    })),
  },
  sameAs: Object.values(site.social),
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  inLanguage: "it-IT",
  publisher: { "@id": `${site.url}/#business` },
};
