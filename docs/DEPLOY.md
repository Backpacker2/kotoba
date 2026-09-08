# Online zetten (GitHub Pages)

De app staat online op **https://backpacker2.github.io/kotoba/** en wordt
gepubliceerd vanaf de branch **`gh-pages`**.

## Hoe publiceren werkt nu

De branch `gh-pages` bevat alleen de gebouwde app (de inhoud van `dist/`).
GitHub Pages serveert die branch. Opnieuw publiceren na een wijziging:

```sh
npm run build                 # bouwt dist/ (met base /kotoba/)
npm run deploy                # duwt dist/ naar de gh-pages branch
```

`npm run deploy` staat in `package.json` en gebruikt het `gh-pages`-pakket.

> Belangrijk: `vite.config.js` zet `base` op `/kotoba/` bij de productie-build,
> zodat de app op het adres `.../kotoba/` zijn bestanden vindt. Lokaal
> (`npm run dev`) blijft dat gewoon `/`.

## Automatisch publiceren bij elke push (optioneel, later)

Handiger is dat GitHub zélf bouwt en publiceert zodra je naar `main` pusht.
Daarvoor is één keer een extra toestemming nodig, omdat een workflow-bestand
alleen gepusht mag worden met de `workflow`-rechten:

```sh
gh auth refresh -s workflow   # eenmalig; opent even je browser
```

Zet daarna het workflow-bestand hieronder in `.github/workflows/deploy.yml` en
push. Vanaf dan hoef je niets meer handmatig te deployen.

```yaml
name: Deploy naar GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - uses: actions/configure-pages@v5
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_KEY: ${{ secrets.VITE_SUPABASE_KEY }}
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

De sleutels `VITE_SUPABASE_URL` en `VITE_SUPABASE_KEY` staan al als
repo-secrets ingesteld, dus de workflow werkt meteen.

## Let op — beveiliging

De app is openbaar en heeft nog geen login. Met de huidige database-regel kan
iedereen die het adres kent woorden lezen, toevoegen en verwijderen. Deel de link
dus nog niet breed rond tot **inloggen** is toegevoegd (Fase 4 in `ROADMAP.md`).
