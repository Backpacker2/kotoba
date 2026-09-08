<script>
  import { addWord, updateWord, SOURCES } from './db.js';

  // `editing` is null bij een nieuw woord, of een bestaand woord bij bewerken.
  let { editing = null, onclose } = $props();

  // Beginwaarden één keer overnemen in bewerkbare velden.
  // (Het formulier wordt telkens opnieuw geopend, dus dit is precies wat we willen.)
  const start = editing ?? {};
  let japanese = $state(start.japanese ?? '');
  let reading  = $state(start.reading ?? '');
  let meaning  = $state(start.meaning ?? '');
  let example  = $state(start.example ?? '');
  let source   = $state(start.source ?? 'Genki');
  let tagsText = $state((start.tags ?? []).join(', '));

  let error = $state('');

  async function save() {
    if (!japanese.trim() || !meaning.trim()) {
      error = 'Vul minstens het Japanse woord en de betekenis in.';
      return;
    }
    const data = {
      japanese: japanese.trim(),
      reading: reading.trim(),
      meaning: meaning.trim(),
      example: example.trim(),
      source,
      tags: tagsText.split(',').map((t) => t.trim()).filter(Boolean),
    };
    if (editing) {
      await updateWord(editing.id, data);
    } else {
      await addWord(data);
    }
    onclose?.();
  }
</script>

<form class="form" onsubmit={(e) => { e.preventDefault(); save(); }}>
  <h2>{editing ? 'Woord bewerken' : 'Nieuw woord'}</h2>

  <div class="row">
    <label class="col">
      <span>Japans <b>*</b></span>
      <input class="field jp-input" bind:value={japanese} placeholder="例: 勉強" autocomplete="off" />
    </label>
    <label class="col">
      <span>Lezing (kana)</span>
      <input class="field jp-input" bind:value={reading} placeholder="べんきょう" autocomplete="off" />
    </label>
  </div>

  <label class="col">
    <span>Betekenis <b>*</b></span>
    <input class="field" bind:value={meaning} placeholder="studeren; studie" autocomplete="off" />
  </label>

  <label class="col">
    <span>Voorbeeldzin</span>
    <input class="field jp-input" bind:value={example} placeholder="日本語を勉強しています。" autocomplete="off" />
  </label>

  <div class="row">
    <label class="col">
      <span>Bron</span>
      <select class="field" bind:value={source}>
        {#each SOURCES as s}
          <option value={s}>{s}</option>
        {/each}
      </select>
    </label>
    <label class="col">
      <span>Labels (komma-gescheiden)</span>
      <input class="field" bind:value={tagsText} placeholder="werkwoord, N5" autocomplete="off" />
    </label>
  </div>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <div class="buttons">
    <button type="button" class="btn" onclick={() => onclose?.()}>Annuleren</button>
    <button type="submit" class="btn btn-primary">{editing ? 'Opslaan' : 'Toevoegen'}</button>
  </div>
</form>

<style>
  .form {
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  h2 { font-size: 1.15rem; }
  .row { display: flex; gap: 12px; flex-wrap: wrap; }
  .col { display: flex; flex-direction: column; gap: 5px; }
  .row .col { flex: 1 1 180px; }
  .col > span { font-size: .82rem; color: var(--ink-soft); font-weight: 500; }
  .col b { color: var(--accent); }
  .jp-input { font-family: var(--font-jp); }
  .error { margin: 0; color: var(--accent-ink); font-size: .88rem; }
  .buttons { display: flex; justify-content: flex-end; gap: 10px; margin-top: 2px; }
</style>
