# RL Lab Watches – sito web

Nuovo sito di **RL Lab Watches · Roberto Landi** (laboratorio di orologeria a Pistoia), migrato da Wix.

Stack: [Next.js](https://nextjs.org) (App Router) · Tailwind CSS · three.js / React Three Fiber (orologio 3D) · Motion (transizioni). Pensato per il deploy su **Vercel**.

## Sviluppo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build di produzione
```

## Dove modificare i contenuti

| Cosa | File |
| --- | --- |
| Nome, indirizzo, email, telefono, WhatsApp, orari, social | `src/data/site.ts` |
| Servizi (testi e foto) | `src/data/services.ts` (foto in `public/images/`) |
| Marche, FAQ, recensioni | `src/data/brands.ts`, `src/data/faq.ts`, `src/data/reviews.ts` |
| Testi legali | `src/content/legal.ts` |
| Orologi in vendita | `src/data/products.ts` — quando sono reali metti `SHOP_READY = true` |
| Titoli e descrizioni per Google | in cima a ogni `src/app/*/page.tsx` · dati strutturati in `src/lib/seo.ts` |
| Colori e font | `src/app/globals.css` (blocco `@theme`) |
| Logo (kit vettoriale) | `public/brand/` · note e PDF in `docs/brand/` · componente `src/components/Logo.tsx` |
| Orologio 3D della home | `src/components/WatchScene.tsx` |

Le pagine sono in `src/app/` (una cartella per pagina).

### Aggiornare il logo

Se arriva una nuova versione del kit, scompattala e lancia:

```bash
node scripts/import-logo-kit.mjs <cartella Roberto_Landi_Vector_Kit>
```

Copia gli SVG in `public/brand/`, rigenera le parti animabili e la favicon.

## SEO e migrazione da Wix

I vecchi indirizzi Wix reindirizzano con **301** alle nuove pagine (`next.config.ts`), così Google
trasferisce il posizionamento:

| Vecchio (Wix) | Nuovo |
| --- | --- |
| `/about-5` | `/chi-sono` |
| `/blank-3` | `/faq` |
| `/blank-5` | `/marche` |
| `/blank-7` | `/contatti` |
| `/blank-8` | `/preventivo` |
| `/informativa-sulla-privacy` | `/privacy` |
| `/copia-di-informativa-sulla-privacy` | `/termini-di-servizio` |
| `/copia-di-informativa-sulla-privacy-1` | `/cookie` |
| `/copia-di-termini-di-servizio` | `/spedizioni-e-consegna` |
| `/copia-di-spedizioni-e-consegna` | `/note-legali` |

Ogni pagina ha titolo, descrizione, URL canonico e immagine social; il sito pubblica `sitemap.xml`,
`robots.txt` e i dati strutturati schema.org (attività locale con orari e servizi, FAQ, breadcrumb).

## Deploy su Vercel

1. Su vercel.com → **Add New… → Project** → importa il repository GitHub `rl-labwatches`.
2. Framework: Next.js (rilevato in automatico). Nessuna variabile d'ambiente necessaria.
3. Ogni push su `main` pubblica il sito; ogni altro branch crea un'anteprima.

### Dominio rl-labwatches.it

1. Rinnova il dominio presso il registrar (se era registrato tramite Wix, rinnovalo da Wix o trasferiscilo).
2. In Vercel: **Project → Settings → Domains** → aggiungi `rl-labwatches.it` e `www.rl-labwatches.it`.
3. Imposta i record DNS indicati da Vercel (di solito `A @ 76.76.21.21` e `CNAME www cname.vercel-dns.com`).
4. Se le email usano il dominio, mantieni i record MX esistenti.
