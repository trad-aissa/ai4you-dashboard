---
name: ai4you-dashboard
description: AI news site (ai4you.site) with Supabase-powered link dashboard. Astro + Supabase. Monetization = affiliate link placements managed in /admin.
---

# ai4you-dashboard

AI news website with a real link-management dashboard. Public site is static Astro; the
`/admin` dashboard talks to Supabase (auth + Postgres + RLS).

## Stack

- **Astro 7** (static output) — pages render at build time, near-zero client JS
- **Supabase** — email/password auth, `link_units` + `click_events` tables, Row Level Security
- **Vercel** — free-tier hosting, auto-deploys from GitHub

## Setup (first time)

1. **Supabase**: create a free project at supabase.com → SQL Editor → run `supabase/schema.sql`
   (edit `admin_email()` inside it to YOUR email first).
2. **Config**: fill `src/config.js` with your Project URL + anon key (Supabase → Settings → API)
   and your admin email.
3. **Create your admin user**: Supabase → Authentication → Users → "Add user" (email + password).
4. **Dev**: `npm run dev` → site at localhost:4321, dashboard at `/admin`.
5. **Deploy**: push to GitHub → import in Vercel (Astro is auto-detected) → done.

## Where things live

- `src/config.js` — Supabase URL/key + admin email
- `src/data/news.js` — news items + briefs (edit to add stories)
- `src/lib/link-units.js` — placement renderer (inline/button/card/banner/box)
- `src/lib/supabase.js` — client + queries + click logging
- `src/pages/index.astro` — homepage (news + placements)
- `src/pages/admin.astro` — the dashboard
- `supabase/schema.sql` — tables + RLS policies + starter units

## How placements work

1. Dashboard (`/admin`) → New placement (slug, type, label, note, URL) → Save.
2. Reference it in a page: `<Fragment set:html={unit('SLUG')} />` (see `src/pages/index.astro`).
3. Redeploy → placement is live. Clicks log to `click_events`; dashboard shows 30-day counts.

## Security model

- Public anon role can only SELECT active units and INSERT clicks (Row Level Security).
- Only the configured admin email (authenticated) can write — enforced in the DB, not just the UI.
- The anon key in the browser is safe by design; never put the service_role key in client code.