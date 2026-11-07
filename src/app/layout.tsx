import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroSplash from "@/components/IntroSplash";
import WhatsAppButton from "@/components/WhatsAppButton";
import SmoothScroll from "@/components/SmoothScroll";
import JsonLd from "@/components/JsonLd";
import { localBusinessLd, OG_IMAGE, websiteLd } from "@/lib/seo";
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
  title: { default: "Roberto Landi: Artigiano Orologi di Lusso a Pistoia | RL Lab Watches", template: "%s | Roberto Landi" },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.owner }],
  formatDetection: { telephone: false },
  openGraph: { type: "website", locale: "it_IT", siteName: site.name, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
};

export const viewport: Viewport = { themeColor: "#003d27" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" className={`${cormorant.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <body className="grain min-h-dvh flex flex-col">
        {/* salta l'intro se già vista in questa sessione (prima del render, senza sfarfallio) */}
        <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("rl-intro"))document.documentElement.dataset.intro="seen"}catch(e){}` }} />
        <IntroSplash />
        <JsonLd data={localBusinessLd} />
        <JsonLd data={websiteLd} />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <SmoothScroll />
      </body>
    </html>
  );
}
