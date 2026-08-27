-- ============================================================
-- ai4you.site — Supabase schema  (CORRECTED — safe to re-run)
-- Run this ONCE in the Supabase SQL Editor.
-- ⚠️  STEP 0: change the email in admin_email() below to YOUR email.
--
-- Idempotent: safe whether your database is fresh or already has
-- the tables/policies from the earlier (broken) version — it drops
-- and recreates policies, and uses IF NOT EXISTS for tables.
-- ============================================================

-- ---------- STEP 0 · your admin identity ----------
-- ⚠️ CHANGE THIS EMAIL to your real one:
create or replace function admin_email() returns text
language sql stable as $$
  select 'you@example.com';
$$;

-- Admin check: does the currently signed-in user have the admin email?
-- (auth.uid() = the signed-in user's id; we look up their email in auth.users)
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from auth.users
    where auth.uid() = id
      and lower(email) = lower(admin_email())
  );
$$;

-- ---------- tables ----------
create table if not exists link_units (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,          -- used as data-a4u slug / sub-id
  type        text not null check (type in ('inline','button','card','banner','box')),
  label       text not null,
  note        text default '',
  url         text not null,                 -- your affiliate/tracking URL
  active      boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists click_events (
  id          bigint generated always as identity primary key,
  unit_slug   text not null,
  page        text,                           -- which page the click came from
  ref         text,                           -- document.referrer if any
  created_at  timestamptz not null default now()
);

-- ---------- RLS ----------
alter table link_units   enable row level security;
alter table click_events enable row level security;

-- clean slate for policies (safe if they don't exist yet)
drop policy if exists "public read active units" on link_units;
drop policy if exists "admin full units"         on link_units;
drop policy if exists "public insert clicks"     on click_events;
drop policy if exists "admin read clicks"        on click_events;

-- Public (anon) can READ active units — the public site needs them.
create policy "public read active units" on link_units
  for select to anon using (active = true);

-- Admin can do everything (insert/update/delete, incl. inactive).
create policy "admin full units" on link_units
  for all to authenticated
  using (is_admin())
  with check (is_admin());

-- Public can INSERT clicks but never read them back.
create policy "public insert clicks" on click_events
  for insert to anon with check (true);

-- Admin reads/exports click analytics.
create policy "admin read clicks" on click_events
  for select to authenticated
  using (is_admin());

-- keep updated_at fresh
create or replace function touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists link_units_touch on link_units;
create trigger link_units_touch before update on link_units
  for each row execute function touch_updated_at();

-- ---------- starter units ----------
insert into link_units (slug, type, label, note, url) values
  ('jasper-inline-demo', 'inline', 'Jasper', 'the AI writer marketing teams actually keep paying for', 'https://www.jasper.ai/'),
  ('elevenlabs-button-demo', 'button', 'Try ElevenLabs free', 'Studio-quality AI voices for videos and podcasts', 'https://elevenlabs.io/'),
  ('descript-card-demo', 'card', 'Descript', 'Edit video and podcasts like a text document. Free tier, paid plans from ~$12/mo.', 'https://www.descript.com/'),
  ('weekly-deals-banner-demo', 'banner', 'This week''s AI deals', 'Verified discounts on the tools we rate — refreshed weekly.', 'https://example.com/REPLACE_ME'),
  ('starter-box-demo', 'box', 'Our AI starter pick', 'One tool we''d install first on a new machine. Free to start, upgrade only if it earns it.', 'https://example.com/REPLACE_ME')
on conflict (slug) do nothing;

-- ---------- verify ----------
-- Run these to confirm everything worked:
--   select admin_email();                    -- must show YOUR email
--   select is_admin();                       -- false here is normal (no login in SQL editor)
--   select slug, type, active from link_units;  -- 5 starter rows
