import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, IBM_Plex_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Chat from "@/components/Chat";
import ReadingBezel from "@/components/ReadingBezel";
import SmoothScroll from "@/components/SmoothScroll";
import NavDirection from "@/components/NavDirection";
import OffscreenPause from "@/components/OffscreenPause";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import Consent from "@/components/Consent";
import ContatoreVisite from "@/components/ContatoreVisite";
import { localBusinessLd, OG_IMAGE, websiteLd } from "@/lib/seo";
import { site } from "@/data/site";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
// carattere delle etichette piccole: non serve per il primo disegno, quindi niente precaricamento
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", preload: false });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-montserrat" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Roberto Landi: Artigiano Orologi di Lusso a Pistoia | RL Lab Watches", template: "%s | Roberto Landi" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  formatDetection: { telephone: false },
  openGraph: { type: "website", locale: "it_IT", siteName: site.name, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  // verifica del dominio per Facebook/Meta, ripresa dal vecchio sito Wix (senza, il dominio risulta non verificato)
  verification: { other: { "facebook-domain-verification": "qtqe9cpgkwlon0ykwszunirfqg6n84" } },
};

// viewport-fit=cover: la barra in basso arriva fino al bordo dello schermo (iPhone)
export const viewport: Viewport = { themeColor: "#003d27", viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" data-scroll-behavior="smooth" className={`${cormorant.variable} ${montserrat.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <body className="grain min-h-dvh flex flex-col">
        <ContatoreVisite />
        <JsonLd data={localBusinessLd} />
        <JsonLd data={websiteLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Chat />
        <ReadingBezel />
        <SmoothScroll />
        <NavDirection />
        <OffscreenPause />
        <Consent />
        {/* statistiche di Vercel: senza cookie né dati personali, quindi fuori dal banner del consenso */}
        <Analytics />
      </body>
    </html>
  );
}
