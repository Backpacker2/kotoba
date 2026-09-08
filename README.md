# Kotoba 言葉

> Verzamel en leer je Japanse woorden — op je telefoon én je laptop.

Kotoba is een simpele, mooie "wiki" waarin je Japanse woorden, kanji en zinnen
bewaart en overzichtelijk terugvindt. Je verzamelt woorden uit **Genki**,
**WaniKani** en uit **gesprekken** die je online voert, en houdt ze op één plek bij.

## Wat kan het nu

- ➕ Woorden toevoegen met: Japans, lezing (kana), betekenis, voorbeeldzin, bron en labels
- 🔎 Zoeken op woord, lezing, betekenis of label
- 🏷️ Filteren op bron (Genki / WaniKani / Gesprek / Anders)
- ✏️ Woorden bewerken en verwijderen
- 📊 Teller: hoeveel woorden je hebt bewaard en hoeveel deze week
- 🈁 Furigana (de lezing klein boven de kanji)
- 📱 Werkt goed op telefoon en laptop (responsive)

Op dit moment worden je woorden **op het apparaat zelf** bewaard (in de browser).
Cloud-sync via Supabase — zodat telefoon en laptop dezelfde lijst delen — is de
volgende stap. Zie [`docs/ROADMAP.md`](docs/ROADMAP.md).

## Techniek

| Onderdeel      | Keuze                    | Waarom                                    |
| -------------- | ------------------------ | ----------------------------------------- |
| Framework      | Svelte 5 + Vite          | Licht, weinig code, snel om te leren      |
| Taal           | JavaScript, HTML, CSS    | Overdraagbaar naar bijna elk project      |
| Opslag (nu)    | localStorage             | Werkt meteen, zonder account of internet  |
| Opslag (straks)| Supabase                 | Gratis cloud-database, synct overal       |
| Hosting        | GitHub + GitHub Pages    | Gratis, jouw code staat online            |

De uitleg achter deze keuzes staat in [`docs/BESLISSINGEN.md`](docs/BESLISSINGEN.md).

## Zelf draaien

Je hebt [Node.js](https://nodejs.org) nodig (versie 20 of hoger).

```sh
npm install     # eenmalig: pakketten installeren
npm run dev     # start de app op http://localhost:5173
```

Andere commando's:

```sh
npm run build   # maakt een productie-versie in de map dist/
npm run preview # bekijk die productie-versie lokaal
```

## Hoe het in elkaar zit

```
kotobako/
├─ index.html            # de HTML-pagina + laadt de Japanse fonts
├─ src/
│  ├─ main.js            # startpunt: hangt de app in de pagina
│  ├─ app.css            # HET ONTWERPSYSTEEM — alle kleuren & typografie
│  ├─ App.svelte         # hoofdscherm: kop, statistiek, zoeken, filters, lijst
│  └─ lib/
│     ├─ db.js           # DE DATALAAG — opslaan/laden (nu localStorage)
│     ├─ WordCard.svelte # één woordkaart
│     └─ WordForm.svelte # formulier om toe te voegen / te bewerken
└─ docs/                 # documentatie & beslissingen
```

Twee bestanden zijn "de baas":

- **`src/app.css`** bepaalt de héle look. Wil je een andere kleur of ander
  lettertype? Verander het daar, dan verandert het overal mee.
- **`src/lib/db.js`** bepaalt waar woorden vandaan komen. Alle schermen praten
  alleen met dit bestand, zodat we later alleen hier hoeven te wisselen naar
  Supabase.

## Rollen in dit project

- **Timo** — hoofdontwerper, bepaalt de richting en controleert op fouten.
- **Claude** — maker, ontwerper en documentatie.

---

言葉 (kotoba) = "woorden". Veel leerplezier! 🎌
