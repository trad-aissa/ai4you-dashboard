// ============================================================
// ai4you.site — Supabase client (singleton)
// Imported at build time and by /admin only. Public-page writes go
// through src/lib/track.js, which needs no client library — keep it
// that way or the 209KB bundle lands on every page again.
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

/** Fetch all ACTIVE link units (used by public pages). */
export async function getActiveUnits() {
  const { data, error } = await supabase
    .from('link_units')
    .select('slug, type, label, note, url')
    .eq('active', true)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

// Build-time cache: every <LinkUnit> on every page shares one query.
let _bySlug;
/** Look up one active unit by slug. Returns null if missing, paused, or the DB is down. */
export function unitBySlug(slug) {
  _bySlug ??= getActiveUnits().then(
    (units) => Object.fromEntries(units.map((u) => [u.slug, u])),
    (e) => (console.error('[link-units] DB unreachable:', e?.message ?? e), {}),
  );
  return _bySlug.then((map) => map[slug] ?? null);
}
