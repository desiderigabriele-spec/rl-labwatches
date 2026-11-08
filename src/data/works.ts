/**
 * Lavori reali per il "prima e dopo" della home.
 * Per aggiungerne uno: python3 scripts/prima-dopo.py <foto-affiancata.jpg> public/lavori <nome>
 * (divide la foto a metà, allinea il "dopo" sul "prima" e salva <nome>-prima.webp e <nome>-dopo.webp),
 * poi aggiungi una riga qui sotto.
 */
export type Work = { slug: string; watch: string; job: string; before: string; after: string; round?: boolean };

export const works: Work[] = [
  {
    slug: "daytona-acciaio-oro",
    watch: "Rolex Daytona acciaio e oro",
    job: "Lucidatura di cassa, lunetta e bracciale",
    before: "/lavori/daytona-acciaio-oro-prima.webp",
    after: "/lavori/daytona-acciaio-oro-dopo.webp",
  },
  {
    slug: "daytona-bracciale",
    watch: "Rolex Daytona acciaio e oro",
    job: "Ripristino del bracciale Oyster",
    before: "/lavori/daytona-bracciale-prima.webp",
    after: "/lavori/daytona-bracciale-dopo.webp",
  },
  {
    slug: "gmt-ansa",
    watch: "Rolex GMT-Master II",
    job: "Ripristino di anse e cassa",
    before: "/lavori/gmt-ansa-prima.webp",
    after: "/lavori/gmt-ansa-dopo.webp",
  },
  {
    slug: "daytona-fondello",
    watch: "Rolex Daytona",
    job: "Satinatura del fondello e della cassa",
    before: "/lavori/daytona-fondello-prima.webp",
    after: "/lavori/daytona-fondello-dopo.webp",
  },
  {
    slug: "explorer",
    watch: "Rolex Explorer II",
    job: "Sostituzione del vetro zaffiro rotto",
    before: "/lavori/explorer-prima.webp",
    after: "/lavori/explorer-dopo.webp",
  },
  {
    slug: "oro-rosa-cassa",
    watch: "Rolex in oro rosa",
    job: "Lucidatura di cassa e bracciale",
    before: "/lavori/oro-rosa-cassa-prima.webp",
    after: "/lavori/oro-rosa-cassa-dopo.webp",
  },
  {
    slug: "datejust-lunetta",
    watch: "Rolex Datejust",
    job: "Lucidatura di cassa e lunetta zigrinata",
    before: "/lavori/datejust-lunetta-prima.webp",
    after: "/lavori/datejust-lunetta-dopo.webp",
  },
  {
    slug: "acciaio-chiusura",
    watch: "Rolex in acciaio",
    job: "Satinatura e lucidatura della chiusura",
    before: "/lavori/acciaio-chiusura-prima.webp",
    after: "/lavori/acciaio-chiusura-dopo.webp",
  },
  {
    slug: "date-oro",
    watch: "Rolex Oyster Perpetual Date",
    job: "Satinatura del bracciale in oro giallo",
    before: "/lavori/date-oro-prima.webp",
    after: "/lavori/date-oro-dopo.webp",
  },
  {
    slug: "datejust-ansa",
    watch: "Rolex Datejust",
    job: "Ripristino dell'ansa e lucidatura",
    before: "/lavori/datejust-ansa-prima.webp",
    after: "/lavori/datejust-ansa-dopo.webp",
  },
  {
    slug: "oro-rosa-chiusura",
    watch: "Rolex in oro rosa",
    job: "Satinatura e lucidatura della chiusura",
    before: "/lavori/oro-rosa-chiusura-prima.webp",
    after: "/lavori/oro-rosa-chiusura-dopo.webp",
  },
];
