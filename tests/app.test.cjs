const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const tick = () => new Promise(resolve => setTimeout(resolve, 15));
const user = id => ({ id, email: `${id}@example.test`, user_metadata: { name: id } });
function boot({ id = null, storage = {}, config = {}, load } = {}) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
    url: 'https://mypantry.example.test/', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const w = dom.window;
  let listener, saved = id ? { user: user(id) } : null;
  const queries = [];
  w.matchMedia = () => ({ matches: false });
  w.HTMLElement.prototype.scrollTo = function () {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  w.MYPANTRY_CONFIG = { supabaseUrl: 'https://example.supabase.co', supabaseKey: 'test', ...config };
  w.supabase = { createClient: () => ({
    auth: {
      onAuthStateChange(fn) { listener = fn; return { data: { subscription: { unsubscribe() {} } } }; },
      async getSession() { return { data: { session: saved } }; },
      async signInWithPassword({ email, password }) {
        if (password === 'bad') return { error: new Error('Invalid login credentials') };
        saved = { user: user(email.split('@')[0]) }; listener('SIGNED_IN', saved);
        return { data: { session: saved } };
      },
      async signOut() { saved = null; listener('SIGNED_OUT', null); return {}; },
      async signUp() { return { data: { session: null } }; }
    },
    from(table) { return { select() { return this; }, eq(column, value) { queries.push({ table, column, value }); return this; },
      order() { return load ? load() : Promise.resolve({ data: [], error: null }); } }; }
  }) };
  w.eval(fs.readFileSync(path.join(root, 'auth.js'), 'utf8'));
  w.eval(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
  return { dom, w, queries, emit(event, id) { listener(event, id ? { user: user(id) } : null); },
    click(selector) { const el = w.document.querySelector(selector); assert.ok(el, selector); el.click(); },
    text: () => w.document.querySelector('#app').textContent,
    form(selector, values) { for (const [id, value] of Object.entries(values)) w.document.getElementById(id).value = value;
      w.document.querySelector(selector).dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); }
  };
}
test('actual app restores Alice, scopes pantry query, and signs out across reload', async t => {
  const f = boot({ id: 'alice' }); t.after(() => f.dom.window.close()); await tick();
  assert.match(f.text(), /Pantry Pal/);
  assert.deepEqual(f.queries, [{ table: 'pantry_item', column: 'auth_user_id', value: 'alice' }]);
  f.click('[data-act="tab"][data-arg="settings"]');
  assert.match(f.text(), /alice@example.test/);
  f.click('[data-act="logout"]'); await tick(); assert.match(f.text(), /Sign in/);
  assert.doesNotMatch(f.text(), /alice@example.test/);
  const next = boot(); t.after(() => next.dom.window.close()); await tick(); assert.match(next.text(), /Sign in/);
});
test('token refresh preserves the current screen', async t => {
  const f = boot({ id: 'alice' }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="settings"]'); f.emit('TOKEN_REFRESHED', 'alice'); await tick();
  assert.match(f.text(), /Settings/); assert.equal(f.queries.length, 1);
});
test('account switch isolates saved recipes and ignores legacy demo state', async t => {
  const f = boot({ id: 'alice', storage: { mp_state_v1: { saved: ['demo'] },
    'mp_state_v2:alice': { saved: ['r1', 'r2'] }, 'mp_state_v2:bob': { saved: [] } } });
  t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="settings"]'); assert.match(f.text(), /2 recipes in your library/);
  f.emit('SIGNED_IN', 'bob'); await tick();
  f.click('[data-act="tab"][data-arg="settings"]'); assert.match(f.text(), /0 recipes in your library/);
  assert.match(f.text(), /bob@example.test/);
  assert.equal(JSON.parse(f.w.localStorage.getItem('mp_state_v2:alice')).saved.length, 2);
});
test('late pantry response after logout cannot repopulate the next account', async t => {
  let finish;
  const f = boot({ id: 'alice', load: () => new Promise(resolve => { finish = resolve; }) });
  t.after(() => f.dom.window.close()); await tick();
  f.emit('SIGNED_OUT', null); await tick();
  finish({ data: [{ ingredient_id: 1, ingredient_name: 'Private food', expiration_date: '2030-01-01', quantity: 1 }], error: null });
  await tick(); assert.match(f.text(), /Sign in/); assert.doesNotMatch(f.text(), /Private food/);
});
test('bad credentials display an error without entering the pantry', async t => {
  const f = boot(); t.after(() => f.dom.window.close()); await tick();
  f.form('#loginForm', { li_email: 'alice@example.test', li_pw: 'bad' }); await tick();
  assert.match(f.text(), /Invalid login credentials/); assert.equal(f.queries.length, 0);
});
test('connected mode blocks prototype bypasses', async t => {
  const f = boot(); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-tool="skip"]'); assert.match(f.text(), /Sign in/); assert.equal(f.queries.length, 0);
  assert.equal(f.w.document.querySelector('.tools').hidden, true);
});
test('missing configuration cannot silently enable demo access', async t => {
  const f = boot({ config: { supabaseUrl: '' } }); t.after(() => f.dom.window.close()); await tick();
  assert.match(f.text(), /Sign-in is unavailable/); f.click('[data-tool="skip"]'); assert.doesNotMatch(f.text(), /Pantry Pal/);
});
test('recovery event opens the real password form and keeps it through refresh', async t => {
  const f = boot({ id: 'alice' }); t.after(() => f.dom.window.close()); await tick();
  f.emit('PASSWORD_RECOVERY', 'alice'); await tick(); assert.match(f.text(), /Choose a new password/);
  f.emit('TOKEN_REFRESHED', 'alice'); await tick(); assert.match(f.text(), /Choose a new password/);
});
