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
  // Dati fiscali della ditta individuale (obbligatori sul sito di un'attività): piè di pagina, note legali, dati per Google
  vat: "02060070477" as string,
  fiscal: {
    holder: "Landi Roberto",
    seat: "Via Boccaccini 139, 51100 Pistoia (PT)",
    taxCode: "LNDRRT85T16G713X",
    rea: "PO 612053",
  },
} as const;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

// Menu principale: le due attività prima, poi chi è Roberto e i contatti. Marche e FAQ stanno dentro il restauro
// (`also`: pagine che accendono la voce) e nel piè di pagina; la home si raggiunge dal logo.
export const nav: readonly { href: string; label: string; also?: readonly string[] }[] = [
  { href: "/servizi", label: "Restauro", also: ["/marche", "/faq"] },
  { href: "/shop", label: "Compravendita" },
  { href: "/chi-sono", label: "Chi sono" },
  { href: "/contatti", label: "Contatti" },
];

/** tutte le pagine, per il piè di pagina e il menu da telefono */
export const siteMap = [
  { href: "/", label: "Home" },
  { href: "/servizi", label: "Restauro e servizi" },
  { href: "/marche", label: "Marche" },
  { href: "/shop", label: "Compravendita" },
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
