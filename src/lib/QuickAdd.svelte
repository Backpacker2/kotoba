<script>
  import { addWord } from './db.js';

  let japanese = $state('');
  let meaning = $state('');
  let jpInput = $state(null);
  let saving = $state(false);

  async function quickSave() {
    if (!japanese.trim() || !meaning.trim() || saving) return;
    saving = true;
    await addWord({
      japanese: japanese.trim(),
      meaning: meaning.trim(),
      source: 'Anders',
    });
    japanese = '';
    meaning = '';
    saving = false;
    jpInput?.focus(); // meteen door naar het volgende woord
  }
</script>

<form class="quick" onsubmit={(e) => { e.preventDefault(); quickSave(); }}>
  <span class="label">Snel toevoegen</span>
  <input
    class="field jp"
    bind:value={japanese}
    bind:this={jpInput}
    placeholder="日本語"
    autocomplete="off"
    aria-label="Japans woord"
  />
  <span class="arrow">→</span>
  <input
    class="field"
    bind:value={meaning}
    placeholder="vertaling"
    autocomplete="off"
    aria-label="Vertaling"
  />
  <button type="submit" class="btn btn-primary add" disabled={!japanese.trim() || !meaning.trim()}>
    ＋
  </button>
</form>

<style>
  .quick {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow-sm);
    padding: 10px 12px;
  }
  .label {
    font-size: .8rem;
    color: var(--ink-soft);
    font-weight: 500;
    white-space: nowrap;
  }
  .field { flex: 1 1 120px; min-width: 0; }
  .jp { font-family: var(--font-jp); }
  .arrow { color: var(--ink-soft); }
  .add {
    padding: 9px 14px;
    font-size: 1.1rem;
    line-height: 1;
    flex-shrink: 0;
  }
  .add:disabled { opacity: .45; cursor: default; }

  @media (max-width: 560px) {
    .quick { flex-wrap: wrap; }
    .label { width: 100%; }
    .field { flex: 1 1 40%; }
  }
</style>
