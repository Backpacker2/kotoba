/* ============================================================
   supabase.js — de verbinding met de cloud-database.

   De gegevens komen uit het .env-bestand (VITE_SUPABASE_URL en
   VITE_SUPABASE_KEY). Vite maakt alles wat met VITE_ begint
   beschikbaar via import.meta.env.
   ============================================================ */

import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_KEY;

if (!url || !key) {
  console.error(
    'Supabase-gegevens ontbreken. Maak een .env-bestand aan (zie .env.example).'
  );
}

export const supabase = createClient(url, key);
