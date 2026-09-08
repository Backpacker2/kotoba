# Beslissingen & uitleg

Dit bestand legt uit *waarom* we bepaalde technieken gekozen hebben. Bedoeld om
van te leren — zodat je deze kennis kunt meenemen naar volgende projecten.

## 1. Waarom een web-app (en geen "echte" app)?

Je wilt je woorden op je **telefoon én je laptop** kunnen bekijken. Een web-app
draait in de browser, en een browser zit op élk apparaat. Zo hoeven we maar één
keer te bouwen in plaats van een aparte iPhone-app en een aparte Mac-app.

Bijkomend voordeel: we kunnen het **gratis online zetten** via GitHub Pages, en
je leert HTML/CSS/JavaScript — de basis van bijna het hele web.

## 2. Waarom Svelte (en niet React)?

Je koos "een licht framework". Van de opties is **Svelte** het lichtst:

- Je schrijft veel minder "omslachtige" code dan in React.
- Wat je typt lijkt gewoon op HTML, CSS en JavaScript — makkelijk te lezen.
- Het resultaat is snel en klein.

React staat op méér vacatures, maar voor een persoonlijk project waar plezier en
momentum tellen, is Svelte fijner om mee te beginnen. De *concepten* die je hier
leert (componenten, state, reactiviteit) gelden ook in React en Vue.

We gebruiken **Svelte 5** met "runes" (`$state`, `$derived`, `$props`). Dat is de
nieuwste manier; korte uitleg:

- `let x = $state(0)` — een waarde die kan veranderen; het scherm werkt automatisch bij.
- `let y = $derived(...)` — een waarde die *afgeleid* is van andere (bijv. de gefilterde lijst).
- `let { ... } = $props()` — de gegevens die een component van buiten binnenkrijgt.

## 3. Waarom Vite?

**Vite** is het gereedschap dat de app opstart tijdens het bouwen (`npm run dev`)
en er een kant-en-klare versie van maakt (`npm run build`). Het is razendsnel en
ververst het scherm meteen als je iets aanpast (dat heet *hot reload*).

## 4. Waarom eerst localStorage, daarna pas Supabase?

We wilden dat je **meteen iets werkends** zag, zonder eerst een account aan te
maken. Daarom slaat de app woorden nu op in **localStorage** — een klein
opslagvakje in je browser.

Nadeel: localStorage is per apparaat. Je telefoon en laptop delen dan niets.
Daarom komt **Supabase**: een gratis cloud-database. Dan staat je lijst online en
zie je overal hetzelfde.

Belangrijk ontwerpbesluit: **alle opslaan/laden zit in één bestand**
(`src/lib/db.js`). De schermen weten niet *waar* de data vandaan komt. Daardoor
hoeven we straks alleen dat ene bestand om te bouwen naar Supabase — de rest
blijft ongewijzigd. Dit heet *scheiding van verantwoordelijkheden* en is een
principe dat je overal terugziet in goede software.

## 5. Waarom één ontwerpsysteem (`app.css`)?

Alle kleuren, vormen en lettertypes staan als "variabelen" bovenin `app.css`
(bijv. `--accent` voor het rood). De rest van de app verwijst daarnaar. Wil je de
hele app een andere sfeer geven? Eén plek aanpassen. Zo blijft alles consistent —
precies wat een verzameling er verzorgd uit laat zien.

## 6. Waarom GitHub?

GitHub bewaart je code online, houdt de geschiedenis bij (je kunt altijd terug),
en maakt samenwerken mogelijk. Via **GitHub Pages** kun je de app bovendien gratis
publiceren, zodat je 'm vanaf je telefoon gewoon in de browser opent.

## Woordenlijst (voor als een term nieuw is)

- **Component** — een herbruikbaar stukje scherm (bijv. één woordkaart).
- **State** — gegevens die kunnen veranderen terwijl de app draait.
- **Reactief** — het scherm werkt zichzelf bij zodra de gegevens veranderen.
- **localStorage** — opslag in de browser, blijft op dat ene apparaat.
- **Deploy / publiceren** — de app online zetten zodat anderen (of je telefoon) erbij kunnen.
