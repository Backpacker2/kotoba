<script>
  import { words, loading, dbError, SOURCES } from './lib/db.js';
  import WordCard from './lib/WordCard.svelte';
  import WordForm from './lib/WordForm.svelte';

  let query = $state('');
  let activeSource = $state('Alle');
  let formOpen = $state(false);
  let editing = $state(null); // welk woord wordt bewerkt (of null)

  const filters = ['Alle', ...SOURCES];

  // Gefilterde + gesorteerde lijst (nieuwste eerst).
  let visible = $derived(
    $words
      .filter((w) => activeSource === 'Alle' || w.source === activeSource)
      .filter((w) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return [w.japanese, w.reading, w.meaning, w.example, ...(w.tags ?? [])]
          .join(' ')
          .toLowerCase()
          .includes(q);
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  );

  // Statistiek voor de motivatie-balk.
  let weekCount = $derived(
    $words.filter((w) => Date.now() - new Date(w.createdAt).getTime() < 7 * 86400000).length
  );

  function openNew() {
    editing = null;
    formOpen = true;
  }
  function openEdit(word) {
    editing = word;
    formOpen = true;
  }
  function closeForm() {
    formOpen = false;
    editing = null;
  }
</script>

<div class="wrap">
  <header class="head">
    <div class="brand">
      <h1><span class="kanji">言葉箱</span> <span class="latin">Kotobako</span></h1>
      <p class="tagline">Jouw eigen woordendoos voor Japans</p>
    </div>
    <button class="btn btn-primary add" onclick={openNew}>＋ Woord toevoegen</button>
  </header>

  {#if $dbError}
    <div class="banner error">{$dbError}</div>
  {/if}

  <section class="stats">
    <div class="stat"><b>{$words.length}</b><span>woorden bewaard</span></div>
    <div class="stat"><b>{weekCount}</b><span>deze week toegevoegd</span></div>
  </section>

  {#if formOpen}
    <section class="formslot">
      <WordForm {editing} onclose={closeForm} />
    </section>
  {/if}

  <section class="controls">
    <input class="field search" bind:value={query} placeholder="Zoek op woord, lezing, betekenis of label…" />
    <div class="chips">
      {#each filters as f}
        <button
          class="chip"
          class:active={activeSource === f}
          onclick={() => (activeSource = f)}
        >{f}</button>
      {/each}
    </div>
  </section>

  {#if $loading}
    <div class="empty">
      <p class="big">Laden…</p>
      <p>Je woorden worden uit de cloud opgehaald.</p>
    </div>
  {:else if visible.length === 0}
    <div class="empty">
      {#if $words.length === 0}
        <p class="big">Nog geen woorden 📖</p>
        <p>Voeg je eerste Japanse woord toe en bouw je verzameling op.</p>
      {:else}
        <p class="big">Niets gevonden</p>
        <p>Pas je zoekopdracht of filter aan.</p>
      {/if}
    </div>
  {:else}
    <div class="grid">
      {#each visible as word (word.id)}
        <WordCard {word} onedit={openEdit} />
      {/each}
    </div>
  {/if}

  <footer class="foot">
    <span>{visible.length} van {$words.length} getoond</span>
    <span>·</span>
    <span>☁︎ Gesynct via de cloud — zichtbaar op al je apparaten</span>
  </footer>
</div>

<style>
  .wrap {
    max-width: var(--max-w);
    margin: 0 auto;
    padding: 28px 20px 60px;
  }
  .head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--accent);
  }
  .brand h1 { font-size: 1.5rem; display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; }
  .kanji { font-family: var(--font-jp); font-size: 1.9rem; letter-spacing: .04em; }
  .latin { color: var(--accent); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; font-size: .95rem; }
  .tagline { margin: 4px 0 0; color: var(--ink-soft); font-size: .95rem; }
  .add { white-space: nowrap; }

  .stats { display: flex; gap: 28px; margin: 22px 0 4px; }
  .stat { display: flex; flex-direction: column; }
  .stat b { font-size: 1.7rem; font-weight: 700; line-height: 1; }
  .stat span { font-size: .82rem; color: var(--ink-soft); margin-top: 4px; }

  .banner {
    margin: 18px 0 0;
    padding: 12px 16px;
    border-radius: var(--radius-sm);
    font-size: .92rem;
  }
  .banner.error {
    background: var(--accent-bg);
    color: var(--accent-ink);
    border: 1px solid #eecbc6;
  }

  .formslot { margin: 20px 0 8px; }

  .controls { margin: 22px 0 18px; display: flex; flex-direction: column; gap: 14px; }
  .search { max-width: 100%; }
  .chips { display: flex; gap: 8px; flex-wrap: wrap; }
  .chip {
    border: 1px solid var(--line);
    background: var(--card);
    color: var(--ink-soft);
    padding: 6px 14px;
    border-radius: 999px;
    font-size: .88rem;
    font-weight: 500;
    transition: all .15s;
  }
  .chip:hover { border-color: var(--ink-soft); }
  .chip.active { background: var(--ink); border-color: var(--ink); color: #fff; }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--gap);
  }

  .empty {
    text-align: center;
    padding: 60px 20px;
    color: var(--ink-soft);
  }
  .empty .big { font-size: 1.2rem; color: var(--ink); font-weight: 600; margin: 0 0 6px; }
  .empty p { margin: 0; }

  .foot {
    margin-top: 34px;
    padding-top: 16px;
    border-top: 1px solid var(--line);
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    color: var(--ink-soft);
    font-size: .8rem;
  }

  @media (max-width: 520px) {
    .stat b { font-size: 1.4rem; }
    .kanji { font-size: 1.6rem; }
  }
</style>
