insert into link_units (slug, type, label, note, url, active) values
  ('autoclaw-invite', 'box', 'Try AutoClaw free', 'The AI assistant that built and runs this site — news gathering, deploys, everything.', 'https://autoglm.ai/misc/autoclaw-invite?activity_id=autoclaw_fission&channel=fission&target_app=autoclaw&target_app_version=1.17.8&os=win&IC=3HCNDH77', true)
on conflict (slug) do update set
  type = excluded.type,
  label = excluded.label,
  note = excluded.note,
  url = excluded.url,
  active = excluded.active,
  updated_at = now();