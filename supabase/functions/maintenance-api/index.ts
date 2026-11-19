// The service-role credential is used only after Auth verifies the caller and
// the private maintenance allowlist approves that same caller's JWT.
const env = (key: string) => Deno.env.get(key) || '';
const ORIGINS = ['https://jarod049.github.io', ...env('ALLOWED_ORIGINS').split(',').map(value => value.trim()).filter(Boolean)];
const INVITE_REDIRECT = env('MAINTENANCE_INVITE_REDIRECT_URL') || 'https://jarod049.github.io/MyPantry/maintenance.html';
const PAGE_SIZE = 50;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECIPE_ID = /^[a-z0-9-]{1,80}$/;
const CATEGORIES = new Set(['Fruits', 'Vegetables', 'Meat & Seafood', 'Dairy & Eggs', 'Grains & Bread', 'Snacks', 'Sauces & Condiments', 'Spices & Baking', 'Prepared Meals', 'Drinks', 'Other']);
const UNITS = new Set(['ct', 'oz', 'lb', 'fl oz', 'gal', 'g', 'kg', 'mL', 'L', 'can', 'loaf', 'head', 'bag', 'bulb', 'box', 'jar']);
const RECIPE_FIELDS = new Set(['recipe_id', 'name', 'emoji', 'cuisine', 'main_ingredient', 'minutes', 'serves', 'background', 'keywords', 'ingredients', 'steps', 'substitutions', 'video_url', 'sort_order', 'is_published']);
const PANTRY_FIELDS = new Set(['auth_user_id', 'ingredient_name', 'brand', 'product_name', 'quantity', 'measurement', 'food_type', 'expiration_date', 'storage_location', 'expiration_source', 'way_added']);

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function corsFor(req: Request) {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(origin) ? origin : ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function validString(value: unknown, field: string, max: number, allowEmpty = false): string {
  if (typeof value !== 'string') throw new ApiError(400, `${field} must be text.`);
  const clean = value.trim();
  if ((!allowEmpty && !clean) || clean.length > max || /[\u0000-\u001f\u007f<>]/.test(clean)) {
    throw new ApiError(400, `${field} must be ${allowEmpty ? 'at most' : '1 to'} ${max} characters.`);
  }
  return clean;
}

function optionalString(value: unknown, field: string, max: number): string | null {
  if (value === null || value === '') return null;
  return validString(value, field, max);
}

function strictKeys(values: Record<string, unknown>, allowed: Set<string>) {
  for (const key of Object.keys(values)) {
    if (!allowed.has(key)) throw new ApiError(400, `${key} cannot be changed here.`);
  }
}

function emailAddress(value: unknown): string {
  const email = validString(value, 'Email', 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ApiError(400, 'Enter a valid email address.');
  return email;
}

function uuid(value: unknown, field: string): string {
  if (typeof value !== 'string' || !UUID.test(value)) throw new ApiError(400, `${field} must be a valid user ID.`);
  return value.toLowerCase();
}

function intIn(value: unknown, field: string, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new ApiError(400, `${field} must be a whole number from ${min} to ${max}.`);
  }
  return value;
}

function textArray(value: unknown, field: string, count: number, length: number, required = false): string[] {
  if (!Array.isArray(value) || (required && !value.length) || value.length > count) {
    throw new ApiError(400, `${field} needs ${required ? '1 to' : 'at most'} ${count} entries.`);
  }
  return value.map(entry => validString(entry, field, length));
}

function dateOnly(value: unknown): string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new ApiError(400, 'Use a valid date (YYYY-MM-DD).');
  const parsed = new Date(`${value}T00:00:00Z`);
  if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) throw new ApiError(400, 'Use a valid calendar date.');
  return value;
}

function statusFor(date: string): string {
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  const part = (type: string) => parts.find(value => value.type === type)?.value || '';
  const today = `${part('year')}-${part('month')}-${part('day')}`;
  const days = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000);
  return days < 0 ? 'Expired' : days <= 7 ? 'Expiring soon' : 'Fresh';
}

function sanitizedUser(raw: Record<string, unknown>) {
  const metadata = object(raw.user_metadata) ? raw.user_metadata : {};
  return {
    id: raw.id,
    email: raw.email,
    display_name: typeof metadata.name === 'string' ? metadata.name : typeof metadata.display_name === 'string' ? metadata.display_name : '',
    created_at: raw.created_at || null,
    last_sign_in_at: raw.last_sign_in_at || null,
    email_confirmed_at: raw.email_confirmed_at || null
  };
}

function recipeValues(raw: unknown, creating: boolean): Record<string, unknown> {
  if (!object(raw)) throw new ApiError(400, 'Recipe values are required.');
  strictKeys(raw, RECIPE_FIELDS);
  if (!Object.keys(raw).length) throw new ApiError(400, 'Choose at least one recipe field.');
  if (!creating && 'recipe_id' in raw) throw new ApiError(400, 'Recipe ID cannot be changed.');
  const out: Record<string, unknown> = {};
  if ('recipe_id' in raw) {
    const id = validString(raw.recipe_id, 'Recipe ID', 80);
    if (!RECIPE_ID.test(id)) throw new ApiError(400, 'Recipe ID can contain lowercase letters, numbers, and hyphens only.');
    out.recipe_id = id;
  }
  for (const key of ['name', 'cuisine', 'main_ingredient'] as const) {
    if (key in raw) out[key] = validString(raw[key], key, key === 'name' ? 120 : 80);
  }
  if ('emoji' in raw) out.emoji = validString(raw.emoji, 'Emoji', 16);
  if ('minutes' in raw) out.minutes = intIn(raw.minutes, 'Minutes', 1, 240);
  if ('serves' in raw) out.serves = intIn(raw.serves, 'Serves', 1, 24);
  if ('sort_order' in raw) out.sort_order = intIn(raw.sort_order, 'Sort order', -10000, 10000);
  if ('is_published' in raw) {
    if (typeof raw.is_published !== 'boolean') throw new ApiError(400, 'Published must be yes or no.');
    out.is_published = raw.is_published;
  }
  if ('keywords' in raw) out.keywords = textArray(raw.keywords, 'Keywords', 30, 80);
  if ('steps' in raw) out.steps = textArray(raw.steps, 'Steps', 30, 500, true);
  if ('ingredients' in raw) {
    if (!Array.isArray(raw.ingredients) || !raw.ingredients.length || raw.ingredients.length > 40) {
      throw new ApiError(400, 'Ingredients need 1 to 40 entries.');
    }
    out.ingredients = raw.ingredients.map((ingredient, index) => {
      if (!object(ingredient)) throw new ApiError(400, `Ingredient ${index + 1} is invalid.`);
      strictKeys(ingredient, new Set(['m', 'a', 'label']));
      const amount = ingredient.a;
      if (typeof amount !== 'number' || !Number.isFinite(amount) || amount <= 0 || amount > 10000) {
        throw new ApiError(400, `Ingredient ${index + 1} needs a positive amount.`);
      }
      return {
        m: validString(ingredient.m, `Ingredient ${index + 1} match`, 120),
        a: amount,
        label: validString(ingredient.label, `Ingredient ${index + 1} label`, 180)
      };
    });
  }
  if ('substitutions' in raw) {
    if (raw.substitutions !== null && !object(raw.substitutions)) throw new ApiError(400, 'Substitutions must be an object.');
    const substitutions = raw.substitutions as Record<string, unknown> | null;
    if (substitutions && Object.keys(substitutions).length > 20) throw new ApiError(400, 'Use at most 20 substitutions.');
    const clean: Record<string, unknown> = Object.create(null);
    for (const [name, value] of Object.entries(substitutions || {})) {
      if (!object(value)) throw new ApiError(400, 'Each substitution needs a use list and description.');
      strictKeys(value, new Set(['use', 'text']));
      clean[validString(name, 'Substitution ingredient', 120)] = {
        use: textArray(value.use, 'Substitution foods', 10, 120, true),
        text: validString(value.text, 'Substitution description', 500)
      };
    }
    out.substitutions = substitutions === null ? null : clean;
  }
  if ('video_url' in raw) {
    const value = optionalString(raw.video_url, 'Video URL', 500);
    if (value) {
      let url: URL;
      try { url = new URL(value); } catch { throw new ApiError(400, 'Video URL must use HTTPS.'); }
      if (url.protocol !== 'https:' || !url.hostname) throw new ApiError(400, 'Video URL must use HTTPS.');
      out.video_url = url.toString();
    } else {
      out.video_url = null;
    }
  }
  if ('background' in raw) {
    const background = optionalString(raw.background, 'Background', 250);
    const safeGradient = background && /^radial-gradient\([a-z0-9#%.,()\s-]{1,230}\)$/i.test(background) && !/\b(?:url|expression|image-set)\s*\(/i.test(background);
    if (background && !/^#[0-9a-f]{3,8}$/i.test(background) && !safeGradient) {
      throw new ApiError(400, 'Background must be a hex color or a simple radial gradient.');
    }
    out.background = background;
  }
  if (creating) {
    for (const key of ['recipe_id', 'name', 'cuisine', 'main_ingredient', 'minutes', 'serves', 'ingredients', 'steps']) {
      if (!(key in out)) throw new ApiError(400, `${key} is required to create a recipe.`);
    }
    if (!('is_published' in out)) out.is_published = false;
  } else out.updated_at = new Date().toISOString();
  return out;
}

function pantryValues(raw: unknown, creating: boolean): Record<string, unknown> {
  if (!object(raw)) throw new ApiError(400, 'Pantry values are required.');
  strictKeys(raw, PANTRY_FIELDS);
  if (!Object.keys(raw).length) throw new ApiError(400, 'Choose at least one pantry field.');
  const out: Record<string, unknown> = {};
  if ('auth_user_id' in raw) out.auth_user_id = uuid(raw.auth_user_id, 'Owner ID');
  if ('ingredient_name' in raw) out.ingredient_name = validString(raw.ingredient_name, 'Item name', 120);
  if ('brand' in raw) out.brand = optionalString(raw.brand, 'Brand', 80);
  if ('product_name' in raw) out.product_name = optionalString(raw.product_name, 'Product name', 120);
  if ('quantity' in raw) {
    if (typeof raw.quantity !== 'number' || !Number.isFinite(raw.quantity) || raw.quantity <= 0 || raw.quantity > 1000000) {
      throw new ApiError(400, 'Quantity must be greater than zero and no more than 1,000,000.');
    }
    out.quantity = raw.quantity;
  }
  if ('measurement' in raw) {
    if (!UNITS.has(raw.measurement as string)) throw new ApiError(400, 'Choose a valid measurement.');
    out.measurement = raw.measurement;
  }
  if ('food_type' in raw) {
    if (!CATEGORIES.has(raw.food_type as string)) throw new ApiError(400, 'Choose a valid food category.');
    out.food_type = raw.food_type;
  }
  if ('expiration_date' in raw) {
    out.expiration_date = dateOnly(raw.expiration_date);
    out.status = statusFor(out.expiration_date as string);
  }
  if ('storage_location' in raw) {
    if (!['Fridge', 'Pantry', 'Freezer'].includes(raw.storage_location as string)) throw new ApiError(400, 'Choose a valid storage location.');
    out.storage_location = raw.storage_location;
  }
  if ('expiration_source' in raw) {
    if (!['label', 'ai'].includes(raw.expiration_source as string)) throw new ApiError(400, 'Choose a valid date source.');
    out.expiration_source = raw.expiration_source;
  }
  if ('way_added' in raw) {
    if (!['manual', 'barcode', 'receipt', 'pantry_photo'].includes(raw.way_added as string)) throw new ApiError(400, 'Choose a valid addition source.');
    out.way_added = raw.way_added;
  }
  if (creating) {
    for (const key of ['auth_user_id', 'ingredient_name', 'quantity', 'measurement', 'food_type', 'expiration_date']) {
      if (!(key in out)) throw new ApiError(400, `${key} is required to create a pantry item.`);
    }
    out.user_id = null;
    if (!('way_added' in out)) out.way_added = 'manual';
    if (!('expiration_source' in out)) out.expiration_source = 'label';
  }
  return out;
}

function credentials() {
  const base = env('SUPABASE_URL').replace(/\/$/, '');
  const anon = env('SUPABASE_ANON_KEY');
  const service = env('SUPABASE_SERVICE_ROLE_KEY');
  if (!base || !anon || !service) throw new ApiError(503, 'Maintenance is not configured yet.');
  return { base, anon, service };
}

async function readJson(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  try { return await response.json(); } catch { return null; }
}

async function verifyCaller(req: Request, base: string, anon: string) {
  const authorization = req.headers.get('Authorization') || '';
  if (!/^Bearer [^\s]+$/.test(authorization)) throw new ApiError(401, 'Please sign in again.');
  const headers = { apikey: anon, Authorization: authorization, 'Content-Type': 'application/json' };
  const auth = await fetch(`${base}/auth/v1/user`, { headers });
  if (!auth.ok) throw new ApiError(401, 'Please sign in again.');
  const user = await readJson(auth);
  if (!object(user) || typeof user.id !== 'string' || !UUID.test(user.id)) throw new ApiError(401, 'Please sign in again.');
  const check = await fetch(`${base}/rest/v1/rpc/is_maintenance_admin`, { method: 'POST', headers, body: '{}' });
  if (!check.ok) throw new ApiError(503, 'Maintenance access could not be checked.');
  return { user, isAdmin: (await readJson(check)) === true };
}

async function serviceRequest(base: string, service: string, path: string, method = 'GET', body?: unknown, prefer?: string): Promise<unknown> {
  const headers: Record<string, string> = { apikey: service, Authorization: `Bearer ${service}`, Accept: 'application/json', 'Content-Type': 'application/json' };
  if (prefer) headers.Prefer = prefer;
  const response = await fetch(`${base}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  if (!response.ok) {
    if (response.status === 404) throw new ApiError(404, 'Record was not found.');
    if (response.status === 409) throw new ApiError(409, 'A record with that ID or email already exists.');
    if (response.status === 400 || response.status === 422) throw new ApiError(400, 'The record was rejected. Check its required fields and values.');
    console.error('Maintenance upstream request failed', response.status, path.split('?')[0]);
    throw new ApiError(503, 'Maintenance is temporarily unavailable.');
  }
  return readJson(response);
}

async function authUser(base: string, service: string, id: string) {
  const result = await serviceRequest(base, service, `/auth/v1/admin/users/${encodeURIComponent(id)}`);
  const user = object(result) && object(result.user) ? result.user : result;
  if (!object(user) || user.id !== id) throw new ApiError(404, 'User was not found.');
  return user;
}

async function ownerExists(base: string, service: string, id: string) {
  await authUser(base, service, id);
}

async function isProtectedUser(base: string, service: string, id: string): Promise<boolean> {
  const result = await serviceRequest(base, service, '/rest/v1/rpc/is_maintenance_admin_user', 'POST', { p_user_id: id });
  return result === true;
}

async function isOkrAdminUser(base: string, service: string, id: string): Promise<boolean> {
  const result = await serviceRequest(base, service, '/rest/v1/rpc/is_okr_admin_user', 'POST', { p_user_id: id });
  return result === true;
}

async function usersAction(action: string, id: unknown, values: unknown, page: number, callerId: string, base: string, service: string) {
  if (action === 'list') {
    const [result, protectedIds] = await Promise.all([
      serviceRequest(base, service, `/auth/v1/admin/users?page=${page}&per_page=${PAGE_SIZE}`),
      serviceRequest(base, service, '/rest/v1/rpc/maintenance_admin_user_ids', 'POST', {})
    ]);
    if (!object(result) || !Array.isArray(result.users)) throw new ApiError(503, 'User list is unavailable.');
    if (!Array.isArray(protectedIds)) throw new ApiError(503, 'User roles are unavailable.');
    const protectedSet = new Set(protectedIds.filter((value): value is string => typeof value === 'string'));
    const total = typeof result.total === 'number' ? result.total : null;
    return { items: result.users.filter(object).map(user => ({ ...sanitizedUser(user), is_admin: protectedSet.has(user.id as string) })), page, hasMore: total === null ? result.users.length === PAGE_SIZE : page * PAGE_SIZE < total };
  }
  if (action === 'create') {
    if (!object(values)) throw new ApiError(400, 'User values are required.');
    strictKeys(values, new Set(['email', 'display_name']));
    const email = emailAddress(values.email);
    const displayName = 'display_name' in values ? optionalString(values.display_name, 'Display name', 40) : null;
    // The invite link returns to the deployed maintenance page. Supabase Auth
    // must allowlist this exact redirect URL in its URL configuration.
    // No password or recovery token is ever returned to the browser.
    const invitePath = `/auth/v1/invite?redirect_to=${encodeURIComponent(INVITE_REDIRECT)}`;
    const invited = await serviceRequest(base, service, invitePath, 'POST', { email, data: displayName ? { name: displayName, display_name: displayName } : {} });
    const user = object(invited) && object(invited.user) ? invited.user : invited;
    if (!object(user)) throw new ApiError(503, 'The invitation result was unavailable.');
    return sanitizedUser(user);
  }
  const userId = uuid(id, 'User ID');
  if (action === 'update') {
    if (!object(values)) throw new ApiError(400, 'User values are required.');
    strictKeys(values, new Set(['email', 'display_name']));
    if (!Object.keys(values).length) throw new ApiError(400, 'Choose a user field to update.');
    const existing = await authUser(base, service, userId);
    const patch: Record<string, unknown> = {};
    if ('email' in values) {
      const nextEmail = emailAddress(values.email);
      // The pinned OKR account loses dashboard access if its email changes.
      if (nextEmail !== String(existing.email || '').toLowerCase() && await isOkrAdminUser(base, service, userId)) {
        throw new ApiError(403, 'The OKR administrator email cannot be changed here.');
      }
      patch.email = nextEmail;
    }
    if ('display_name' in values) {
      const metadata = object(existing.user_metadata) ? existing.user_metadata : {};
      const name = optionalString(values.display_name, 'Display name', 40) || '';
      patch.user_metadata = { ...metadata, name, display_name: name };
    }
    const result = await serviceRequest(base, service, `/auth/v1/admin/users/${encodeURIComponent(userId)}`, 'PUT', patch);
    const user = object(result) && object(result.user) ? result.user : result;
    if (!object(user)) throw new ApiError(503, 'The user update result was unavailable.');
    return sanitizedUser(user);
  }
  if (action === 'delete') {
    if (userId === callerId || await isProtectedUser(base, service, userId)) {
      throw new ApiError(403, 'Maintenance administrators cannot be deleted here.');
    }
    await authUser(base, service, userId);
    await serviceRequest(base, service, `/auth/v1/admin/users/${encodeURIComponent(userId)}`, 'DELETE');
    return { id: userId };
  }
  throw new ApiError(400, 'Choose a valid user action.');
}

function tableId(resource: string, id: unknown): string {
  if (resource === 'recipes') {
    if (typeof id !== 'string' || !RECIPE_ID.test(id)) throw new ApiError(400, 'Choose a valid recipe ID.');
    return id;
  }
  if ((typeof id !== 'number' && typeof id !== 'string') || !/^\d{1,15}$/.test(String(id)) || Number(id) < 1 || !Number.isSafeInteger(Number(id))) {
    throw new ApiError(400, 'Choose a valid pantry item ID.');
  }
  return String(id);
}

async function pantryWithOwnerEmail(rows: Record<string, unknown>[], base: string, service: string) {
  const ids = [...new Set(rows.map(row => row.auth_user_id).filter((id): id is string => typeof id === 'string' && UUID.test(id)))];
  const emails = new Map<string, string | null>();
  // Limit concurrent Auth lookups so a page of pantry rows does not burst the
  // Auth Admin API. Missing users stay blank; the pantry rows still display.
  for (let start = 0; start < ids.length; start += 10) {
    const batch = ids.slice(start, start + 10);
    const results = await Promise.allSettled(batch.map(id => authUser(base, service, id)));
    results.forEach((result, index) => {
      emails.set(batch[index], result.status === 'fulfilled' && typeof result.value.email === 'string' ? result.value.email : null);
    });
  }
  return rows.map(row => ({ ...row, owner_email: typeof row.auth_user_id === 'string' ? emails.get(row.auth_user_id) || null : null }));
}

async function tableAction(resource: 'recipes' | 'pantry', action: string, id: unknown, values: unknown, page: number, base: string, service: string) {
  const table = resource === 'recipes' ? 'recipe' : 'pantry_item';
  const key = resource === 'recipes' ? 'recipe_id' : 'ingredient_id';
  const select = resource === 'recipes'
    ? 'recipe_id,name,emoji,cuisine,main_ingredient,minutes,serves,background,keywords,ingredients,steps,substitutions,video_url,sort_order,is_published,created_at,updated_at'
    : 'ingredient_id,auth_user_id,ingredient_name,brand,product_name,quantity,measurement,food_type,expiration_date,status,storage_location,expiration_source,way_added';
  if (action === 'list') {
    const order = resource === 'recipes' ? 'sort_order.asc,recipe_id.asc' : 'ingredient_id.desc';
    const path = `/rest/v1/${table}?select=${select}&order=${order}&limit=${PAGE_SIZE + 1}&offset=${(page - 1) * PAGE_SIZE}`;
    const rows = await serviceRequest(base, service, path);
    if (!Array.isArray(rows)) throw new ApiError(503, 'Record list is unavailable.');
    const items = rows.slice(0, PAGE_SIZE).filter(object);
    return { items: resource === 'pantry' ? await pantryWithOwnerEmail(items, base, service) : items, page, hasMore: rows.length > PAGE_SIZE };
  }
  if (action === 'create') {
    const clean = resource === 'recipes' ? recipeValues(values, true) : pantryValues(values, true);
    if (resource === 'pantry') await ownerExists(base, service, clean.auth_user_id as string);
    const rows = await serviceRequest(base, service, `/rest/v1/${table}?select=${select}`, 'POST', clean, 'return=representation');
    if (!Array.isArray(rows) || !object(rows[0])) throw new ApiError(503, 'Record creation result was unavailable.');
    return rows[0];
  }
  const target = tableId(resource, id);
  const path = `/rest/v1/${table}?${key}=eq.${encodeURIComponent(target)}&select=${select}`;
  if (action === 'update') {
    const clean = resource === 'recipes' ? recipeValues(values, false) : pantryValues(values, false);
    if (resource === 'pantry' && 'auth_user_id' in clean) await ownerExists(base, service, clean.auth_user_id as string);
    const rows = await serviceRequest(base, service, path, 'PATCH', clean, 'return=representation');
    if (!Array.isArray(rows) || !object(rows[0])) throw new ApiError(404, 'Record was not found.');
    return rows[0];
  }
  if (action === 'delete') {
    const rows = await serviceRequest(base, service, path, 'DELETE', undefined, 'return=representation');
    if (!Array.isArray(rows) || !object(rows[0])) throw new ApiError(404, 'Record was not found.');
    return { id: target };
  }
  throw new ApiError(400, 'Choose a valid record action.');
}

export async function handler(req: Request): Promise<Response> {
  const cors = corsFor(req);
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  try {
    const { base, anon, service } = credentials();
    const { user, isAdmin } = await verifyCaller(req, base, anon);
    const raw = await req.text();
    if (raw.length > 65536) throw new ApiError(413, 'Request is too large.');
    let body: unknown;
    try { body = JSON.parse(raw); } catch { throw new ApiError(400, 'Invalid request.'); }
    if (!object(body)) throw new ApiError(400, 'Invalid request.');
    if (body.resource === 'session' && body.action === 'status') return json({ data: { isAdmin } });
    if (!isAdmin) throw new ApiError(403, 'Maintenance administrator access is required.');
    if (!['users', 'recipes', 'pantry'].includes(body.resource as string)) throw new ApiError(400, 'Choose a valid resource.');
    if (!['list', 'create', 'update', 'delete'].includes(body.action as string)) throw new ApiError(400, 'Choose a valid action.');
    const page = body.page === undefined ? 1 : intIn(body.page, 'Page', 1, 10000);
    const data = body.resource === 'users'
      ? await usersAction(body.action as string, body.id, body.values, page, user.id as string, base, service)
      : await tableAction(body.resource as 'recipes' | 'pantry', body.action as string, body.id, body.values, page, base, service);
    return json({ data });
  } catch (error) {
    if (error instanceof ApiError) return json({ error: error.message }, error.status);
    console.error('Maintenance request failed', error instanceof Error ? error.name : 'unknown');
    return json({ error: 'Maintenance is temporarily unavailable.' }, 503);
  }
}

Deno.serve(handler);
