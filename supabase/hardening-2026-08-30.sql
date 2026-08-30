-- ============================================================
-- ai4you.site — security hardening (idempotent, safe to re-run)
-- 2026-08-30 round 2: silent rate limits on public inserts.
--
-- Design note: the site's privacy policy promises "an anonymous
-- counter row — no profile, no identifier", so we deliberately do
-- NOT store IPs. Limits are therefore per-slug and global instead
-- of per-IP. Excess inserts are silently dropped (RETURN NULL) —
-- an attacker gets no error signal and table size stays bounded.
-- ============================================================

-- ---------- click_events: max 60/min per slug, 1000/min global ----------
create or replace function clicks_rate_limit() returns trigger
language plpgsql as $$
begin
  if (
    select count(*) from click_events
    where created_at > now() - interval '1 minute'
      and unit_slug = new.unit_slug
  ) >= 60 then
    return null;
  end if;
  if (
    select count(*) from click_events
    where created_at > now() - interval '1 minute'
  ) >= 1000 then
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists clicks_rate_limit_trg on click_events;
create trigger clicks_rate_limit_trg
  before insert on click_events
  for each row execute function clicks_rate_limit();

-- ---------- newsletter: max 50 signups per hour globally ----------
-- (the unique-email constraint already stops same-address floods;
--  this caps bulk fake-email stuffing while staying silent for
--  real signup waves of reasonable size)
create or replace function newsletter_rate_limit() returns trigger
language plpgsql as $$
begin
  if (
    select count(*) from newsletter_subscribers
    where created_at > now() - interval '1 hour'
  ) >= 50 then
    return null;
  end if;
  return new;
end;
$$;

drop trigger if exists newsletter_rate_limit_trg on newsletter_subscribers;
create trigger newsletter_rate_limit_trg
  before insert on newsletter_subscribers
  for each row execute function newsletter_rate_limit();
