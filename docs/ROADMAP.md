# Roadmap

Waar we staan en waar we heen gaan. Afgevinkte punten zijn af.

## Fase 1 — MVP (klaar ✅)

- [x] Project opgezet (Svelte + Vite)
- [x] Ontwerpsysteem: kleuren, typografie, Japanse fonts
- [x] Woorden toevoegen, bewerken, verwijderen
- [x] Zoeken en filteren op bron
- [x] Furigana boven de kanji
- [x] Statistiek (aantal woorden, deze week)
- [x] Werkt op telefoon en laptop
- [x] Opslag in de browser (localStorage)

## Fase 2 — Cloud-sync met Supabase (volgende stap 🔜)

Doel: telefoon en laptop delen dezelfde lijst.

**Wat Timo doet** (Claude kan geen account voor je aanmaken of wachtwoorden invoeren):

1. Ga naar [supabase.com](https://supabase.com) en maak een gratis account.
2. Maak een nieuw project aan (kies een regio in Europa, bijv. Frankfurt).
3. Geef Claude twee dingen door uit **Project Settings → API**:
   - de **Project URL**
   - de **anon public key** (deze mág openbaar zijn — hij is beveiligd met regels)

**Wat Claude dan doet:**

4. Een SQL-scriptje aanleveren dat de tabel `words` aanmaakt (draai je in de Supabase SQL-editor).
5. `src/lib/db.js` ombouwen van localStorage naar Supabase.
6. Een knop toevoegen om je bestaande (lokale) woorden éénmalig te importeren.

> ⚠️ De anon-key is veilig om in de code te zetten, maar we zetten 'm netjes in een
> `.env`-bestand en beschermen de database met "Row Level Security".

## Fase 3 — Online zetten (GitHub Pages) — klaar ✅

- [x] Code op GitHub (openbaar): `Backpacker2/kotoba`
- [x] App live op **https://backpacker2.github.io/kotoba/**, ook op je telefoon
- [x] Publiceren via `npm run deploy` (naar de `gh-pages` branch) — zie `DEPLOY.md`
- [ ] Automatisch publiceren bij elke push (optioneel; workflow staat klaar in `DEPLOY.md`)

## Fase 4 — Accounts, tiers & oefenen

- [x] **Inloggen** + eigen database per gebruiker (Supabase Auth + RLS)
- [x] **Gratis vs premium** (profiles.is_premium); gratis = max 500 woorden
- [x] **Oefenmodus** met simpele spaced repetition (premium)
- [ ] **Leergrafiek**: wanneer je hebt geleerd en wanneer je moet herhalen (premium) — volgende
- [ ] **Betaling** €1/maand via Stripe (premium automatisch) — daarna
- [ ] Dagelijkse streak: hoeveel dagen achter elkaar heb je iets toegevoegd
- [ ] Sorteren en groeperen (op JLPT-niveau, op datum, op bron)
- [ ] Importeren uit een CSV of vanaf WaniKani
- [ ] Donkere modus

## Fase 5 — App-gevoel op de telefoon — klaar ✅

- [x] Van de web-app een **PWA** gemaakt (vite-plugin-pwa): installeerbaar met
      eigen icoon, schermvullend, en de schil werkt offline. Zie README
      ("Installeren als app").
- [ ] Later eventueel een échte appstore-app met Capacitor (vereist een
      Apple/Google-ontwikkelaarsaccount).

## Extra opgeleverd (buiten de oorspronkelijke fasen)

- [x] **Snel toevoegen** (alleen Japans + vertaling) met **automatische furigana**
      via kuromoji — de lezing komt automatisch boven de kanji.
- [x] **Meerdere woorden tegelijk verwijderen** (selecteer-modus).
