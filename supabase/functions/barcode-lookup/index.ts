// Looks up a scanned grocery UPC/EAN in USDA FoodData Central.
// The USDA API key stays in Supabase; the browser receives only normalized
// pantry fields and still asks the user to review them before saving.
const env = (key) => Deno.env.get(key) || '';
const ORIGINS = ['https://jarod049.github.io', ...env('ALLOWED_ORIGINS').split(',').map(s => s.trim()).filter(Boolean)];
const isLocalDevelopmentOrigin = (origin) => {
  try {
    const url = new URL(origin);
    if (url.protocol !== 'http:' || url.port !== '4173') return false;
    const host = url.hostname.toLowerCase();
    if (host === 'localhost' || host === '127.0.0.1' || host === '[::1]') return true;
    const octets = host.split('.').map(Number);
    if (octets.length !== 4 || octets.some(value => !Number.isInteger(value) || value < 0 || value > 255)) return false;
    return octets[0] === 10
      || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
      || (octets[0] === 192 && octets[1] === 168);
  } catch { return false; }
};
const corsFor = (req) => {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(origin) || isLocalDevelopmentOrigin(origin) ? origin : ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
};

const USDA_URL = 'https://api.nal.usda.gov/fdc/v1/foods/search';
const OPEN_FOOD_FACTS_URL = 'https://world.openfoodfacts.org/api/v3/product/';
const OPEN_FOOD_FACTS_AGENT = 'MyPantry/1.0 (https://github.com/Jarod049/MyPantry)';
const UNITS = ['ct', 'oz', 'lb', 'fl oz', 'gal'];

export async function handler(req) {
  const cors = corsFor(req);
  const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const authorization = req.headers.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ')) return json({ error: 'Please sign in again.' }, 401);
    const base = env('SUPABASE_URL');
    const auth = await fetch(base + '/auth/v1/user', {
      headers: { apikey: env('SUPABASE_ANON_KEY'), Authorization: authorization }
    });
    if (!auth.ok || !(await auth.json())?.id) return json({ error: 'Please sign in again.' }, 401);

    let body;
    try { body = await req.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
    const barcode = typeof body?.barcode === 'string' ? body.barcode.replace(/\D/g, '') : '';
    if (!/^\d{8,14}$/.test(barcode) || !validGtin(barcode)) {
      return json({ error: 'That does not look like a valid grocery bar code.' }, 400);
    }

    const apiKey = env('USDA_FDC_API_KEY');
    if (!apiKey) return json({ error: 'Bar code lookup is waiting for its USDA API key to be configured.' }, 503);
    const foods = [];
    const usdaSignal = AbortSignal.timeout(15000);
    for (const query of searchQueries(barcode)) {
      const response = await fetch(USDA_URL, {
        method: 'POST',
        signal: usdaSignal,
        headers: { 'X-Api-Key': apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, dataType: ['Branded'], pageSize: 50 })
      });
      if (!response.ok) {
        return json({ error: response.status === 429
          ? 'The USDA lookup limit was reached. Try again later.'
          : 'USDA FoodData Central is temporarily unavailable.' }, 503);
      }
      const result = await response.json();
      for (const food of Array.isArray(result?.foods) ? result.foods : []) {
        if (!foods.some(existing => existing?.fdcId && existing.fdcId === food?.fdcId)) foods.push(food);
      }
      if (foods.some(food => foodMatchesBarcode(food, barcode))) break;
    }

    const matches = foods
      .filter(food => foodMatchesBarcode(food, barcode))
      .sort((a, b) => String(b.publishedDate || b.publicationDate || '').localeCompare(String(a.publishedDate || a.publicationDate || '')));
    if (!matches.length) {
      console.info('[barcode-lookup] No exact USDA match', {
        barcode,
        candidates: foods.slice(0, 10).map(food => ({ fdcId: food?.fdcId, gtinUpc: food?.gtinUpc }))
      });
      const fallback = await lookupOpenFoodFacts(barcode);
      if (fallback) return json({ barcode, item: fallback });
      return json({ error: "We couldn't find this item in USDA FoodData Central or Open Food Facts." }, 404);
    }

    return json({ barcode, item: { ...cleanFood(matches[0]), source: 'USDA FoodData Central' } });
  } catch (error) {
    return json({ error: error?.name === 'TimeoutError'
      ? 'The USDA lookup took too long. Try again.'
      : 'Bar code lookup could not connect. Try again.' }, 503);
  }
}

// GTIN-8, UPC-A, EAN-13 and GTIN-14 all use the same modulo-10 check digit.
export function validGtin(value) {
  if (!/^\d{8,14}$/.test(value)) return false;
  const digits = [...value].map(Number);
  const check = digits.pop();
  const sum = digits.reverse().reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === check;
}

const gtinKey = value => String(value || '').replace(/\D/g, '').padStart(14, '0');

// USDA's search index can recognize a UPC by its full GTIN, its value without
// the check digit, or the manufacturer/item body with leading zeroes removed.
// Search those representations, but only accept a result whose returned GTIN
// resolves to the same product body. This restores valid alternate formats
// without falling back to an unrelated fuzzy food result.
export function searchQueries(barcode) {
  const digits = String(barcode || '').replace(/\D/g, '');
  const withoutCheck = digits.slice(0, -1);
  const body = withoutCheck.replace(/^0+/, '');
  return [...new Set([digits, withoutCheck, body].filter(value => value.length >= 8))];
}

const gtinBody = value => {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';
  return (validGtin(digits) ? digits.slice(0, -1) : digits).replace(/^0+/, '');
};

export function gtinMatches(candidate, barcode) {
  const wanted = String(barcode || '').replace(/\D/g, '');
  const values = String(candidate || '').match(/\d{8,14}/g) || [];
  return values.some(value => gtinKey(value) === gtinKey(wanted) || gtinBody(value) === gtinBody(wanted));
}

export function foodMatchesBarcode(food, barcode) {
  return [
    food?.gtinUpc,
    food?.gtin,
    food?.upc,
    food?.gtin_upc,
    food?.allHighlightFields
  ].some(value => gtinMatches(value, barcode));
}

export async function lookupOpenFoodFacts(barcode) {
  const fields = 'code,product_name,product_name_en,generic_name,brands,quantity,categories,categories_tags';
  const response = await fetch(`${OPEN_FOOD_FACTS_URL}${encodeURIComponent(barcode)}.json?fields=${fields}`, {
    signal: AbortSignal.timeout(7000),
    headers: { 'User-Agent': OPEN_FOOD_FACTS_AGENT, 'Accept': 'application/json' }
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Open Food Facts is temporarily unavailable.');
  const result = await response.json();
  const product = result?.product;
  if (!product || !/^success/.test(String(result?.status || ''))) return null;
  if (!gtinMatches(product.code, barcode)) return null;
  return cleanOpenFoodFacts(product);
}

export function cleanOpenFoodFacts(product) {
  const clean = value => String(value || '').replace(/[\u0000-\u001f<>]/g, '').trim();
  let name = clean(product?.product_name_en || product?.product_name || product?.generic_name)
    .replace(/\s+[\u2019']s\s*$/i, '').trim();
  const brand = clean(product?.brands).split(',')[0].trim();
  if (brand && name && !name.toLowerCase().includes(brand.toLowerCase())) name = `${brand} ${name}`;
  if (!name) return null;
  const food = {
    description: name,
    foodCategory: `${clean(product?.categories)} ${(Array.isArray(product?.categories_tags) ? product.categories_tags : []).join(' ')}`
  };
  const category = categoryFor(food);
  return {
    name: simpleName(name).toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()).slice(0, 60),
    ...amountFor(product?.quantity),
    category,
    storage: storageFor(food, category),
    source: 'Open Food Facts'
  };
}

export function categoryFor(food) {
  const text = `${food?.description || ''} ${food?.foodCategory || ''}`.toLowerCase();
  if (/\bfrozen\b|ice cream|frozen dessert/.test(text)) return 'Frozen';
  if (/snack|pretzel|candy|cookie|cracker|\bchips?\b|popcorn|nuts?\b/.test(text)) return 'Snacks';
  if (/milk|cheese|yogurt|yoghurt|cream|butter|dairy|egg/.test(text)) return 'Dairy';
  if (/meat|beef|pork|chicken|turkey|poultry|seafood|fish|shrimp|sausage|bacon/.test(text)) return 'Meat & Seafood';
  if (/beverage|drink|juice|soda|water|coffee|tea|fruit punch|sports drink/.test(text)) return 'Drinks';
  if (/fruit|vegetable|produce|apple|banana|lettuce|carrot|potato|onion/.test(text)) return 'Produce';
  if (/bread|bakery|cereal|grain|pasta|rice|tortilla|bagel|flour/.test(text)) return 'Grains & Bread';
  return 'Other';
}

export function storageFor(food, category) {
  const text = `${food?.description || ''} ${food?.foodCategory || ''}`.toLowerCase();
  if (category === 'Frozen') return 'Freezer';
  if (category === 'Snacks' || category === 'Grains & Bread' || category === 'Drinks') return 'Pantry';
  if (category === 'Meat & Seafood' || /milk|yogurt|yoghurt|cream|cheese|egg|refrigerated/.test(text)) return 'Fridge';
  return 'Pantry';
}

export function amountFor(packageWeight) {
  const text = String(packageWeight || '').replace(/,/g, '').toLowerCase()
    .replace(/¼/g, ' 1/4').replace(/½/g, ' 1/2').replace(/¾/g, ' 3/4')
    .replace(/⅛/g, ' 1/8').replace(/⅜/g, ' 3/8').replace(/⅝/g, ' 5/8').replace(/⅞/g, ' 7/8');
  const unitPattern = '(fl\\.?\\s*oz|fluid ounces?|oz|ounces?|lb|pounds?|gal|gallons?|kg|kilograms?|g|grams?|ml|milliliters?|l|liters?)';
  const fraction = text.match(new RegExp('(?:(\\d+(?:\\.\\d+)?)\\s+)?(\\d+)\\s*\\/\\s*(\\d+)\\s*' + unitPattern + '\\b'));
  const decimal = text.match(new RegExp('(\\d+(?:\\.\\d+)?)\\s*' + unitPattern + '\\b'));
  const match = fraction || decimal;
  if (!match) return { quantity: 1, unit: 'ct' };
  let quantity;
  let rawUnit;
  if (fraction) {
    const whole = Number(match[1] || 0), numerator = Number(match[2]), denominator = Number(match[3]);
    quantity = denominator ? whole + numerator / denominator : 0;
    rawUnit = match[4];
  } else {
    quantity = Number(match[1]);
    rawUnit = match[2];
  }
  let unit = rawUnit.replace(/\.|\s+/g, '');
  if (/^fluidounces?$|^floz$/.test(unit)) unit = 'fl oz';
  else if (/^ounces?$|^oz$/.test(unit)) unit = 'oz';
  else if (/^pounds?$|^lb$/.test(unit)) unit = 'lb';
  else if (/^gallons?$|^gal$/.test(unit)) unit = 'gal';
  else if (/^kilograms?$|^kg$/.test(unit)) { quantity *= 2.20462; unit = 'lb'; }
  else if (/^grams?$|^g$/.test(unit)) { quantity /= 28.3495; unit = 'oz'; }
  else if (/^milliliters?$|^ml$/.test(unit)) { quantity /= 29.5735; unit = 'fl oz'; }
  else if (/^liters?$|^l$/.test(unit)) { quantity /= 3.78541; unit = 'gal'; }
  if (!UNITS.includes(unit) || !Number.isFinite(quantity) || quantity <= 0) return { quantity: 1, unit: 'ct' };
  return { quantity: Math.round(quantity * 100) / 100, unit };
}

export function simpleName(description) {
  const parts = String(description || '').split(',').map(part => part.trim()).filter(Boolean);
  const kept = [];
  const normalized = value => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  for (const part of parts) {
    const current = normalized(part);
    const previous = normalized(kept.join(' '));
    if (current && (` ${previous} `).includes(` ${current} `)) continue;
    kept.push(part);
  }
  return kept.join(', ');
}

export function cleanFood(food) {
  const clean = value => String(value || '').replace(/[\u0000-\u001f<>]/g, '').trim();
  const category = categoryFor(food);
  const description = simpleName(clean(food?.description));
  return {
    name: description.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase()).slice(0, 60) || 'Unknown food',
    ...amountFor(food?.packageWeight),
    category,
    storage: storageFor(food, category)
  };
}

Deno.serve(handler);
