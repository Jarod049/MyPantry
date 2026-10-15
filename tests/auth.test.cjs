const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createAuth } = require('../auth.js');
const tick = () => new Promise(resolve => setTimeout(resolve, 5));
const session = id => ({ user: { id, email: `${id}@example.test` }, access_token: 'test-only' });
function fixture(initial = null) {
  let listener, saved = initial;
  const events = [], errors = [], calls = [];
  const api = {
    onAuthStateChange(fn) { listener = fn; return { data: { subscription: { unsubscribe() { listener = null; } } } }; },
    async getSession() { return { data: { session: saved } }; },
    async signInWithPassword(input) { calls.push(input); saved = session('alice'); listener('SIGNED_IN', saved); return { data: { session: saved } }; },
    async signUp(input) { calls.push(input); return { data: { session: null } }; },
    async signOut() { saved = null; listener('SIGNED_OUT', null); return {}; },
    async resetPasswordForEmail(...input) { calls.push(input); return {}; },
    async updateUser(input) { calls.push(input); return {}; },
    async resend(input) { calls.push(input); return {}; }
  };
  const auth = createAuth({ auth: api }, (s, e) => events.push([s, e]), e => errors.push(e));
  return { auth, api, events, errors, calls, emit: (event, s) => listener(event, s) };
}
test('reload restores a previously persisted session', async () => {
  const f = fixture(session('alice')); await f.auth.start();
  assert.equal(f.events[0][0].user.id, 'alice');
  assert.equal(f.events[0][1], 'INITIAL_SESSION');
});
test('signed-out startup shows no account', async () => {
  const f = fixture(); await f.auth.start(); assert.equal(f.events[0][0], null);
});
test('sign in forwards credentials and applies session once despite auth event', async () => {
  const f = fixture(); await f.auth.start(); await f.auth.signIn('alice@example.test', 'test-password'); await tick();
  assert.deepEqual(f.calls[0], { email: 'alice@example.test', password: 'test-password' });
  assert.equal(f.events.filter(x => x[1] === 'SIGNED_IN').length, 1);
});
test('logout clears the session and a later reload stays signed out', async () => {
  const f = fixture(session('alice')); await f.auth.start(); await f.auth.signOut(); await tick();
  assert.equal(f.events.at(-1)[0], null); assert.equal((await f.api.getSession()).data.session, null);
});
test('newer sign-out beats a slow startup session response', async () => {
  const f = fixture(); let finish;
  f.api.getSession = () => new Promise(resolve => { finish = resolve; });
  const started = f.auth.start(); f.emit('SIGNED_OUT', null);
  finish({ data: { session: session('alice') } }); await started; await tick();
  assert.deepEqual(f.events.map(x => x[0]), [null]);
});
test('refresh and cross-tab sign-out events are delivered', async () => {
  const f = fixture(session('alice')); await f.auth.start();
  f.emit('TOKEN_REFRESHED', session('alice')); await tick();
  assert.equal(f.events.at(-1)[1], 'TOKEN_REFRESHED');
  f.emit('SIGNED_OUT', null); await tick(); assert.equal(f.events.at(-1)[0], null);
});
test('confirmation-required signup does not sign in', async () => {
  const f = fixture(); await f.auth.start();
  assert.equal(await f.auth.signUp('a@example.test', 'password', 'A', 'https://example.test'), false);
  assert.equal(f.events.length, 1);
  assert.equal(f.calls[0].options.emailRedirectTo, 'https://example.test');
});
test('signup with a session enters the app', async () => {
  const f = fixture(); await f.auth.start(); f.api.signUp = async () => ({ data: { session: session('alice') } });
  assert.equal(await f.auth.signUp('a@example.test', 'password', 'A', 'https://example.test'), true);
  assert.equal(f.events.at(-1)[0].user.id, 'alice');
});
test('password recovery stays on recovery through a token refresh', async () => {
  const f = fixture(session('alice')); await f.auth.start();
  f.emit('PASSWORD_RECOVERY', session('alice')); await tick();
  f.emit('TOKEN_REFRESHED', session('alice')); await tick();
  assert.equal(f.events.at(-1)[1], 'PASSWORD_RECOVERY');
  await f.auth.updatePassword('new-test-password');
  assert.equal(f.events.at(-1)[1], 'PASSWORD_UPDATED');
});
test('recovery is not lost when initialization follows it immediately', async () => {
  const f = fixture(); await f.auth.start();
  f.emit('PASSWORD_RECOVERY', session('alice'));
  f.emit('INITIAL_SESSION', session('alice')); await tick();
  assert.equal(f.events.at(-1)[1], 'PASSWORD_RECOVERY');
});
test('network failures are surfaced and do not invent a login', async () => {
  const f = fixture(); f.api.getSession = async () => { throw new Error('Offline'); }; await f.auth.start();
  assert.equal(f.errors[0].message, 'Offline'); assert.equal(f.events.length, 0);
  f.api.signInWithPassword = async () => ({ error: new Error('Invalid login') });
  await assert.rejects(f.auth.signIn('a', 'b'), /Invalid login/); assert.equal(f.events.length, 0);
});
test('failed sign-out is reported rather than pretending to log out', async () => {
  const f = fixture(session('alice')); await f.auth.start();
  f.api.signOut = async () => ({ error: new Error('Offline') });
  await assert.rejects(f.auth.signOut(), /Offline/); assert.equal(f.events.at(-1)[0].user.id, 'alice');
});
