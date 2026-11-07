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
| Nome, indirizzo, email, telefono, orari, social | `src/data/site.ts` |
| Servizi | `src/data/services.ts` |
| Prodotti dello shop | `src/data/products.ts` (foto in `public/prodotti/`) |
| Colori e font | `src/app/globals.css` (blocco `@theme`) |
| Logo | `src/components/Logo.tsx` |
| Orologio 3D della home | `src/components/WatchScene.tsx` |

Le pagine sono in `src/app/` (una cartella per pagina).

I vecchi indirizzi Wix (`/blank-7`, `/informativa-sulla-privacy`, …) reindirizzano alle nuove pagine: vedi `next.config.ts`.

## Deploy su Vercel

1. Su vercel.com → **Add New… → Project** → importa il repository GitHub `rl-labwatches`.
2. Framework: Next.js (rilevato in automatico). Nessuna variabile d'ambiente necessaria.
3. Ogni push su `main` pubblica il sito; ogni altro branch crea un'anteprima.

### Dominio rl-labwatches.it

1. Rinnova il dominio presso il registrar (se era registrato tramite Wix, rinnovalo da Wix o trasferiscilo).
2. In Vercel: **Project → Settings → Domains** → aggiungi `rl-labwatches.it` e `www.rl-labwatches.it`.
3. Imposta i record DNS indicati da Vercel (di solito `A @ 76.76.21.21` e `CNAME www cname.vercel-dns.com`).
4. Se le email usano il dominio, mantieni i record MX esistenti.
