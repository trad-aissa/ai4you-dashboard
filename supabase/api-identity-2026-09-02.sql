-- ============================================================
-- ai4you.site — security round, 2026-09-02. Idempotent: safe to re-run.
--
--   1. Stop leaking the admin's email to anyone with the public key  (SEC-6)
--   2. Split the API's identity from the owner's login               (SEC-2)
--   3. Let signed-in readers see the public site                     (SEC-4)
--
-- HOW TO RUN: Supabase Dashboard -> SQL Editor -> New query ->
-- paste this whole file -> Run. Then do the three steps at the bottom.
-- ============================================================


-- ============================================================
-- 1. SEC-6 — admin_email() was callable over the public REST API:
--
--      curl -X POST .../rest/v1/rpc/admin_email -H "apikey: sb_publishable_..."
--      -> "trad.aissa.at@gmail.com"
--
--    That hands an attacker the exact address to phish or credential-stuff.
--    These helpers only ever need to run inside is_admin(), which is
--    SECURITY DEFINER and therefore calls them as the owner — so nobody
--    else needs EXECUTE on them.
-- ============================================================

-- Every identity allowed to write. The owner signs into /admin; the bot is
-- used only by api/units.js and the CLI, and never touches the UI.
create or replace function admin_emails() returns text[]
language sql stable as $$
  select array[
    'trad.aissa.at@gmail.com',   -- owner (dashboard)
    'bot@ai4you.site'            -- API bot (server-to-server only)
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

-- Lock the helpers away from the public API. `public` is the catch-all role
-- that every new function is granted to by default, so revoke that too.
revoke execute on function admin_emails() from public, anon, authenticated;
revoke execute on function admin_email()  from public, anon, authenticated;

-- is_admin() stays callable: RLS policy expressions are evaluated as the
-- querying role, so anon/authenticated must be able to run it. It leaks
-- nothing — it answers "are YOU the admin", and for anyone else that is false.
grant execute on function is_admin() to anon, authenticated;


-- ============================================================
-- 3. SEC-4 — the public policies were scoped to `anon`, so any signed-in
--    user who is not the admin saw zero link units and could not log a
--    click. These policies mean "the public", not "logged out".
-- ============================================================
drop policy if exists "public read active units" on link_units;
create policy "public read active units" on link_units
  for select to anon, authenticated using (active = true);

drop policy if exists "public insert clicks" on click_events;
create policy "public insert clicks" on click_events
  for insert to anon, authenticated with check (
    char_length(unit_slug) between 2 and 60
    and (page is null or char_length(page) <= 200)
    and (ref is null or char_length(ref) <= 500)
  );

drop policy if exists "public insert subscribers" on newsletter_subscribers;
create policy "public insert subscribers" on newsletter_subscribers
  for insert to anon, authenticated with check (
    char_length(email) <= 254
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
  );


-- ============================================================
-- VERIFY (run these after, in the same SQL editor)
--   select admin_emails();  -- owner + bot@ai4you.site
--   select is_admin();      -- false here is normal: no login in the editor
--
-- And from a terminal, this must now fail instead of returning the email:
--   curl -X POST 'https://igiogbnoqitejrifzsfo.supabase.co/rest/v1/rpc/admin_email' \
--        -H 'apikey: sb_publishable_0qtoRYvDd2n79knR1yN3Kg_Mp1NUDKz'
-- ============================================================


-- ============================================================
-- 2. SEC-2 — three steps outside SQL, in this order.
--
--    Today api/units.js and scripts/add-unit.mjs sign in with YOUR real
--    /admin dashboard password, which sits in .env.local and in Vercel's
--    environment. One disclosure gives away both. After these steps the
--    dashboard password lives only in your head.
--
--    1. Supabase -> Authentication -> Users -> "Add user".
--         email: bot@ai4you.site   (no mailbox needed)
--         password: generate a long random one, save it in your manager
--         tick "Auto Confirm User"  <- important, or it can never sign in
--       Adding a user here is an admin action, so it still works with
--       signups disabled.
--
--    2. Vercel -> Project -> Settings -> Environment Variables:
--       set SUPABASE_ADMIN_EMAIL=bot@ai4you.site and
--       SUPABASE_ADMIN_PASSWORD=<the generated one>, then redeploy.
--       Do this AFTER step 1, or /api/units returns 401 until the user exists.
--
--    3. Put the same pair in .env.local so scripts/add-unit.mjs keeps working.
--
--    Check it worked (needs your ADMIN_API_SECRET):
--      curl -X POST https://www.ai4you.site/api/units \
--        -H "Authorization: Bearer $ADMIN_API_SECRET" \
--        -H 'Content-Type: application/json' -d '{"action":"list"}'
--    -> {"ok":true,"units":[...]}  means the bot can write. 401 means step 1
--       or 2 is incomplete.
-- ============================================================
