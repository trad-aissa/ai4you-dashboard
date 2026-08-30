// ============================================================
// ai4you.site — daily news + changelogs fetcher (no deps, Node 22+)
// Runs locally or in GitHub Actions (see .github/workflows/daily-update.yml).
//
//   node scripts/fetch-daily.mjs
//
// Writes:
//   src/data/auto/headlines.json   — merged, deduped, newest-first (cap 80)
//   src/data/auto/changelogs.json  — Claude Code + Codex releases
// Every feed failing is non-fatal: previous data is kept and merged.
// ============================================================
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const UA = { 'User-Agent': 'ai4you.site-daily-bot (+https://www.ai4you.site)' };
const DATA_DIR = new URL('../src/data/auto/', import.meta.url);
const MAX_HEADLINES = 80;
const MAX_AGE_DAYS = 14;

const FEEDS = [
  { source: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
  { source: 'Google DeepMind', url: 'https://deepmind.google/blog/rss.xml' },
  { source: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/' },
  { source: 'VentureBeat', url: 'https://venturebeat.com/category/ai/feed/' },
  { source: 'Ars Technica', url: 'https://arstechnica.com/ai/feed/' },
  { source: 'The Verge', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml' },
  { source: 'Simon Willison', url: 'https://simonwillison.net/atom/everything/', filter: /\b(AI|LLM|GPT|GPT-?5|Claude|Gemini|Codex|agent|model)\b/i },
];

const HN_URL = 'https://hn.algolia.com/api/v1/search_by_date?query=AI&tags=story&hitsPerPage=30&numericFilters=points%3E50';

async function fetchText(url, timeoutMs = 20_000) {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), timeoutMs);
  try {
    const res = await fetch(url, { headers: UA, signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally { clearTimeout(t); }
}

const decode = (s = '') => s
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/&#0?39;|&apos;|&rsquo;|&lsquo;/g, "'").replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&');
const stripTags = (s = '') => decode(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const tag = (block, name) => stripTags(block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'))?.[1] ?? '');
const linkOf = (block) => {
  const href = block.match(/<link[^>]*href="([^"]+)"/i)?.[1];
  return href ? stripTags(href) : stripTags(block.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? '');
};

/** Parse RSS 2.0 or Atom into common items. */
function parseFeed(xml) {
  const entries = [...xml.matchAll(/<(?:item|entry)[\s\S]*?<\/(?:item|entry)>/gi)].map((m) => m[0]);
  return entries.map((e) => ({
    title: tag(e, 'title'),
    url: linkOf(e),
    date: tag(e, 'pubDate') || tag(e, 'published') || tag(e, 'updated') || tag(e, 'date'),
    snippet: stripTags(tag(e, 'description') || tag(e, 'summary') || tag(e, 'content')).slice(0, 220),
  }));
}

const toIso = (d) => { const t = Date.parse(d); return Number.isNaN(t) ? null : new Date(t).toISOString(); };
const idOf = (url) => createHash('sha1').update(url).digest('hex').slice(0, 12);

/** Markdown inline → safe HTML: strip links to their text, escape, then `x` → <code>x</code>. */
const mdInline = (s = '') =>
  decode(s)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\s+/g, ' ')
    .trim();

async function readJson(file, fallback) {
  try { return JSON.parse(await readFile(new URL(file, DATA_DIR), 'utf8')); } catch { return fallback; }
}

// ---------- headlines ----------
async function fetchHeadlines() {
  const since = Date.now() - MAX_AGE_DAYS * 24 * 3600 * 1000;
  const out = [];

  for (const feed of FEEDS) {
    try {
      for (const it of parseFeed(await fetchText(feed.url))) {
        if (!it.title || !/^https?:/.test(it.url)) continue;
        if (feed.filter && !feed.filter.test(it.title)) continue;
        const date = toIso(it.date);
        if (!date || Date.parse(date) < since) continue;
        out.push({ id: idOf(it.url), title: it.title.slice(0, 200), url: it.url, source: feed.source, date, snippet: it.snippet });
      }
      console.log(`feed ok: ${feed.source}`);
    } catch (e) { console.warn(`feed FAILED: ${feed.source} (${e.message})`); }
  }

  try {
    const hits = JSON.parse(await fetchText(HN_URL)).hits ?? [];
    for (const h of hits) {
      const url = h.url || `https://news.ycombinator.com/item?id=${h.objectID}`;
      const date = toIso(h.created_at);
      if (!date || Date.parse(date) < since) continue;
      out.push({ id: idOf(url), title: (h.title ?? '').slice(0, 200), url, source: 'Hacker News', date, snippet: `${h.points ?? 0} points · ${h.num_comments ?? 0} comments on HN` });
    }
    console.log('feed ok: Hacker News');
  } catch (e) { console.warn(`feed FAILED: Hacker News (${e.message})`); }

  const prev = await readJson('headlines.json', { items: [] });
  const seen = new Set();
  const merged = [...out, ...(prev.items ?? [])]
    .filter((it) => (seen.has(it.url) ? false : (seen.add(it.url), true)))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, MAX_HEADLINES);

  return { updated: new Date().toISOString(), count: merged.length, items: merged };
}

// ---------- changelogs ----------
function parseClaudeChangelog(md, max = 25) {
  const releases = [];
  const parts = md.split(/^## /m).slice(1);
  for (const part of parts) {
    const version = part.split('\n')[0].replace(/^\[?([\d.]+[\w.-]*)\]?.*$/, '$1').trim();
    if (!/^[\d.]/.test(version)) continue;
    const bullets = [...part.matchAll(/^[-*] (.+)$/gm)].map((m) => mdInline(m[1])).filter(Boolean);
    if (bullets.length) releases.push({ version, date: null, bullets: bullets.slice(0, 30) });
    if (releases.length >= max) break;
  }
  return releases;
}

async function fetchCodexReleases() {
  const headers = { ...UA, Accept: 'application/vnd.github+json' };
  if (process.env.GH_TOKEN || process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GH_TOKEN || process.env.GITHUB_TOKEN}`;
  }
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), 20_000);
  try {
    const res = await fetch('https://api.github.com/repos/openai/codex/releases?per_page=20', { headers, signal: ctl.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return json.map((r) => ({
      version: (r.tag_name || '').replace(/^[a-z]+-v?/i, '').replace(/^v/, ''),
      date: toIso(r.published_at),
      bullets: mdInline((r.body ?? '').replace(/^#+ .*$/gm, ''))
        .split(/(?<=\.)\s+(?=[A-Z])|\n+/).map((s) => s.trim()).filter((s) => s.length > 3).slice(0, 12),
    })).filter((r) => r.version);
  } finally { clearTimeout(t); }
}

async function fetchChangelogs() {
  const result = { updated: new Date().toISOString(), 'claude-code': [], codex: [] };
  try { result['claude-code'] = parseClaudeChangelog(await fetchText('https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md')); }
  catch (e) { console.warn(`claude-code changelog FAILED (${e.message})`); }
  try { result.codex = await fetchCodexReleases(); }
  catch (e) { console.warn(`codex releases FAILED (${e.message})`); }
  const prev = await readJson('changelogs.json', null);
  if (!result['claude-code'].length && prev) result['claude-code'] = prev['claude-code'] ?? [];
  if (!result.codex.length && prev) result.codex = prev.codex ?? [];
  return result;
}

// ---------- main ----------
await mkdir(DATA_DIR, { recursive: true });
const headlines = await fetchHeadlines();
const changelogs = await fetchChangelogs();

// Keep the previous `updated` timestamp when content is identical, so
// quiet days produce zero git diffs (and the workflow makes no commit).
const prevAll = await readJson('headlines.json', null);
const prevCl = await readJson('changelogs.json', null);
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (prevAll && same(headlines.items, prevAll.items)) headlines.updated = prevAll.updated;
if (prevCl && same(
  { cc: changelogs['claude-code'], cx: changelogs.codex },
  { cc: prevCl['claude-code'], cx: prevCl.codex },
)) changelogs.updated = prevCl.updated;

await writeFile(new URL('headlines.json', DATA_DIR), JSON.stringify(headlines, null, 2) + '\n');
await writeFile(new URL('changelogs.json', DATA_DIR), JSON.stringify(changelogs, null, 2) + '\n');
console.log(`headlines: ${headlines.count} | claude-code: ${changelogs['claude-code'].length} releases | codex: ${changelogs.codex.length} releases`);
