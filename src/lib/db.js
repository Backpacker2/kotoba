/* ============================================================
   db.js — de datalaag (nu met Supabase cloud-sync)

   De schermen praten ALLEEN met:
       words     (reactieve lijst)
       loading   (true zolang we laden)
       dbError   (foutmelding, of leeg)
       addWord / updateWord / deleteWord / loadWords

   Zo staat alle databasekennis op één plek. In de database heten de
   kolommen met streepjes (created_at); in de app gebruiken we camelCase
   (createdAt). fromRow() en toRow() vertalen tussen die twee.
   ============================================================ */

import { writable } from 'svelte/store';
import { supabase } from './supabase.js';

/** De centrale, reactieve lijst met woorden. Schermen lezen dit als $words. */
export const words = writable([]);
/** True zolang de eerste lading nog binnenkomt. */
export const loading = writable(true);
/** Bevat een tekst als er iets misgaat met de database. */
export const dbError = writable('');

/** De mogelijke bronnen waar een woord vandaan komt. */
export const SOURCES = ['Genki', 'WaniKani', 'Gesprek', 'Anders'];

const TABLE = 'words';

// --- Vertalen tussen database-rij en app-object ---------------------------

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
  // Alleen bekende velden doorgeven aan de database.
  const row = {};
  if ('japanese' in data) row.japanese = data.japanese;
  if ('reading' in data) row.reading = data.reading ?? '';
  if ('meaning' in data) row.meaning = data.meaning;
  if ('example' in data) row.example = data.example ?? '';
  if ('source' in data) row.source = data.source ?? 'Anders';
  if ('tags' in data) row.tags = data.tags ?? [];
  return row;
}

// --- Laden ----------------------------------------------------------------

/** Haal alle woorden op uit de cloud (nieuwste eerst). */
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

  // Eerste keer en nog helemaal leeg? Vul met voorbeeldwoorden.
  if (data.length === 0 && !hasSeeded()) {
    await seedStarter();
    markSeeded();
    return loadWords();
  }

  words.set(data.map(fromRow));
  loading.set(false);
}

// --- Aanpassen (met optimistische update van het scherm) ------------------

/** Voeg een nieuw woord toe. */
export async function addWord(data) {
  const { data: inserted, error } = await supabase
    .from(TABLE)
    .insert(toRow(data))
    .select()
    .single();
  if (error) {
    dbError.set(uitleg(error));
    return;
  }
  words.update((list) => [fromRow(inserted), ...list]);
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

// --- Voorbeeldwoorden (alleen als de database nog leeg is) ----------------

const SEED_FLAG = 'kotobako.seeded';
function hasSeeded() {
  try {
    return localStorage.getItem(SEED_FLAG) === '1';
  } catch {
    return false;
  }
}
function markSeeded() {
  try {
    localStorage.setItem(SEED_FLAG, '1');
  } catch {
    /* geen opslag beschikbaar: niet erg */
  }
}

async function seedStarter() {
  const starter = [
    { japanese: '言葉', reading: 'ことば', meaning: 'woord; taal', example: '', source: 'WaniKani', tags: ['zelfstandig nw'] },
    { japanese: '勉強', reading: 'べんきょう', meaning: 'studeren; studie', example: '日本語を勉強しています。', source: 'Genki', tags: ['werkwoord'] },
    { japanese: '元気', reading: 'げんき', meaning: 'gezond; energiek', example: 'お元気ですか。', source: 'Genki', tags: ['begroeting'] },
    { japanese: '友達', reading: 'ともだち', meaning: 'vriend', example: '友達と話しました。', source: 'Gesprek', tags: ['mensen'] },
    { japanese: '難しい', reading: 'むずかしい', meaning: 'moeilijk', example: '漢字は難しいです。', source: 'WaniKani', tags: ['bijvoeglijk nw'] },
    { japanese: 'ありがとう', reading: '', meaning: 'dank je wel', example: '', source: 'Gesprek', tags: ['begroeting'] },
  ];
  const { error } = await supabase.from(TABLE).insert(starter.map(toRow));
  if (error) dbError.set(uitleg(error));
}

// --- Hulp -----------------------------------------------------------------

function uitleg(error) {
  console.error('Supabase-fout:', error);
  const msg = error?.message ?? '';
  const tabelOntbreekt =
    error?.code === '42P01' ||
    error?.code === 'PGRST205' ||
    msg.includes('does not exist') ||
    msg.includes('Could not find the table') ||
    msg.includes('schema cache');
  if (tabelOntbreekt) {
    return 'De tabel "words" bestaat nog niet. Draai eerst het SQL-scriptje in Supabase (zie docs/SUPABASE.md).';
  }
  return 'Er ging iets mis met de database: ' + (msg || 'onbekende fout');
}

// Start meteen met laden.
loadWords();
