// Dati del laboratorio (dal vecchio sito rl-labwatches.it). Modifica qui: si aggiornano in tutto il sito.
export const site = {
  name: "Roberto Landi Lab Watches",
  shortName: "RL Lab Watches",
  owner: "Roberto Landi",
  tagline: "Artigiano di orologi di lusso a Pistoia",
  description:
    "Roberto Landi, artigiano di orologi di lusso a Pistoia: restauro, revisione e riparazione di Rolex, Patek Philippe, Audemars Piguet, Omega e altri grandi marchi. Spedizione sicura in tutto il mondo.",
  url: "https://www.rl-labwatches.it",
  email: "rlabwatches@gmail.com",
  phone: "+39 328 772 5925",
  whatsapp: "393287725925",
  address: {
    street: "Via Padre Giovanni Antonelli, 69",
    city: "Pistoia",
    province: "PT",
    zip: "51100",
    region: "Toscana",
    country: "Italia",
  },
  // Orari della home del vecchio sito (la pagina Contatti riportava orari diversi: da confermare)
  hours: [
    { days: "Lunedì – Venerdì", time: "9:00 – 18:00", schema: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" } },
    { days: "Sabato", time: "Chiuso" },
    { days: "Domenica", time: "Chiuso" },
  ],
  social: {
    instagram: "https://www.instagram.com/rl_labwatches/",
    facebook: "https://www.facebook.com/robertolandi.labwatches",
  },
  instagramHandle: "@rl_labwatches",
  // Partita IVA: per legge va indicata sul sito di un'attività. Inseriscila qui (es. "01234567890").
  vat: "" as string,
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const nav = [
  { href: "/", label: "Home" },
  { href: "/servizi", label: "Servizi" },
  { href: "/marche", label: "Marche" },
  { href: "/shop", label: "Orologi" },
  { href: "/chi-sono", label: "Chi sono" },
  { href: "/faq", label: "FAQ" },
  { href: "/contatti", label: "Contatti" },
] as const;

export const legalNav = [
  { href: "/privacy", label: "Informativa sulla Privacy" },
  { href: "/termini-di-servizio", label: "Termini di Servizio" },
  { href: "/cookie", label: "Informativa sui Cookie" },
  { href: "/note-legali", label: "Note legali" },
  { href: "/spedizioni-e-consegna", label: "Spedizioni e Consegna" },
] as const;
