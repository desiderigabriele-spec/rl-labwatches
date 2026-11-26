import type { NextConfig } from "next";

/**
 * Vecchi indirizzi del sito Wix → nuove pagine, con redirect 301 (permanente):
 * Google trasferisce il posizionamento ai nuovi URL e i link esistenti continuano a funzionare.
 */
const wixRedirects: [string, string][] = [
  ["/about-5", "/chi-sono"],
  ["/blank-3", "/faq"],
  ["/blank-5", "/marche"],
  ["/blank-7", "/contatti"],
  ["/blank-8", "/preventivo"],
  ["/informativa-sulla-privacy", "/privacy"],
  ["/copia-di-informativa-sulla-privacy", "/termini-di-servizio"],
  ["/copia-di-informativa-sulla-privacy-1", "/cookie"],
  ["/copia-di-termini-di-servizio", "/spedizioni-e-consegna"],
  ["/copia-di-spedizioni-e-consegna", "/note-legali"],
  // percorsi delle prime versioni di questo sito
  ["/chi-siamo", "/chi-sono"],
  ["/termini", "/termini-di-servizio"],
];

const nextConfig: NextConfig = {
  // foto degli orologi caricate da Roberto nell'area clienti di Desideri&Code
  images: { remotePatterns: [{ protocol: "https", hostname: "newyirfmizuskwhqtzuw.supabase.co", pathname: "/storage/v1/object/public/vetrine/**" }] },
  // immagini e modelli in /public: una settimana di cache nel browser e sulla CDN (se un file cambia con lo stesso
  // nome, al massimo per qualche giorno qualcuno vede ancora quello vecchio)
  async headers() {
    const cache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
    return ["/images/:p*", "/lavori/:p*", "/vetrina/:p*", "/marche/:p*", "/models/:p*", "/brand/:p*", "/vendi/:p*", "/orologi/:p*", "/draco/:p*"].map(
      (source) => ({ source, headers: cache })
    );
  },
  async redirects() {
    return wixRedirects.map(([source, destination]) => ({ source, destination, statusCode: 301 }));
  },
};

export default nextConfig;
