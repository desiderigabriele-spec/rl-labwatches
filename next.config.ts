import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vecchi indirizzi del sito Wix → nuove pagine (mantiene SEO e link esistenti)
  async redirects() {
    return [
      { source: "/blank-7", destination: "/contatti", permanent: true },
      { source: "/informativa-sulla-privacy", destination: "/privacy", permanent: true },
      { source: "/copia-di-informativa-sulla-privacy", destination: "/termini", permanent: true },
    ];
  },
};

export default nextConfig;
