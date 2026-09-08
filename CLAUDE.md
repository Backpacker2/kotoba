# Kotoba — projectgids voor Claude Code

> Naam van de app is **Kotoba** (言葉, "woorden"). De projectmap en GitHub-repo
> kunnen nog `kotobako` heten — dat is bewust, om paden niet te breken.

Een kleine **Svelte 5 + Vite** web-app waarin Timo Japanse woorden, kanji en
zinnen bewaart en terugvindt — op telefoon én laptop. Bronnen: Genki, WaniKani,
en gesprekken. Het is een **wiki/verzamelaar**, geen flashcard-trainer (dat kan
later een extra worden).

## Rollen
- **Timo** — hoofdontwerper; bepaalt de richting, controleert op fouten.
- **Claude** — maker, ontwerper, documentatie. Timo leert bewust mee van de
  gekozen technieken, dus **leg keuzes uit** en houd de code leesbaar.

## Taal
De hele UI en alle documentatie zijn in het **Nederlands**. Houd dat zo.
Code-namen (variabelen/functies) mogen Engels zijn waar dat natuurlijk is.

## Architectuur — twee bestanden zijn "de baas"
- `src/app.css` — **het ontwerpsysteem.** Alle kleuren, vormen en typografie
  staan als CSS-variabelen bovenin (`--accent`, `--paper`, `--font-jp`, …).
  Verander de look hier; hardcode nooit een kleur in een component.
- `src/lib/db.js` — **de datalaag** (Supabase). Exporteert de stores `words`,
  `loading`, `dbError` plus `addWord`/`updateWord`/`deleteWord`/`deleteWords`
  (allemaal `async`). Schermen praten ALLEEN hiermee. Supabase-config in `.env`
  (`VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY`, publishable key, gitignored).

Verder:
- `src/App.svelte` — hoofdscherm (kop, statistiek, snel toevoegen, zoeken,
  filters, lijst, selecteer-modus voor bulk-verwijderen).
- `src/lib/WordCard.svelte` — één woordkaart (furigana via `<ruby>`; klikbaar in
  selecteer-modus).
- `src/lib/WordForm.svelte` — uitgebreid toevoegen/bewerken.
- `src/lib/QuickAdd.svelte` — snel toevoegen (Japans + vertaling).
- `src/lib/furigana.js` — bepaalt de hiragana-lezing van kanji met kuromoji
  (`@sglkc/kuromoji`), lazy geladen; eigen mini-lader die het woordenboek uitpakt
  indien nodig (server-onafhankelijk).
- `src/lib/supabase.js` — de Supabase-client.

## Conventies
- **Svelte 5 runes**: `$state`, `$derived`, `$props`. Geen oude `export let`.
- Events als `onclick={...}` / `onsubmit={...}` (Svelte 5-stijl).
- Nieuwe ontwerpkeuzes gaan via de variabelen in `app.css`.
- Een woord heeft: `id, japanese, reading, meaning, example, source, tags[], createdAt`.
- Bronnen staan in `SOURCES` in `db.js` (Genki / WaniKani / Gesprek / Anders).
- Houd het **simpel en rustig**; het moet aantrekkelijk blijven, niet druk.

## Bouwen & draaien
```sh
npm install
npm run dev      # http://localhost:5173 (kopieert eerst het woordenboek)
npm run build    # productie-build in dist/
npm run deploy   # publiceert dist/ naar gh-pages (zie docs/DEPLOY.md)
npm run icons    # app-iconen opnieuw genereren (scripts/generate-icons.mjs)
```
Het kuromoji-woordenboek staat NIET in Git; `scripts/copy-dict.mjs` kopieert het
uit `node_modules` naar `public/dict` (draait automatisch vóór dev/build).

## Live
- App: **https://backpacker2.github.io/kotoba/** (GitHub Pages, `gh-pages` branch)
- Publiceren: `npm run build && npm run deploy`. gh-pages faalt op globale
  GPG-signing → tijdelijk `git config --global commit.gpgsign false`.
- Vite `base` = `/kotoba/` bij productie (zie `vite.config.js`).

## Belangrijkste volgende stap
- **Inloggen** (Supabase Auth + RLS per gebruiker). Nu staat RLS op "open toegang"
  voor anon: iedereen met de URL kan lezen/schrijven/verwijderen. Deel de link niet
  breed tot login er is. Verdere ideeën in `docs/ROADMAP.md`.

## Documentatie
- `README.md` — overzicht, installeren als app, hoe te draaien.
- `docs/BESLISSINGEN.md` — waarom deze technieken (leerdoel voor Timo).
- `docs/ROADMAP.md` — fasen en volgende stappen.
- `docs/SUPABASE.md` — database-tabel + regels.
- `docs/DEPLOY.md` — online zetten.

Werk in kleine, begrijpelijke stappen en draai na wijzigingen een build.
