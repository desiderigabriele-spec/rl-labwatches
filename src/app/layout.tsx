import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";
import { site } from "@/data/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} – Restauro e riparazione orologi a Pistoia`, template: `%s · ${site.name}` },
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
    <html lang="it" className={`${cormorant.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="grain min-h-dvh flex flex-col">
        {/* salta l'intro se già vista in questa sessione (prima del render, senza sfarfallio) */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("rl-intro"))document.documentElement.dataset.intro="seen"}catch(e){}` }} />
        <IntroSplash />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
