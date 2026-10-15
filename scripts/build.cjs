const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const demoMode = process.env.DEMO_MODE === 'true';
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || '';
if (!demoMode) {
  if (!supabaseUrl || !supabaseKey) throw new Error('Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY, or explicitly set DEMO_MODE=true.');
  if (new URL(supabaseUrl).protocol !== 'https:') throw new Error('SUPABASE_URL must use HTTPS.');
  let publicKey = supabaseKey.startsWith('sb_publishable_');
  try { publicKey ||= JSON.parse(Buffer.from(supabaseKey.split('.')[1], 'base64url')).role === 'anon'; } catch (_) {}
  if (!publicKey) throw new Error('Use only a Supabase publishable or legacy anon key. Secret keys must never be included in the website.');
}
const dist = path.join(root, 'dist');
fs.mkdirSync(dist, { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'auth.js']) fs.copyFileSync(path.join(root, file), path.join(dist, file));
const config = demoMode ? { demoMode: true } : { demoMode: false, supabaseUrl, supabaseKey };
fs.writeFileSync(path.join(dist, 'config.js'), 'window.MYPANTRY_CONFIG = ' + JSON.stringify(config) + ';\n');
console.log(`Built ${demoMode ? 'isolated demo' : 'Supabase-connected app'} in dist/`);
