# La Buvette

Blog Next.js con redazione privata, Prisma/Turso e copertine su Vercel Blob.

## Sviluppo locale

Requisiti: Node.js 20.19 o superiore.

```bash
npm install
cp .env.example .env.local
npx prisma migrate deploy
npm run db:seed
npm run dev
```

Imposta `SEED_ADMIN_USERNAME`, `SEED_ADMIN_NAME` e una
`SEED_ADMIN_PASSWORD` di almeno 12 caratteri prima del seed. Lo script genera
automaticamente un hash bcrypt e non salva la password in chiaro nel database.

## Variabili Vercel

Configura in `Project → Settings → Environment Variables`:

```text
DATABASE_URL=libsql://...
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
AUTH_SECRET=...
BLOB_READ_WRITE_TOKEN=...
SITE_URL=https://dominio.example
```

`AUTH_SECRET` deve contenere almeno 32 caratteri. Puoi generarlo con:

```bash
openssl rand -hex 32
```

Le variabili `SEED_ADMIN_*` servono sulla macchina dalla quale esegui il seed,
non durante il normale funzionamento del sito.

## Database Turso

Per caricare l'attuale database locale, che contiene già articoli e admin:

```bash
sqlite3 prisma/dev.db .dump > /tmp/labuvette.sql
turso db create labuvette --from-dump /tmp/labuvette.sql
turso db show labuvette --url
turso db tokens create labuvette
```

Per trasferire invece un database Turso esistente:

```bash
turso db shell DATABASE_ORIGINE .dump > labuvette.sql
turso db create labuvette --from-dump ./labuvette.sql
turso db show labuvette --url
turso db tokens create labuvette
```

Aggiorna quindi le variabili Vercel con URL e token del nuovo database.

## Copertine

In produzione le nuove copertine vengono salvate su Vercel Blob. Crea un Blob
Store pubblico da `Project → Storage → Blob`; Vercel aggiungerà automaticamente
`BLOB_READ_WRITE_TOKEN`. In locale, senza token, i file restano sotto
`public/uploads/posts`.

Dimensione massima accettata per una copertina: 3 MB.

## Dominio

1. Apri `Vercel → Project → Settings → Domains`.
2. Aggiungi dominio principale e variante `www`.
3. Imposta un redirect verso la variante preferita.
4. Copia nel registrar i record DNS indicati da Vercel.
5. Imposta `SITE_URL` sul dominio principale e avvia un nuovo deploy.
6. Verifica `/robots.txt`, `/sitemap.xml`, login e caricamento copertine.

Non rimuovere dal registrar eventuali record MX/TXT usati dalla posta.

## Controlli prima del deploy

```bash
npm run lint
npm run build
```
