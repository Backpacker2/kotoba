<script>
  import { signIn, signUp } from './auth.js';

  let mode = $state('in'); // 'in' = inloggen, 'up' = account maken
  let email = $state('');
  let password = $state('');
  let error = $state('');
  let info = $state('');
  let busy = $state(false);

  async function submit() {
    error = '';
    info = '';
    if (!email.trim() || !password) {
      error = 'Vul je e-mail en wachtwoord in.';
      return;
    }
    if (mode === 'up' && password.length < 6) {
      error = 'Kies een wachtwoord van minstens 6 tekens.';
      return;
    }
    busy = true;
    if (mode === 'in') {
      const { error: e } = await signIn(email.trim(), password);
      if (e) error = vertaal(e.message);
    } else {
      const { data, error: e } = await signUp(email.trim(), password);
      if (e) {
        error = vertaal(e.message);
      } else if (!data.session) {
        // E-mailbevestiging staat aan.
        info = 'Bijna klaar! Check je e-mail om je account te bevestigen, en log daarna in.';
        mode = 'in';
      }
      // Anders logt onAuthStateChange je automatisch in.
    }
    busy = false;
  }

  function vertaal(msg = '') {
    if (msg.includes('Invalid login')) return 'E-mail of wachtwoord klopt niet.';
    if (msg.includes('already registered')) return 'Er bestaat al een account met deze e-mail.';
    if (msg.includes('Email not confirmed')) return 'Bevestig eerst je e-mail (check je inbox).';
    return msg || 'Er ging iets mis. Probeer het opnieuw.';
  }
</script>

<div class="screen">
  <div class="card">
    <div class="brand">
      <span class="kanji">言葉</span>
      <span class="latin">Kotoba</span>
    </div>
    <p class="sub">{mode === 'in' ? 'Log in om verder te gaan' : 'Maak een gratis account'}</p>

    <form onsubmit={(e) => { e.preventDefault(); submit(); }}>
      <label>
        <span>E-mail</span>
        <input class="field" type="email" bind:value={email} placeholder="jij@voorbeeld.nl" autocomplete="email" />
      </label>
      <label>
        <span>Wachtwoord</span>
        <input class="field" type="password" bind:value={password} placeholder="••••••••" autocomplete={mode === 'in' ? 'current-password' : 'new-password'} />
      </label>

      {#if error}<p class="msg error">{error}</p>{/if}
      {#if info}<p class="msg info">{info}</p>{/if}

      <button type="submit" class="btn btn-primary full" disabled={busy}>
        {busy ? 'Even geduld…' : mode === 'in' ? 'Inloggen' : 'Account maken'}
      </button>
    </form>

    <p class="switch">
      {#if mode === 'in'}
        Nog geen account?
        <button class="link" onclick={() => { mode = 'up'; error = ''; info = ''; }}>Maak er gratis een</button>
      {:else}
        Heb je al een account?
        <button class="link" onclick={() => { mode = 'in'; error = ''; info = ''; }}>Inloggen</button>
      {/if}
    </p>
  </div>

  <p class="foot">Gratis: tot 500 woorden · Premium: onbeperkt + oefenmodus</p>
</div>

<style>
  .screen {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 24px;
  }
  .card {
    width: 100%;
    max-width: 380px;
    background: var(--card);
    border: 1px solid var(--line);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    padding: 28px 26px;
  }
  .brand { display: flex; align-items: baseline; gap: 10px; }
  .kanji { font-family: var(--font-jp); font-size: 2rem; letter-spacing: .04em; }
  .latin { color: var(--accent); font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
  .sub { margin: 6px 0 20px; color: var(--ink-soft); }
  form { display: flex; flex-direction: column; gap: 14px; }
  label { display: flex; flex-direction: column; gap: 5px; }
  label > span { font-size: .82rem; color: var(--ink-soft); font-weight: 500; }
  .full { width: 100%; margin-top: 4px; }
  .msg { margin: 0; font-size: .88rem; }
  .msg.error { color: var(--accent-ink); }
  .msg.info { color: var(--green-ink); }
  .switch { margin: 18px 0 0; font-size: .9rem; color: var(--ink-soft); text-align: center; }
  .link {
    border: none; background: none; color: var(--accent);
    font-weight: 600; font-size: .9rem; cursor: pointer; padding: 0;
  }
  .link:hover { text-decoration: underline; }
  .foot { color: var(--ink-soft); font-size: .82rem; }
</style>
