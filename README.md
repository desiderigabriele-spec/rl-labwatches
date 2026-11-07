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
| Orologio 3D della home | `src/components/WatchScene.tsx` (modello: `src/data/model3d.ts`) |

Le pagine sono in `src/app/` (una cartella per pagina).

### Aggiornare il logo

Se arriva una nuova versione del kit, scompattala e lancia:

```bash
node scripts/import-logo-kit.mjs <cartella Roberto_Landi_Vector_Kit>
```

Copia gli SVG in `public/brand/`, rigenera le parti animabili e la favicon.

## Aggiungere un orologio in vendita (con vista a 360°)

**1. Le foto**
- *Foto normali*: fondo chiaro e uniforme (un box luminoso da fotografia va benissimo), luce diffusa,
  telefono su treppiede. La prima foto in ordine alfabetico diventa la copertina.
- *Vista a 360° e vetrina con i faretti*: orologio al centro di un piatto girevole, telefono fermo su
  treppiede, stessa luce. Scatta una foto ogni 20° (18 foto) o ogni 10° (36), sempre nello stesso verso.
  Esistono piatti girevoli motorizzati che scattano da soli tramite app.
- *Per la vetrina con i faretti* le foto della rotazione devono essere **scontornate** (sfondo
  trasparente, PNG): così l'orologio "sta" sul ripiano buio e si illumina. Si possono scontornare in
  automatico, ad esempio con remove.bg, Photoroom o con "Isola soggetto" delle Foto di iPhone/Mac.

**2. Importa le foto** (le raddrizza, le ridimensiona e le comprime):

```bash
node scripts/aggiungi-orologio.mjs rolex-submariner-16610 --foto ~/Desktop/sub/foto --360 ~/Desktop/sub/360 --accento "#1f9a62"
```

**3. Incolla il blocco** che lo script stampa in `src/data/products.ts` e completa nome, prezzo e descrizione.

`--accento` è il colore del bagliore che compare sotto l'orologio quando si accende il faretto
(di solito il colore del quadrante). I primi 5 orologi del catalogo vanno nella vetrina della home.

**4. Quando il catalogo è reale**, togli gli esempi da `products.ts` (e le cartelle
`public/orologi/esempio-*`) e metti `SHOP_READY = true`: la pagina Orologi entra nella sitemap
e ogni orologio viene mostrato su Google con prezzo e disponibilità.

## Modello 3D su misura

Il sito usa un orologio 3D costruito a codice. Quando arriva il modello del modellatore (due file GLB:
"nuovo" e "usurato"), si copiano in `public/models/` e si impostano in `src/data/model3d.ts`.
Brief per il modellatore, nomi dei pezzi e istruzioni: `docs/modello-3d.md`.

## Modulo contatti: invio diretto via email

Il modulo invia le richieste con [Resend](https://resend.com) (piano gratuito: 3.000 email al mese).
Finché non è configurato, il modulo apre l'app di posta del cliente con il messaggio già scritto.

1. Crea un account su resend.com e una **API key**.
2. (Consigliato) In Resend aggiungi il dominio `rl-labwatches.it` e i record DNS che indica,
   così le email partono da un indirizzo del sito.
3. Su Vercel → progetto → **Settings → Environment Variables** aggiungi:
   - `RESEND_API_KEY` = la chiave
   - `CONTACT_FROM` = `Sito RL Lab Watches <sito@rl-labwatches.it>` (solo dopo il punto 2)
   - `CONTACT_TO` = la casella che riceve le richieste (predefinita: rlabwatches@gmail.com)
4. Rifai il deploy (Deployments → ⋯ → Redeploy).

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
