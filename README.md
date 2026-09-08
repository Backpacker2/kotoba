# Kotoba 言葉

> Verzamel en leer je Japanse woorden — op je telefoon én je laptop.

**▶️ Live: https://backpacker2.github.io/kotoba/**

Kotoba is een simpele, mooie "wiki" waarin je Japanse woorden, kanji en zinnen
bewaart en overzichtelijk terugvindt. Je verzamelt woorden uit **Genki**,
**WaniKani** en uit **gesprekken** die je online voert, en houdt ze op één plek bij.

## Wat kan het nu

- ⚡ **Snel toevoegen**: typ alleen het Japanse woord en de vertaling — klaar
- 🈁 **Automatische furigana**: bij snel toevoegen wordt de lezing (hiragana)
  bepaald en klein boven de kanji gezet, zodat je uitspraak en spelling ziet
- ➕ Uitgebreid toevoegen met: lezing, voorbeeldzin, bron en labels
- 🔎 Zoeken op woord, lezing, betekenis of label
- 🏷️ Filteren op bron (Genki / WaniKani / Gesprek / Anders)
- ✏️ Woorden bewerken, en **meerdere tegelijk verwijderen** (selecteer-modus)
- 📊 Teller: hoeveel woorden je hebt bewaard en hoeveel deze week
- ☁️ **Cloud-sync**: je lijst is overal hetzelfde, op telefoon én laptop
- 📲 **Installeerbaar als app** (PWA): eigen icoon, schermvullend, offline schil

## Installeren als app

Kotoba is een web-app die je kunt **installeren** zodat hij als een echte app werkt.

- **iPhone/iPad (Safari):** open de [site](https://backpacker2.github.io/kotoba/) →
  deel-knop → *Zet op beginscherm*.
- **Android (Chrome):** menu (⋮) → *App installeren* / *Toevoegen aan startscherm*.
- **Laptop (Chrome/Edge):** installeer-icoontje in de adresbalk → *Installeren*.

## Techniek

| Onderdeel   | Keuze                       | Waarom                                   |
| ----------- | --------------------------- | ---------------------------------------- |
| Framework   | Svelte 5 + Vite             | Licht, weinig code, snel om te leren     |
| Taal        | JavaScript, HTML, CSS       | Overdraagbaar naar bijna elk project     |
| Opslag      | Supabase                    | Gratis cloud-database, synct overal      |
| Furigana    | kuromoji (@sglkc/kuromoji)  | Bepaalt de lezing van kanji in de browser|
| App/offline | vite-plugin-pwa             | Installeerbaar + service worker          |
| Hosting     | GitHub Pages                | Gratis, op een github.io-adres           |

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
