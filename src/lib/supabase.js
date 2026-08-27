// ============================================================
// ai4you.site — Supabase client (singleton)
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

/** Log a click. Fire-and-forget: never blocks or breaks the page. */
export function logClick(slug, page) {
  supabase
    .from('click_events')
    .insert({ unit_slug: slug, page: page ?? location.pathname, ref: document.referrer || null })
    .then(() => {}, () => {});
}
