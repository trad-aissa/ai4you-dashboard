-- ============================================================
-- ai4you.site — upgrade SQL (run once in Supabase SQL Editor)
-- 2026-08-30: newsletter waitlist table + click_events hardening
-- Idempotent: safe to re-run.
-- ============================================================

-- ---------- 1. Newsletter subscribers ----------
-- The homepage form inserts here with the anon key. RLS allows
-- anonymous INSERT of a syntactically valid email only; only the
-- admin (is_admin(), defined in schema.sql) can read or delete rows.
create table if not exists newsletter_subscribers (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

drop policy if exists "public insert subscribers" on newsletter_subscribers;
create policy "public insert subscribers" on newsletter_subscribers
  for insert to anon with check (
    char_length(email) <= 254
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$'
  );

drop policy if exists "admin read subscribers" on newsletter_subscribers;
create policy "admin read subscribers" on newsletter_subscribers
  for select to authenticated
  using (is_admin());

drop policy if exists "admin delete subscribers" on newsletter_subscribers;
create policy "admin delete subscribers" on newsletter_subscribers
  for delete to authenticated
  using (is_admin());

-- ---------- 2. click_events hardening ----------
-- Replace the open insert policy with length-bounded fields so
-- abuse can't write arbitrary blobs into the analytics table.
drop policy if exists "public insert clicks" on click_events;
create policy "public insert clicks" on click_events
  for insert to anon with check (
    char_length(unit_slug) between 2 and 60
    and (page is null or char_length(page) <= 200)
    and (ref is null or char_length(ref) <= 500)
  );

-- Speeds up the dashboard's "last 30 days" count query.
create index if not exists click_events_created_at_idx
  on click_events (created_at desc);
