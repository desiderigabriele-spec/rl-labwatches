/**
 * Recensioni vere dalla scheda Google di RL Lab Watches, riportate parola per parola
 * (nome abbreviato per riservatezza). `highlight` è un pezzo del testo da mettere in evidenza.
 * Per aggiungerne una: copiala identica da Google Maps e incollala qui.
 */
export const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/qrq24mU3pkPwHcth6";

export type Review = {
  author: string;
  initial: string;
  color: string;
  localGuide?: boolean;
  text: string;
  highlight?: string;
  reply?: string;
};

export const reviews: Review[] = [
  {
    author: "Nicola M.",
    initial: "N",
    color: "#5b6b7a",
    localGuide: true,
    text: "Ottimo artigiano dalle mani d'oro! Roberto, il titolare, lavora con passione e professionalità ed è in grado di riportare a nuova vita gli orologi segnati dal tempo. 5 stelle assolutamente meritate!",
    highlight: "Ottimo artigiano dalle mani d'oro!",
  },
  {
    author: "Franco",
    initial: "F",
    color: "#2f6f9f",
    localGuide: true,
    text: "Ho affidato loro il mio Bulova Accutron, sono rimasto molto colpito dalla loro professionalita'. La prossima settimana mi verra' riconsegnato l'orologio completamente revisionato dal punto di vista estetico. Sono della provincia di Bologna e sono venuto qui a Pistoia da RL LAB Watches leggendo le innumerevoli recensioni positive. Consiglio!",
    highlight: "Sono della provincia di Bologna e sono venuto qui a Pistoia",
  },
  {
    author: "Matteo L.",
    initial: "M",
    color: "#3f7d4f",
    text: "Sono scettico di natura, ma posso solo che ringraziare per il mio incontro con Roberto. Lavoro eccellente, veloce e fatto da un professionista che ama il suo lavoro. Provare per credere. Grande Roberto, continua così!",
    highlight: "Provare per credere.",
    reply: "Grazie mille Matteo! Sapere di essere riuscito a conquistare la tua fiducia è motivo di grande orgoglio.",
  },
  {
    author: "Emiliano D.",
    initial: "E",
    color: "#d0386b",
    text: "Mi sono recato nel laboratorio di Roberto per l'acquisto di un'orologio sub vintage,mi sono trovato benissimo,ragazzo molto preparato e disponibile,si vede e si sente che svolge il proprio lavoro con passione,tanto che subito dopo poco tempo ne ho acquistato un'altro!!!! Raccomando vivamente!!!",
    highlight: "tanto che subito dopo poco tempo ne ho acquistato un'altro!!!!",
  },
  {
    author: "Leonardo R.",
    initial: "L",
    color: "#c2410c",
    text: "Mi sono trovato benissimo con il mio orologio. Professionista come pochi in giro. Consigliatissimo.",
    highlight: "Professionista come pochi in giro.",
  },
  {
    author: "Samuele N.",
    initial: "S",
    color: "#9b3fc0",
    localGuide: true,
    text: "Primo impatto molto positivo! Titolare competente e molto disponibile.",
    highlight: "Titolare competente e molto disponibile.",
  },
  {
    author: "Giadina M.",
    initial: "G",
    color: "#6b8f3a",
    text: "Affidabile super preciso e puntuale!",
    highlight: "Affidabile super preciso e puntuale!",
  },
];
