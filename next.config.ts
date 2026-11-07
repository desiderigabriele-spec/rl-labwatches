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
  async redirects() {
    return wixRedirects.map(([source, destination]) => ({ source, destination, statusCode: 301 }));
  },
};

export default nextConfig;
