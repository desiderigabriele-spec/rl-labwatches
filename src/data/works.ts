/**
 * Lavori reali per il "prima e dopo" della home.
 * Per aggiungerne uno: python3 scripts/prima-dopo.py <foto-affiancata.jpg> public/lavori <nome>
 * (divide la foto a metà, allinea il "dopo" sul "prima" e salva <nome>-prima.webp e <nome>-dopo.webp),
 * poi aggiungi una riga qui sotto.
 */
export type Work = { slug: string; watch: string; job: string; before: string; after: string; round?: boolean };

export const works: Work[] = [
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
    slug: "explorer",
    watch: "Rolex Explorer II",
    job: "Sostituzione del vetro zaffiro rotto",
    before: "/lavori/explorer-prima.webp",
    after: "/lavori/explorer-dopo.webp",
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
  {
    slug: "daytona-quadrante",
    watch: "Rolex Daytona 6239",
    job: "Pulizia conservativa del quadrante",
    before: "/models/daytona-6239/quadrante-usurato.webp",
    after: "/models/daytona-6239/quadrante.webp",
    round: true,
  },
];
