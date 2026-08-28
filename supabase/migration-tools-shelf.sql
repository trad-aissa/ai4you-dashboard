-- Add shelf metadata to link_units so the /tools page can render from DB
alter table link_units add column if not exists show_on_shelf boolean not null default false;
alter table link_units add column if not exists shelf_category text;
alter table link_units add column if not exists commission text;
alter table link_units add column if not exists network text;

-- Seed: put AutoClaw on the shelf
update link_units set show_on_shelf = true, shelf_category = 'productivity',
  commission = 'credits per referral', network = 'in-house'
where slug = 'autoclaw-invite';