const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const demoAccountId = (process.env.DEMO_ACCOUNT_ID || '').trim().toLowerCase();
if (!supabaseUrl || !supabaseKey) throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
if (new URL(supabaseUrl).protocol !== 'https:') throw new Error('SUPABASE_URL must use HTTPS.');
let publicKey = supabaseKey.startsWith('sb_publishable_');
try { publicKey ||= JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64url')).role === 'anon'; } catch (_) {}
if (!publicKey) throw new Error('Use only a Supabase publishable or legacy anon key. Secret keys must never be included in the website.');
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'auth.js', 'recipes.js']) fs.copyFileSync(path.join(root, file), path.join(dist, file));
if (demoAccountId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(demoAccountId)) {
  throw new Error('DEMO_ACCOUNT_ID must be the Demo user UUID from Supabase Auth.');
}
const config = { supabaseUrl, supabaseKey, demoAccountId };
fs.writeFileSync(path.join(dist, 'config.js'), 'window.MYPANTRY_CONFIG = ' + JSON.stringify(config) + ';\n');
console.log('Built Supabase-connected app in dist/');
