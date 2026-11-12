const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const root = path.resolve(__dirname, '..');
const tick = () => new Promise(resolve => setTimeout(resolve, 15));
const user = id => ({ id, email: `${id}@example.test`, user_metadata: { name: id } });
function boot({ id = null, storage = {}, navigation = {}, config = {}, load, database, tables = {}, insertError, insertWait, barcodeResult, camera, accountUpdate, metadata = {}, noCatalog = false, canvasQuality = 'good', likeCounts } = {}) {
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'index.html'), 'utf8'), {
    url: 'https://mypantry.example.test/', runScripts: 'outside-only', pretendToBeVisual: true
  });
  const w = dom.window;
  let listener, saved = id ? { user: user(id), access_token: 'test-session' } : null;
  if (saved) saved.user.user_metadata = { ...saved.user.user_metadata, ...metadata };
  const queries = [];
  const mockTables = Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.map(row => ({ ...row }))]));
  w.matchMedia = () => ({ matches: false });
  w.HTMLElement.prototype.scrollTo = function () {};
  w.IntersectionObserver ||= class { observe() {} unobserve() {} disconnect() {} };
  w.Image = class {
    constructor() { this.naturalWidth = 1200; this.naturalHeight = 1800; this.width = 1200; this.height = 1800; }
    set src(_value) { w.setTimeout(() => this.onload?.(), 0); }
  };
  const canvasContext = () => ({
    filter: 'none', fillStyle: '', strokeStyle: '', lineWidth: 1,
    drawImage() {}, clearRect() {}, beginPath() {}, rect() {}, moveTo() {}, lineTo() {}, closePath() {}, fill() {}, stroke() {}, arc() {},
    save() {}, restore() {}, clip() {}, setTransform() {}, translate() {}, rotate() {}, scale() {}, putImageData() {},
    getImageData(_x, _y, width, height) {
      const data = new Uint8ClampedArray(width * height * 4);
      for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
        const value = canvasQuality === 'dark' ? 10 : canvasQuality === 'blurry' ? 80 + Math.round(x / Math.max(1, width - 1) * 100) : (x + y) % 2 ? 235 : 25;
        const at = (y * width + x) * 4;
        data[at] = data[at + 1] = data[at + 2] = value; data[at + 3] = 255;
      }
      return { data };
    }
  });
  w.HTMLCanvasElement.prototype.getContext = () => canvasContext();
  w.HTMLCanvasElement.prototype.toDataURL = () => 'data:image/jpeg;base64,/9j/2Q==';
  w.HTMLCanvasElement.prototype.toBlob = function (callback) { callback(new w.Blob([new Uint8Array([255, 216, 255, 224])], { type: 'image/jpeg' })); };
  if (camera) {
    Object.defineProperty(w.navigator, 'mediaDevices', { configurable: true, value: { getUserMedia: camera.getUserMedia } });
    Object.defineProperties(w.HTMLVideoElement.prototype, {
      readyState: { configurable: true, get: () => 4 },
      videoWidth: { configurable: true, get: () => 1280 },
      videoHeight: { configurable: true, get: () => 720 }
    });
    w.HTMLVideoElement.prototype.play = async function () {};
  }
  if (barcodeResult) {
    w.Image = class {
      constructor() { this.naturalWidth = 1200; this.naturalHeight = 800; this.width = 1200; this.height = 800; }
      set src(_value) { w.setTimeout(() => this.onload?.(), 0); }
    };
    w.ZXingBrowser = { BrowserMultiFormatOneDReader: class {
      async decodeFromImageUrl() { return { getText: () => barcodeResult }; }
    } };
  }
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
      async signUp() { return { data: { session: null } }; },
      async updateUser(input, options) {
        queries.push({ authUpdate: input, options });
        if (accountUpdate) { const result = await accountUpdate(input); if (result?.error) return result; }
        if (!saved) return { error: new Error('Signed out') };
        saved = { ...saved, user: { ...saved.user, ...(input.email ? { new_email: input.email } : {}), user_metadata: { ...saved.user.user_metadata, ...input.data } } };
        listener('USER_UPDATED', saved);
        return { data: { user: saved.user } };
      }
    },
    storage: {
      from(bucket) {
        return {
          async upload(filePath, blob, options) {
            queries.push({ storageUpload: { bucket, filePath, blob, options } });
            return { data: { path: filePath }, error: null };
          },
          async createSignedUrl(filePath, expiresIn) {
            queries.push({ signedUrl: { bucket, filePath, expiresIn } });
            return { data: { signedUrl: `https://signed.example.test/${bucket}/${filePath}` }, error: null };
          },
          async remove(filePaths) {
            queries.push({ storageRemove: { bucket, filePaths } });
            return { data: filePaths.map(name => ({ name })), error: null };
          }
        };
      }
    },
    async rpc(name, args) {
      queries.push({ rpc: name, args });
      if (name === 'recipe_like_counts') return likeCounts ? { data: likeCounts, error: null } : { data: null, error: new Error('missing function') };
      return { data: null, error: new Error(`Unknown rpc ${name}`) };
    },
    from(table) {
      let action = null, rowsToWrite = null, single = false, limitCount = null;
      const filters = {};
      const builder = {
        insert(rows) { action = 'insert'; rowsToWrite = Array.isArray(rows) ? rows : [rows]; queries.push({ table, insert: rowsToWrite }); return this; },
        delete() { action = 'delete'; queries.push({ table, delete: true }); return this; },
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
          if (action === 'delete') {
            const target = table === 'pantry_item' ? (database || []) : (mockTables[table] || []);
            const deleted = target.filter(row => Object.entries(filters).every(([key, value]) => row[key] === value));
            deleted.forEach(row => target.splice(target.indexOf(row), 1));
            return { data: deleted, error: null };
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
  if (!noCatalog) w.eval(fs.readFileSync(path.join(root, 'recipes.js'), 'utf8'));
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
  assert.doesNotMatch(reloaded.text(), /Saved in database/);
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
function barcodePhoto(f, selector = '#barcodeCam') {
  const input = f.w.document.querySelector(selector); assert.ok(input, selector);
  const file = new f.w.File([new Uint8Array([255, 216, 255, 224])], 'barcode.jpg', { type: 'image/jpeg' });
  Object.defineProperty(input, 'files', { value: [file] });
  input.dispatchEvent(new f.w.Event('change', { bubbles: true }));
}
const RECEIPT = { readable: true, store_name: 'Smith\'s', items: [
  { name: 'Chicken thighs', receipt_text: 'CHKN THIGHS', category: 'Meat & Seafood', quantity: 1.5, unit: 'lb', storage: 'Fridge' },
  { name: 'Avocados', receipt_text: 'AVOCADO 4CT', category: 'Produce', quantity: 4, unit: 'ct', storage: 'Pantry' },
  { name: 'Frozen waffles', receipt_text: 'WAFFLES FRZ', category: 'Frozen', quantity: 1, unit: 'box', storage: 'Freezer' }
] };
const settle = () => new Promise(r => setTimeout(r, 60));
async function submitEditedReceipt(f, selector = '#photoCam') {
  receiptPhoto(f, selector); await settle();
  assert.ok(f.w.document.querySelector('#receiptEditorCanvas'));
  f.click('[data-act="photoProcess"]'); await settle();
}
function openProcessedReceipt(f) {
  const ready = f.w.document.querySelector('[data-act="receiptStatus"]');
  assert.ok(ready, 'completed receipt status banner'); ready.click();
}
test('scan options open a live camera and the shutter captures one frame', async t => {
  const requests = [], tracks = [];
  const camera = { getUserMedia: async constraints => {
    requests.push(constraints);
    const track = { stopped: false, stop() { this.stopped = true; } }; tracks.push(track);
    return { getTracks: () => [track] };
  } };
  const f = boot({ id: 'alice', database: [], camera }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: true, json: async () => RECEIPT });
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="receipt"]');
  await settle();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].video.facingMode.ideal, 'environment');
  assert.ok(f.w.document.querySelector('#cameraFeed'));
  assert.equal(f.w.document.querySelector('[data-act="cameraShutter"]').disabled, false);
  assert.ok(f.w.document.querySelector('#photoPick'));
  f.click('[data-act="cameraShutter"]');
  await settle();
  assert.ok(f.w.document.querySelector('#receiptEditorCanvas'));
  f.click('[data-act="photoProcess"]'); await settle();
  assert.equal(tracks[0].stopped, true);
  openProcessedReceipt(f);
  assert.match(f.text(), /We found 3 items/);
});
test('camera permission failure keeps the file capture fallback available', async t => {
  const camera = { getUserMedia: async () => { const error = new Error('denied'); error.name = 'NotAllowedError'; throw error; } };
  const f = boot({ id: 'alice', camera }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="barcode"]');
  await settle();
  assert.match(f.text(), /Camera access was denied/);
  assert.ok(f.w.document.querySelector('label.shutter[for="barcodeCam"]'));
  assert.ok(f.w.document.querySelector('#barcodePick'));
});
test('real receipt photo is read by the receipt-scan function, reviewed, and saved', async t => {
  const database = [];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  const calls = [];
  f.w.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, json: async () => RECEIPT }; };
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="receipt"]');
  assert.equal(f.w.document.querySelector('.demo-toggle'), null);
  await submitEditedReceipt(f);
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /\/functions\/v1\/receipt-scan$/);
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-session');
  assert.match(JSON.parse(calls[0].options.body).image, /^data:image\/jpeg;base64,/);
  assert.equal(JSON.parse(calls[0].options.body).kind, 'receipt');
  assert.match(f.text(), /Receipt processed/);
  assert.match(f.text(), /3 items ready to review/);
  openProcessedReceipt(f);
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
test('receipt processing moves to a global in-app banner and Scan opens the finished review', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let finish;
  f.w.fetch = () => new Promise(resolve => { finish = resolve; });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f); await settle(); f.click('[data-act="photoProcess"]'); await tick();
  assert.ok(f.w.document.querySelector('.page-home .receipt-status.processing'));
  assert.match(f.text(), /You can keep using MyPantry/);
  f.click('[data-act="tab"][data-arg="scan"]');
  assert.ok(f.w.document.querySelector('.receipt-processing-page'));
  assert.ok(f.w.document.querySelector('.tabbar'));
  assert.equal(f.w.document.querySelector('.camera'), null);
  f.click('[data-act="tab"][data-arg="ing"]');
  assert.ok(f.w.document.querySelector('.page-ing .receipt-status.processing'));
  f.click('[data-act="tab"][data-arg="reels"]');
  assert.ok(f.w.document.querySelector('.page-reels .receipt-status.processing'));
  finish({ ok: true, headers: { get: () => '' }, json: async () => RECEIPT }); await settle();
  assert.ok(f.w.document.querySelector('.receipt-status.ready'));
  f.click('[data-act="tab"][data-arg="scan"]');
  assert.match(f.text(), /We found 3 items/);
  assert.equal(f.w.document.querySelector('.receipt-status'), null);
});
test('cancelling an active receipt scan requires confirmation', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let finish, signal;
  f.w.fetch = (_url, options) => { signal = options.signal; return new Promise(resolve => { finish = resolve; }); };
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f); await settle(); f.click('[data-act="photoProcess"]'); await tick();
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="scanCancel"]');
  assert.match(f.w.document.querySelector('.modal').textContent, /Cancel receipt processing/);
  f.click('[data-act="closeSheet"]');
  assert.ok(f.w.document.querySelector('.receipt-processing-page'));
  f.click('[data-act="scanCancel"]'); f.click('[data-act="cancelReceiptScan"]');
  assert.equal(signal.aborted, true);
  assert.match(f.text(), /Logging Your Food/);
  finish({ ok: true, headers: { get: () => '' }, json: async () => RECEIPT }); await settle();
  assert.doesNotMatch(f.text(), /We found 3 items/);
});
test('receipt completion closes an open cancellation confirmation', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let finish;
  f.w.fetch = () => new Promise(resolve => { finish = resolve; });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f); await settle(); f.click('[data-act="photoProcess"]'); await tick();
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="scanCancel"]');
  assert.ok(f.w.document.querySelector('[data-receipt-cancel="true"]'));
  finish({ ok: true, headers: { get: () => '' }, json: async () => RECEIPT }); await settle();
  assert.equal(f.w.document.querySelector('#scrim'), null);
  assert.match(f.text(), /We found 3 items/);
});
test('leaving a completed scan review requires confirmation', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: true, headers: { get: () => '' }, json: async () => RECEIPT });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  await submitEditedReceipt(f); openProcessedReceipt(f);
  f.click('[data-act="scanCancel"]');
  assert.match(f.w.document.querySelector('.modal').textContent, /Discard this scan/);
  assert.match(f.w.document.querySelector('.modal').textContent, /3 detected items/);
  f.click('[data-act="closeSheet"]');
  assert.match(f.text(), /We found 3 items/);
  f.click('[data-act="scanCancel"]'); f.click('[data-act="discardScanReview"]');
  assert.match(f.text(), /Start Logging Your Food/);
});
test('receipt editor offers correction tools and does not upload before approval', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let calls = 0; f.w.fetch = async () => { calls++; return { ok: true, json: async () => RECEIPT }; };
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f); await settle();
  assert.equal(calls, 0);
  assert.ok(f.w.document.querySelector('#receiptEditorCanvas'));
  assert.ok(f.w.document.querySelector('#photoBrightness'));
  assert.ok(f.w.document.querySelector('#photoContrast'));
  assert.ok(f.w.document.querySelector('[data-act="photoRotate"]'));
  assert.match(f.text(), /Drag each corner/);
});
test('unusable receipt photos are rejected locally without an upload', async t => {
  for (const [canvasQuality, message] of [['dark', /too dark/i], ['blurry', /too blurry/i]]) {
    const f = boot({ id: 'alice', database: [], canvasQuality }); t.after(() => f.dom.window.close()); await tick();
    let calls = 0; f.w.fetch = async () => { calls++; return { ok: true, json: async () => RECEIPT }; };
    f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
    receiptPhoto(f); await settle(); f.click('[data-act="photoProcess"]'); await settle();
    assert.equal(calls, 0, canvasQuality);
    assert.match(f.text(), message);
    assert.ok(f.w.document.querySelector('#receiptEditorCanvas'));
  }
});
test('receipt text from the AI is escaped on the review screen', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: true, json: async () => ({ readable: true, store_name: '<b>X</b>', items: [{ name: '<img src=x onerror=alert(1)>', receipt_text: '<script>1</script>', category: 'Bad', quantity: -2, unit: 'tons', storage: 'Roof' }] }) });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  await submitEditedReceipt(f, '#photoPick');
  openProcessedReceipt(f);
  assert.equal(f.w.document.querySelector('.rv img, .rv script'), null);
  assert.match(f.text(), /<img src=x/);
  assert.match(f.text(), /Other/);
});
test('receipt scan errors are shown and nothing is saved', async t => {
  const database = [];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: false, json: async () => ({ error: 'You reached the 20-receipt hourly limit.' }) });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  await submitEditedReceipt(f);
  assert.match(f.text(), /Receipt wasn’t processed/);
  f.click('[data-act="receiptStatus"]');
  assert.match(f.w.document.querySelector('.cam-error').textContent, /20-receipt hourly limit/);
  f.w.fetch = async () => ({ ok: true, json: async () => ({ readable: false, store_name: null, items: [] }) });
  f.click('[data-act="retake"]'); assert.equal(f.w.document.querySelector('.cam-error'), null);
  await submitEditedReceipt(f);
  f.click('[data-act="receiptStatus"]');
  assert.match(f.w.document.querySelector('.cam-error').textContent, /couldn't read this receipt/);
  assert.equal(database.length, 0);
});
test('receipt result arriving after cancel or account switch is discarded', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let finish; f.w.fetch = () => new Promise(r => { finish = r; });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="receipt"]');
  receiptPhoto(f); await settle(); f.click('[data-act="photoProcess"]'); await settle();
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
    { name: 'Greek yogurt', category: 'Dairy & Eggs', quantity: 32, unit: 'oz', storage: 'Fridge', label_date: '2030-02-14' },
    { name: 'Pineapple', category: 'Fruits', quantity: 5, unit: 'ct', storage: 'Fridge', label_date: null },
    { name: 'Beef Meat Stick', category: 'Meat & Seafood', quantity: 1, unit: 'ct', storage: 'Fridge', label_date: null },
    { name: 'Raw Beef', category: 'Meat & Seafood', quantity: 1, unit: 'ct', storage: 'Fridge', label_date: null },
    { name: 'Frozen peas', category: 'Frozen', quantity: 1, unit: 'bag', storage: 'Freezer', label_date: '2030-03-01' }
  ] }) }; };
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="pantry"]');
  assert.equal(f.w.document.querySelector('.demo-toggle'), null);
  assert.match(f.text(), /Snap your fridge/);
  receiptPhoto(f); await settle();
  assert.equal(calls.length, 1); assert.equal(calls[0].kind, 'pantry');
  assert.match(f.text(), /Pantry photo processed/);
  f.click('[data-act="receiptStatus"]');
  assert.match(f.text(), /We found 5 items/);
  assert.match(f.text(), /Read from label/);
  assert.match(f.text(), /🍍/);
  assert.match(f.text(), /🥓/);
  f.click('[data-act="confirmScan"]'); await tick();
  assert.equal(database.length, 5);
  assert.ok(database.every(r => r.way_added === 'pantry_photo' && r.auth_user_id === 'alice'));
  const yogurt = database.find(r => r.ingredient_name === 'Greek yogurt');
  assert.equal(yogurt.expiration_date, '2030-02-14'); assert.equal(yogurt.expiration_source, 'label');
  const peas = database.find(r => r.ingredient_name === 'Frozen peas');
  assert.equal(peas.expiration_source, 'ai'); assert.equal(peas.storage_location, 'Freezer');
  const stick = database.find(r => r.ingredient_name === 'Beef Meat Stick');
  assert.equal(stick.food_type, 'Snacks');
  assert.notEqual(stick.expiration_date, database.find(r => r.ingredient_name === 'Raw Beef').expiration_date);
});
test('pantry processing uses the global progress flow while the user navigates', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  let finish;
  f.w.fetch = () => new Promise(resolve => { finish = resolve; });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="pantry"]');
  receiptPhoto(f); await tick();
  assert.ok(f.w.document.querySelector('.page-home .receipt-status.processing'));
  assert.match(f.text(), /Finding food in your photo/);
  assert.match(f.text(), /You can keep using MyPantry/);
  f.click('[data-act="tab"][data-arg="scan"]');
  assert.ok(f.w.document.querySelector('.receipt-processing-page'));
  assert.match(f.text(), /Pantry scan/);
  assert.equal(f.w.document.querySelector('.camera'), null);
  f.click('[data-act="tab"][data-arg="ing"]');
  assert.ok(f.w.document.querySelector('.page-ing .receipt-status.processing'));
  finish({ ok: true, headers: { get: () => '' }, json: async () => ({ readable: true, store_name: null, items: [
    { name: 'Apples', category: 'Fruits', quantity: 5, unit: 'ct', storage: 'Fridge', label_date: null }
  ] }) });
  await settle();
  assert.match(f.text(), /Pantry photo processed/);
  f.click('[data-act="receiptStatus"]');
  assert.match(f.text(), /We found 1 item/);
});
test('empty fridge photo shows a friendly error', async t => {
  const f = boot({ id: 'alice', database: [] }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: true, json: async () => ({ readable: true, store_name: null, items: [] }) });
  f.click('[data-act="tab"][data-arg="scan"]'); f.click('[data-act="startScan"][data-arg="pantry"]');
  receiptPhoto(f); await settle();
  assert.match(f.text(), /Pantry photo wasn’t processed/);
  f.click('[data-act="receiptStatus"]');
  assert.match(f.w.document.querySelector('.cam-error').textContent, /didn't spot any food/);
});
test('bar code scan looks up USDA data, opens the editor, and inserts the confirmed item', async t => {
  const database = [];
  const f = boot({ id: 'alice', database, barcodeResult: '016000275287' }); t.after(() => f.dom.window.close()); await tick();
  let requests = 0;
  f.w.fetch = async (url, options) => {
    requests++;
    assert.match(url, /\/functions\/v1\/barcode-lookup$/);
    assert.equal(JSON.parse(options.body).barcode, '016000275287');
    return { ok: true, json: async () => ({ barcode: '016000275287', item: { name: 'Cheddar Cheese', quantity: 8, unit: 'oz', category: 'Dairy & Eggs', storage: 'Fridge', source: 'USDA FoodData Central' } }) };
  };
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="barcode"]');
  await tick();
  assert.equal(requests, 0);
  assert.ok(f.w.document.querySelector('#barcodeCam'));
  assert.ok(f.w.document.querySelector('#barcodePick'));
  barcodePhoto(f);
  await settle();
  assert.equal(f.w.document.querySelector('#f_name').value, 'Cheddar Cheese');
  assert.equal(f.w.document.querySelector('#f_cat').value, 'Dairy & Eggs');
  assert.match(f.text(), /USDA FoodData Central/);
  assert.match(f.text(), /UPC\/EAN 016000275287/);
  assert.ok(f.w.document.querySelector('#f_exp').value);
  assert.equal(f.w.document.querySelector('#saveItemBtn').textContent, 'Save to MyPantry');
  f.click('#saveItemBtn');
  await settle();
  assert.match(f.text(), /Added to MyPantry/);
  assert.equal(f.w.document.querySelector('[data-act="confirmScan"]'), null);
  assert.equal(database.length, 1);
  assert.equal(database[0].way_added, 'barcode');
  assert.equal(database[0].ingredient_name, 'Cheddar Cheese');
  assert.equal(database[0].food_type, 'Dairy & Eggs');
});
test('failed bar code photo offers validated manual UPC lookup', async t => {
  const f = boot({ id: 'alice', database: [], barcodeResult: '016000275287' }); t.after(() => f.dom.window.close()); await tick();
  let fail = true;
  f.w.fetch = async () => fail
    ? { ok: false, json: async () => ({ error: "We couldn't find this item in USDA FoodData Central." }) }
    : { ok: true, json: async () => ({ barcode: '012345678905', item: { name: 'Manual UPC item', quantity: 1, unit: 'ct', category: 'Other', storage: 'Pantry' } }) };
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="barcode"]');
  barcodePhoto(f); await settle();
  assert.ok(f.w.document.querySelector('#barcodeNumberForm'));
  f.w.document.querySelector('#barcodeNumber').value = '123';
  f.w.document.querySelector('#barcodeNumberForm').dispatchEvent(new f.w.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(f.w.document.querySelector('#barcodeNumberErr').hidden, false);
  fail = false;
  f.w.document.querySelector('#barcodeNumber').value = '012345678905';
  f.w.document.querySelector('#barcodeNumberForm').dispatchEvent(new f.w.Event('submit', { bubbles: true, cancelable: true }));
  await settle();
  assert.equal(f.w.document.querySelector('#f_name').value, 'Manual UPC item');
});

test('bar code lookup cannot substitute a different product response', async t => {
  const database = [];
  const f = boot({ id: 'alice', database, barcodeResult: '016000275287' }); t.after(() => f.dom.window.close()); await tick();
  f.w.fetch = async () => ({ ok: true, json: async () => ({
    barcode: '012345678905',
    item: { name: 'Wrong product', quantity: 1, unit: 'ct', category: 'Other', storage: 'Pantry' }
  }) });
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="barcode"]');
  barcodePhoto(f); await settle();
  assert.match(f.text(), /different bar code/);
  assert.equal(database.length, 0);
  assert.equal(f.w.document.querySelector('#saveItemBtn'), null);
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
  const navigation = { 'mp_state_v2:alice:navigation': { tab: 'ing', ingView: 'soon', ingCat: 'Dairy & Eggs' } };
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
test('login keeps recovery beside the password label and account creation secondary', async t => {
  const f = boot(); t.after(() => f.dom.window.close()); await tick();
  const form = f.w.document.querySelector('#loginForm');
  const password = form.querySelector('.login-password');
  const heading = password.querySelector('.field-heading');
  assert.equal(heading.querySelector('label[for="li_pw"]').textContent, 'Password');
  assert.equal(heading.querySelector('[data-arg="forgot"]').textContent, 'Forgot password?');
  assert.equal(form.querySelector('.btn-auth-secondary[data-arg="signup"]').textContent, 'Create an account');
  assert.doesNotMatch(form.textContent, /You stay signed in until you sign out/);
});
test('ordinary connected accounts cannot see demo tools', async t => {
  const f = boot({ id: 'bob', config: { demoAccountId: 'alice' } }); t.after(() => f.dom.window.close()); await tick();
  assert.match(f.text(), /Pantry Pal/);
  assert.equal(f.w.document.querySelector('#demoPanel').hidden, true);
  assert.equal(f.w.document.querySelector('#demoToggle').hidden, true);
});
test('missing configuration cannot silently enable demo access', async t => {
  const f = boot({ config: { supabaseUrl: '' } }); t.after(() => f.dom.window.close()); await tick();
  assert.match(f.text(), /Sign-in is unavailable/); assert.equal(f.w.document.querySelector('#demoPanel').hidden, true);
});
test('configured Supabase demo account receives tools and simulated scans', async t => {
  const database = [
    { ingredient_id: 1, auth_user_id: 'alice', ingredient_name: 'Milk', quantity: 1, measurement: 'gal', food_type: 'Dairy & Eggs', expiration_date: '2030-01-01' },
    { ingredient_id: 2, auth_user_id: 'alice', ingredient_name: 'Eggs', quantity: 12, measurement: 'ct', food_type: 'Dairy & Eggs', expiration_date: '2030-01-02' },
    { ingredient_id: 3, auth_user_id: 'alice', ingredient_name: 'Bread', quantity: 1, measurement: 'loaf', food_type: 'Grains & Bread', expiration_date: '2030-01-03' }
  ];
  const f = boot({ id: 'alice', database, config: { demoAccountId: 'alice' } });
  t.after(() => f.dom.window.close()); await tick();
  assert.equal(f.w.document.querySelector('#demoPanel').hidden, false);
  assert.doesNotMatch(f.w.document.body.textContent, /MyPantry test guide/);
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="startScan"][data-arg="pantry"]');
  assert.match(f.w.document.querySelector('#app').textContent, /Clear photo/);
  assert.match(f.w.document.querySelector('#app').textContent, /Blurry photo/);
  f.click('[data-act="scanCancel"]');
  f.click('[data-tool="random"]'); await tick(); await tick();
  assert.ok(database.length >= 8 && database.length <= 18);
  assert.ok(database.every(row => row.auth_user_id === 'alice'));
  assert.equal(f.queries.filter(query => query.table === 'pantry_item' && query.delete).length, 1);
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

test('signup requires eight characters and preserves symbol validation', async t => {
  const f = boot(); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="auth"][data-arg="signup"]');
  const update = password => {
    for (const [id,value] of Object.entries({su_email:'test@example.test',su_pw:password,su_pw2:password})) f.w.document.getElementById(id).value=value;
    f.w.document.querySelector('#signupForm').dispatchEvent(new f.w.Event('input',{bubbles:true}));
  };
  update('Abc123!'); assert.equal(f.w.document.querySelector('#suBtn').disabled,true);
  update('Abc123!x'); assert.equal(f.w.document.querySelector('#suBtn').disabled,false);
  update('Abc123xx'); assert.equal(f.w.document.querySelector('#suBtn').disabled,true);
});


test('username is saved through Supabase Auth and restored from account metadata', async t => {
 const f=boot({id:'alice'});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="settings"]');f.click('[data-act="changeUsername"]');
 f.form('#usernameForm',{accountName:'Jared'});await tick();
 assert.deepEqual(JSON.parse(JSON.stringify(f.queries.find(q=>q.authUpdate).authUpdate)),{data:{name:'Jared'}});
 assert.match(f.text(),/Jared/);assert.match(f.text(),/Settings/);
 const reloaded=boot({id:'alice',metadata:{name:'Jared'}});t.after(()=>reloaded.dom.window.close());await tick();
 reloaded.click('[data-act="tab"][data-arg="settings"]');assert.match(reloaded.text(),/Jared/);
});
test('profile row opens a front-camera flow and saves a private account photo', async t => {
  const requests = [];
  const camera = { getUserMedia: async constraints => {
    requests.push(constraints);
    return { getTracks: () => [{ stop() {} }] };
  } };
  const f = boot({ id: 'alice', camera }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="settings"]');
  f.click('[data-act="editProfile"]');
  assert.match(f.text(), /Take a photo/);
  assert.ok(f.w.document.querySelector('#profilePhotoPick:not([capture])'));
  f.click('[data-act="profileCamera"]'); await settle();
  assert.equal(requests[0].video.facingMode.ideal, 'user');
  assert.ok(f.w.document.querySelector('#profileCameraFeed'));
  f.click('[data-act="profileShutter"]');
  assert.ok(f.w.document.querySelector('[data-act="profileSave"]'));
  f.click('[data-act="profileSave"]'); await settle();
  const upload = f.queries.find(query => query.storageUpload);
  assert.equal(upload.storageUpload.bucket, 'avatars');
  assert.match(upload.storageUpload.filePath, /^alice\/profile-\d+\.jpg$/);
  assert.equal(upload.storageUpload.options.upsert, true);
  assert.deepEqual(JSON.parse(JSON.stringify(f.queries.find(query => query.authUpdate).authUpdate)), { data: { avatar_path: upload.storageUpload.filePath } });
  assert.ok(f.w.document.querySelector('.profile .av img'));
});
test('password form validates and updates Auth without writing pantry data',async t=>{
 const f=boot({id:'alice'});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="settings"]');f.click('[data-act="changePw"]');
 f.form('#passwordForm',{accountPassword:'Abc123!',accountConfirm:'Abc123!'});await tick();
 assert.match(f.text(),/at least 8/);assert.equal(f.queries.filter(q=>q.authUpdate).length,0);
 f.form('#passwordForm',{accountPassword:'Abc123!x',accountConfirm:'different'});await tick();
 assert.match(f.text(),/do not match/);
 f.form('#passwordForm',{accountPassword:'Abc123!x',accountConfirm:'Abc123!x'});await tick();
 assert.equal(f.queries.filter(q=>q.authUpdate).length,1);
 assert.equal(f.queries.find(q=>q.authUpdate).authUpdate.password,'Abc123!x');
 assert.match(f.text(),/Settings/);assert.equal(f.w.document.querySelector('#accountPassword'),null);
});
test('failed account update keeps the form and displays the Supabase error',async t=>{
 const f=boot({id:'alice',accountUpdate:async()=>({error:new Error('Network unavailable')})});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="settings"]');f.click('[data-act="changeUsername"]');
 f.form('#usernameForm',{accountName:'New name'});await tick();
 assert.match(f.text(),/Network unavailable/);assert.equal(f.w.document.querySelector('#accountName').value,'New name');
 assert.equal(f.w.document.querySelector('#usernameForm button[type="submit"]').disabled,false);
});
test('account update finishing after sign-out cannot change the next account',async t=>{
 let finish;const pending=new Promise(resolve=>finish=resolve);
 const f=boot({id:'alice',accountUpdate:()=>pending});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="settings"]');f.click('[data-act="changeUsername"]');
 f.form('#usernameForm',{accountName:'Alice new name'});await tick();f.emit('SIGNED_OUT',null);await tick();
 finish({});await tick();assert.match(f.text(),/Sign in/);assert.doesNotMatch(f.text(),/Alice new name|Username updated/);
});


test('email change requests confirmation without replacing the account or pantry owner',async t=>{
 const database=[{auth_user_id:'alice',ingredient_name:'Apples',ingredient_id:1,quantity:2,measurement:'ct',expiration_date:'2030-01-01',food_type:'Produce'}];
 const f=boot({id:'alice',database});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="settings"]');f.click('[data-act="changeEmail"]');
 f.form('#emailForm',{accountEmail:'NEW@example.test',accountEmailConfirm:'new@example.test'});await tick();
 const call=f.queries.find(q=>q.authUpdate);assert.equal(call.authUpdate.email,'new@example.test');
 assert.equal(call.options.emailRedirectTo,'https://mypantry.example.test/');
 assert.match(f.text(),/Check both/);assert.match(f.text(),/alice@example.test/);
 assert.equal(database[0].auth_user_id,'alice');
 f.click('[data-act="dealsBack"]');assert.match(f.text(),/alice@example.test/);
 f.emit('USER_UPDATED','alice');await tick();assert.match(f.text(),/alice@example.test/);
});
test('email form rejects invalid, mismatched and unchanged addresses before Auth calls',async t=>{
 const f=boot({id:'alice'});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="settings"]');f.click('[data-act="changeEmail"]');
 for(const [email,confirmation,expected] of [['bad','bad',/valid email/],['new@example.test','other@example.test',/do not match/],['alice@example.test','alice@example.test',/different email/]]){
 f.form('#emailForm',{accountEmail:email,accountEmailConfirm:confirmation});await tick();assert.match(f.text(),expected);
 }
 assert.equal(f.queries.filter(q=>q.authUpdate).length,0);
});
test('failed email change displays Supabase error and retains the old email',async t=>{
 const f=boot({id:'alice',accountUpdate:async()=>({error:new Error('Email rate limit exceeded')})});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="settings"]');f.click('[data-act="changeEmail"]');
 f.form('#emailForm',{accountEmail:'new@example.test',accountEmailConfirm:'new@example.test'});await tick();
 assert.match(f.text(),/Email rate limit exceeded/);assert.match(f.text(),/alice@example.test/);
 assert.equal(f.w.document.querySelector('#emailForm button[type="submit"]').disabled,false);
});

test('legacy produce and frozen items load under new food categories with storage preserved',async t=>{
 const database=[['Apple','Produce','Pantry'],['Baby carrots','Produce','Fridge'],['Frozen peas','Frozen','Freezer']].map(([ingredient_name,food_type,storage_location],i)=>({ingredient_id:i+1,ingredient_name,food_type,storage_location,auth_user_id:'alice',quantity:1,measurement:'ct',expiration_date:'2030-01-01'}));
 const f=boot({id:'alice',database});t.after(()=>f.dom.window.close());await tick();
 f.click('[data-act="tab"][data-arg="ing"]');
 f.click('[data-act="ingCat"][data-arg="Fruits"]');assert.match(f.text(),/Apple/);assert.doesNotMatch(f.text(),/Baby carrots/);
 f.click('[data-act="ingCat"][data-arg="Vegetables"]');assert.match(f.text(),/Baby carrots/);assert.match(f.text(),/Frozen peas/);assert.match(f.text(),/Freezer/);
});
test('manual form offers and persists the selected eleven food categories',async t=>{
 const database=[];const f=boot({id:'alice',database});t.after(()=>f.dom.window.close());await tick();
 enterIngredient(f,'Test condiment');await tick();
 f.click('[data-act="tab"][data-arg="scan"]');f.click('[data-act="manual"]');
 const options=[...f.w.document.querySelector('#f_cat').options].map(o=>o.value);
 assert.deepEqual(options,['Fruits','Vegetables','Meat & Seafood','Dairy & Eggs','Grains & Bread','Snacks','Sauces & Condiments','Spices & Baking','Prepared Meals','Drinks','Other']);
 for(const [id,value] of Object.entries({f_name:'Soy sauce',f_qty:'1',f_unit:'ct',f_cat:'Sauces & Condiments',f_exp:'2030-01-01'}))f.w.document.getElementById(id).value=value;
 f.click('#saveItemBtn');await tick();assert.equal(database.at(-1).food_type,'Sauces & Condiments');
});

const pantryRow = (id, name, qty = 2, unit = 'ct', owner) => ({ ingredient_id: id, auth_user_id: owner, ingredient_name: name, expiration_date: '2030-01-01', quantity: qty, measurement: unit, food_type: 'Other', storage_location: 'Fridge' });
test('preset and custom allergies sync and remove matching recipe suggestions', async t => {
  const database = [pantryRow(1, 'Eggs', 12, 'ct', 'allergy-user'), pantryRow(2, 'Sandwich bread', 1, 'loaf', 'allergy-user'), pantryRow(3, 'Butter', 1, 'lb', 'allergy-user')];
  const f = boot({ id: 'allergy-user', database }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="settings"]'); f.click('[data-act="editAllergies"]');
  f.click('[data-act="allergyToggle"][data-arg="eggs"]');
  f.form('#allergyForm', { allergyInput: 'Mustard' });
  assert.match(f.text(), /Mustard/);
  f.click('[data-act="allergySave"]');
  const local = JSON.parse(f.w.localStorage.getItem('mp_state_v2:allergy-user'));
  assert.deepEqual(local.prefs.allergies, ['eggs', 'mustard']);
  await new Promise(resolve => setTimeout(resolve, 240));
  const synced = f.queries.filter(query => query.table === 'user_app_state' && query.upsert).at(-1);
  assert.deepEqual(JSON.parse(JSON.stringify(synced.upsert[0].recipe_preferences.allergies)), ['eggs', 'mustard']);
  f.click('[data-act="tab"][data-arg="reels"]'); await tick();
  assert.equal(f.w.document.querySelector('.reel[data-id="scrambled"]'), null);
});
test('allergy aliases block base ingredients without blocking a recipe for an unsafe optional substitution', async t => {
  const owner = 'allergy-alias-user';
  const database = [pantryRow(1, 'Chicken', 2, 'lb', owner), pantryRow(2, 'Peanut butter', 1, 'jar', owner), pantryRow(3, 'Whey protein', 1, 'bag', owner)];
  const recipe = (recipe_id, name, ingredients, substitutions = null) => ({ recipe_id, name, emoji: '🍲', cuisine: 'Dinner', main_ingredient: ingredients[0].m,
    minutes: 20, serves: 4, base_likes: 0, background: null, keywords: [], ingredients, steps: ['Cook and serve'], substitutions, is_published: true, sort_order: 0 });
  const tables = { recipe: [
    recipe('safe-chicken', 'Simple Chicken Bowl', [{ m: 'chicken', a: 1, label: '1 lb chicken' }, { m: 'rice', a: .5, label: '1 cup rice' }],
      { rice: { use: ['peanut butter'], text: 'Swap rice for peanut butter.' } }),
    recipe('whey-shake', 'Protein Shake', [{ m: 'whey protein', a: 1, label: '1 scoop whey protein' }])
  ] };
  const f = boot({ id: owner, database, tables, noCatalog: true }); t.after(() => f.dom.window.close()); await settle();
  f.click('[data-act="tab"][data-arg="settings"]'); f.click('[data-act="editAllergies"]');
  f.click('[data-act="allergyToggle"][data-arg="milk"]'); f.click('[data-act="allergyToggle"][data-arg="peanuts"]'); f.click('[data-act="allergySave"]');
  f.click('[data-act="tab"][data-arg="reels"]'); f.click('[data-act="reelMore"][data-arg="on"]'); await tick();
  assert.ok(f.w.document.querySelector('.reel[data-id="safe-chicken"]'), 'base recipe remains available');
  assert.equal(f.w.document.querySelector('.reel[data-id="whey-shake"]'), null, 'milk derivative is filtered');
  f.click('.reel[data-id="safe-chicken"] [data-act="recipe"]');
  assert.doesNotMatch(f.w.document.querySelector('.sheet').textContent, /peanut butter/i, 'unsafe optional substitution is hidden');
});
test('theme picker defaults to paprika and persists all palette choices with the account', async t => {
  const f = boot({ id: 'theme-user', database: [] }); t.after(() => f.dom.window.close()); await tick();
  assert.equal(f.w.document.documentElement.dataset.palette, 'paprika');
  f.click('[data-act="tab"][data-arg="settings"]');
  assert.match(f.text(), /App themePaprika & Saffron/);
  f.click('[data-act="openTheme"]');
  const options = [...f.w.document.querySelectorAll('[data-act="themePick"]')];
  assert.deepEqual(options.map(option => [option.querySelector('b').textContent, option.querySelector('small').textContent]), [
    ['Paprika & Saffron', 'Warm paprika red, golden saffron and cream.'],
    ['Tomato & Basil', 'Bright tomato coral, garden basil and soft sage.'],
    ['Aubergine & Apricot', 'Deep aubergine, mellow apricot and warm ivory.'],
    ['Classic Green', 'The original MyPantry basil, gold and cool white.']
  ]);
  f.click('[data-act="themePick"][data-arg="aubergine"]');
  assert.equal(f.w.document.documentElement.dataset.palette, 'aubergine');
  assert.match(f.text(), /App themeAubergine & Apricot/);
  const local = JSON.parse(f.w.localStorage.getItem('mp_state_v2:theme-user'));
  assert.equal(local.prefs.appearanceTheme, 'aubergine');
  await new Promise(resolve => setTimeout(resolve, 240));
  const synced = f.queries.filter(query => query.table === 'user_app_state' && query.upsert).at(-1);
  assert.equal(synced.upsert[0].recipe_preferences.appearanceTheme, 'aubergine');
  f.click('[data-act="resetAsk"]'); f.click('[data-act="resetDo"]'); await settle();
  assert.equal(f.w.document.documentElement.dataset.palette, 'aubergine', 'inventory reset preserves appearance');
});
test('reels feed shows only recipes you can make, then an option for ones needing more', async t => {
  const database = [pantryRow(1, 'Eggs', 12, 'ct', 'reeler'), pantryRow(2, 'Sandwich bread', 1, 'loaf', 'reeler'), pantryRow(3, 'Butter', 1, 'lb', 'reeler')];
  const f = boot({ id: 'reeler', database }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="reels"]'); await tick();
  const ids = () => [...f.w.document.querySelectorAll('.reel')].map(r => r.dataset.id);
  assert.ok(f.w.MYPANTRY_RECIPES.length >= 100, 'catalog has 100+ recipes');
  assert.deepEqual(ids(), ['scrambled', 'card-offer'], 'only makeable reels, then the offer card');
  assert.match(f.text(), /1 recipe you can make now/);
  assert.match(f.text(), /You have all 3 ingredients/);
  f.click('[data-act="reelMore"][data-arg="on"]'); await tick();
  assert.deepEqual(ids().slice(0, 2), ['scrambled', 'card-more']);
  const near = [...f.w.document.querySelectorAll('.reel:not(.reel-card)')].find(r => /Need .+You have \d of \d ingredients/.test(r.textContent));
  assert.ok(near, 'recipes needing more ingredients show what is missing');
  assert.ok(near.querySelector('[data-act="askNeed"]'));
  f.click('[data-act="reelMore"][data-arg="off"]'); await tick();
  assert.deepEqual(ids(), ['scrambled', 'card-offer'], 'can switch back to only what you can make');
});
test('with nothing makeable, Reels explains why and can show recipes needing more', async t => {
  const f = boot({ id: 'emptyreels', database: [] }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="reels"]'); await tick();
  assert.equal(f.w.document.querySelectorAll('.reel').length, 0);
  assert.match(f.text(), /don't have enough ingredients/);
  assert.ok(f.w.document.querySelector('.reels-empty [data-act="tab"][data-arg="scan"]'));
  f.click('[data-act="reelMore"][data-arg="on"]'); await tick();
  const ids = [...f.w.document.querySelectorAll('.reel')].map(r => r.dataset.id);
  assert.equal(ids[0], 'card-more');
  assert.ok(ids.length > 5);
});
test('published recipes from Supabase are added to Reels', async t => {
  const tables = { recipe: [{ recipe_id: 'supa-toast', name: 'Supabase Toast', emoji: '🍞', cuisine: 'Breakfast', main_ingredient: 'bread',
    minutes: 5, serves: 1, base_likes: 9, background: null, keywords: [], ingredients: [{ m: 'bread', a: .1, label: '1 slice bread' }],
    steps: ['Toast it', 'Eat it'], substitutions: null, is_published: true, sort_order: 0 }] };
  const f = boot({ id: 'supa', database: [pantryRow(1, 'Bread', 1, 'loaf', 'supa')], tables, noCatalog: true }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="reels"]'); await tick();
  assert.ok(f.queries.some(q => q.table === 'recipe' && q.column === 'is_published'));
  assert.ok(f.w.document.querySelector('.reel[data-id="supa-toast"]'));
});

const soonDate = days => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString().slice(0, 10); };
test('Going bad soon keeps the search bar and food categories and filters by them', async t => {
  const database = [
    { ...pantryRow(1, 'Milk', 1, 'gal', 'soon-user'), expiration_date: soonDate(2), food_type: 'Dairy' },
    { ...pantryRow(2, 'Spinach', 1, 'ct', 'soon-user'), expiration_date: soonDate(3), food_type: 'Vegetables' },
    { ...pantryRow(3, 'Rice', 1, 'lb', 'soon-user'), food_type: 'Grains' }
  ];
  const f = boot({ id: 'soon-user', database }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="ing"]'); await tick();
  f.click('[data-act="ingView"][data-arg="soon"]'); await tick();
  const doc = f.w.document;
  assert.ok(doc.querySelector('#ingSearch'), 'search bar is shown');
  assert.ok(doc.querySelector('.cat-chips [data-act="ingCat"][data-arg="All"]'), 'category chips are shown');
  const names = () => [...doc.querySelectorAll('#ingList .item .name')].map(n => n.textContent);
  assert.deepEqual(names(), ['Spinach', 'Milk'], 'only food going bad is listed, grouped by category');
  assert.deepEqual([...doc.querySelectorAll('#ingList .cat h2')].map(h => h.textContent), ['Vegetables', 'Dairy & Eggs']);
  const search = doc.querySelector('#ingSearch');
  search.value = 'spin'; search.dispatchEvent(new f.w.Event('input', { bubbles: true }));
  assert.deepEqual(names(), ['Spinach']);
  search.value = ''; search.dispatchEvent(new f.w.Event('input', { bubbles: true }));
  const dairy = doc.querySelector('.cat-chips [data-arg="Dairy & Eggs"]');
  if (dairy) { dairy.click(); await tick(); assert.deepEqual(names(), ['Milk']); }
  f.click('.cat-chips [data-arg="All"]'); await tick();
  const search2 = doc.querySelector('#ingSearch');
  search2.value = 'rice'; search2.dispatchEvent(new f.w.Event('input', { bubbles: true }));
  assert.match(doc.querySelector('#ingList').textContent, /No food matches "rice"/);
});
test('Reels like counts come from real account likes, not seeded numbers', async t => {
  const database = [pantryRow(1, 'Eggs', 12, 'ct', 'liker'), pantryRow(2, 'Sandwich bread', 1, 'loaf', 'liker'), pantryRow(3, 'Butter', 1, 'lb', 'liker')];
  const f = boot({ id: 'liker', database, likeCounts: [{ recipe_id: 'scrambled', likes: 2 }] }); t.after(() => f.dom.window.close()); await tick();
  assert.ok(f.queries.some(q => q.rpc === 'recipe_like_counts'));
  f.click('[data-act="tab"][data-arg="reels"]'); await tick();
  const btn = () => f.w.document.querySelector('.reel[data-id="scrambled"] [data-act="like"]');
  assert.equal(btn().querySelector('.num').textContent, '2');
  btn().click(); await tick();
  assert.equal(btn().querySelector('.num').textContent, '3', 'your like is added');
  btn().click(); await tick();
  assert.equal(btn().querySelector('.num').textContent, '2');
  assert.ok(f.w.MYPANTRY_RECIPES.every(r => !r.likes), 'built-in catalog has no fake like numbers');
});
test('Reels show zero likes when nobody has liked a recipe or counts are unavailable', async t => {
  const database = [pantryRow(1, 'Eggs', 12, 'ct', 'nolikes'), pantryRow(2, 'Sandwich bread', 1, 'loaf', 'nolikes'), pantryRow(3, 'Butter', 1, 'lb', 'nolikes')];
  const f = boot({ id: 'nolikes', database }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="reels"]'); await tick();
  assert.equal(f.w.document.querySelector('.reel[data-id="scrambled"] [data-act="like"] .num').textContent, '0');
});
test('store preference no longer asks for a ZIP code', async t => {
  const f = boot({ id: 'nozip', database: [] }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="settings"]'); await tick();
  assert.doesNotMatch(f.text(), /ZIP/);
  f.click('[data-act="storeSheet"]'); await tick();
  assert.equal(f.w.document.querySelector('#zipIn'), null);
  f.w.document.querySelector('input[name="storePick"][value="Walmart"]').checked = true;
  f.click('[data-act="storeSave"]'); await tick(); await new Promise(r => setTimeout(r, 250));
  const state = f.mockTables.user_app_state?.find(row => row.user_id === 'nozip');
  assert.equal(state?.preferred_store, 'Walmart');
  assert.equal(state?.zip_code, null);
});
test('sign-up keeps Create account in a sticky bar and Enter moves between fields', async t => {
  const f = boot(); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="auth"][data-arg="signup"]'); await tick();
  const doc = f.w.document;
  assert.ok(doc.querySelector('.auth-submit-bar #suBtn'), 'button is inside the sticky submit bar');
  const enter = el => el.dispatchEvent(new f.w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
  doc.querySelector('#su_name').focus(); enter(doc.querySelector('#su_name'));
  assert.equal(doc.activeElement.id, 'su_email');
  doc.querySelector('#su_pw2').focus(); enter(doc.querySelector('#su_pw2'));
  assert.notEqual(doc.activeElement.id, 'su_pw2', 'invalid form closes the keyboard instead of submitting');
});

test('spoil date cannot be set in the past when adding food', async t => {
  const database = [];
  const f = boot({ id: 'pastdate', database }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="scan"]');
  f.click('[data-act="manual"]');
  const doc = f.w.document;
  const exp = doc.getElementById('f_exp');
  assert.equal(exp.min, soonDate(0), 'date picker starts at today');
  for (const [id, value] of Object.entries({ f_name: 'Old yogurt', f_qty: '1', f_unit: 'ct', f_cat: 'Other', f_exp: soonDate(-3) })) doc.getElementById(id).value = value;
  exp.dispatchEvent(new f.w.Event('change', { bubbles: true }));
  assert.equal(doc.getElementById('f_expErr').hidden, false, 'error shows right away');
  f.click('#saveItemBtn'); await tick();
  assert.equal(database.length, 0, 'nothing is saved');
  assert.ok(doc.getElementById('itemForm'), 'form stays open');
  exp.value = soonDate(0); exp.dispatchEvent(new f.w.Event('change', { bubbles: true }));
  assert.equal(doc.getElementById('f_expErr').hidden, true);
  f.click('#saveItemBtn'); await tick(); await tick();
  assert.equal(database.length, 1, 'today is allowed');
});
test('an existing item with a passed date keeps it, but a new past date is rejected', async t => {
  const database = [{ ...pantryRow(1, 'Old milk', 1, 'gal', 'oldedit'), expiration_date: soonDate(-2) }];
  const f = boot({ id: 'oldedit', database }); t.after(() => f.dom.window.close()); await tick();
  f.click('[data-act="tab"][data-arg="ing"]'); await tick();
  f.click('#ingList [data-act="edit"]'); await tick();
  const doc = f.w.document, exp = doc.getElementById('f_exp');
  const change = () => exp.dispatchEvent(new f.w.Event('change', { bubbles: true }));
  assert.equal(exp.value, soonDate(-2));
  change();
  assert.equal(doc.getElementById('f_expErr').hidden, true, 'unchanged passed date is allowed');
  exp.value = soonDate(-5); change();
  assert.equal(doc.getElementById('f_expErr').hidden, false, 'a different past date is rejected');
  f.click('#saveItemBtn'); await tick();
  assert.ok(!f.queries.some(q => q.table === 'pantry_item' && q.update), 'nothing is sent to the database');
});

test('chat deletion requires confirmation and only deletes the matching owned row', async t => {
  const database = [
    pantryRow(1, 'Apples', 2, 'ct', 'alice'),
    pantryRow(2, 'Apples', 1, 'ct', 'bob')
  ];
  const f = boot({ id: 'alice', database }); t.after(() => f.dom.window.close()); await tick();
  f.form('#chatForm', { chatIn: 'Please remove Apples from my pantry.' });
  assert.equal(database.length, 2);
  f.click('#scrim [data-act="closeSheet"]');
  assert.equal(database.length, 2);
  f.form('#chatForm', { chatIn: 'Delete Apples' });
  f.click('[data-act="chatRemoveConfirm"]'); await tick();
  assert.deepEqual(database.map(r => r.auth_user_id), ['bob']);
  assert.match(f.text(), /Removed Apples/);
});
