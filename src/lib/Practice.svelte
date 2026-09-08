<script>
  import { get } from 'svelte/store';
  import { words, reviewWord, isDue } from './db.js';

  let { onclose } = $props();

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Momentopname van de woorden die nu toe zijn (niet reactief).
  let queue = $state(shuffle(get(words).filter((w) => isDue(w))));
  let idx = $state(0);
  let revealed = $state(false);
  let done = $state(0); // aantal beoordeeld

  let current = $derived(queue[idx] ?? null);
  let total = $derived(queue.length);

  async function rate(correct) {
    const word = current;
    if (!word) return;
    revealed = false;
    done += 1;
    await reviewWord(word, correct);
    // Fout? Zet 'm achteraan zodat je 'm deze sessie nog een keer ziet.
    if (!correct) queue = [...queue, word];
    idx += 1;
  }

  function onKey(e) {
    if (!current) return;
    if (!revealed && (e.key === ' ' || e.key === 'Enter')) {
      e.preventDefault();
      revealed = true;
    } else if (revealed) {
      if (e.key === '1' || e.key === 'ArrowLeft') { e.preventDefault(); rate(false); }
      if (e.key === '2' || e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); rate(true); }
    }
  }
</script>

<svelte:window onkeydown={onKey} />

<div class="overlay">
  <div class="bar">
    <span class="progress">{Math.min(done + 1, total)} / {total}</span>
    <button class="close" onclick={() => onclose?.()} aria-label="Sluiten">✕</button>
  </div>

  {#if !current}
    <div class="panel done">
      {#if total === 0}
        <p class="big">Niets te herhalen 🎉</p>
        <p>Je bent helemaal bij. Kom later terug, of voeg nieuwe woorden toe.</p>
      {:else}
        <p class="big">Goed gedaan! 🎉</p>
        <p>Je hebt {done} {done === 1 ? 'herhaling' : 'herhalingen'} gedaan.</p>
      {/if}
      <button class="btn btn-primary" onclick={() => onclose?.()}>Sluiten</button>
    </div>
  {:else}
    <div class="panel card">
      <div class="front">
        {#if revealed && current.reading}
          <ruby>{current.japanese}<rt>{current.reading}</rt></ruby>
        {:else}
          {current.japanese}
        {/if}
      </div>

      {#if revealed}
        <div class="answer">
          <p class="meaning">{current.meaning}</p>
          {#if current.example}<p class="example">{current.example}</p>{/if}
        </div>
        <div class="rate">
          <button class="btn fout" onclick={() => rate(false)}>Fout</button>
          <button class="btn goed" onclick={() => rate(true)}>Goed</button>
        </div>
      {:else}
        <button class="btn btn-primary reveal" onclick={() => (revealed = true)}>Toon antwoord</button>
        <p class="hint">Denk aan de lezing en betekenis · <kbd>spatie</kbd></p>
      {/if}
    </div>
  {/if}
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: var(--paper);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
  }
  .bar {
    width: 100%;
    max-width: 560px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 2px 0;
  }
  .progress { color: var(--ink-soft); font-size: .9rem; font-weight: 600; }
  .close {
    border: none; background: transparent; color: var(--ink-soft);
    font-size: 1.1rem; width: 36px; height: 36px; border-radius: 8px; cursor: pointer;
  }
  .close:hover { background: var(--card); color: var(--ink); }

  .panel {
    width: 100%;
    max-width: 560px;
    margin: auto;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 40px 28px;
    text-align: center;
  }
  .card { display: flex; flex-direction: column; gap: 22px; align-items: center; }
  .front {
    font-family: var(--font-jp);
    font-size: 3.4rem;
    line-height: 1.2;
    letter-spacing: .03em;
  }
  .answer { display: flex; flex-direction: column; gap: 10px; }
  .meaning { margin: 0; font-size: 1.35rem; font-weight: 600; }
  .example {
    margin: 0; font-family: var(--font-jp); color: var(--ink-soft); font-size: 1.05rem;
  }
  .reveal { min-width: 200px; }
  .hint { margin: 0; color: var(--ink-soft); font-size: .82rem; }
  kbd {
    background: var(--paper); border: 1px solid var(--line); border-radius: 5px;
    padding: 1px 6px; font-size: .78rem;
  }

  .rate { display: flex; gap: 12px; width: 100%; max-width: 340px; }
  .rate .btn { flex: 1; padding: 14px; font-size: 1rem; font-weight: 600; }
  .fout { background: var(--card); border-color: var(--line); color: var(--ink-soft); }
  .fout:hover { border-color: var(--ink-soft); color: var(--ink); }
  .goed { background: var(--green-ink); border-color: var(--green-ink); color: #fff; }
  .goed:hover { filter: brightness(1.05); }

  .done { display: flex; flex-direction: column; gap: 12px; align-items: center; }
  .done .big { font-size: 1.5rem; font-weight: 700; margin: 0; }
  .done p { margin: 0; color: var(--ink-soft); }
  .done .btn { margin-top: 10px; }
</style>
