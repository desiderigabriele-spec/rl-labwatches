// Dati del laboratorio. Modifica qui: si aggiornano in tutto il sito.
export const site = {
  name: "RL Lab Watches",
  owner: "Roberto Landi",
  tagline: "Restauro e riparazione di orologi di lusso",
  description:
    "Roberto Landi, artigiano orologiaio a Pistoia: restauro, revisione e riparazione di orologi meccanici e di lusso.",
  url: "https://www.rl-labwatches.it",
  email: "rlabwatches@gmail.com",
  phone: "" as string, // TODO: inserire numero di telefono
  address: {
    street: "Via Padre Giovanni Antonelli, 69",
    city: "Pistoia",
    zip: "51100",
    country: "Italia",
  },
  hours: [
    // TODO: verificare gli orari reali
    { days: "Lun – Ven", time: "9:00 – 13:00 · 15:00 – 19:00" },
    { days: "Sab", time: "Su appuntamento" },
  ],
  social: {
    instagram: "https://www.instagram.com/rl_labwatches/",
    facebook: "https://www.facebook.com/robertolandi.labwatches/",
  },
} as const;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/servizi", label: "Servizi" },
  { href: "/shop", label: "Shop" },
  { href: "/chi-siamo", label: "Chi siamo" },
  { href: "/contatti", label: "Contatti" },
] as const;
