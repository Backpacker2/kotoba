/* ============================================================
   db.js — de datalaag (waar woorden vandaan komen en heen gaan)

   NU: opgeslagen in de browser (localStorage) zodat de app meteen
   werkt, zonder account of internet.

   STRAKS: we vervangen alleen de binnenkant van deze functies door
   Supabase-aanroepen. De rest van de app (de schermen) merkt daar
   niets van, want die praat alleen met:
       words  (een reactieve lijst)  +  addWord / updateWord / deleteWord
   Daarom zijn de functies nu al 'async': dan hoeft er later niets te
   veranderen aan de schermen.
   ============================================================ */

import { writable } from 'svelte/store';

const STORAGE_KEY = 'kotobako.words.v1';

/** De centrale, reactieve lijst met woorden. Schermen lezen dit als $words. */
export const words = writable([]);

let current = [];
words.subscribe((v) => (current = v));

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Kon niet opslaan in localStorage:', e);
  }
}

function init() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      words.set(JSON.parse(raw));
      return;
    }
  } catch (e) {
    console.warn('Kon opgeslagen woorden niet lezen:', e);
  }
  // Eerste keer: vul met een paar voorbeeldwoorden zodat het niet leeg is.
  words.set(sampleWords());
  persist();
}

/** Voeg een nieuw woord toe. */
export async function addWord(data) {
  const word = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    japanese: '',
    reading: '',
    meaning: '',
    example: '',
    source: 'Anders',
    tags: [],
    ...data,
  };
  words.update((list) => [word, ...list]);
  persist();
  return word;
}

/** Pas een bestaand woord aan. */
export async function updateWord(id, patch) {
  words.update((list) => list.map((w) => (w.id === id ? { ...w, ...patch } : w)));
  persist();
}

/** Verwijder een woord. */
export async function deleteWord(id) {
  words.update((list) => list.filter((w) => w.id !== id));
  persist();
}

/** De mogelijke bronnen waar een woord vandaan komt. */
export const SOURCES = ['Genki', 'WaniKani', 'Gesprek', 'Anders'];

function sampleWords() {
  const now = Date.now();
  const day = 86400000;
  const make = (o, ageDays) => ({
    id: crypto.randomUUID(),
    createdAt: new Date(now - ageDays * day).toISOString(),
    tags: [],
    ...o,
  });
  return [
    make({ japanese: '言葉', reading: 'ことば', meaning: 'woord; taal', example: '', source: 'WaniKani', tags: ['zelfstandig nw'] }, 0),
    make({ japanese: '勉強', reading: 'べんきょう', meaning: 'studeren; studie', example: '日本語を勉強しています。', source: 'Genki', tags: ['werkwoord'] }, 1),
    make({ japanese: '元気', reading: 'げんき', meaning: 'gezond; energiek', example: 'お元気ですか。', source: 'Genki', tags: ['begroeting'] }, 2),
    make({ japanese: '友達', reading: 'ともだち', meaning: 'vriend', example: '友達と話しました。', source: 'Gesprek', tags: ['mensen'] }, 3),
    make({ japanese: '難しい', reading: 'むずかしい', meaning: 'moeilijk', example: '漢字は難しいです。', source: 'WaniKani', tags: ['bijvoeglijk nw'] }, 5),
    make({ japanese: 'ありがとう', reading: '', meaning: 'dank je wel', example: '', source: 'Gesprek', tags: ['begroeting'] }, 6),
  ];
}

init();
