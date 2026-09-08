/* ============================================================
   db.js — de datalaag (Supabase, per ingelogde gebruiker)

   Dankzij "Row Level Security" in de database ziet elke gebruiker
   ALLEEN zijn eigen woorden. De queries hieronder hoeven daar niets
   voor te doen: de database filtert op de ingelogde gebruiker.

   De schermen praten alleen met:
     words / loading / dbError  en
     loadWords / clearWords / addWord / updateWord / deleteWord / deleteWords
   ============================================================ */

import { writable } from 'svelte/store';
import { supabase } from './supabase.js';

export const words = writable([]);
export const loading = writable(false);
export const dbError = writable('');

export const SOURCES = ['Genki', 'WaniKani', 'Gesprek', 'Anders'];
const TABLE = 'words';

function fromRow(r) {
  return {
    id: r.id,
    japanese: r.japanese ?? '',
    reading: r.reading ?? '',
    meaning: r.meaning ?? '',
    example: r.example ?? '',
    source: r.source ?? 'Anders',
    tags: r.tags ?? [],
    createdAt: r.created_at,
  };
}

function toRow(data) {
  const row = {};
  if ('japanese' in data) row.japanese = data.japanese;
  if ('reading' in data) row.reading = data.reading ?? '';
  if ('meaning' in data) row.meaning = data.meaning;
  if ('example' in data) row.example = data.example ?? '';
  if ('source' in data) row.source = data.source ?? 'Anders';
  if ('tags' in data) row.tags = data.tags ?? [];
  return row;
}

/** Haal de woorden van de ingelogde gebruiker op (nieuwste eerst). */
export async function loadWords() {
  loading.set(true);
  dbError.set('');
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) {
    dbError.set(uitleg(error));
    loading.set(false);
    return;
  }
  words.set(data.map(fromRow));
  loading.set(false);
}

/** Leeg de lijst (bij uitloggen). */
export function clearWords() {
  words.set([]);
  dbError.set('');
}

/** Voeg een nieuw woord toe (gekoppeld aan de ingelogde gebruiker). */
export async function addWord(data) {
  const row = toRow(data);
  // Koppel het woord expliciet aan de ingelogde gebruiker (naast de
  // database-standaard), zodat de beveiligingsregel altijd klopt.
  const { data: auth } = await supabase.auth.getSession();
  if (auth?.session?.user?.id) row.user_id = auth.session.user.id;

  const { data: inserted, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select()
    .single();
  if (error) {
    dbError.set(uitleg(error));
    return false;
  }
  words.update((list) => [fromRow(inserted), ...list]);
  return true;
}

/** Pas een bestaand woord aan. */
export async function updateWord(id, patch) {
  const { data: updated, error } = await supabase
    .from(TABLE)
    .update(toRow(patch))
    .eq('id', id)
    .select()
    .single();
  if (error) {
    dbError.set(uitleg(error));
    return;
  }
  words.update((list) => list.map((w) => (w.id === id ? fromRow(updated) : w)));
}

/** Verwijder een woord. */
export async function deleteWord(id) {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) {
    dbError.set(uitleg(error));
    return;
  }
  words.update((list) => list.filter((w) => w.id !== id));
}

/** Verwijder meerdere woorden in één keer. */
export async function deleteWords(ids) {
  if (!ids || ids.length === 0) return;
  const { error } = await supabase.from(TABLE).delete().in('id', ids);
  if (error) {
    dbError.set(uitleg(error));
    return;
  }
  words.update((list) => list.filter((w) => !ids.includes(w.id)));
}

function uitleg(error) {
  console.error('Supabase-fout:', error);
  const msg = error?.message ?? '';
  // De 500-limiet komt als een database-melding die al vriendelijk is.
  if (msg.toLowerCase().includes('limiet')) return msg;
  if (
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    msg.includes('does not exist') ||
    msg.includes('Could not find the table') ||
    msg.includes('schema cache')
  ) {
    return 'De database is nog niet klaar. Draai het SQL-scriptje in Supabase (zie docs/SUPABASE.md).';
  }
  return 'Er ging iets mis met de database: ' + (msg || 'onbekende fout');
}
