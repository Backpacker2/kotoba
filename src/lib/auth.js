/* ============================================================
   auth.js — inloggen/registreren via Supabase Auth.

   Exporteert:
     session    — de ingelogde sessie (of null)
     profile    — het profiel van de gebruiker: { is_premium }
     authReady  — true zodra we weten of iemand is ingelogd
     signUp / signIn / signOut

   De schermen lezen `session` (ingelogd?) en `profile` (premium?).
   ============================================================ */

import { writable } from 'svelte/store';
import { supabase } from './supabase.js';

export const session = writable(null);
export const profile = writable(null); // { is_premium: boolean }
export const authReady = writable(false);

async function loadProfile(userId) {
  if (!userId) {
    profile.set(null);
    return;
  }
  const { data } = await supabase
    .from('profiles')
    .select('is_premium')
    .eq('id', userId)
    .maybeSingle();
  // Geen profiel gevonden? Behandel als gratis.
  profile.set(data ?? { is_premium: false });
}

// Bij het opstarten: kijk of er al iemand is ingelogd.
supabase.auth.getSession().then(async ({ data }) => {
  session.set(data.session);
  await loadProfile(data.session?.user?.id);
  authReady.set(true);
});

// Reageer op in-/uitloggen.
supabase.auth.onAuthStateChange((_event, s) => {
  session.set(s);
  loadProfile(s?.user?.id);
});

export async function signUp(email, password) {
  return supabase.auth.signUp({ email, password });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signOut() {
  await supabase.auth.signOut();
}
