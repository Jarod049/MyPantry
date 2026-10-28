const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const tick = () => new Promise(resolve => setTimeout(resolve, 15));
const user = id => ({ id, email: `${id}@example.test`, user_metadata: { name: id } });
function boot({ id = null, storage = {}, navigation = {}, config = {}, load, database, tables = {}, insertError, insertWait } = {}) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
    url: 'https://mypantry.example.test/', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const w = dom.window;
  let listener, saved = id ? { user: user(id), access_token: 'test-session' } : null;
  const queries = [];
  const mockTables = Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.map(row => ({ ...row }))]));
  w.matchMedia = () => ({ matches: false });
  w.HTMLElement.prototype.scrollTo = function () {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  Object.entries(navigation).forEach(([key, value]) => w.sessionStorage.setItem(key, JSON.stringify(value)));
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
    from(table) {
      let action = null, rowsToWrite = null, single = false, limitCount = null;
      const filters = {};
      const builder = {
        insert(rows) { action = 'insert'; rowsToWrite = Array.isArray(rows) ? rows : [rows]; queries.push({ table, insert: rowsToWrite }); return this; },
        upsert(rows) { action = 'upsert'; rowsToWrite = Array.isArray(rows) ? rows : [rows]; queries.push({ table, upsert: rowsToWrite }); return this; },
        update(rows) { action = 'update'; rowsToWrite = rows; queries.push({ table, update: rows }); return this; },
        select() { return this; },
        eq(column, value) { filters[column] = value; queries.push({ table, column, value }); return this; },
        order() { return this; },
        limit(value) { limitCount = value; return this; },
        maybeSingle() { single = true; return this; },
        single() { single = true; return this; },
        then(resolve, reject) { return Promise.resolve().then(async () => {
          if (action === 'insert' || action === 'upsert') {
            if (action === 'insert' && table === 'pantry_item' && insertWait) await insertWait;
            if (action === 'insert' && table === 'pantry_item' && insertError) return { data: null, error: new Error(insertError) };
            const target = table === 'pantry_item' ? (database || []) : (mockTables[table] ||= []);
            const written = rowsToWrite.map((row, i) => ({ ...row,
              ...(table === 'pantry_item' ? { ingredient_id: (database?.length || 0) + i + 1 } : {}),
              ...(table === 'app_sessions' ? { started_at: new Date().toISOString(), last_active_at: new Date().toISOString(), ended_at: null, end_reason: null } : {})
            }));
            if (action === 'upsert') {
              for (const row of written) {
                const key = table === 'chat_conversations' ? 'conversation_id' : 'user_id';
                const existing = target.findIndex(item => item[key] === row[key]);
                if (existing < 0) target.push(row); else target[existing] = { ...target[existing], ...row };
              }
            } else target.push(...written);
            return { data: written, error: null };
          }
          if (action === 'update') {
            const target = table === 'pantry_item' ? (database || []) : (mockTables[table] || []);
            const updated = target.filter(row => Object.entries(filters).every(([key, value]) => row[key] === value));
            updated.forEach(row => Object.assign(row, rowsToWrite));
            return { data: updated, error: null };
          }
          let result = table === 'pantry_item'
            ? (load ? await load() : { data: (database || []).filter(row => Object.entries(filters).every(([key, value]) => row[key] === value)), error: null })
            : { data: (mockTables[table] || []).filter(row => Object.entries(filters).every(([key, value]) => row[key] === value)), error: null };
          let data = result.data;
          if (Array.isArray(data) && limitCount != null) data = data.slice(0, limitCount);
          return single ? { data: Array.isArray(data) ? data[0] || null : data, error: result.error } : { ...result, data };
        }).then(resolve, reject); }
      };
      return builder;
    }
  }) };
  w.eval(fs.readFileSync(path.join(root, 'auth.js'), 'utf8'));
  w.eval(fs.readFileSync(path.join(root, 'app.js'), 'utf8'));
  return { dom, w, queries, mockTables, emit(event, id) { listener(event, id ? { user: user(id) } : null); },
    click(selector) { const el = w.document.querySelector(selector); assert.ok(el, selector); el.click(); },
    text: () => w.document.querySelector('#app').textContent,
    form(selector, values) { for (const [id, value] of Object.entries(values)) w.document.getElementById(id).value = value;
      w.document.querySelector(selector).dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); }
  };
}
function enterIngredient(f, name = 'Persistence test apples') {
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="manual"]');
  for (const [id, value] of Object.entries({ f_name: name, f_qty: '3', f_unit: 'ct', f_cat: 'Produce', f_exp: '2030-01-01' })) {
    f.w.document.getElementById(id).value = value;
  }
  f.click('#f_store [data-store="Pantry"]');
  f.click('#saveItemBtn');
}
test('manual ingredient is confirmed in database, then reload restores it and its storage', async t => {
  const database = [];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  enterIngredient(f); await tick();
  assert.equal(database.length, 1);
  assert.equal(database[0].auth_user_id, 'alice');
  assert.equal(database[0].storage_location, 'Pantry');
  assert.equal(database[0].quantity, 3);
  assert.equal(database[0].expiration_source, 'label');
  const reloaded = boot({ id: 'alice', database }); t.after(() => reloaded.dom.window.close()); await tick();
  reloaded.click('[data-act="tab"][data-arg="ing"]');
  assert.match(reloaded.text(), /Persistence test apples/);
  assert.match(reloaded.text(), /Pantry/);
  assert.match(reloaded.text(), /Saved in database/);
  const bob = boot({ id: 'bob', database }); t.after(() => bob.dom.window.close()); await tick();
  bob.click('[data-act="tab"][data-arg="ing"]');
  assert.doesNotMatch(bob.text(), /Persistence test apples/);
});
test('failed insert keeps ingredient form open and does not claim success', async t => {
  const database = [];
  const f = boot({ id: 'alice', database, insertError: 'Insert denied' }); t.after(() => f.dom.window.close()); await tick();
  enterIngredient(f); await tick();
  assert.equal(database.length, 0);
  assert.match(f.w.document.querySelector('#dbErr').textContent, /Insert denied/);
  assert.equal(f.w.document.querySelector('#saveItemBtn').disabled, false);
  assert.doesNotMatch(f.text(), /You're all set/);
});
test('double click while saving sends only one insert', async t => {
  let finish; const wait = new Promise(r => { finish = r; });
  const database = [];
  const f = boot({ id: 'alice', database, insertWait: wait }); t.after(() => f.dom.window.close()); await tick();
  enterIngredient(f); f.click('#saveItemBtn');
  assert.equal(f.queries.filter(q => q.table === 'pantry_item' && q.insert).length, 1);
  assert.equal(f.w.document.querySelector('#saveItemBtn').disabled, true);
  finish(); await tick(); assert.equal(database.length, 1);
});
test('insert completing after logout cannot expose data in the signed-out screen', async t => {
  let finish; const wait = new Promise(r => { finish = r; });
  const f = boot({ id: 'alice', database: [], insertWait: wait }); t.after(() => f.dom.window.close()); await tick();
  enterIngredient(f); f.emit('SIGNED_OUT', null); await tick(); finish(); await tick();
  assert.match(f.text(), /Sign in/); assert.doesNotMatch(f.text(), /Persistence test apples/);
});
function receiptPhoto(f, selector = '#photoCam') {
  const input = f.w.document.querySelector(selector); assert.ok(input, selector);
  const file = new f.w.File([new Uint8Array([255, 216, 255, 224])], 'receipt.jpg', { type: 'image/jpeg' });
  Object.defineProperty(input, 'files', { value: [file] });
  input.dispatchEvent(new f.w.Event('change', { bubbles: true }));
}
const RECEIPT = { readable: true, store_name: 'Smith\'s', items: [
  { name: 'Chicken thighs', receipt_text: 'CHKN THIGHS', category: 'Meat & Seafood', quantity: 1.5, unit: 'lb', storage: 'Fridge' },
  { name: 'Avocados', receipt_text: 'AVOCADO 4CT', category: 'Produce', quantity: 4, unit: 'ct', storage: 'Pantry' },
  { name: 'Frozen waffles', receipt_text: 'WAFFLES FRZ', category: 'Frozen', quantity: 1, unit: 'box', storage: 'Freezer' }
] };
const settle = () => new Promise(r => setTimeout(r, 60));
test('real receipt photo is read by the receipt-scan function, reviewed, and saved', async t => {
  const database = [];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  const calls = [];
  f.w.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => RECEIPT }; };
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="receipt"]');
  assert.equal(f.w.document.querySelector('.demo-toggle'), null);
  receiptPhoto(f); await settle();
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/functions\/v1\/receipt-scan$/);
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-session');
  assert.match(JSON.parse(calls[0].options.body).image, /^data:image\/jpeg;base64,/);
  assert.equal(JSON.parse(calls[0].options.body).kind, 'receipt');
  assert.match(f.text(), /We found 3 items/);
  assert.match(f.text(), /CHKN THIGHS/);
  f.click('[data-act="reviewToggle"][data-arg]'); // remove the first item
  f.click('[data-act="confirmScan"]'); await tick();
  assert.equal(database.length, 2);
  assert.ok(database.every(r => r.way_added === 'receipt' && r.auth_user_id === 'alice' && r.expiration_source === 'ai'));
  assert.deepEqual(database.map(r => [r.ingredient_name, r.quantity, r.measurement, r.storage_location]),
    [['Avocados', 4, 'ct', 'Pantry'], ['Frozen waffles', 1, 'box', 'Freezer']]);
  const reloaded = boot({ id: 'alice', database }); t.after(() => reloaded.dom.window.close()); await tick();
  reloaded.click('[data-act="tab"][data-arg="ing"]');
  assert.match(reloaded.text(), /Frozen waffles/);
});
test('receipt text from the AI is escaped on the review screen', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: true, json: async () => ({ readable: true, store_name: '<b>X</b>', items: [{ name: '<img src=x onerror=alert(1)>', receipt_text: '<script>1</script>', category: 'Bad', quantity: -2, unit: 'tons', storage: 'Roof' }] }) });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f, '#photoPick'); await settle();
  assert.equal(f.w.document.querySelector('.rv img, .rv script'), null);
  assert.match(f.text(), /<img src=x/);
  assert.match(f.text(), /Other/);
});
test('receipt scan errors are shown and nothing is saved', async t => {
  const database = [];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: false, json: async () => ({ error: 'You reached the 20-receipt hourly limit.' }) });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f); await settle();
  assert.match(f.w.document.querySelector('.cam-error').textContent, /20-receipt hourly limit/);
  f.w.fetch = async () => ({ ok: true, json: async () => ({ readable: false, store_name: null, items: [] }) });
  f.click('[data-act="retake"]'); assert.equal(f.w.document.querySelector('.cam-error'), null);
  receiptPhoto(f); await settle();
  assert.match(f.w.document.querySelector('.cam-error').textContent, /couldn't read this receipt/);
  assert.equal(database.length, 0);
});
test('receipt result arriving after cancel or account switch is discarded', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let finish; f.w.fetch = () => new Promise(r => { finish = r; });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f); await settle();
  assert.match(f.text(), /Reading your receipt/);
  f.emit('SIGNED_IN', 'bob'); await tick();
  finish({ ok: true, json: async () => RECEIPT }); await settle();
  assert.doesNotMatch(f.text(), /We found/);
});
test('non-image files are rejected before upload', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let called = false; f.w.fetch = async () => { called = true; return { ok: true, json: async () => RECEIPT }; };
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  const input = f.w.document.querySelector('#photoPick');
  Object.defineProperty(input, 'files', { value: [new f.w.File(['hi'], 'notes.txt', { type: 'text/plain' })] });
  input.dispatchEvent(new f.w.Event('change', { bubbles: true })); await settle();
  assert.equal(called, false);
  assert.match(f.w.document.querySelector('.cam-error').textContent, /choose a photo/i);
});
test('fridge photo is read by the scan function, uses printed dates, and saves', async t => {
  const database = [];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  const calls = [];
  f.w.fetch = async (url, options) => { calls.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ readable: true, store_name: null, items: [
    { name: 'Greek yogurt', category: 'Dairy', quantity: 32, unit: 'oz', storage: 'Fridge', label_date: '2030-02-14' },
    { name: 'Apples', category: 'Produce', quantity: 5, unit: 'ct', storage: 'Fridge', label_date: null },
    { name: 'Frozen peas', category: 'Frozen', quantity: 1, unit: 'bag', storage: 'Freezer', label_date: '2030-03-01' }
  ] }) }; };
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="pantry"]');
  assert.equal(f.w.document.querySelector('.demo-toggle'), null);
  assert.match(f.text(), /Snap your fridge/);
  receiptPhoto(f); await settle();
  assert.equal(calls.length, 1); assert.equal(calls[0].kind, 'pantry');
  assert.match(f.text(), /We found 3 items/);
  assert.match(f.text(), /Read from label/);
  f.click('[data-act="confirmScan"]'); await tick();
  assert.equal(database.length, 3);
  assert.ok(database.every(r => r.way_added === 'pantry_photo' && r.auth_user_id === 'alice'));
  const yogurt = database.find(r => r.ingredient_name === 'Greek yogurt');
  assert.equal(yogurt.expiration_date, '2030-02-14'); assert.equal(yogurt.expiration_source, 'label');
  const peas = database.find(r => r.ingredient_name === 'Frozen peas');
  assert.equal(peas.expiration_source, 'ai'); assert.equal(peas.storage_location, 'Freezer');
  assert.equal(database.find(r => r.ingredient_name === 'Apples').expiration_source, 'ai');
});
test('empty fridge photo shows a friendly error', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: true, json: async () => ({ readable: true, store_name: null, items: [] }) });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="pantry"]');
  receiptPhoto(f); await settle();
  assert.match(f.w.document.querySelector('.cam-error').textContent, /didn't spot any food/);
});
test('bar code scan (still simulated) inserts the item', async t => {
  const database = [];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="barcode"]');
  f.click('[data-act="shutter"]');
  await new Promise(r => setTimeout(r, 1450));
  f.click('[data-act="confirmScan"]'); await tick();
  assert.equal(database.length, 1);
  assert.equal(database[0].way_added, 'barcode');
});
test('actual app restores Alice, scopes pantry query, and signs out across reload', async t => {
  const f = boot({ id: 'alice' }); t.after(() => f.dom.window.close()); await tick();
  assert.match(f.text(), /Pantry Pal/);
  assert.deepEqual(f.queries.filter(q => q.table === 'pantry_item'), [{ table: 'pantry_item', column: 'auth_user_id', value: 'alice' }]);
  f.click('[data-act="tab"][data-arg="settings"]');
  assert.match(f.text(), /alice@example.test/);
  f.click('[data-act="logout"]'); await tick(); assert.match(f.text(), /Sign in/);
  assert.doesNotMatch(f.text(), /alice@example.test/);
  const next = boot(); t.after(() => next.dom.window.close()); await tick(); assert.match(next.text(), /Sign in/);
});
test('app session starts on sign-in and records explicit sign-out', async t => {
  const f = boot({ id: 'alice' }); t.after(() => f.dom.window.close()); await tick(); await tick();
  const sessions = f.mockTables.app_sessions;
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0].user_id, 'alice');
  assert.equal(sessions[0].ended_at, null);
  f.click('[data-act="tab"][data-arg="settings"]');
  f.click('[data-act="logout"]'); await tick(); await tick();
  assert.equal(sessions[0].end_reason, 'signed_out');
  assert.ok(sessions[0].ended_at);
});
test('stale app session is closed after 15 minutes and a new one starts', async t => {
  const lastActive = new Date(Date.now() - 20 * 60 * 1000).toISOString();
  const f = boot({ id: 'alice', tables: { app_sessions: [{ session_id: 'old-session', user_id: 'alice',
    started_at: lastActive, last_active_at: lastActive, ended_at: null, end_reason: null }] } });
  t.after(() => f.dom.window.close()); await tick(); await tick();
  const sessions = f.mockTables.app_sessions;
  assert.equal(sessions.length, 2);
  assert.equal(sessions[0].end_reason, 'inactive_timeout');
  assert.equal(Date.parse(sessions[0].ended_at), Date.parse(lastActive) + 15 * 60 * 1000);
  assert.equal(sessions[1].ended_at, null);
});
test('token refresh preserves the current screen', async t => {
  const f = boot({ id: 'alice' }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="settings"]'); const initialQueryCount = f.queries.length;
  f.emit('TOKEN_REFRESHED', 'alice'); await tick();
  assert.match(f.text(), /Settings/); assert.equal(f.queries.length, initialQueryCount);
});
test('reload restores the selected tab and settings subpage', async t => {
  const first = boot({ id: 'alice' }); t.after(() => first.dom.window.close()); await tick();
  first.click('[data-act="tab"][data-arg="settings"]'); first.click('[data-act="deals"]');
  const key = 'mp_state_v2:alice:navigation';
  const nav = JSON.parse(first.w.sessionStorage.getItem(key));
  const reloaded = boot({ id: 'alice', navigation: { [key]: nav } });
  t.after(() => reloaded.dom.window.close()); await tick();
  assert.equal(reloaded.w.document.querySelector('#app').dataset.key, 'appsettingsdeals');
});
test('navigation restores independently from preferences and stays account-specific', async t => {
  const navigation = { 'mp_state_v2:alice:navigation': { tab: 'ing', ingView: 'soon', ingCat: 'Dairy' } };
  const alice = boot({ id: 'alice', navigation }); t.after(() => alice.dom.window.close()); await tick();
  assert.equal(alice.w.document.querySelector('#app').dataset.key, 'apping');
  const bob = boot({ id: 'bob', navigation }); t.after(() => bob.dom.window.close()); await tick();
  assert.equal(bob.w.document.querySelector('#app').dataset.key, 'apphome');
});
test('invalid navigation falls back to Home', async t => {
  const f = boot({ id: 'alice', navigation: { 'mp_state_v2:alice:navigation': { tab: 'unknown', setPage: 'unknown' } } });
  t.after(() => f.dom.window.close()); await tick();
  assert.equal(f.w.document.querySelector('#app').dataset.key, 'apphome');
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



test('AI chat escapes output, sends follow-ups, and resets conversation', async t => {
  const f = boot({id:'alice'}); t.after(() => f.dom.window.close()); await tick();
  const calls=[];
  f.w.fetch=async (url, options) => { calls.push(JSON.parse(options.body)); return {ok:true,json:async()=>({answer:'<img src=x onerror=alert(1)>\\nUse eggs.'})}; };
  f.form('#chatForm',{chatIn:'Dinner ideas?'}); await tick();
  assert.match(f.text(), /<img src=x/); assert.equal(f.w.document.querySelector('#chat img'),null);
  f.form('#chatForm',{chatIn:'What else?'}); await tick();
  assert.equal(calls[1].history.length,2);
  f.click('[data-act="newChat"]');
  f.form('#chatForm',{chatIn:'Start again'}); await tick(); assert.equal(calls[2].history.length,0);
});
test('AI response arriving after account switch is discarded',async t=>{
 const f=boot({id:'alice'});t.after(()=>f.dom.window.close());await tick();let finish;
 f.w.fetch=()=>new Promise(resolve=>finish=resolve);
 f.form('#chatForm',{chatIn:'Dinner?'});await tick();f.emit('SIGNED_IN','bob');await tick();
 finish({ok:true,json:async()=>({answer:'ALICE PRIVATE ANSWER'})});await tick();
 assert.doesNotMatch(f.text(),/ALICE PRIVATE ANSWER/);
});
