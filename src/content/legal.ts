// Testi legali.
// - privacy e cookie: riscritti per il nuovo sito (niente Analytics/Ads, hosting Vercel, modulo via email).
//   BOZZA da far verificare a un consulente prima della pubblicazione definitiva.
// - termini, note legali, spedizioni: testi del vecchio sito, con il dominio corretto.
export type LegalBlock = ["h" | "p" | "note", string];
export type LegalPage = { title: string; blocks: LegalBlock[] };

export const legal = {
  "privacy": {
    "title": "Informativa sulla Privacy",
    "blocks": [
      [
        "h",
        "1. Titolare del trattamento"
      ],
      [
        "p",
        "Il titolare del trattamento dei dati personali raccolti tramite il sito www.rl-labwatches.it (di seguito il \"Sito\") è Roberto Landi, Via Padre Giovanni Antonelli 69, 51100 Pistoia (PT), Italia – email rlabwatches@gmail.com – tel. +39 328 772 5925."
      ],
      [
        "h",
        "2. Dati raccolti"
      ],
      [
        "p",
        "Dati forniti volontariamente: quando compili il modulo di contatto o di richiesta preventivo raccogliamo nome, indirizzo email, numero di telefono (facoltativo), marca e modello dell'orologio e il contenuto del messaggio. Se ci scrivi via email, telefono o WhatsApp tratteremo i dati che ci comunichi in quel canale."
      ],
      [
        "p",
        "Dati di navigazione: i server che ospitano il Sito registrano automaticamente dati tecnici necessari al suo funzionamento e alla sua sicurezza (ad esempio indirizzo IP, tipo di browser, pagine richieste, data e ora). Questi dati non sono usati per identificarti né per profilazione."
      ],
      [
        "p",
        "Il Sito non utilizza strumenti di analisi statistica, pubblicità o profilazione (come Google Analytics, Google Ads o Facebook Ads)."
      ],
      [
        "h",
        "3. Finalità e base giuridica"
      ],
      [
        "p",
        "I dati del modulo e delle comunicazioni sono trattati per rispondere alle tue richieste, preparare preventivi e gestire i servizi richiesti (esecuzione di misure precontrattuali e contrattuali, art. 6.1.b GDPR) e per adempiere agli obblighi di legge, ad esempio fiscali (art. 6.1.c GDPR). I dati di navigazione sono trattati per garantire il funzionamento e la sicurezza del Sito (legittimo interesse, art. 6.1.f GDPR)."
      ],
      [
        "p",
        "Il conferimento dei dati contrassegnati come obbligatori nel modulo è necessario per poterti rispondere."
      ],
      [
        "h",
        "4. Destinatari dei dati"
      ],
      [
        "p",
        "I dati non sono venduti né ceduti a terzi. Possono essere trattati, solo per le finalità indicate, da fornitori che ci supportano in qualità di responsabili del trattamento: Vercel Inc. (hosting del Sito) e Resend (invio via email dei messaggi del modulo). Se scegli di contattarci tramite WhatsApp, i dati sono trattati anche da WhatsApp/Meta secondo le loro condizioni."
      ],
      [
        "h",
        "5. Trasferimento dei dati fuori dall'Unione Europea"
      ],
      [
        "p",
        "Alcuni fornitori possono trattare dati negli Stati Uniti. In tal caso il trasferimento avviene sulla base del Data Privacy Framework UE-USA o delle Clausole Contrattuali Standard approvate dalla Commissione Europea."
      ],
      [
        "h",
        "6. Conservazione"
      ],
      [
        "p",
        "I dati delle richieste sono conservati per il tempo necessario a gestirle e, se diventi cliente, per la durata del rapporto e per i tempi previsti dalla legge (ad esempio 10 anni per i documenti fiscali). Le richieste a cui non segue un servizio sono cancellate entro 24 mesi."
      ],
      [
        "h",
        "7. I tuoi diritti"
      ],
      [
        "p",
        "Puoi chiedere in qualsiasi momento l'accesso ai tuoi dati, la rettifica, la cancellazione, la limitazione del trattamento, la portabilità e opporti al trattamento (artt. 15-22 GDPR), scrivendo a rlabwatches@gmail.com. Hai inoltre il diritto di proporre reclamo al Garante per la protezione dei dati personali (www.garanteprivacy.it)."
      ],
      [
        "h",
        "8. Modifiche"
      ],
      [
        "p",
        "Questa informativa può essere aggiornata; la versione in vigore è sempre pubblicata su questa pagina."
      ],
      [
        "note",
        "Ultimo aggiornamento: 07/11/2026"
      ]
    ]
  },
  "termini": {
    "title": "Termini di Servizio",
    "blocks": [
      [
        "p",
        "Benvenuto su www.rl-labwatches.it. Questo sito è di proprietà e gestito da Roberto Landi. I seguenti termini e condizioni regolano l'utilizzo del nostro sito web e l'accesso ai servizi che offriamo."
      ],
      [
        "p",
        "Leggi attentamente questi termini prima di utilizzare il sito web. Utilizzando il sito, accetti di essere vincolato da questi termini. Se non sei d'accordo con questi termini, ti preghiamo di non utilizzare il nostro sito."
      ],
      [
        "h",
        "1. Servizi"
      ],
      [
        "p",
        "Roberto Landi fornisce servizi di restauro e riparazione di orologi di lusso. I servizi includono, ma non si limitano a: restauro estetico completo, fornitura e personalizzazione di ricambi, verifica d'autenticità, saldatura artigianale, sostituzione del vetro, revisione completa, servizi di spedizione e test di impermeabilità."
      ],
      [
        "h",
        "2. Prenotazioni"
      ],
      [
        "p",
        "Le richieste possono essere inviate tramite il modulo del sito web, per telefono, e-mail o WhatsApp. Forniremo una conferma della tua prenotazione via e-mail."
      ],
      [
        "h",
        "3. Spedizioni"
      ],
      [
        "p",
        "Utilizziamo i servizi di UPS, Ferrari e portavalori per le consegne. Le spese di spedizione saranno comunicate al momento della prenotazione."
      ],
      [
        "h",
        "4. Privacy"
      ],
      [
        "p",
        "La tua privacy è importante per noi. Consulta la nostra Informativa sulla Privacy per comprendere come raccogliamo, usiamo e proteggiamo le tue informazioni personali."
      ],
      [
        "h",
        "5. Limitazioni di responsabilità"
      ],
      [
        "p",
        "Non siamo responsabili per eventuali danni o perdite che possono verificarsi durante il trasporto degli orologi."
      ],
      [
        "h",
        "6. Modifiche ai Termini di Servizio"
      ],
      [
        "p",
        "Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. Le modifiche avranno effetto immediatamente dopo la loro pubblicazione sul sito web."
      ],
      [
        "h",
        "7. Contatto"
      ],
      [
        "p",
        "Per qualsiasi domanda o preoccupazione riguardo a questi termini, ti preghiamo di contattarci all'indirizzo email rlabwatches@gmail.com."
      ],
      [
        "h",
        "8. Legge applicabile"
      ],
      [
        "p",
        "Questi Termini di Servizio sono regolati e interpretati in conformità con le leggi italiane. Eventuali controversie saranno sottoposte alla giurisdizione esclusiva dei tribunali italiani."
      ],
      [
        "p",
        "Utilizzando il nostro sito web, accetti di rispettare i suddetti Termini di Servizio."
      ],
      [
        "note",
        "Data di ultimo aggiornamento: 07/11/2026"
      ]
    ]
  },
  "cookie": {
    "title": "Informativa sui Cookie",
    "blocks": [
      [
        "h",
        "1. Cosa sono i cookie"
      ],
      [
        "p",
        "I cookie sono piccoli file di testo che i siti visitati salvano sul dispositivo dell'utente per essere riletti nelle visite successive. Tecnologie simili permettono di memorizzare informazioni nel browser."
      ],
      [
        "h",
        "2. Cookie utilizzati da questo Sito"
      ],
      [
        "p",
        "Il sito www.rl-labwatches.it non utilizza cookie di profilazione, cookie pubblicitari né cookie di analisi statistica di terze parti. Per questo motivo non viene mostrato alcun banner per la raccolta del consenso."
      ],
      [
        "p",
        "Il Sito usa esclusivamente una memoria tecnica del browser (sessionStorage) per ricordare, durante la sola sessione di navigazione, che l'animazione introduttiva è già stata mostrata. Questa informazione non contiene dati personali, non viene inviata ai nostri server e si cancella alla chiusura della scheda del browser. I caratteri tipografici sono serviti direttamente dal Sito, senza collegamenti a servizi esterni."
      ],
      [
        "h",
        "3. Collegamenti a siti di terze parti"
      ],
      [
        "p",
        "Il Sito contiene semplici collegamenti a Instagram, Facebook, WhatsApp e Google Maps. Questi servizi possono installare propri cookie solo se scegli di aprire i collegamenti; in quel caso si applicano le rispettive informative."
      ],
      [
        "h",
        "4. Come gestire i cookie"
      ],
      [
        "p",
        "Puoi in ogni momento cancellare o bloccare cookie e dati dei siti dalle impostazioni del tuo browser (ad esempio Chrome, Safari, Firefox o Edge). Il blocco della memoria tecnica descritta sopra non impedisce l'uso del Sito."
      ],
      [
        "h",
        "5. Titolare del trattamento"
      ],
      [
        "p",
        "Il titolare del trattamento è Roberto Landi, Via Padre Giovanni Antonelli 69, 51100 Pistoia (PT), Italia – email rlabwatches@gmail.com – tel. +39 328 772 5925. Per maggiori informazioni consulta l'Informativa sulla Privacy."
      ],
      [
        "note",
        "Ultimo aggiornamento: 07/11/2026"
      ]
    ]
  },
  "spedizioni": {
    "title": "Spedizioni e Consegna",
    "blocks": [
      [
        "h",
        "Politica di Spedizione e Consegna"
      ],
      [
        "h",
        "Spedizione e Consegna"
      ],
      [
        "p",
        "Il servizio di spedizione e consegna di Roberto Landi è progettato per offrirti comodità, sicurezza e tranquillità. Utilizziamo solo servizi di corrieri di alto livello come UPS, Ferrari, o portavalori specializzati per assicurarci che il tuo prezioso orologio arrivi a destinazione in perfette condizioni e in modo sicuro."
      ],
      [
        "h",
        "Modalità di Spedizione"
      ],
      [
        "p",
        "Le spedizioni sono effettuate a livello globale e includono sia la consegna che la ricezione dei tuoi orologi di lusso. Le modalità di spedizione e i tempi di consegna possono variare in base alla località e al corriere scelto."
      ],
      [
        "h",
        "Tracciamento della Spedizione"
      ],
      [
        "p",
        "Una volta che il tuo orologio viene spedito, riceverai una notifica con un codice di tracciamento unico. Puoi utilizzare questo codice per monitorare la posizione e lo stato della spedizione in tempo reale."
      ],
      [
        "h",
        "Politica di Ritiro"
      ],
      [
        "h",
        "Ritiro su Appuntamento"
      ],
      [
        "p",
        "La consegna e la ricezione degli orologi avviene tramite appuntamento. Puoi prenotare un appuntamento attraverso il sito web, via email, telefono o WhatsApp."
      ],
      [
        "p",
        "Si prega di notare che questa politica di spedizione e ritiro può essere soggetta a modifiche. Consigliamo di visitare questa pagina periodicamente per rimanere aggiornati sulle nostre ultime politiche e procedure di spedizione e consegna."
      ],
      [
        "p",
        "Se hai domande o dubbi sulla nostra politica di spedizione e consegna, non esitare a contattarci. Siamo qui per aiutarti."
      ]
    ]
  },
  "noteLegali": {
    "title": "Note legali",
    "blocks": [
      [
        "p",
        "Questo sito web è di proprietà e gestito da Roberto Landi (\"noi\", \"nostro\" o \"ci\"). L'uso di www.rl-labwatches.it (\"sito web\") è soggetto al seguente disclaimer."
      ],
      [
        "p",
        "Le informazioni contenute in questo sito web sono fornite al solo scopo di fornire informazioni generali sulle attività di restauro e riparazione di orologi di lusso. Sebbene ci impegniamo a garantire che le informazioni fornite sul nostro sito web siano accurate, non dichiariamo né garantiamo, esplicitamente o implicitamente, l'esattezza, l'affidabilità o l'integralità delle tali informazioni."
      ],
      [
        "p",
        "Non assumiamo alcuna responsabilità per errori o omissioni nel contenuto di questo sito web o per eventuali danni, perdite o infortuni risultanti dall'uso o dalla dipendenza da tali contenuti. L'utente è l'unico responsabile per l'uso delle informazioni fornite su questo sito web."
      ],
      [
        "p",
        "Il nostro sito web può contenere collegamenti a siti web di terzi. Questi collegamenti sono forniti solo per la convenienza dell'utente. Non abbiamo alcun controllo sui siti web di terzi e non siamo responsabili per il contenuto o l'accuratezza delle informazioni presenti su tali siti web. L'inclusione di tali link non implica l'approvazione da parte nostra dei siti web collegati."
      ],
      [
        "p",
        "Questo sito web e il suo contenuto sono protetti dalle leggi italiane e internazionali sul diritto d'autore. È vietata la riproduzione, la distribuzione o la pubblicazione di qualsiasi materiale di questo sito web senza il nostro previo consenso scritto."
      ],
      [
        "p",
        "Ci riserviamo il diritto di modificare questo disclaimer in qualsiasi momento senza preavviso. L'utente è tenuto a verificare periodicamente questo disclaimer per eventuali modifiche. L'uso continuato di questo sito web dopo l'implementazione di tali modifiche costituisce l'accettazione dell'utente delle stesse."
      ],
      [
        "p",
        "Se avete domande o dubbi riguardo a questo disclaimer, si prega di contattarci all'indirizzo email rlabwatches@gmail.com."
      ],
      [
        "note",
        "Ultimo aggiornamento: 29/06/2023"
      ]
    ]
  }
} as Record<"privacy" | "termini" | "cookie" | "spedizioni" | "noteLegali", LegalPage>;
