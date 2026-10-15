const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
// GitHub Pages serves the checked-in public configuration directly. Other hosts
// may override it with build variables; no secret credentials are accepted.
const configText = fs.readFileSync(path.join(root, 'config.js'), 'utf8');
const defaults = JSON.parse(configText.slice(configText.indexOf('window.MYPANTRY_CONFIG = ') + 24).trim().replace(/;$/, ''));
const demoMode = process.env.DEMO_MODE === 'true';
const supabaseUrl = process.env.SUPABASE_URL || defaults.supabaseUrl || '';
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY || defaults.supabaseKey || '';
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
