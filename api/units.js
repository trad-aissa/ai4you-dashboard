// ============================================================
// ai4you.site — secure write API for link units
// POST /api/units   { action: 'add'|'update'|'remove'|'list', ... }
//
// Auth layers:
//   1. Bearer token must match ADMIN_API_SECRET (env var, Vercel)
//   2. Supabase email+password auth (env vars) — the same admin
//      identity as the dashboard, so RLS remains the ONLY write path.
// No service_role key is used anywhere in this project.
// ============================================================
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://igiogbnoqitejrifzsfo.supabase.co';
const PUBLISHABLE = process.env.SUPABASE_PUBLISHABLE_KEY || '';
const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.SUPABASE_ADMIN_PASSWORD || '';
const ADMIN_SECRET = process.env.ADMIN_API_SECRET;

const VALID_TYPES = ['inline', 'button', 'card', 'banner', 'box'];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const auth = req.headers.authorization || '';
  if (!ADMIN_SECRET || auth !== `Bearer ${ADMIN_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD not configured' });
  }

  const supabase = createClient(SUPABASE_URL, PUBLISHABLE, { auth: { persistSession: false } });
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (authError) return res.status(401).json({ error: 'Supabase auth failed: ' + authError.message });

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const action = body.action;

  try {
    if (action === 'list') {
      const { data, error } = await supabase
        .from('link_units')
        .select('slug, type, label, note, url, active, show_on_shelf, shelf_category, commission, network')
        .order('created_at', { ascending: true });
      if (error) throw error;
      return res.status(200).json({ ok: true, units: data });
    }

    if (action === 'add' || action === 'update') {
      const { slug, type, label, note = '', url, active = true, show_on_shelf = false, shelf_category = null, commission = null, network = null } = body;
      if (!/^[a-z0-9][a-z0-9-]{1,40}$/.test(slug || '')) {
        return res.status(400).json({ error: 'Invalid slug (2-40 chars: a-z 0-9 -)' });
      }
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ error: `Invalid type; must be one of ${VALID_TYPES.join(', ')}` });
      }
      if (!label || typeof label !== 'string') return res.status(400).json({ error: 'label required' });
      try { const u = new URL(url || ''); if (!/^https?:$/.test(u.protocol)) throw 0; }
      catch { return res.status(400).json({ error: 'url must be a valid http(s) URL' }); }

      const row = { slug, type, label, note, url, active, show_on_shelf, shelf_category: show_on_shelf ? shelf_category : null, commission, network };
      const { data, error } = await supabase
        .from('link_units')
        .upsert(row, { onConflict: 'slug' })
        .select();
      if (error) throw error;
      return res.status(200).json({ ok: true, action, unit: data[0] });
    }

    if (action === 'remove') {
      const { slug } = body;
      if (!slug) return res.status(400).json({ error: 'slug required' });
      const { error } = await supabase.from('link_units').delete().eq('slug', slug);
      if (error) throw error;
      return res.status(200).json({ ok: true, removed: slug });
    }

    return res.status(400).json({ error: 'Unknown action; use add | update | remove | list' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}