# Accounts, tiers en de 500-limiet

Kotoba heeft nu **accounts**. Elke gebruiker heeft zijn eigen woordenlijst
(niemand ziet die van een ander). Er zijn twee soorten:

| | Gratis | Premium |
| --- | --- | --- |
| Eigen database | ✅ | ✅ |
| Furigana + snel toevoegen | ✅ | ✅ |
| Aantal woorden | tot **500** | onbeperkt |
| Oefenmodus (spaced repetition) | — | 🔜 komt eraan |
| Leergrafiek | — | 🔜 komt eraan |

## Wat jij één keer moet doen in Supabase

### 1. E-mailbevestiging uitzetten (voor nu, zodat je meteen kunt inloggen)
Ga in Supabase naar **Authentication → Providers → Email** (of **Auth → Settings**)
en zet **"Confirm email" uit**. Zo kun je meteen na registreren inloggen.
(Later, voor echte gebruikers, kun je dit weer aanzetten.)

### 2. Het database-scriptje draaien
**SQL Editor → New query**, plak dit en klik **Run**:

```sql
-- 1) Koppel woorden aan een gebruiker.
alter table public.words
  add column if not exists user_id uuid references auth.users(id) default auth.uid();

-- 2) Vervang "open toegang" door "alleen je eigen woorden".
drop policy if exists "kotobako open toegang" on public.words;
create policy "eigen woorden lezen"       on public.words for select using (auth.uid() = user_id);
create policy "eigen woorden toevoegen"   on public.words for insert with check (auth.uid() = user_id);
create policy "eigen woorden wijzigen"    on public.words for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "eigen woorden verwijderen" on public.words for delete using (auth.uid() = user_id);

-- 3) Profielen: hier staat of iemand premium is.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  is_premium boolean not null default false,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
drop policy if exists "eigen profiel lezen" on public.profiles;
create policy "eigen profiel lezen" on public.profiles for select using (auth.uid() = id);

-- 4) Maak automatisch een profiel bij een nieuwe aanmelding.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5) Gratis limiet: 500 woorden (premium = onbeperkt), afgedwongen door de database.
create or replace function public.check_word_limit()
returns trigger language plpgsql security definer set search_path = public as $$
declare premium boolean; aantal int;
begin
  select is_premium into premium from public.profiles where id = new.user_id;
  if premium then return new; end if;
  select count(*) into aantal from public.words where user_id = new.user_id;
  if aantal >= 500 then
    raise exception 'Gratis limiet van 500 woorden bereikt. Upgrade naar premium voor onbeperkt.';
  end if;
  return new;
end; $$;
drop trigger if exists enforce_word_limit on public.words;
create trigger enforce_word_limit before insert on public.words
  for each row execute function public.check_word_limit();

-- 6) Ruim de oude voorbeeld-/testwoorden zonder eigenaar op.
delete from public.words where user_id is null;
```

### 3. Klaar
Open de app, klik **"Maak er gratis een"**, registreer met e-mail + wachtwoord,
en je hebt je eigen lege woordenlijst. 🎉

## Iemand premium maken (voorlopig handmatig)

Zolang er nog geen betaling is gekoppeld, zet je premium met de hand aan. In
Supabase **SQL Editor**:

```sql
-- vervang het e-mailadres
update public.profiles set is_premium = true
where id = (select id from auth.users where email = 'timo@rugzakreis.nl');
```

Log daarna in de app opnieuw in (of herlaad), dan zie je het **Premium**-label.

## En het echte betalen (€1/maand)?

Dat komt als laatste en is een apart project: het vraagt **Stripe**, jouw eigen
Stripe-account, en een klein stukje server (Supabase Edge Function met een
webhook) die na een geslaagde betaling `is_premium` op `true` zet. De app en de
premium-functies bouwen we éérst; daarna koppelen we de betaling.
