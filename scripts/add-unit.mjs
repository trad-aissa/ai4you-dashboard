// ============================================================
// ai4you.site — link unit CLI (admin bridge)
// Lets the owner (or their agent) add/list link units from the
// command line using Supabase auth + RLS (no service keys).
//
// SETUP (once): put in .env.local (gitignored):
//   SUPABASE_ADMIN_EMAIL=you@domain.com
//   SUPABASE_ADMIN_PASSWORD=your-dashboard-password
//
// USAGE (from project root):
//   node --env-file=.env.local scripts/add-unit.mjs add <slug> <type> <label> <note> <url>
//   node --env-file=.env.local scripts/add-unit.mjs list
//   node --env-file=.env.local scripts/add-unit.mjs remove <slug>
//
// type: inline | button | card | banner | box
// ============================================================
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from '../src/config.js';

const email = process.env.SUPABASE_ADMIN_EMAIL;
const password = process.env.SUPABASE_ADMIN_PASSWORD;
if (!email || !password) {
  console.error('Missing SUPABASE_ADMIN_EMAIL / SUPABASE_ADMIN_PASSWORD in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
if (authError) { console.error('Auth failed:', authError.message); process.exit(1); }
console.log(`Authenticated as ${authData.user.email}`);

const [,, cmd, ...args] = process.argv;

if (cmd === 'add') {
  const [slug, type, label, note, url] = args;
  if (!slug || !type || !label || !url) {
    console.error('Usage: add <slug> <inline|button|card|banner|box> <label> [note] <url>');
    process.exit(1);
  }
  if (!['inline','button','card','banner','box'].includes(type)) {
    console.error('Invalid type:', type); process.exit(1);
  }
  const { data, error } = await supabase
    .from('link_units')
    .upsert({ slug, type, label, note: note ?? '', url, active: true }, { onConflict: 'slug' })
    .select();
  if (error) { console.error('Insert failed:', error.message); process.exit(1); }
  console.log('Unit saved:', JSON.stringify(data[0], null, 2));
  console.log('Live on next deploy (git push, or: vercel deploy --prod)');
}
else if (cmd === 'list') {
  const { data, error } = await supabase.from('link_units').select('slug,type,label,active,url').order('created_at');
  if (error) { console.error(error.message); process.exit(1); }
  for (const u of data) console.log(`${u.active ? '✓' : '⏸'} ${u.slug.padEnd(28)} ${u.type.padEnd(8)} ${u.label}  ->  ${u.url}`);
  console.log(`\n${data.length} unit(s)`);
}
else if (cmd === 'remove') {
  const [slug] = args;
  const { error } = await supabase.from('link_units').delete().eq('slug', slug);
  if (error) { console.error(error.message); process.exit(1); }
  console.log(`Removed "${slug}" (live on next deploy). Remember to remove its placement from pages.`);
}
else {
  console.error('Commands: add | list | remove');
  process.exit(1);
}