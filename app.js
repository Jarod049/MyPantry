/* ===========================================================
   MyPantry — prototype logic (vanilla JS, no dependencies)
   =========================================================== */
(() => {
'use strict';

/* ---------- Icons ---------- */
const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  jar: '<path d="M7 3h10v3H7z"/><path d="M6 6h12v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2z"/><path d="M9 12h6M9 15.5h4"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/>',
  reels: '<rect x="3" y="3" width="18" height="18" rx="5"/><path d="M10 8.5v7l6-3.5z"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
  receipt: '<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
  barcode: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8v8M10 8v8M13 8v8M16 8v8"/>',
  fridge: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M5 10h14M8 5.5v2M8 13v3"/>',
  pencil: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  right: '<path d="m9 6 6 6-6 6"/>',
  left: '<path d="m15 6-6 6 6 6"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  send: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  heart: '<path d="M12 20.5s-7.3-4.4-9.3-9C1.4 8.3 3.5 4.8 7 4.8c2 0 3.6 1.1 4.3 2.5h1.4c.7-1.4 2.3-2.5 4.3-2.5 3.5 0 5.6 3.5 4.3 6.7-2 4.6-9.3 9-9.3 9z"/>',
  bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
  share: '<path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7"/><path d="M12 3v12M7 8l5-5 5 5"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  spark: '<path d="M12 3l1.8 4.7 4.7 1.8-4.7 1.8L12 16l-1.8-4.7-4.7-1.8 4.7-1.8z"/><path d="M19 15l.8 2.2 2.2.8-2.2.8L19 21l-.8-2.2-2.2-.8 2.2-.8z"/>',
  tag: '<path d="M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  refresh: '<path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M5.5 15a8 8 0 0 0 13.9 2M18.5 9A8 8 0 0 0 4.6 7"/>',
  ruler: '<rect x="2" y="7" width="20" height="10" rx="2"/><path d="M6 7v4M10 7v3M14 7v4M18 7v3"/>',
  bell: '<path d="M6 16v-5a6 6 0 1 1 12 0v5l2 2H4z"/><path d="M10 21h4"/>',
  face: '<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><path d="M9 9v1M15 9v1M12 9v4h-1M9 16c1.7 1.3 4.3 1.3 6 0"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  store: '<path d="M3 9l2-5h14l2 5"/><path d="M4 9v11h16V9"/><path d="M3 9h18"/><path d="M9 20v-6h6v6"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
  logout: '<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h11"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  play: '<path d="M8 5v14l11-7z" fill="currentColor"/>',
  signin: '<path d="M10 17l5-5-5-5M15 12H3"/><path d="M14 4h5a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-5"/>',
  arrowDown: '<path d="M7 7l10 10M17 9v8H9"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  snow: '<path d="M12 2v20M4 7l16 10M20 7 4 17"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>'
};
const ic = (n, fill) => `<svg viewBox="0 0 24 24" fill="${fill ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[n]}</svg>`;
const LOGO = '<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="#1d6a4c"/><path d="M14 20h20v14a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V20Z" fill="#fff"/><path d="M12 16h24v4H12z" fill="#b9e4cd"/><path d="M24 11c3 0 5 2 5 5h-10c0-3 2-5 5-5Z" fill="#f2b632"/><circle cx="24" cy="28" r="3.2" fill="#1d6a4c"/></svg>';

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DAY = 864e5;
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
const pad2 = n => String(n).padStart(2, '0');
const isoOf = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const inDays = n => isoOf(new Date(TODAY.getTime() + n * DAY));
const parseIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const daysLeft = it => Math.round((parseIso(it.exp) - TODAY) / DAY);
const fmtDate = s => parseIso(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const byExp = (a, b) => a.exp.localeCompare(b.exp) || a.name.localeCompare(b.name);
let uid = 1;

function status(d) {
  if (d < 0) return { cls: 'bad', label: 'Spoiled' };
  if (d === 0) return { cls: 'now', label: 'Use today' };
  if (d <= 2) return { cls: 'now', label: `${plural(d, 'day')} left` };
  if (d <= 7) return { cls: 'soon', label: `${d} days left` };
  return { cls: 'fresh', label: 'Fresh' };
}
const pillFor = it => { const s = status(daysLeft(it)); return `<span class="pill ${s.cls}">${s.label}</span>`; };
function spoilText(it) {
  const d = daysLeft(it);
  if (d < 0) return `Spoiled ${fmtDate(it.exp)}`;
  if (d === 0) return 'Spoils today';
  return `Spoils ${fmtDate(it.exp)}`;
}

/* ---------- Units ---------- */
const CONV = { oz: ['g', 28.35], lb: ['kg', 0.4536], 'fl oz': ['mL', 29.57], gal: ['L', 3.785] };
const REV = { g: ['oz', 28.35], kg: ['lb', 0.4536], mL: ['fl oz', 29.57], L: ['gal', 3.785] };
const UNITS_US = ['ct', 'oz', 'lb', 'fl oz', 'gal', 'can', 'loaf', 'head', 'bag', 'bulb', 'box', 'jar'];
const UNITS_METRIC = ['ct', 'g', 'kg', 'mL', 'L', 'can', 'loaf', 'head', 'bag', 'bulb', 'box', 'jar'];
const roundQ = (v, u) => (u === 'g' || u === 'mL') ? Math.round(v) : Math.round(v * 100) / 100;
function disp(q, u) {
  if (S.metric && CONV[u]) { const [mu, f] = CONV[u]; return [roundQ(q * f, mu), mu]; }
  return [roundQ(q, u), u];
}
function fromDisp(q, u) { if (REV[u]) { const [bu, f] = REV[u]; return [q / f, bu]; } return [q, u]; }
function qtyText(q, u) { const [v, uu] = disp(q, u); return uu === 'ct' ? `${v} count` : `${v} ${uu}`; }

/* ---------- Shelf-life model (category × storage) ---------- */
const CATS = ['Produce', 'Meat & Seafood', 'Dairy', 'Grains & Bread', 'Snacks', 'Drinks', 'Frozen', 'Other'];
const SHELF = {
  'Produce': { Fridge: 7, Pantry: 5, Freezer: 240 },
  'Meat & Seafood': { Fridge: 3, Pantry: 0, Freezer: 180 },
  'Dairy': { Fridge: 10, Pantry: 0, Freezer: 90 },
  'Grains & Bread': { Fridge: 12, Pantry: 6, Freezer: 90 },
  'Snacks': { Fridge: 60, Pantry: 60, Freezer: 120 },
  'Drinks': { Fridge: 10, Pantry: 180, Freezer: 180 },
  'Frozen': { Fridge: 3, Pantry: 0, Freezer: 120 },
  'Other': { Fridge: 60, Pantry: 180, Freezer: 180 }
};
const estimate = (cat, store) => inDays((SHELF[cat] || SHELF.Other)[store] ?? 30);
const CAT_TINT = { 'Produce': '#e4f3e0', 'Meat & Seafood': '#fbe3de', 'Dairy': '#e6eef9', 'Grains & Bread': '#f7ecd6', 'Snacks': '#f4e6f3', 'Drinks': '#e0f2f4', 'Frozen': '#e3ecf7', 'Other': '#eceee9' };
const EMOJI = { apple: '🍎', banana: '🍌', strawberr: '🍓', broccoli: '🥦', lettuce: '🥬', garlic: '🧄', onion: '🧅', carrot: '🥕', tomato: '🍅', potato: '🥔', avocado: '🥑', lemon: '🍋', grape: '🍇', chicken: '🍗', beef: '🥩', steak: '🥩', salmon: '🐟', fish: '🐟', shrimp: '🍤', bacon: '🥓', milk: '🥛', egg: '🥚', cheese: '🧀', cheddar: '🧀', parmesan: '🧀', yogurt: '🍶', butter: '🧈', bread: '🍞', bagel: '🥯', tortilla: '🫓', rice: '🍚', spaghetti: '🍝', pasta: '🍝', flour: '🌾', cereal: '🥣', granola: '🥣', chip: '🍿', cookie: '🍪', cracker: '🍘', juice: '🧃', soda: '🥤', coffee: '☕', water: '💧', pea: '🫛', 'ice cream': '🍨', pizza: '🍕', waffle: '🧇', soy: '🥢', salsa: '🌶️', sauce: '🥫', soup: '🥫', peanut: '🥜', honey: '🍯', cream: '🥛', corn: '🌽' };
function guessEmoji(name) { const n = name.toLowerCase(); for (const k in EMOJI) if (n.includes(k)) return EMOJI[k]; return null; }
const imgHtml = (it, cls = 'img') => it.emoji
  ? `<span class="${cls}" style="background:${CAT_TINT[it.cat] || 'var(--surface-3)'}" aria-hidden="true">${it.emoji}</span>`
  : `<span class="${cls} default" aria-hidden="true">${ic('box')}</span>`;

/* ---------- Seed data ---------- */
function mk(name, emoji, cat, qty, unit, d, store, src) {
  return { id: 'i' + (uid++), name, emoji, cat, qty, unit, exp: inDays(d), store, src };
}
function samplePantry() {
  return [
    mk('Strawberries', '🍓', 'Produce', 1, 'lb', 1, 'Fridge', 'ai'),
    mk('Bananas', '🍌', 'Produce', 6, 'ct', 2, 'Pantry', 'ai'),
    mk('Broccoli', '🥦', 'Produce', 1, 'head', 4, 'Fridge', 'ai'),
    mk('Romaine lettuce', '🥬', 'Produce', 1, 'head', 6, 'Fridge', 'ai'),
    mk('Yellow onion', '🧅', 'Produce', 3, 'ct', 21, 'Pantry', 'ai'),
    mk('Garlic', '🧄', 'Produce', 1, 'bulb', 25, 'Pantry', 'ai'),
    mk('Chicken breast', '🍗', 'Meat & Seafood', 2, 'lb', 2, 'Fridge', 'label'),
    mk('Ground beef', '🥩', 'Meat & Seafood', 1, 'lb', 5, 'Fridge', 'label'),
    mk('Milk (2%)', '🥛', 'Dairy', 1, 'gal', 3, 'Fridge', 'label'),
    mk('Milk (2%)', '🥛', 'Dairy', 1, 'gal', 11, 'Fridge', 'label'),
    mk('Greek yogurt', '🍶', 'Dairy', 32, 'oz', -1, 'Fridge', 'label'),
    mk('Eggs', '🥚', 'Dairy', 12, 'ct', 16, 'Fridge', 'label'),
    mk('Cheddar cheese', '🧀', 'Dairy', 8, 'oz', 24, 'Fridge', 'label'),
    mk('Butter', '🧈', 'Dairy', 1, 'lb', 40, 'Fridge', 'label'),
    mk('Parmesan', '🧀', 'Dairy', 5, 'oz', 45, 'Fridge', 'label'),
    mk('Sandwich bread', '🍞', 'Grains & Bread', 1, 'loaf', 4, 'Pantry', 'label'),
    mk('Flour tortillas', '🫓', 'Grains & Bread', 10, 'ct', 9, 'Pantry', 'label'),
    mk('White rice', '🍚', 'Grains & Bread', 2, 'lb', 300, 'Pantry', 'label'),
    mk('Spaghetti', '🍝', 'Grains & Bread', 1, 'lb', 380, 'Pantry', 'label'),
    mk('All-purpose flour', '🌾', 'Grains & Bread', 5, 'lb', 180, 'Pantry', 'label'),
    mk('Granola', '🥣', 'Snacks', 12, 'oz', 60, 'Pantry', 'label'),
    mk('Tortilla chips', null, 'Snacks', 1, 'bag', 30, 'Pantry', 'label'),
    mk('Orange juice', '🧃', 'Drinks', 52, 'fl oz', 8, 'Fridge', 'label'),
    mk('Frozen peas', '🫛', 'Frozen', 12, 'oz', 120, 'Freezer', 'label'),
    mk('Soy sauce', '🥢', 'Other', 10, 'fl oz', 300, 'Pantry', 'label'),
    mk('Salsa', '🌶️', 'Other', 16, 'oz', 12, 'Fridge', 'label'),
    mk('Pasta sauce', '🥫', 'Other', 24, 'oz', 200, 'Pantry', 'label'),
    mk('Tomato soup', '🥫', 'Other', 2, 'can', 400, 'Pantry', 'label')
  ];
}

/* ---------- Recipes ---------- */
const RECIPES = [
  { id: 'stirfry', name: 'Chicken & Broccoli Stir-Fry', emoji: '🥡', type: 'Chinese', main: 'chicken', time: 25, serves: 6, likes: 1240,
    bg: 'radial-gradient(circle at 50% 35%, #e0613f, #8c2413 55%, #2b0b05)', kw: ['stir fry', 'stir-fry', 'stirfry', 'broccoli'],
    ing: [{ m: 'chicken breast', a: 1, label: '1 lb chicken breast' }, { m: 'broccoli', a: 1, label: '1 head broccoli' }, { m: 'garlic', a: .25, label: '3 cloves garlic' }, { m: 'soy sauce', a: 2, label: '1/4 cup soy sauce' }, { m: 'white rice', a: .5, label: '1 1/2 cups rice' }],
    steps: ['Start the rice', 'Slice chicken into strips', 'Sear chicken in a hot pan, 5 min', 'Add broccoli and garlic', 'Pour in soy sauce and toss', 'Serve over rice'] },
  { id: 'friedrice', name: 'Egg Fried Rice', emoji: '🍚', type: 'Chinese', main: 'eggs', time: 15, serves: 4, likes: 3120,
    bg: 'radial-gradient(circle at 50% 35%, #f0b429, #9a5a07 55%, #2c1502)', kw: ['fried rice', 'egg fried'],
    ing: [{ m: 'white rice', a: .5, label: '3 cups cooked rice' }, { m: 'eggs', a: 3, label: '3 eggs' }, { m: 'frozen peas', a: 4, label: '1 cup frozen peas' }, { m: 'soy sauce', a: 1, label: '2 tbsp soy sauce' }, { m: 'onion', a: 1, label: '1 onion' }],
    steps: ['Dice the onion', 'Scramble the eggs, set aside', 'Fry onion and peas, 3 min', 'Add rice and press flat to crisp', 'Stir in eggs and soy sauce'] },
  { id: 'pancakes', name: 'Banana Pancakes', emoji: '🥞', type: 'Breakfast', main: 'bananas', time: 20, serves: 6, likes: 5480,
    bg: 'radial-gradient(circle at 50% 35%, #f6c453, #b8651b 55%, #3a1d06)', kw: ['pancake'],
    ing: [{ m: 'bananas', a: 2, label: '2 ripe bananas' }, { m: 'eggs', a: 2, label: '2 eggs' }, { m: 'all-purpose flour', a: .4, label: '1 1/2 cups flour' }, { m: 'milk', a: .09, label: '1 1/2 cups milk' }, { m: 'butter', a: .06, label: '2 tbsp butter' }],
    steps: ['Mash the bananas', 'Whisk in eggs and milk', 'Fold in the flour', 'Cook on a buttered pan', 'Flip when bubbles form'] },
  { id: 'quesadilla', name: 'Chicken Quesadillas', emoji: '🫓', type: 'Mexican', main: 'chicken', time: 15, serves: 4, likes: 980,
    bg: 'radial-gradient(circle at 50% 35%, #e98a2c, #8a3312 55%, #2a0e05)', kw: ['quesadilla'],
    ing: [{ m: 'flour tortillas', a: 4, label: '4 tortillas' }, { m: 'chicken breast', a: .5, label: '1/2 lb chicken' }, { m: 'cheddar', a: 4, label: '1 cup cheddar' }, { m: 'salsa', a: 4, label: '1/2 cup salsa' }],
    steps: ['Cook and shred the chicken', 'Fill tortillas with cheese and chicken', 'Toast 2 min per side', 'Slice and serve with salsa'] },
  { id: 'tacos', name: 'Weeknight Beef Tacos', emoji: '🌮', type: 'Mexican', main: 'beef', time: 20, serves: 6, likes: 2210,
    bg: 'radial-gradient(circle at 50% 35%, #3fae62, #175c30 55%, #07210f)', kw: ['taco'],
    ing: [{ m: 'ground beef', a: 1, label: '1 lb ground beef' }, { m: 'flour tortillas', a: 6, label: '6 tortillas' }, { m: 'cheddar', a: 3, label: '3/4 cup cheddar' }, { m: 'lettuce', a: .5, label: '1/2 head lettuce' }, { m: 'salsa', a: 4, label: '1/2 cup salsa' }],
    steps: ['Brown the beef, 8 min', 'Warm the tortillas', 'Shred the lettuce', 'Fill and top with cheese and salsa'] },
  { id: 'bolognese', name: 'Easy Spaghetti Bolognese', emoji: '🍝', type: 'Italian', main: 'beef', time: 30, serves: 6, likes: 1760,
    bg: 'radial-gradient(circle at 50% 35%, #d6402b, #6b1d0e 55%, #1f0904)', kw: ['spaghetti', 'bolognese'],
    ing: [{ m: 'spaghetti', a: 1, label: '1 lb spaghetti' }, { m: 'ground beef', a: 1, label: '1 lb ground beef' }, { m: 'pasta sauce', a: 24, label: '1 jar pasta sauce' }, { m: 'onion', a: 1, label: '1 onion' }, { m: 'parmesan', a: 1, label: '1/4 cup parmesan' }],
    steps: ['Boil the spaghetti', 'Brown beef with onion', 'Add pasta sauce, simmer 10 min', 'Toss with the pasta', 'Top with parmesan'] },
  { id: 'parfait', name: 'Strawberry Yogurt Parfait', emoji: '🍓', type: 'Breakfast', main: 'strawberries', time: 5, serves: 2, likes: 860,
    bg: 'radial-gradient(circle at 50% 35%, #ee6aa7, #9d174d 55%, #33061a)', kw: ['parfait'],
    ing: [{ m: 'greek yogurt', a: 8, label: '1 cup Greek yogurt' }, { m: 'strawberries', a: .5, label: '1/2 lb strawberries' }, { m: 'granola', a: 3, label: '3/4 cup granola' }],
    steps: ['Slice the strawberries', 'Spoon yogurt into a glass', 'Add berries and granola', 'Repeat the layers'] },
  { id: 'grilledcheese', name: 'Grilled Cheese & Tomato Soup', emoji: '🥪', type: 'American', main: 'cheese', time: 15, serves: 4, likes: 4020,
    bg: 'radial-gradient(circle at 50% 35%, #f07f3c, #8a3312 55%, #2a0e05)', kw: ['grilled cheese', 'tomato soup'],
    ing: [{ m: 'bread', a: .5, label: '8 slices bread' }, { m: 'cheddar', a: 3, label: '4 slices cheddar' }, { m: 'butter', a: .06, label: '2 tbsp butter' }, { m: 'tomato soup', a: 1, label: '1 can tomato soup' }],
    steps: ['Heat the soup', 'Butter the bread', 'Add cheddar, grill 3 min per side', 'Slice and dunk'] },
  { id: 'alfredo', name: 'Chicken Alfredo', emoji: '🍝', type: 'Italian', main: 'chicken', time: 25, serves: 6, likes: 2890,
    bg: 'radial-gradient(circle at 50% 35%, #e9d8a6, #9a7b3a 55%, #2e2310)', kw: ['alfredo'],
    ing: [{ m: 'spaghetti', a: 1, label: '1 lb pasta' }, { m: 'chicken breast', a: .75, label: '3/4 lb chicken' }, { m: 'heavy cream', a: 16, label: '2 cups heavy cream' }, { m: 'parmesan', a: 2, label: '1/2 cup parmesan' }, { m: 'garlic', a: .25, label: '3 cloves garlic' }],
    subs: { 'heavy cream': { use: ['milk', 'butter'], text: 'Swap the heavy cream for 1 1/2 cups milk warmed with 3 tbsp butter. It comes out a little lighter.' } },
    steps: ['Boil the pasta', 'Cook the chicken', 'Warm cream with garlic', 'Stir in parmesan', 'Toss everything together'] },
  { id: 'teriyaki', name: 'Salmon Teriyaki Bowl', emoji: '🍣', type: 'Japanese', main: 'salmon', time: 20, serves: 4, likes: 1500,
    bg: 'radial-gradient(circle at 50% 35%, #f08a6c, #7a2a1c 55%, #220b06)', kw: ['teriyaki', 'salmon'],
    ing: [{ m: 'salmon', a: 1, label: '1 lb salmon' }, { m: 'white rice', a: .5, label: '1 1/2 cups rice' }, { m: 'soy sauce', a: 2, label: '1/4 cup soy sauce' }, { m: 'broccoli', a: 1, label: '1 head broccoli' }],
    steps: ['Cook the rice', 'Glaze and bake the salmon', 'Steam the broccoli', 'Build the bowls'] },
  { id: 'caesar', name: 'Chicken Caesar Wraps', emoji: '🌯', type: 'American', main: 'chicken', time: 15, serves: 4, likes: 700,
    bg: 'radial-gradient(circle at 50% 35%, #9bc46b, #3f6420 55%, #122008)', kw: ['caesar', 'wrap'],
    ing: [{ m: 'chicken breast', a: .75, label: '3/4 lb chicken' }, { m: 'flour tortillas', a: 4, label: '4 tortillas' }, { m: 'lettuce', a: 1, label: '1 head romaine' }, { m: 'parmesan', a: 1, label: '1/4 cup parmesan' }, { m: 'caesar dressing', a: 4, label: '1/2 cup Caesar dressing' }],
    steps: ['Cook and slice chicken', 'Chop the romaine', 'Toss with dressing and parmesan', 'Wrap it up'] }
];
const R = id => RECIPES.find(r => r.id === id);

/* ---------- State ---------- */
let S;
function freshState() {
  return {
    auth: 'login', tab: 'home', inv: samplePantry(),
    accounts: { 'karen@mypantry.app': { pw: 'Pantry#Demo2026', name: 'Karen Miller' } },
    user: null, signupEmail: '',
    remembered: false, faceId: true, stayIn: false, metric: false, reminders: true,
    store: "Smith's", zip: '84604',
    prefs: {}, liked: new Set(), saved: new Set(), watched: new Set(),
    chat: [], pending: null, undo: null,
    ingView: 'all', ingCat: 'All', ingQuery: '',
    scan: null, setPage: null, reelView: 'feed'
  };
}
S = freshState();

/* ---------- Supabase (vertical slice) ----------
   config.js is generated from .env by `npm start` and is not committed.
   Without it the prototype still runs, using sample data in the browser. */
const CFG = window.MYPANTRY_CONFIG || {};
const sb = (CFG.supabaseUrl && CFG.supabaseKey && window.supabase)
  ? window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey)
  : null;
const DEMO_USER_ID = Number(CFG.demoUserId || 1);
let sync = sb ? 'loading' : 'offline';   // loading | synced | error | offline
if (sb) S.inv = [];

function rowToItem(r) {
  return {
    id: 'db' + r.ingredient_id, dbId: r.ingredient_id,
    name: r.ingredient_name, emoji: guessEmoji(r.ingredient_name),
    cat: CATS.includes(r.food_type) ? r.food_type : 'Other',
    qty: Number(r.quantity), unit: r.measurement, exp: r.expiration_date,
    store: r.food_type === 'Frozen' ? 'Freezer' : 'Fridge',
    src: (r.way_added === 'barcode' || r.way_added === 'manual') ? 'label' : 'ai'
  };
}
function statusFor(exp) {
  const d = Math.round((parseIso(exp) - TODAY) / DAY);
  return d < 0 ? 'Expired' : d <= 7 ? 'Expiring soon' : 'Fresh';
}
async function loadPantry() {
  if (!sb) return;
  sync = 'loading';
  const { data, error } = await sb.from('pantry_item')
    .select('*').eq('user_id', DEMO_USER_ID).order('expiration_date');
  if (error) { sync = 'error'; console.error('[MyPantry] load failed', error); toast(`Couldn't load your pantry: ${esc(error.message)}`, null, 'alert'); render(); return; }
  S.inv = data.map(rowToItem); sync = 'synced';
  if (S.chat.length <= 2) S.chat = [];   // rebuild the assistant's greeting with the real pantry
  render();
}
const STORE_KEY = 'mp_state_v1';
function persist() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ inv: sb ? undefined : S.inv, saved: [...S.saved], liked: [...S.liked], prefs: S.prefs, metric: S.metric, store: S.store, zip: S.zip, uid }));
  } catch (_) {}
}
function hydrate() {
  try {
    const d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); if (!d) return;
    if (Array.isArray(d.inv) && !sb) S.inv = d.inv;
    S.saved = new Set(d.saved || []); S.liked = new Set(d.liked || []); S.prefs = d.prefs || {};
    S.metric = !!d.metric; S.store = d.store || S.store; S.zip = d.zip || S.zip; uid = Math.max(uid, d.uid || 0);
  } catch (_) {}
}
hydrate();

/* ---------- Inventory logic ---------- */
const findItems = m => S.inv.filter(i => i.name.toLowerCase().includes(m) && i.qty > 0).sort(byExp);
const has = m => findItems(m).length > 0;
const canMake = r => r.ing.every(g => has(g.m));
function missingOf(r) { return r.ing.filter(g => !has(g.m)); }
function canMakeWithSub(r) {
  const miss = missingOf(r);
  return miss.length > 0 && r.subs && miss.every(g => r.subs[g.m] && r.subs[g.m].use.every(has));
}
function recipeUrgency(r) {
  let best = 99;
  r.ing.forEach(g => findItems(g.m).forEach(it => { const d = daysLeft(it); if (d >= 0 && d < best) best = d; }));
  return best;
}
function score(r) {
  const u = recipeUrgency(r);
  return (S.prefs[r.main] || 0) * 2 + (S.prefs[r.type] || 0) + (u <= 3 ? .6 : 0);
}
const makeable = () => RECIPES.filter(canMake).sort((a, b) => score(b) - score(a));

function snapshot() { return JSON.stringify(S.inv); }
function restore(snap) { S.inv = JSON.parse(snap); }

function useRecipe(r) {
  const before = snapshot();
  const log = [];
  r.ing.forEach(g => {
    let need = g.a;
    for (const it of findItems(g.m)) {
      if (need <= 0) break;
      const take = Math.min(it.qty, need);
      const from = it.qty;
      it.qty = Math.round((it.qty - take) * 1000) / 1000;
      need -= take;
      log.push({ name: it.name, emoji: it.emoji, from, to: it.qty, unit: it.unit });
    }
  });
  S.inv = S.inv.filter(i => i.qty > 0.001);
  S.undo = before;
  return log;
}
function previewUse(r) {
  const copy = JSON.parse(snapshot());
  const saved = S.inv; S.inv = copy;
  const log = useRecipe(r);
  S.inv = saved; S.undo = null;
  return log;
}
const logLine = l => `${esc(l.name)}: ${qtyText(l.from, l.unit)} → ${l.to <= 0.001 ? 'used up' : qtyText(l.to, l.unit)}`;

function addItems(items) {
  items.forEach(n => {
    const same = S.inv.find(i => i.name.toLowerCase() === n.name.toLowerCase() && i.exp === n.exp && i.unit === n.unit);
    if (same) same.qty = Math.round((same.qty + n.qty) * 100) / 100;
    else S.inv.push({ id: 'i' + (uid++), name: n.name, emoji: n.emoji, cat: n.cat, qty: n.qty, unit: n.unit, exp: n.exp, store: n.store, src: n.src });
  });
}
function dupOf(name) {
  const key = name.toLowerCase().replace(/\(.*?\)/g, '').trim().split(' ').slice(-1)[0].replace(/s$/, '');
  if (key.length < 3) return [];
  return S.inv.filter(i => i.name.toLowerCase().includes(key)).sort(byExp);
}
function learn(r) {
  S.prefs[r.main] = (S.prefs[r.main] || 0) + 1;
  S.prefs[r.type] = (S.prefs[r.type] || 0) + 1;
  const el = $('#learnChip'); if (el) el.textContent = learnText();
}
function learnText() {
  const top = Object.entries(S.prefs).sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
  return top.length ? `Tuned to you: ${top.join(' · ')}` : 'Watch 5 sec or tap ♥ to tune your feed';
}

/* ---------- DOM roots ---------- */
const phone = $('#phone');
const app = $('#app');

/* ---------- Toast / sheets ---------- */
let toastTimer;
function toast(msg, undoFn, icon = 'check', actLabel = 'Undo') {
  $$('.toast', phone).forEach(t => t.remove());
  const t = document.createElement('div');
  t.className = 'toast'; t.setAttribute('role', 'status');
  t.innerHTML = `${ic(icon)}<span>${msg}</span>${undoFn ? `<button type="button">${actLabel}</button>` : ''}`;
  if (undoFn) t.querySelector('button').onclick = () => { undoFn(); t.remove(); };
  phone.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), undoFn ? 5000 : 2600);
}
function openSheet(html, opts = {}) {
  closeSheet();
  const s = document.createElement('div');
  s.className = 'scrim' + (opts.center ? ' center-modal' : '');
  s.id = 'scrim';
  s.innerHTML = opts.center ? `<div class="modal" role="dialog" aria-modal="true">${html}</div>` : `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  s.addEventListener('click', e => { if (e.target === s) closeSheet(); });
  phone.appendChild(s);
  const f = s.querySelector('[autofocus]'); if (f) setTimeout(() => f.focus(), 60);
  return s;
}
function closeSheet() { const s = $('#scrim'); if (s) s.remove(); }

/* ---------- Render root ---------- */
let reelCtl = null;
function render() {
  unmountReels();
  const keepScroll = $('.scroll', app)?.scrollTop || 0;
  const prevKey = app.dataset.key;
  let html = '';
  if (S.auth !== 'app') html = renderAuth();
  else html = renderApp();
  app.innerHTML = html;
  const key = S.auth + S.tab + (S.setPage || '') + (S.scan ? S.scan.stage : '');
  app.dataset.key = key;
  const dark = S.auth === 'app' && (S.tab === 'reels' || (S.tab === 'scan' && S.scan && ['camera', 'analyzing', 'error'].includes(S.scan.stage)));
  phone.classList.toggle('dark-chrome', dark);
  afterRender(prevKey === key ? keepScroll : 0);
}
function afterRender(scrollTop) {
  persist();
  const sc = $('.scroll', app);
  if (sc && scrollTop) sc.scrollTop = scrollTop;
  if (S.auth === 'app' && S.tab === 'home') { const cs = $('#chatScroll'); if (cs) cs.scrollTop = cs.scrollHeight; }
  if (S.auth === 'app' && S.tab === 'reels') mountReels();
  bindForms();
}

/* ===========================================================
   AUTH SCREENS
   =========================================================== */
function renderAuth() {
  const a = S.auth;
  if (a === 'login') return `<div class="scroll"><form class="auth" id="loginForm" novalidate>
    <div class="auth-hero">${LOGO}<h1>Know what's in your kitchen.</h1><p>Sign in to see what you have, what's going bad, and what to cook tonight.</p></div>
    ${S.remembered && S.faceId ? `<button type="button" class="btn btn-soft" data-act="faceid">${ic('face')} Sign in with Face ID</button><div class="divider">or use your email</div>` : ''}
    <div class="err" id="loginErr" hidden>${ic('alert')}<span></span></div>
    <div class="field"><label for="li_email">Email</label><input class="input" id="li_email" type="email" autocomplete="username" placeholder="you@example.com" value="${esc(S.lastEmail || '')}"></div>
    <div class="field"><label for="li_pw">Password</label><div class="pw-wrap"><input class="input" id="li_pw" type="password" autocomplete="current-password" placeholder="Your password"><button type="button" data-act="showpw" data-arg="li_pw">Show</button></div></div>
    <div style="display:flex;justify-content:space-between;align-items:center">
      <label class="check"><input type="checkbox" id="li_rem" ${S.stayIn ? 'checked' : ''}> Remember me</label>
      <button type="button" class="link" data-act="auth" data-arg="forgot">Forgot password?</button>
    </div>
    <button class="btn btn-primary" type="submit">Sign in</button>
    <div class="spacer"></div>
    <div class="auth-foot">New to MyPantry? <button type="button" class="link" data-act="auth" data-arg="signup">Create an account</button></div>
  </form></div>`;

  if (a === 'forgot') return `<div class="scroll"><form class="auth" id="forgotForm" novalidate>
    <button type="button" class="back" data-act="auth" data-arg="login">${ic('left')} Sign in</button>
    <div class="auth-hero"><h1>Reset your password</h1><p>Enter the email you signed up with. We'll send you a link to set a new password.</p></div>
    <div class="err" id="fgErr" hidden>${ic('alert')}<span></span></div>
    <div class="ok" id="fgOk" hidden>${ic('check')}<span></span></div>
    <div class="field"><label for="fg_email">Email</label><input class="input" id="fg_email" type="email" placeholder="you@example.com" autofocus></div>
    <button class="btn btn-primary" type="submit">Send reset link</button>
  </form></div>`;

  if (a === 'signup') return `<div class="scroll"><form class="auth" id="signupForm" novalidate>
    <button type="button" class="back" data-act="auth" data-arg="login">${ic('left')} Sign in</button>
    <div class="auth-hero" style="padding-top:0"><h1>Create your account</h1><p>It takes a minute. Then snap a photo of your fridge and you're set.</p></div>
    <div class="err" id="suErr" hidden>${ic('alert')}<span></span></div>
    <div class="field"><label for="su_name">First name</label><input class="input" id="su_name" type="text" autocomplete="given-name" placeholder="Karen"></div>
    <div class="field"><label for="su_email">Email</label><input class="input" id="su_email" type="email" autocomplete="email" placeholder="you@example.com"><span class="field-err" id="su_emailErr" hidden>Enter a valid email, like name@example.com.</span></div>
    <div class="field"><label for="su_pw">Password</label><div class="pw-wrap"><input class="input" id="su_pw" type="password" autocomplete="new-password" placeholder="Create a password"><button type="button" data-act="showpw" data-arg="su_pw">Show</button></div></div>
    <div class="field"><label for="su_pw2">Confirm password</label><input class="input" id="su_pw2" type="password" autocomplete="new-password" placeholder="Type it again"></div>
    <ul class="pw-rules" id="pwRules">
      <li data-rule="len">At least 14 characters</li>
      <li data-rule="sym">Includes a symbol, like ! # $ or %</li>
      <li data-rule="match">Both passwords match</li>
    </ul>
    <button class="btn btn-primary" type="submit" id="suBtn" disabled>Create account</button>
    <div class="auth-foot">Already have an account? <button type="button" class="link" data-act="auth" data-arg="login">Sign in</button></div>
  </form></div>`;

  if (a === 'verify') return `<div class="scroll"><div class="auth">
    <div class="big-illus">📬</div>
    <div class="center" style="display:grid;gap:8px"><h1 style="font-size:26px">Check your email</h1><p style="margin:0;color:var(--ink-2)">We sent a confirmation link to <b>${esc(S.signupEmail)}</b>. Open it to finish setting up your account.</p></div>
    <div class="mail-card">
      <div class="hint" style="margin-bottom:6px">Preview of the email (tap the button to confirm)</div>
      <b>MyPantry</b> · Confirm your account<br>Hi ${esc(S.pendingName || 'there')}, tap below to confirm your email.
      <div style="margin-top:10px"><button class="btn btn-primary btn-sm" data-act="confirmEmail">Confirm my account</button></div>
    </div>
    <div class="spacer"></div>
    <div class="auth-foot">Didn't get it? <button type="button" class="link" data-act="resend">Resend email</button></div>
  </div></div>`;

  if (a === 'welcome') return `<div class="scroll"><div class="auth">
    <div class="big-illus" style="margin-top:70px">🎉</div>
    <div class="center" style="display:grid;gap:8px"><h1 style="font-size:32px">You're in!</h1><p style="margin:0;color:var(--ink-2)">Your account is confirmed. Next, log the food you already have so MyPantry can track it for you.</p></div>
    <div class="spacer"></div>
    <button class="btn btn-primary" data-act="enterApp">Let's go</button>
  </div></div>`;

  if (a === 'faceid') return `<div class="scroll"><div class="auth"><div class="faceid-ring">${ic('face')}</div><p class="center" style="margin:0;font-weight:600">Looking for Face ID…</p></div></div>`;
  return '';
}

/* ===========================================================
   APP SHELL
   =========================================================== */
function renderApp() {
  let body = '';
  if (S.tab === 'home') body = renderHome();
  else if (S.tab === 'ing') body = renderIng();
  else if (S.tab === 'scan') body = renderScan();
  else if (S.tab === 'reels') body = renderReels();
  else if (S.tab === 'settings') body = S.setPage === 'deals' ? renderDeals() : renderSettings();
  const cam = (S.tab === 'scan' && S.scan && ['camera', 'analyzing', 'error'].includes(S.scan.stage)) ? renderCamera() : '';
  return `<div class="view">${body}</div>${tabbar()}${cam}`;
}
function tabbar() {
  const urgent = S.inv.filter(i => daysLeft(i) <= 2).length;
  const t = (id, label, icon) => `<button class="tab ${S.tab === id ? 'active' : ''}" data-act="tab" data-arg="${id}" aria-label="${label}" ${S.tab === id ? 'aria-current="page"' : ''}>
      <span class="tab-ic">${ic(icon)}${id === 'ing' && urgent ? `<span class="badge">${urgent}</span>` : ''}</span>${label}</button>`;
  return `<nav class="tabbar ${S.tab === 'reels' ? 'on-dark' : ''}" aria-label="Main">
    ${t('home', 'Home', 'home')}
    ${t('ing', 'Ingredients', 'jar')}
    <button class="tab ${S.tab === 'scan' ? 'active' : ''}" data-act="tab" data-arg="scan" aria-label="Scan food"><span class="scanbtn">${ic('camera')}</span>Scan</button>
    ${t('reels', 'Reels', 'reels')}
    ${t('settings', 'Settings', 'gear')}
  </nav>`;
}

/* ===========================================================
   HOME — AI ASSISTANT
   =========================================================== */
const WELCOME = "Welcome to MyPantry! I'm your AI assistant. I'm here to answer questions, suggest recipes, remind you of food expiring soon, and help in any way that I can.";
function initChat() {
  S.chat = [{ who: 'bot', html: `<p>${WELCOME}</p>` }];
  if (!S.inv.length) {
    S.chat.push({ who: 'bot', html: `<p>Your pantry is empty right now. Snap a photo of your fridge or a receipt and I'll keep track of everything.</p><div class="actions"><button class="btn btn-primary btn-sm" data-act="tab" data-arg="scan">${ic('camera')} Log my food</button></div>` });
    return;
  }
  const soon = S.inv.filter(i => daysLeft(i) <= 3).sort(byExp);
  if (soon.length) {
    S.chat.push({ who: 'bot', html: `<p><b>Heads up, ${esc(firstName())}.</b> ${plural(soon.length, 'item')} ${soon.length === 1 ? 'needs' : 'need'} attention in the next 3 days:</p>${expList(soon.slice(0, 5))}
      <div class="actions"><button class="btn btn-soft btn-sm" data-act="ask" data-arg="What can I make with food that's going bad?">Recipes that use these</button><button class="btn btn-ghost btn-sm" data-act="goSoon">See all</button></div>` });
  }
}
const firstName = () => (S.user?.name || 'Karen').split(' ')[0];
const expList = items => `<ul class="expiring-list">${items.map(i => `<li><span class="em">${i.emoji || '📦'}</span>${esc(i.name)}${pillFor(i)}</li>`).join('')}</ul>`;

const SUGGEST = ["What's going bad?", 'I want Chinese tonight', 'What can I make for dinner?', 'Do I have cheddar?', 'Is my milk still good?', 'I made egg fried rice', 'Clear my inventory'];
function renderHome() {
  if (!S.chat.length) initChat();
  return `<div class="chat-head"><div class="bot-av">${ic('spark')}</div><div><h1>Pantry Pal</h1><div class="sub">AI assistant</div></div>
      <button class="icon-btn" data-act="newChat" aria-label="Start a new chat">${ic('refresh')}</button></div>
    <div class="scroll" id="chatScroll"><div class="chat" id="chat" aria-live="polite">${S.chat.map(m => `<div class="msg ${m.who}">${m.html}</div>`).join('')}</div></div>
    <div class="chips" aria-label="Suggestions">${SUGGEST.map(s => `<button class="chip" data-act="ask" data-arg="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <form class="composer" id="chatForm"><input class="input" id="chatIn" placeholder="Ask about your food or recipes…" autocomplete="off" aria-label="Message"><button class="send" type="submit" aria-label="Send">${ic('send')}</button></form>`;
}
function pushMsg(who, html) {
  S.chat.push({ who, html });
  const chat = $('#chat'); if (!chat) return;
  const d = document.createElement('div'); d.className = 'msg ' + who; d.innerHTML = html; chat.appendChild(d);
  const cs = $('#chatScroll'); cs.scrollTop = cs.scrollHeight;
}
function ask(text) {
  if (!text.trim()) return;
  pushMsg('user', `<p>${esc(text)}</p>`);
  const chat = $('#chat');
  const t = document.createElement('div'); t.className = 'msg bot typing'; t.innerHTML = '<i></i><i></i><i></i>'; chat.appendChild(t);
  $('#chatScroll').scrollTop = 1e6;
  setTimeout(() => { t.remove(); pushMsg('bot', reply(text)); refreshBadge(); }, 650 + Math.random() * 400);
}
function refreshBadge() { persist(); const nav = $('.tabbar', app); if (nav) nav.outerHTML = tabbar(); }

function rcard(r, opts = {}) {
  const u = recipeUrgency(r);
  const spoiled = r.ing.flatMap(g => findItems(g.m)).find(i => daysLeft(i) < 0);
  let warn = '';
  if (spoiled) warn = `<div class="warnline" style="color:var(--tomato)">Check your ${esc(spoiled.name.toLowerCase())} first. It may have gone bad.</div>`;
  else if (u <= 3) warn = `<div class="warnline">Uses food that spoils in ${plural(u, 'day')}</div>`;
  return `<div class="rcard"><div class="thumb" style="background:${r.bg}">${r.emoji}</div>
    <div><b>${esc(r.name)}</b><div class="meta">${r.time} min · Easy · ${r.type}${opts.sub ? '' : ` · you have all ${r.ing.length}`}</div>${warn}</div>
    <div class="btns"><button class="btn btn-ghost" data-act="recipe" data-arg="${r.id}">View recipe</button>${opts.sub ? '' : `<button class="btn btn-soft" data-act="useAsk" data-arg="${r.id}">I made this</button>`}</div></div>`;
}

const STOP = new Set('do i have any some the a an is my still good left how much many there got we bad gone expired safe to eat of are it any? in pantry fridge at home still? okay ok'.split(' '));
function termFrom(t) {
  return t.replace(/[?.!,]/g, '').split(/\s+/).filter(w => w && !STOP.has(w)).join(' ');
}
function lookup(term) {
  if (!term) return [];
  const words = term.split(' ').map(w => w.replace(/(es|s)$/, '')).filter(w => w.length >= 3);
  return S.inv.filter(i => { const n = i.name.toLowerCase(); return n.includes(term) || words.some(w => n.includes(w)); }).sort(byExp);
}
function dealFor(term) { return DEALS.find(d => term && d.name.toLowerCase().includes(term.split(' ')[0].replace(/s$/, ''))); }

const CUISINES = { chinese: 'Chinese', asian: 'Chinese', 'stir fry': 'Chinese', italian: 'Italian', pasta: 'Italian', mexican: 'Mexican', taco: 'Mexican', breakfast: 'Breakfast', brunch: 'Breakfast', american: 'American', comfort: 'American', japanese: 'Japanese', sushi: 'Japanese', thai: 'Thai', indian: 'Indian', greek: 'Greek', korean: 'Korean' };

function reply(text) {
  const t = text.toLowerCase().trim();

  if (/\b(clear|reset|delete|empty|wipe|remove)\b.*\b(inventory|pantry|everything|all|ingredients|food)\b/.test(t)) {
    if (!S.inv.length) return '<p>Your pantry is already empty.</p>';
    return `<p>Do you want me to remove all ${plural(S.inv.length, 'item')} from your Ingredients? This also resets your Reels recommendations.</p>
      <div class="actions"><button class="btn btn-danger btn-sm" data-act="chatClear">Yes, clear everything</button><button class="btn btn-ghost btn-sm" data-act="chatCancel">Keep my food</button></div>`;
  }

  if (/\b(made|cooked|used|ate|finished)\b/.test(t) && !/\bwhat\b|\bcan\b/.test(t)) {
    const r = RECIPES.find(x => x.kw.some(k => t.includes(k)) || t.includes(x.name.toLowerCase()));
    if (!r) return `<p>Nice! Which recipe did you make? I'll take those ingredients out of your pantry.</p><div class="actions">${makeable().slice(0, 4).map(x => `<button class="btn btn-ghost btn-sm" data-act="madeDirect" data-arg="${x.id}">${esc(x.name)}</button>`).join('')}</div>`;
    if (!canMake(r)) return `<p>I couldn't find everything for ${esc(r.name)} in your pantry, so I left it as is. You can edit items in the Ingredients tab.</p>`;
    const log = useRecipe(r);
    setTimeout(refreshBadge, 0);
    return `<p>Great choice! I updated your pantry for <b>${esc(r.name)}</b>:</p><ul>${log.map(l => `<li>${logLine(l)}</li>`).join('')}</ul>
      <div class="actions"><button class="btn btn-ghost btn-sm" data-act="undoUse">${ic('undo')} Undo</button></div>`;
  }

  if (/(still good|gone bad|go bad|goes bad|expired|spoiled|safe to|when does|when will)/.test(t)) {
    const term = termFrom(t.replace(/(still good|gone bad|go bad|goes bad|expired|spoiled|safe to eat|safe to|when does|when will|expire)/g, ''));
    const found = lookup(term);
    if (found.length) {
      return `<p>Here's what I see for <b>${esc(term)}</b>:</p>${found.map(i => {
        const d = daysLeft(i);
        const verdict = d < 0 ? `passed its date on ${fmtDate(i.exp)}. Smell and check it before using, or toss it.` : d <= 2 ? `is still good, but use it by ${fmtDate(i.exp)}.` : `is good until ${fmtDate(i.exp)}.`;
        return `<p>${i.emoji || '📦'} <b>${esc(i.name)}</b> (${qtyText(i.qty, i.unit)}) ${verdict}</p>`;
      }).join('')}${found.length > 1 ? '<p>Use the one that spoils first.</p>' : ''}${found.some(i => daysLeft(i) < 0) ? `<div class="actions"><button class="btn btn-danger btn-sm" data-act="removeItem" data-arg="${found.find(i => daysLeft(i) < 0).id}">Remove the spoiled one</button></div>` : ''}`;
    }
    if (!/(going|about|soon|what)/.test(t)) return `<p>I don't see ${esc(term || 'that')} in your pantry. Want to log it? Tap Scan below.</p>`;
  }

  if (/(do i have|do we have|have any|got any|any .* left|how much|how many|is there|should i buy|need to buy|am i out)/.test(t)) {
    const term = termFrom(t.replace(/(do i have|do we have|have any|got any|how much|how many|is there|should i buy|need to buy|am i out of)/g, ''));
    const found = lookup(term);
    if (found.length) {
      const total = found.map(i => `${qtyText(i.qty, i.unit)} (${status(daysLeft(i)).label.toLowerCase()}, ${spoilText(i).toLowerCase()})`).join(' and ');
      const allBad = found.every(i => daysLeft(i) < 0);
      return `<p>${found[0].emoji || '📦'} Yes, you have <b>${esc(found[0].name)}</b>: ${total}.</p><p>${allBad ? 'It has gone bad, so go ahead and buy more.' : 'No need to buy more right now.'}</p>`;
    }
    const deal = dealFor(term);
    return `<p>You're out of <b>${esc(term || 'that')}</b>. It's safe to buy.</p>${deal ? `<p>${deal.emoji} It's on sale at ${esc(S.store)} this week: <b>$${price(deal.p)}</b> (was $${price(deal.was)}).</p>` : ''}`;
  }

  if (/(expir|going bad|spoil|go bad|use up|use first|about to|going off)/.test(t)) {
    const soon = S.inv.filter(i => daysLeft(i) <= 7).sort(byExp);
    if (!soon.length) return '<p>Good news: nothing in your pantry goes bad in the next 7 days.</p>';
    const ids = new Set(soon.filter(i => daysLeft(i) >= 0 && daysLeft(i) <= 3).map(i => i.name.toLowerCase()));
    const recs = makeable().filter(r => r.ing.some(g => [...ids].some(n => n.includes(g.m)))).slice(0, 2);
    const spoiled = soon.filter(i => daysLeft(i) < 0);
    return `<p>These go bad soonest. Use the top ones first:</p>${expList(soon.slice(0, 6))}
      ${spoiled.length ? `<p>${esc(spoiled.map(i => i.name).join(', '))} already passed ${spoiled.length > 1 ? 'their dates' : 'its date'}. Check ${spoiled.length > 1 ? 'them' : 'it'} before eating.</p>` : ''}
      ${recs.length ? `<p>Easy recipes that use them:</p>${recs.map(r => rcard(r)).join('')}` : ''}`;
  }

  const cKey = Object.keys(CUISINES).find(k => t.includes(k));
  if (cKey) {
    const type = CUISINES[cKey];
    const list = makeable().filter(r => r.type === type);
    const near = RECIPES.filter(r => r.type === type && canMakeWithSub(r));
    const missing = RECIPES.filter(r => r.type === type && !canMake(r) && !canMakeWithSub(r));
    if (list.length || near.length) {
      return `<p>${type} tonight, got it. ${list.length ? `You can make ${list.length === 1 ? 'this' : 'these'} with what you have:` : ''}</p>${list.slice(0, 3).map(r => rcard(r)).join('')}${near.map(subBlock).join('')}`;
    }
    const alt = makeable().slice(0, 2);
    const m = missing[0];
    return `<p>I couldn't find an easy ${type} recipe you can make with your food right now.${m ? ` ${esc(m.name)} needs ${esc(missingOf(m).map(g => g.m).join(' and '))}.` : ''}</p>${alt.length ? `<p>Here's what you can make tonight instead:</p>${alt.map(r => rcard(r)).join('')}` : ''}`;
  }

  if (/(hard|fancy|complicated|gourmet|impressive)/.test(t)) {
    return `<p>I keep things simple on purpose. Every recipe I suggest takes 30 minutes or less and uses food you already have. Here's the quickest one right now:</p>${makeable().sort((a, b) => a.time - b.time).slice(0, 1).map(r => rcard(r)).join('')}`;
  }

  if (/(recipe|make|cook|dinner|lunch|eat|hungry|idea|meal|tonight|supper|snack|kids)/.test(t)) {
    const list = makeable();
    if (!list.length) return '<p>You don\'t have enough ingredients to make anything yet. Try adding more food to your pantry.</p>';
    const byUrg = [...list].sort((a, b) => recipeUrgency(a) - recipeUrgency(b));
    const near = RECIPES.filter(canMakeWithSub).slice(0, 1);
    return `<p>Here are easy meals you can make right now. I put the ones that use food going bad first:</p>${byUrg.slice(0, 3).map(r => rcard(r)).join('')}${near.map(subBlock).join('')}`;
  }

  if (/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/.test(t)) return `<p>Hi ${esc(firstName())}! Ask me what's going bad, what to cook, or whether you already have something before you buy it.</p>`;
  if (/(help|what can you do|how do i|how does)/.test(t)) return `<p>I can help you:</p><ul><li>See what's going bad and use it first</li><li>Find easy recipes with food you already have</li><li>Check if you have something before you buy it</li><li>Update your pantry when you cook ("I made tacos")</li><li>Clear your inventory when you want to start over</li></ul>`;
  if (/thank/.test(t)) return '<p>Anytime! Happy cooking.</p>';

  return `<p>I'm not sure I understood that. Try asking:</p><div class="actions">${['What can I make for dinner?', "What's going bad?", 'Do I have eggs?'].map(s => `<button class="btn btn-ghost btn-sm" data-act="ask" data-arg="${esc(s)}">${s}</button>`).join('')}</div>`;
}
function subBlock(r) {
  const miss = missingOf(r)[0];
  return `<div class="sub-card"><b>Almost there: ${esc(r.name)}</b><br>You're missing ${esc(miss.m)}. ${esc(r.subs[miss.m].text)}</div>${rcard(r, { sub: true })}`;
}

/* ===========================================================
   INGREDIENTS
   =========================================================== */
function renderIng() {
  const n = S.inv.length;
  const soonCount = S.inv.filter(i => daysLeft(i) <= 7).length;
  let content;
  if (!n && sync === 'loading') {
    content = `<div class="empty"><div class="spinner" style="border-color:var(--line);border-top-color:var(--basil)"></div><p>Loading your pantry…</p></div>`;
  } else if (!n) {
    content = `<div class="empty"><div class="big-illus">🧺</div><h2>Your pantry is empty</h2>
      <p>Log your groceries and we'll keep track of what you have and when it spoils.</p>
      <div class="pointer">Tap Add food to start ${ic('arrowDown')}</div></div>`;
  } else if (S.ingView === 'soon') {
    content = renderSoon();
  } else {
    content = `<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${P.search}</svg><input class="input" id="ingSearch" placeholder="Search your food" value="${esc(S.ingQuery)}" aria-label="Search your food"></div>
      <div class="chips cat-chips">${['All', ...CATS].map(c => `<button class="chip ${S.ingCat === c ? 'on' : ''}" data-act="ingCat" data-arg="${c}">${c}</button>`).join('')}</div>
      <div id="ingList">${ingListHtml()}</div>`;
  }
  return `<div class="appbar"><div><h1>Ingredients</h1><div class="sub">${plural(n, 'item')} in your kitchen</div></div>${syncChip()}</div>
    ${n ? `<div class="seg" role="tablist"><button role="tab" class="${S.ingView === 'all' ? 'on' : ''}" data-act="ingView" data-arg="all">All items</button><button role="tab" class="${S.ingView === 'soon' ? 'on' : ''}" data-act="ingView" data-arg="soon">Going bad soon ${soonCount ? `<span class="count">${soonCount}</span>` : ''}</button></div>` : ''}
    <div class="scroll">${content}<div style="height:90px"></div></div>
    <button class="fab" data-act="tab" data-arg="scan">${ic('plus')} Add food</button>`;
}
function syncChip() {
  const m = { loading: ['Loading…', 'soon'], synced: ['Saved in database', 'fresh'], error: ['Not connected', 'now'], offline: ['Offline demo', 'soon'] }[sync];
  return `<span class="pill ${m[1]}" id="syncChip" title="${sb ? 'Pantry is stored in Supabase' : 'No Supabase config found; changes stay in this browser'}">${m[0]}</span>`;
}
function itemRow(i) {
  const [v, u] = disp(i.qty, i.unit);
  return `<button class="item" data-act="edit" data-arg="${i.id}" aria-label="Edit ${esc(i.name)}">
    ${imgHtml(i)}
    <span><span class="name">${esc(i.name)}</span><br><span class="qty num">${u === 'ct' ? `${v} count` : `${v} ${u}`} · ${i.store}</span>
      <span class="date num">${i.src === 'label' ? ic('tag') : ic('spark')} ${spoilText(i)}${i.src === 'ai' ? ' (estimate)' : ''}</span></span>
    <span class="right">${pillFor(i)}<svg class="edit-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P.pencil}</svg></span>
  </button>`;
}
function ingListHtml() {
  const q = S.ingQuery.toLowerCase().trim();
  const items = S.inv.filter(i => (S.ingCat === 'All' || i.cat === S.ingCat) && (!q || i.name.toLowerCase().includes(q)));
  if (!items.length) return `<div class="empty"><p>No food matches${q ? ` "${esc(q)}"` : ''}${S.ingCat !== 'All' ? ` in ${S.ingCat}` : ''}.</p></div>`;
  return CATS.filter(c => items.some(i => i.cat === c)).map(c => {
    const list = items.filter(i => i.cat === c).sort(byExp);
    return `<section class="cat"><div class="cat-h"><h2>${c}</h2><span>${plural(list.length, 'item')}</span></div><div class="list">${list.map(itemRow).join('')}</div></section>`;
  }).join('');
}
function renderSoon() {
  const list = S.inv.filter(i => daysLeft(i) <= 7).sort(byExp);
  const bad = list.filter(i => daysLeft(i) < 0).length;
  const now = list.filter(i => daysLeft(i) >= 0 && daysLeft(i) <= 2).length;
  const wk = list.length - bad - now;
  if (!list.length) return `<div class="empty"><div class="big-illus">✅</div><h2>Nothing is going bad this week</h2><p>We'll move food here 7 days before it spoils.</p></div>`;
  return `<div class="summary-strip"><div class="r"><b class="num">${bad}</b><span>Spoiled</span></div><div class="r"><b class="num">${now}</b><span>0–2 days</span></div><div class="y"><b class="num">${wk}</b><span>3–7 days</span></div></div>
    <p class="soon-note">Sorted by spoil date. Use the food at the top first.</p>
    <div class="list" style="margin-top:8px">${list.map(itemRow).join('')}</div>
    <div style="padding:14px 18px 0"><button class="btn btn-soft" data-act="askFromSoon">${ic('spark')} Find recipes that use these</button></div>`;
}

/* ---------- Item form (edit / manual add / review edit) ---------- */
function itemForm(it, mode) {
  const [v, u] = it.qty != null ? disp(it.qty, it.unit) : ['1', S.metric ? 'ct' : 'ct'];
  const units = S.metric ? UNITS_METRIC : UNITS_US;
  const title = mode === 'new' ? 'Enter item details' : mode === 'review' ? 'Edit detected item' : 'Edit item';
  const srcNote = mode === 'edit' ? (it.src === 'label' ? `${ic('tag')}<span>This date came from the best-by label.</span>` : `${ic('spark')}<span>We estimated this date from the food type and where you keep it (${it.store.toLowerCase()}). Change it if it looks wrong.</span>`) : `${ic('spark')}<span>Leave the date blank and we'll estimate it from the food type and where you store it.</span>`;
  return `<div class="sheet-head"><h2>${title}</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <form class="sheet-body" id="itemForm" novalidate data-mode="${mode}" data-id="${it.id || ''}">
    <div class="field"><label for="f_name">Name</label><input class="input" id="f_name" value="${esc(it.name || '')}" placeholder="e.g. Cottage cheese" ${mode === 'new' ? 'autofocus' : ''}><span class="field-err" id="f_nameErr" hidden>Give this item a name.</span></div>
    <div class="row2">
      <div class="field"><label for="f_qty">Quantity</label><input class="input num" id="f_qty" inputmode="decimal" value="${v}"></div>
      <div class="field"><label for="f_unit">Measurement</label><select class="input" id="f_unit">${units.map(x => `<option ${x === u ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <span class="field-err" id="f_qtyErr" hidden style="margin-top:-8px">Quantity can only be a number, like 2 or 0.5.</span>
    <div class="field"><label for="f_cat">Food category</label><select class="input" id="f_cat">${CATS.map(c => `<option ${c === (it.cat || 'Other') ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
    <div class="field"><span class="lbl">Stored in</span><div class="store-sel" id="f_store" role="radiogroup">${['Fridge', 'Pantry', 'Freezer'].map(s => `<button type="button" role="radio" aria-checked="${s === (it.store || 'Fridge')}" class="${s === (it.store || 'Fridge') ? 'on' : ''}" data-store="${s}" style="flex:1;padding:8px">${s}</button>`).join('')}</div></div>
    <div class="field"><label for="f_exp">Spoil date</label><input class="input" id="f_exp" type="date" value="${it.exp || ''}"></div>
    <div class="est-note">${srcNote}</div>
  </form>
  <div class="sheet-foot">
    <button class="btn btn-primary" data-act="saveItem" id="saveItemBtn">${mode === 'new' ? 'Add to MyPantry' : 'Save'}</button>
    ${mode === 'edit' ? `<button class="btn btn-danger-ghost" data-act="deleteItem" data-arg="${it.id}">${ic('trash')} Delete item</button>` : ''}
  </div>`;
}
function openItemForm(it, mode) {
  openSheet(itemForm(it, mode));
  const qty = $('#f_qty'), err = $('#f_qtyErr'), btn = $('#saveItemBtn');
  const validate = () => {
    const ok = /^\d*\.?\d+$|^\d+\.?$/.test(qty.value.trim()) && parseFloat(qty.value) > 0;
    const bad = qty.value.trim() !== '' && !/^[0-9]*\.?[0-9]*$/.test(qty.value.trim());
    qty.classList.toggle('bad', bad);
    err.hidden = !bad;
    btn.disabled = !ok;
  };
  qty.addEventListener('input', validate);
  $$('#f_store button').forEach(b => b.onclick = () => {
    $$('#f_store button').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
    b.classList.add('on'); b.setAttribute('aria-checked', 'true');
  });
  $('#itemForm').addEventListener('submit', e => { e.preventDefault(); ACT.saveItem(); });
  validate();
}
function readItemForm() {
  const name = $('#f_name').value.trim();
  $('#f_nameErr').hidden = !!name; $('#f_name').classList.toggle('bad', !name);
  if (!name) return null;
  const q = parseFloat($('#f_qty').value);
  if (!(q > 0)) return null;
  const [bq, bu] = fromDisp(q, $('#f_unit').value);
  const cat = $('#f_cat').value;
  const store = $('#f_store .on')?.dataset.store || 'Fridge';
  const expIn = $('#f_exp').value;
  return { name, qty: Math.round(bq * 1000) / 1000, unit: bu, cat, store, exp: expIn || estimate(cat, store), src: expIn ? 'label' : 'ai', emoji: guessEmoji(name) };
}

/* ===========================================================
   SCAN
   =========================================================== */
const DETECT = {
  pantry: [
    { name: 'Honeycrisp apples', emoji: '🍎', cat: 'Produce', unit: 'ct', store: 'Fridge', src: 'ai' },
    { name: 'Baby carrots', emoji: '🥕', cat: 'Produce', unit: 'bag', store: 'Fridge', src: 'ai' },
    { name: 'Milk (2%)', emoji: '🥛', cat: 'Dairy', unit: 'gal', store: 'Fridge', src: 'label', d: 12 },
    { name: 'Cottage cheese', emoji: null, cat: 'Dairy', unit: 'oz', qty: 16, store: 'Fridge', src: 'label', d: 14 },
    { name: 'Orange juice', emoji: '🧃', cat: 'Drinks', unit: 'fl oz', qty: 52, store: 'Fridge', src: 'label', d: 9 }
  ],
  receipt: [
    { name: 'Chicken thighs', emoji: '🍗', cat: 'Meat & Seafood', unit: 'lb', store: 'Fridge', src: 'ai' },
    { name: 'Avocados', emoji: '🥑', cat: 'Produce', unit: 'ct', store: 'Pantry', src: 'ai' },
    { name: 'Cheddar cheese', emoji: '🧀', cat: 'Dairy', unit: 'oz', qty: 8, store: 'Fridge', src: 'ai' },
    { name: 'Bagels', emoji: '🥯', cat: 'Grains & Bread', unit: 'bag', store: 'Pantry', src: 'ai' },
    { name: 'Frozen waffles', emoji: '🧇', cat: 'Frozen', unit: 'box', store: 'Freezer', src: 'ai' },
    { name: 'Heavy cream', emoji: '🥛', cat: 'Dairy', unit: 'fl oz', qty: 16, store: 'Fridge', src: 'ai' }
  ],
  barcode: [
    { name: 'Creamy peanut butter', emoji: '🥜', cat: 'Other', unit: 'jar', store: 'Pantry', src: 'ai' }
  ]
};
function startScan(mode) { S.scan = { mode, stage: mode === 'manual' ? 'menu' : 'camera', demo: 'good', items: [] }; render(); }
function renderScan() {
  const sc = S.scan;
  if (!sc || sc.stage === 'menu') return scanMenu();
  if (sc.stage === 'review') return renderReview();
  if (sc.stage === 'done') return renderDone();
  return scanMenu();
}
function scanMenu() {
  const o = (mode, icon, title, sub, tint, feat) => `<button class="opt ${feat ? 'featured' : ''}" data-act="${mode === 'manual' ? 'manual' : 'startScan'}" data-arg="${mode}">
      <span class="oi" style="${feat ? '' : `background:${tint}`}">${ic(icon)}</span><span><b>${title}</b><span>${sub}</span></span>${`<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${P.right}</svg>`}</button>`;
  return `<div class="scroll"><div class="scan-h"><h1>Start Logging Your Food</h1><p>Pick the fastest way. You'll review everything before it's saved.</p></div>
    <div class="opts">
      ${o('pantry', 'fridge', 'Take a picture of your pantry or fridge', 'Logs many items at once', '', true)}
      ${o('receipt', 'receipt', 'Take a picture of your receipt', 'Best right after shopping', 'var(--butter-soft)')}
      ${o('barcode', 'barcode', "Scan your item's bar code", 'One item at a time', 'var(--sky-soft)')}
      ${o('manual', 'pencil', 'Enter item details yourself', 'Type the name, amount and date', 'var(--surface-3)')}
    </div>
    <div class="tip"><b>Tip:</b> Photos work best in good light with labels facing the camera. We read best-by dates when we can see them and estimate the rest.</div>
  </div>`;
}
function renderCamera() {
  const sc = S.scan;
  const titles = { pantry: 'Photo of pantry or fridge', receipt: 'Photo of receipt', barcode: 'Scan bar code' };
  const hints = { pantry: 'Fit your shelves in the frame, then tap the button.', receipt: 'Lay the receipt flat and fit it in the frame.', barcode: 'Line up the bar code inside the frame.' };
  let scene = '';
  if (sc.mode === 'pantry') scene = `<div class="scene fridge"><div class="shelf">🥛🧃🍎</div><div class="shelf">🥕🧀🥚</div><div class="shelf">🍎🥬🧈</div></div>`;
  if (sc.mode === 'receipt') scene = `<div class="scene receipt"><div class="paper"><div class="c">SMITH'S #4410</div>${[['CHKN THIGHS', '6.48'], ['AVOCADO 4CT', '3.00'], ['CHEDDAR 8OZ', '2.00'], ['BAGELS 6CT', '3.29'], ['WAFFLES FRZ', '2.99'], ['HVY CREAM', '2.49']].map(r => `<div class="r"><span>${r[0]}</span><span>${r[1]}</span></div>`).join('')}<div class="r" style="margin-top:6px;font-weight:700"><span>TOTAL</span><span>20.25</span></div></div></div>`;
  if (sc.mode === 'barcode') scene = `<div class="scene barcode"><div class="product">${sc.demo === 'good' ? 'CREAMY PEANUT BUTTER' : 'IMPORTED SNACK MIX'}<div class="bc"></div></div></div>`;
  const toggle = sc.mode === 'barcode'
    ? `Demo: <button class="${sc.demo === 'good' ? 'on' : ''}" data-act="demo" data-arg="good">Known item</button><button class="${sc.demo === 'bad' ? 'on' : ''}" data-act="demo" data-arg="bad">Unknown item</button>`
    : `Demo: <button class="${sc.demo === 'good' ? 'on' : ''}" data-act="demo" data-arg="good">Clear photo</button><button class="${sc.demo === 'bad' ? 'on' : ''}" data-act="demo" data-arg="bad">Blurry photo</button>`;
  const errMsg = sc.mode === 'barcode' ? "We couldn't find this item. Try taking a picture of it instead." : "We couldn't see your food clearly. Please retake the photo.";
  const errBtns = sc.mode === 'barcode'
    ? `<button class="btn btn-primary" data-act="startScan" data-arg="pantry">${ic('camera')} Take a picture instead</button><button class="btn btn-ghost" data-act="manual">Enter it myself</button>`
    : `<button class="btn btn-primary" data-act="retake">${ic('camera')} Retake photo</button>`;
  return `<div class="camera" role="dialog" aria-label="${titles[sc.mode]}">
    <div class="cam-top"><button class="close" data-act="scanCancel" aria-label="Close camera">${ic('x')}</button><b>${titles[sc.mode]}</b><span style="width:34px"></span></div>
    <div class="viewfinder ${sc.demo === 'bad' && sc.mode !== 'barcode' ? 'blurry' : ''}">${scene}<div class="vf-corners"><i></i><i></i><i></i><i></i></div>${sc.mode === 'barcode' ? '<div class="scanline"></div>' : ''}
      ${sc.stage === 'analyzing' ? `<div class="analyzing"><div class="spinner"></div>${sc.mode === 'barcode' ? 'Looking up this item…' : 'Finding your food…'}</div>` : ''}</div>
    <div class="cam-hint">${hints[sc.mode]}</div>
    <div class="demo-toggle">${toggle}</div>
    <div class="cam-bottom"><span style="width:44px"></span><button class="shutter" data-act="shutter" aria-label="${sc.mode === 'barcode' ? 'Scan bar code' : 'Take photo'}"><i></i></button><button class="cam-side" data-act="manual" aria-label="Type it instead">${ic('pencil')}</button></div>
    ${sc.stage === 'error' ? `<div class="cam-error" role="alert"><div class="eh">${ic('alert')}<b>${errMsg}</b></div><div class="btns">${errBtns}</div></div>` : ''}
  </div>`;
}
function buildDetected(mode) {
  return DETECT[mode].map(d => ({
    tid: 't' + (uid++), name: d.name, emoji: d.emoji, cat: d.cat, unit: d.unit, qty: d.qty && mode !== 'receipt' ? 1 : 1,
    pkg: d.qty || null, store: d.store, src: d.src,
    exp: d.src === 'label' ? inDays(d.d) : estimate(d.cat, d.store), on: true
  }));
}
function renderReview() {
  const sc = S.scan;
  const on = sc.items.filter(i => i.on).length;
  const srcLine = { pantry: 'your fridge photo', receipt: `your ${S.store} receipt`, barcode: 'the bar code' }[sc.mode];
  const now = new Date();
  return `<div class="appbar" style="padding-bottom:4px"><button class="back" data-act="scanCancel">${ic('left')} Cancel</button></div>
  <div class="scroll">
    <div class="review-h"><h1>We found ${plural(sc.items.length, 'item')}</h1><p>From ${srcLine} · ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Check each one before saving.</p></div>
    <div class="pad" style="display:grid;gap:10px">${sc.items.map(reviewCard).join('')}</div>
    <div class="pad" style="padding-top:12px"><button class="btn btn-ghost" data-act="manualInReview">${ic('plus')} Add something we missed</button></div>
    <div style="height:20px"></div>
  </div>
  <div class="sheet-foot" style="background:var(--surface);padding-bottom:12px"><button class="btn btn-primary" data-act="confirmScan" ${on ? '' : 'disabled'}>Add ${plural(on, 'item')} to MyPantry</button></div>`;
}
function reviewCard(i) {
  const [v, u] = disp(i.qty, i.unit);
  const dups = dupOf(i.name);
  const tmp = { exp: i.exp };
  const d = daysLeft(tmp);
  return `<div class="rv ${i.on ? '' : 'off'}" data-tid="${i.tid}">
    <div class="rv-top">${imgHtml(i)}<div><b>${esc(i.name)}</b><span class="cat-l">${i.cat}${i.pkg ? ` · ${qtyText(i.pkg, i.unit)} size` : ''}</span></div>
      <div style="display:flex;gap:6px">${i.on ? `<button class="mini-btn" data-act="reviewEdit" data-arg="${i.tid}">Edit</button><button class="mini-btn" data-act="reviewToggle" data-arg="${i.tid}" aria-label="Remove ${esc(i.name)}">${'Remove'}</button>` : `<button class="mini-btn" data-act="reviewToggle" data-arg="${i.tid}">Add back</button>`}</div></div>
    ${i.on ? `<div class="rv-bottom">
      <div class="stepper"><button data-act="qty" data-arg="${i.tid}|-1" aria-label="Decrease">−</button><input class="num" value="${v}" inputmode="decimal" data-qty="${i.tid}" aria-label="Quantity for ${esc(i.name)}"><span class="u">${u === 'ct' ? 'count' : u}</span><button data-act="qty" data-arg="${i.tid}|1" aria-label="Increase">+</button></div>
      <div class="rv-date">Spoils <b class="num">${fmtDate(i.exp)}</b> <span class="hint">(${plural(d, 'day')})</span><br><span class="src ${i.src === 'label' ? 'label' : 'ai'}">${i.src === 'label' ? 'Read from label' : 'AI estimate'}</span></div>
    </div>
    <div class="rv-bottom"><span class="hint">Stored in</span><div class="store-sel">${['Fridge', 'Pantry', 'Freezer'].map(s => `<button class="${s === i.store ? 'on' : ''}" data-act="reviewStore" data-arg="${i.tid}|${s}">${s}</button>`).join('')}</div></div>
    ${dups.length ? `<div class="dup">${ic('alert')}<span>You already have ${dups.map(x => `${qtyText(x.qty, x.unit)} (${status(daysLeft(x)).label.toLowerCase()})`).join(' and ')}. Remove it if this is the same one.</span></div>` : ''}` : ''}
  </div>`;
}
function renderDone() {
  const sc = S.scan;
  return `<div class="scroll"><div class="success"><div class="big-illus">✅</div><h1>Added to MyPantry</h1><p>${plural(sc.added.length, 'item')} saved. We'll remind you before ${sc.added.length === 1 ? 'it spoils' : 'they spoil'}.</p>
    <div class="added-list">${sc.added.map(a => `<span>${a.emoji || '📦'} ${esc(a.name)}</span>`).join('')}</div>
    <button class="btn btn-primary" data-act="doneView">View my ingredients</button><button class="btn btn-ghost" data-act="doneMore">Log more food</button></div></div>`;
}

/* ===========================================================
   REELS
   =========================================================== */
let reelOrder = [];
function reelSeg() {
  const n = S.saved.size;
  return `<div class="reel-seg" role="tablist" aria-label="Reels view">
    <button role="tab" class="${S.reelView !== 'saved' ? 'on' : ''}" aria-selected="${S.reelView !== 'saved'}" data-act="reelView" data-arg="feed">For you</button>
    <button role="tab" class="${S.reelView === 'saved' ? 'on' : ''}" aria-selected="${S.reelView === 'saved'}" data-act="reelView" data-arg="saved">Saved${n ? ` <span class="num">${n}</span>` : ''}</button></div>`;
}
function renderReels() {
  if (S.reelView === 'saved') return renderSaved();
  reelOrder = makeable().map(r => r.id);
  if (!reelOrder.length) {
    return `<div class="reels"><div class="reels-top"><div><h1>Recipe Reels</h1></div>${reelSeg()}</div>
      <div class="reels-empty"><div><div class="big-illus">🍳</div><p>You don't have enough ingredients to make anything yet. Try adding more food to your pantry</p>
      <button class="btn btn-sm" style="background:#fff;color:#111" data-act="tab" data-arg="scan">${ic('camera')} Add food</button></div></div></div>`;
  }
  return `<div class="reels"><div class="reels-top"><div><h1>Recipe Reels</h1><div class="sub" id="learnChip">${learnText()}</div></div>${reelSeg()}</div>
    <div class="reel-feed" id="reelFeed">${reelOrder.map(id => reelHtml(R(id))).join('')}</div></div>`;
}
function renderSaved() {
  const list = [...S.saved].map(R).filter(Boolean);
  const body = !list.length
    ? `<div class="reels-empty"><div><div class="big-illus">🔖</div><p>No saved recipes yet.</p><span class="saved-hint">Tap Save on any reel and it will show up here, even after you use up the ingredients.</span>
        <button class="btn btn-sm" style="background:#fff;color:#111" data-act="reelView" data-arg="feed">Browse reels</button></div></div>`
    : `<div class="saved-list">${list.map(r => {
        const miss = missingOf(r);
        const ok = !miss.length;
        return `<div class="saved-card">
          <button class="saved-main" data-act="recipe" data-arg="${r.id}" aria-label="Open ${esc(r.name)}">
            <span class="saved-thumb" style="background:${r.bg}">${r.emoji}</span>
            <span class="saved-txt"><b>${esc(r.name)}</b><span>${r.time} min · Easy · ${r.type}</span>
              <span class="saved-status ${ok ? 'can' : 'cant'}">${ok ? `${ic('check')} You can make this now` : `Missing ${esc(miss.map(g => g.m).join(', '))}`}</span></span>
          </button>
          <div class="saved-actions">
            ${ok ? `<button class="sa-primary" data-act="useAsk" data-arg="${r.id}">I used this recipe</button>` : `<button class="sa-ghost" data-act="askMissing" data-arg="${r.id}">Check store deals</button>`}
            <button class="sa-ghost" data-act="unsave" data-arg="${r.id}" aria-label="Remove ${esc(r.name)} from saved">${ic('trash')} Remove</button>
          </div></div>`;
      }).join('')}</div>`;
  return `<div class="reels saved-mode"><div class="reels-top static"><div><h1>Saved recipes</h1><div class="sub">${plural(list.length, 'recipe')} in your library</div></div>${reelSeg()}</div>${body}</div>`;
}
function reelHtml(r) {
  const items = r.ing.flatMap(g => findItems(g.m).slice(0, 1));
  const spoiled = items.find(i => daysLeft(i) < 0);
  const soon = items.filter(i => daysLeft(i) >= 0 && daysLeft(i) <= 3).sort(byExp)[0];
  const liked = S.liked.has(r.id), saved = S.saved.has(r.id);
  return `<article class="reel" data-id="${r.id}" aria-label="${esc(r.name)}">
    <div class="reel-bg" style="background:${r.bg}"></div>
    <div class="reel-steam"><i></i><i></i><i></i></div>
    <div class="reel-dish" aria-hidden="true">${r.emoji}</div>
    <div class="reel-caption" data-si="0"><span class="stepno">Step 1 of ${r.steps.length}</span>${esc(r.steps[0])}</div>
    <div class="reel-tap" data-act="reelTap" data-arg="${r.id}"></div>
    <div class="rail">
      <button class="${liked ? 'on' : ''}" data-act="like" data-arg="${r.id}" aria-pressed="${liked}"><span class="ri">${ic('heart', liked)}</span><span class="num">${fmtK(r.likes + (liked ? 1 : 0))}</span></button>
      <button class="${saved ? 'saved' : ''}" data-act="save" data-arg="${r.id}" aria-pressed="${saved}"><span class="ri">${ic('bookmark', saved)}</span>${saved ? 'Saved' : 'Save'}</button>
      <button data-act="share" data-arg="${r.id}"><span class="ri">${ic('share')}</span>Share</button>
      <button data-act="recipe" data-arg="${r.id}"><span class="ri">${ic('list')}</span>Recipe</button>
    </div>
    <div class="reel-info">
      <h2>${esc(r.name)}</h2>
      <div class="reel-meta"><span>⏱ ${r.time} min</span><span>Easy</span><span>${r.type}</span><span>Serves ${r.serves}</span></div>
      <div class="have">${ic('check')} You have all ${r.ing.length} ingredients</div>
      ${spoiled ? `<div class="reel-warn red">Check your ${esc(spoiled.name.toLowerCase())}. It passed its date ${fmtDate(spoiled.exp)}.</div>` : soon ? `<div class="reel-warn">Uses your ${esc(soon.name.toLowerCase())} before it spoils (${plural(daysLeft(soon), 'day')})</div>` : ''}
      <div class="used-row"><button class="u1" data-act="useAsk" data-arg="${r.id}">I used this recipe</button><button class="u2" data-act="notYet" data-arg="${r.id}">Not yet</button></div>
    </div>
    <div class="reel-progress"><i></i></div>
  </article>`;
}
const fmtK = n => n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'K' : String(n);
function mountReels() {
  const feed = $('#reelFeed'); if (!feed) return;
  const ctl = { active: null, t: {}, paused: false };
  ctl.io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting && en.intersectionRatio >= .6) {
      ctl.active = en.target.dataset.id; ctl.paused = false;
      $$('.reel', feed).forEach(r => { r.classList.remove('paused'); r.querySelector('.play-ind')?.remove(); });
    }
  }), { root: feed, threshold: [.6] });
  $$('.reel', feed).forEach(r => ctl.io.observe(r));
  ctl.timer = setInterval(() => {
    if (!ctl.active || ctl.paused || document.hidden) return;
    const id = ctl.active, el = feed.querySelector(`.reel[data-id="${id}"]`); if (!el) return;
    const r = R(id), L = 16;
    ctl.t[id] = (ctl.t[id] || 0) + .1;
    const t = ctl.t[id] % L;
    el.querySelector('.reel-progress i').style.width = (t / L * 100) + '%';
    const n = r.steps.length, si = Math.min(n - 1, Math.floor(t / (L / n)));
    const cap = el.querySelector('.reel-caption');
    if (cap.dataset.si != si) { cap.dataset.si = si; cap.innerHTML = `<span class="stepno">Step ${si + 1} of ${n}</span>${esc(r.steps[si])}`; }
    if (ctl.t[id] >= 5 && !S.watched.has(id)) { S.watched.add(id); learn(r); }
  }, 100);
  reelCtl = ctl;
}
function unmountReels() { if (reelCtl) { clearInterval(reelCtl.timer); reelCtl.io.disconnect(); reelCtl = null; } }

function recipeSheet(r) {
  const canUse = canMake(r);
  return `<div class="sheet-head"><h2>${esc(r.name)}</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body">
    <div class="recipe-hero" style="background:${r.bg}">${r.emoji}</div>
    <div class="tagrow"><span class="tag">⏱ ${r.time} min</span><span class="tag">Easy</span><span class="tag">${r.type}</span><span class="tag">Serves ${r.serves}</span></div>
    <div><div class="lbl" style="margin-bottom:4px">Ingredients ${canUse ? `· you have all ${r.ing.length}` : ''}</div>
    <ul class="ing-list">${r.ing.map(g => {
      const it = findItems(g.m)[0];
      const sub = !it && r.subs && r.subs[g.m];
      return `<li><span class="em">${it ? (it.emoji || '📦') : '➖'}</span><span>${esc(g.label)}<span class="amt">${it ? `You have ${qtyText(findItems(g.m).reduce((s, x) => s + x.qty, 0), it.unit)}` : sub ? 'Missing. Use milk + butter instead' : 'Missing'}</span></span>${it ? pillFor(it) : '<span class="pill soon">Swap</span>'}</li>`;
    }).join('')}</ul></div>
    ${r.subs && !canUse ? `<div class="sub-card">${esc(Object.values(r.subs)[0].text)}</div>` : ''}
    <div><div class="lbl" style="margin-bottom:6px">Steps</div><ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
  </div>
  <div class="sheet-foot">${canUse ? `<button class="btn btn-primary" data-act="useAsk" data-arg="${r.id}">I used this recipe</button>` : ''}
    <button class="btn btn-ghost" data-act="save" data-arg="${r.id}">${S.saved.has(r.id) ? 'Saved to your library' : 'Save recipe'}</button></div>`;
}
function useSheet(r) {
  const log = previewUse(r);
  return `<div class="sheet-head"><h2>Did you make ${esc(r.name)}?</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body"><p style="margin:0;color:var(--ink-2)">We'll take these out of your Ingredients so you don't have to:</p>
    <ul class="ing-list">${log.map(l => `<li><span class="em">${l.emoji || '📦'}</span><span>${esc(l.name)}<span class="amt num">${qtyText(l.from, l.unit)} → ${l.to <= .001 ? 'used up' : qtyText(l.to, l.unit)}</span></span><span></span></li>`).join('')}</ul></div>
  <div class="sheet-foot"><button class="btn btn-primary" data-act="useConfirm" data-arg="${r.id}">Yes, update my pantry</button><button class="btn btn-ghost" data-act="useNot">Not yet</button></div>`;
}
function shareSheet(r) {
  const people = [['Family chat', '#fcf1d3', '#c98a07', 'F'], ['Dave', '#e3eefa', '#2f6fb5', 'D'], ['Mom', '#fbe6e1', '#d4452f', 'M'], ['Sarah', '#e1efe7', '#1d6a4c', 'S']];
  return `<div class="sheet-head"><h2>Send to friends</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body"><div class="share-grid">${people.map(p => `<button data-act="shareTo" data-arg="${p[0]}"><span class="sa" style="background:${p[1]};color:${p[2]}">${p[3]}</span>${p[0]}</button>`).join('')}</div>
  <button class="btn btn-ghost" data-act="shareTo" data-arg="link">Copy link to ${esc(r.name)}</button></div>`;
}

/* ===========================================================
   SETTINGS
   =========================================================== */
const STORES = ["Smith's", 'Walmart', 'Harmons', 'Costco', "Sprouts"];
const STORE_MULT = { "Smith's": 1, 'Walmart': .94, 'Harmons': 1.12, 'Costco': .88, 'Sprouts': 1.06 };
const DEALS = [
  { name: 'Milk (2%), 1 gal', emoji: '🥛', p: 2.99, was: 3.79, key: 'milk', stock: 'In stock' },
  { name: 'Heavy cream, 16 oz', emoji: '🥛', p: 2.49, was: 3.29, key: 'heavy cream', stock: 'In stock' },
  { name: 'Ground beef, 1 lb', emoji: '🥩', p: 3.99, was: 5.49, key: 'ground beef', stock: 'Low stock' },
  { name: 'Salmon fillet, 1 lb', emoji: '🐟', p: 8.99, was: 11.99, key: 'salmon', stock: 'In stock' },
  { name: 'Strawberries, 1 lb', emoji: '🍓', p: 2.50, was: 3.99, key: 'strawberr', stock: 'In stock' },
  { name: 'Caesar dressing, 12 oz', emoji: '🥗', p: 2.29, was: 3.19, key: 'caesar dressing', stock: 'In stock' },
  { name: 'Avocados, 4 ct', emoji: '🥑', p: 3.00, was: 4.49, key: 'avocado', stock: 'Low stock' },
  { name: 'Cheddar cheese, 8 oz', emoji: '🧀', p: 2.00, was: 3.49, key: 'cheddar', stock: 'In stock' }
];
const price = p => (p * (STORE_MULT[S.store] || 1)).toFixed(2);
function sw(id, on, label) { return `<span class="switch"><input type="checkbox" id="${id}" ${on ? 'checked' : ''} aria-label="${label}"><span></span></span>`; }
function renderSettings() {
  const u = S.user || { name: 'Karen Miller', email: 'karen@mypantry.app' };
  const row = (icon, tint, color, title, small, right, act, arg) => `<${act ? `button class="set-row" data-act="${act}" ${arg ? `data-arg="${arg}"` : ''}` : 'div class="set-row"'}><span class="si" style="background:${tint};color:${color}">${ic(icon)}</span><span><b>${title}</b>${small ? `<small>${small}</small>` : ''}</span>${right}</${act ? 'button' : 'div'}>`;
  const chev = `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${P.right}</svg>`;
  return `<div class="appbar"><div><h1>Settings</h1></div></div>
  <div class="scroll">
    <div class="profile"><div class="av">${esc(u.name[0])}</div><div><b>${esc(u.name)}</b><small>${esc(u.email)}</small></div></div>
    <div class="set-group"><span class="lbl">Preferences</span><div class="set-card">
      ${row('ruler', 'var(--sky-soft)', 'var(--sky)', 'Use metric units', S.metric ? 'Showing kg, g, L and mL' : 'Showing lb, oz, gal and fl oz', sw('sw_metric', S.metric, 'Use metric units'))}
      ${row('bell', 'var(--butter-soft)', 'var(--butter)', 'Spoil reminders', S.reminders ? 'Notify me 2 days before food spoils' : 'Off', sw('sw_rem', S.reminders, 'Spoil reminders'))}
      ${row('face', 'var(--basil-soft)', 'var(--basil)', 'Sign in with Face ID', 'Skip typing your password', sw('sw_face', S.faceId, 'Sign in with Face ID'))}
      ${row('lock', 'var(--surface-3)', 'var(--ink-2)', 'Remember me', 'Stay signed in on this phone', sw('sw_stay', S.stayIn, 'Remember me'))}
    </div></div>
    <div class="set-group"><span class="lbl">Shopping</span><div class="set-card">
      ${row('store', 'var(--basil-soft)', 'var(--basil)', 'Preferred store', `ZIP ${esc(S.zip)}`, `<span class="val">${esc(S.store)} ${chev}</span>`, 'storeSheet')}
      ${row('bookmark', 'var(--sky-soft)', 'var(--sky)', 'Saved recipes', `${plural(S.saved.size, 'recipe')} in your library`, chev, 'openSaved')}
      ${row('tag', 'var(--tomato-soft)', 'var(--tomato)', "This week's deals", `${DEALS.length} deals at ${esc(S.store)}`, chev, 'deals')}
    </div></div>
    <div class="set-group"><span class="lbl">Pantry</span><div class="set-card">
      ${row('refresh', 'var(--tomato-soft)', 'var(--tomato)', '<span style="color:var(--tomato)">Reset inventory</span>', 'Remove all food and reset Reels', chev, 'resetAsk')}
    </div></div>
    <div class="set-group"><span class="lbl">Account</span><div class="set-card">
      ${row('mail', 'var(--surface-3)', 'var(--ink-2)', 'Change password', null, chev, 'changePw')}
      ${row('logout', 'var(--surface-3)', 'var(--ink-2)', 'Log out', null, '', 'logout')}
    </div></div>
    <div class="version">MyPantry version 1.0</div>
  </div>`;
}
function renderDeals() {
  const rows = DEALS.map(d => {
    const own = S.inv.filter(i => i.name.toLowerCase().includes(d.key));
    const unlock = RECIPES.find(r => !canMake(r) && missingOf(r).length === 1 && missingOf(r)[0].m === d.key);
    const pairs = !own.length ? null : null;
    let note = '';
    if (own.length && own.some(i => daysLeft(i) >= 0)) note = `<div class="note have">You already have ${qtyText(own.reduce((s, i) => s + i.qty, 0), own[0].unit)} at home</div>`;
    else if (unlock) note = `<div class="note idea">Unlocks ${esc(unlock.name)} with food you have</div>`;
    return `<div class="deal"><span class="img">${d.emoji}</span><div><b>${esc(d.name)}</b><span class="stock">${d.stock}</span>${note}</div><div class="price"><b class="num">$${price(d.p)}</b><br><s class="num">$${price(d.was)}</s></div></div>`;
  }).join('');
  return `<div class="appbar" style="padding-bottom:6px"><button class="back" data-act="dealsBack">${ic('left')} Settings</button></div>
  <div class="scroll">
    <div class="store-banner"><b>${esc(S.store)}</b><span>Deals this week near ${esc(S.zip)} · prices update every Wednesday</span></div>
    <div class="set-group"><span class="lbl">On sale</span><div class="set-card">${rows}</div></div>
    <p class="hint" style="padding:12px 20px 30px;margin:0">Yellow notes flag food you already own so you don't buy it twice. Blue notes show deals that complete an easy recipe.</p>
  </div>`;
}
function storeSheet() {
  return `<div class="sheet-head"><h2>Preferred store</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body">
    <div class="set-card">${STORES.map(s => `<label class="set-row" style="grid-template-columns:1fr auto;cursor:pointer"><b>${s}</b><input type="radio" name="storePick" value="${esc(s)}" ${s === S.store ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--basil)"></label>`).join('')}</div>
    <div class="field"><label for="zipIn">ZIP code</label><input class="input num" id="zipIn" inputmode="numeric" maxlength="5" value="${esc(S.zip)}"><span class="field-err" id="zipErr" hidden>Enter a 5-digit ZIP code.</span></div>
  </div>
  <div class="sheet-foot"><button class="btn btn-primary" data-act="storeSave">Save store</button></div>`;
}
function resetModal() {
  return `<div class="icon-hero" style="background:var(--tomato-soft);color:var(--tomato)">${ic('trash')}</div>
    <h2>Reset your inventory?</h2>
    <p>This removes all ${plural(S.inv.length, 'item')} from Ingredients and resets your Reels recommendations. You can't undo this.</p>
    <button class="btn btn-danger" data-act="resetDo">Reset inventory</button>
    <button class="btn btn-ghost" data-act="closeSheet">Cancel</button>`;
}
function doReset() {
  S.inv = []; S.prefs = {}; S.liked.clear(); S.watched.clear(); S.chat = [];
}

/* ===========================================================
   ACTIONS
   =========================================================== */
const ACT = {
  auth(arg) { S.auth = arg; render(); },
  showpw(id, b) { const i = $('#' + id); i.type = i.type === 'password' ? 'text' : 'password'; b.textContent = i.type === 'password' ? 'Show' : 'Hide'; },
  faceid() { S.auth = 'faceid'; render(); setTimeout(() => { S.user = S.user || { name: 'Karen Miller', email: 'karen@mypantry.app' }; enterApp(); toast('Signed in with Face ID'); }, 1300); },
  confirmEmail() { S.auth = 'welcome'; render(); },
  resend() { toast(`Sent another email to ${esc(S.signupEmail)}`, null, 'mail'); },
  enterApp() { enterApp(); },
  tab(arg) {
    closeSheet();
    if (arg === 'scan' && S.scan && S.scan.stage === 'done') S.scan = null;
    if (arg === 'settings') S.setPage = null;
    if (arg === 'reels' && S.tab !== 'reels') S.reelView = 'feed';
    S.tab = arg; render();
  },
  ask(arg) { if (S.tab !== 'home') { S.tab = 'home'; render(); } closeSheet(); ask(arg); },
  goSoon() { S.tab = 'ing'; S.ingView = 'soon'; render(); },
  askFromSoon() { S.tab = 'home'; render(); ask("What's going bad?"); },
  newChat() { S.chat = []; render(); },
  chatClear(_, b) { b.closest('.actions').remove(); doReset(); pushMsg('bot', '<p>Done. I cleared your inventory and reset your Reels. Tap Scan whenever you want to log food again.</p>'); refreshBadge(); },
  chatCancel(_, b) { b.closest('.actions').remove(); pushMsg('bot', '<p>No problem. Your food is still there.</p>'); },
  madeDirect(id, b) { b.closest('.actions').remove(); ask(`I made ${R(id).name}`); },
  undoUse(_, b) { if (S.undo) { restore(S.undo); S.undo = null; b.closest('.actions').remove(); pushMsg('bot', '<p>Undone. Your pantry is back the way it was.</p>'); refreshBadge(); } },
  removeItem(id, b) {
    const it = S.inv.find(i => i.id === id); if (!it) return;
    S.inv = S.inv.filter(i => i.id !== id); b.closest('.actions')?.remove();
    pushMsg('bot', `<p>Removed ${esc(it.name)} from your pantry.</p>`); refreshBadge();
  },

  ingView(arg) { S.ingView = arg; render(); },
  ingCat(arg) { S.ingCat = arg; render(); },
  edit(id) { const it = S.inv.find(i => i.id === id); if (it) openItemForm(it, 'edit'); },
  saveItem() {
    const f = $('#itemForm'); if (!f) return;
    const data = readItemForm(); if (!data) return;
    const mode = f.dataset.mode, id = f.dataset.id;
    if (mode === 'edit' && sb && S.inv.find(i => i.id === id)?.dbId) {
      saveItemToDb(id, data);
    } else if (mode === 'edit') {
      const it = S.inv.find(i => i.id === id);
      const expChanged = $('#f_exp').value !== it.exp;
      Object.assign(it, { name: data.name, qty: data.qty, unit: data.unit, cat: data.cat, store: data.store, exp: $('#f_exp').value || data.exp, emoji: it.emoji || data.emoji });
      if (expChanged && $('#f_exp').value) it.src = 'label';
      closeSheet(); render(); toast(`Saved ${esc(it.name)}`);
    } else if (mode === 'review') {
      const r = S.scan.items.find(x => x.tid === id);
      Object.assign(r, data, { emoji: r.emoji || data.emoji, src: $('#f_exp').value && $('#f_exp').value !== r.exp ? 'label' : r.src });
      if (!$('#f_exp').value) r.exp = estimate(r.cat, r.store);
      closeSheet(); render();
    } else if (mode === 'reviewNew') {
      S.scan.items.push({ tid: 't' + (uid++), ...data, on: true }); closeSheet(); render();
    } else {
      addItems([data]); closeSheet();
      S.scan = { mode: 'manual', stage: 'done', added: [data] }; S.tab = 'scan'; render();
    }
  },
  deleteItem(id) {
    const before = snapshot(); const it = S.inv.find(i => i.id === id);
    S.inv = S.inv.filter(i => i.id !== id); closeSheet(); render();
    toast(`Deleted ${esc(it.name)}`, () => { restore(before); render(); }, 'trash');
  },
  closeSheet() { closeSheet(); },

  startScan(mode) { closeSheet(); if (S.tab !== 'scan') S.tab = 'scan'; startScan(mode); },
  manual() { closeSheet(); if (S.scan && S.scan.stage !== 'review') S.scan = null; S.tab = 'scan'; render(); openItemForm({ store: 'Fridge', cat: 'Other' }, 'new'); },
  manualInReview() { openItemForm({ store: 'Fridge', cat: 'Other', qty: 1, unit: 'ct' }, 'reviewNew'); },
  demo(arg) { S.scan.demo = arg; if (S.scan.stage === 'error') S.scan.stage = 'camera'; render(); },
  retake() { S.scan.stage = 'camera'; S.scan.demo = 'good'; render(); },
  scanCancel() { S.scan = null; render(); },
  shutter() {
    const sc = S.scan; if (sc.stage === 'analyzing') return;
    sc.stage = 'analyzing'; render();
    setTimeout(() => {
      if (!S.scan || S.scan !== sc) return;
      if (sc.demo === 'bad') { sc.stage = 'error'; render(); return; }
      sc.items = buildDetected(sc.mode); sc.stage = 'review'; render();
    }, 1400);
  },
  qty(arg) {
    const [tid, d] = arg.split('|'); const it = S.scan.items.find(x => x.tid === tid);
    const [v] = disp(it.qty, it.unit); const nv = Math.max(1, Math.round(v) + Number(d));
    it.qty = fromDisp(nv, disp(1, it.unit)[1])[0]; render();
  },
  reviewToggle(tid) { const it = S.scan.items.find(x => x.tid === tid); it.on = !it.on; render(); },
  reviewEdit(tid) { const it = S.scan.items.find(x => x.tid === tid); openItemForm({ ...it, id: tid }, 'review'); },
  reviewStore(arg) {
    const [tid, s] = arg.split('|'); const it = S.scan.items.find(x => x.tid === tid);
    it.store = s; if (it.src === 'ai') it.exp = estimate(it.cat, s);
    else if (s === 'Freezer') { it.exp = estimate(it.cat, s); it.src = 'ai'; }
    render();
  },
  confirmScan() {
    const items = S.scan.items.filter(i => i.on);
    addItems(items); S.scan = { mode: S.scan.mode, stage: 'done', added: items }; render();
  },
  doneView() { S.scan = null; S.tab = 'ing'; S.ingView = 'all'; render(); },
  doneMore() { S.scan = null; render(); },

  reelTap(id, el) {
    if (!reelCtl) return; const reel = el.closest('.reel');
    reelCtl.paused = !reelCtl.paused; reel.classList.toggle('paused', reelCtl.paused);
    reel.querySelector('.play-ind')?.remove();
    if (reelCtl.paused) { const p = document.createElement('div'); p.className = 'play-ind'; p.innerHTML = ic('play'); reel.appendChild(p); }
  },
  like(id, b) {
    const r = R(id);
    if (S.liked.has(id)) S.liked.delete(id); else { S.liked.add(id); learn(r); const h = document.createElement('div'); h.className = 'heart-pop'; h.textContent = '❤️'; b.closest('.reel').appendChild(h); setTimeout(() => h.remove(), 700); }
    const on = S.liked.has(id); persist();
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    b.innerHTML = `<span class="ri">${ic('heart', on)}</span><span class="num">${fmtK(r.likes + (on ? 1 : 0))}</span>`;
  },
  save(id, b) {
    const on = !S.saved.has(id); on ? S.saved.add(id) : S.saved.delete(id);
    persist();
    const rb = $(`.reel[data-id="${id}"] [data-act="save"]`, app);
    if (rb) { rb.classList.toggle('saved', on); rb.setAttribute('aria-pressed', on); rb.innerHTML = `<span class="ri">${ic('bookmark', on)}</span>${on ? 'Saved' : 'Save'}`; }
    if (b.closest('.sheet')) b.textContent = on ? 'Saved to your library' : 'Save recipe';
    const seg = $('.reel-seg', app); if (seg) seg.outerHTML = reelSeg();
    if (S.reelView === 'saved' && S.tab === 'reels') render();
    if (on) toast(`Saved ${esc(R(id).name)}`, () => { closeSheet(); S.tab = 'reels'; S.reelView = 'saved'; render(); }, 'bookmark', 'View');
    else toast('Removed from your saved recipes', null, 'bookmark');
  },
  unsave(id) {
    S.saved.delete(id); persist(); render();
    toast('Removed from your saved recipes', () => { S.saved.add(id); persist(); render(); }, 'bookmark');
  },
  reelView(arg) { S.reelView = arg; render(); },
  openSaved() { S.tab = 'reels'; S.reelView = 'saved'; render(); },
  askMissing(id) {
    const r = R(id); const miss = missingOf(r).map(g => g.m);
    closeSheet(); S.tab = 'home'; render(); ask(`Do I have ${miss[0]}?`);
  },
  share(id) { openSheet(shareSheet(R(id))); },
  shareTo(who) { closeSheet(); toast(who === 'link' ? 'Link copied' : `Sent to ${esc(who)}`, null, 'share'); },
  recipe(id) { openSheet(recipeSheet(R(id))); },
  useAsk(id) { const r = R(id); if (!canMake(r)) { toast('You no longer have everything for this recipe', null, 'alert'); return; } openSheet(useSheet(r)); },
  useConfirm(id) {
    const r = R(id); useRecipe(r); closeSheet();
    const snap = S.undo;
    if (S.tab === 'reels') {
      const feed = $('#reelFeed'); const st = feed ? feed.scrollTop : 0; render(); const f2 = $('#reelFeed'); if (f2) f2.scrollTop = st;
    } else render();
    toast(`Pantry updated for ${esc(r.name)}`, () => { restore(snap); render(); });
  },
  useNot() { closeSheet(); toast('No changes. Your pantry stays the same.', null, 'check'); },
  notYet(id, b) {
    toast('No changes. Your pantry stays the same.');
    const reel = b.closest('.reel'); const next = reel.nextElementSibling;
    if (next) $('#reelFeed').scrollTo({ top: next.offsetTop, behavior: 'smooth' });
  },

  storeSheet() {
    openSheet(storeSheet());
    $('#zipIn').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5); });
  },
  storeSave() {
    const z = $('#zipIn').value; if (!/^\d{5}$/.test(z)) { $('#zipErr').hidden = false; $('#zipIn').classList.add('bad'); return; }
    S.store = $('input[name="storePick"]:checked').value; S.zip = z; closeSheet(); render(); toast(`Showing deals from ${esc(S.store)}`, null, 'store');
  },
  deals() { S.setPage = 'deals'; render(); },
  dealsBack() { S.setPage = null; render(); },
  resetAsk() { openSheet(resetModal(), { center: true }); },
  resetDo() { doReset(); closeSheet(); render(); toast('Inventory reset. Reels start fresh.'); },
  changePw() { toast(`Reset link sent to ${esc((S.user || {}).email || 'your email')}`, null, 'mail'); },
  logout() {
    if (S.user && S.accounts[S.user.email]) S.accounts[S.user.email].inv = S.inv;
    S.remembered = S.stayIn; S.lastEmail = S.stayIn ? (S.user || {}).email : ''; S.auth = 'login'; S.tab = 'home'; S.chat = []; closeSheet(); render();
  }
};
// Vertical slice: (1) send the edit to Supabase, (2) update the row,
// (3) get the updated row back, (4) show it in the list.
async function saveItemToDb(id, data) {
  const it = S.inv.find(i => i.id === id);
  const btn = $('#saveItemBtn');
  const exp = $('#f_exp').value || it.exp;
  btn.disabled = true; btn.textContent = 'Saving…';
  $('#dbErr')?.remove();
  const { data: row, error } = await sb.from('pantry_item')
    .update({ ingredient_name: data.name, quantity: data.qty, measurement: data.unit, food_type: data.cat, expiration_date: exp, status: statusFor(exp) })
    .eq('ingredient_id', it.dbId)
    .eq('user_id', DEMO_USER_ID)
    .select()
    .single();
  if (error || !row) {
    btn.disabled = false; btn.textContent = 'Save';
    const e = document.createElement('div'); e.className = 'err'; e.id = 'dbErr';
    e.innerHTML = `${ic('alert')}<span>Couldn't save to the database. ${esc(error ? error.message : 'No row was updated.')}</span>`;
    $('#itemForm').appendChild(e);
    console.error('[MyPantry] save failed', error);
    return;
  }
  const fresh = rowToItem(row);
  Object.assign(it, fresh, { emoji: it.emoji || fresh.emoji, store: data.store });
  sync = 'synced';
  closeSheet(); render();
  toast(`Saved ${esc(it.name)}: ${qtyText(it.qty, it.unit)}`, null, 'check');
}

function enterApp() { S.auth = 'app'; S.tab = 'home'; S.chat = []; render(); loadPantry(); }

/* ---------- Event wiring ---------- */
phone.addEventListener('click', e => {
  const b = e.target.closest('[data-act]'); if (!b || !phone.contains(b)) return;
  const fn = ACT[b.dataset.act]; if (!fn) return;
  e.preventDefault();
  fn(b.dataset.arg, b, e);
});
phone.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'sw_metric') { S.metric = t.checked; render(); toast(S.metric ? 'Showing metric units' : 'Showing US units', null, 'ruler'); }
  if (t.id === 'sw_rem') { S.reminders = t.checked; render(); }
  if (t.id === 'sw_face') { S.faceId = t.checked; toast(t.checked ? 'Face ID turned on' : 'Face ID turned off', null, 'face'); }
  if (t.id === 'sw_stay') { S.stayIn = t.checked; }
  if (t.dataset.qty) {
    const it = S.scan.items.find(x => x.tid === t.dataset.qty);
    const v = parseFloat(t.value);
    if (!(v > 0) || !/^[0-9]*\.?[0-9]+$/.test(t.value.trim())) { t.value = disp(it.qty, it.unit)[0]; toast('Quantity can only be a number, like 2 or 0.5.', null, 'alert'); return; }
    it.qty = fromDisp(v, disp(1, it.unit)[1])[0];
  }
});
phone.addEventListener('input', e => {
  if (e.target.id === 'ingSearch') { S.ingQuery = e.target.value; $('#ingList').innerHTML = ingListHtml(); }
});

function bindForms() {
  const lf = $('#loginForm');
  if (lf) lf.addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#li_email').value.trim().toLowerCase(), pw = $('#li_pw').value;
    const err = $('#loginErr');
    const fail = msg => { err.hidden = false; err.querySelector('span').textContent = msg; $('#li_pw').value = ''; $('#li_email').classList.add('bad'); $('#li_pw').classList.add('bad'); $('#li_pw').focus(); };
    if (!em || !pw) return fail('Enter your email and password to sign in.');
    const acct = S.accounts[em];
    if (!acct || acct.pw !== pw) return fail("That email and password don't match. Check them and try again.");
    S.user = { name: acct.name, email: em }; S.stayIn = $('#li_rem').checked; S.remembered = S.stayIn;
    if (acct.inv) S.inv = acct.inv;
    enterApp();
  });
  const ff = $('#forgotForm');
  if (ff) ff.addEventListener('submit', e => {
    e.preventDefault();
    const em = $('#fg_email').value.trim().toLowerCase();
    const er = $('#fgErr'), ok = $('#fgOk');
    er.hidden = ok.hidden = true; $('#fg_email').classList.remove('bad');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) { er.hidden = false; er.querySelector('span').textContent = 'Enter a valid email, like name@example.com.'; $('#fg_email').classList.add('bad'); return; }
    if (!S.accounts[em]) { er.hidden = false; er.querySelector('span').textContent = "We couldn't find an account with that email. Check the spelling or create a new account."; $('#fg_email').classList.add('bad'); return; }
    ok.hidden = false; ok.querySelector('span').textContent = `Reset link sent to ${em}. Check your inbox.`;
  });
  const sf = $('#signupForm');
  if (sf) {
    const upd = () => {
      const pw = $('#su_pw').value, pw2 = $('#su_pw2').value, em = $('#su_email').value.trim();
      const rules = { len: pw.length >= 14, sym: /[^A-Za-z0-9\s]/.test(pw), match: pw.length > 0 && pw === pw2 };
      $$('#pwRules li').forEach(li => li.classList.toggle('met', rules[li.dataset.rule]));
      const emOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
      $('#su_emailErr').hidden = !em || emOk;
      $('#su_email').classList.toggle('bad', !!em && !emOk);
      $('#suBtn').disabled = !(rules.len && rules.sym && rules.match && emOk);
    };
    sf.addEventListener('input', upd);
    sf.addEventListener('submit', e => {
      e.preventDefault(); upd(); if ($('#suBtn').disabled) return;
      const em = $('#su_email').value.trim().toLowerCase();
      if (S.accounts[em]) { const er = $('#suErr'); er.hidden = false; er.querySelector('span').textContent = 'An account with this email already exists. Sign in instead.'; return; }
      const name = $('#su_name').value.trim() || em.split('@')[0];
      S.accounts[em] = { pw: $('#su_pw').value, name: name.charAt(0).toUpperCase() + name.slice(1) };
      S.user = { name: S.accounts[em].name, email: em };
      const k = S.accounts['karen@mypantry.app']; if (!k.inv) k.inv = S.inv;
      S.signupEmail = em; S.pendingName = S.user.name; S.inv = [];
      S.auth = 'verify'; render();
    });
  }
  const cf = $('#chatForm');
  if (cf) cf.addEventListener('submit', e => { e.preventDefault(); const i = $('#chatIn'); const v = i.value; i.value = ''; ask(v); });
}

/* ---------- Tester guide ---------- */
const TASKS = [
  ['Sign in', 'Sign in with the demo account. Type a wrong password first and notice the message.', ['Login', 'Error state']],
  ['Find what to use first', 'Which food will spoil soonest? Is the milk still good?', ['Going Bad Soon', 'Req 4–7']],
  ['Fix a mistake', 'You actually have 10 eggs. Change it. Try typing a letter in the quantity.', ['Edit item', 'Req 12']],
  ['Log groceries with a photo', 'Photo your fridge. Facilitator: set "Blurry photo" first. Retake, change a quantity, then save.', ['Req 9–14, 16']],
  ['Scan an unknown item', 'Scan a bar code the app doesn\'t know (set "Unknown item").', ['Req 15']],
  ['Plan dinner', 'Ask the assistant for a Chinese dinner. Then tell it you made it.', ['AI assistant', 'Auto-subtract']],
  ['Shop without double-buying', 'You\'re at the store. Ask whether you already have cheddar.', ['Duplicate purchases']],
  ['Browse recipe reels', 'Watch a reel for 5+ seconds, like one, then mark one as "I used this recipe".', ['Req 17–19']],
  ['Change settings', 'Switch to metric units and check this week\'s deals at your store.', ['Settings', 'Deals']],
  ['Start fresh', 'Reset your inventory, then open Reels.', ['Reset', 'Req 20']]
];
let done = {};
try { done = JSON.parse(localStorage.getItem('mp_tasks') || '{}'); } catch (_) { done = {}; }
function renderTasks() {
  $('#taskList').innerHTML = TASKS.map((t, i) => `<li class="${done[i] ? 'done' : ''}"><input type="checkbox" id="task${i}" ${done[i] ? 'checked' : ''} aria-label="Mark task ${i + 1} done"><label for="task${i}"><div class="t-title">${i + 1}. ${t[0]}</div><div class="t-body">${t[1]}</div><div class="t-req">${t[2].map(r => `<span>${r}</span>`).join('')}</div></label></li>`).join('');
}
$('#taskList').addEventListener('change', e => {
  const i = e.target.id.replace('task', ''); done[i] = e.target.checked;
  try { localStorage.setItem('mp_tasks', JSON.stringify(done)); } catch (_) {}
  e.target.closest('li').classList.toggle('done', e.target.checked);
});
renderTasks();
$('.tools').addEventListener('click', e => {
  const t = e.target.dataset.tool; if (!t) return;
  closeSheet();
  if (t === 'reset') { S = freshState(); if (sb) S.inv = []; done = {}; try { localStorage.removeItem('mp_tasks'); localStorage.removeItem(STORE_KEY); } catch (_) {} renderTasks(); }
  if (t === 'skip') { S.user = S.user || { name: 'Karen Miller', email: 'karen@mypantry.app' }; S.auth = 'app'; S.chat = []; setTimeout(loadPantry, 0); }
  if (t === 'sample') { if (sb) setTimeout(loadPantry, 0); else S.inv = samplePantry(); S.chat = []; }
  if (t === 'empty') { S.inv = []; S.chat = []; }
  S.scan = null; render();
  if (window.matchMedia('(max-width:520px)').matches) toggleGuide(false);
});
const guide = $('#guide'), gt = $('#guideToggle');
function toggleGuide(open) { guide.classList.toggle('open', open); gt.textContent = open ? 'Back to the app' : 'Test guide'; }
gt.addEventListener('click', () => toggleGuide(!guide.classList.contains('open')));

/* ---------- Clock ---------- */
const clock = () => { const c = $('#clock'); if (c) c.textContent = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/, ''); };
clock(); setInterval(clock, 30000);

render();
})();
