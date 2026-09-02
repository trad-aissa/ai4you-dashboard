// ============================================================
// ai4you.site — public-page writes, no client library.
// These are two INSERTs against PostgREST. Importing
// @supabase/supabase-js for them costs 209KB of GoTrue, Realtime,
// Storage and Functions that no public page touches; admin.astro
// still uses the real client, where sessions and refresh earn it.
// ============================================================
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY as KEY } from '../config.js';

const insert = (table, row) =>
  fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(row),
  });

/** Log a click. Fire-and-forget: never blocks or breaks the page. */
export function logClick(slug, page) {
  // Privacy: store the referrer's origin only (never full URLs, which can
  // carry personal data from other sites) — matches /about#privacy.
  let ref = null;
  try { ref = document.referrer ? new URL(document.referrer).origin : null; } catch { ref = null; }
  insert('click_events', { unit_slug: slug, page: page ?? location.pathname, ref }).catch(() => {});
}

/** Add an address to the waitlist. Resolves to 'ok' | 'duplicate' | 'error'. */
export async function subscribeEmail(email) {
  // Deliberately no `return=representation`: anon has an INSERT policy on
  // newsletter_subscribers but no SELECT policy, and asking for the row back
  // makes Postgres reject the whole statement — which read as a failed signup.
  try {
    const res = await insert('newsletter_subscribers', { email });
    if (res.ok) return 'ok';
    const body = await res.json().catch(() => ({}));
    return body.code === '23505' ? 'duplicate' : 'error';
  } catch {
    return 'error';
  }
}
