/* ============================================================
   furigana.js — bepaalt automatisch de lezing (hiragana) van
   Japanse tekst met kanji, met behulp van kuromoji.

   Het woordenboek (public/dict/*.dat.gz, ~17MB ingepakt) wordt LAZY
   geladen: pas de eerste keer dat je 'm nodig hebt. Daarna onthoudt
   de browser het.

   We laden de bestanden zelf in (in plaats van kuromoji's eigen lader)
   en pakken ze alleen uit als de server dat niet al deed — sommige
   servers sturen .gz-bestanden namelijk al uitgepakt terug
   (Content-Encoding: gzip). Zo werkt het zowel lokaal als online.
   ============================================================ */

import { gunzipSync } from 'fflate';
import Tokenizer from '@sglkc/kuromoji/src/Tokenizer';
import DynamicDictionaries from '@sglkc/kuromoji/src/dict/DynamicDictionaries';

let tokenizerPromise = null;

// Katakana -> hiragana (ze staan 0x60 uit elkaar in Unicode).
function kataToHira(str) {
  return str.replace(/[ァ-ヶ]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}

// Bevat de tekst kanji? (dan is een lezing zinvol)
function hasKanji(str) {
  return /[一-龯㐀-䶿]/.test(str);
}

// Haal een woordenboekbestand op en pak het uit indien nodig.
async function fetchDict(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Kon ${url} niet laden (${res.status})`);
  let bytes = new Uint8Array(await res.arrayBuffer());
  // Gzip-magie (1f 8b)? Dan zelf uitpakken; anders deed de server het al.
  if (bytes[0] === 0x1f && bytes[1] === 0x8b) bytes = gunzipSync(bytes);
  return bytes;
}

// Typed-array-weergaves die netjes rekening houden met de byte-offset.
const asInt32 = (u8) => new Int32Array(u8.buffer, u8.byteOffset, u8.byteLength / 4);
const asInt16 = (u8) => new Int16Array(u8.buffer, u8.byteOffset, u8.byteLength / 2);
const asUint32 = (u8) => new Uint32Array(u8.buffer, u8.byteOffset, u8.byteLength / 4);

// Bouw de tokenizer één keer op uit de woordenboekbestanden.
async function buildTokenizer() {
  const base = import.meta.env.BASE_URL + 'dict/';
  const names = [
    'base.dat.gz', 'check.dat.gz',
    'tid.dat.gz', 'tid_pos.dat.gz', 'tid_map.dat.gz',
    'cc.dat.gz',
    'unk.dat.gz', 'unk_pos.dat.gz', 'unk_map.dat.gz', 'unk_char.dat.gz', 'unk_compat.dat.gz', 'unk_invoke.dat.gz',
  ];
  const [b, c, tid, tidPos, tidMap, cc, unk, unkPos, unkMap, unkChar, unkCompat, unkInvoke] =
    await Promise.all(names.map((n) => fetchDict(base + n)));

  const dic = new DynamicDictionaries();
  dic.loadTrie(asInt32(b), asInt32(c));
  dic.loadTokenInfoDictionaries(tid, tidPos, tidMap);
  dic.loadConnectionCosts(asInt16(cc));
  dic.loadUnknownDictionaries(unk, unkPos, unkMap, unkChar, asUint32(unkCompat), unkInvoke);
  return new Tokenizer(dic);
}

function getTokenizer() {
  if (!tokenizerPromise) tokenizerPromise = buildTokenizer();
  return tokenizerPromise;
}

/**
 * Geeft de hiragana-lezing van `text`, of '' als er geen kanji in zit
 * (of als de lezing niet te bepalen is).
 */
export async function readingFor(text) {
  if (!text || !hasKanji(text)) return '';
  try {
    const tokenizer = await getTokenizer();
    const tokens = tokenizer.tokenize(text);
    const reading = tokens
      .map((t) => (t.reading && t.reading !== '*' ? t.reading : t.surface_form))
      .join('');
    const hira = kataToHira(reading);
    return hira && hira !== text ? hira : '';
  } catch (e) {
    console.warn('Kon de lezing niet bepalen:', e);
    return '';
  }
}
