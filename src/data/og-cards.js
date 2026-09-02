// ============================================================
// ai4you.site — social card copy, one entry per shareable page.
//
// Deliberately separate from each page's <title>: SEO titles carry a
// "· ai4you.site" suffix and qualifiers that waste space on a 1200x630
// card. These are the short, punchy versions.
//
// A page missing from here falls back to /og-default.png, so forgetting
// an entry degrades quietly instead of pointing at a 404.
// src/pages/og/[...slug].png.ts renders one PNG per entry at build time.
// ============================================================
import { modules } from './learn.js';

const PAGES = {
  '/':                    { title: 'The model race, decoded for busy humans', tag: 'AI wire · frontier models' },
  '/news':                { title: 'AI headlines, gathered daily',            tag: 'Headlines · updated 06:00 UTC' },
  '/stories':             { title: 'Every briefing we have published',        tag: 'Archive · all stories' },
  '/tools':               { title: 'The tool shelf',                          tag: 'Tools · honestly labelled' },
  '/best-writing-tools':  { title: 'The 4 best AI writing tools in 2026',     tag: 'Compared · writing' },
  '/changelog':           { title: 'The agentic CLI changelogs',              tag: 'Claude Code · Codex · daily' },
  '/article':             { title: 'The August 2026 model scorecard',         tag: 'Deep dive · six labs' },
  '/learn':               { title: 'Learn AI coding agents by doing',         tag: 'Learn · interactive' },
  '/learn/playground':    { title: 'A safe terminal to practise in',          tag: 'Learn · playground' },
  '/learn/builder':       { title: 'Generate your CLAUDE.md, hooks and MCP config', tag: 'Learn · config builder' },
  '/learn/cheat-sheet':   { title: 'Claude Code & Codex quick reference',     tag: 'Learn · cheat sheet' },
  '/learn/features':      { title: 'Every command, flag and file',            tag: 'Learn · feature index' },
  '/learn/resources':     { title: 'Templates and starter packs',             tag: 'Learn · resources' },
  '/about':               { title: 'Who we are, and how we make money',       tag: 'About · disclosure · privacy' },
  '/terms':               { title: 'Terms of use',                            tag: 'ai4you.site' },
};

// Lessons keep their own titles — those are already short.
for (const m of modules) {
  PAGES[`/learn/${m.slug}`] = { title: m.title, tag: `Learn · ${m.tool} · ${m.minutes} min` };
}

export const OG_CARDS = PAGES;

/** Route path -> the slug used by /og/<slug>.png ('/' becomes 'index'). */
export const ogSlug = (path) => (!path || path === '/' ? 'index' : path.replace(/^\/+/, ''));
