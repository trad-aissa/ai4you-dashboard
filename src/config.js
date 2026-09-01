// ============================================================
// ai4you.site — central configuration
// Central configuration — Supabase (publishable key era) + admin identity.
// 1. https://supabase.com → New project (free tier is fine)
// 1. https://supabase.com -> New project (free tier is fine)
// 2. Project Settings -> API -> copy "Project URL" and the
//    "publishable" key (sb_publishable_..., safe for browsers — real
//    security is enforced by Row Level Security on Supabase's side).
// ============================================================

export const SITE = {
  name: 'ai4you.site',
  url: 'https://www.ai4you.site',
};

// Editorial freshness. Bump these when you actually re-check, so the dates on
// /tools, the model matrix and the lesson footers all move together.
export const REVIEWED = 'August 2026';
export const LESSONS_PUBLISHED = '2026-08-30';

export const SUPABASE_URL = 'https://igiogbnoqitejrifzsfo.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_0qtoRYvDd2n79knR1yN3Kg_Mp1NUDKz';

// Only this email can ever edit links (enforced twice:
// in the dashboard UI and by a database RLS policy).
export const ADMIN_EMAIL = 'trad.aissa.at@gmail.com';
