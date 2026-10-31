const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function boot({ key = 'usda-key', auth = true, foods, offProduct = null } = {}) {
  const calls = [];
  let handle;
  const found = foods ?? [{
    fdcId: 1,
    gtinUpc: '0016000275287',
    description: 'CHEDDAR CHEESE',
    foodCategory: 'Cheese',
    packageWeight: '8 oz',
    publishedDate: '2026-05-01'
  }];
  const context = {
    Request, Response, AbortSignal, URL, JSON, Number, Math, Array, String,
    Deno: {
      env: { get: name => ({ SUPABASE_URL: 'https://test.supabase.co', SUPABASE_ANON_KEY: 'anon', USDA_FDC_API_KEY: key })[name] },
      serve: fn => { handle = fn; }
    },
    fetch: async (url, options) => {
      calls.push({ url, options });
      if (url.endsWith('/user')) return new Response(JSON.stringify(auth ? { id: 'owner' } : {}), { status: auth ? 200 : 401 });
      if (url.startsWith('https://world.openfoodfacts.org/')) return new Response(JSON.stringify(offProduct
        ? { status: 'success', product: offProduct }
        : { status: 'failure', product: null }));
      const result = typeof foods === 'function' ? foods(JSON.parse(options.body)) : found;
      return new Response(JSON.stringify({ foods: result }));
    }
  };
  vm.runInNewContext(
    fs.readFileSync('supabase/functions/barcode-lookup/index.ts', 'utf8').replace(/export (async )?function/g, '$1function'),
    context
  );
  return {
    calls,
    request: (barcode, token = 'Bearer session', origin = 'https://jarod049.github.io') => handle(new Request('https://test/barcode', {
      method: 'POST', headers: { Authorization: token, Origin: origin }, body: JSON.stringify({ barcode })
    }))
  };
}

test('allows standard local test origins without Supabase secret changes', async () => {
  const b = boot();
  for (const origin of [
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://10.0.0.8:4173',
    'http://172.20.4.5:4173',
    'http://192.168.1.42:4173'
  ]) {
    const response = await b.request('016000275286', 'Bearer session', origin);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), origin);
  }
});

test('does not reflect public or incorrectly ported development origins', async () => {
  const b = boot();
  for (const origin of ['https://example.com', 'http://192.168.1.42:8080', 'http://172.32.0.1:4173']) {
    const response = await b.request('016000275286', 'Bearer session', origin);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'https://jarod049.github.io');
  }
});

test('requires a signed-in user before USDA lookup', async () => {
  const b = boot({ auth: false });
  assert.equal((await b.request('016000275287')).status, 401);
  assert.equal(b.calls.length, 1);
});

test('rejects invalid GTIN check digits', async () => {
  const b = boot();
  assert.equal((await b.request('016000275286')).status, 400);
  assert.equal(b.calls.length, 1);
});

test('requires the USDA secret', async () => {
  const b = boot({ key: '' });
  assert.equal((await b.request('016000275287')).status, 503);
  assert.equal(b.calls.length, 1);
});

test('looks up an exact normalized GTIN and maps it to existing pantry fields', async () => {
  const b = boot();
  const response = await b.request('016000275287');
  assert.equal(response.status, 200);
  const request = JSON.parse(b.calls[1].options.body);
  assert.deepEqual(request.dataType, ['Branded']);
  assert.equal(request.query, '016000275287');
  assert.equal(b.calls[1].options.headers['X-Api-Key'], 'usda-key');
  assert.deepEqual(await response.json(), {
    barcode: '016000275287',
    item: { name: 'Cheddar Cheese', quantity: 8, unit: 'oz', category: 'Dairy', storage: 'Fridge', source: 'USDA FoodData Central' }
  });
});

test('does not accept fuzzy USDA search results', async () => {
  const b = boot({ foods: [{ gtinUpc: '012345678905', description: 'OTHER PRODUCT' }] });
  assert.equal((await b.request('016000275287')).status, 404);
});

test('retries USDA with the UPC body and accepts the equivalent EAN', async () => {
  const b = boot({ foods: request => request.query === '5200006775' ? [{
    fdcId: 2,
    gtinUpc: '0052000067750',
    description: 'GATORADE LOWER SUGAR FRUIT PUNCH',
    foodCategory: 'Beverages',
    packageWeight: '28 fl oz'
  }] : [] });
  const response = await b.request('052000067750');
  assert.equal(response.status, 200);
  assert.deepEqual(b.calls.slice(1).map(call => JSON.parse(call.options.body).query), [
    '052000067750', '05200006775', '5200006775'
  ]);
  assert.deepEqual(await response.json(), {
    barcode: '052000067750',
    item: { name: 'Gatorade Lower Sugar Fruit Punch', quantity: 28, unit: 'fl oz', category: 'Drinks', storage: 'Pantry', source: 'USDA FoodData Central' }
  });
});

test('accepts an exact UPC shown in USDA search metadata when gtinUpc is omitted', async () => {
  const b = boot({ foods: [{
    fdcId: 3,
    description: 'PEANUT BUTTER CANDIES',
    foodCategory: 'Candy',
    packageWeight: '9 oz',
    allHighlightFields: '<b>GTIN/UPC</b>: <em>040000579816</em>'
  }] });
  const response = await b.request('040000579816');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).item.name, 'Peanut Butter Candies');
});

test('uses Open Food Facts only after USDA has no matching product', async () => {
  const cases = [
    {
      barcode: '6281036564108',
      product: { code: '6281036564108', product_name: 'Doritos Nacho Cheese', brands: 'Doritos', quantity: '48g', categories: 'Corn chips' },
      expected: { name: 'Doritos Nacho Cheese', quantity: 1.69, unit: 'oz', category: 'Snacks', storage: 'Pantry', source: 'Open Food Facts' }
    },
    {
      barcode: '040000579816',
      product: { code: '0040000579816', product_name: 'Peanut butter ’s', brands: "M&M's", quantity: '9.0 oz', categories: 'Candy chocolate bars' },
      expected: { name: "M&m's Peanut Butter", quantity: 9, unit: 'oz', category: 'Snacks', storage: 'Pantry', source: 'Open Food Facts' }
    },
    {
      barcode: '052000067750',
      product: { code: '0052000067750', product_name: 'LOWER SUGAR FRUIT PUNCH ELECTROLYTE BEVERAGE', brands: 'Gatorade' },
      expected: { name: 'Gatorade Lower Sugar Fruit Punch Electrolyte Beverage', quantity: 1, unit: 'ct', category: 'Drinks', storage: 'Pantry', source: 'Open Food Facts' }
    }
  ];
  for (const entry of cases) {
    const b = boot({ foods: [], offProduct: entry.product });
    const response = await b.request(entry.barcode);
    assert.equal(response.status, 200);
    assert.deepEqual((await response.json()).item, entry.expected);
    assert.ok(b.calls.some(call => call.url.startsWith('https://world.openfoodfacts.org/')));
  }
});

test('does not use Open Food Facts when USDA has an exact match', async () => {
  const b = boot({ offProduct: { code: '0016000275287', product_name: 'WRONG FALLBACK' } });
  const response = await b.request('016000275287');
  assert.equal(response.status, 200);
  assert.equal((await response.json()).item.source, 'USDA FoodData Central');
  assert.equal(b.calls.some(call => call.url.startsWith('https://world.openfoodfacts.org/')), false);
});

test('converts metric package weights to existing app units', async () => {
  const b = boot({ foods: [{ gtinUpc: '016000275287', description: 'PASTA', foodCategory: 'Grains', packageWeight: '500 g' }] });
  const body = await (await b.request('016000275287')).json();
  assert.equal(body.item.category, 'Grains & Bread');
  assert.equal(body.item.unit, 'oz');
  assert.equal(body.item.quantity, 17.64);
  assert.equal(body.item.storage, 'Pantry');
});

test('cleans repeated USDA names, parses mixed fractions, and prioritizes snacks over tortilla grains', async () => {
  const b = boot({ foods: [{
    gtinUpc: '028400325080',
    description: 'SPICY NACHO TORTILLA CHIPS, SPICY NACHO',
    foodCategory: 'Chips, Pretzels & Snacks',
    packageWeight: '2 3/4 oz/77.9 g'
  }] });
  const body = await (await b.request('028400325080')).json();
  assert.deepEqual(body.item, {
    name: 'Spicy Nacho Tortilla Chips',
    quantity: 2.75,
    unit: 'oz',
    category: 'Snacks',
    storage: 'Pantry',
    source: 'USDA FoodData Central'
  });
});
