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
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
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
  palette: '<path d="M12 3a9 9 0 0 0 0 18h1.5a2 2 0 0 0 0-4H12a2 2 0 0 1 0-4h4a5 5 0 0 0 5-5c0-2.8-4-5-9-5Z"/><circle cx="7.5" cy="10" r=".8" fill="currentColor" stroke="none"/><circle cx="9.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/><circle cx="14" cy="6.5" r=".8" fill="currentColor" stroke="none"/>',
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
const LOGO = '<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" fill="var(--basil)"/><path d="M14 20h20v14a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4V20Z" fill="#fff"/><path d="M12 16h24v4H12z" fill="var(--butter-soft)"/><path d="M24 11c3 0 5 2 5 5h-10c0-3 2-5 5-5Z" fill="var(--theme-accent)"/><circle cx="24" cy="28" r="3.2" fill="var(--basil)"/></svg>';

/* ---------- Helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const DAY = 864e5;
const TODAY = new Date(); TODAY.setHours(0, 0, 0, 0);
const pad2 = n => String(n).padStart(2, '0');
const isoOf = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const inDays = n => { const d = new Date(TODAY); d.setDate(d.getDate() + n); return isoOf(d); };
const parseIso = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const todayIso = () => isoOf(new Date());
// A typed spoil date may not be in the past. An existing item's unchanged date is
// still allowed, so food that already passed its date can be edited or logged.
const pastSpoilDate = (value, original = '') => !!value && value < todayIso() && value !== original;
const daysLeft = it => Math.round((parseIso(it.exp) - TODAY) / DAY);
const fmtDate = s => parseIso(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const byExp = (a, b) => a.exp.localeCompare(b.exp) || a.name.localeCompare(b.name);
let uid = 1;
function newUuid() {
  if (typeof crypto?.randomUUID === 'function') return crypto.randomUUID();
  const bytes = new Uint8Array(16);
  if (typeof crypto?.getRandomValues === 'function') crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map(value => value.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10).join('')}`;
}

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
const unitWord = (quantity, unit) => {
  if (unit === 'ct') return 'count';
  const pluralUnit = { box: 'boxes', loaf: 'loaves', can: 'cans', bag: 'bags', jar: 'jars', head: 'heads', bulb: 'bulbs' };
  return quantity !== 1 && pluralUnit[unit] ? pluralUnit[unit] : unit;
};
function disp(q, u) {
  if (S.metric && CONV[u]) { const [mu, f] = CONV[u]; return [roundQ(q * f, mu), mu]; }
  return [roundQ(q, u), u];
}
function fromDisp(q, u) { if (REV[u]) { const [bu, f] = REV[u]; return [q / f, bu]; } return [q, u]; }
function qtyText(q, u) { const [v, uu] = disp(q, u); return `${v} ${unitWord(v, uu)}`; }

/* ---------- Shelf-life model (category × storage) ---------- */
const CATS = ['Fruits', 'Vegetables', 'Meat & Seafood', 'Dairy & Eggs', 'Grains & Bread', 'Snacks', 'Sauces & Condiments', 'Spices & Baking', 'Prepared Meals', 'Drinks', 'Other'];
function foodCategory(name) {
  const text = name.toLowerCase();
  if (meatSnack(text)) return 'Snacks';
  if (/\bflour tortillas?\b/.test(text)) return 'Grains & Bread';
  if (/\b(beverages?|drinks?|juice|soda|water|coffee|tea|punch|lemonade)\b/.test(text)) return 'Drinks';
  if (/\b(candy|candies|chocolates?|cookies?|crackers?|chips?|popcorn|pretzels?|granola)\b/.test(text)) return 'Snacks';
  if (/\b(sauce|salsa|ketchup|mustard|mayonnaise|dressing|vinegar|condiment|soy sauce|cooking oil|olive oil|peanut butter|jam|jelly|syrup|honey)\b/.test(text)) return 'Sauces & Condiments';
  if (/\b(flour|sugar|salt|pepper|cinnamon|paprika|cumin|spice|seasoning|baking powder|baking soda|yeast|vanilla|cornstarch)\b/.test(text)) return 'Spices & Baking';
  if (/\b(soup|pizza|lasagna|prepared meal|ready meal|leftovers?|pot pie|burrito|dinner|meal kit)\b/.test(text)) return 'Prepared Meals';
  if (/\b(snack|pretzel|candy|cookies?|crackers?|chips?|popcorn|nuts?|chocolates?|granola)\b/.test(text)) return 'Snacks';
  if (/\b(beverage|drinks?|juice|soda|water|coffee|tea|punch|energy drink|lemonade|oat milk|almond milk|soy milk|coconut milk)\b/.test(text)) return 'Drinks';
  if (/\b(milk|cheese|yogurt|yoghurt|cream|butter|dairy|eggs?|cheddar|parmesan)\b/.test(text)) return 'Dairy & Eggs';
  if (/\b(meat|beef|pork|chicken|turkey|poultry|seafood|fish|shrimp|sausage|bacon|salmon|tuna)\b/.test(text)) return 'Meat & Seafood';
  if (/\b(bread|bakery|cereal|grains?|pasta|rice|tortillas?|bagels?|waffles?|oats?|noodles?|spaghetti)\b/.test(text)) return 'Grains & Bread';
  if (/\b(vegetables?|lettuce|carrots?|potatoes|potato|onions?|broccoli|garlic|spinach|peas?|corn|tomatoes|tomato|peppers?|cabbage|celery|cucumber|zucchini|mushrooms?)\b/.test(text)) return 'Vegetables';
  if (/\b(fruits?|apples?|bananas?|strawberries|strawberry|raspberries|raspberry|blueberries|blueberry|berries|oranges?|peaches|peach|pears?|grapes?|lemons?|limes?|mango|mangoes|pineapple|melon|avocados?)\b/.test(text)) return 'Fruits';
  return 'Other';
}
function normalizeCategory(name, category) {
  if (meatSnack(name) && (!CATS.includes(category) || category === 'Meat & Seafood')) return 'Snacks';
  if (category === 'Dairy') return 'Dairy & Eggs';
  if (CATS.includes(category)) return category;
  return foodCategory(name);
}
const SHELF = {
  'Fruits': { Fridge: 7, Pantry: 5, Freezer: 240 },
  'Vegetables': { Fridge: 7, Pantry: 5, Freezer: 240 },
  'Meat & Seafood': { Fridge: 3, Pantry: 0, Freezer: 180 },
  'Dairy & Eggs': { Fridge: 10, Pantry: 0, Freezer: 90 },
  'Grains & Bread': { Fridge: 12, Pantry: 6, Freezer: 90 },
  'Snacks': { Fridge: 60, Pantry: 60, Freezer: 120 },
  'Sauces & Condiments': { Fridge: 60, Pantry: 180, Freezer: 180 },
  'Spices & Baking': { Fridge: 60, Pantry: 180, Freezer: 180 },
  'Prepared Meals': { Fridge: 3, Pantry: 0, Freezer: 90 },
  'Drinks': { Fridge: 10, Pantry: 180, Freezer: 180 },
  'Other': { Fridge: 60, Pantry: 180, Freezer: 180 }
};
function meatSnack(name) {
  return !/\b(?:raw|uncooked|fresh)\b/i.test(name) &&
    /\b(?:jerky|(?:meat|beef|turkey|pork|chicken|snack) sticks?)\b/i.test(name);
}
function estimate(cat, store, name = '') {
  // A short review reminder for packaged meat snacks, not a food safety date.
  if (meatSnack(name) && store !== 'Freezer') return inDays(7);
  return inDays((SHELF[cat] || SHELF.Other)[store] ?? 30);
}
const CAT_TINT = { 'Fruits': '#fbe3de', 'Vegetables': '#e4f3e0', 'Meat & Seafood': '#fbe3de', 'Dairy & Eggs': '#e6eef9', 'Grains & Bread': '#f7ecd6', 'Snacks': '#f4e6f3', 'Sauces & Condiments': '#fae9d9', 'Spices & Baking': '#f7ecd6', 'Prepared Meals': '#e9e3f7', 'Drinks': '#e0f2f4', 'Other': '#eceee9' };
const EMOJI = { apple: '🍎', banana: '🍌', strawberr: '🍓', broccoli: '🥦', lettuce: '🥬', garlic: '🧄', onion: '🧅', carrot: '🥕', tomato: '🍅', potato: '🥔', avocado: '🥑', lemon: '🍋', grape: '🍇', chicken: '🍗', beef: '🥩', steak: '🥩', salmon: '🐟', fish: '🐟', shrimp: '🍤', bacon: '🥓', milk: '🥛', egg: '🥚', cheese: '🧀', cheddar: '🧀', parmesan: '🧀', yogurt: '🍶', butter: '🧈', bread: '🍞', bagel: '🥯', tortilla: '🫓', rice: '🍚', spaghetti: '🍝', pasta: '🍝', flour: '🌾', cereal: '🥣', granola: '🥣', chip: '🍿', cookie: '🍪', cracker: '🍘', juice: '🧃', soda: '🥤', coffee: '☕', water: '💧', pea: '🫛', 'ice cream': '🍨', pizza: '🍕', waffle: '🧇', soy: '🥢', salsa: '🌶️', sauce: '🥫', soup: '🥫', peanut: '🥜', honey: '🍯', cream: '🥛', corn: '🌽' };
function guessEmoji(name) {
  const n = name.toLowerCase();
  if (meatSnack(n)) return '🥓';
  const phrases = [
    [/\b(?:ice cream|ice creams)\b/, '🍨'],
    [/\b(?:pineapples?)\b/, '🍍'],
    [/\b(?:peaches|peach)\b/, '🍑'],
    [/\b(?:pears?)\b/, '🍐'],
    [/\b(?:strawberries|strawberry)\b/, '🍓'],
    [/\b(?:blueberries|blueberry)\b/, '🫐'],
    [/\b(?:oranges?|orange) juice\b/, '🧃'],
    [/\b(?:peanut butter)\b/, '🥜'],
    [/\b(?:popcorn)\b/, '🍿']
  ];
  for (const [pattern, emoji] of phrases) if (pattern.test(n)) return emoji;
  const words = n.match(/[a-z]+/g) || [];
  for (const word of words.reverse()) {
    for (const key of [word, word.replace(/s$/, ''), word.replace(/es$/, '')]) {
      if (Object.hasOwn(EMOJI, key)) return EMOJI[key];
    }
  }
  return null;
}
const imgHtml = (it, cls = 'img') => it.emoji
  ? `<span class="${cls}" style="background:${CAT_TINT[it.cat] || 'var(--surface-3)'}" aria-hidden="true">${it.emoji}</span>`
  : `<span class="${cls} default" aria-hidden="true">${ic('box')}</span>`;

/* ---------- Seed data ---------- */
function mk(name, emoji, cat, qty, unit, d, store, src) {
  return { id: 'i' + (uid++), name, emoji, cat, qty, unit, exp: inDays(d), store, src };
}
function samplePantry() {
  return [
    mk('Strawberries', '🍓', 'Fruits', 1, 'lb', 1, 'Fridge', 'ai'),
    mk('Bananas', '🍌', 'Fruits', 6, 'ct', 2, 'Pantry', 'ai'),
    mk('Broccoli', '🥦', 'Vegetables', 1, 'head', 4, 'Fridge', 'ai'),
    mk('Romaine lettuce', '🥬', 'Vegetables', 1, 'head', 6, 'Fridge', 'ai'),
    mk('Yellow onion', '🧅', 'Vegetables', 3, 'ct', 21, 'Pantry', 'ai'),
    mk('Garlic', '🧄', 'Vegetables', 1, 'bulb', 25, 'Pantry', 'ai'),
    mk('Chicken breast', '🍗', 'Meat & Seafood', 2, 'lb', 2, 'Fridge', 'label'),
    mk('Ground beef', '🥩', 'Meat & Seafood', 1, 'lb', 5, 'Fridge', 'label'),
    mk('Milk (2%)', '🥛', 'Dairy & Eggs', 1, 'gal', 3, 'Fridge', 'label'),
    mk('Milk (2%)', '🥛', 'Dairy & Eggs', 1, 'gal', 11, 'Fridge', 'label'),
    mk('Greek yogurt', '🍶', 'Dairy & Eggs', 32, 'oz', -1, 'Fridge', 'label'),
    mk('Eggs', '🥚', 'Dairy & Eggs', 12, 'ct', 16, 'Fridge', 'label'),
    mk('Cheddar cheese', '🧀', 'Dairy & Eggs', 8, 'oz', 24, 'Fridge', 'label'),
    mk('Butter', '🧈', 'Dairy & Eggs', 1, 'lb', 40, 'Fridge', 'label'),
    mk('Parmesan', '🧀', 'Dairy & Eggs', 5, 'oz', 45, 'Fridge', 'label'),
    mk('Sandwich bread', '🍞', 'Grains & Bread', 1, 'loaf', 4, 'Pantry', 'label'),
    mk('Flour tortillas', '🫓', 'Grains & Bread', 10, 'ct', 9, 'Pantry', 'label'),
    mk('White rice', '🍚', 'Grains & Bread', 2, 'lb', 300, 'Pantry', 'label'),
    mk('Spaghetti', '🍝', 'Grains & Bread', 1, 'lb', 380, 'Pantry', 'label'),
    mk('All-purpose flour', '🌾', 'Spices & Baking', 5, 'lb', 180, 'Pantry', 'label'),
    mk('Granola', '🥣', 'Snacks', 12, 'oz', 60, 'Pantry', 'label'),
    mk('Tortilla chips', null, 'Snacks', 1, 'bag', 30, 'Pantry', 'label'),
    mk('Orange juice', '🧃', 'Drinks', 52, 'fl oz', 8, 'Fridge', 'label'),
    mk('Frozen peas', '🫛', 'Vegetables', 12, 'oz', 120, 'Freezer', 'label'),
    mk('Soy sauce', '🥢', 'Sauces & Condiments', 10, 'fl oz', 300, 'Pantry', 'label'),
    mk('Salsa', '🌶️', 'Sauces & Condiments', 16, 'oz', 12, 'Fridge', 'label'),
    mk('Pasta sauce', '🥫', 'Sauces & Condiments', 24, 'oz', 200, 'Pantry', 'label'),
    mk('Tomato soup', '🥫', 'Prepared Meals', 2, 'can', 400, 'Pantry', 'label')
  ];
}

/* ---------- Recipes ---------- */
// Launch recipes. The large Reels catalog lives in recipes.js and in the Supabase `recipe` table.
const BASE_RECIPES = [
  { id: 'stirfry', name: 'Chicken & Broccoli Stir-Fry', emoji: '🥡', type: 'Chinese', main: 'chicken', time: 25, serves: 6,
    bg: 'radial-gradient(circle at 50% 35%, #e0613f, #8c2413 55%, #2b0b05)', kw: ['stir fry', 'stir-fry', 'stirfry', 'broccoli'],
    ing: [{ m: 'chicken breast', a: 1, label: '1 lb chicken breast' }, { m: 'broccoli', a: 1, label: '1 head broccoli' }, { m: 'garlic', a: .25, label: '3 cloves garlic' }, { m: 'soy sauce', a: 2, label: '1/4 cup soy sauce' }, { m: 'white rice', a: .5, label: '1 1/2 cups rice' }],
    steps: ['Start the rice', 'Slice chicken into strips', 'Sear chicken in a hot pan, 5 min', 'Add broccoli and garlic', 'Pour in soy sauce and toss', 'Serve over rice'] },
  { id: 'friedrice', name: 'Egg Fried Rice', emoji: '🍚', type: 'Chinese', main: 'eggs', time: 15, serves: 4,
    bg: 'radial-gradient(circle at 50% 35%, #f0b429, #9a5a07 55%, #2c1502)', kw: ['fried rice', 'egg fried'],
    ing: [{ m: 'white rice', a: .5, label: '3 cups cooked rice' }, { m: 'eggs', a: 3, label: '3 eggs' }, { m: 'frozen peas', a: 4, label: '1 cup frozen peas' }, { m: 'soy sauce', a: 1, label: '2 tbsp soy sauce' }, { m: 'onion', a: 1, label: '1 onion' }],
    steps: ['Dice the onion', 'Scramble the eggs, set aside', 'Fry onion and peas, 3 min', 'Add rice and press flat to crisp', 'Stir in eggs and soy sauce'] },
  { id: 'pancakes', name: 'Banana Pancakes', emoji: '🥞', type: 'Breakfast', main: 'bananas', time: 20, serves: 6,
    bg: 'radial-gradient(circle at 50% 35%, #f6c453, #b8651b 55%, #3a1d06)', kw: ['pancake'],
    ing: [{ m: 'bananas', a: 2, label: '2 ripe bananas' }, { m: 'eggs', a: 2, label: '2 eggs' }, { m: 'all-purpose flour', a: .4, label: '1 1/2 cups flour' }, { m: 'milk', a: .09, label: '1 1/2 cups milk' }, { m: 'butter', a: .06, label: '2 tbsp butter' }],
    steps: ['Mash the bananas', 'Whisk in eggs and milk', 'Fold in the flour', 'Cook on a buttered pan', 'Flip when bubbles form'] },
  { id: 'quesadilla', name: 'Chicken Quesadillas', emoji: '🫓', type: 'Mexican', main: 'chicken', time: 15, serves: 4,
    bg: 'radial-gradient(circle at 50% 35%, #e98a2c, #8a3312 55%, #2a0e05)', kw: ['quesadilla'],
    ing: [{ m: 'flour tortillas', a: 4, label: '4 tortillas' }, { m: 'chicken breast', a: .5, label: '1/2 lb chicken' }, { m: 'cheddar', a: 4, label: '1 cup cheddar' }, { m: 'salsa', a: 4, label: '1/2 cup salsa' }],
    steps: ['Cook and shred the chicken', 'Fill tortillas with cheese and chicken', 'Toast 2 min per side', 'Slice and serve with salsa'] },
  { id: 'tacos', name: 'Weeknight Beef Tacos', emoji: '🌮', type: 'Mexican', main: 'beef', time: 20, serves: 6,
    bg: 'radial-gradient(circle at 50% 35%, #3fae62, #175c30 55%, #07210f)', kw: ['taco'],
    ing: [{ m: 'ground beef', a: 1, label: '1 lb ground beef' }, { m: 'flour tortillas', a: 6, label: '6 tortillas' }, { m: 'cheddar', a: 3, label: '3/4 cup cheddar' }, { m: 'lettuce', a: .5, label: '1/2 head lettuce' }, { m: 'salsa', a: 4, label: '1/2 cup salsa' }],
    steps: ['Brown the beef, 8 min', 'Warm the tortillas', 'Shred the lettuce', 'Fill and top with cheese and salsa'] },
  { id: 'bolognese', name: 'Easy Spaghetti Bolognese', emoji: '🍝', type: 'Italian', main: 'beef', time: 30, serves: 6,
    bg: 'radial-gradient(circle at 50% 35%, #d6402b, #6b1d0e 55%, #1f0904)', kw: ['spaghetti', 'bolognese'],
    ing: [{ m: 'spaghetti', a: 1, label: '1 lb spaghetti' }, { m: 'ground beef', a: 1, label: '1 lb ground beef' }, { m: 'pasta sauce', a: 24, label: '1 jar pasta sauce' }, { m: 'onion', a: 1, label: '1 onion' }, { m: 'parmesan', a: 1, label: '1/4 cup parmesan' }],
    steps: ['Boil the spaghetti', 'Brown beef with onion', 'Add pasta sauce, simmer 10 min', 'Toss with the pasta', 'Top with parmesan'] },
  { id: 'parfait', name: 'Strawberry Yogurt Parfait', emoji: '🍓', type: 'Breakfast', main: 'strawberries', time: 5, serves: 2,
    bg: 'radial-gradient(circle at 50% 35%, #ee6aa7, #9d174d 55%, #33061a)', kw: ['parfait'],
    ing: [{ m: 'greek yogurt', a: 8, label: '1 cup Greek yogurt' }, { m: 'strawberries', a: .5, label: '1/2 lb strawberries' }, { m: 'granola', a: 3, label: '3/4 cup granola' }],
    steps: ['Slice the strawberries', 'Spoon yogurt into a glass', 'Add berries and granola', 'Repeat the layers'] },
  { id: 'grilledcheese', name: 'Grilled Cheese & Tomato Soup', emoji: '🥪', type: 'American', main: 'cheese', time: 15, serves: 4,
    bg: 'radial-gradient(circle at 50% 35%, #f07f3c, #8a3312 55%, #2a0e05)', kw: ['grilled cheese', 'tomato soup'],
    ing: [{ m: 'bread', a: .5, label: '8 slices bread' }, { m: 'cheddar', a: 3, label: '4 slices cheddar' }, { m: 'butter', a: .06, label: '2 tbsp butter' }, { m: 'tomato soup', a: 1, label: '1 can tomato soup' }],
    steps: ['Heat the soup', 'Butter the bread', 'Add cheddar, grill 3 min per side', 'Slice and dunk'] },
  { id: 'alfredo', name: 'Chicken Alfredo', emoji: '🍝', type: 'Italian', main: 'chicken', time: 25, serves: 6,
    bg: 'radial-gradient(circle at 50% 35%, #e9d8a6, #9a7b3a 55%, #2e2310)', kw: ['alfredo'],
    ing: [{ m: 'spaghetti', a: 1, label: '1 lb pasta' }, { m: 'chicken breast', a: .75, label: '3/4 lb chicken' }, { m: 'heavy cream', a: 16, label: '2 cups heavy cream' }, { m: 'parmesan', a: 2, label: '1/2 cup parmesan' }, { m: 'garlic', a: .25, label: '3 cloves garlic' }],
    subs: { 'heavy cream': { use: ['milk', 'butter'], text: 'Swap the heavy cream for 1 1/2 cups milk warmed with 3 tbsp butter. It comes out a little lighter.' } },
    steps: ['Boil the pasta', 'Cook the chicken', 'Warm cream with garlic', 'Stir in parmesan', 'Toss everything together'] },
  { id: 'teriyaki', name: 'Salmon Teriyaki Bowl', emoji: '🍣', type: 'Japanese', main: 'salmon', time: 20, serves: 4,
    bg: 'radial-gradient(circle at 50% 35%, #f08a6c, #7a2a1c 55%, #220b06)', kw: ['teriyaki', 'salmon'],
    ing: [{ m: 'salmon', a: 1, label: '1 lb salmon' }, { m: 'white rice', a: .5, label: '1 1/2 cups rice' }, { m: 'soy sauce', a: 2, label: '1/4 cup soy sauce' }, { m: 'broccoli', a: 1, label: '1 head broccoli' }],
    steps: ['Cook the rice', 'Glaze and bake the salmon', 'Steam the broccoli', 'Build the bowls'] },
  { id: 'caesar', name: 'Chicken Caesar Wraps', emoji: '🌯', type: 'American', main: 'chicken', time: 15, serves: 4,
    bg: 'radial-gradient(circle at 50% 35%, #9bc46b, #3f6420 55%, #122008)', kw: ['caesar', 'wrap'],
    ing: [{ m: 'chicken breast', a: .75, label: '3/4 lb chicken' }, { m: 'flour tortillas', a: 4, label: '4 tortillas' }, { m: 'lettuce', a: 1, label: '1 head romaine' }, { m: 'parmesan', a: 1, label: '1/4 cup parmesan' }, { m: 'caesar dressing', a: 4, label: '1/2 cup Caesar dressing' }],
    steps: ['Cook and slice chicken', 'Chop the romaine', 'Toss with dressing and parmesan', 'Wrap it up'] }
];
const RECIPES = [...BASE_RECIPES];
function addRecipes(list) {
  let added = 0;
  for (const r of list || []) {
    if (!r || !r.id || !Array.isArray(r.ing) || !r.ing.length || !Array.isArray(r.steps) || !r.steps.length) continue;
    const at = RECIPES.findIndex(x => x.id === r.id);
    if (at >= 0) RECIPES[at] = { ...RECIPES[at], ...r }; else { RECIPES.push(r); added++; }
  }
  return added;
}
addRecipes(window.MYPANTRY_RECIPES);
const R = id => RECIPES.find(r => r.id === id);
// Ingredient keys may list alternatives, e.g. "pasta|spaghetti|penne".
const altsOf = m => String(m).split('|').map(k => k.trim()).filter(Boolean);
const ingName = m => altsOf(m)[0];
// Friendly name for a missing ingredient: its label without the amount ("3/4 cup BBQ sauce" -> "BBQ sauce").
const needName = g => {
  const n = String(g.label || '').replace(/\(.*?\)/g, '')
    .replace(/^(a\s+)?[\d\s\/.½¼¾-]*(thick\s+)?(cups?|tbsp|tsp|lbs?|oz|cans?|cloves?|slices?|heads?|bunch(es)?|packs?|jars?|blocks?|bags?|sleeves?|loa(f|ves)|handful of|pinch of|stalks?)?\s+(of\s+)?/i, '').trim();
  // Generic labels ("veggies", "sauce") read better as the actual options, e.g. "broccoli or carrot".
  if (!n || /\d/.test(n) || /^(chopped\s+)?(veggies|vegetables|fruit|greens|sauce|crunch|chopped|cups?|mix-in|chips for topping)$/i.test(n)) {
    const a = altsOf(g.m).slice(0, 3);
    return a.length > 1 ? `${a.slice(0, -1).join(', ')} or ${a[a.length - 1]}` : a[0];
  }
  return n;
};

/* ---------- State ---------- */
const APP_THEMES = {
  paprika: {
    name: 'Paprika & Saffron',
    description: 'Warm paprika red, golden saffron and cream.',
    colors: ['#b43a2f', '#c47a12', '#fff8ee']
  },
  tomato: {
    name: 'Tomato & Basil',
    description: 'Bright tomato coral, garden basil and soft sage.',
    colors: ['#d65332', '#397557', '#f3f7f1']
  },
  aubergine: {
    name: 'Aubergine & Apricot',
    description: 'Deep aubergine, mellow apricot and warm ivory.',
    colors: ['#673653', '#d8753d', '#fff8f2']
  },
  basil: {
    name: 'Classic Green',
    description: 'The original MyPantry basil, gold and cool white.',
    colors: ['#1d6a4c', '#f2b632', '#e9eeeb']
  }
};
const normalizeTheme = value => Object.hasOwn(APP_THEMES, value) ? value : 'paprika';
const visualTheme = () => normalizeTheme(S?.prefs?.appearanceTheme);
function applyVisualTheme() {
  document.documentElement.dataset.palette = visualTheme();
}

let S;
function freshState() {
  return {
    auth: 'login', tab: 'home', inv: samplePantry(),
    user: null, signupEmail: '',
    remembered: false, faceId: true, stayIn: false, metric: false, reminders: true,
    store: "Smith's",
    prefs: {}, liked: new Set(), likeCounts: {}, saved: new Set(), watched: new Set(), conversationId: null,
    chat: [], pending: null, undo: null, wasteEvents: [], wasteStatus: 'loading',
    recipeUseEvents: [], recipeUseStatus: 'loading',
    foodAddedEvents: [], foodAddedStatus: 'loading', foodAddedMonth: null,
    ingView: 'all', ingCat: 'All', ingQuery: '',
scan: null, setPage: null, reelView: 'feed', shopRecipeId: null, shopReturnTab: null,
profileDraft: null, profileCamera: null, profileError: null, profileLoading: false, profileSaving: false,
allergyDraft: null, allergyError: null
  };
}
S = freshState();

/* ---------- Supabase (vertical slice) ----------
   config.js is generated by the local build or GitHub Pages deployment. */
const CFG = window.MYPANTRY_CONFIG || {};
const DEMO_ACCOUNT_ID = typeof CFG.demoAccountId === 'string' ? CFG.demoAccountId.trim().toLowerCase() : '';
const isDemoAccount = () => !!(DEMO_ACCOUNT_ID && S.user?.id?.toLowerCase() === DEMO_ACCOUNT_ID);
let configError = '';
let sb = null;
try {
  if (!CFG.supabaseUrl || !CFG.supabaseKey || !window.supabase) throw new Error('Sign-in is unavailable. Please check the website configuration and reload.');
  sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
} catch (error) { configError = error.message; }
// This column is added by the reviewed database migration before deployment.
const OWNER_COLUMN = 'auth_user_id';
let accountGeneration = 0;
let pantryRequest = 0;
let wasteRequest = 0;
let recipeUseRequest = 0;
let foodAddedRequest = 0;
let recipeUseInFlight = false;
let appStateTimer = null;
let appStateWriteQueue = Promise.resolve();
let chatLoadRequest = 0;
let chatRevision = 0;
let chatWriteQueue = Promise.resolve();
const APP_SESSION_KEY = owner => `mp_app_session_v1:${owner}`;
const APP_SESSION_IDLE_MS = 15 * 60 * 1000;
const APP_SESSION_HEARTBEAT_MS = 60 * 1000;
let appSessionId = null;
let appSessionOwner = null;
let appSessionGeneration = 0;
let appSessionTimer = null;
let appSessionStarting = false;
const redirectTo = window.location.origin + window.location.pathname;
const auth = sb ? window.MyPantryAuth.createAuth(sb, applySession, error => {
  S.auth = 'login'; S.user = null; S.authError = error.message; render();
}) : null;
let sync = sb ? 'loading' : 'offline';   // loading | synced | error | offline
if (sb) S.inv = [];

function rowToItem(r) {
  return {
    id: 'db' + r.ingredient_id, dbId: r.ingredient_id,
    name: r.ingredient_name, emoji: guessEmoji(r.ingredient_name),
    brand: r.brand || '', productName: r.product_name || '',
    cat: normalizeCategory(r.ingredient_name, r.food_type),
    qty: Number(r.quantity), unit: r.measurement, exp: r.expiration_date,
    legacyUserId: r.user_id ?? null, wayAdded: r.way_added || 'manual',
    store: r.storage_location || (r.food_type === 'Frozen' ? 'Freezer' : 'Fridge'),
    src: r.expiration_source || ((r.way_added === 'barcode' || r.way_added === 'manual') ? 'label' : 'ai')
  };
}
function statusFor(exp) {
  const d = Math.round((parseIso(exp) - TODAY) / DAY);
  return d < 0 ? 'Expired' : d <= 7 ? 'Expiring soon' : 'Fresh';
}
async function loadPantry() {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration, request = ++pantryRequest;
  sync = 'loading';
  let data, error;
  try {
    ({ data, error } = await sb.from('pantry_item')
      .select('*').eq(OWNER_COLUMN, owner).order('expiration_date'));
  } catch (err) { error = err; }
  if (generation !== accountGeneration || request !== pantryRequest) return;
  if (error) { sync = 'error'; console.error('[MyPantry] load failed', error); toast(`Couldn't load your pantry: ${esc(error.message)}`, null, 'alert'); render(); return; }
  S.inv = data.map(rowToItem); sync = 'synced';
  render();
}
async function loadWasteEvents() {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration, request = ++wasteRequest;
  S.wasteStatus = 'loading';
  const events = [];
  try {
    for (let start = 0; ; start += 500) {
      const { data, error } = await sb.from('food_waste_events')
        .select('event_id,user_id,source_ingredient_id,ingredient_name,food_type,quantity,measurement,reason,occurred_at')
        .eq('user_id', owner).order('occurred_at', { ascending: false }).range(start, start + 499);
      if (generation !== accountGeneration || request !== wasteRequest) return;
      if (error) throw error;
      events.push(...data);
      if (data.length < 500) break;
    }
    S.wasteEvents = events;
    S.wasteStatus = 'synced';
  } catch (error) {
    if (generation !== accountGeneration || request !== wasteRequest) return;
    S.wasteStatus = 'error';
    console.error('[MyPantry] food waste load failed', error);
  }
  if (S.tab === 'ing') render();
  if ($('#wasteHistorySheet')) openSheet(wasteHistorySheet());
}
async function loadFoodAddedEvents() {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration, request = ++foodAddedRequest;
  if (S.foodAddedStatus !== 'synced') S.foodAddedStatus = 'loading';
  const events = [];
  try {
    for (let start = 0; ; start += 500) {
      const { data, error } = await sb.from('food_added_events')
        .select('event_id,user_id,source_ingredient_id,ingredient_name,brand,product_name,quantity,measurement,way_added,added_at')
        .eq('user_id', owner).order('added_at', { ascending: false }).order('event_id', { ascending: false })
        .range(start, start + 499);
      if (generation !== accountGeneration || request !== foodAddedRequest) return;
      if (error) throw error;
      events.push(...data);
      if (data.length < 500) break;
    }
    S.foodAddedEvents = events;
    S.foodAddedStatus = 'synced';
  } catch (error) {
    if (generation !== accountGeneration || request !== foodAddedRequest) return;
    S.foodAddedStatus = 'error';
    console.error('[MyPantry] food added history load failed', error);
  }
  if (S.tab === 'ing') render();
  if ($('#foodAddedHistorySheet')) openSheet(foodAddedHistorySheet());
}
async function loadRecipeUseEvents() {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration, request = ++recipeUseRequest;
  if (S.recipeUseStatus !== 'synced') S.recipeUseStatus = 'loading';
  const events = [];
  try {
    for (let start = 0; ; start += 500) {
      const { data, error } = await sb.from('recipe_use_events')
        .select('event_id,user_id,source,recipe_id,recipe_name,used_at')
        .eq('user_id', owner).order('used_at', { ascending: false }).range(start, start + 499);
      if (generation !== accountGeneration || request !== recipeUseRequest) return;
      if (error) throw error;
      events.push(...data);
      if (data.length < 500) break;
    }
    S.recipeUseEvents = events;
    S.recipeUseStatus = 'synced';
  } catch (error) {
    if (generation !== accountGeneration || request !== recipeUseRequest) return;
    S.recipeUseStatus = 'error';
    console.error('[MyPantry] recipe use history load failed', error);
  }
  if (S.tab === 'ing') render();
  if ($('#recipeUseHistorySheet')) openSheet(recipeUseHistorySheet());
}
async function saveRecipeUseEvent(source, recipeName, recipeId = null, eventId = newUuid()) {
  const owner = S.user?.id, generation = accountGeneration;
  if (!sb || !owner) throw new Error('Sign in before logging a recipe.');
  const payload = { event_id: eventId, user_id: owner, source, recipe_id: recipeId, recipe_name: recipeName };
  let data, error;
  try {
    ({ data, error } = await sb.from('recipe_use_events').insert(payload)
      .select('event_id,user_id,source,recipe_id,recipe_name,used_at').maybeSingle());
  } catch (cause) { error = cause; }
  if (error || !data) {
    // A lost response can follow a successful insert. Check the known event ID
    // before deciding the recipe was not logged.
    let result;
    try {
      result = await sb.from('recipe_use_events')
        .select('event_id,user_id,source,recipe_id,recipe_name,used_at')
        .eq('event_id', eventId).eq('user_id', owner).maybeSingle();
    } catch (_) {}
    if (!result?.data) throw error || result?.error || new Error('The recipe log was not confirmed.');
    data = result.data;
  }
  if (generation !== accountGeneration || S.user?.id !== owner || data.user_id !== owner) throw new Error('Your account changed before the recipe was saved.');
  ++recipeUseRequest;
  if (!S.recipeUseEvents.some(event => event.event_id === data.event_id)) S.recipeUseEvents.unshift(data);
  S.recipeUseStatus = 'synced';
  void loadRecipeUseEvents();
  return data;
}
async function recordCatalogRecipeUse(source, recipe, consumption) {
  const owner = S.user?.id, generation = accountGeneration;
  if (!sb || !owner || !consumption.length || consumption.some(item => !item.ingredient_id)) {
    throw new Error('Your pantry is not ready to log this recipe. Reload and try again.');
  }
  const eventId = newUuid();
  let data, error;
  try {
    ({ data, error } = await sb.rpc('record_recipe_use', {
      p_event_id: eventId, p_source: source, p_recipe_id: recipe.id,
      p_recipe_name: recipe.name, p_consumption: consumption
    }));
  } catch (cause) { error = cause; }
  data = data?.event;
  if (error || !data?.event_id) {
    // The function may have committed even when its response was lost.
    let result;
    try {
      result = await sb.from('recipe_use_events')
        .select('event_id,user_id,source,recipe_id,recipe_name,used_at')
        .eq('event_id', eventId).eq('user_id', owner).maybeSingle();
    } catch (_) {}
    if (!result?.data) throw error || result?.error || new Error('The recipe update was not confirmed.');
    data = result.data;
  }
  if (generation !== accountGeneration || S.user?.id !== owner || data.user_id !== owner) {
    throw new Error('Your account changed before the recipe was saved.');
  }
  ++pantryRequest;
  sync = 'synced';
  ++recipeUseRequest;
  if (!S.recipeUseEvents.some(event => event.event_id === data.event_id)) S.recipeUseEvents.unshift(data);
  S.recipeUseStatus = 'synced';
  void loadRecipeUseEvents();
  return data;
}
async function removeRecipeUseEvent(eventId) {
  const owner = S.user?.id, generation = accountGeneration;
  if (!sb || !owner) throw new Error('Sign in before changing recipe history.');
  const { data, error } = await sb.from('recipe_use_events').delete()
    .eq('event_id', eventId).eq('user_id', owner).select('event_id');
  if (error) throw error;
  if (generation !== accountGeneration || S.user?.id !== owner) return false;
  if (!data?.length) throw new Error('That recipe entry was not found.');
  ++recipeUseRequest;
  S.recipeUseEvents = S.recipeUseEvents.filter(event => event.event_id !== eventId);
  S.recipeUseStatus = 'synced';
  void loadRecipeUseEvents();
  return true;
}
const stateKey = () => S.user?.id ? `mp_state_v2:${S.user.id}` : null;
function persist() {
  const key = stateKey(); if (!key) return;
  if (S.auth === 'app') {
    try {
      sessionStorage.setItem(`${key}:navigation`, JSON.stringify({ tab: S.tab, ingView: S.ingView,
        ingCat: S.ingCat, reelView: S.reelView, setPage: S.setPage }));
    } catch (_) {}
  }
  try {
    localStorage.setItem(key, JSON.stringify({ inv: sb ? undefined : S.inv, saved: [...S.saved], liked: [...S.liked], watched: [...S.watched], prefs: S.prefs, metric: S.metric, reminders: S.reminders, store: S.store, uid }));
  } catch (_) {}
  if (sb && S.user?.id) queueUserAppStateWrite();
}
/* Published reels from the Supabase `recipe` table. The built-in catalog keeps the
   feed full when the table is missing, empty or unreachable. */
function rowToRecipe(row) {
  const ing = Array.isArray(row.ingredients) ? row.ingredients
    .filter(g => g && g.m && g.label).map(g => ({ m: String(g.m).toLowerCase(), a: Number(g.a) || 1, label: String(g.label) })) : [];
  return {
    id: row.recipe_id, name: row.name, emoji: row.emoji || '🍽️', type: row.cuisine, main: row.main_ingredient,
    time: row.minutes, serves: row.serves,
    bg: row.background || 'radial-gradient(circle at 50% 35%, #e0613f, #8c2413 55%, #2b0b05)',
    kw: row.keywords || [], ing, steps: row.steps || [], ...(row.substitutions ? { subs: row.substitutions } : {}),
    ...(row.video_url ? { video: row.video_url } : {})
  };
}
/* Reel like counts are real: the number of other MyPantry accounts that liked each
   recipe (from the recipe_like_counts RPC), plus 1 when the current user likes it. */
let likeCountsAt = 0, likeCountsRequest = 0;
const likeCount = r => (S.likeCounts[r.id] || 0) + (S.liked.has(r.id) ? 1 : 0);
async function loadLikeCounts(force = false) {
  if (!sb || !S.user?.id) return;
  if (!force && Date.now() - likeCountsAt < 30000) return;
  likeCountsAt = Date.now();
  const request = ++likeCountsRequest, owner = S.user.id;
  try {
    const { data, error } = await sb.rpc('recipe_like_counts');
    if (error) throw error;
    if (request !== likeCountsRequest || S.user?.id !== owner) return;
    const counts = {};
    for (const row of data || []) if (row?.recipe_id) counts[row.recipe_id] = Math.max(0, Number(row.likes) || 0);
    S.likeCounts = counts;
    $$('#reelFeed [data-act="like"]').forEach(b => { const r = R(b.dataset.arg); const n = b.querySelector('.num'); if (r && n) n.textContent = fmtK(likeCount(r)); });
  } catch (error) {
    likeCountsAt = 0;
    console.warn('[MyPantry] recipe like counts unavailable', error);
  }
}
let remoteRecipesLoaded = false;
async function loadRemoteRecipes() {
  if (!sb || remoteRecipesLoaded) return;
  remoteRecipesLoaded = true;
  try {
    const { data, error } = await sb.from('recipe').select('*').eq('is_published', true).order('sort_order').limit(1000);
    if (error) throw error;
    if (!Array.isArray(data) || !data.length) return;
    addRecipes(data.map(rowToRecipe));
    if (S.auth === 'app' && ((S.tab === 'reels' && S.reelView !== 'saved' && !$('#reelFeed')?.scrollTop)
      || (S.tab === 'settings' && S.setPage === 'deals'))) render();
  } catch (error) {
    remoteRecipesLoaded = false;
    console.warn('[MyPantry] recipe catalog unavailable, using built-in reels', error);
  }
}

function hydrate() {
  const key = stateKey(); if (!key) return;
  // Keep navigation per browser tab and account. Never restore unfinished scans
  // or modal dialogs, and ignore invalid/old stored routes.
  try {
    const nav = JSON.parse(sessionStorage.getItem(`${key}:navigation`) || 'null');
    if (nav) {
      if (['home', 'ing', 'scan', 'reels', 'settings'].includes(nav.tab)) S.tab = nav.tab;
      if (['all', 'soon'].includes(nav.ingView)) S.ingView = nav.ingView;
      if (['All', ...CATS].includes(nav.ingCat)) S.ingCat = nav.ingCat;
      if (['feed', 'saved'].includes(nav.reelView)) S.reelView = nav.reelView;
      if (['deals', 'profile', 'allergies', 'username', 'password', 'email'].includes(nav.setPage)) S.setPage = nav.setPage;
    }
  } catch (_) {}
  try {
    const d = JSON.parse(localStorage.getItem(key) || 'null'); if (!d) return;
    if (Array.isArray(d.inv) && !sb) S.inv = d.inv;
    S.saved = new Set(d.saved || []); S.liked = new Set(d.liked || []); S.watched = new Set(d.watched || []); S.prefs = d.prefs || {};
    S.metric = !!d.metric; S.reminders = d.reminders !== false; S.store = d.store || S.store; uid = Math.max(uid, d.uid || 0);
  } catch (_) {}
}
function userAppStatePayload(owner = S.user?.id) {
  return {
    user_id: owner,
    saved_recipe_ids: [...S.saved],
    liked_recipe_ids: [...S.liked],
    watched_recipe_ids: [...S.watched],
    recipe_preferences: S.prefs,
    metric: S.metric,
    spoil_reminders: S.reminders,
    preferred_store: S.store || null,
    zip_code: null // ZIP is no longer collected; clear any previously saved value.
  };
}
function queueUserAppStateWrite() {
  clearTimeout(appStateTimer);
  const generation = accountGeneration;
  appStateTimer = setTimeout(async () => {
    const owner = S.user?.id;
    if (!sb || !owner || generation !== accountGeneration) return;
    appStateWriteQueue = appStateWriteQueue.catch(() => {}).then(async () => {
      if (generation !== accountGeneration) return;
      const { error } = await sb.from('user_app_state').upsert(userAppStatePayload(owner), { onConflict: 'user_id' });
      if (generation !== accountGeneration) return;
      if (error) throw error;
    }).catch(error => {
      if (generation !== accountGeneration) return;
      console.error('[MyPantry] account state save failed', error);
      toast(`Couldn't sync your saved recipes and settings: ${esc(error.message)}`, null, 'alert');
    });
  }, 180);
}
async function loadUserAppState() {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration;
  let data, error;
  try {
    ({ data, error } = await sb.from('user_app_state').select('*').eq('user_id', owner).maybeSingle());
  } catch (err) { error = err; }
  if (generation !== accountGeneration) return;
  if (error) {
    console.error('[MyPantry] account state load failed', error);
    toast(`Couldn't load your saved recipes and settings: ${esc(error.message)}`, null, 'alert');
    return;
  }
  if (data) {
    S.saved = new Set(data.saved_recipe_ids || []);
    S.liked = new Set(data.liked_recipe_ids || []);
    S.watched = new Set(data.watched_recipe_ids || []);
    S.prefs = data.recipe_preferences || {};
    S.metric = !!data.metric;
    S.reminders = data.spoil_reminders !== false;
    S.store = data.preferred_store || "Smith's";
    render();
    return;
  }
  // One-time migration of this account's old browser-only settings and recipe state.
  let hasLocalState = false;
  try { hasLocalState = !!localStorage.getItem(stateKey()); } catch (_) {}
  if (hasLocalState) queueUserAppStateWrite();
}
function ensureConversationId() {
  if (!S.conversationId) S.conversationId = newUuid();
  return S.conversationId;
}
function historicalChatHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('[data-act]').forEach(control => {
    const label = document.createElement('span');
    label.textContent = control.textContent;
    control.replaceWith(label);
  });
  return template.innerHTML;
}
function saveChatMessage(who, html) {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration, conversationId = ensureConversationId();
  chatWriteQueue = chatWriteQueue.catch(() => {}).then(async () => {
    if (generation !== accountGeneration) return;
    const { error: conversationError } = await sb.from('chat_conversations').upsert(
      { conversation_id: conversationId, user_id: owner }, { onConflict: 'conversation_id' }
    );
    if (conversationError) throw conversationError;
    const { error } = await sb.from('chat_messages').insert({
      conversation_id: conversationId, user_id: owner,
      sender: who === 'user' ? 'user' : 'assistant', content_html: html
    });
    if (error) throw error;
  }).catch(error => {
    if (generation !== accountGeneration) return;
    console.error('[MyPantry] chat history save failed', error);
    toast(`Couldn't save this conversation: ${esc(error.message)}`, null, 'alert');
  });
}
async function loadChatHistory() {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration, request = ++chatLoadRequest, revision = chatRevision;
  let conversation, error;
  try {
    ({ data: conversation, error } = await sb.from('chat_conversations').select('conversation_id')
      .eq('user_id', owner).order('created_at', { ascending: false }).limit(1).maybeSingle());
    if (error) throw error;
    if (!conversation) {
      if (generation === accountGeneration && request === chatLoadRequest && revision === chatRevision) {
        S.conversationId = newUuid(); S.chat = []; render();
      }
      return;
    }
    let messages;
    ({ data: messages, error } = await sb.from('chat_messages').select('sender, content_html')
      .eq('user_id', owner).eq('conversation_id', conversation.conversation_id)
      .order('created_at', { ascending: true }));
    if (error) throw error;
    if (generation !== accountGeneration || request !== chatLoadRequest || revision !== chatRevision) return;
    S.conversationId = conversation.conversation_id;
    S.chat = (messages || []).map(m => ({ who: m.sender === 'user' ? 'user' : 'bot', html: historicalChatHtml(m.content_html) }));
    chatHistory = (messages || []).map(m => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: chatTextFromHtml(m.content_html)
    })).filter(m => m.content).slice(-10);
    render();
  } catch (err) {
    if (generation !== accountGeneration || request !== chatLoadRequest) return;
    console.error('[MyPantry] chat history load failed', err);
    toast(`Couldn't load your conversation history: ${esc(err.message)}`, null, 'alert');
  }
}

function stopAppSessionTracking(clearStored = true) {
  clearInterval(appSessionTimer);
  appSessionTimer = null;
  if (clearStored && appSessionOwner) {
    try { sessionStorage.removeItem(APP_SESSION_KEY(appSessionOwner)); } catch (_) {}
  }
  appSessionId = null;
  appSessionOwner = null;
  appSessionGeneration = 0;
  appSessionStarting = false;
}
function appSessionIsCurrent(owner, generation) {
  return !!sb && S.auth === 'app' && S.user?.id === owner &&
    accountGeneration === generation && appSessionOwner === owner &&
    appSessionGeneration === generation && !!appSessionId;
}
async function updateAppSession(values, owner = appSessionOwner, id = appSessionId) {
  if (!sb || !owner || !id) return false;
  const { error } = await sb.from('app_sessions').update(values)
    .eq('session_id', id).eq('user_id', owner);
  if (error) throw error;
  return true;
}
async function appSessionHeartbeat(owner, generation) {
  if (!appSessionIsCurrent(owner, generation) || document.visibilityState === 'hidden') return;
  try {
    await updateAppSession({ last_active_at: new Date().toISOString() }, owner, appSessionId);
  } catch (error) { console.warn('[MyPantry] session activity update failed', error); }
}
async function resumeAppSessionAfterVisibility() {
  const owner = appSessionOwner, id = appSessionId, generation = appSessionGeneration;
  if (!appSessionIsCurrent(owner, generation)) return startAppSessionTracking();
  try {
    const { data, error } = await sb.from('app_sessions').select('last_active_at,ended_at')
      .eq('session_id', id).eq('user_id', owner).maybeSingle();
    if (error) throw error;
    if (!appSessionIsCurrent(owner, generation)) return;
    const activeAt = Date.parse(data?.last_active_at || '');
    if (!data || data.ended_at || !Number.isFinite(activeAt) || Date.now() - activeAt > APP_SESSION_IDLE_MS) {
      if (data && !data.ended_at && Number.isFinite(activeAt)) {
        const { error: endError } = await sb.from('app_sessions').update({
          ended_at: new Date(activeAt + APP_SESSION_IDLE_MS).toISOString(), end_reason: 'inactive_timeout'
        }).eq('session_id', id).eq('user_id', owner);
        if (endError) throw endError;
      }
      if (!appSessionIsCurrent(owner, generation)) return;
      stopAppSessionTracking();
      return startAppSessionTracking();
    }
    await appSessionHeartbeat(owner, generation);
  } catch (error) { console.warn('[MyPantry] session resume check failed', error); }
}
async function startAppSessionTracking() {
  if (!sb || !S.user?.id || S.auth !== 'app' || appSessionStarting) return;
  const owner = S.user.id, generation = accountGeneration;
  if (appSessionOwner === owner && appSessionGeneration === generation && appSessionId) return;
  appSessionStarting = true;
  const storedKey = APP_SESSION_KEY(owner);
  try {
    let storedId = null;
    try { storedId = sessionStorage.getItem(storedKey); } catch (_) {}
    let row = null;
    if (storedId) {
      const result = await sb.from('app_sessions').select('session_id,last_active_at,ended_at')
        .eq('session_id', storedId).eq('user_id', owner).maybeSingle();
      if (result.error) throw result.error;
      row = result.data;
    } else {
      // Recover a recent session if the browser lost its per-tab storage.
      const result = await sb.from('app_sessions').select('session_id,last_active_at,ended_at')
        .eq('user_id', owner).order('started_at', { ascending: false }).limit(1).maybeSingle();
      if (result.error) throw result.error;
      row = result.data;
    }
    if (generation !== accountGeneration || S.user?.id !== owner || S.auth !== 'app') return;
    const now = Date.now();
    if (row && !row.ended_at && Number.isFinite(Date.parse(row.last_active_at)) &&
        now - Date.parse(row.last_active_at) <= APP_SESSION_IDLE_MS) {
      appSessionId = row.session_id;
      appSessionOwner = owner;
      appSessionGeneration = generation;
      try { sessionStorage.setItem(storedKey, appSessionId); } catch (_) {}
      await appSessionHeartbeat(owner, generation);
    } else {
      if (row && !row.ended_at && Number.isFinite(Date.parse(row.last_active_at))) {
        const inactiveAt = new Date(Date.parse(row.last_active_at) + APP_SESSION_IDLE_MS).toISOString();
        const { error } = await sb.from('app_sessions').update({
          ended_at: inactiveAt, end_reason: 'inactive_timeout'
        }).eq('session_id', row.session_id).eq('user_id', owner);
        if (error) throw error;
      }
      if (generation !== accountGeneration || S.user?.id !== owner || S.auth !== 'app') return;
      appSessionId = newUuid();
      appSessionOwner = owner;
      appSessionGeneration = generation;
      try { sessionStorage.setItem(storedKey, appSessionId); } catch (_) {}
      const { error } = await sb.from('app_sessions').insert({ session_id: appSessionId, user_id: owner });
      if (error) throw error;
    }
    if (!appSessionIsCurrent(owner, generation)) return;
    clearInterval(appSessionTimer);
    appSessionTimer = setInterval(() => appSessionHeartbeat(owner, generation), APP_SESSION_HEARTBEAT_MS);
  } catch (error) {
    console.warn('[MyPantry] session tracking could not start', error);
    if (appSessionOwner === owner && appSessionGeneration === generation) stopAppSessionTracking();
  } finally {
    appSessionStarting = false;
  }
}
async function endAppSession(reason = 'signed_out') {
  const owner = appSessionOwner, id = appSessionId;
  if (!owner || !id) return false;
  clearInterval(appSessionTimer);
  appSessionTimer = null;
  try {
    const endedAt = new Date().toISOString();
    await updateAppSession({ last_active_at: endedAt, ended_at: endedAt, end_reason: reason }, owner, id);
    try { sessionStorage.removeItem(APP_SESSION_KEY(owner)); } catch (_) {}
    return true;
  } catch (error) {
    console.warn('[MyPantry] session end could not be saved', error);
    return false;
  }
}
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && S.auth === 'app') {
    resumeAppSessionAfterVisibility();
  }
});

async function loadAvatarUrl(owner, path) {
  if (!sb || !owner || !path) return;
  const generation = accountGeneration;
  try {
    const { data, error } = await sb.storage.from('avatars').createSignedUrl(path, 60 * 60);
    if (error) throw error;
    if (generation !== accountGeneration || S.user?.id !== owner || S.user.avatarPath !== path) return;
    S.user.avatarUrl = data?.signedUrl || null;
    if (S.tab === 'settings') render();
  } catch (error) {
    console.warn('[MyPantry] profile photo could not be loaded', error);
  }
}

function applySession(session, event) {
  const user = session?.user;
  if (!user) {
    stopAppSessionTracking();
    resetAIChat();
    ++accountGeneration;
    ++chatLoadRequest; ++chatRevision;
    $$('.toast', phone).forEach(t => t.remove());
    closeSheet(); S = freshState(); S.inv = []; S.auth = 'login';
    render(); return;
  }
  const previousEmail = S.user?.email;
  const previousAvatarPath = S.user?.avatarPath || null;
  const changed = S.user?.id !== user.id;
  if (changed) {
    stopAppSessionTracking();
    resetAIChat();
    ++accountGeneration;
    ++chatLoadRequest; ++chatRevision;
    $$('.toast', phone).forEach(t => t.remove());
    closeSheet(); S = freshState(); S.inv = [];
    S.user = { id: user.id, email: user.email || '', name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      avatarPath: user.user_metadata?.avatar_path || null, avatarUrl: null };
    hydrate();
  } else {
    S.user.name = user.user_metadata?.name || S.user.name;
    S.user.email = user.email || S.user.email;
    S.user.avatarPath = user.user_metadata?.avatar_path || null;
    if (S.user.avatarPath !== previousAvatarPath) S.user.avatarUrl = null;
  }
  S.user.pendingEmail = user.new_email || '';
  if (event === 'USER_UPDATED' && (previousEmail !== user.email || previousAvatarPath !== S.user.avatarPath) && S.tab === 'settings') render();
  if (event === 'PASSWORD_RECOVERY') { S.auth = 'recovery'; render(); return; }
  // Refreshing a token or returning to the tab must not reset navigation or chat.
  if (changed || S.auth !== 'app') enterApp();
  else if (S.user.avatarPath !== previousAvatarPath) void loadAvatarUrl(S.user.id, S.user.avatarPath);
}

/* ---------- Inventory logic ---------- */
const ALLERGY_PRESETS = [
  { id: 'milk', label: 'Milk', terms: ['milk', 'buttermilk', 'cream', 'half and half', 'cheese', 'butter', 'ghee', 'yogurt', 'yoghurt', 'dairy', 'whey', 'casein', 'caseinate', 'curd', 'custard', 'parmesan', 'cheddar', 'mozzarella', 'ricotta', 'ice cream'] },
  { id: 'eggs', label: 'Eggs', terms: ['egg', 'eggs', 'mayonnaise', 'mayo', 'albumin', 'albumen', 'ovalbumin', 'meringue', 'caesar dressing'] },
  { id: 'fish', label: 'Fish', terms: ['fish', 'salmon', 'tuna', 'cod', 'tilapia', 'anchovy', 'anchovies', 'haddock', 'halibut', 'trout', 'sardine', 'pollock', 'mahi', 'caesar dressing', 'worcestershire'] },
  { id: 'shellfish', label: 'Shellfish', terms: ['shellfish', 'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'crawfish', 'scallop', 'clam', 'mussel', 'oyster', 'squid', 'calamari', 'octopus'] },
  { id: 'tree nuts', label: 'Tree nuts', terms: ['tree nut', 'almond', 'cashew', 'walnut', 'pecan', 'pistachio', 'hazelnut', 'macadamia', 'brazil nut', 'pine nut', 'chestnut', 'praline', 'marzipan', 'pesto'] },
  { id: 'peanuts', label: 'Peanuts', terms: ['peanut', 'peanuts'] },
  { id: 'wheat', label: 'Wheat', terms: ['wheat', 'flour', 'bread', 'pasta', 'noodle', 'tortilla', 'cracker', 'cereal', 'semolina', 'durum', 'couscous', 'bulgur', 'farro', 'spelt', 'seitan'] },
  { id: 'soy', label: 'Soy', terms: ['soy', 'soya', 'soybean', 'tofu', 'edamame', 'tempeh', 'miso', 'tamari', 'textured vegetable protein'] },
  { id: 'sesame', label: 'Sesame', terms: ['sesame', 'tahini', 'benne', 'hummus'] }
];
const normalizeAllergy = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
function allergyList(source = S.prefs?.allergies) {
  if (!Array.isArray(source)) return [];
  return [...new Set(source.map(normalizeAllergy).filter(value => value && value.length <= 50))].slice(0, 20);
}
function allergyLabel(value) {
  const normalized = normalizeAllergy(value);
  return ALLERGY_PRESETS.find(item => item.id === normalized)?.label
    || normalized.replace(/\b\w/g, letter => letter.toUpperCase());
}
function includesWordPhrase(words, phrase) {
  const wanted = shopWords(phrase);
  return !!wanted.length && words.some((_, at) => wanted.every((word, offset) => words[at + offset] === word));
}
function matchingAllergiesInText(text, source = allergyList()) {
  const selected = allergyList(source);
  if (!selected.length) return [];
  const words = shopWords(text);
  return selected.filter(allergy => {
    const preset = ALLERGY_PRESETS.find(item => item.id === allergy);
    return (preset?.terms || [allergy]).some(term => includesWordPhrase(words, term));
  });
}
function matchingRecipeAllergies(recipe) {
  const text = [recipe.name, recipe.main, recipe.type, ...(recipe.kw || []),
    ...recipe.ing.flatMap(ingredient => [ingredient.m, ingredient.label]),
    ...(recipe.steps || [])].join(' ');
  return matchingAllergiesInText(text);
}
function safeSubstitution(recipe, ingredient) {
  const substitution = recipe.subs?.[ingredient.m];
  if (!substitution) return null;
  const text = [...(substitution.use || []), substitution.text || ''].join(' ');
  return matchingAllergiesInText(text).length ? null : substitution;
}
const recipeAllowed = recipe => matchingRecipeAllergies(recipe).length === 0;
const recipeCandidates = () => RECIPES.filter(recipeAllowed);
const findItems = m => matchingFoodItems(m);
const has = m => findItems(m).some(item => daysLeft(item) >= 0);
const canMake = r => r.ing.every(g => has(g.m));
function missingOf(r) { return r.ing.filter(g => !has(g.m)); }
function canMakeWithSub(r) {
  const miss = missingOf(r);
  return miss.length > 0 && miss.every(g => {
    const substitution = safeSubstitution(r, g);
    return substitution && substitution.use.every(has);
  });
}
function recipeUrgency(r) {
  let best = 99;
  r.ing.forEach(g => findItems(g.m).forEach(it => { const d = daysLeft(it); if (d >= 0 && d < best) best = d; }));
  return best;
}
function score(r) {
  const u = recipeUrgency(r);
  return (Number(S.prefs[r.main]) || 0) * 2 + (Number(S.prefs[r.type]) || 0) + (u <= 3 ? .6 : 0);
}
const makeable = () => recipeCandidates().filter(canMake).sort((a, b) => score(b) - score(a));

function snapshot() { return JSON.stringify(S.inv); }
function restore(snap) { S.inv = JSON.parse(snap); }

function useRecipe(r) {
  const before = snapshot();
  const log = [];
  r.ing.forEach(g => {
    let need = g.a;
    for (const it of findItems(g.m).filter(item => daysLeft(item) >= 0)) {
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
function recipeConsumption(before, after) {
  const nextById = new Map(after.map(item => [item.id, item]));
  return before.filter(item => (nextById.get(item.id)?.qty ?? 0) < item.qty).map(item => ({
    ingredient_id: item.dbId,
    from_quantity: item.qty,
    to_quantity: nextById.get(item.id)?.qty ?? 0
  }));
}
const logLine = l => `${esc(l.name)}: ${qtyText(l.from, l.unit)} → ${l.to <= 0.001 ? 'used up' : qtyText(l.to, l.unit)}`;

function addItems(items) {
  items.forEach(n => {
    const same = S.inv.find(i => i.name.toLowerCase() === n.name.toLowerCase()
      && (i.brand || '').toLowerCase() === (n.brand || '').toLowerCase()
      && (i.productName || '').toLowerCase() === (n.productName || '').toLowerCase()
      && i.exp === n.exp && i.unit === n.unit);
    if (same) same.qty = Math.round((same.qty + n.qty) * 100) / 100;
    else S.inv.push({ id: 'i' + (uid++), name: n.name, brand: n.brand || '', productName: n.productName || '', emoji: n.emoji, cat: n.cat, qty: n.qty, unit: n.unit, exp: n.exp, store: n.store, src: n.src });
  });
}

function pantryRow(item) {
  return {
    ingredient_name: item.name, brand: item.brand || null, product_name: item.productName || null,
    quantity: item.qty, measurement: item.unit,
    food_type: item.cat, expiration_date: item.exp, status: statusFor(item.exp),
    storage_location: item.store, expiration_source: item.src
  };
}
async function persistPantryDiff(before, after) {
  if (!sb) return;
  const owner = S.user?.id;
  if (!owner) throw new Error('Sign in again before changing your pantry.');
  const generation = accountGeneration;
  const oldById = new Map(before.filter(i => i.dbId).map(i => [i.dbId, i]));
  const nextById = new Map(after.filter(i => i.dbId).map(i => [i.dbId, i]));
  for (const oldItem of before.filter(i => i.dbId)) {
    if (generation !== accountGeneration) throw new Error('Your account changed. Reload your pantry.');
    const nextItem = nextById.get(oldItem.dbId);
    if (!nextItem) {
      const { data, error } = await sb.from('pantry_item').delete()
        .eq('ingredient_id', oldItem.dbId).eq(OWNER_COLUMN, owner).select('ingredient_id');
      if (error) throw error;
      if (!data?.length) throw new Error(`${oldItem.name} could not be deleted. Apply the pantry delete policy migration and try again.`);
      continue;
    }
    const oldValues = pantryRow(oldItem), nextValues = pantryRow(nextItem);
    if (Object.keys(nextValues).every(key => oldValues[key] === nextValues[key])) continue;
    const { data, error } = await sb.from('pantry_item').update(nextValues)
      .eq('ingredient_id', oldItem.dbId).eq(OWNER_COLUMN, owner)
      .select('ingredient_id').maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`${oldItem.name} was not found in your account.`);
  }
  for (const item of after.filter(i => i.dbId && !oldById.has(i.dbId))) {
    if (generation !== accountGeneration) throw new Error('Your account changed. Reload your pantry.');
    const { data, error } = await sb.from('pantry_item').insert({
      ingredient_id: item.dbId, auth_user_id: owner, user_id: item.legacyUserId,
      ...pantryRow(item), way_added: item.wayAdded || 'manual'
    }).select('ingredient_id').maybeSingle();
    if (error) throw error;
    if (!data) throw new Error(`${item.name} could not be restored.`);
  }
}
async function applyPantryTransition(before, after) {
  if (!sb) { S.inv = after; return true; }
  const oldItems = JSON.parse(JSON.stringify(before));
  const generation = accountGeneration;
  try {
    await persistPantryDiff(oldItems, after);
    if (generation !== accountGeneration) return false;
    S.inv = after;
    sync = 'synced';
    return true;
  } catch (error) {
    if (generation !== accountGeneration) return false;
    S.inv = oldItems;
    sync = 'error';
    console.error('[MyPantry] pantry change failed', error);
    await loadPantry();
    toast(`Couldn't update your pantry: ${esc(error.message)}`, null, 'alert');
    return false;
  }
}
async function restorePantrySnapshot(snapshotText) {
  const before = JSON.parse(snapshot());
  const desired = JSON.parse(snapshotText);
  if (!await applyPantryTransition(before, desired)) return false;
  S.undo = null;
  render();
  return true;
}

let addingFood = false;
let pendingFoodAdd = null;
async function saveNewItems(items, mode = 'manual', trackAddition = true) {
  if (addingFood || !items.length) return false;
  if (!sb) { addItems(items); return true; }
  if (!S.user?.id) return false;
  const owner = S.user.id, generation = accountGeneration;
  const scan = S.scan;
  // Barcode review can save from either the item sheet or the review button.
  // Both controls belong to the same scan confirmation and share retry IDs.
  const flow = mode === 'manual' ? ($('#itemForm') || scan) : (scan || $('#itemForm'));
  addingFood = true;
  // Invalidate any older load that could overwrite the confirmed insert.
  ++pantryRequest;
  sync = 'saving';
  const buttons = $$('#saveItemBtn, [data-act="confirmScan"]');
  buttons.forEach(b => { b.disabled = true; });
  $('#dbErr')?.remove();
  try {
    const rows = items.map(i => ({
      auth_user_id: owner, ingredient_name: i.name, brand: i.brand || null, product_name: i.productName || null, quantity: i.qty,
      measurement: i.unit, food_type: i.cat, expiration_date: i.exp,
      storage_location: i.store, expiration_source: i.src,
      way_added: ({ pantry: 'pantry_photo', receipt: 'receipt', barcode: 'barcode' })[mode] || 'manual',
      status: statusFor(i.exp)
    }));
    // Keep the same event IDs when a response is lost and the user retries the
    // same confirmation. The database guarantees one pantry row per event ID.
    const fingerprint = trackAddition ? JSON.stringify({ owner, rows }) : null;
    if (trackAddition) {
      if (pendingFoodAdd?.fingerprint !== fingerprint || pendingFoodAdd.flow !== flow) {
        pendingFoodAdd = { fingerprint, flow, ids: rows.map(() => newUuid()) };
      }
      rows.forEach((row, index) => { row.addition_event_id = pendingFoodAdd.ids[index]; });
    }
    const { data, error } = await sb.from('pantry_item').insert(rows).select();
    if (generation !== accountGeneration) return false;
    if (error) throw error;
    if (!data || data.length !== items.length) throw new Error('The database did not confirm every ingredient. Reload before retrying.');
    if (trackAddition) pendingFoodAdd = null;
    S.inv.push(...data.map(rowToItem));
    sync = 'synced';
    if (trackAddition) void loadFoodAddedEvents();
    // A request can finish after the user navigates away. Keep the saved rows,
    // but do not replace their newer screen with the old scan completion.
    if (S.scan !== scan) { render(); return false; }
    return true;
  } catch (error) {
    if (generation !== accountGeneration) return false;
    if (trackAddition && pendingFoodAdd) {
      try {
        const { data: recorded, error: lookupError } = await sb.from('food_added_events')
          .select('event_id').eq('user_id', owner).in('event_id', pendingFoodAdd.ids);
        if (!lookupError && recorded?.length === items.length && generation === accountGeneration) {
          // A committed insert can lose its response. The event is written in
          // the same transaction, so its presence confirms the pantry insert.
          pendingFoodAdd = null;
          await loadPantry();
          void loadFoodAddedEvents();
          if (sync === 'synced') return S.scan === scan;
        }
      } catch (_) { /* Keep the original save error below. */ }
    }
    sync = 'error';
    const form = $('#itemForm');
    if (form) {
      const el = document.createElement('div'); el.className = 'err'; el.id = 'dbErr';
      el.textContent = `Couldn't save your ingredients. ${error.message}`;
      form.appendChild(el);
    }
    toast(`Couldn't save your ingredients. ${esc(error.message)}`, null, 'alert');
    return false;
  } finally {
    addingFood = false;
    buttons.forEach(b => { b.disabled = false; });
  }
}
function dupOf(item) {
  const name = String(item.name || '').trim().toLowerCase();
  const brand = String(item.brand || '').trim().toLowerCase();
  const productName = String(item.productName || '').trim().toLowerCase();
  if (!name) return [];
  return S.inv.filter(i => {
    if (i.unit !== item.unit) return false;
    const sameBrand = String(i.brand || '').trim().toLowerCase() === brand;
    const sameProduct = String(i.productName || '').trim().toLowerCase() === productName;
    if (brand && productName && sameBrand && sameProduct) return true;
    return i.name.trim().toLowerCase() === name
      && (!i.brand || !brand || sameBrand)
      && (!i.productName || !productName || sameProduct);
  }).sort(byExp);
}
function learn(r) {
  S.prefs[r.main] = (Number(S.prefs[r.main]) || 0) + 1;
  S.prefs[r.type] = (Number(S.prefs[r.type]) || 0) + 1;
  const el = $('#learnChip'); if (el) el.textContent = learnText();
  persist();
}
function learnText() {
  const top = Object.entries(S.prefs).filter(([, value]) => Number.isFinite(value))
    .sort((a, b) => b[1] - a[1]).slice(0, 2).map(e => e[0]);
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
  s.addEventListener('click', e => { if (e.target === s && !recipeUseInFlight) closeSheet(); });
  phone.appendChild(s);
  const f = s.querySelector('[autofocus]'); if (f) setTimeout(() => f.focus(), 60);
  return s;
}
function closeSheet() { const s = $('#scrim'); if (s) s.remove(); }

/* ---------- Render root ---------- */
let reelCtl = null;
const SWIPE_ACTION_WIDTH = 88;
let openSwipeRow = null;
let swipeGesture = null;
let suppressSwipeClick = null;
function closeSwipeRow(row = openSwipeRow) {
  if (!row) return;
  row.classList.remove('is-open', 'is-dragging');
  row.style.removeProperty('--swipe-x');
  const action = row.querySelector('.swipe-delete');
  if (action) action.hidden = true;
  if (openSwipeRow === row) openSwipeRow = null;
}
function revealSwipeRow(row) {
  if (openSwipeRow && openSwipeRow !== row) closeSwipeRow();
  const action = row.querySelector('.swipe-delete');
  if (action) action.hidden = false;
  row.classList.remove('is-dragging');
  row.style.removeProperty('--swipe-x');
  row.classList.add('is-open');
  openSwipeRow = row;
}
function resetSwipeInteraction() {
  swipeGesture = null;
  suppressSwipeClick = null;
  closeSwipeRow();
}
function cancelActiveSwipe() {
  const gesture = swipeGesture;
  swipeGesture = null;
  if (!gesture?.horizontal || !gesture.row.isConnected) return;
  if (gesture.wasOpen) revealSwipeRow(gesture.row);
  else closeSwipeRow(gesture.row);
}
function render() {
  resetSwipeInteraction();
  applyVisualTheme();
  unmountReels();
  syncDemoToolsVisibility();
  const wantsCamera = S.auth === 'app' && S.tab === 'scan' && S.scan?.stage === 'camera' && !isDemoAccount();
  if (!wantsCamera) stopCameraPreview();
  const wantsProfileCamera = S.auth === 'app' && S.tab === 'settings' && S.setPage === 'profile' && !!S.profileCamera;
  if (!wantsProfileCamera) stopProfileCamera();
  const keepScroll = $('.scroll', app)?.scrollTop || 0;
  const prevKey = app.dataset.key;
  let html = '';
  if (S.auth !== 'app') html = renderAuth();
  else html = renderApp();
  app.innerHTML = html;
  const key = S.auth + S.tab + (S.setPage || '') + (S.scan ? S.scan.stage : '');
  app.dataset.key = key;
  const dark = S.auth === 'app' && (reelsUseDarkChrome() || (S.tab === 'scan' && S.scan && ['camera', 'analyzing', 'error'].includes(S.scan.stage)));
  phone.classList.toggle('dark-chrome', dark);
  afterRender(prevKey === key ? keepScroll : 0);
}
function afterRender(scrollTop) {
  persist();
  const sc = $('.scroll', app);
  if (sc && scrollTop) sc.scrollTop = scrollTop;
  if (S.auth === 'app' && S.tab === 'home') { const cs = $('#chatScroll'); if (cs) cs.scrollTop = cs.scrollHeight; }
  if (S.auth === 'app' && S.tab === 'reels') mountReels();
  attachCameraPreview();
  attachProfileCamera();
  mountReceiptEditor();
  bindForms();
}

/* ===========================================================
   AUTH SCREENS
   =========================================================== */
function renderAuth() {
  const a = S.auth;
  if (a === 'loading') return '<div class="scroll"><div class="auth" role="status">Checking your sign-in…</div></div>';
  if (a === 'recovery') return `<div class="scroll"><form class="auth" id="recoveryForm">
    <h1>Choose a new password</h1><p>Use at least 8 characters and a symbol.</p>
    <div class="err" id="recoveryErr" hidden><span></span></div>
    <div class="field"><label for="new_pw">New password</label><input class="input" id="new_pw" type="password" autocomplete="new-password" required minlength="8"></div>
    <div class="field"><label for="new_pw2">Confirm password</label><input class="input" id="new_pw2" type="password" autocomplete="new-password" required></div>
    <button class="btn btn-primary" type="submit">Save password</button>
    <button class="btn btn-ghost" type="button" data-act="logout">Cancel and sign out</button>
  </form></div>`;
  if (a === 'login') return `<div class="scroll"><form class="auth" id="loginForm" novalidate>
    <div class="auth-hero">${LOGO}<h1>Know what's in your kitchen.</h1><p>Sign in to see what you have, what's going bad, and what to cook tonight.</p></div>
    <div class="err" id="loginErr" ${configError || S.authError ? '' : 'hidden'}>${ic('alert')}<span>${esc(configError || S.authError || '')}</span></div>
    <div class="field"><label for="li_email">Email</label><input class="input" id="li_email" type="email" autocomplete="username" placeholder="you@example.com" value="${esc(S.lastEmail || '')}"></div>
    <div class="field login-password">
      <div class="field-heading"><label for="li_pw">Password</label><button type="button" class="link" data-act="auth" data-arg="forgot">Forgot password?</button></div>
      <div class="pw-wrap"><input class="input" id="li_pw" aria-describedby="li_pw_hint" type="password" autocomplete="current-password" placeholder="Your password"><button type="button" data-act="showpw" data-arg="li_pw">Show</button></div>
      <span class="hint" id="li_pw_hint">New passwords require at least 8 characters and one symbol (e.g., ! or #).</span>
    </div>
    <button class="btn btn-primary" type="submit">Sign in</button>
    <button class="btn btn-auth-secondary" type="button" data-act="auth" data-arg="signup">Create an account</button>
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
    <div class="field"><label for="su_name">First name</label><input class="input" id="su_name" type="text" autocomplete="given-name" enterkeyhint="next" placeholder="Karen"></div>
    <div class="field"><label for="su_email">Email</label><input class="input" id="su_email" type="email" autocomplete="email" enterkeyhint="next" placeholder="you@example.com"><span class="field-err" id="su_emailErr" hidden>Enter a valid email, like name@example.com.</span></div>
    <div class="field"><label for="su_pw">Password</label><div class="pw-wrap"><input class="input" id="su_pw" aria-describedby="su_pw_hint" type="password" autocomplete="new-password" enterkeyhint="next" placeholder="Create a password"><button type="button" data-act="showpw" data-arg="su_pw">Show</button></div><span class="hint" id="su_pw_hint">Use at least 8 characters and one symbol (e.g., ! or #).</span></div>
    <div class="field"><label for="su_pw2">Confirm password</label><input class="input" id="su_pw2" type="password" autocomplete="new-password" enterkeyhint="go" placeholder="Type it again"></div>
    <ul class="pw-rules" id="pwRules">
      <li data-rule="len">At least 8 characters</li>
      <li data-rule="sym">Includes a symbol, like ! # $ or %</li>
      <li data-rule="match">Both passwords match</li>
    </ul>
    <div class="auth-submit-bar">
      <button class="btn btn-primary" type="submit" id="suBtn" disabled>Create account</button>
      <div class="auth-foot">Already have an account? <button type="button" class="link" data-act="auth" data-arg="login">Sign in</button></div>
    </div>
  </form></div>`;

  if (a === 'verify') return `<div class="scroll"><div class="auth">
    <div class="big-illus">📬</div>
    <div class="center" style="display:grid;gap:8px"><h1 style="font-size:26px">Check your email</h1><p style="margin:0;color:var(--ink-2)">We sent a confirmation link to <b>${esc(S.signupEmail)}</b>. Open it to finish setting up your account.</p></div>
    <button class="btn btn-ghost" data-act="auth" data-arg="login">Back to sign in</button>
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
  const photoWorking = ['receipt', 'pantry'].includes(S.scan?.mode) && S.scan?.stage === 'analyzing' && S.scan?.inAppBackground;
  const cam = (S.tab === 'scan' && S.scan && ['camera', 'analyzing', 'error'].includes(S.scan.stage) && !photoWorking) ? renderCamera() : '';
  return `<div class="view page-content page-${S.tab}">${scanStatusBanner()}${body}</div>${tabbar()}${cam}`;
}
function scanStatusBanner() {
  const sc = S.scan;
  if (!sc?.inAppBackground || !['receipt', 'pantry'].includes(sc.mode) || S.tab === 'scan') return '';
  const pantry = sc.mode === 'pantry';
  const label = pantry ? 'pantry photo' : 'receipt';
  if (sc.stage === 'analyzing') return `<div class="receipt-status processing" role="status" aria-live="polite">
    <span class="receipt-status-spinner" aria-hidden="true"></span><span><b>${pantry ? 'Finding food in your photo…' : 'Reading your receipt…'}</b><small>You can keep using MyPantry.</small></span>
  </div>`;
  if (sc.stage === 'review') return `<div class="receipt-status ready" role="status" aria-live="polite">
    ${ic('check')}<span><b>${pantry ? 'Pantry photo processed' : 'Receipt processed'}</b><small>${plural(sc.items.length, 'item')} ready to review.</small></span><button data-act="receiptStatus">Review contents</button>
  </div>`;
  if (sc.stage === 'error') return `<div class="receipt-status failed" role="status" aria-live="polite">
    ${ic('alert')}<span><b>${pantry ? 'Pantry photo wasn’t processed' : 'Receipt wasn’t processed'}</b><small>${esc(sc.error || `Open the scanner to try the ${label} again.`)}</small></span><button data-act="receiptStatus">View options</button>
  </div>`;
  return '';
}
function tabbar() {
  const urgent = S.inv.filter(i => daysLeft(i) <= 2).length;
  const t = (id, label, icon) => `<button class="tab ${S.tab === id ? 'active' : ''}" data-act="tab" data-arg="${id}" aria-label="${label}" ${S.tab === id ? 'aria-current="page"' : ''}>
      <span class="tab-ic">${ic(icon)}${id === 'ing' && urgent ? `<span class="badge">${urgent}</span>` : ''}</span>${label}</button>`;
  return `<nav class="tabbar ${reelsUseDarkChrome() ? 'on-dark' : ''}" aria-label="Main">
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
  return `<div class="chat-head"><div class="bot-av">${ic('spark')}</div><div><h1>Pantry Pal</h1><div class="sub">AI assistant · history saved to your account</div></div>
      <button class="icon-btn" data-act="newChat" aria-label="Start a new chat">${ic('refresh')}</button></div>
    <div class="scroll" id="chatScroll"><div class="chat" id="chat" aria-live="polite">${S.chat.map(m => `<div class="msg ${m.who}">${m.html}</div>`).join('')}</div></div>
    <div class="chips" aria-label="Suggestions"><button class="chip" data-act="deals">🛒 Shop ideas</button><button class="chip" data-act="aiRecipeUseStart">🍳 Log a recipe I made</button>${SUGGEST.map(s => `<button class="chip" data-act="ask" data-arg="${esc(s)}">${esc(s)}</button>`).join('')}</div>
    <form class="composer" id="chatForm"><textarea class="input" id="chatIn" rows="1" maxlength="2000" placeholder="Ask about your food or recipes…" aria-label="Message"></textarea><button class="send" type="submit" aria-label="Send">${ic('send')}</button></form>`;
}
function pushMsg(who, html) {
  ++chatRevision;
  S.chat.push({ who, html });
  saveChatMessage(who, html);
  const chat = $('#chat'); if (!chat) return;
  const d = document.createElement('div'); d.className = 'msg ' + who; d.innerHTML = html; chat.appendChild(d);
  const cs = $('#chatScroll'); cs.scrollTop = cs.scrollHeight;
}
let chatRequest = null;
let chatHistory = [];
function resetAIChat() {
  if (chatRequest) chatRequest.abort();
  chatRequest = null; chatHistory = [];
}
function chatTextFromHtml(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  return template.content.textContent.replace(/\s+/g, ' ').trim();
}
function pantryRemovalTarget(text) {
  const match = text.match(/^(?:please\s+)?(?:delete|remove)\s+(.+?)(?:\s+from\s+(?:my|the)\s+(?:pantry|inventory|ingredients))?[.!]?$/i);
  return match ? match[1].replace(/^the\s+/i, '').trim() : null;
}
function proposeChatRemoval(target) {
  const items = S.inv.filter(i => i.name.trim().toLowerCase() === target.toLowerCase());
  if (!items.length) {
    pushMsg('bot', '<p>I couldn’t find an exact match. Use the full item name shown in Ingredients.</p>');
    return;
  }
  if (items.length > 1) {
    pushMsg('bot', '<p>There’s more than one item with that name. Open Ingredients to choose the right entry.</p>');
    return;
  }
  const item = items[0];
  openSheet(`<div class="sheet-head"><h2>Remove pantry item?</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
    <div class="sheet-body"><p>Remove ${esc(item.name)} (${esc(qtyText(item.qty, item.unit))}) from your ${esc(item.store.toLowerCase())}?</p></div>
    <div class="sheet-foot"><button class="btn btn-danger" data-act="chatRemoveConfirm" data-arg="${esc(item.id)}">Remove item</button>
      <button class="btn btn-ghost" data-act="closeSheet">Cancel</button></div>`);
}
async function ask(text) {
  text = text.trim();
  if (!text || chatRequest) return;
  if (text.length > 2000) { toast('Keep messages under 2,000 characters.'); return; }
  pushMsg('user', `<p>${esc(text)}</p>`);
  const removal = pantryRemovalTarget(text);
  if (removal) { proposeChatRemoval(removal); return; }
  const generation = accountGeneration;
  const controller = new AbortController(); chatRequest = controller;
  const typing = document.createElement('div'); typing.className = 'msg bot typing';
  typing.innerHTML = '<i></i><i></i><i></i>'; $('#chat')?.appendChild(typing);
  const button = $('#chatForm button'); if (button) button.disabled = true;
  const timer = setTimeout(() => controller.abort(), 55000);
  try {
    const { data, error } = await sb.auth.getSession();
    if (error || !data.session?.access_token) throw new Error('Please sign in again to chat.');
    const response = await fetch(`${CFG.supabaseUrl}/functions/v1/pantry-chat`, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', apikey: CFG.supabaseKey,
        Authorization: `Bearer ${data.session.access_token}` },
      body: JSON.stringify({ message: text, history: chatHistory.slice(-10), allergies: allergyList() })
    });
    const result = await response.json();
    if (!response.ok || typeof result.answer !== 'string') throw new Error(result.error || 'Chat is unavailable. Please try again.');
    if (generation !== accountGeneration || chatRequest !== controller) return;
    chatHistory.push({ role: 'user', content: text }, { role: 'assistant', content: result.answer.slice(0,2000) });
    chatHistory = chatHistory.slice(-10);
    pushMsg('bot', `<p>${esc(result.answer).replace(/\n/g, '<br>')}</p>`);
  } catch (error) {
    if (generation === accountGeneration && chatRequest === controller) pushMsg('bot', `<p>${esc(error.name === 'AbortError' ? 'The request timed out. Please try again.' : error.message)}</p>`);
  } finally {
    clearTimeout(timer); typing.remove();
    if (chatRequest === controller) { chatRequest = null; const send = $('#chatForm button'); if (send) send.disabled = false; }
  }
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
    <div class="btns"><button class="btn btn-ghost" data-act="recipe" data-arg="${r.id}" data-source="ai">View recipe</button>${opts.sub ? '' : `<button class="btn btn-soft" data-act="useAsk" data-arg="${r.id}" data-source="ai">I made this</button>`}</div></div>`;
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
const CUISINES = { chinese: 'Chinese', asian: 'Chinese', 'stir fry': 'Chinese', italian: 'Italian', pasta: 'Italian', mexican: 'Mexican', taco: 'Mexican', breakfast: 'Breakfast', brunch: 'Breakfast', american: 'American', comfort: 'American', japanese: 'Japanese', sushi: 'Japanese', thai: 'Thai', indian: 'Indian', greek: 'Greek', korean: 'Korean' };

async function reply(text) {
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
    const before = snapshot();
    const log = useRecipe(r);
    if (!await applyPantryTransition(JSON.parse(before), JSON.parse(snapshot()))) {
      return '<p>I couldn\'t update your pantry, so I left the food amounts unchanged. Please try again.</p>';
    }
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
        const verdict = d < 0 ? `passed its listed date on ${fmtDate(i.exp)}. Check storage guidance before using it.` : `has a listed date of ${fmtDate(i.exp)}. A date alone cannot confirm food safety.`;
        return `<p>${i.emoji || '📦'} <b>${esc(i.name)}</b> (${qtyText(i.qty, i.unit)}) ${verdict}</p>`;
      }).join('')}${found.length > 1 ? '<p>Use the one that spoils first.</p>' : ''}${found.some(i => daysLeft(i) < 0) ? `<div class="actions"><button class="btn btn-danger btn-sm" data-act="removeItem" data-arg="${found.find(i => daysLeft(i) < 0).id}">Remove the spoiled one</button></div>` : ''}`;
    }
    if (!/(going|about|soon|what)/.test(t)) return `<p>I don't see ${esc(term || 'that')} in your pantry. Want to log it? Tap Scan below.</p>`;
  }

  if (/(do i have|do we have|have any|got any|any .* left|how much|how many|is there|should i buy|need to buy|am i out)/.test(t)) {
    const term = termFrom(t.replace(/(do i have|do we have|have any|got any|how much|how many|is there|should i buy|need to buy|am i out of)/g, ''));
    const found = lookup(term);
    if (found.length) {
      const total = found.map(i => `${qtyText(i.qty, i.unit)} (listed date ${fmtDate(i.exp)})`).join(' and ');
      const allPastDate = found.every(i => daysLeft(i) < 0);
      return `<p>${found[0].emoji || '📦'} Your pantry lists <b>${esc(found[0].name)}</b>: ${total}.</p><p>${allPastDate ? 'All matching items passed their listed dates. Check them before using or buying replacements.' : 'Check quantities and dates before deciding whether to buy more.'}</p>`;
    }
    return `<p>I don't see <b>${esc(term || 'that')}</b> on your pantry list. Check at home before buying more.</p><div class="actions"><button class="btn btn-ghost btn-sm" data-act="deals">See shop ideas</button></div>`;
  }

  if (/(expir|going bad|spoil|go bad|use up|use first|about to|going off)/.test(t)) {
    const soon = S.inv.filter(i => daysLeft(i) <= 7).sort(byExp);
    if (!soon.length) return '<p>Good news: nothing in your pantry goes bad in the next 7 days.</p>';
    const ids = new Set(soon.filter(i => daysLeft(i) >= 0 && daysLeft(i) <= 3).map(i => i.name.toLowerCase()));
    const recs = makeable().filter(r => r.ing.some(g => [...ids].some(n => altsOf(g.m).some(k => n.includes(k))))).slice(0, 2);
    const spoiled = soon.filter(i => daysLeft(i) < 0);
    return `<p>These go bad soonest. Use the top ones first:</p>${expList(soon.slice(0, 6))}
      ${spoiled.length ? `<p>${esc(spoiled.map(i => i.name).join(', '))} already passed ${spoiled.length > 1 ? 'their dates' : 'its date'}. Check ${spoiled.length > 1 ? 'them' : 'it'} before eating.</p>` : ''}
      ${recs.length ? `<p>Easy recipes that use them:</p>${recs.map(r => rcard(r)).join('')}` : ''}`;
  }

  const cKey = Object.keys(CUISINES).find(k => t.includes(k));
  if (cKey) {
    const type = CUISINES[cKey];
    const list = makeable().filter(r => r.type === type);
    const near = recipeCandidates().filter(r => r.type === type && canMakeWithSub(r));
    const missing = recipeCandidates().filter(r => r.type === type && !canMake(r) && !canMakeWithSub(r));
    if (list.length || near.length) {
      return `<p>${type} tonight, got it. ${list.length ? `You can make ${list.length === 1 ? 'this' : 'these'} with what you have:` : ''}</p>${list.slice(0, 3).map(r => rcard(r)).join('')}${near.map(subBlock).join('')}`;
    }
    const alt = makeable().slice(0, 2);
    const m = missing[0];
    return `<p>I couldn't find an easy ${type} recipe you can make with your food right now.${m ? ` ${esc(m.name)} needs ${esc(missingOf(m).map(g => ingName(g.m)).join(' and '))}.` : ''}</p>${alt.length ? `<p>Here's what you can make tonight instead:</p>${alt.map(r => rcard(r)).join('')}` : ''}`;
  }

  if (/(hard|fancy|complicated|gourmet|impressive)/.test(t)) {
    return `<p>I keep things simple on purpose. Every recipe I suggest takes 30 minutes or less and uses food you already have. Here's the quickest one right now:</p>${makeable().sort((a, b) => a.time - b.time).slice(0, 1).map(r => rcard(r)).join('')}`;
  }

  if (/(recipe|make|cook|dinner|lunch|eat|hungry|idea|meal|tonight|supper|snack|kids)/.test(t)) {
    const list = makeable();
    if (!list.length) return '<p>You don\'t have enough ingredients to make anything yet. Try adding more food to your pantry.</p>';
    const byUrg = [...list].sort((a, b) => recipeUrgency(a) - recipeUrgency(b));
    const near = recipeCandidates().filter(canMakeWithSub).slice(0, 1);
    return `<p>Here are easy meals you can make right now. I put the ones that use food going bad first:</p>${byUrg.slice(0, 3).map(r => rcard(r)).join('')}${near.map(subBlock).join('')}`;
  }

  if (/^(hi|hello|hey|yo|good (morning|afternoon|evening))\b/.test(t)) return `<p>Hi ${esc(firstName())}! Ask me what's going bad, what to cook, or whether you already have something before you buy it.</p>`;
  if (/(help|what can you do|how do i|how does)/.test(t)) return `<p>I can help you:</p><ul><li>See what's going bad and use it first</li><li>Find easy recipes with food you already have</li><li>Check if you have something before you buy it</li><li>Update your pantry when you cook ("I made tacos")</li><li>Clear your inventory when you want to start over</li></ul>`;
  if (/thank/.test(t)) return '<p>Anytime! Happy cooking.</p>';

  return `<p>I'm not sure I understood that. Try asking:</p><div class="actions">${['What can I make for dinner?', "What's going bad?", 'Do I have eggs?'].map(s => `<button class="btn btn-ghost btn-sm" data-act="ask" data-arg="${esc(s)}">${s}</button>`).join('')}</div>`;
}
function subBlock(r) {
  const miss = missingOf(r)[0];
  const substitution = safeSubstitution(r, miss);
  return substitution ? `<div class="sub-card"><b>Almost there: ${esc(r.name)}</b><br>You're missing ${esc(miss.m)}. ${esc(substitution.text)}</div>${rcard(r, { sub: true })}` : '';
}

/* ===========================================================
   INGREDIENTS
   =========================================================== */
const WASTE_REASONS = { spoiled: 'Spoiled', past_date: 'Past its date', unused: 'No longer needed', other: 'Other' };
const wasteNumber = value => value !== 0 && Math.abs(value) < 0.000001
  ? Number(value).toExponential(2)
  : new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
function wasteDisplay(quantity, unit) {
  if (S.metric && CONV[unit]) {
    const [shownUnit, factor] = CONV[unit];
    const converted = Number(quantity) * factor;
    return [Math.round(converted * 10000) / 10000 || converted, shownUnit];
  }
  return [Number(quantity), unit];
}
function wasteQtyText(quantity, unit) {
  const [value, shownUnit] = wasteDisplay(quantity, unit);
  return `${wasteNumber(value)} ${shownUnit === 'ct' ? 'count' : shownUnit}`;
}
function wasteMonthEvents() {
  const now = new Date();
  return S.wasteEvents.filter(event => {
    const date = new Date(event.occurred_at);
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  });
}
function wasteAmounts(events) {
  let grams = 0, milliliters = 0;
  const other = new Map();
  for (const event of events) {
    const quantity = Number(event.quantity), unit = event.measurement;
    if (!(quantity > 0)) continue;
    if (unit === 'g') grams += quantity;
    else if (unit === 'kg') grams += quantity * 1000;
    else if (unit === 'oz') grams += quantity * 28.35;
    else if (unit === 'lb') grams += quantity * 453.6;
    else if (unit === 'mL') milliliters += quantity;
    else if (unit === 'L') milliliters += quantity * 1000;
    else if (unit === 'fl oz') milliliters += quantity * 29.57;
    else if (unit === 'gal') milliliters += quantity * 3785;
    else other.set(unit, (other.get(unit) || 0) + quantity);
  }
  const amounts = [];
  if (grams) amounts.push(S.metric
    ? grams >= 1000 ? `${wasteNumber(grams / 1000)} kg` : `${wasteNumber(grams)} g`
    : grams >= 453.6 ? `${wasteNumber(grams / 453.6)} lb` : `${wasteNumber(grams / 28.35)} oz`);
  if (milliliters) amounts.push(S.metric
    ? milliliters >= 1000 ? `${wasteNumber(milliliters / 1000)} L` : `${wasteNumber(milliliters)} mL`
    : milliliters >= 3785 ? `${wasteNumber(milliliters / 3785)} gal` : `${wasteNumber(milliliters / 29.57)} fl oz`);
  for (const [unit, amount] of other) amounts.push(`${wasteNumber(amount)} ${unit === 'ct' ? 'count' : unit}`);
  return amounts;
}
function wasteCard() {
  const events = wasteMonthEvents();
  const amounts = wasteAmounts(events);
  const label = S.wasteStatus === 'loading' ? 'Loading waste history…'
    : S.wasteStatus === 'error' ? 'Couldn’t load waste history'
      : events.length ? `${plural(events.length, 'report')} this month` : 'No waste logged this month';
  const detail = S.wasteStatus === 'synced' && amounts.length
    ? `${esc(amounts.slice(0, 2).join(' · '))}${amounts.length > 2 ? ` · +${amounts.length - 2} more` : ''}`
    : 'Track what gets thrown away';
  return `<button class="waste-card" data-act="wasteHistory" aria-label="Food waste, ${esc(label)}. View history">
    <span class="waste-card-head"><span class="waste-card-title">Food waste</span><span class="waste-card-link">View history ›</span></span>
    <span class="waste-card-count">${esc(label)}</span><span class="waste-card-amount">${detail}</span>
  </button>`;
}
function wasteHistorySheet() {
  const events = wasteMonthEvents(), amounts = wasteAmounts(events);
  const intro = S.wasteStatus === 'loading' ? '<div class="waste-empty">Loading waste history…</div>'
    : S.wasteStatus === 'error' ? '<div class="waste-empty">Waste history could not be loaded. Try again.</div><button class="btn btn-soft" data-act="wasteRetry">Try again</button>'
      : `<div class="waste-empty">${events.length ? `${plural(events.length, 'report')} this month${amounts.length ? ` · ${esc(amounts.join(' · '))}` : ''}` : 'No waste logged this month'}</div>`;
  const rows = S.wasteEvents.map(event => `<div class="waste-row">
    <div class="waste-row-main"><span class="waste-row-name">${esc(event.ingredient_name)}</span>
      <span class="waste-row-meta">${esc(WASTE_REASONS[event.reason] || 'Other')} · ${esc(new Date(event.occurred_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }))}</span></div>
    <span class="waste-row-qty">${esc(wasteQtyText(event.quantity, event.measurement))}</span>
  </div>`).join('');
  return `<div class="sheet-head"><h2>Food waste</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
    <div class="sheet-body" id="wasteHistorySheet"><p>Amounts are grouped by weight, volume, and item type.</p>${intro}
      ${S.wasteStatus === 'synced' ? rows ? `<div class="waste-list">${rows}</div>` : '<div class="waste-empty">No food waste has been logged yet. Open an ingredient to log what you threw away.</div>' : ''}</div>`;
}
function foodAddedCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
function foodAddedSelectedMonth() {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(S.foodAddedMonth || '') ? S.foodAddedMonth : foodAddedCurrentMonth();
}
function foodAddedMonthLabel(month) {
  const [year, number] = month.split('-').map(Number);
  return new Date(year, number - 1, 1).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}
function foodAddedMonthEvents(month = foodAddedSelectedMonth()) {
  const [year, number] = month.split('-').map(Number);
  return (S.foodAddedEvents || []).filter(event => {
    const added = new Date(event.added_at);
    return added.getFullYear() === year && added.getMonth() + 1 === number;
  });
}
function foodAddedShiftMonth(offset) {
  const [year, number] = foodAddedSelectedMonth().split('-').map(Number);
  const target = new Date(year, number - 1 + offset, 1);
  const next = `${target.getFullYear()}-${String(target.getMonth() + 1).padStart(2, '0')}`;
  S.foodAddedMonth = next > foodAddedCurrentMonth() ? foodAddedCurrentMonth() : next;
  openSheet(foodAddedHistorySheet());
}
const foodAddedSourceLabel = source => ({ manual: 'Manual entry', barcode: 'Barcode scan', receipt: 'Receipt scan', pantry_photo: 'Pantry photo' })[source] || 'Food added';
function foodAddedCard() {
  const month = foodAddedCurrentMonth(), label = foodAddedMonthLabel(month);
  const count = foodAddedMonthEvents(month).length, total = (S.foodAddedEvents || []).length;
  const ready = S.foodAddedStatus === 'synced';
  const summary = S.foodAddedStatus === 'loading' ? 'Loading food history…'
    : S.foodAddedStatus === 'error' ? 'Couldn’t load food history'
      : `${plural(count, 'addition')} in ${label}`;
  const lifetime = ready ? `${plural(total, 'addition')} since tracking began` : 'Track confirmed food additions';
  return `<button class="waste-card food-added-card" data-act="foodAddedHistory" aria-label="Food added, ${esc(summary)}. ${esc(lifetime)}. View history">
    <span class="waste-card-head"><span class="waste-card-title">Food added</span><span class="waste-card-link">View history ›</span></span>
    <span class="food-added-stats"><span class="food-added-month">${esc(summary)}</span><span class="food-added-lifetime">${esc(lifetime)}</span></span>
  </button>`;
}
function foodAddedHistorySheet() {
  const month = foodAddedSelectedMonth(), label = foodAddedMonthLabel(month);
  const events = foodAddedMonthEvents(month).slice().sort((a, b) => Date.parse(b.added_at) - Date.parse(a.added_at));
  const current = month === foodAddedCurrentMonth();
  const status = S.foodAddedStatus === 'loading' ? '<div class="waste-empty">Loading food history…</div>'
    : S.foodAddedStatus === 'error' ? '<div class="waste-empty">Food history could not be loaded. Try again.</div><button class="btn btn-soft" data-act="foodAddedRetry">Try again</button>'
      : `<div class="food-added-totals"><b>${plural(events.length, 'addition')} in ${esc(label)}</b><span>${plural((S.foodAddedEvents || []).length, 'addition')} since tracking began</span></div>`;
  const rows = events.map(event => {
    const identity = [event.brand, event.product_name].filter(Boolean).map(esc).join(' · ');
    const quantity = Number(event.quantity);
    const amount = Number.isFinite(quantity) && quantity > 0 && event.measurement
      ? qtyText(quantity, event.measurement) : 'Amount unavailable';
    const addedAt = new Date(event.added_at);
    const date = Number.isNaN(addedAt.getTime()) ? 'Date unavailable'
      : addedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    return `<div class="waste-row food-added-row">
      <div class="waste-row-main"><span class="waste-row-name">${esc(event.ingredient_name || 'Food item')}</span>
        ${identity ? `<span class="waste-row-meta">${identity}</span>` : ''}
        <span class="waste-row-meta">${esc(foodAddedSourceLabel(event.way_added))} · ${esc(date)}</span></div>
      <span class="waste-row-qty">${esc(amount)}</span>
    </div>`;
  }).join('');
  return `<div class="sheet-head"><h2>Food added</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
    <div class="sheet-body" id="foodAddedHistorySheet"><p>Each confirmed new pantry entry counts as one addition, even if you entered several boxes or bags. The amount is shown beside each entry. Additions stay in this history after food is used or removed. History starts when tracking was enabled.</p>
      <div class="food-added-month-nav"><button type="button" data-act="foodAddedMonthPrev" aria-label="Previous month">‹</button>
        <span aria-live="polite">${esc(label)}</span>
        <button type="button" data-act="foodAddedMonthNext" aria-label="Next month" ${current ? 'disabled' : ''}>›</button></div>
      ${current ? '' : '<button class="food-added-current" data-act="foodAddedMonthCurrent">Back to this month</button>'}
      ${status}${S.foodAddedStatus === 'synced' ? rows ? `<div class="waste-list">${rows}</div>` : `<div class="waste-empty">No additions were logged in ${esc(label)}.</div>` : ''}</div>`;
}
function recipeUsesThisMonth() {
  const now = new Date();
  return S.recipeUseEvents.filter(event => {
    const used = new Date(event.used_at);
    return used.getFullYear() === now.getFullYear() && used.getMonth() === now.getMonth();
  });
}
function recipeUseCard() {
  const events = recipeUsesThisMonth();
  const reels = events.filter(event => event.source === 'reels').length;
  const ai = events.length - reels;
  const count = S.recipeUseStatus === 'loading' ? 'Loading recipe history…'
    : S.recipeUseStatus === 'error' ? 'Couldn’t load recipe history'
      : `${plural(events.length, 'recipe')} made this month`;
  const detail = S.recipeUseStatus === 'synced'
    ? `${reels} from Reels · ${ai} from Pantry Pal` : 'Track meals you actually made';
  return `<button class="waste-card recipe-use-card" data-act="recipeUseHistory" aria-label="Recipes made, ${esc(count)}. View history">
    <span class="waste-card-head"><span class="waste-card-title">Recipes made</span><span class="waste-card-link">View history ›</span></span>
    <span class="waste-card-count">${esc(count)}</span><span class="waste-card-amount">${esc(detail)}</span>
  </button>`;
}
function recipeUseHistorySheet() {
  const events = recipeUsesThisMonth();
  const reels = events.filter(event => event.source === 'reels').length;
  const ai = events.length - reels;
  const allReels = S.recipeUseEvents.filter(event => event.source === 'reels').length;
  const allAi = S.recipeUseEvents.length - allReels;
  const intro = S.recipeUseStatus === 'loading' ? '<div class="waste-empty">Loading recipe history…</div>'
    : S.recipeUseStatus === 'error' ? '<div class="waste-empty">Recipe history could not be loaded. Try again.</div><button class="btn btn-soft" data-act="recipeUseRetry">Try again</button>'
      : `<div class="waste-empty">${plural(events.length, 'recipe')} this month: ${reels} Reels · ${ai} Pantry Pal<br>${S.recipeUseEvents.length} total: ${allReels} Reels · ${allAi} Pantry Pal</div>`;
  const rows = S.recipeUseEvents.map(event => `<div class="waste-row recipe-use-row">
    <div class="waste-row-main"><span class="waste-row-name">${esc(event.recipe_name)}</span>
      <span class="waste-row-meta">${event.source === 'reels' ? 'Reels' : 'Pantry Pal'} · ${esc(new Date(event.used_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }))}</span></div>
    <button class="recipe-use-remove" data-act="recipeUseRemoveAsk" data-arg="${esc(event.event_id)}" aria-label="Remove ${esc(event.recipe_name)} from recipe history">Remove</button>
  </div>`).join('');
  return `<div class="sheet-head"><h2>Recipes made</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
    <div class="sheet-body" id="recipeUseHistorySheet"><p>Only recipes you confirm as made count here. Viewing, liking, or saving a recipe does not count.</p>
      ${intro}<button class="btn btn-soft" data-act="aiRecipeUseStart">Log a Pantry Pal recipe</button>
      ${S.recipeUseStatus === 'synced' ? rows ? `<div class="waste-list">${rows}</div>` : '<div class="waste-empty">No recipes logged yet. Make a Reel recipe or log one from Pantry Pal.</div>' : ''}</div>`;
}
function aiRecipeUseSheet() {
  return `<div class="sheet-head"><h2>Log a Pantry Pal recipe</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
    <form class="sheet-body" id="aiRecipeUseForm" novalidate>
      <p>Did you make a recipe Pantry Pal suggested? Enter its name to add one use to your tracker.</p>
      <div class="field"><label for="aiRecipeName">Recipe name</label><input class="input" id="aiRecipeName" maxlength="120" placeholder="e.g. Egg fried rice" autocomplete="off" autofocus>
        <span class="field-err" id="aiRecipeNameErr" hidden>Enter a recipe name.</span>
        <span class="field-err" id="aiRecipeSaveErr" hidden>Couldn’t save this recipe. Please try again.</span></div>
      <p class="hint">Pantry Pal ideas are free-form, so this log does not remove ingredients automatically. Update their amounts in Ingredients if needed.</p>
    </form><div class="sheet-foot"><button class="btn btn-primary" data-act="aiRecipeUseSave" id="aiRecipeUseSaveBtn">Log recipe made</button>
      <button class="btn btn-ghost" data-act="closeSheet">Cancel</button></div>`;
}
function recipeUseRemoveSheet(event) {
  return `<div class="sheet-head"><h2>Remove recipe entry?</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
    <div class="sheet-body"><p>Remove <b>${esc(event.recipe_name)}</b> from your recipe count? This will not change your Ingredients.</p></div>
    <div class="sheet-foot"><button class="btn btn-danger" data-act="recipeUseRemoveConfirm" data-arg="${esc(event.event_id)}" id="recipeUseRemoveBtn">Remove entry</button>
      <button class="btn btn-ghost" data-act="recipeUseHistory">Cancel</button></div>`;
}
function wasteForm(it) {
  const [quantity, unit] = wasteDisplay(it.qty, it.unit);
  return `<div class="sheet-head"><h2>Log food waste</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
    <form class="sheet-body" id="wasteForm" data-id="${esc(it.id)}" novalidate>
      <p>How much ${esc(it.name)} did you throw away? We’ll remove that amount from Ingredients and save it to your waste history.</p>
      <div class="field"><label for="wasteQty">Amount wasted (${esc(unit === 'ct' ? 'count' : unit)})</label>
        <input class="input num" id="wasteQty" type="number" min="0" max="${quantity}" step="any" inputmode="decimal" value="${quantity}" autofocus>
        <span class="field-err" id="wasteQtyErr" hidden>Enter an amount greater than zero and no more than ${quantity}.</span></div>
      <div class="field"><label for="wasteReason">Why was it wasted?</label><select class="input" id="wasteReason">
        <option value="">Choose a reason</option>${Object.entries(WASTE_REASONS).map(([code, label]) => `<option value="${code}">${label}</option>`).join('')}</select>
        <span class="field-err" id="wasteReasonErr" hidden>Choose a reason.</span></div>
    </form><div class="sheet-foot"><button class="btn btn-primary" data-act="wasteSave" id="wasteSaveBtn">Save waste</button>
      <button class="btn btn-ghost" data-act="closeSheet">Cancel</button></div>`;
}
function openWasteForm(it) {
  openSheet(wasteForm(it));
  $('#wasteForm').addEventListener('submit', event => { event.preventDefault(); ACT.wasteSave(); });
}
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
  } else {
    content = `<div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${P.search}</svg><input class="input" id="ingSearch" placeholder="Search your food" value="${esc(S.ingQuery)}" aria-label="Search your food"></div>
      <div class="chips cat-chips">${['All', ...CATS].map(c => `<button class="chip ${S.ingCat === c ? 'on' : ''}" data-act="ingCat" data-arg="${c}">${c}</button>`).join('')}</div>
      <p class="swipe-hint">Swipe left on an ingredient to delete it.</p>
      <div id="ingList">${S.ingView === 'soon' ? renderSoon() : ingListHtml()}</div>`;
  }
  return `<div class="appbar"><div><h1>Ingredients</h1><div class="sub">${plural(n, 'item')} in your kitchen</div></div>${syncChip()}</div>
    ${n ? `<div class="seg" role="tablist"><button role="tab" class="${S.ingView === 'all' ? 'on' : ''}" data-act="ingView" data-arg="all">All items</button><button role="tab" class="${S.ingView === 'soon' ? 'on' : ''}" data-act="ingView" data-arg="soon">Going bad soon ${soonCount ? `<span class="count">${soonCount}</span>` : ''}</button></div>` : ''}
    <div class="scroll">${foodAddedCard()}${wasteCard()}${recipeUseCard()}${content}<div style="height:90px"></div></div>
    <button class="fab" data-act="tab" data-arg="scan">${ic('plus')} Add food</button>`;
}
function syncChip() {
  if (sync === 'synced') return '';
  const m = { loading: ['Loading…', 'soon'], saving: ['Saving…', 'soon'], synced: ['Saved in database', 'fresh'], error: ['Save/load failed', 'now'], offline: ['Offline demo', 'soon'] }[sync];
  return `<span class="pill ${m[1]}" id="syncChip" title="${sb ? 'Pantry is stored in Supabase' : 'No Supabase config found; changes stay in this browser'}">${m[0]}</span>`;
}
function itemRow(i) {
  return `<div class="swipe-item" data-swipe-id="${esc(i.id)}"><button class="item swipe-item-main" data-act="edit" data-arg="${esc(i.id)}" aria-label="Open ${esc(i.name)} to edit or delete">
    ${imgHtml(i)}
    <span><span class="name">${esc(i.name)}</span><br><span class="qty num">${qtyText(i.qty, i.unit)} · ${i.store}</span>
      <span class="date num">${i.src === 'label' ? ic('tag') : ic('spark')} ${spoilText(i)}${i.src === 'ai' ? ' (estimate)' : ''}</span></span>
    <span class="right">${pillFor(i)}<svg class="edit-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P.pencil}</svg></span>
  </button><button class="swipe-delete" data-act="deleteItem" data-arg="${esc(i.id)}" aria-label="Delete ${esc(i.name)}" hidden>${ic('trash')}<span>Delete</span></button></div>`;
}
// Search text and category chips apply to both "All items" and "Going bad soon".
function filteredInv() {
  const q = S.ingQuery.toLowerCase().trim();
  return S.inv.filter(i => (S.ingCat === 'All' || i.cat === S.ingCat)
    && (!q || [i.name, i.brand, i.productName].some(value => String(value || '').toLowerCase().includes(q))));
}
function noMatchHtml() {
  const q = S.ingQuery.toLowerCase().trim();
  return `<div class="empty"><p>No food matches${q ? ` "${esc(q)}"` : ''}${S.ingCat !== 'All' ? ` in ${S.ingCat}` : ''}.</p></div>`;
}
function ingListHtml() {
  const q = S.ingQuery.toLowerCase().trim();
  const items = filteredInv();
  if (!items.length) return `<div class="empty"><p>No food matches${q ? ` "${esc(q)}"` : ''}${S.ingCat !== 'All' ? ` in ${S.ingCat}` : ''}.</p></div>`;
  return CATS.filter(c => items.some(i => i.cat === c)).map(c => {
    const list = items.filter(i => i.cat === c).sort(byExp);
    return `<section class="cat"><div class="cat-h"><h2>${c}</h2><span>${plural(list.length, 'item')}</span></div><div class="list">${list.map(itemRow).join('')}</div></section>`;
  }).join('');
}
function renderSoon() {
  const anySoon = S.inv.some(i => daysLeft(i) <= 7);
  const list = filteredInv().filter(i => daysLeft(i) <= 7).sort(byExp);
  if (anySoon && !list.length) return noMatchHtml();
  const bad = list.filter(i => daysLeft(i) < 0).length;
  const now = list.filter(i => daysLeft(i) >= 0 && daysLeft(i) <= 2).length;
  const wk = list.length - bad - now;
  if (!list.length) return `<div class="empty"><div class="big-illus">✅</div><h2>Nothing is going bad this week</h2><p>We'll move food here 7 days before it spoils.</p></div>`;
  return `<div class="summary-strip"><div class="r"><b class="num">${bad}</b><span>Spoiled</span></div><div class="r"><b class="num">${now}</b><span>0–2 days</span></div><div class="y"><b class="num">${wk}</b><span>3–7 days</span></div></div>
    <p class="soon-note">Grouped by food category, then sorted by date. Check package dates and storage instructions.</p>
    ${CATS.filter(c => list.some(i => i.cat === c)).map(c => {
      const items = list.filter(i => i.cat === c);
      return `<section class="cat"><div class="cat-h"><h2>${c}</h2><span>${plural(items.length, 'item')}</span></div><div class="list">${items.map(itemRow).join('')}</div></section>`;
    }).join('')}
    <div style="padding:14px 18px 0"><button class="btn btn-soft" data-act="askFromSoon">${ic('spark')} Find recipes that use these</button></div>`;
}

/* ---------- Item form (edit / manual add / review edit) ---------- */
function stripIdentityPart(text, part) {
  if (!part) return text;
  const at = text.toLowerCase().indexOf(part.toLowerCase());
  if (at < 0 || /[a-z0-9]/i.test(text[at - 1] || '') || /[a-z0-9]/i.test(text[at + part.length] || '')) return text;
  return `${text.slice(0, at)}${text.slice(at + part.length)}`
    .replace(/\(\s*\)/g, '').replace(/\s+,/g, ',').replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ')
    .replace(/^[\s,:\-]+|[\s,:\-]+$/g, '').trim();
}
function composeItemName(rawName, brand, productName, previous) {
  let name = String(rawName || '').trim();
  const priorBrand = String(previous?.brand || '').trim();
  const priorProduct = String(previous?.productName || '').trim();
  if (previous && name === previous.name && (brand !== priorBrand || productName !== priorProduct)) {
    name = stripIdentityPart(name, priorProduct);
    name = stripIdentityPart(name, priorBrand);
  }
  if (productName && !name.toLowerCase().includes(productName.toLowerCase())) name = `${productName} ${name}`.trim();
  if (brand && !name.toLowerCase().includes(brand.toLowerCase())) name = `${brand} ${name}`.trim();
  return name;
}
function itemIdentityFromForm(previous) {
  const brand = $('#f_brand').value.trim();
  let productName = $('#f_product').value.trim();
  if (previous && brand !== String(previous.brand || '').trim() && productName === previous.productName) {
    productName = stripIdentityPart(productName, String(previous.brand || '').trim());
  }
  return { brand, productName, name: composeItemName($('#f_name').value, brand, productName, previous) };
}
function itemForm(it, mode) {
  const [v, u] = it.qty != null ? disp(it.qty, it.unit) : ['1', S.metric ? 'ct' : 'ct'];
  const units = S.metric ? UNITS_METRIC : UNITS_US;
  const title = mode === 'new' ? 'Enter item details' : mode === 'review' && S.scan?.mode === 'barcode' ? 'Does this look right?' : mode === 'review' ? 'Edit detected item' : 'Edit item';
  const srcNote = mode === 'edit' ? (it.src === 'label' ? `${ic('tag')}<span>This date came from the best-by label.</span>` : `${ic('spark')}<span>We estimated this date from the food type and where you keep it (${it.store.toLowerCase()}). Follow the package label and storage directions; this estimate is only a reminder.</span>`) : `${ic('spark')}<span>Leave the date blank and we'll estimate it from the food type and where you store it.</span>`;
  const lookupNote = mode === 'review' && it.lookupSource
    ? `<div class="est-note">${ic('tag')}<span>Product information from ${esc(it.lookupSource)}. Check every field before saving.</span></div>` : '';
  const existingNote = mode === 'review' && S.scan?.mode === 'barcode'
    ? '<div class="est-note" id="barcodeDuplicate" hidden></div>' : '';
  const saveLabel = mode === 'new' ? 'Add to MyPantry'
    : mode === 'review' && S.scan?.mode === 'barcode' ? 'Save to MyPantry' : 'Save';
  return `<div class="sheet-head"><h2>${title}</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <form class="sheet-body" id="itemForm" novalidate data-mode="${mode}" data-id="${it.id || ''}">
    ${lookupNote}
    ${existingNote}
    <div class="field"><label for="f_name">Food name</label><input class="input" id="f_name" value="${esc(it.name || '')}" placeholder="e.g. cereal or cottage cheese" ${mode === 'new' ? 'autofocus' : ''}><span class="field-err" id="f_nameErr" hidden>Give this item a food name.</span></div>
    <div class="row2">
      <div class="field"><label for="f_brand">Brand (optional)</label><input class="input" id="f_brand" value="${esc(it.brand || '')}" placeholder="e.g. Post" maxlength="80"></div>
      <div class="field"><label for="f_product">Product name (optional)</label><input class="input" id="f_product" value="${esc(it.productName || '')}" placeholder="e.g. Honey Ohs!" maxlength="80"></div>
    </div>
    <div class="est-note">Keep the food type in the name, such as cereal. The brand and product name will appear with it.</div>
    <div class="row2">
      <div class="field"><label for="f_qty">Quantity</label><input class="input num" id="f_qty" inputmode="decimal" value="${v}"></div>
      <div class="field"><label for="f_unit">Measurement</label><select class="input" id="f_unit">${units.map(x => `<option ${x === u ? 'selected' : ''}>${x}</option>`).join('')}</select></div>
    </div>
    <span class="field-err" id="f_qtyErr" hidden style="margin-top:-8px">Quantity can only be a number, like 2 or 0.5.</span>
    <div class="est-note">For packaged food, choose box, bag or can and enter how many you have.</div>
    <div class="field"><label for="f_cat">Food category</label><select class="input" id="f_cat">${CATS.map(c => `<option ${c === (it.cat || 'Other') ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
    <div class="field"><span class="lbl">Stored in</span><div class="store-sel" id="f_store" role="radiogroup">${['Fridge', 'Pantry', 'Freezer'].map(s => `<button type="button" role="radio" aria-checked="${s === (it.store || 'Fridge')}" class="${s === (it.store || 'Fridge') ? 'on' : ''}" data-store="${s}" style="flex:1;padding:8px">${s}</button>`).join('')}</div></div>
    <div class="field"><label for="f_exp">Spoil date</label><input class="input" id="f_exp" type="date" min="${todayIso()}" data-orig="${esc(it.exp || '')}" value="${it.exp || ''}"><span class="field-err" id="f_expErr" hidden>Spoil date can't be in the past. Choose today or a later date.</span></div>
    <div class="est-note">${srcNote}</div>
  </form>
  <div class="sheet-foot">
    <button class="btn btn-primary" data-act="saveItem" id="saveItemBtn">${saveLabel}</button>
    ${mode === 'edit' ? `<button class="btn btn-soft" data-act="wasteStart" data-arg="${it.id}">${ic('trash')} Log waste</button>
      <button class="btn btn-danger-ghost" data-act="deleteItem" data-arg="${it.id}">${ic('trash')} Delete item</button>` : ''}
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
  const exp = $('#f_exp');
  const checkExp = () => {
    const bad = pastSpoilDate(exp.value, exp.dataset.orig);
    exp.classList.toggle('bad', bad);
    $('#f_expErr').hidden = !bad;
  };
  exp.addEventListener('input', checkExp);
  exp.addEventListener('change', checkExp);
  $$('#f_store button').forEach(b => b.onclick = () => {
    $$('#f_store button').forEach(x => { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
    b.classList.add('on'); b.setAttribute('aria-checked', 'true');
  });
  const duplicateNote = $('#barcodeDuplicate');
  if (duplicateNote) {
    const updateDuplicate = () => {
      const unit = fromDisp(1, $('#f_unit').value)[1];
      const matches = dupOf({ ...itemIdentityFromForm(it), unit });
      duplicateNote.hidden = !matches.length;
      duplicateNote.innerHTML = matches.length
        ? `${ic('alert')}<span>You already have ${matches.map(x => `${qtyText(x.qty, x.unit)} of ${esc(x.name)}`).join(' and ')}. Enter the number of new packages you are adding, or edit the existing item in Ingredients.</span>` : '';
    };
    ['#f_name', '#f_brand', '#f_product', '#f_unit'].forEach(selector => $(selector).addEventListener('input', updateDuplicate));
    $('#f_unit').addEventListener('change', updateDuplicate);
    updateDuplicate();
  }
  $('#itemForm').addEventListener('submit', e => { e.preventDefault(); ACT.saveItem(); });
  validate();
}
function readItemForm() {
  const form = $('#itemForm');
  const previous = form.dataset.mode === 'edit' ? S.inv.find(i => i.id === form.dataset.id)
    : form.dataset.mode === 'review' ? S.scan?.items.find(i => i.tid === form.dataset.id) : null;
  const rawName = $('#f_name').value.trim();
  $('#f_nameErr').hidden = !!rawName; $('#f_name').classList.toggle('bad', !rawName);
  if (!rawName) return null;
  const { name, brand, productName } = itemIdentityFromForm(previous);
  const q = parseFloat($('#f_qty').value);
  if (!(q > 0)) return null;
  const [bq, bu] = fromDisp(q, $('#f_unit').value);
  const cat = $('#f_cat').value;
  const store = $('#f_store .on')?.dataset.store || 'Fridge';
  const expIn = $('#f_exp').value;
  if (pastSpoilDate(expIn, $('#f_exp').dataset.orig)) {
    $('#f_expErr').hidden = false; $('#f_exp').classList.add('bad'); $('#f_exp').focus();
    return null;
  }
  return { name, brand, productName, qty: Math.round(bq * 1000) / 1000, unit: bu, cat, store, exp: expIn || estimate(cat, store, name), src: expIn ? 'label' : 'ai', emoji: guessEmoji(name) };
}

/* ===========================================================
   SCAN
   =========================================================== */
const DETECT = {
  pantry: [
    { name: 'Honeycrisp apples', emoji: '🍎', cat: 'Fruits', unit: 'ct', store: 'Fridge', src: 'ai' },
    { name: 'Baby carrots', emoji: '🥕', cat: 'Vegetables', unit: 'bag', store: 'Fridge', src: 'ai' },
    { name: 'Milk (2%)', emoji: '🥛', cat: 'Dairy & Eggs', unit: 'gal', store: 'Fridge', src: 'label', d: 12 },
    { name: 'Cottage cheese', emoji: null, cat: 'Dairy & Eggs', unit: 'oz', qty: 16, store: 'Fridge', src: 'label', d: 14 },
    { name: 'Orange juice', emoji: '🧃', cat: 'Drinks', unit: 'fl oz', qty: 52, store: 'Fridge', src: 'label', d: 9 }
  ],
  receipt: [
    { name: 'Chicken thighs', emoji: '🍗', cat: 'Meat & Seafood', unit: 'lb', store: 'Fridge', src: 'ai' },
    { name: 'Avocados', emoji: '🥑', cat: 'Fruits', unit: 'ct', store: 'Pantry', src: 'ai' },
    { name: 'Cheddar cheese', emoji: '🧀', cat: 'Dairy & Eggs', unit: 'oz', qty: 8, store: 'Fridge', src: 'ai' },
    { name: 'Bagels', emoji: '🥯', cat: 'Grains & Bread', unit: 'bag', store: 'Pantry', src: 'ai' },
    { name: 'Frozen waffles', emoji: '🧇', cat: 'Grains & Bread', unit: 'box', store: 'Freezer', src: 'ai' },
    { name: 'Heavy cream', emoji: '🥛', cat: 'Dairy & Eggs', unit: 'fl oz', qty: 16, store: 'Fridge', src: 'ai' }
  ],
  barcode: [
    { name: 'Creamy peanut butter', emoji: '🥜', cat: 'Sauces & Condiments', unit: 'jar', store: 'Pantry', src: 'ai' }
  ]
};
let cameraStream = null;
let cameraOwner = null;
let cameraRequest = 0;
let profileCameraStream = null;
let profileCameraRequest = 0;

function stopCameraPreview() {
  ++cameraRequest;
  if (cameraStream) cameraStream.getTracks().forEach(track => track.stop());
  cameraStream = null;
  cameraOwner = null;
}
function stopProfileCamera() {
  ++profileCameraRequest;
  if (profileCameraStream) profileCameraStream.getTracks().forEach(track => track.stop());
  profileCameraStream = null;
}
function attachProfileCamera() {
  if (!profileCameraStream || !S.profileCamera || S.setPage !== 'profile') return;
  const video = $('#profileCameraFeed');
  if (!video) return;
  video.srcObject = profileCameraStream;
  video.play?.().catch(() => {});
  const shutter = $('[data-act="profileShutter"]');
  if (shutter) shutter.disabled = false;
}
async function startProfileCamera() {
  stopProfileCamera();
  S.profileError = null;
  if (!navigator.mediaDevices?.getUserMedia) {
    S.profileCamera = { state: 'fallback', error: 'Live camera preview is unavailable. Use your device camera button or choose a photo.' };
    render();
    return;
  }
  S.profileCamera = { state: 'requesting', error: null };
  render();
  const request = ++profileCameraRequest;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'user' }, width: { ideal: 1280 }, height: { ideal: 1280 } },
      audio: false
    });
    if (request !== profileCameraRequest || S.setPage !== 'profile' || !S.profileCamera) {
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    profileCameraStream = stream;
    S.profileCamera = { state: 'live', error: null };
    render();
  } catch (error) {
    if (request !== profileCameraRequest || S.setPage !== 'profile') return;
    S.profileCamera = { state: 'fallback', error: error?.name === 'NotAllowedError'
      ? 'Camera access was denied. Allow it in your browser settings, or choose a photo.'
      : 'The camera could not start. Use your device camera button or choose a photo.' };
    render();
  }
}
function blobFromDataUrl(dataUrl) {
  const [header, encoded] = String(dataUrl).split(',');
  const type = /data:([^;]+)/.exec(header)?.[1] || 'image/jpeg';
  const binary = atob(encoded || '');
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}
function squareAvatar(source, width, height, mirror = false) {
  const side = Math.min(width, height);
  if (!side) throw new Error("Couldn't read that photo. Please try another.");
  const sx = (width - side) / 2, sy = (height - side) / 2;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 640;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error("Couldn't prepare that photo. Please try another.");
  if (mirror) { ctx.translate(640, 0); ctx.scale(-1, 1); }
  ctx.drawImage(source, sx, sy, side, side, 0, 0, 640, 640);
  const url = canvas.toDataURL('image/jpeg', 0.86);
  return { url, blob: blobFromDataUrl(url) };
}
async function profilePhotoFromFile(file) {
  const url = await photoImage(file);
  const image = await new Promise((resolve, reject) => {
    const candidate = new Image();
    candidate.onload = () => resolve(candidate);
    candidate.onerror = () => reject(new Error("Couldn't read that photo. Please try a JPG or PNG."));
    candidate.src = url;
  });
  return squareAvatar(image, image.naturalWidth || image.width, image.naturalHeight || image.height);
}
function setProfileDraft(draft) {
  stopProfileCamera();
  S.profileCamera = null;
  S.profileDraft = draft;
  S.profileError = null;
  render();
}
function captureProfilePhoto() {
  const video = $('#profileCameraFeed');
  if (!video || video.readyState < 2 || !video.videoWidth || !video.videoHeight) {
    S.profileError = 'The camera is still starting. Try again in a moment.';
    render();
    return;
  }
  try { setProfileDraft(squareAvatar(video, video.videoWidth, video.videoHeight, true)); }
  catch (error) { S.profileError = error.message; render(); }
}
function attachCameraPreview() {
  if (!cameraStream || cameraOwner !== S.scan || S.scan?.stage !== 'camera') return;
  const video = $('#cameraFeed');
  if (!video) return;
  video.srcObject = cameraStream;
  video.play?.().catch(() => {});
  const status = $('.camera-status'); if (status) status.hidden = true;
  const shutter = $('[data-act="cameraShutter"]'); if (shutter) shutter.disabled = false;
}
async function startCameraPreview(sc) {
  stopCameraPreview();
  if (!sc || S.scan !== sc || sc.stage !== 'camera') return;
  if (!navigator.mediaDevices?.getUserMedia) {
    sc.cameraState = 'fallback';
    sc.cameraError = window.isSecureContext === false
      ? 'Live preview requires HTTPS. Use the shutter or choose a photo.'
      : 'Live camera preview is unavailable. Use the shutter or choose a photo.';
    render();
    return;
  }
  sc.cameraState = 'requesting';
  const request = ++cameraRequest;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
      audio: false
    });
    if (request !== cameraRequest || S.scan !== sc || sc.stage !== 'camera') {
      stream.getTracks().forEach(track => track.stop());
      return;
    }
    cameraStream = stream;
    cameraOwner = sc;
    sc.cameraState = 'live';
    sc.cameraError = null;
    render();
  } catch (error) {
    if (request !== cameraRequest || S.scan !== sc) return;
    sc.cameraState = 'fallback';
    sc.cameraError = error?.name === 'NotAllowedError'
      ? 'Camera access was denied. Allow it in your browser settings, or choose a photo.'
      : 'The live camera could not start. Use the shutter or choose a photo.';
    render();
  }
}
function liveCameraScene(sc, fallback) {
  if (sc.preview) return `<img class="rc-preview" src="${sc.preview}" alt="Your photo">`;
  if (sc.cameraState === 'fallback') return fallback;
  return `<video id="cameraFeed" class="camera-feed" autoplay muted playsinline aria-label="Live camera preview"></video>
    <div class="camera-status" role="status"><div class="spinner"></div>Starting camera…</div>`;
}
function cameraShutter(fileInputId) {
  return S.scan?.cameraState === 'fallback'
    ? `<label class="shutter" for="${fileInputId}" aria-label="Take photo" role="button"><i></i></label>`
    : `<button class="shutter" data-act="cameraShutter" aria-label="Take photo" disabled><i></i></button>`;
}
async function captureCameraFrame() {
  const sc = S.scan;
  const video = $('#cameraFeed');
  if (!sc || sc.stage !== 'camera' || sc.cameraState !== 'live' || !video || video.readyState < 2) {
    toast('The camera is still starting. Try again in a moment.', null, 'camera');
    return;
  }
  const sourceWidth = video.videoWidth, sourceHeight = video.videoHeight;
  if (!sourceWidth || !sourceHeight) return toast('The camera is not ready yet.', null, 'camera');
  const maxSide = sc.mode === 'barcode' ? 3200 : 2400;
  const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(sourceWidth * scale));
  canvas.height = Math.max(1, Math.round(sourceHeight * scale));
  const ctx = canvas.getContext('2d');
  if (!ctx) return toast("Couldn't capture that frame. Choose a photo instead.", null, 'alert');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .9));
  if (!blob || S.scan !== sc) return toast("Couldn't capture that frame. Try again.", null, 'alert');
  const file = new File([blob], `${sc.mode}-${Date.now()}.jpg`, { type: 'image/jpeg' });
  stopCameraPreview();
  if (sc.mode === 'barcode') await scanBarcodePhoto(file);
  else if (sc.mode === 'receipt') await beginReceiptEditor(file);
  else await scanPhoto(file);
}
function startScan(mode) {
  stopCameraPreview();
  S.scan = { mode, stage: mode === 'manual' ? 'menu' : 'camera', demo: 'good', items: [], cameraState: mode === 'manual' ? null : 'requesting' };
  render();
  if (mode !== 'manual' && !isDemoAccount()) void startCameraPreview(S.scan);
}
function renderScan() {
  const sc = S.scan;
  if (!sc || sc.stage === 'menu') return scanMenu();
  if (sc.stage === 'preparing' || sc.stage === 'editing') return renderReceiptEditor(sc);
  if (['receipt', 'pantry'].includes(sc.mode) && sc.stage === 'analyzing' && sc.inAppBackground) return renderPhotoProcessing(sc);
  if (sc.stage === 'review') return renderReview();
  if (sc.stage === 'done') return renderDone();
  return scanMenu();
}
function renderPhotoProcessing(sc) {
  const pantry = sc.mode === 'pantry';
  const label = pantry ? 'pantry photo' : 'receipt';
  return `<div class="appbar receipt-processing-head"><button class="close" data-act="scanCancel" aria-label="Cancel ${label} processing">${ic('x')}</button><h1>${pantry ? 'Pantry scan' : 'Receipt scan'}</h1><span aria-hidden="true"></span></div>
  <div class="scroll"><div class="receipt-processing-page" role="status" aria-live="polite">
    <span class="receipt-processing-spinner" aria-hidden="true"></span><h2>${pantry ? 'Finding food in your photo…' : 'Reading your receipt…'}</h2>
    <p>We’ll keep working while you use another part of MyPantry.</p>
    <button class="btn btn-primary" data-act="tab" data-arg="home">Continue to Home</button>
  </div></div>`;
}
function cancelReceiptModal() {
  const pantry = S.scan?.mode === 'pantry';
  const label = pantry ? 'pantry photo' : 'receipt';
  return `<div class="icon-hero" style="background:var(--butter-soft);color:var(--butter)">${ic('receipt')}</div>
    <h2>Cancel ${label} processing?</h2>
    <p>The current scan result will be discarded. You’ll need to submit the ${label} again if you still want to add it.</p>
    <button class="btn btn-danger" data-act="cancelReceiptScan">Cancel processing</button>
    <button class="btn btn-ghost" data-act="closeSheet">Keep processing</button>`;
}
function discardScanReviewModal() {
  const count = S.scan?.items?.length || 0;
  return `<div class="icon-hero" style="background:var(--tomato-soft);color:var(--tomato)">${ic('trash')}</div>
    <h2>Discard this scan?</h2>
    <p>${plural(count, 'detected item')} haven’t been added to MyPantry yet. Discarding the review cannot be undone.</p>
    <button class="btn btn-danger" data-act="discardScanReview">Discard review</button>
    <button class="btn btn-ghost" data-act="closeSheet">Keep reviewing</button>`;
}
function dismissReceiptCancel() {
  const scrim = $('#scrim');
  if (scrim?.dataset.receiptCancel === 'true') closeSheet();
}
function scanMenu() {
  const o = (mode, icon, title, sub, tint, feat, tone) => `<button class="opt ${feat ? 'featured' : ''} ${tone ? `tinted ${tone}` : ''}" data-act="${mode === 'manual' ? 'manual' : 'startScan'}" data-arg="${mode}">
      <span class="oi" style="${feat || tone ? '' : `background:${tint}`}">${ic(icon)}</span><span><b>${title}</b><span>${sub}</span></span>${`<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${P.right}</svg>`}</button>`;
  return `<div class="scroll"><div class="scan-h"><h1>Start Logging Your Food</h1><p>Pick the fastest way. You'll review everything before it's saved.</p></div>
    <div class="opts">
      ${o('pantry', 'fridge', 'Take a picture of your pantry or fridge', 'Logs many items at once', '', false, 'pantry')}
      ${o('receipt', 'receipt', 'Take a picture of your receipt', 'Best right after shopping', '', false, 'receipt')}
      ${o('barcode', 'barcode', "Scan your item's bar code", 'One item at a time', '', false, 'barcode')}
      ${o('manual', 'pencil', 'Enter item details yourself', 'Type the name, amount and date', 'var(--surface-3)')}
    </div>
    <div class="tip"><b>Tip:</b> Photos work best in good light with labels facing the camera. We read best-by dates when we can see them and estimate the rest.</div>
  </div>`;
}
// The configured, authenticated Demo account gets deterministic scan outcomes;
// every other account uses the real photo and barcode services.
const realPhoto = sc => !isDemoAccount() && (sc.mode === 'receipt' || sc.mode === 'pantry');
const realBarcode = sc => !isDemoAccount() && sc.mode === 'barcode';
const PHOTO_TEXT = {
  receipt: { title: 'Photo of receipt', head: 'Snap your grocery receipt', tip: 'Lay it flat in good light. Long receipts can be folded so the food lines fit in one photo.', busy: 'Reading your receipt…', bad: "We couldn't read this receipt. Lay it flat in good light and try again.", none: "We didn't find any food on this receipt." },
  pantry: { title: 'Photo of pantry or fridge', head: 'Snap your fridge, freezer or shelf', tip: 'Open the door wide, use good light and turn labels toward the camera. One shelf at a time works best.', busy: 'Finding your food…', bad: "We couldn't see your food clearly. Try again in better light.", none: "We didn't spot any food in this photo. Try a closer shot of one shelf." }
};
function renderCamera() {
  const sc = S.scan;
  if (realPhoto(sc)) return renderPhotoCamera(sc);
  if (realBarcode(sc)) return renderBarcodeCamera(sc);
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
function renderBarcodeCamera(sc) {
  const busy = sc.stage === 'analyzing';
  const fallback = `<div class="rc-empty">${ic('barcode')}<b>Photograph the bar code</b><span>Fill the frame with one clear UPC or EAN code.</span></div>`;
  const scene = liveCameraScene(sc, fallback);
  const hint = sc.cameraError || (sc.cameraState === 'live'
    ? 'Line up one bar code, then tap the shutter.'
    : 'Starting the rear camera. You can also choose a photo.');
  return `<div class="camera" role="dialog" aria-label="Scan bar code">
    <div class="cam-top"><button class="close" data-act="scanCancel" aria-label="Close camera">${ic('x')}</button><b>Scan bar code</b><span style="width:34px"></span></div>
    <div class="viewfinder">${scene}<div class="vf-corners"><i></i><i></i><i></i><i></i></div>
      ${busy ? `<div class="analyzing"><div class="spinner"></div>Looking up this item…</div>` : ''}</div>
    <div class="cam-hint">${esc(hint)}</div>
    <input type="file" id="barcodeCam" accept="image/*" capture="environment" hidden>
    <input type="file" id="barcodePick" accept="image/*" hidden>
    <div class="cam-bottom"><label class="cam-side" for="barcodePick" aria-label="Choose a photo" title="Choose a photo">${ic('image')}</label>${cameraShutter('barcodeCam')}<button class="cam-side" data-act="manual" aria-label="Type it instead">${ic('pencil')}</button></div>
    ${sc.stage === 'error' ? `<div class="cam-error" role="alert"><div class="eh">${ic('alert')}<b>${esc(sc.error || "We couldn't find this item.")}</b></div>
      <form id="barcodeNumberForm" class="barcode-number" novalidate><label for="barcodeNumber">Or enter the digits below the bar code</label><div><input id="barcodeNumber" inputmode="numeric" autocomplete="off" maxlength="14" placeholder="UPC or EAN"><button class="btn btn-primary" type="submit">Look up</button></div><span id="barcodeNumberErr" hidden>Enter a valid 8–14 digit UPC or EAN.</span></form>
      <div class="btns"><button class="btn btn-ghost" data-act="retake">${ic('barcode')} Try another photo</button><button class="btn btn-ghost" data-act="manual">Enter item details</button></div></div>` : ''}
  </div>`;
}
function renderPhotoCamera(sc) {
  const t = PHOTO_TEXT[sc.mode];
  const fallback = `<div class="rc-empty">${ic(sc.mode === 'receipt' ? 'receipt' : 'fridge')}<b>${t.head}</b><span>${t.tip}</span></div>`;
  const scene = liveCameraScene(sc, fallback);
  const hint = sc.cameraError || (sc.cameraState === 'live' ? t.tip : 'Starting the rear camera. You can also choose a photo.');
  return `<div class="camera" role="dialog" aria-label="${t.title}">
    <div class="cam-top"><button class="close" data-act="scanCancel" aria-label="Close camera">${ic('x')}</button><b>${t.title}</b><span style="width:34px"></span></div>
    <div class="viewfinder">${scene}<div class="vf-corners"><i></i><i></i><i></i><i></i></div>
      ${sc.stage === 'analyzing' ? `<div class="analyzing"><div class="spinner"></div>${t.busy}</div>` : ''}</div>
    <div class="cam-hint">${esc(hint)}</div>
    <input type="file" id="photoCam" accept="image/*" capture="environment" hidden>
    <input type="file" id="photoPick" accept="image/*" hidden>
    <div class="cam-bottom"><label class="cam-side" for="photoPick" aria-label="Choose a photo" title="Choose a photo">${ic('image')}</label>${cameraShutter('photoCam')}<button class="cam-side" data-act="manual" aria-label="Type it instead">${ic('pencil')}</button></div>
    ${sc.stage === 'error' ? `<div class="cam-error" role="alert"><div class="eh">${ic('alert')}<b>${esc(sc.error || t.bad)}</b></div><div class="btns"><button class="btn btn-primary" data-act="retake">${ic('camera')} Try another photo</button><button class="btn btn-ghost" data-act="manual">Enter it myself</button></div></div>` : ''}
  </div>`;
}
const PHOTO_MAX_SIDE = 2400;
async function photoImage(file) {
  if (file.type && !/^image\//.test(file.type)) throw new Error('Please choose a photo (JPG or PNG).');
  // Shrink large phone photos before upload; also normalizes HEIC and rotation where supported.
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file);
      const scale = Math.min(1, PHOTO_MAX_SIDE / Math.max(bmp.width, bmp.height));
      const c = document.createElement('canvas');
      c.width = Math.round(bmp.width * scale); c.height = Math.round(bmp.height * scale);
      const ctx = c.getContext('2d');
      if (ctx) { ctx.drawImage(bmp, 0, 0, c.width, c.height); bmp.close?.(); return c.toDataURL('image/jpeg', 0.85); }
    } catch (_) { /* fall back to the original file */ }
  }
  if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) throw new Error('This photo format is not supported. Please use a JPG or PNG photo.');
  if (file.size > 5000000) throw new Error('That photo is too large. Please use one under 5 MB.');
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Couldn't open that photo. Please try another."));
    reader.readAsDataURL(file);
  });
}
function photoItem(r) {
  const brand = String(r.brand || '').trim();
  const productName = String(r.product_name || '').trim();
  const name = composeItemName(String(r.name || '').trim(), brand, productName);
  const cat = normalizeCategory(name, r.category);
  const store = ['Fridge', 'Pantry', 'Freezer'].includes(r.storage) ? r.storage : 'Pantry';
  const qty = Number(r.quantity) > 0 ? Number(r.quantity) : 1;
  // A date printed on the package beats our estimate, unless the item is frozen.
  const label = typeof r.label_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(r.label_date) && store !== 'Freezer' ? r.label_date : null;
  return { tid: 't' + (uid++), name, brand, productName, emoji: guessEmoji(name), cat,
    unit: UNITS_US.includes(r.unit) ? r.unit : 'ct', qty, pkg: null, store, src: label ? 'label' : 'ai',
    exp: label || estimate(cat, store, name), on: true, receiptText: r.receipt_text ? String(r.receipt_text).slice(0, 80) : '' };
}

let receiptEditorImage = null;
const freshReceiptCorners = () => ([
  { x: .035, y: .035 }, { x: .965, y: .035 },
  { x: .965, y: .965 }, { x: .035, y: .965 }
]);

function loadPhotoImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Couldn't open that receipt photo."));
    image.src = url;
  });
}

async function beginReceiptEditor(file) {
  const sc = S.scan;
  if (!file || !sc || sc.mode !== 'receipt' || sc.stage === 'preparing') return;
  const started = performance.now();
  stopCameraPreview();
  sc.stage = 'preparing'; sc.error = null; render();
  try {
    const source = await photoImage(file);
    const image = await loadPhotoImage(source);
    if (S.scan !== sc) return;
    receiptEditorImage = image;
    sc.editor = { source, brightness: 0, contrast: 0, corners: freshReceiptCorners(), prepareMs: Math.round(performance.now() - started), error: null };
    sc.stage = 'editing'; render();
  } catch (error) {
    if (S.scan !== sc) return;
    sc.stage = 'error'; sc.error = error.message || 'That receipt photo could not be prepared.'; render();
  }
}

function renderReceiptEditor(sc) {
  if (sc.stage === 'preparing') return `<div class="photo-editor-loading"><div class="spinner"></div><b>Preparing your receipt…</b></div>`;
  const ed = sc.editor || {};
  return `<div class="photo-editor">
    <div class="editor-head"><button class="back" data-act="photoRetake">${ic('left')} Retake</button><div><h1>Prepare receipt</h1><p>Place the four corners around the receipt, then adjust it only if needed.</p></div><button class="icon-btn" data-act="scanCancel" aria-label="Cancel">${ic('x')}</button></div>
    <div class="editor-work"><canvas id="receiptEditorCanvas" aria-label="Receipt crop and perspective editor"></canvas><p class="editor-tip">Drag each corner to crop and straighten the receipt.</p></div>
    <div class="editor-controls">
      ${ed.error ? `<div class="editor-warning" role="alert">${ic('alert')}<span>${esc(ed.error)}</span></div>` : ''}
      <label><span>Brightness</span><span class="range-ends"><small>Darker</small><input id="photoBrightness" type="range" min="-40" max="40" value="${Number(ed.brightness) || 0}"><small>Brighter</small></span></label>
      <label><span>Contrast</span><span class="range-ends"><small>Softer</small><input id="photoContrast" type="range" min="-40" max="40" value="${Number(ed.contrast) || 0}"><small>Sharper</small></span></label>
      <div class="editor-actions"><button class="btn btn-ghost" data-act="photoRotate">${ic('refresh')} Rotate</button><button class="btn btn-ghost" data-act="photoReset">Reset</button></div>
      <button class="btn btn-primary" data-act="photoProcess">Use this photo</button>
    </div>
  </div>`;
}

function drawReceiptEditor() {
  const canvas = $('#receiptEditorCanvas'), ed = S.scan?.editor, image = receiptEditorImage;
  if (!canvas || !ed || !image) return;
  const iw = image.naturalWidth || image.width, ih = image.naturalHeight || image.height;
  const scale = Math.min(1, 900 / Math.max(1, iw), 780 / Math.max(1, ih));
  canvas.width = Math.max(1, Math.round(iw * scale)); canvas.height = Math.max(1, Math.round(ih * scale));
  const ctx = canvas.getContext('2d'); if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = `brightness(${100 + Number(ed.brightness || 0)}%) contrast(${100 + Number(ed.contrast || 0)}%)`;
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height); ctx.filter = 'none';
  const points = ed.corners.map(p => ({ x: p.x * canvas.width, y: p.y * canvas.height }));
  ctx.fillStyle = 'rgba(0,0,0,.42)'; ctx.beginPath(); ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.fill('evenodd');
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(points[0].x, points[0].y); points.slice(1).forEach(p => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.stroke();
  for (const p of points) { ctx.fillStyle = '#2f7d4a'; ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(p.x, p.y, 14, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
}

function mountReceiptEditor() {
  const canvas = $('#receiptEditorCanvas'), ed = S.scan?.editor;
  if (!canvas || !ed || !receiptEditorImage) return;
  drawReceiptEditor();
  let active = -1;
  const position = event => {
    const rect = canvas.getBoundingClientRect();
    return { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) };
  };
  canvas.onpointerdown = event => {
    const p = position(event);
    active = ed.corners.reduce((best, corner, index) => {
      const distance = Math.hypot(corner.x - p.x, corner.y - p.y);
      return distance < best.distance ? { index, distance } : best;
    }, { index: -1, distance: Infinity }).index;
    canvas.setPointerCapture?.(event.pointerId);
  };
  canvas.onpointermove = event => {
    if (active < 0) return;
    const p = position(event), opposite = ed.corners[(active + 2) % 4];
    if (Math.abs(p.x - opposite.x) < .08 || Math.abs(p.y - opposite.y) < .08) return;
    ed.corners[active] = p; ed.error = null; drawReceiptEditor();
  };
  canvas.onpointerup = canvas.onpointercancel = () => { active = -1; };
}

function triangleMap(ctx, image, source, target) {
  const [s0, s1, s2] = source, [d0, d1, d2] = target;
  const det = s0.x * (s1.y - s2.y) + s1.x * (s2.y - s0.y) + s2.x * (s0.y - s1.y);
  if (Math.abs(det) < .001) return;
  const solve = values => ({
    a: (values[0] * (s1.y - s2.y) + values[1] * (s2.y - s0.y) + values[2] * (s0.y - s1.y)) / det,
    b: (values[0] * (s2.x - s1.x) + values[1] * (s0.x - s2.x) + values[2] * (s1.x - s0.x)) / det,
    c: (values[0] * (s1.x * s2.y - s2.x * s1.y) + values[1] * (s2.x * s0.y - s0.x * s2.y) + values[2] * (s0.x * s1.y - s1.x * s0.y)) / det
  });
  const x = solve(target.map(p => p.x)), y = solve(target.map(p => p.y));
  ctx.save(); ctx.beginPath(); ctx.moveTo(d0.x, d0.y); ctx.lineTo(d1.x, d1.y); ctx.lineTo(d2.x, d2.y); ctx.closePath(); ctx.clip();
  ctx.setTransform(x.a, y.a, x.b, y.b, x.c, y.c); ctx.drawImage(image, 0, 0); ctx.restore();
}

function bilinearPoint(corners, u, v, width, height) {
  const top = { x: corners[0].x * (1 - u) + corners[1].x * u, y: corners[0].y * (1 - u) + corners[1].y * u };
  const bottom = { x: corners[3].x * (1 - u) + corners[2].x * u, y: corners[3].y * (1 - u) + corners[2].y * u };
  return { x: (top.x * (1 - v) + bottom.x * v) * width, y: (top.y * (1 - v) + bottom.y * v) * height };
}

function rectifiedReceiptCanvas() {
  const ed = S.scan?.editor, image = receiptEditorImage;
  if (!ed || !image) throw new Error('Choose a receipt photo first.');
  const iw = image.naturalWidth || image.width, ih = image.naturalHeight || image.height;
  const c = ed.corners.map(p => ({ x: p.x * iw, y: p.y * ih }));
  const top = Math.hypot(c[1].x - c[0].x, c[1].y - c[0].y), bottom = Math.hypot(c[2].x - c[3].x, c[2].y - c[3].y);
  const left = Math.hypot(c[3].x - c[0].x, c[3].y - c[0].y), right = Math.hypot(c[2].x - c[1].x, c[2].y - c[1].y);
  const scale = Math.min(1, 2200 / Math.max((top + bottom) / 2, (left + right) / 2));
  const canvas = document.createElement('canvas'); canvas.width = Math.max(320, Math.round((top + bottom) / 2 * scale)); canvas.height = Math.max(320, Math.round((left + right) / 2 * scale));
  const ctx = canvas.getContext('2d'); if (!ctx) throw new Error("Couldn't prepare that receipt photo.");
  ctx.filter = `brightness(${100 + Number(ed.brightness || 0)}%) contrast(${100 + Number(ed.contrast || 0)}%)`;
  const cols = 12, rows = 16;
  for (let row = 0; row < rows; row++) for (let col = 0; col < cols; col++) {
    const u0 = col / cols, u1 = (col + 1) / cols, v0 = row / rows, v1 = (row + 1) / rows;
    const s00 = bilinearPoint(ed.corners, u0, v0, iw, ih), s10 = bilinearPoint(ed.corners, u1, v0, iw, ih), s01 = bilinearPoint(ed.corners, u0, v1, iw, ih), s11 = bilinearPoint(ed.corners, u1, v1, iw, ih);
    const d00 = { x: u0 * canvas.width, y: v0 * canvas.height }, d10 = { x: u1 * canvas.width, y: v0 * canvas.height }, d01 = { x: u0 * canvas.width, y: v1 * canvas.height }, d11 = { x: u1 * canvas.width, y: v1 * canvas.height };
    triangleMap(ctx, image, [s00, s10, s11], [d00, d10, d11]); triangleMap(ctx, image, [s00, s11, s01], [d00, d11, d01]);
  }
  ctx.filter = 'none'; return canvas;
}

function receiptQuality(canvas) {
  const sample = document.createElement('canvas'), max = 420, scale = Math.min(1, max / Math.max(canvas.width, canvas.height));
  sample.width = Math.max(1, Math.round(canvas.width * scale)); sample.height = Math.max(1, Math.round(canvas.height * scale));
  const ctx = sample.getContext('2d', { willReadFrequently: true }); if (!ctx) return { ok: true };
  ctx.drawImage(canvas, 0, 0, sample.width, sample.height);
  const pixels = ctx.getImageData(0, 0, sample.width, sample.height).data, gray = new Float32Array(sample.width * sample.height);
  let sum = 0, sumSq = 0;
  for (let i = 0, p = 0; i < pixels.length; i += 4, p++) { const g = pixels[i] * .299 + pixels[i + 1] * .587 + pixels[i + 2] * .114; gray[p] = g; sum += g; sumSq += g * g; }
  const count = gray.length, mean = sum / count, deviation = Math.sqrt(Math.max(0, sumSq / count - mean * mean));
  let lapSum = 0, lapSq = 0, lapCount = 0;
  for (let y = 1; y < sample.height - 1; y++) for (let x = 1; x < sample.width - 1; x++) {
    const at = y * sample.width + x, lap = gray[at - 1] + gray[at + 1] + gray[at - sample.width] + gray[at + sample.width] - 4 * gray[at];
    lapSum += lap; lapSq += lap * lap; lapCount++;
  }
  const lapMean = lapSum / Math.max(1, lapCount), sharpness = lapSq / Math.max(1, lapCount) - lapMean * lapMean;
  if (mean < 38) return { ok: false, message: 'This receipt is too dark to read reliably. Try again in brighter, even light.' };
  if (mean > 242) return { ok: false, message: 'This receipt is washed out by too much light. Move away from glare and try again.' };
  if (deviation < 15) return { ok: false, message: 'The receipt text does not have enough contrast to read reliably. Adjust the contrast or retake it in better light.' };
  if (sharpness < 24) return { ok: false, message: 'This receipt is too blurry to read reliably. Hold the camera steady and retake the photo.' };
  return { ok: true, internal: { mean: Math.round(mean), contrast: Math.round(deviation), sharpness: Math.round(sharpness) } };
}

async function rotateReceiptEditor() {
  const sc = S.scan, ed = sc?.editor, image = receiptEditorImage; if (!ed || !image) return;
  const canvas = document.createElement('canvas'), iw = image.naturalWidth || image.width, ih = image.naturalHeight || image.height;
  canvas.width = ih; canvas.height = iw; const ctx = canvas.getContext('2d'); if (!ctx) return;
  ctx.translate(canvas.width, 0); ctx.rotate(Math.PI / 2); ctx.drawImage(image, 0, 0);
  ed.source = canvas.toDataURL('image/jpeg', .9); receiptEditorImage = await loadPhotoImage(ed.source);
  if (S.scan !== sc) return; ed.corners = freshReceiptCorners(); ed.error = null; render();
}

async function processReceiptEditor() {
  const sc = S.scan, ed = sc?.editor; if (!ed || sc.stage !== 'editing') return;
  try {
    const canvas = rectifiedReceiptCanvas(), quality = receiptQuality(canvas);
    if (!quality.ok) { ed.error = quality.message; render(); return; }
    const image = canvas.toDataURL('image/jpeg', .88);
    console.info('[MyPantry] receipt prepared', { prepareMs: ed.prepareMs, quality: quality.internal });
    await scanPhoto(image, { prepareMs: ed.prepareMs, quality: quality.internal });
  } catch (error) { ed.error = error.message || 'That receipt could not be prepared.'; render(); }
}
function combinePhotoPackages(items) {
  const combined = [];
  for (const item of items) {
    const same = combined.find(x => x.name.toLowerCase() === item.name.toLowerCase()
      && x.brand.toLowerCase() === item.brand.toLowerCase()
      && x.productName.toLowerCase() === item.productName.toLowerCase()
      && x.cat === item.cat && x.unit === item.unit && x.store === item.store && x.exp === item.exp);
    if (same) same.qty = Math.round((same.qty + item.qty) * 100) / 100;
    else combined.push(item);
  }
  return combined;
}
async function scanPhoto(file, diagnostics = {}) {
  const sc = S.scan;
  if (!file || !sc || !realPhoto(sc) || sc.stage === 'analyzing') return;
  const t = PHOTO_TEXT[sc.mode];
  const generation = accountGeneration;
  const current = () => S.scan === sc && generation === accountGeneration;
  const fail = message => { if (!current()) return; dismissReceiptCancel(); sc.stage = 'error'; sc.error = message; render(); };
  sc.stage = 'analyzing'; sc.error = null;
  if (['receipt', 'pantry'].includes(sc.mode)) { sc.inAppBackground = true; S.tab = 'home'; }
  render();
  const requestStarted = performance.now();
  let image;
  try { image = typeof file === 'string' ? file : await photoImage(file); } catch (error) { fail(error.message); return; }
  if (!current()) return;
  sc.preview = image; render();
  const controller = new AbortController();
  sc.abortController = controller;
  const timer = setTimeout(() => controller.abort(), 75000);
  try {
    const { data, error } = await sb.auth.getSession();
    if (error || !data.session?.access_token) throw new Error('Please sign in again to scan photos.');
    const response = await fetch(`${CFG.supabaseUrl}/functions/v1/receipt-scan`, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', apikey: CFG.supabaseKey, Authorization: `Bearer ${data.session.access_token}` },
      body: JSON.stringify({ image, kind: sc.mode })
    });
    let result = {};
    try { result = await response.json(); } catch (_) {}
    const serverTiming = response.headers?.get?.('Server-Timing') || '';
    console.info('[MyPantry] receipt scan finished', { totalMs: Math.round(performance.now() - requestStarted), serverTiming, code: result.code || (response.ok ? 'OK' : 'UNKNOWN'), ...diagnostics });
    if (!response.ok) throw new Error(result.error || 'Photo scanning is unavailable. Please try again.');
    if (!current()) return;
    const found = (Array.isArray(result.items) ? result.items : []).filter(r => r && r.name).map(photoItem);
    const items = sc.mode === 'pantry' ? combinePhotoPackages(found) : found;
    if (!items.length) {
      fail(result.readable === false ? t.bad : t.none);
      return;
    }
    dismissReceiptCancel(); sc.items = items; sc.storeName = result.store_name || null; sc.stage = 'review'; render();
  } catch (error) {
    fail(error.name === 'AbortError' ? 'Reading the photo took too long. Please try again.' : error.message);
  } finally { clearTimeout(timer); if (sc.abortController === controller) sc.abortController = null; }
}
function barcodeFileData(file) {
  if (file.type && !/^image\/(jpeg|png|webp|gif|heic|heif)$/.test(file.type)) return Promise.reject(new Error('Please use a bar code photo.'));
  if (file.size > 15000000) return Promise.reject(new Error('That photo is too large. Please use one under 15 MB.'));
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Couldn't open that photo. Please try another."));
    reader.readAsDataURL(file);
  });
}
function loadBarcodeImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Couldn't open that bar code photo."));
    image.src = url;
  });
}
function validBarcode(value) {
  if (!/^\d{8,14}$/.test(value)) return false;
  const digits = [...value].map(Number), check = digits.pop();
  const sum = digits.reverse().reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}
const barcodeKey = value => String(value || '').replace(/\D/g, '').padStart(14, '0');
const barcodeText = result => {
  const value = typeof result?.getText === 'function' ? result.getText() : result?.rawValue || result?.text;
  const digits = String(value || '').replace(/\D/g, '');
  return validBarcode(digits) ? digits : null;
};
async function nativeBarcodeDetector() {
  if (!window.BarcodeDetector) return null;
  try {
    const wanted = ['ean_13', 'ean_8', 'upc_a', 'upc_e'];
    const supported = typeof window.BarcodeDetector.getSupportedFormats === 'function'
      ? await window.BarcodeDetector.getSupportedFormats() : wanted;
    const formats = wanted.filter(format => supported.includes(format));
    return formats.length ? new window.BarcodeDetector({ formats }) : null;
  } catch (_) { return null; }
}
async function decodeBarcodeSource(source, nativeDetector, zxing, isUrl = false) {
  if (nativeDetector) {
    try {
      const found = await nativeDetector.detect(source);
      for (const result of found || []) { const value = barcodeText(result); if (value) return value; }
    } catch (_) { /* try ZXing */ }
  }
  try {
    const result = isUrl ? await zxing.decodeFromImageUrl(source) : zxing.decodeFromCanvas(source);
    return barcodeText(result);
  } catch (_) { return null; }
}
function barcodeVariant(image, crop, rotation, treatment) {
  const sourceWidth = image.naturalWidth || image.width, sourceHeight = image.naturalHeight || image.height;
  const sw = Math.max(1, Math.round(sourceWidth * crop)), sh = Math.max(1, Math.round(sourceHeight * crop));
  const sx = Math.round((sourceWidth - sw) / 2), sy = Math.round((sourceHeight - sh) / 2);
  const maxSide = 3200, scale = Math.min(1, maxSide / Math.max(sw, sh));
  const dw = Math.max(1, Math.round(sw * scale)), dh = Math.max(1, Math.round(sh * scale));
  const sideways = rotation === 90 || rotation === 270;
  const canvas = document.createElement('canvas');
  canvas.width = sideways ? dh : dw; canvas.height = sideways ? dw : dh;
  const ctx = canvas.getContext('2d', { willReadFrequently: treatment !== 'color' });
  if (!ctx) return canvas;
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  ctx.translate(canvas.width / 2, canvas.height / 2); ctx.rotate(rotation * Math.PI / 180);
  ctx.drawImage(image, sx, sy, sw, sh, -dw / 2, -dh / 2, dw, dh);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  if (treatment !== 'color') {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height), data = pixels.data;
    for (let i = 0; i < data.length; i += 4) {
      let gray = Math.round(data[i] * .299 + data[i + 1] * .587 + data[i + 2] * .114);
      if (treatment === 'contrast') gray = Math.max(0, Math.min(255, Math.round((gray - 128) * 1.8 + 128)));
      else gray = gray >= Number(treatment.slice(1)) ? 255 : 0;
      data[i] = data[i + 1] = data[i + 2] = gray;
    }
    ctx.putImageData(pixels, 0, 0);
  }
  return canvas;
}
async function decodeBarcodeImage(url) {
  if (!window.ZXingBrowser?.BrowserMultiFormatOneDReader) throw new Error('The bar code scanner did not load. Check your connection and try again.');
  const zxing = new window.ZXingBrowser.BrowserMultiFormatOneDReader();
  // Keep the simple path first. It was the most reliable path before enhanced
  // processing was added, and a successful image should not pay for any filters.
  let value = await decodeBarcodeSource(url, null, zxing, true);
  if (value) return value;
  const nativeDetector = await nativeBarcodeDetector();
  let image;
  try { image = await loadBarcodeImage(url); } catch (_) { return null; }
  if (nativeDetector) {
    try {
      const found = await nativeDetector.detect(image);
      for (const result of found || []) { value = barcodeText(result); if (value) return value; }
    } catch (_) { /* continue with enhanced canvases */ }
  }
  const attempts = [
    [.85, 0, 'color'], [.65, 0, 'color'], [1, 90, 'color'], [1, 270, 'color'], [1, 180, 'color'],
    [.8, 90, 'color'], [.8, 270, 'color'], [1, 0, 'contrast'], [.8, 0, 'contrast'],
    [1, 90, 'contrast'], [1, 270, 'contrast'], [.8, 0, 't110'], [.8, 0, 't150'], [.8, 0, 't190']
  ];
  for (const [crop, rotation, treatment] of attempts) {
    value = await decodeBarcodeSource(barcodeVariant(image, crop, rotation, treatment), nativeDetector, zxing);
    if (value) return value;
    await new Promise(resolve => setTimeout(resolve, 0));
  }
  return null;
}
async function scanBarcodePhoto(file) {
  const sc = S.scan;
  if (!file || !realBarcode(sc) || sc.stage === 'analyzing') return;
  const generation = accountGeneration;
  const current = () => S.scan === sc && generation === accountGeneration;
  const fail = message => { if (!current()) return; sc.stage = 'error'; sc.error = message; render(); };
  sc.stage = 'analyzing'; sc.error = null; render();
  let image;
  try { image = await barcodeFileData(file); } catch (error) { fail(error.message); return; }
  if (!current()) return;
  sc.preview = image; render();
  try {
    let barcode = await decodeBarcodeImage(image);
    // Some phone photo formats do not load directly into an HTML image even
    // though createImageBitmap can decode them. Reuse the former, known-good
    // JPEG normalization path before giving up.
    if (!barcode) {
      let normalized = null;
      try { normalized = await photoImage(file); } catch (_) {}
      if (normalized && normalized !== image && current()) {
        sc.preview = normalized; render();
        barcode = await decodeBarcodeImage(normalized);
      }
    }
    if (!current()) return;
    if (!barcode) throw new Error("We couldn't read a bar code in that photo. Try a closer, sharper picture.");
    await lookupBarcode(barcode, sc);
  } catch (error) {
    fail(error.message && !/NotFoundException/i.test(error.name || '')
      ? error.message
      : "We couldn't read a bar code in that photo. Try a closer, sharper picture.");
  }
}
async function lookupBarcode(rawBarcode, sc) {
  if (S.scan !== sc || !['camera', 'analyzing', 'error'].includes(sc.stage)) return;
  const barcode = String(rawBarcode || '').replace(/\D/g, '');
  sc.stage = 'analyzing'; sc.error = null; sc.barcode = barcode; render();
  const generation = accountGeneration;
  const current = () => S.scan === sc && generation === accountGeneration;
  const fail = message => { if (!current()) return; sc.stage = 'error'; sc.error = message; render(); };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const { data, error } = await sb.auth.getSession();
    if (error || !data.session?.access_token) throw new Error('Please sign in again to scan bar codes.');
    const response = await fetch(`${CFG.supabaseUrl}/functions/v1/barcode-lookup`, {
      method: 'POST', signal: controller.signal,
      headers: { 'Content-Type': 'application/json', apikey: CFG.supabaseKey, Authorization: `Bearer ${data.session.access_token}` },
      body: JSON.stringify({ barcode })
    });
    let result = {};
    try { result = await response.json(); } catch (_) {}
    if (!response.ok) throw new Error(result.error || 'Bar code lookup is unavailable. Try again.');
    if (!current()) return;
    if (!result.barcode || barcodeKey(result.barcode) !== barcodeKey(barcode)) {
      throw new Error('The product lookup returned information for a different bar code. Nothing was added.');
    }
    const item = result.item || {};
    const brand = String(item.brand || '').trim();
    const productName = String(item.product_name || '').trim();
    const name = composeItemName(String(item.name || '').trim(), brand, productName);
    const cat = normalizeCategory(name, item.category);
    const store = ['Fridge', 'Pantry', 'Freezer'].includes(item.storage) ? item.storage : 'Pantry';
    const unit = UNITS_US.includes(item.unit) ? item.unit : 'ct';
    const numericQty = Number(item.quantity);
    const qty = Number.isFinite(numericQty) && numericQty > 0 && numericQty <= 10000 ? numericQty : 1;
    const lookupSource = item.source === 'Open Food Facts' ? 'Open Food Facts' : 'USDA FoodData Central';
    if (!name || !/[a-z]/i.test(name) || /^(?:unknown|product|food|n\/?a|none|null|not available)$/i.test(name)) {
      throw new Error('The product database returned this bar code without a usable product name. Nothing was added.');
    }
    const detected = { tid: 't' + (uid++), name, brand, productName, emoji: guessEmoji(name), cat, unit, qty, pkg: null, store,
      src: 'ai', exp: estimate(cat, store, name), on: true, barcode, lookupSource };
    sc.items = [detected]; sc.stage = 'review'; render();
    openItemForm({ ...detected, id: detected.tid }, 'review');
  } catch (error) {
    fail(error.name === 'AbortError' ? 'The USDA lookup took too long. Try again.' : error.message);
  } finally { clearTimeout(timer); }
}
function buildDetected(mode) {
  return DETECT[mode].map(d => ({
    tid: 't' + (uid++), name: d.name, brand: d.brand || '', productName: d.productName || '', emoji: d.emoji, cat: d.cat, unit: d.unit, qty: d.qty && mode !== 'receipt' ? 1 : 1,
    pkg: d.qty || null, store: d.store, src: d.src,
    exp: d.src === 'label' ? inDays(d.d) : estimate(d.cat, d.store, d.name), on: true
  }));
}
function renderReview() {
  const sc = S.scan;
  const on = sc.items.filter(i => i.on).length;
  const srcLine = { pantry: 'your fridge photo', receipt: `your ${esc(sc.storeName || S.store)} receipt`, barcode: 'the bar code' }[sc.mode];
  const now = new Date();
  return `<div class="appbar" style="padding-bottom:4px"><button class="back" data-act="scanCancel">${ic('left')} Cancel</button></div>
  <div class="scroll">
    <div class="review-h"><h1>${sc.mode === 'barcode' ? 'Does this look right?' : `We found ${plural(sc.items.length, 'item')}`}</h1><p>From ${srcLine} · ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}. Check each field before saving.</p></div>
    <div class="pad" style="display:grid;gap:10px">${sc.items.map(reviewCard).join('')}</div>
    <div class="pad" style="padding-top:12px"><button class="btn btn-ghost" data-act="manualInReview">${ic('plus')} Add something we missed</button></div>
    <div style="height:20px"></div>
  </div>
  <div class="sheet-foot" style="background:var(--surface);padding-bottom:12px"><button class="btn btn-primary" data-act="confirmScan" ${on ? '' : 'disabled'}>Add ${plural(on, 'item')} to MyPantry</button></div>`;
}
function reviewCard(i) {
  const [v, u] = disp(i.qty, i.unit);
  const dups = dupOf(i);
  const tmp = { exp: i.exp };
  const d = daysLeft(tmp);
  return `<div class="rv ${i.on ? '' : 'off'}" data-tid="${i.tid}">
    <div class="rv-top">${imgHtml(i)}<div><b>${esc(i.name)}</b><span class="cat-l">${i.cat}${i.pkg ? ` · ${qtyText(i.pkg, i.unit)} size` : ''}${i.lookupSource ? ` · ${esc(i.lookupSource)}` : ''}${i.barcode ? ` · UPC/EAN ${esc(i.barcode)}` : ''}${i.receiptText ? ` · <span class="rc-line">${esc(i.receiptText)}</span>` : ''}</span></div>
      <div style="display:flex;gap:6px">${i.on ? `<button class="mini-btn" data-act="reviewEdit" data-arg="${i.tid}">Edit</button><button class="mini-btn" data-act="reviewToggle" data-arg="${i.tid}" aria-label="Remove ${esc(i.name)}">${'Remove'}</button>` : `<button class="mini-btn" data-act="reviewToggle" data-arg="${i.tid}">Add back</button>`}</div></div>
    ${i.on ? `<div class="rv-bottom">
      <div class="stepper"><button data-act="qty" data-arg="${i.tid}|-1" aria-label="Decrease">−</button><input class="num" value="${v}" inputmode="decimal" data-qty="${i.tid}" aria-label="Quantity for ${esc(i.name)}"><span class="u">${unitWord(v, u)}</span><button data-act="qty" data-arg="${i.tid}|1" aria-label="Increase">+</button></div>
      <div class="rv-date">Spoils <b class="num">${fmtDate(i.exp)}</b> <span class="hint">(${plural(d, 'day')})</span><br><span class="src ${i.src === 'label' ? 'label' : 'ai'}">${i.src === 'label' ? 'Read from label' : 'Estimated reminder'}</span></div>
    </div>
    <div class="rv-bottom"><span class="hint">Stored in</span><div class="store-sel">${['Fridge', 'Pantry', 'Freezer'].map(s => `<button class="${s === i.store ? 'on' : ''}" data-act="reviewStore" data-arg="${i.tid}|${s}">${s}</button>`).join('')}</div></div>
    ${dups.length ? `<div class="dup">${ic('alert')}<span>You already have ${dups.map(x => `${qtyText(x.qty, x.unit)} (${status(daysLeft(x)).label.toLowerCase()})`).join(' and ')}. Check whether these are new packages or ones you've already counted.</span></div>` : ''}` : ''}
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
const REEL_BATCH = 8;
// Reels you can cook now come first, then ones missing one or two items, then the rest
// of the catalog ranked by how much of it you already own and what you tend to like.
function rankReels() {
  const can = makeable();
  const others = recipeCandidates().filter(r => !canMake(r)).map(r => {
    const miss = missingOf(r).length;
    return { r, miss, have: (r.ing.length - miss) / r.ing.length, seen: S.watched.has(r.id) ? 1 : 0 };
  });
  const isNear = x => x.miss <= 2 && x.have > 0;
  const near = others.filter(isNear).sort((a, b) => a.miss - b.miss || a.seen - b.seen || score(b.r) - score(a.r));
  const rest = others.filter(x => !isNear(x)).sort((a, b) => a.seen - b.seen || b.have - a.have || score(b.r) - score(a.r));
  return { can: can.map(r => r.id), near: near.map(x => x.r.id), rest: rest.map(x => x.r.id) };
}
// Feed entries are recipe ids, plus "card:<kind>" cards. By default the feed shows only
// recipes you can make; "Show more recipes" adds the ones that need more ingredients,
// closest first.
function feedEntries(rank) {
  const extra = [...rank.near, ...rank.rest];
  if (!S.reelMore) return rank.can.length && extra.length ? [...rank.can, 'card:offer'] : [...rank.can];
  return [...rank.can, ...(extra.length ? ['card:more', ...extra] : []), 'card:end'];
}
function reelsUseDarkChrome() {
  if (S.tab !== 'reels' || S.reelView === 'saved') return false;
  return feedEntries(rankReels()).length > 0;
}
function reelSeg() {
  const n = S.saved.size, v = S.reelView || 'feed';
  const tab = (key, label) => `<button role="tab" class="${v === key ? 'on' : ''}" aria-selected="${v === key}" data-act="reelView" data-arg="${key}">${label}</button>`;
  return `<div class="reel-seg" role="tablist" aria-label="Reels view">${tab('feed', 'For you')}${tab('saved', `Saved${n ? ` <span class="num">${n}</span>` : ''}`)}</div>`;
}
const MORE_BTN = 'Show recipes that need more ingredients';
function renderReels() {
  if (S.reelView === 'saved') return renderSaved();
  const rank = rankReels();
  reelOrder = feedEntries(rank);
  const addBtn = `<button class="btn btn-sm" style="background:#fff;color:#111" data-act="tab" data-arg="scan">${ic('camera')} Add food</button>`;
  const hasExtra = rank.near.length + rank.rest.length > 0;
  if (!reelOrder.length) {
    return `<div class="reels empty-mode"><div class="reels-top"><div><h1>Recipe Reels</h1></div>${reelSeg()}</div>
      <div class="reels-empty"><div><div class="big-illus">🍳</div><p>You don't have enough ingredients to make anything yet. Try adding more food to your pantry</p>
      <div class="reels-empty-btns">${addBtn}${hasExtra ? `<button class="btn btn-sm reel-ghost-btn" data-act="reelMore" data-arg="on">${MORE_BTN}</button>` : ''}</div></div></div></div>`;
  }
  S.reelShown = Math.min(reelOrder.length, Math.max(REEL_BATCH, S.reelShown || 0));
  const summary = rank.can.length ? `${plural(rank.can.length, 'recipe')} you can make now` : 'Nothing you can make yet';
  const toggle = S.reelMore && hasExtra
    ? `<button class="reel-add" data-act="reelMore" data-arg="off">${ic('x')} Hide recipes I can't make</button>`
    : '';
  return `<div class="reels"><div class="reels-top"><div><h1>Recipe Reels</h1>
      <div class="sub reel-count">${summary}${toggle ? ` ${toggle}` : ''}</div>
      <div class="sub" id="learnChip">${learnText()}</div></div>${reelSeg()}</div>
    <div class="reel-feed" id="reelFeed">${reelOrder.slice(0, S.reelShown).map(entryHtml).join('')}</div></div>`;
}
const entryHtml = e => e.startsWith('card:') ? reelCard(e.slice(5)) : (R(e) ? reelHtml(R(e)) : '');
function reelCard(kind) {
  const W = 'background:#fff;color:#111';
  const C = {
    offer: ['✅', "That's everything you can make right now", 'Want more ideas? See recipes you could make with a few more ingredients, closest first.',
      `<button class="btn btn-sm" style="${W}" data-act="reelMore" data-arg="on">${MORE_BTN}</button>`],
    more: ['🛒', 'Recipes that need more ingredients', "Sorted by how close you are. Each one shows what's missing. Save any you like for your next grocery trip.",
      '<div class="reel-card-hint">Swipe up</div>'],
    end: ['✅', "You're all caught up", 'New reels show up as your pantry changes.',
      `<button class="btn btn-sm" style="${W}" data-act="tab" data-arg="scan">${ic('camera')} Add food</button>`]
  }[kind];
  if (!C) return '';
  return `<article class="reel reel-card" data-id="card-${kind}" aria-label="${esc(C[1])}">
    <div class="reel-card-in"><div class="reel-card-em" aria-hidden="true">${C[0]}</div><h2>${esc(C[1])}</h2><p>${esc(C[2])}</p>${C[3]}</div></article>`;
}
function renderSaved() {
  const list = [...S.saved].map(R).filter(Boolean);
  const pantryReady = sync === 'synced';
  const body = !list.length
    ? `<div class="reels-empty"><div><div class="big-illus">🔖</div><p>No saved recipes yet.</p><span class="saved-hint">Tap Save on any reel and it will show up here, even after you use up the ingredients.</span>
        <button class="btn btn-sm" style="background:#fff;color:#111" data-act="reelView" data-arg="feed">Browse reels</button></div></div>`
    : `<div class="saved-list">${list.map(r => {
        const miss = pantryReady ? shopNeeds(r) : [];
        const blocked = matchingRecipeAllergies(r);
        const ok = pantryReady && !miss.length && !blocked.length;
        return `<div class="saved-card">
          <button class="saved-main" data-act="recipe" data-arg="${r.id}" data-source="reels" aria-label="Open ${esc(r.name)}">
            <span class="saved-thumb" style="background:${r.bg}">${r.emoji}</span>
            <span class="saved-txt"><b>${esc(r.name)}</b><span>${r.time} min · Easy · ${r.type}</span>
              <span class="saved-status ${ok ? 'can' : 'cant'}">${blocked.length ? `Matches your allergy list: ${esc(blocked.map(allergyLabel).join(', '))}` : !pantryReady ? 'Pantry unavailable; check again soon' : ok ? `${ic('check')} Ingredients appear to be on hand` : `Check ${esc(miss.map(({ ingredient }) => needName(ingredient)).join(', '))}`}</span></span>
          </button>
          <div class="saved-actions">
            ${pantryReady && !blocked.length ? ok ? `<button class="sa-primary" data-act="useAsk" data-arg="${r.id}" data-source="reels">I used this recipe</button>` : `<button class="sa-ghost" data-act="askMissing" data-arg="${r.id}">Shop ingredients</button>` : ''}
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
  const miss = missingOf(r), ok = !miss.length;
  const needs = miss.slice(0, 3).map(needName).join(', ') + (miss.length > 3 ? ` +${miss.length - 3} more` : '');
  return `<article class="reel" data-id="${esc(r.id)}" aria-label="${esc(r.name)}">
    <div class="reel-bg" style="background:${r.bg}"></div>
    ${r.video ? `<video class="reel-video" src="${esc(r.video)}" muted loop playsinline preload="metadata"></video>` : `<div class="reel-steam"><i></i><i></i><i></i></div>
    <div class="reel-dish" aria-hidden="true">${r.emoji}</div>
    <div class="reel-caption" data-si="0"><span class="stepno">Step 1 of ${r.steps.length}</span>${esc(r.steps[0])}</div>`}
    <div class="reel-tap" data-act="reelTap" data-arg="${esc(r.id)}"></div>
    <div class="rail">
      <button class="${liked ? 'on' : ''}" data-act="like" data-arg="${esc(r.id)}" aria-pressed="${liked}"><span class="ri">${ic('heart', liked)}</span><span class="num">${fmtK(likeCount(r))}</span></button>
      <button class="${saved ? 'saved' : ''}" data-act="save" data-arg="${esc(r.id)}" aria-pressed="${saved}"><span class="ri">${ic('bookmark', saved)}</span>${saved ? 'Saved' : 'Save'}</button>
      <button data-act="share" data-arg="${esc(r.id)}"><span class="ri">${ic('share')}</span>Share</button>
      <button data-act="recipe" data-arg="${esc(r.id)}" data-source="reels"><span class="ri">${ic('list')}</span>Recipe</button>
    </div>
    <div class="reel-info">
      <h2>${esc(r.name)}</h2>
      <div class="reel-meta"><span>⏱ ${r.time} min</span><span>Easy</span><span>${esc(r.type)}</span><span>Serves ${r.serves}</span></div>
      ${ok ? `<div class="have">${ic('check')} You have all ${r.ing.length} ingredients</div>`
        : `<div class="need-row"><span class="need-ic">${ic('store')}</span><span><b>Need ${esc(needs)}</b><small>You have ${r.ing.length - miss.length} of ${r.ing.length} ingredients</small></span></div>`}
      ${spoiled ? `<div class="reel-warn red">Check your ${esc(spoiled.name.toLowerCase())}. It passed its date ${fmtDate(spoiled.exp)}.</div>` : soon ? `<div class="reel-warn">Uses your ${esc(soon.name.toLowerCase())} before it spoils (${plural(daysLeft(soon), 'day')})</div>` : ''}
      ${ok ? `<div class="used-row"><button class="u1" data-act="useAsk" data-arg="${esc(r.id)}" data-source="reels">I used this recipe</button><button class="u2" data-act="notYet" data-arg="${esc(r.id)}">Not yet</button></div>`
        : `<div class="used-row"><button class="u1" data-act="askNeed" data-arg="${esc(r.id)}">Ask for a swap</button><button class="u2" data-act="nextReel" data-arg="${esc(r.id)}">Next</button></div>`}
    </div>
    <div class="reel-progress"><i></i></div>
  </article>`;
}
const fmtK = n => n >= 1000 ? (n / 1000).toFixed(1).replace('.0', '') + 'K' : String(n);
function mountReels() {
  const feed = $('#reelFeed'); if (!feed) return;
  const ctl = { active: null, t: {}, paused: false };
  const playActive = () => $$('.reel', feed).forEach(el => {
    const v = el.querySelector('.reel-video'); if (!v) return;
    if (el.dataset.id === ctl.active && !ctl.paused) v.play?.()?.catch?.(() => {}); else v.pause?.();
  });
  ctl.io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting && en.intersectionRatio >= .6) {
      ctl.active = en.target.dataset.id; ctl.paused = false;
      $$('.reel', feed).forEach(r => { r.classList.remove('paused'); r.querySelector('.play-ind')?.remove(); });
      playActive();
    }
  }), { root: feed, threshold: [.6] });
  $$('.reel', feed).forEach(r => ctl.io.observe(r));
  // Load the next batch of reels as the viewer nears the end of what is rendered.
  ctl.more = () => {
    if (S.reelShown >= reelOrder.length || feed.scrollTop + feed.clientHeight * 2 < feed.scrollHeight) return;
    const next = reelOrder.slice(S.reelShown, S.reelShown + REEL_BATCH);
    S.reelShown += next.length;
    feed.insertAdjacentHTML('beforeend', next.map(entryHtml).join(''));
    $$('.reel', feed).slice(-next.length).forEach(r => ctl.io.observe(r));
  };
  feed.addEventListener('scroll', ctl.more, { passive: true });
  ctl.playActive = playActive;
  ctl.timer = setInterval(() => {
    if (!ctl.active || ctl.paused || document.hidden) return;
    const id = ctl.active, el = feed.querySelector(`.reel[data-id="${id}"]`); if (!el) return;
    const r = R(id); if (!r) return;
    const L = Math.max(12, r.steps.length * 3.2);
    ctl.t[id] = (ctl.t[id] || 0) + .1;
    const t = ctl.t[id] % L;
    el.querySelector('.reel-progress i').style.width = (t / L * 100) + '%';
    const n = r.steps.length, si = Math.min(n - 1, Math.floor(t / (L / n)));
    const cap = el.querySelector('.reel-caption');
    if (cap && cap.dataset.si != si) { cap.dataset.si = si; cap.innerHTML = `<span class="stepno">Step ${si + 1} of ${n}</span>${esc(r.steps[si])}`; }
    if (ctl.t[id] >= 5 && !S.watched.has(id)) { S.watched.add(id); learn(r); }
  }, 100);
  reelCtl = ctl;
}
function unmountReels() { if (reelCtl) { clearInterval(reelCtl.timer); reelCtl.io.disconnect(); $('#reelFeed')?.removeEventListener('scroll', reelCtl.more); reelCtl = null; } }

function recipeSheet(r, source = 'reels') {
  const pantryReady = sync === 'synced';
  const blocked = matchingRecipeAllergies(r);
  const shopNeeded = !blocked.length && pantryReady && shopNeeds(r).length > 0;
  const canUse = !blocked.length && pantryReady && canMake(r) && !shopNeeded;
  const suggestedSubstitution = !blocked.length && pantryReady
    ? missingOf(r).map(ingredient => safeSubstitution(r, ingredient)).find(Boolean)
    : null;
  return `<div class="sheet-head"><h2>${esc(r.name)}</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body">
    <div class="recipe-hero" style="background:${r.bg}">${r.emoji}</div>
    ${blocked.length ? `<div class="allergy-warning">${ic('alert')}<span><b>Matches your allergy list</b>${esc(blocked.map(allergyLabel).join(', '))}. Check every product label and preparation method before eating.</span></div>` : ''}
    <div class="tagrow"><span class="tag">⏱ ${r.time} min</span><span class="tag">Easy</span><span class="tag">${r.type}</span><span class="tag">Serves ${r.serves}</span></div>
    <div><div class="lbl" style="margin-bottom:4px">Ingredients ${canUse ? `· you have all ${r.ing.length}` : ''}</div>
    <ul class="ing-list">${r.ing.map(g => {
      const matches = pantryReady ? findItems(g.m) : [], it = matches.find(item => daysLeft(item) >= 0);
      const checkDate = !it && matches.length > 0;
      const sub = !it && !checkDate && safeSubstitution(r, g);
      return `<li><span class="em">${it ? (it.emoji || '📦') : '➖'}</span><span>${esc(g.label)}<span class="amt">${!pantryReady ? 'Pantry not loaded' : it ? `Listed: ${qtyText(it.qty, it.unit)}${matches.length > 1 ? ' and more' : ''}` : checkDate ? 'Matching pantry food needs a date check' : sub ? 'Missing; see substitution below' : 'Not on your pantry list'}</span></span>${it ? pillFor(it) : `<span class="pill soon">${!pantryReady ? 'Wait' : checkDate ? 'Check' : 'Need'}</span>`}</li>`;
    }).join('')}</ul></div>
    ${suggestedSubstitution && !canUse ? `<div class="sub-card">${esc(suggestedSubstitution.text)}</div>` : ''}
    <div><div class="lbl" style="margin-bottom:6px">Steps</div><ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol></div>
  </div>
  <div class="sheet-foot">${canUse ? `<button class="btn btn-primary" data-act="useAsk" data-arg="${r.id}" data-source="${source}">I used this recipe</button>` : ''}
    ${shopNeeded ? `<button class="btn btn-soft" data-act="shopForRecipe" data-arg="${esc(r.id)}">Shop ingredients</button>` : ''}
    <button class="btn btn-ghost" data-act="save" data-arg="${r.id}">${S.saved.has(r.id) ? 'Saved to your library' : 'Save recipe'}</button></div>`;
}
function useSheet(r, source = 'reels') {
  const log = previewUse(r);
  return `<div class="sheet-head"><h2>Did you make ${esc(r.name)}?</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body"><p style="margin:0;color:var(--ink-2)">We'll take these out of your Ingredients so you don't have to:</p>
    <ul class="ing-list">${log.map(l => `<li><span class="em">${l.emoji || '📦'}</span><span>${esc(l.name)}<span class="amt num">${qtyText(l.from, l.unit)} → ${l.to <= .001 ? 'used up' : qtyText(l.to, l.unit)}</span></span><span></span></li>`).join('')}</ul></div>
  <div class="sheet-foot"><button class="btn btn-primary" data-act="useConfirm" data-arg="${r.id}" data-source="${source}">Yes, update my pantry and log recipe</button><button class="btn btn-ghost" data-act="useNot">Not yet</button></div>`;
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
// These are retailer-owned offer pages. MyPantry does not receive their prices or stock.
const STORE_OFFER_LINKS = {
  "Smith's": {
    url: 'https://www.smithsfoodanddrug.com/weeklyad', label: 'weekly ad',
    fallbackUrl: 'https://www.smithsfoodanddrug.com/savings/', fallbackLabel: 'Smith\'s savings page'
  },
  Walmart: { url: 'https://www.walmart.com/shop/deals/instore', label: 'in-store deals' },
  Harmons: { url: 'https://shop.harmonsgrocery.com/store/harmons/flyers/view/weekly/print', label: 'weekly ad' },
  Costco: { url: 'https://www.costco.com/o/-/warehouse-savings', label: 'warehouse savings' },
  Sprouts: { url: 'https://shop.sprouts.com/store/sprouts/flyers/view/weekly/print', label: 'weekly ad' }
};
function shopWords(value) {
  return (String(value).toLowerCase().replace(/\([^)]*\)/g, '').match(/[a-z0-9]+/g) || []).map(word => {
    if (word.length > 4 && word.endsWith('ies')) return word.slice(0, -3) + 'y';
    if (word.length > 4 && /(ches|shes|xes|zes|oes)$/.test(word)) return word.slice(0, -2);
    if (word.length > 3 && word.endsWith('s') && !word.endsWith('ss')) return word.slice(0, -1);
    return word;
  });
}
// Keep broad food names from matching a different product made with that food.
const SHOP_EXCLUDES = {
  chicken: ['broth', 'stock', 'soup', 'sauce', 'sausage', 'nugget'],
  beef: ['broth', 'stock', 'soup', 'sauce', 'jerky'],
  pork: ['broth', 'stock', 'soup', 'sauce', 'sausage'],
  rice: ['cake', 'noodle', 'milk', 'flour', 'cereal'],
  bread: ['crumb', 'flour', 'pudding'],
  cream: ['cheese', 'soup', 'soda', 'ice'],
  milk: ['chocolate', 'powder', 'shake'],
  butter: ['peanut', 'almond', 'cashew', 'sunflower', 'cookie', 'cocoa']
};
function matchingFoodItems(m) {
  const alternatives = altsOf(m).map(key => ({ words: shopWords(key), category: foodCategory(key) }));
  return S.inv.filter(item => item.qty > 0 && alternatives.some(alt => {
    const words = shopWords(item.name), category = foodCategory(item.name);
    if (!alt.words.length || !words.some((_, at) => alt.words.every((word, offset) => words[at + offset] === word))) return false;
    if (alt.category !== 'Other' && category !== 'Other' && alt.category !== category) return false;
    if (alt.words.length === 1 && SHOP_EXCLUDES[alt.words[0]]?.some(word => words.includes(word))) return false;
    return true;
  })).sort(byExp);
}
function shopNeeds(r) {
  return r.ing.flatMap(ingredient => {
    const matching = findItems(ingredient.m);
    if (matching.some(item => daysLeft(item) >= 0)) return [];
    return [{ ingredient, checkExisting: matching.length > 0 }];
  });
}
function shopRecipeChoices() {
  const options = recipeCandidates().map(r => {
    const needs = shopNeeds(r);
    return { r, needs, owned: r.ing.length - needs.length };
  }).filter(option => option.needs.length);
  const byFit = (a, b) => a.needs.length - b.needs.length || b.owned - a.owned || score(b.r) - score(a.r) || a.r.name.localeCompare(b.r.name);
  const saved = options.filter(option => S.saved.has(option.r.id)).sort(byFit);
  const near = options.filter(option => !S.saved.has(option.r.id) && option.owned > 0 && option.needs.length <= 3).sort(byFit);
  const other = options.filter(option => !S.saved.has(option.r.id) && !(option.owned > 0 && option.needs.length <= 3)).sort(byFit);
  return [...saved, ...near, ...other].slice(0, 6);
}
function sw(id, on, label) { return `<span class="switch"><input type="checkbox" id="${id}" ${on ? 'checked' : ''} aria-label="${label}"><span></span></span>`; }
function renderAccountSettings(kind) {
  if (kind === 'email') return `<div class="appbar"><button class="back" data-act="dealsBack">${ic('left')} Settings</button></div>
    <div class="scroll"><form class="auth" id="emailForm" novalidate>
      <h1>Change email</h1>
      <p>Current email: ${esc(S.user?.email || '')}</p>
      <p>Confirm the links sent to your current and new email addresses to finish the change. Your pantry stays with this account.</p>
      ${S.user?.pendingEmail ? `<p class="hint">Pending email: ${esc(S.user.pendingEmail)}</p>` : ''}
      <div class="err" id="emailErr" role="alert" hidden><span></span></div>
      <div class="ok" id="emailOk" role="status" hidden><span></span></div>
      <div class="field"><label for="accountEmail">New email</label><input class="input" id="accountEmail" type="email" autocomplete="email" maxlength="254" required></div>
      <div class="field"><label for="accountEmailConfirm">Confirm new email</label><input class="input" id="accountEmailConfirm" type="email" autocomplete="email" maxlength="254" required></div>
      <button class="btn btn-primary" type="submit">Send confirmation links</button>
      <button class="btn btn-ghost" type="button" data-act="dealsBack">Back to Settings</button>
    </form></div>`;
  const username = kind === 'username';
  return `<div class="appbar"><button class="back" data-act="dealsBack">${ic('left')} Settings</button></div>
  <div class="scroll"><form class="auth" id="${username ? 'usernameForm' : 'passwordForm'}" novalidate>
    <h1>${username ? 'Change username' : 'Change password'}</h1>
    <p>${username ? 'This is the name shown in MyPantry. You will still sign in with your email.' : 'Use at least 8 characters and one symbol, such as ! or #.'}</p>
    <div class="err" id="accountErr" role="alert" hidden><span></span></div>
    ${username ? `<div class="field"><label for="accountName">Username</label><input class="input" id="accountName" type="text" autocomplete="nickname" maxlength="40" value="${esc(S.user?.name || '')}" required><span class="hint">1–40 characters</span></div>` : `<div class="field"><label for="accountPassword">New password</label><input class="input" id="accountPassword" type="password" autocomplete="new-password" minlength="8" required></div>
    <div class="field"><label for="accountConfirm">Confirm new password</label><input class="input" id="accountConfirm" type="password" autocomplete="new-password" minlength="8" required></div>`}
    <button class="btn btn-primary" type="submit">${username ? 'Save username' : 'Save password'}</button>
    <button class="btn btn-ghost" type="button" data-act="dealsBack">Cancel</button>
  </form></div>`;
}
function profileAvatar(url, name, className = 'av') {
  const initial = String(name || 'User').trim().charAt(0).toUpperCase() || 'U';
  return `<div class="${className}">${url ? `<img src="${esc(url)}" alt="${esc(name || 'User')}'s profile photo">` : esc(initial)}</div>`;
}
function renderProfileSettings() {
  const u = S.user || { name: 'User', email: '' };
  if (S.profileCamera) {
    const live = S.profileCamera.state !== 'fallback';
    const scene = live
      ? `<video id="profileCameraFeed" class="camera-feed profile-camera-feed" autoplay muted playsinline aria-label="Live front camera preview"></video>${S.profileCamera.state === 'requesting' ? '<div class="camera-status" role="status"><div class="spinner"></div>Starting camera…</div>' : ''}`
      : `<div class="rc-empty">${ic('camera')}<b>Take a profile photo</b><span>Use your device camera or choose an existing photo.</span></div>`;
    return `<div class="camera profile-camera" role="dialog" aria-label="Take profile photo">
      <div class="cam-top"><button class="close" data-act="profileCameraClose" aria-label="Close camera">${ic('x')}</button><b>Profile photo</b><span style="width:34px"></span></div>
      <div class="profile-viewfinder">${scene}</div>
      <div class="cam-hint">${esc(S.profileCamera.error || (live ? 'Center your face, then tap the shutter.' : 'Choose how you want to add your photo.'))}</div>
      <input type="file" id="profileCameraPick" accept="image/*" capture="user" hidden>
      <input type="file" id="profilePhotoPick" accept="image/*" hidden>
      <div class="cam-bottom"><label class="cam-side" for="profilePhotoPick" aria-label="Choose a photo" title="Choose a photo">${ic('image')}</label>
        ${live ? `<button class="shutter" data-act="profileShutter" aria-label="Take photo" ${S.profileCamera.state === 'live' ? '' : 'disabled'}><i></i></button>` : `<label class="shutter" for="profileCameraPick" aria-label="Open device camera" role="button"><i></i></label>`}
        <span class="cam-side-placeholder" aria-hidden="true"></span></div>
    </div>`;
  }
  const preview = S.profileDraft?.url || u.avatarUrl;
  return `<div class="appbar"><button class="back" data-act="profileBack">${ic('left')} Settings</button></div>
    <div class="scroll"><div class="profile-editor">
      <div class="profile-editor-heading"><h1>Profile photo</h1><p>Add a photo so your account feels like yours. Your photo is stored privately for your account.</p></div>
      ${profileAvatar(preview, u.name, 'profile-avatar-large')}
      ${S.profileError ? `<div class="err" role="alert">${ic('alert')}<span>${esc(S.profileError)}</span></div>` : ''}
      ${S.profileLoading ? '<div class="profile-photo-status" role="status"><div class="spinner"></div>Preparing photo…</div>' : ''}
      <div class="profile-photo-actions">
        <button class="btn btn-ghost" data-act="profileCamera" ${S.profileLoading || S.profileSaving ? 'disabled' : ''}>${ic('camera')} Take a photo</button>
        <label class="btn btn-ghost ${S.profileLoading || S.profileSaving ? 'disabled' : ''}" for="profilePhotoPick">${ic('image')} Choose from device</label>
        <input type="file" id="profilePhotoPick" accept="image/*" hidden ${S.profileLoading || S.profileSaving ? 'disabled' : ''}>
      </div>
      ${S.profileDraft ? `<button class="btn btn-primary" data-act="profileSave" ${S.profileSaving ? 'disabled' : ''}>${S.profileSaving ? 'Saving…' : 'Save profile photo'}</button>` : ''}
      ${u.avatarPath && !S.profileDraft ? `<button class="btn btn-ghost profile-remove" data-act="profileRemove" ${S.profileSaving ? 'disabled' : ''}>Remove current photo</button>` : ''}
    </div></div>`;
}
function renderAllergySettings() {
  const selected = allergyList(S.allergyDraft ?? allergyList());
  const chosen = new Set(selected);
  const presetIds = new Set(ALLERGY_PRESETS.map(item => item.id));
  const custom = selected.filter(item => !presetIds.has(item));
  return `<div class="appbar"><button class="back" data-act="allergyBack">${ic('left')} Settings</button></div>
    <div class="scroll"><div class="allergy-editor">
      <div><h1>Food allergies</h1><p>Select common allergens or add any ingredient you need to avoid.</p></div>
      <div class="allergy-warning">${ic('alert')}<span><b>Use this as a suggestion filter, not a safety guarantee.</b> Recipes and product data may be incomplete, and this cannot detect cross-contact. Always check labels and preparation.</span></div>
      <fieldset class="allergy-presets"><legend>Common allergens</legend><div>${ALLERGY_PRESETS.map(item => `<button type="button" class="allergy-chip ${chosen.has(item.id) ? 'on' : ''}" data-act="allergyToggle" data-arg="${esc(item.id)}" aria-pressed="${chosen.has(item.id)}">${chosen.has(item.id) ? ic('check') : ''}${esc(item.label)}</button>`).join('')}</div></fieldset>
      <form id="allergyForm" class="allergy-custom" novalidate>
        <div class="field"><label for="allergyInput">Add another allergy or ingredient</label><div class="allergy-input-row"><input class="input" id="allergyInput" maxlength="50" placeholder="e.g., Kiwi or sulfites" autocomplete="off"><button class="btn btn-ghost" type="submit">Add</button></div><span class="hint">Add one at a time. Up to 20 entries.</span></div>
        <div class="field-err" id="allergyErr" ${S.allergyError ? '' : 'hidden'}>${esc(S.allergyError || '')}</div>
      </form>
      <div class="allergy-custom-list"><span class="lbl">Custom entries</span>${custom.length ? `<div>${custom.map(item => `<span class="allergy-tag">${esc(allergyLabel(item))}<button type="button" data-act="allergyRemove" data-arg="${esc(item)}" aria-label="Remove ${esc(allergyLabel(item))}">${ic('x')}</button></span>`).join('')}</div>` : '<p>No custom entries added.</p>'}</div>
      <button class="btn btn-primary" data-act="allergySave">Save allergy preferences</button>
      <button class="btn btn-ghost" data-act="allergyBack">Cancel</button>
    </div></div>`;
}
function renderSettings() {
  if (S.setPage === 'profile') return renderProfileSettings();
  if (S.setPage === 'allergies') return renderAllergySettings();
  if (['username', 'password', 'email'].includes(S.setPage)) return renderAccountSettings(S.setPage);
  const u = S.user || { name: 'User', email: '' };
  const row = (icon, tint, color, title, small, right, act, arg) => `<${act ? `button class="set-row" data-act="${act}" ${arg ? `data-arg="${arg}"` : ''}` : 'div class="set-row"'}><span class="si" style="background:${tint};color:${color}">${ic(icon)}</span><span><b>${title}</b>${small ? `<small>${small}</small>` : ''}</span>${right}</${act ? 'button' : 'div'}>`;
  const chev = `<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">${P.right}</svg>`;
  return `<div class="appbar"><div><h1>Settings</h1></div></div>
  <div class="scroll">
    <button class="profile" data-act="editProfile" aria-label="Edit profile photo for ${esc(u.name)}">${profileAvatar(u.avatarUrl, u.name)}<span><b>${esc(u.name)}</b><small>${esc(u.email)}</small></span>${chev}</button>
    <div class="set-group"><span class="lbl">Preferences</span><div class="set-card">
      ${row('palette', 'var(--basil-soft)', 'var(--basil)', 'App theme', APP_THEMES[visualTheme()].name, `<span class="theme-row-value"><span class="theme-row-preview">${APP_THEMES[visualTheme()].colors.map(color => `<i style="background:${color}"></i>`).join('')}</span>${chev}</span>`, 'openTheme')}
      ${row('ruler', 'var(--sky-soft)', 'var(--sky)', 'Use metric units', S.metric ? 'Showing kg, g, L and mL' : 'Showing lb, oz, gal and fl oz', sw('sw_metric', S.metric, 'Use metric units'))}
      ${row('bell', 'var(--butter-soft)', 'var(--butter)', 'Spoil reminders', S.reminders ? 'Notify me 2 days before food spoils' : 'Off', sw('sw_rem', S.reminders, 'Spoil reminders'))}
      ${row('alert', 'var(--tomato-soft)', 'var(--tomato)', 'Food allergies', allergyList().length ? `${plural(allergyList().length, 'item')} avoided in suggestions` : 'None added', chev, 'editAllergies')}
      ${row('lock', 'var(--surface-3)', 'var(--ink-2)', 'Stay signed in', 'Sign out when using a shared device', '')}
    </div></div>
    <div class="set-group"><span class="lbl">Shopping</span><div class="set-card">
      ${row('store', 'var(--basil-soft)', 'var(--basil)', 'Preferred store', 'Used for Shop ideas', `<span class="val">${esc(S.store)} ${chev}</span>`, 'storeSheet')}
      ${row('bookmark', 'var(--sky-soft)', 'var(--sky)', 'Saved recipes', `${plural(S.saved.size, 'recipe')} in your library`, chev, 'openSaved')}
      ${row('tag', 'var(--tomato-soft)', 'var(--tomato)', 'Shop ideas', `Recipe ingredients and ${esc(S.store)} offers`, chev, 'deals')}
    </div></div>
    <div class="set-group"><span class="lbl">Pantry</span><div class="set-card">
      ${row('refresh', 'var(--tomato-soft)', 'var(--tomato)', '<span style="color:var(--tomato)">Reset inventory</span>', 'Remove all food and reset Reels', chev, 'resetAsk')}
    </div></div>
    <div class="set-group"><span class="lbl">Account</span><div class="set-card">
      ${row('pencil', 'var(--surface-3)', 'var(--ink-2)', 'Change username', null, chev, 'changeUsername')}
      ${row('mail', 'var(--surface-3)', 'var(--ink-2)', 'Change email', null, chev, 'changeEmail')}
      ${row('lock', 'var(--surface-3)', 'var(--ink-2)', 'Change password', null, chev, 'changePw')}
      ${row('logout', 'var(--surface-3)', 'var(--ink-2)', 'Log out', null, '', 'logout')}
    </div></div>
    <div class="version">MyPantry version 1.0</div>
  </div>`;
}
async function saveProfilePhoto() {
  const draft = S.profileDraft, owner = S.user?.id, generation = accountGeneration;
  if (!draft || !owner || S.profileSaving) return;
  S.profileSaving = true; S.profileError = null; render();
  try {
    if (!sb || !auth || isDemoAccount()) throw new Error('Profile photos require your own signed-in account.');
    const previousPath = S.user.avatarPath;
    const path = `${owner}/profile-${Date.now()}.jpg`;
    const { error: uploadError } = await sb.storage.from('avatars').upload(path, draft.blob, {
      contentType: 'image/jpeg', cacheControl: '3600', upsert: true
    });
    if (uploadError) throw uploadError;
    await auth.updateAvatarPath(path);
    if (generation !== accountGeneration || S.user?.id !== owner) return;
    S.user.avatarPath = path;
    S.user.avatarUrl = draft.url;
    try {
      const { data, error } = await sb.storage.from('avatars').createSignedUrl(path, 60 * 60);
      if (error) throw error;
      if (data?.signedUrl) S.user.avatarUrl = data.signedUrl;
    } catch (error) { console.warn('[MyPantry] saved profile photo signed URL failed', error); }
    if (previousPath && previousPath !== path) {
      const { error } = await sb.storage.from('avatars').remove([previousPath]);
      if (error) console.warn('[MyPantry] previous profile photo cleanup failed', error);
    }
    S.profileDraft = null; S.profileSaving = false; S.setPage = null; render();
    toast('Profile photo updated.', null, 'check');
  } catch (error) {
    if (generation !== accountGeneration || S.user?.id !== owner) return;
    S.profileSaving = false;
    S.profileError = error.message || 'The profile photo could not be saved. Please try again.';
    render();
  }
}
async function removeProfilePhoto() {
  const owner = S.user?.id, path = S.user?.avatarPath, generation = accountGeneration;
  if (!owner || !path || S.profileSaving) return;
  S.profileSaving = true; S.profileError = null; render();
  try {
    if (!sb || !auth || isDemoAccount()) throw new Error('Profile photos require your own signed-in account.');
    const { error } = await sb.storage.from('avatars').remove([path]);
    if (error) throw error;
    await auth.updateAvatarPath(null);
    if (generation !== accountGeneration || S.user?.id !== owner) return;
    S.user.avatarPath = null; S.user.avatarUrl = null; S.profileSaving = false; S.setPage = null; render();
    toast('Profile photo removed.', null, 'check');
  } catch (error) {
    if (generation !== accountGeneration || S.user?.id !== owner) return;
    S.profileSaving = false;
    S.profileError = error.message || 'The profile photo could not be removed. Please try again.';
    render();
  }
}
function renderDeals() {
  const pantryReady = sync === 'synced';
  const choices = pantryReady ? shopRecipeChoices() : [];
  const focused = pantryReady && S.shopRecipeId ? R(S.shopRecipeId) : null;
  const plan = focused && shopNeeds(focused).length ? focused : choices[0]?.r;
  const needs = plan ? shopNeeds(plan) : [];
  const otherChoices = choices.filter(option => option.r.id !== plan?.id).slice(0, 3);
  const offer = Object.hasOwn(STORE_OFFER_LINKS, S.store) ? STORE_OFFER_LINKS[S.store] : null;
  const returnLabel = { home: 'Home', ing: 'Ingredients', scan: 'Scan food', reels: 'Reels', settings: 'Settings' }[S.shopReturnTab] || 'Settings';
  const planHtml = !pantryReady ? `<div class="shop-empty" role="status">${sync === 'error' ? 'Your pantry could not be loaded, so shopping ideas are paused. Try again before deciding what to buy.' : 'Waiting for your pantry to sync before suggesting ingredients…'}${sync === 'error' ? '<button class="btn btn-ghost" data-act="shopRetry">Try loading pantry again</button>' : ''}</div>`
    : plan ? `<div class="shop-plan-card">
      <div class="shop-plan-title"><span aria-hidden="true">${esc(plan.emoji || '🍽️')}</span><div><b>${esc(plan.name)}</b><small>${plan.ing.length - needs.length} of ${plan.ing.length} ingredients match pantry items whose listed dates have not passed</small></div></div>
      <div class="shop-need-list">${needs.map(({ ingredient, checkExisting }) => `<div class="shop-need"><span aria-hidden="true">${guessEmoji(needName(ingredient)) || '🛒'}</span><div><b>${esc(needName(ingredient))}</b><small>${checkExisting ? 'Matching pantry food needs a date check' : 'Not on your pantry list'}</small></div></div>`).join('')}</div>
      <p>Check quantities and your food before buying. Listed dates alone cannot confirm whether food is safe.</p>
      <button class="btn btn-ghost" data-act="recipe" data-arg="${esc(plan.id)}">View recipe</button>
    </div>` : `<div class="shop-empty">No ingredient names appear to be missing from the current recipes. Check quantities and dates before your next trip, or save a recipe to plan another meal.</div>`;
  const optionsHtml = otherChoices.map(option => `<button class="shop-recipe-choice" data-act="shopPlan" data-arg="${esc(option.r.id)}" aria-label="Plan ${esc(option.r.name)}">
      <span aria-hidden="true">${esc(option.r.emoji || '🍽️')}</span><span><b>${esc(option.r.name)}</b><small>${S.saved.has(option.r.id) ? 'Saved recipe · ' : ''}${plural(option.needs.length, 'ingredient')} to check</small></span>${ic('right')}
    </button>`).join('');
  return `<div class="appbar" style="padding-bottom:6px"><button class="back" data-act="shopBack">${ic('left')} ${returnLabel}</button></div>
  <div class="scroll">
    <div class="shop-heading"><h1>Shop ideas</h1><p>Plan a meal with food you already have, then check your store's offers.</p></div>
    <div class="store-banner shop-store"><span>Preferred store</span><b>${esc(S.store)}</b><span>Choose your location on the store website</span><button data-act="storeSheet">Change store</button></div>
    <div class="set-group"><span class="lbl">Ingredients to look for</span>${planHtml}</div>
    ${optionsHtml ? `<div class="set-group"><span class="lbl">Other meals to plan</span><div class="set-card">${optionsHtml}</div></div>` : ''}
    <div class="set-group shop-offers"><span class="lbl">Current store offers</span><div class="shop-offer-card">
      <b>${offer ? `Check ${esc(S.store)} directly` : 'Choose a supported store'}</b><p>MyPantry does not have live prices or stock. Choose your local store on the retailer's site to see its current offers and availability.</p>
      ${offer ? `<a class="btn btn-primary" href="${offer.url}" target="_blank" rel="noopener noreferrer">Open ${esc(S.store)} ${esc(offer.label)} ↗</a>${offer.fallbackUrl ? `<a class="btn btn-ghost shop-fallback" href="${offer.fallbackUrl}" target="_blank" rel="noopener noreferrer">Open ${esc(offer.fallbackLabel)} ↗</a><p class="shop-link-help">If Smith's blocks the weekly ad, try its savings page or open Smith's directly in your browser or app. You may need to sign in and choose your local store.</p>` : ''}` : '<button class="btn btn-primary" data-act="storeSheet">Choose a store</button>'}
    </div></div>
  </div>`;
}
function storeSheet() {
  const selectedStore = STORES.includes(S.store) ? S.store : STORES[0];
  return `<div class="sheet-head"><h2>Preferred store</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body">
    <div class="set-card">${STORES.map(s => `<label class="set-row" style="grid-template-columns:1fr auto;cursor:pointer"><b>${s}</b><input type="radio" name="storePick" value="${esc(s)}" ${s === selectedStore ? 'checked' : ''} style="width:20px;height:20px;accent-color:var(--basil)"></label>`).join('')}</div>
  </div>
  <div class="sheet-foot"><button class="btn btn-primary" data-act="storeSave">Save store</button></div>`;
}
function themeSheet() {
  const selected = visualTheme();
  return `<div class="sheet-head"><h2>Choose app theme</h2><button class="close" data-act="closeSheet" aria-label="Close">${ic('x')}</button></div>
  <div class="sheet-body theme-picker">
    <p class="theme-picker-intro">Choose a culinary palette. Each theme automatically adapts to your device's light or dark appearance.</p>
    <div class="theme-options">${Object.entries(APP_THEMES).map(([id, theme]) => `<button class="theme-option ${id === selected ? 'on' : ''}" data-act="themePick" data-arg="${id}" aria-pressed="${id === selected}">
      <span class="theme-swatches" aria-hidden="true">${theme.colors.map(color => `<i style="background:${color}"></i>`).join('')}</span>
      <span class="theme-option-copy"><b>${esc(theme.name)}</b><small>${esc(theme.description)}</small></span>
      <span class="theme-check">${id === selected ? ic('check') : ''}</span>
    </button>`).join('')}</div>
  </div>`;
}
function resetModal() {
  return `<div class="icon-hero" style="background:var(--tomato-soft);color:var(--tomato)">${ic('trash')}</div>
    <h2>Reset your inventory?</h2>
    <p>This removes all ${plural(S.inv.length, 'item')} from Ingredients and resets your Reels recommendations. You can't undo this.</p>
    <button class="btn btn-danger" data-act="resetDo">Reset inventory</button>
    <button class="btn btn-ghost" data-act="closeSheet">Cancel</button>`;
}
async function doReset() {
  if (sb) {
    const owner = S.user?.id;
    if (!owner) return false;
    const generation = accountGeneration;
    const expected = S.inv.filter(item => item.dbId).length;
    ++pantryRequest;
    sync = 'saving';
    try {
      const { data, error } = await sb.from('pantry_item').delete()
        .eq(OWNER_COLUMN, owner).select('ingredient_id');
      if (generation !== accountGeneration) return false;
      if (error) throw error;
      if ((data?.length || 0) < expected) throw new Error('Some pantry rows could not be deleted. Apply the pantry delete policy migration and try again.');
      S.inv = []; sync = 'synced';
    } catch (error) {
      if (generation !== accountGeneration) return false;
      sync = 'error';
      console.error('[MyPantry] pantry reset failed', error);
      await loadPantry();
      toast(`Couldn't update your pantry: ${esc(error.message)}`, null, 'alert');
      return false;
    }
  } else {
    S.inv = [];
  }
  const allergies = allergyList();
  const appearanceTheme = visualTheme();
  S.prefs = { appearanceTheme, ...(allergies.length ? { allergies } : {}) }; S.liked.clear(); S.watched.clear(); S.chat = [];
  persist();
  return true;
}

/* ===========================================================
   ACTIONS
   =========================================================== */
const ACT = {
  auth(arg) { S.auth = arg; render(); },
  showpw(id, b) { const i = $('#' + id); i.type = i.type === 'password' ? 'text' : 'password'; b.textContent = i.type === 'password' ? 'Show' : 'Hide'; },
  async resend(_, button) {
    if (!auth) return toast('Email is unavailable. Check the app configuration.', null, 'alert');
    button.disabled = true;
    try { await auth.resend(S.signupEmail, redirectTo); toast('Confirmation email requested. Check your inbox.', null, 'mail'); }
    catch (error) { toast(esc(error.message), null, 'alert'); }
    finally { button.disabled = false; }
  },
  enterApp() { enterApp(); },
  tab(arg) {
    closeSheet();
    S.shopReturnTab = null;
    if (arg === 'scan' && S.scan && S.scan.stage === 'done') S.scan = null;
    if (arg === 'settings') S.setPage = null;
    if (arg === 'reels' && S.tab !== 'reels') { S.reelView = 'feed'; S.reelShown = 0; S.reelMore = false; void loadLikeCounts(); }
    S.tab = arg; render();
  },
  receiptStatus() { S.tab = 'scan'; render(); },
  ask(arg) { if (S.tab !== 'home') { S.tab = 'home'; render(); } closeSheet(); ask(arg); },
  goSoon() { S.tab = 'ing'; S.ingView = 'soon'; render(); },
  askFromSoon() { S.tab = 'home'; render(); ask("What's going bad?"); },
  newChat() { resetAIChat(); S.conversationId = newUuid(); S.chat = []; ++chatLoadRequest; ++chatRevision; render(); },
  async chatClear() {
    if (!await doReset()) return;
    resetAIChat(); S.conversationId = newUuid(); S.chat = []; ++chatLoadRequest; ++chatRevision; render();
    pushMsg('bot', '<p>Done. I cleared your inventory and reset your Reels. Tap Scan whenever you want to log food again.</p>'); refreshBadge();
  },
  chatCancel(_, b) { b.closest('.actions').remove(); pushMsg('bot', '<p>No problem. Your food is still there.</p>'); },
  madeDirect(id, b) { b.closest('.actions').remove(); ask(`I made ${R(id).name}`); },
  async undoUse(_, b) { if (S.undo && await restorePantrySnapshot(S.undo)) { b.closest('.actions')?.remove(); pushMsg('bot', '<p>Undone. Your pantry is back the way it was.</p>'); refreshBadge(); } },
  async chatRemoveConfirm(id, button) {
    if (button.disabled) return;
    button.disabled = true;
    const generation = accountGeneration;
    const item = S.inv.find(i => i.id === id);
    if (!item) { closeSheet(); return; }
    const before = JSON.parse(snapshot());
    try {
      if (!await applyPantryTransition(before, before.filter(i => i.id !== id))) return;
      if (generation !== accountGeneration) return;
      closeSheet();
      pushMsg('bot', `<p>Removed ${esc(item.name)} from your pantry.</p>`);
      refreshBadge();
    } finally { button.disabled = false; }
  },
  async removeItem(id, b) {
    const it = S.inv.find(i => i.id === id); if (!it) return;
    const before = JSON.parse(snapshot()), after = before.filter(i => i.id !== id);
    if (!await applyPantryTransition(before, after)) return;
    b.closest('.actions')?.remove();
    pushMsg('bot', `<p>Removed ${esc(it.name)} from your pantry.</p>`); refreshBadge();
  },

  ingView(arg) { S.ingView = arg; render(); },
  ingCat(arg) { S.ingCat = arg; render(); },
  edit(id) { const it = S.inv.find(i => i.id === id); if (it) openItemForm(it, 'edit'); },
  foodAddedHistory() { openSheet(foodAddedHistorySheet()); },
  foodAddedMonthPrev() { foodAddedShiftMonth(-1); },
  foodAddedMonthNext() { foodAddedShiftMonth(1); },
  foodAddedMonthCurrent() {
    S.foodAddedMonth = foodAddedCurrentMonth();
    openSheet(foodAddedHistorySheet());
  },
  foodAddedRetry() { void loadFoodAddedEvents(); },
  wasteHistory() { openSheet(wasteHistorySheet()); },
  wasteRetry() { void loadWasteEvents(); },
  recipeUseHistory() { openSheet(recipeUseHistorySheet()); },
  recipeUseRetry() { void loadRecipeUseEvents(); },
  aiRecipeUseStart() {
    openSheet(aiRecipeUseSheet());
    $('#aiRecipeUseForm').addEventListener('submit', event => { event.preventDefault(); void ACT.aiRecipeUseSave(); });
  },
  async aiRecipeUseSave() {
    const form = $('#aiRecipeUseForm'), input = $('#aiRecipeName'), button = $('#aiRecipeUseSaveBtn');
    if (!form || !input || !button || button.disabled) return;
    const name = input.value.trim().replace(/\s+/g, ' ');
    const valid = name.length > 0 && name.length <= 120;
    $('#aiRecipeNameErr').hidden = valid;
    input.classList.toggle('bad', !valid);
    if (!valid) return;
    const owner = S.user?.id, generation = accountGeneration;
    button.disabled = true; button.textContent = 'Saving…';
    $('#aiRecipeSaveErr').hidden = true;
    if (!form.dataset.eventId) form.dataset.eventId = newUuid();
    try {
      const event = await saveRecipeUseEvent('ai', name, null, form.dataset.eventId);
      if (generation !== accountGeneration || owner !== S.user?.id) return;
      if (button.isConnected) closeSheet();
      render(); toast(`Logged ${esc(event.recipe_name)} as made`, null, 'check');
    } catch (error) {
      if (generation !== accountGeneration || owner !== S.user?.id) return;
      console.error('[MyPantry] AI recipe use save failed', error);
      const message = $('#aiRecipeSaveErr'); if (button.isConnected && message) message.hidden = false;
      void loadRecipeUseEvents();
    } finally {
      if (button.isConnected) { button.disabled = false; button.textContent = 'Log recipe made'; }
    }
  },
  recipeUseRemoveAsk(id) {
    const event = S.recipeUseEvents.find(item => item.event_id === id);
    if (event) openSheet(recipeUseRemoveSheet(event));
  },
  async recipeUseRemoveConfirm(id) {
    const button = $('#recipeUseRemoveBtn');
    if (!button || button.disabled) return;
    button.disabled = true; button.textContent = 'Removing…';
    try {
      if (!await removeRecipeUseEvent(id)) return;
      if (button.isConnected) openSheet(recipeUseHistorySheet());
      render(); toast('Recipe entry removed', null, 'check');
    } catch (error) {
      console.error('[MyPantry] recipe use removal failed', error);
      toast('Couldn’t remove this recipe entry. Please try again.', null, 'alert');
    } finally {
      if (button.isConnected) { button.disabled = false; button.textContent = 'Remove entry'; }
    }
  },
  wasteStart(id) { const it = S.inv.find(i => i.id === id); if (it) openWasteForm(it); },
  async wasteSave() {
    const form = $('#wasteForm'), button = $('#wasteSaveBtn');
    if (!form || !button || button.disabled) return;
    const it = S.inv.find(item => item.id === form.dataset.id);
    if (!it?.dbId || !sb || !S.user?.id) return;
    const text = $('#wasteQty').value.trim();
    const displayed = wasteDisplay(it.qty, it.unit)[0];
    const entered = Number(text);
    const reason = $('#wasteReason').value;
    const quantityValid = text !== '' && Number.isFinite(entered) && entered > 0 && entered <= displayed;
    $('#wasteQtyErr').hidden = quantityValid;
    $('#wasteQty').classList.toggle('bad', !quantityValid);
    $('#wasteReasonErr').hidden = !!WASTE_REASONS[reason];
    $('#wasteReason').classList.toggle('bad', !WASTE_REASONS[reason]);
    if (!quantityValid || !WASTE_REASONS[reason]) return;
    const converted = S.metric && CONV[it.unit] ? entered / CONV[it.unit][1] : entered;
    const quantity = entered === displayed ? it.qty : Math.min(it.qty, Number(converted.toPrecision(12)));
    if (!(quantity > 0)) { $('#wasteQtyErr').hidden = false; return; }
    const owner = S.user.id, generation = accountGeneration;
    button.disabled = true; button.textContent = 'Saving…';
    ++pantryRequest; ++wasteRequest; sync = 'saving';
    try {
      const { data, error } = await sb.rpc('record_food_waste', {
        p_ingredient_id: it.dbId, p_quantity: quantity, p_reason: reason
      });
      if (generation !== accountGeneration || owner !== S.user?.id) return;
      if (error) throw error;
      const remaining = Number(data?.remaining_quantity), event = data?.event;
      if (!event || event.user_id !== owner || !Number.isFinite(remaining) || remaining < 0) throw new Error('The database did not confirm the saved amount.');
      if (remaining === 0) S.inv = S.inv.filter(item => item.id !== it.id);
      else it.qty = remaining;
      S.wasteEvents.unshift(event); S.wasteStatus = 'synced'; sync = 'synced';
      closeSheet(); render(); toast(`Logged ${esc(it.name)} as waste`, null, 'check');
      void loadWasteEvents();
    } catch (error) {
      if (generation !== accountGeneration || owner !== S.user?.id) return;
      console.error('[MyPantry] food waste save failed', error);
      sync = 'error';
      closeSheet();
      toast('Couldn’t confirm the waste log. Check your pantry and waste history before trying again.', null, 'alert');
      void loadPantry(); void loadWasteEvents();
    }
  },
  async saveItem() {
    const f = $('#itemForm'); if (!f) return;
    const data = readItemForm(); if (!data) return;
    const mode = f.dataset.mode, id = f.dataset.id;
    if (mode === 'edit' && sb && S.inv.find(i => i.id === id)?.dbId) {
      saveItemToDb(id, data);
    } else if (mode === 'edit') {
      const it = S.inv.find(i => i.id === id);
      const expChanged = $('#f_exp').value !== it.exp;
      Object.assign(it, { name: data.name, brand: data.brand, productName: data.productName, qty: data.qty, unit: data.unit, cat: data.cat, store: data.store, exp: $('#f_exp').value || data.exp, emoji: it.emoji || data.emoji });
      if (expChanged && $('#f_exp').value) it.src = 'label';
      closeSheet(); render(); toast(`Saved ${esc(it.name)}`);
    } else if (mode === 'review') {
      const r = S.scan.items.find(x => x.tid === id);
      Object.assign(r, data, { emoji: r.emoji || data.emoji, src: $('#f_exp').value && $('#f_exp').value !== r.exp ? 'label' : r.src });
      if (!$('#f_exp').value) r.exp = estimate(r.cat, r.store, r.name);
      if (S.scan.mode === 'barcode') {
        if (!await saveNewItems([r], 'barcode')) return;
        closeSheet();
        S.scan = { mode: 'barcode', stage: 'done', added: [r] };
        S.tab = 'scan'; render();
        return;
      }
      closeSheet(); render();
    } else if (mode === 'reviewNew') {
      S.scan.items.push({ tid: 't' + (uid++), ...data, on: true }); closeSheet(); render();
    } else {
      if (!await saveNewItems([data])) return;
      closeSheet();
      S.scan = { mode: 'manual', stage: 'done', added: [data] }; S.tab = 'scan'; render();
    }
  },
  async deleteItem(id, button) {
    if (button?.disabled) return;
    if (button) button.disabled = true;
    const before = JSON.parse(snapshot()); const it = S.inv.find(i => i.id === id);
    try {
      if (!it) return;
      const after = before.filter(i => i.id !== id);
      if (!await applyPantryTransition(before, after)) return;
      closeSheet(); render();
      toast(`Deleted ${esc(it.name)}`, () => { void restorePantrySnapshot(JSON.stringify(before)); }, 'trash');
    } finally {
      if (button?.isConnected) button.disabled = false;
    }
  },
  closeSheet() { if (!recipeUseInFlight || !$('#scrim')?.querySelector('[data-act="useConfirm"]')) closeSheet(); },

  startScan(mode) { closeSheet(); if (S.tab !== 'scan') S.tab = 'scan'; startScan(mode); },
  manual() { stopCameraPreview(); closeSheet(); if (S.scan && S.scan.stage !== 'review') S.scan = null; S.tab = 'scan'; render(); openItemForm({ store: 'Fridge', cat: 'Other' }, 'new'); },
  manualInReview() { openItemForm({ store: 'Fridge', cat: 'Other', qty: 1, unit: 'ct' }, 'reviewNew'); },
  demo(arg) { S.scan.demo = arg; if (S.scan.stage === 'error') S.scan.stage = 'camera'; render(); },
  retake() {
    stopCameraPreview();
    receiptEditorImage = null;
    Object.assign(S.scan, { stage: 'camera', demo: 'good', preview: null, error: null, cameraState: isDemoAccount() ? null : 'requesting' });
    render();
    if (!isDemoAccount()) void startCameraPreview(S.scan);
  },
  scanCancel() {
    if (['receipt', 'pantry'].includes(S.scan?.mode) && S.scan.stage === 'analyzing') {
      const scrim = openSheet(cancelReceiptModal(), { center: true }); scrim.dataset.receiptCancel = 'true'; return;
    }
    if (S.scan?.stage === 'review') { openSheet(discardScanReviewModal(), { center: true }); return; }
    stopCameraPreview(); S.scan = null; render();
  },
  cancelReceiptScan() { closeSheet(); stopCameraPreview(); S.scan?.abortController?.abort(); S.scan = null; render(); },
  discardScanReview() { closeSheet(); stopCameraPreview(); S.scan = null; render(); },
  cameraShutter() { void captureCameraFrame(); },
  photoRetake() { ACT.retake(); },
  photoReset() {
    const ed = S.scan?.editor; if (!ed) return;
    Object.assign(ed, { brightness: 0, contrast: 0, corners: freshReceiptCorners(), error: null }); render();
  },
  photoRotate() { void rotateReceiptEditor(); },
  photoProcess(_, button) { if (button.disabled) return; button.disabled = true; void processReceiptEditor(); },
  shutter() {
    const sc = S.scan; if (sc.stage === 'analyzing' || realPhoto(sc) || realBarcode(sc)) return;
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
    it.store = s; if (it.src === 'ai') it.exp = estimate(it.cat, s, it.name);
    else if (s === 'Freezer') { it.exp = estimate(it.cat, s, it.name); it.src = 'ai'; }
    render();
  },
  async confirmScan() {
    const items = S.scan.items.filter(i => i.on);
    const mode = S.scan.mode;
    if (!await saveNewItems(items, mode)) return;
    S.scan = { mode, stage: 'done', added: items }; render();
  },
  doneView() { S.scan = null; S.tab = 'ing'; S.ingView = 'all'; render(); },
  doneMore() { S.scan = null; render(); },

  reelTap(id, el) {
    if (!reelCtl) return; const reel = el.closest('.reel');
    reelCtl.paused = !reelCtl.paused; reel.classList.toggle('paused', reelCtl.paused); reelCtl.playActive?.();
    reel.querySelector('.play-ind')?.remove();
    if (reelCtl.paused) { const p = document.createElement('div'); p.className = 'play-ind'; p.innerHTML = ic('play'); reel.appendChild(p); }
  },
  like(id, b) {
    const r = R(id);
    if (S.liked.has(id)) S.liked.delete(id); else { S.liked.add(id); learn(r); const h = document.createElement('div'); h.className = 'heart-pop'; h.textContent = '❤️'; b.closest('.reel').appendChild(h); setTimeout(() => h.remove(), 700); }
    const on = S.liked.has(id); persist();
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    b.innerHTML = `<span class="ri">${ic('heart', on)}</span><span class="num">${fmtK(likeCount(r))}</span>`;
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
  reelView(arg) { S.reelView = arg; S.reelShown = 0; render(); },
  reelMore(arg) {
    const on = arg !== 'off';
    const feed = $('#reelFeed'); const st = feed ? feed.scrollTop : 0;
    S.reelMore = on; S.reelShown = on ? (S.reelShown || 0) + REEL_BATCH : 0; render();
    const f2 = $('#reelFeed'); if (!f2) return;
    if (!on) { f2.scrollTop = 0; return; }
    f2.scrollTop = st;
    const c = f2.querySelector('[data-id="card-more"]'); if (c) f2.scrollTo({ top: c.offsetTop, behavior: 'smooth' });
  },
  openSaved() { S.tab = 'reels'; S.reelView = 'saved'; render(); },
  askMissing(id) { ACT.shopForRecipe(id); },
  shopForRecipe(id) {
    if (!R(id) || !recipeAllowed(R(id))) return toast('This recipe matches your allergy list.', null, 'alert');
    closeSheet(); S.shopRecipeId = id;
    if (S.tab !== 'settings' || S.setPage !== 'deals') S.shopReturnTab = S.tab;
    S.tab = 'settings'; S.setPage = 'deals'; render();
  },
  shopPlan(id) {
    if (!R(id)) return;
    S.shopRecipeId = id; render();
    const sc = $('.scroll', app); if (sc) sc.scrollTop = 0;
  },
  share(id) { openSheet(shareSheet(R(id))); },
  shareTo(who) { closeSheet(); toast(who === 'link' ? 'Link copied' : `Sent to ${esc(who)}`, null, 'share'); },
  recipe(id, button) {
    const r = R(id);
    if (r) openSheet(recipeSheet(r, button?.dataset.source === 'ai' ? 'ai' : 'reels'));
  },
  useAsk(id, button) {
    if (recipeUseInFlight) { toast('Still saving your last recipe. Please wait.', null, 'alert'); return; }
    const r = R(id);
    if (!r || !recipeAllowed(r)) { closeSheet(); toast('This recipe matches your allergy list.', null, 'alert'); return; }
    if (!canMake(r)) { toast('You no longer have everything for this recipe', null, 'alert'); return; }
    openSheet(useSheet(r, button?.dataset.source === 'ai' ? 'ai' : 'reels'));
  },
  async useConfirm(id, button) {
    if (!button || button.disabled || recipeUseInFlight) return;
    const r = R(id);
    if (!r || !recipeAllowed(r)) { closeSheet(); toast('This recipe matches your allergy list.', null, 'alert'); return; }
    if (!canMake(r)) { toast('You no longer have everything for this recipe', null, 'alert'); return; }
    const owner = S.user?.id, generation = accountGeneration;
    const source = button.dataset.source === 'ai' ? 'ai' : 'reels';
    const before = snapshot();
    recipeUseInFlight = true;
    button.disabled = true; button.textContent = 'Saving…';
    try {
      useRecipe(r);
      const after = snapshot();
      const consumption = recipeConsumption(JSON.parse(before), JSON.parse(after));
      let event;
      try {
        event = await recordCatalogRecipeUse(source, r, consumption);
      } catch (error) {
        if (generation !== accountGeneration || owner !== S.user?.id) return;
        console.error('[MyPantry] recipe use save failed', error);
        S.inv = JSON.parse(before); S.undo = null;
        await loadPantry(); void loadRecipeUseEvents();
        toast('Couldn’t confirm the recipe. Check Ingredients and recipe history before trying again.', null, 'alert');
        return;
      }
      if (generation !== accountGeneration || owner !== S.user?.id) return;
      if (button.isConnected) closeSheet();
      if (S.tab === 'reels') {
        const feed = $('#reelFeed'); const st = feed ? feed.scrollTop : 0; render(); const f2 = $('#reelFeed'); if (f2) f2.scrollTop = st;
      } else render();
      toast(`Pantry updated and ${esc(r.name)} logged`, async () => {
        if (generation !== accountGeneration || owner !== S.user?.id) return;
        if (snapshot() !== after) {
          toast('Your pantry changed after this recipe. Edit Ingredients and recipe history to correct it.', null, 'alert');
          return;
        }
        if (!await restorePantrySnapshot(before)) return;
        if (generation !== accountGeneration || owner !== S.user?.id) return;
        try {
          if (await removeRecipeUseEvent(event.event_id)) {
            render(); toast('Pantry and recipe count restored', null, 'check');
          }
        } catch (error) {
          console.error('[MyPantry] recipe use undo failed', error);
          toast('Pantry restored, but the recipe remains in your count. Remove it from Ingredients.', null, 'alert');
        }
      });
    } finally {
      recipeUseInFlight = false;
      if (button.isConnected) { button.disabled = false; button.textContent = 'Yes, update my pantry and log recipe'; }
    }
  },
  useNot() {
    if (recipeUseInFlight) return;
    closeSheet(); toast('No changes. Your pantry stays the same.', null, 'check');
  },
  nextReel(id, b) {
    const next = b.closest('.reel').nextElementSibling;
    if (next) $('#reelFeed').scrollTo({ top: next.offsetTop, behavior: 'smooth' });
    else toast("You've reached the end. New reels show up as your pantry changes.", null, 'check');
  },
  askNeed(id) {
    const r = R(id); const miss = missingOf(r).map(needName);
    closeSheet(); S.tab = 'home'; render();
    ask(`I want to make ${r.name} but I'm missing ${miss.join(', ')}. What can I swap in from my pantry?`);
  },
  notYet(id, b) {
    toast('No changes. Your pantry stays the same.');
    const reel = b.closest('.reel'); const next = reel.nextElementSibling;
    if (next) $('#reelFeed').scrollTo({ top: next.offsetTop, behavior: 'smooth' });
  },

  storeSheet() {
    openSheet(storeSheet());
  },
  openTheme() { openSheet(themeSheet()); },
  themePick(arg) {
    const theme = normalizeTheme(arg);
    S.prefs.appearanceTheme = theme;
    applyVisualTheme();
    persist();
    closeSheet();
    render();
    toast(`${APP_THEMES[theme].name} theme applied.`, null, 'check');
  },
  storeSave() {
    const store = $('input[name="storePick"]:checked')?.value;
    if (!STORES.includes(store)) return toast('Choose a store to save.', null, 'alert');
    S.store = store; persist(); closeSheet(); render(); toast(`Shopping preference saved: ${esc(S.store)}`, null, 'store');
  },
deals() {
  S.shopRecipeId = null;
  S.shopReturnTab = S.tab;
  S.tab = 'settings';
  S.setPage = 'deals';
  render();
},
shopBack() {
  S.shopRecipeId = null;
  S.setPage = null;
  S.tab = S.shopReturnTab || 'settings';
  S.shopReturnTab = null;
  render();
},
dealsBack() {
  S.setPage = null;
  render();
},
editProfile() {
  S.profileDraft = null;
  S.profileCamera = null;
  S.profileError = null;
  S.profileLoading = false;
  S.profileSaving = false;
  S.setPage = 'profile';
  render();
},
profileBack() {
  if (S.profileSaving) return;
  stopProfileCamera();
  S.profileDraft = null;
  S.profileCamera = null;
  S.profileError = null;
  S.profileLoading = false;
  S.setPage = null;
  render();
},
profileCamera() { void startProfileCamera(); },
profileCameraClose() {
  stopProfileCamera();
  S.profileCamera = null;
  S.profileError = null;
  render();
},
profileShutter() { captureProfilePhoto(); },
profileSave() { void saveProfilePhoto(); },
profileRemove() { void removeProfilePhoto(); },
editAllergies() {
  S.allergyDraft = allergyList();
  S.allergyError = null;
  S.setPage = 'allergies';
  render();
},
allergyToggle(value) {
  const selected = new Set(allergyList(S.allergyDraft));
  selected.has(value) ? selected.delete(value) : selected.add(value);
  S.allergyDraft = allergyList([...selected]);
  S.allergyError = null;
  render();
},
allergyRemove(value) {
  S.allergyDraft = allergyList(S.allergyDraft)
    .filter(item => item !== normalizeAllergy(value));
  S.allergyError = null;
  render();
},
allergySave() {
  const selected = allergyList(S.allergyDraft);
  if (selected.length) S.prefs.allergies = selected;
  else delete S.prefs.allergies;

  S.allergyDraft = null;
  S.allergyError = null;
  S.reelShown = 0;
  S.reelMore = false;
  S.setPage = null;
  persist();
  render();
  toast('Allergy preferences saved.', null, 'check');
},
allergyBack() {
  S.allergyDraft = null;
  S.allergyError = null;
  S.setPage = null;
  render();
},
  shopRetry() { sync = 'loading'; render(); void loadPantry(); },
  resetAsk() { openSheet(resetModal(), { center: true }); },
  async resetDo() { if (!await doReset()) return; resetAIChat(); S.conversationId = newUuid(); S.chat = []; ++chatLoadRequest; ++chatRevision; closeSheet(); render(); toast('Inventory reset. Reels start fresh.'); },
  changeEmail() { S.setPage = 'email'; render(); },
  changeUsername() { S.setPage = 'username'; render(); },
  changePw() { S.setPage = 'password'; render(); },
  async logout(_, button) {
    if (button) button.disabled = true;
    let endedSession = false;
    const previousSession = { owner: appSessionOwner, id: appSessionId, generation: appSessionGeneration };
    try {
      if (auth) endedSession = await endAppSession('signed_out');
      if (auth) await auth.signOut();
      else { resetAIChat(); ++accountGeneration; S = freshState(); closeSheet(); render(); }
    } catch (error) {
      if (endedSession && previousSession.owner && previousSession.id && previousSession.generation === accountGeneration) {
        try {
          await updateAppSession({ last_active_at: new Date().toISOString(), ended_at: null, end_reason: null }, previousSession.owner, previousSession.id);
          appSessionId = previousSession.id; appSessionOwner = previousSession.owner; appSessionGeneration = previousSession.generation;
          try { sessionStorage.setItem(APP_SESSION_KEY(previousSession.owner), previousSession.id); } catch (_) {}
          appSessionTimer = setInterval(() => appSessionHeartbeat(previousSession.owner, previousSession.generation), APP_SESSION_HEARTBEAT_MS);
        } catch (restoreError) { console.warn('[MyPantry] failed sign-out session restore failed', restoreError); }
      } else if (appSessionId) {
        appSessionTimer = setInterval(() => appSessionHeartbeat(appSessionOwner, appSessionGeneration), APP_SESSION_HEARTBEAT_MS);
      }
      toast(`Could not sign out: ${esc(error.message)}`, null, 'alert');
    }
    finally { if (button) button.disabled = false; }
  }
};
// Vertical slice: (1) send the edit to Supabase, (2) update the row,
// (3) get the updated row back, (4) show it in the list.
async function saveItemToDb(id, data) {
  if (!sb || !S.user?.id) return;
  const owner = S.user.id, generation = accountGeneration;
  const it = S.inv.find(i => i.id === id);
  const btn = $('#saveItemBtn');
  const exp = $('#f_exp').value || it.exp;
  btn.disabled = true; btn.textContent = 'Saving…';
  $('#dbErr')?.remove();
  let row, error;
  try {
  ({ data: row, error } = await sb.from('pantry_item')
    .update({ ingredient_name: data.name, brand: data.brand || null, product_name: data.productName || null, quantity: data.qty, measurement: data.unit, food_type: data.cat, expiration_date: exp, status: statusFor(exp), storage_location: data.store, expiration_source: data.src })
    .eq('ingredient_id', it.dbId)
    .eq(OWNER_COLUMN, owner)
    .select()
    .single());
  } catch (err) { error = err; }
  if (generation !== accountGeneration) return;
  if (error || !row) {
    btn.disabled = false; btn.textContent = 'Save';
    const e = document.createElement('div'); e.className = 'err'; e.id = 'dbErr';
    e.innerHTML = `${ic('alert')}<span>Couldn't save to the database. ${esc(error ? error.message : 'No row was updated.')}</span>`;
    $('#itemForm')?.appendChild(e);
    console.error('[MyPantry] save failed', error);
    return;
  }
  const fresh = rowToItem(row);
  Object.assign(it, fresh, { emoji: it.emoji || fresh.emoji, store: data.store });
  sync = 'synced';
  closeSheet(); render();
  toast(`Saved ${esc(it.name)}: ${qtyText(it.qty, it.unit)}`, null, 'check');
}

function enterApp() {
  if (!S.user?.id) return;
  void loadRemoteRecipes();
  S.auth = 'app'; S.chat = []; render();
  if (S.user.avatarPath) void loadAvatarUrl(S.user.id, S.user.avatarPath);
  startAppSessionTracking();
  loadPantry(); loadWasteEvents(); loadRecipeUseEvents(); loadFoodAddedEvents(); loadUserAppState(); loadChatHistory(); void loadLikeCounts(true);
}

/* ---------- On-screen keyboard handling ----------
   Mobile keyboards cover the bottom of the page instead of resizing it (iOS Safari
   especially). Size the app to the visible viewport so content can scroll above the
   keyboard, and keep a focused field in view. */
(function trackVisualViewport() {
  const vv = window.visualViewport; if (!vv) return;
  const root = document.documentElement;
  let frame = 0;
  const update = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      root.style.setProperty('--app-h', `${Math.round(vv.height)}px`);
      root.classList.toggle('keyboard-open', window.innerHeight - vv.height > 120);
      if (window.scrollY) window.scrollTo(0, 0);
    });
  };
  vv.addEventListener('resize', update);
  vv.addEventListener('scroll', update);
  update();
})();
phone.addEventListener('focusin', e => {
  const field = e.target.closest?.('.auth input, .auth select, .auth textarea'); if (!field) return;
  setTimeout(() => { if (document.activeElement === field) field.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 300);
});

/* ---------- Event wiring ---------- */
phone.addEventListener('pointerdown', e => {
  cancelActiveSwipe();
  // A new tap is separate from the synthetic click emitted by the last swipe.
  suppressSwipeClick = null;
  if (e.button !== 0 || S.auth !== 'app' || S.tab !== 'ing') return;
  const main = e.target.closest?.('.swipe-item-main');
  const row = main?.closest('.swipe-item');
  if (!row || !phone.contains(row)) return;
  swipeGesture = { pointerId: e.pointerId, row, startX: e.clientX, startY: e.clientY,
    wasOpen: row.classList.contains('is-open'), horizontal: false };
});
phone.addEventListener('pointermove', e => {
  const gesture = swipeGesture;
  if (!gesture || e.pointerId !== gesture.pointerId || !gesture.row.isConnected) return;
  const dx = e.clientX - gesture.startX, dy = e.clientY - gesture.startY;
  if (!gesture.horizontal) {
    if (Math.abs(dy) > 12 && Math.abs(dy) > Math.abs(dx)) { swipeGesture = null; return; }
    if (Math.abs(dx) < 12 || Math.abs(dx) <= Math.abs(dy) * 1.2) return;
    gesture.horizontal = true;
    if (openSwipeRow && openSwipeRow !== gesture.row) closeSwipeRow();
    gesture.row.classList.add('is-dragging');
    gesture.row.querySelector('.swipe-delete').hidden = false;
  }
  if (e.cancelable) e.preventDefault();
  const offset = Math.max(-SWIPE_ACTION_WIDTH, Math.min(0, (gesture.wasOpen ? -SWIPE_ACTION_WIDTH : 0) + dx));
  gesture.row.style.setProperty('--swipe-x', `${offset}px`);
});
function finishSwipeGesture(e, cancelled = false) {
  const gesture = swipeGesture;
  if (!gesture || e.pointerId !== gesture.pointerId) return;
  swipeGesture = null;
  if (!gesture.horizontal || !gesture.row.isConnected) return;
  const dx = e.clientX - gesture.startX;
  const shouldOpen = cancelled ? gesture.wasOpen : gesture.wasOpen ? dx < 45 : dx < -45;
  if (shouldOpen) revealSwipeRow(gesture.row);
  else closeSwipeRow(gesture.row);
  if (!cancelled) suppressSwipeClick = { row: gesture.row, until: Date.now() + 700 };
}
window.addEventListener('pointerup', e => finishSwipeGesture(e));
window.addEventListener('pointercancel', e => finishSwipeGesture(e, true));
window.addEventListener('blur', cancelActiveSwipe);
phone.addEventListener('click', e => {
  const row = e.target.closest?.('.swipe-item');
  if (e.detail > 0 && row && suppressSwipeClick?.row === row && Date.now() < suppressSwipeClick.until) {
    suppressSwipeClick = null;
    e.preventDefault();
    return;
  }
  if (openSwipeRow && !openSwipeRow.isConnected) openSwipeRow = null;
  if (openSwipeRow && row === openSwipeRow && e.target.closest('.swipe-item-main') && e.detail > 0) {
    closeSwipeRow();
    e.preventDefault();
    return;
  }
  if (openSwipeRow && row !== openSwipeRow) closeSwipeRow();
  const b = e.target.closest('[data-act]'); if (!b || !phone.contains(b)) return;
  const fn = ACT[b.dataset.act]; if (!fn) return;
  e.preventDefault();
  fn(b.dataset.arg, b, e);
});
phone.addEventListener('change', e => {
  const t = e.target;
  if (t.id === 'photoCam' || t.id === 'photoPick') {
    stopCameraPreview();
    if (S.scan?.mode === 'receipt') void beginReceiptEditor(t.files && t.files[0]);
    else void scanPhoto(t.files && t.files[0]);
    return;
  }
  if (t.id === 'barcodeCam' || t.id === 'barcodePick') { stopCameraPreview(); void scanBarcodePhoto(t.files && t.files[0]); return; }
  if (t.id === 'sw_metric') { S.metric = t.checked; persist(); render(); toast(S.metric ? 'Showing metric units' : 'Showing US units', null, 'ruler'); }
  if (t.id === 'sw_rem') { S.reminders = t.checked; persist(); render(); }
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
  if (e.target.id === 'ingSearch') { resetSwipeInteraction(); S.ingQuery = e.target.value; $('#ingList').innerHTML = S.ingView === 'soon' ? renderSoon() : ingListHtml(); }
  if ((e.target.id === 'photoBrightness' || e.target.id === 'photoContrast') && S.scan?.editor) {
    S.scan.editor[e.target.id === 'photoBrightness' ? 'brightness' : 'contrast'] = Number(e.target.value);
    S.scan.editor.error = null; drawReceiptEditor();
  }
});

function bindForms() {
  const showError = (form, selector, message) => {
    const error = form.querySelector(selector); if (!error) return;
    error.hidden = false; error.querySelector('span').textContent = message;
  };
  $$('#profilePhotoPick, #profileCameraPick', app).forEach(input => input.addEventListener('change', async () => {
    const file = input.files?.[0];
    if (!file) return;
    const owner = S.user?.id, generation = accountGeneration;
    S.profileLoading = true; S.profileError = null;
    try {
      const draft = await profilePhotoFromFile(file);
      if (generation !== accountGeneration || S.user?.id !== owner || S.setPage !== 'profile') return;
      S.profileLoading = false;
      setProfileDraft(draft);
    } catch (error) {
      if (generation !== accountGeneration || S.user?.id !== owner || S.setPage !== 'profile') return;
      stopProfileCamera(); S.profileCamera = null; S.profileLoading = false;
      S.profileError = error.message || 'That photo could not be prepared. Please try another.';
      render();
    }
  }));
  const allergyForm = $('#allergyForm');
  if (allergyForm) allergyForm.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#allergyInput');
    const value = normalizeAllergy(input.value);
    const selected = allergyList(S.allergyDraft);
    if (value.length < 2 || value.length > 50 || !/[a-z0-9]/i.test(value)) {
      S.allergyError = 'Enter an allergy or ingredient name between 2 and 50 characters.';
    } else if (selected.includes(value)) {
      S.allergyError = `${allergyLabel(value)} is already on your list.`;
    } else if (selected.length >= 20) {
      S.allergyError = 'You can save up to 20 allergy entries.';
    } else {
      S.allergyDraft = allergyList([...selected, value]); S.allergyError = null;
    }
    render();
  });
  const emailForm = $('#emailForm');
  if (emailForm) emailForm.addEventListener('submit', async e => {
    e.preventDefault();
    const button = emailForm.querySelector('[type="submit"]');
    if (button.disabled) return;
    const email = $('#accountEmail').value.trim().toLowerCase();
    const confirmation = $('#accountEmailConfirm').value.trim().toLowerCase();
    emailForm.querySelector('#emailErr').hidden = emailForm.querySelector('#emailOk').hidden = true;
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError(emailForm, '#emailErr', 'Enter a valid email address.');
    if (email !== confirmation) return showError(emailForm, '#emailErr', 'The email addresses do not match.');
    if (email === S.user.email.toLowerCase()) return showError(emailForm, '#emailErr', 'Enter a different email address.');
    const generation = accountGeneration, owner = S.user.id;
    button.disabled = true;
    try {
      if (!auth || isDemoAccount()) throw new Error('Account changes require your own signed-in account.');
      const user = await auth.updateEmail(email, redirectTo);
      if (generation !== accountGeneration || owner !== S.user?.id || !emailForm.isConnected) return;
      const ok = emailForm.querySelector('#emailOk'); ok.hidden = false;
      ok.querySelector('span').textContent = user.email.toLowerCase() === email ? 'Email updated. Use your new email next time you sign in.' : 'Confirmation requested. Check both your current and new inboxes, including spam. Your sign-in email stays the same until confirmation is complete.';
      emailForm.querySelectorAll('input').forEach(input => { input.value = ''; });
    } catch (error) {
      if (generation === accountGeneration && owner === S.user?.id && emailForm.isConnected) showError(emailForm, '#emailErr', error.message);
    } finally { button.disabled = false; }
  });
  const accountForm = $('#usernameForm') || $('#passwordForm');
  if (accountForm) accountForm.addEventListener('submit', async e => {
    e.preventDefault();
    const button = accountForm.querySelector('[type="submit"]');
    if (button.disabled) return;
    const username = accountForm.id === 'usernameForm';
    const value = username ? $('#accountName').value.trim() : $('#accountPassword').value;
    accountForm.querySelector('#accountErr').hidden = true;
    if (username && (!value || value.length > 40)) return showError(accountForm, '#accountErr', 'Enter a username between 1 and 40 characters.');
    if (!username && (value.length < 8 || !/[^A-Za-z0-9\s]/.test(value))) return showError(accountForm, '#accountErr', 'Use at least 8 characters and one symbol.');
    if (!username && value !== $('#accountConfirm').value) return showError(accountForm, '#accountErr', 'The passwords do not match.');
    const generation = accountGeneration, owner = S.user?.id;
    button.disabled = true;
    try {
      if (!auth || isDemoAccount()) throw new Error('Account changes require your own signed-in account.');
      if (username) await auth.updateName(value);
      else await auth.updatePassword(value);
      if (generation !== accountGeneration || owner !== S.user?.id) return;
      if (username) { S.user.name = value; persist(); }
      if (accountForm.isConnected) { S.setPage = null; render(); }
      toast(username ? 'Username updated.' : 'Password updated. Use your new password next time you sign in.');
    } catch (error) {
      if (generation === accountGeneration && owner === S.user?.id && accountForm.isConnected) showError(accountForm, '#accountErr', error.message);
    } finally {
      if (!username) accountForm.querySelectorAll('input[type="password"]').forEach(input => { input.value = ''; });
      button.disabled = false;
    }
  });
  const bf = $('#barcodeNumberForm');
  if (bf) bf.addEventListener('submit', e => {
    e.preventDefault();
    const input = $('#barcodeNumber'), error = $('#barcodeNumberErr');
    const barcode = input.value.replace(/\D/g, '');
    const valid = validBarcode(barcode);
    input.classList.toggle('bad', !valid); error.hidden = valid;
    if (valid) void lookupBarcode(barcode, S.scan);
  });
  const lf = $('#loginForm');
  if (lf) lf.addEventListener('submit', async e => {
    e.preventDefault();
    const em = $('#li_email').value.trim().toLowerCase(), pw = $('#li_pw').value;
    const btn = lf.querySelector('[type="submit"]');
    if (btn.disabled) return;
    if (!em || !pw) return showError(lf, '#loginErr', 'Enter your email and password to sign in.');
    btn.disabled = true;
    try {
      if (!auth) throw new Error(configError || 'Sign-in is unavailable. Reload and try again.');
      await auth.signIn(em, pw);
    } catch (error) { showError(lf, '#loginErr', error.message); }
    finally { const field = lf.querySelector('#li_pw'); if (field) field.value = ''; btn.disabled = false; }
  });
  const ff = $('#forgotForm');
  if (ff) ff.addEventListener('submit', async e => {
    e.preventDefault();
    const em = $('#fg_email').value.trim().toLowerCase();
    const btn = ff.querySelector('[type="submit"]'); if (btn.disabled) return;
    ff.querySelector('#fgErr').hidden = ff.querySelector('#fgOk').hidden = true;
    btn.disabled = true;
    try {
      if (!auth) throw new Error('Password reset needs a configured Supabase connection.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) throw new Error('Enter a valid email address.');
      await auth.resetPassword(em, redirectTo);
      const ok = ff.querySelector('#fgOk'); ok.hidden = false;
      ok.querySelector('span').textContent = 'If an account exists for this email, check your inbox for the reset link.';
    } catch (error) { showError(ff, '#fgErr', error.message); }
    finally { btn.disabled = false; }
  });
  const rf = $('#recoveryForm');
  if (rf) rf.addEventListener('submit', async e => {
    e.preventDefault();
    const password = $('#new_pw').value, confirmation = $('#new_pw2').value;
    const btn = rf.querySelector('[type="submit"]'); if (btn.disabled) return;
    if (password.length < 8 || !/[^A-Za-z0-9\s]/.test(password) || password !== confirmation)
      return showError(rf, '#recoveryErr', 'Use at least 8 characters, a symbol, and matching passwords.');
    btn.disabled = true;
    try { await auth.updatePassword(password); toast('Password updated.'); }
    catch (error) { showError(rf, '#recoveryErr', error.message); }
    finally { btn.disabled = false; }
  });
  const sf = $('#signupForm');
  if (sf) {
    const upd = () => {
      const pw = $('#su_pw').value, pw2 = $('#su_pw2').value, em = $('#su_email').value.trim();
      const rules = { len: pw.length >= 8, sym: /[^A-Za-z0-9\s]/.test(pw), match: pw.length > 0 && pw === pw2 };
      $$('#pwRules li').forEach(li => li.classList.toggle('met', rules[li.dataset.rule]));
      const emOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em);
      $('#su_emailErr').hidden = !em || emOk;
      $('#su_email').classList.toggle('bad', !!em && !emOk);
      $('#suBtn').disabled = !(rules.len && rules.sym && rules.match && emOk);
    };
    sf.addEventListener('input', upd);
    // Mobile keyboards: Enter moves to the next field. On the last field it submits when the
    // form is valid, otherwise it closes the keyboard so the Create account button is visible.
    const fields = ['#su_name', '#su_email', '#su_pw', '#su_pw2'].map(sel => $(sel));
    sf.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      const at = fields.indexOf(e.target); if (at < 0) return;
      if (at < fields.length - 1) { e.preventDefault(); fields[at + 1].focus(); return; }
      upd();
      if ($('#suBtn').disabled) { e.preventDefault(); e.target.blur(); }
    });
    // Tapping blank space on the form closes the keyboard.
    sf.addEventListener('pointerdown', e => {
      if (!e.target.closest('input, button, a, label') && document.activeElement?.matches?.('input')) document.activeElement.blur();
    });
    sf.addEventListener('submit', async e => {
      e.preventDefault(); if ($('#suBtn').disabled) return; upd(); if ($('#suBtn').disabled) return;
      const em = $('#su_email').value.trim().toLowerCase();
      const name = $('#su_name').value.trim() || em.split('@')[0];
      const password = $('#su_pw').value, btn = $('#suBtn');
      btn.disabled = true;
      try {
        if (!auth) throw new Error('Creating accounts needs a configured Supabase connection.');
        const signedIn = await auth.signUp(em, password, name, redirectTo);
        if (!signedIn) { S.signupEmail = em; S.pendingName = name; S.auth = 'verify'; render(); }
      } catch (error) { showError(sf, '#suErr', error.message); }
      finally { btn.disabled = false; }
    });
  }

  const cf = $('#chatForm');
  if (cf) {
    const input = cf.querySelector('#chatIn');
    const resizeInput = () => {
      const chatScroll = $('#chatScroll');
      const atBottom = chatScroll && chatScroll.scrollHeight - chatScroll.scrollTop - chatScroll.clientHeight < 24;
      input.style.height = 'auto';
      const style = getComputedStyle(input);
      const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      const height = input.scrollHeight + border;
      input.style.height = `${height}px`;
      if (atBottom) chatScroll.scrollTop = chatScroll.scrollHeight;
    };
    resizeInput();
    input.addEventListener('input', resizeInput);
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter' || e.shiftKey || e.isComposing || e.keyCode === 229) return;
      e.preventDefault();
      cf.requestSubmit();
    });
    cf.addEventListener('submit', e => {
      e.preventDefault();
      if (chatRequest) return;
      const value = input.value;
      input.value = '';
      resizeInput();
      ask(value);
    });
  }
}

/* ---------- Authenticated demo tools ---------- */
const demoPanel = $('#demoPanel'), demoToggle = $('#demoToggle');
function syncDemoToolsVisibility() {
  const allowed = S.auth === 'app' && isDemoAccount();
  demoPanel.hidden = !allowed;
  demoToggle.hidden = !allowed;
  if (!allowed) demoPanel.classList.remove('open');
}
function toggleDemoTools(open) {
  if (!isDemoAccount()) return;
  demoPanel.classList.toggle('open', open);
  demoToggle.textContent = open ? 'Back to the app' : 'Demo tools';
}
function randomPantry() {
  const shuffled = samplePantry().sort(() => Math.random() - .5);
  const count = 8 + Math.floor(Math.random() * 11);
  return shuffled.slice(0, count).map(item => ({
    ...item,
    id: 'i' + (uid++),
    qty: item.unit === 'ct' ? 1 + Math.floor(Math.random() * 12) : Math.max(.5, Math.round((.5 + Math.random() * item.qty * 1.5) * 2) / 2),
    exp: inDays(-2 + Math.floor(Math.random() * 123))
  }));
}
async function replaceDemoPantry(items, resetAll = false) {
  if (!isDemoAccount()) return false;
  if (!await doReset()) return false;
  if (resetAll) {
    S.saved.clear(); S.metric = false; S.reminders = true; S.store = "Smith's";
    resetAIChat(); S.conversationId = newUuid(); S.tab = 'home'; S.reelView = 'feed';
  }
  if (items.length && !await saveNewItems(items, 'manual', false)) return false;
  S.scan = null; S.chat = []; persist(); render();
  return true;
}
$('.tools').addEventListener('click', async e => {
  const button = e.target.closest('[data-tool]');
  const tool = button?.dataset.tool;
  if (!tool || !isDemoAccount()) return;
  const originalLabel = button.textContent;
  const buttons = $$('.tools button'); buttons.forEach(item => { item.disabled = true; });
  button.textContent = 'Working…'; demoPanel.setAttribute('aria-busy', 'true');
  closeSheet();
  let ok = false;
  try {
    if (tool === 'reset') ok = await replaceDemoPantry(samplePantry(), true);
    if (tool === 'sample') ok = await replaceDemoPantry(samplePantry());
    if (tool === 'random') ok = await replaceDemoPantry(randomPantry());
    if (tool === 'empty') ok = await replaceDemoPantry([]);
    if (ok) toast({ reset: 'Demo restarted.', sample: 'Sample pantry loaded.', random: 'Random pantry created.', empty: 'Pantry emptied.' }[tool]);
  } finally {
    button.textContent = originalLabel; demoPanel.removeAttribute('aria-busy');
    buttons.forEach(item => { item.disabled = false; });
  }
  if (ok && window.matchMedia('(max-width:520px)').matches) toggleDemoTools(false);
});
demoToggle.addEventListener('click', () => toggleDemoTools(!demoPanel.classList.contains('open')));

/* ---------- Clock ---------- */


S.inv = []; S.auth = auth ? 'loading' : 'login'; render();
if (auth) auth.start();
})();
