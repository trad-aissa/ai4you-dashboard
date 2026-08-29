-- Add JustWorker referral unit (banner) + put it on the shelf
insert into link_units (slug, type, label, note, url, active, show_on_shelf, shelf_category, commission, network) values
  ('justworker-referral', 'banner', 'Earn on micro-tasks', 'A freelance micro-jobs platform our readers asked us to try — free to join, earn on small tasks.', 'https://api.justwoker.icu/register?aff=qaNM', true, true, 'productivity', 'referral-based', 'in-house')
on conflict (slug) do update set
  type = excluded.type, label = excluded.label, note = excluded.note, url = excluded.url,
  active = excluded.active, show_on_shelf = excluded.show_on_shelf, shelf_category = excluded.shelf_category,
  commission = excluded.commission, network = excluded.network, updated_at = now();