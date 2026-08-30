// ============================================================
// ai4you.site — secure write API for link units
// POST /api/units   { action: 'add'|'update'|'remove'|'list', ... }
//
// Auth layers:
//   1. Bearer token must match ADMIN_API_SECRET (env var, Vercel)
//   2. Supabase email+password auth (env vars) — the same admin
//      identity as the dashboard, so RLS remains the ONLY write path.
// No service_role key is used anywhere in this project.
//
// No CORS headers are emitted on purpose: this endpoint is called
// server-to-server (scripts, CI). Browsers are blocked by the
// missing Access-Control-Allow-Origin, and it is not needed here.
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { timingSafeEqual, createHash } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://igiogbnoqitejrifzsfo.supabase.co';
const PUBLISHABLE = process.env.SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0qtoRYvDd2n79knR1yN3Kg_Mp1NUDKz';
const ADMIN_EMAIL = process.env.SUPABASE_ADMIN_EMAIL || '';
const ADMIN_PASSWORD = process.env.SUPABASE_ADMIN_PASSWORD || '';
const ADMIN_SECRET = process.env.ADMIN_API_SECRET;

const VALID_TYPES = ['inline', 'button', 'card', 'banner', 'box'];

const str = (v, max) => (typeof v === 'string' ? v.slice(0, max) : null);

function timingSafe(provided, secret) {
  const a = Buffer.from(provided);
  const b = Buffer.from(secret);
  // timingSafeEqual throws on length mismatch — hash first for fixed length
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const auth = req.headers.authorization || '';
  const provided = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!ADMIN_SECRET || !provided || !timingSafe(provided, ADMIN_SECRET)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD not configured' });
  }

  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  } catch {
    return res.status(400).json({ error: 'Request body must be valid JSON' });
  }
  const action = body.action;

  const supabase = createClient(SUPABASE_URL, PUBLISHABLE, { auth: { persistSession: false } });
  const { error: authError } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (authError) {
    console.error('[api/units] supabase auth failed');
    return res.status(401).json({ error: 'Unauthorized' });
  }

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
      const slug = str(body.slug, 60) || '';
      const type = body.type;
      const label = str(body.label, 120);
      const url = str(body.url, 2048) || '';
      if (!/^[a-z0-9][a-z0-9-]{1,40}$/.test(slug)) {
        return res.status(400).json({ error: 'Invalid slug (2-40 chars: a-z 0-9 -)' });
      }
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({ error: `Invalid type; must be one of ${VALID_TYPES.join(', ')}` });
      }
      if (!label) return res.status(400).json({ error: 'label required' });
      try { const u = new URL(url); if (!/^https?:$/.test(u.protocol)) throw 0; }
      catch { return res.status(400).json({ error: 'url must be a valid http(s) URL' }); }

      const showOnShelf = body.show_on_shelf === true;
      const row = {
        slug,
        type,
        label,
        note: str(body.note ?? '', 400) ?? '',
        url,
        active: body.active !== false,
        show_on_shelf: showOnShelf,
        shelf_category: showOnShelf ? (str(body.shelf_category, 40) || 'productivity') : null,
        commission: str(body.commission, 80),
        network: str(body.network, 80),
      };
      const { data, error } = await supabase
        .from('link_units')
        .upsert(row, { onConflict: 'slug' })
        .select();
      if (error) throw error;
      return res.status(200).json({ ok: true, action, unit: data[0] });
    }

    if (action === 'remove') {
      const slug = str(body.slug, 60);
      if (!slug) return res.status(400).json({ error: 'slug required' });
      const { error } = await supabase.from('link_units').delete().eq('slug', slug);
      if (error) throw error;
      return res.status(200).json({ ok: true, removed: slug });
    }

    return res.status(400).json({ error: 'Unknown action; use add | update | remove | list' });
  } catch (e) {
    console.error('[api/units] handler error:', e?.message);
    return res.status(500).json({ error: 'Internal error' });
  }
}
