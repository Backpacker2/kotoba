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
- `src/lib/db.js` — **de datalaag.** Exporteert een reactieve store `words` plus
  `addWord` / `updateWord` / `deleteWord` (allemaal `async`). Schermen praten
  ALLEEN hiermee; ze weten niet waar data vandaan komt. Nu localStorage, straks
  Supabase — dan verandert alleen de binnenkant van dit bestand.

Verder:
- `src/App.svelte` — hoofdscherm (kop, statistiek, zoeken, filters, lijst).
- `src/lib/WordCard.svelte` — één woordkaart (furigana via `<ruby>`).
- `src/lib/WordForm.svelte` — toevoegen/bewerken in één component.

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
npm run dev      # http://localhost:5173
npm run build    # productie-build in dist/
```

## Belangrijk voor volgende stappen
- **Supabase** (cloud-sync) is de volgende grote stap — zie `docs/ROADMAP.md`.
  Claude kan géén Supabase-account aanmaken of wachtwoorden invoeren; Timo levert
  de Project URL + anon key aan. De anon key mag in de repo (via `.env`), mits de
  database met Row Level Security beschermd is.
- **Deploy** gaat via GitHub Pages (zie roadmap). Let op: Vite heeft dan een
  correcte `base` nodig in `vite.config.js` (de repo-naam).

## Documentatie
- `README.md` — overzicht + hoe te draaien.
- `docs/BESLISSINGEN.md` — waarom deze technieken (leerdoel voor Timo).
- `docs/ROADMAP.md` — fasen en volgende stappen.

Werk in kleine, begrijpelijke stappen en draai na wijzigingen een build.
