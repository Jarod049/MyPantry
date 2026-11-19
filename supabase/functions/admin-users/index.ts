// Auth-user CRUD for the pinned demo administrator. The service-role key stays
// inside Supabase; every request first proves its caller through the user's JWT
// and the is_maintenance_admin() database function.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.8';

const env = (key: string) => Deno.env.get(key) || '';
const ORIGINS = ['https://jarod049.github.io', ...env('ALLOWED_ORIGINS').split(',').map(value => value.trim()).filter(Boolean)];
const localOrigin = (origin: string) => {
  try {
    const url = new URL(origin);
    return url.protocol === 'http:' && url.port === '4173' && ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname.toLowerCase());
  } catch { return false; }
};
const corsFor = (req: Request) => {
  const origin = req.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': ORIGINS.includes(origin) || localOrigin(origin) ? origin : ORIGINS[0],
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };
};
const cleanEmail = (value: unknown) => typeof value === 'string' ? value.trim().toLowerCase() : '';
const cleanName = (value: unknown) => typeof value === 'string' ? value.trim().slice(0, 40) : '';
const publicUser = (user: any) => ({
  id: user.id,
  email: user.email || '',
  name: cleanName(user.user_metadata?.name),
  created_at: user.created_at || null,
  last_sign_in_at: user.last_sign_in_at || null,
  email_confirmed_at: user.email_confirmed_at || null
});

Deno.serve(async (req: Request) => {
  const cors = corsFor(req);
  const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);

  try {
    const authorization = req.headers.get('Authorization') || '';
    if (!authorization.startsWith('Bearer ')) return json({ error: 'Please sign in again.' }, 401);
    const url = env('SUPABASE_URL');
    const anonKey = env('SUPABASE_ANON_KEY');
    const serviceKey = env('SUPABASE_SERVICE_ROLE_KEY');
    if (!url || !anonKey || !serviceKey) return json({ error: 'User maintenance is not configured.' }, 503);

    const callerClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: callerData, error: callerError } = await callerClient.auth.getUser();
    if (callerError || !callerData.user) return json({ error: 'Please sign in again.' }, 401);
    const { data: allowed, error: accessError } = await callerClient.rpc('is_maintenance_admin');
    if (accessError || allowed !== true) return json({ error: 'Administrator access is required.' }, 403);

    let body: any;
    try { body = await req.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
    const action = typeof body?.action === 'string' ? body.action : '';
    const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    if (action === 'list') {
      const users: any[] = [];
      for (let page = 1; page <= 10; page++) {
        const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
        if (error) throw error;
        users.push(...data.users);
        if (data.users.length < 200) break;
      }
      return json({ users: users.map(publicUser).sort((a, b) => a.email.localeCompare(b.email)) });
    }

    if (action === 'create') {
      const email = cleanEmail(body.email);
      const password = typeof body.password === 'string' ? body.password : '';
      const name = cleanName(body.name);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: 'Enter a valid email address.' }, 400);
      if (password.length < 8 || !/[^A-Za-z0-9\s]/.test(password)) return json({ error: 'Use at least 8 password characters and one symbol.' }, 400);
      if (!name) return json({ error: 'Enter a user name.' }, 400);
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { name } });
      if (error) throw error;
      return json({ user: publicUser(data.user) }, 201);
    }

    const userId = typeof body?.user_id === 'string' ? body.user_id : '';
    if (!/^[0-9a-f-]{36}$/i.test(userId)) return json({ error: 'Choose a valid user.' }, 400);
    if (action === 'update') {
      const attributes: Record<string, unknown> = {};
      const email = cleanEmail(body.email);
      const password = typeof body.password === 'string' ? body.password : '';
      const name = cleanName(body.name);
      if (userId === callerData.user.id && email && email !== cleanEmail(callerData.user.email)) {
        return json({ error: 'The grading administrator email is protected.' }, 400);
      }
      if (email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return json({ error: 'Enter a valid email address.' }, 400);
        attributes.email = email; attributes.email_confirm = true;
      }
      if (name) attributes.user_metadata = { name };
      if (password) {
        if (password.length < 8 || !/[^A-Za-z0-9\s]/.test(password)) return json({ error: 'Use at least 8 password characters and one symbol.' }, 400);
        attributes.password = password;
      }
      const { data, error } = await admin.auth.admin.updateUserById(userId, attributes);
      if (error) throw error;
      return json({ user: publicUser(data.user) });
    }
    if (action === 'delete') {
      if (userId === callerData.user.id) return json({ error: 'The signed-in grading administrator cannot delete itself.' }, 400);
      const { error } = await admin.auth.admin.deleteUser(userId);
      if (error) throw error;
      return json({ deleted: userId });
    }
    return json({ error: 'Unknown user-maintenance action.' }, 400);
  } catch (error) {
    console.error('[admin-users]', error);
    return json({ error: error instanceof Error ? error.message : 'User maintenance failed.' }, 500);
  }
});
