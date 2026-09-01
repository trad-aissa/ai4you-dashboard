-- ============================================================
-- ai4you.site — split the API's identity from the owner's login
-- 2026-09-02. Idempotent: safe to re-run.
--
-- WHY: api/units.js and scripts/add-unit.mjs both authenticate with
-- SUPABASE_ADMIN_EMAIL/PASSWORD — which were the owner's real /admin
-- dashboard password, sitting in .env.local and in Vercel env. One
-- disclosure gave away both the write API and the dashboard.
--
-- AFTER running this, do the three steps at the bottom.
-- ============================================================

-- Every identity allowed to write. The owner signs into /admin; the bot
-- is used only by api/units.js and the CLI, and never touches the UI.
create or replace function admin_emails() returns text[]
language sql stable as $$
  select array[
    'trad.aissa.at@gmail.com',   -- owner (dashboard)
    'CHANGE-ME@ai4you.site'      -- API bot (server-to-server only)
  ];
$$;

-- Kept so the old single-owner helper still resolves if anything calls it.
create or replace function admin_email() returns text
language sql stable as $$
  select (admin_emails())[1];
$$;

create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from auth.users u
    where u.id = auth.uid()
      and lower(u.email) in (select lower(e) from unnest(admin_emails()) as e)
  );
$$;

-- ---------- verify ----------
--   select admin_emails();   -- both addresses, bot address no longer CHANGE-ME
--   select admin_email();    -- the owner's address
--
-- ---------- then, outside SQL ----------
-- 1. Supabase → Authentication → Users → Add user. Use the bot address,
--    a fresh generated password, and tick "Auto Confirm User".
-- 2. Vercel → Settings → Environment Variables: point
--    SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD at the bot, redeploy.
-- 3. Put the same bot pair in .env.local so scripts/add-unit.mjs keeps
--    working — your own dashboard password then lives nowhere on disk.
