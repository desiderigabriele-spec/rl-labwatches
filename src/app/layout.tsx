import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/data/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} · ${site.owner} – Orologiaio a Pistoia`, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { type: "website", locale: "it_IT", siteName: site.name },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  founder: site.owner,
  description: site.description,
  email: site.email,
  url: site.url,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    postalCode: site.address.zip,
    addressCountry: "IT",
  },
  sameAs: Object.values(site.social),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="grain min-h-dvh flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
