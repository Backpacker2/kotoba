# Supabase instellen

De app bewaart woorden in een Supabase-database. De verbinding staat al ingesteld
(in `.env`). Je hoeft nog maar één keer de **tabel** aan te maken.

## Stap 1 — Het SQL-scriptje draaien

1. Ga naar je project op [supabase.com](https://supabase.com).
2. Klik links op **SQL Editor** → **New query**.
3. Plak onderstaand scriptje en klik op **Run**.

```sql
-- Tabel voor de woorden.
create table if not exists public.words (
  id         uuid primary key default gen_random_uuid(),
  japanese   text not null,
  reading    text default '',
  meaning    text not null,
  example    text default '',
  source     text default 'Anders',
  tags       text[] default '{}',
  created_at timestamptz default now()
);

-- Beveiliging ("Row Level Security") aanzetten.
alter table public.words enable row level security;

-- Tijdelijke regel: iedereen die de app opent mag lezen en schrijven.
-- Zodra we inloggen toevoegen (Fase 4) vervangen we dit door
-- "iedereen ziet alleen zijn eigen woorden".
drop policy if exists "kotobako open toegang" on public.words;
create policy "kotobako open toegang"
  on public.words
  for all
  to anon, authenticated
  using (true)
  with check (true);
```

## Stap 2 — Klaar

Herlaad de app. De eerste keer vult hij de database automatisch met een paar
voorbeeldwoorden. Voeg je op je laptop een woord toe, dan zie je het op je telefoon
zodra je die pagina ververst. ✨

## Let op — beveiliging

De regel hierboven laat **iedereen met het app-adres** lezen en schrijven. Dat is
prima zolang de app privé is en alleen jij het adres kent. Wil je de app later
openbaar delen, voeg dan éérst inloggen toe (Fase 4 in de roadmap), zodat elke
gebruiker alleen zijn eigen woorden ziet.

De sleutel in `.env` (de *publishable key*) is expres openbaar te gebruiken; de
echte beveiliging zit in deze database-regels, niet in de sleutel.
