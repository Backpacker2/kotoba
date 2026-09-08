<script>
  import { deleteWord } from './db.js';

  let { word, onedit } = $props();

  // Bron -> kleurthema (zie app.css)
  const sourceClass = {
    Genki: 'src-genki',
    WaniKani: 'src-wanikani',
    Gesprek: 'src-gesprek',
    Anders: 'src-anders',
  };

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    } catch {
      return '';
    }
  }

  function remove() {
    if (confirm(`"${word.japanese}" verwijderen?`)) deleteWord(word.id);
  }
</script>

<article class="card">
  <div class="top">
    <div class="jp">
      {#if word.reading}
        <ruby>{word.japanese}<rt>{word.reading}</rt></ruby>
      {:else}
        {word.japanese}
      {/if}
    </div>
    <div class="actions">
      <button class="icon" title="Bewerken" onclick={() => onedit?.(word)} aria-label="Bewerken">✎</button>
      <button class="icon" title="Verwijderen" onclick={remove} aria-label="Verwijderen">✕</button>
    </div>
  </div>

  <p class="meaning">{word.meaning}</p>

  {#if word.example}
    <p class="example">{word.example}</p>
  {/if}

  <div class="meta">
    <span class="badge {sourceClass[word.source] ?? 'src-anders'}">{word.source}</span>
    {#each word.tags ?? [] as tag}
      <span class="tag">{tag}</span>
    {/each}
    <span class="date">{formatDate(word.createdAt)}</span>
  </div>
</article>

<style>
  .card {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    padding: 18px 18px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    transition: box-shadow .18s, transform .18s, border-color .18s;
  }
  .card:hover {
    box-shadow: var(--shadow);
    transform: translateY(-2px);
    border-color: #dcd4c4;
  }
  .top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
  .jp {
    font-family: var(--font-jp);
    font-size: 2rem;
    line-height: 1.25;
    letter-spacing: .02em;
  }
  .actions { display: flex; gap: 2px; opacity: 0; transition: opacity .15s; }
  .card:hover .actions, .card:focus-within .actions { opacity: 1; }
  /* Op aanraakschermen (telefoon) is er geen hover: altijd tonen. */
  @media (hover: none), (max-width: 520px) {
    .actions { opacity: 1; }
  }
  .icon {
    border: none;
    background: transparent;
    color: var(--ink-soft);
    width: 28px; height: 28px;
    border-radius: 7px;
    font-size: .9rem;
    line-height: 1;
  }
  .icon:hover { background: var(--paper); color: var(--ink); }
  .meaning { margin: 0; font-size: 1.05rem; font-weight: 500; }
  .example {
    margin: 0;
    font-family: var(--font-jp);
    color: var(--ink-soft);
    font-size: .98rem;
    padding-left: 10px;
    border-left: 2px solid var(--line);
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }
  .badge {
    font-size: .72rem;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 999px;
  }
  .src-genki    { background: var(--indigo-bg); color: var(--indigo); }
  .src-wanikani { background: var(--accent-bg); color: var(--accent-ink); }
  .src-gesprek  { background: var(--green-bg); color: var(--green-ink); }
  .src-anders   { background: #ece7dc; color: var(--ink-soft); }
  .tag {
    font-size: .72rem;
    color: var(--ink-soft);
    background: var(--paper);
    border: 1px solid var(--line);
    padding: 2px 8px;
    border-radius: 999px;
  }
  .date { margin-left: auto; font-size: .72rem; color: var(--ink-soft); }
</style>
