// ============================================================
// ai4you.site — link unit renderer (shared by public pages)
// Drop one into a page with <LinkUnit slug="SLUG" /> (src/components/LinkUnit.astro).
// Every unit carries rel="sponsored nofollow noopener", target="_blank",
// a disclosure, and ?sub=SLUG attribution + click logging.
// ============================================================
import { logClick } from './track.js';

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const REL = 'sponsored nofollow noopener';

const withSubId = (url, slug) => {
  try {
    const u = new URL(url);
    if (!u.searchParams.has('sub')) u.searchParams.set('sub', slug);
    return u.toString();
  } catch { return url; }
};

const disclosure = `
  <details class="lu-disc">
    <summary>Affiliate link</summary>
    <p>We may earn a commission if you sign up through this link — at no extra cost to you. <a href="/about#disclosure">Full disclosure</a>.</p>
  </details>`;

const link = (u, text, cls) => `
  <a class="${cls}" href="${esc(withSubId(u.url, u.slug))}" target="_blank" rel="${REL}"
     data-lu-click="${esc(u.slug)}">${esc(text)}<svg class="arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg></a>`;

const renderers = {
  inline: (u) => `
    <aside class="lu lu--inline" data-unit="${esc(u.slug)}">
      <p class="lu-inline-text">${esc(u.note || '')} <a class="lu-inline-link" href="${esc(withSubId(u.url, u.slug))}" target="_blank" rel="${REL}" data-lu-click="${esc(u.slug)}">${esc(u.label)}</a>${disclosure}</p>
    </aside>`,
  button: (u) => `
    <aside class="lu lu--button" data-unit="${esc(u.slug)}">${link(u, u.label, 'btn btn--primary lu-btn')}${disclosure}</aside>`,
  card: (u) => `
    <aside class="lu lu--card" data-unit="${esc(u.slug)}">
      <h3 class="lu-card-title">${esc(u.label)}</h3>
      <p class="lu-card-note">${esc(u.note || '')}</p>
      ${link(u, 'Check it out', 'btn btn--ghost lu-btn')}${disclosure}
    </aside>`,
  banner: (u) => `
    <aside class="lu lu--banner" data-unit="${esc(u.slug)}">
      <div class="lu-banner-copy"><strong>${esc(u.label)}</strong><span>${esc(u.note || '')}</span></div>
      ${link(u, 'See deals', 'btn btn--primary lu-btn')}${disclosure}
    </aside>`,
  box: (u) => `
    <aside class="lu lu--box" data-unit="${esc(u.slug)}">
      <p class="lu-box-kicker">Recommended</p>
      <h3 class="lu-card-title">${esc(u.label)}</h3>
      <p class="lu-card-note">${esc(u.note || '')}</p>
      ${link(u, u.label, 'btn btn--primary lu-btn')}${disclosure}
    </aside>`,
};

/** Render a unit's HTML (used at build time and client-side). */
export const renderUnit = (u) => (renderers[u.type] || renderers.card)(u);

/** Mount server-rendered or client-rendered units and bind click logging. */
export function bindUnits(root = document) {
  for (const aside of root.querySelectorAll('aside.lu[data-unit]')) {
    if (aside.dataset.bound) continue;
    aside.dataset.bound = '1';
    aside.addEventListener('click', (e) => {
      const a = e.target.closest?.('[data-lu-click]');
      if (a) logClick(a.dataset.luClick);
    });
  }
}
