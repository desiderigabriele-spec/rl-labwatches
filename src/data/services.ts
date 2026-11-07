// Servizi: testi del vecchio sito (Roberto parla in prima persona), foto dal laboratorio.
export type Service = { slug: string; title: string; text: string; image: string; alt: string };

export const services: Service[] = [
  {
    slug: "revisione-completa",
    title: "Revisione Completa",
    text: "Dalla pulizia in profondità alla lubrificazione, il mio servizio di revisione è il controllo medico che il tuo orologio di lusso merita per funzionare in modo ottimale.",
    image: "/images/revisione-completa-movimento-rolex-daytona.jpg",
    alt: "Movimento di un Rolex Daytona in oro aperto sul banco durante la revisione completa",
  },
  {
    slug: "restauro-estetico",
    title: "Restauro Estetico Completo",
    text: "Rivitalizza il tuo orologio di lusso con un restauro globale. Grazie alla mia lucidatura di alta qualità e alla satinatura di precisione, non solo elimino impurità, ma ripristino brillantezza e finitura originale, rispettando le giuste bisellature, planarità e ortogonalità del tuo prezioso segnatempo. Un vero ringiovanimento che esalta la bellezza autentica del tuo orologio, preservando le sue caratteristiche uniche.",
    image: "/images/restauro-estetico-rolex-daytona.jpg",
    alt: "Rolex Daytona in acciaio e oro smontato in tutti i suoi componenti per il restauro estetico completo",
  },
  {
    slug: "sostituzione-vetro",
    title: "Sostituzione del Vetro",
    text: "Un vetro scheggiato o graffiato non è solo antiestetico, può anche compromettere il funzionamento del tuo orologio. La mia sostituzione di vetro garantisce il corretto funzionamento del tuo orologio e ne mantiene l'estetica.",
    image: "/images/sostituzione-vetro-rolex-explorer-prima-dopo.jpg",
    alt: "Rolex Explorer II prima e dopo la sostituzione del vetro rotto",
  },
  {
    slug: "verifica-autenticita",
    title: "Verifica d'Autenticità",
    text: "Con la mia competenza, ti offro la tranquillità di avere un orologio autentico, confermato da un certificato di autenticità ufficiale.",
    image: "/images/verifica-autenticita-orologio.jpg",
    alt: "Analisi al microscopio digitale di un orologio per la verifica d'autenticità",
  },
  {
    slug: "prova-impermeabilita",
    title: "Prova di Impermeabilità",
    text: "Garantisco l'impermeabilità del tuo orologio con un test approfondito, perché anche il più piccolo dettaglio conta.",
    image: "/images/prova-impermeabilita-orologio.jpg",
    alt: "Orologio Rolex in oro immerso durante la prova di impermeabilità",
  },
  {
    slug: "ricambi",
    title: "Fornitura e Personalizzazione di Ricambi",
    text: "Grazie alla mia rete di contatti pluriennale, fornisco una vasta gamma di ricambi autentici e personalizzazioni, garantendoti un servizio su misura.",
    image: "/images/ricambi-quadrante-madreperla-rolex-datejust.jpg",
    alt: "Quadrante in madreperla con indici in diamanti per Rolex Datejust",
  },
  {
    slug: "saldatura-artigianale",
    title: "Saldatura Artigianale",
    text: "Riporto i tuoi preziosi alla loro antica gloria attraverso un delicato processo di saldatura artigianale.",
    image: "/images/saldatura-artigianale-bracciale.jpg",
    alt: "Saldatura artigianale a fiamma su un bracciale d'oro",
  },
  {
    slug: "rimagliatura-bracciale",
    title: "Rimagliatura del Bracciale",
    text: "Restituisci al bracciale del tuo orologio la sua forma e funzione originali grazie al mio servizio di rimagliatura di precisione.",
    image: "/images/rimagliatura-bracciale-orologio.jpg",
    alt: "Maglie e perni di un bracciale Rolex sul banco durante la rimagliatura",
  },
  {
    slug: "consegna-e-ritiro",
    title: "Servizio di Consegna e Ritiro Sicuro",
    text: "Offro un servizio di consegna e ritiro sicuro e garantito a livello globale. Collaboro con corrieri di fiducia, come UPS e Ferrari, e con servizi di portavalori per assicurare che il tuo prezioso orologio arrivi nelle condizioni ottimali. La tua tranquillità è la mia priorità.",
    image: "/images/spedizione-sicura-portavalori.jpg",
    alt: "Furgone portavalori per la spedizione sicura degli orologi",
  },
];
