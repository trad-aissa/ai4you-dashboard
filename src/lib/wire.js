// ============================================================
// ai4you.site — Live Wire (Hacker News via Algolia)
// Called from pages that have #wire-list.
// ============================================================
const WIRE_TTL = 15 * 60_000;
const CACHE_KEY = 'a4u-wire-cache';

const esc = (s = '') =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Only allow http(s) links from the third-party feed; anything else
// (javascript:, data:, …) falls back to the HN discussion thread.
const safeUrl = (url, objectId) => {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) ? u.toString() : `https://news.ycombinator.com/item?id=${encodeURIComponent(objectId)}`;
  } catch {
    return `https://news.ycombinator.com/item?id=${encodeURIComponent(objectId)}`;
  }
};

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ } },
};

function renderWire(posts) {
  const list = document.getElementById('wire-list');
  const status = document.getElementById('wire-status');
  if (!list) return;
  list.innerHTML = posts
    .map((p) => {
      let href = String(p.url ?? '');
      try { if (!/^https?:$/.test(new URL(href).protocol)) href = 'https://news.ycombinator.com'; }
      catch { href = 'https://news.ycombinator.com'; }
      return `
      <li><div class="wire-item">
        <span class="pts">${esc(p.points)} pts</span>
        <div class="w"><a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(p.title)}</a></div>
        <span class="by">${esc(p.comments)} comments</span>
      </div></li>`;
    })
    .join('');
  if (status) status.style.display = 'none';
}

async function loadWire(force = false) {
  const list = document.getElementById('wire-list');
  const status = document.getElementById('wire-status');
  if (!list) return;
  const cached = store.get(CACHE_KEY);
  if (!force && cached && Date.now() - cached.t < WIRE_TTL) {
    renderWire(cached.posts);
    return;
  }
  if (status) {
    status.textContent = 'Loading live headlines…';
    status.style.display = '';
  }
  try {
    const res = await fetch('https://hn.algolia.com/api/v1/search?query=AI&tags=story&hitsPerPage=12');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const posts = (data.hits ?? []).map((h) => ({
      title: h.title ?? '(untitled)',
      url: safeUrl(h.url, h.objectID),
      points: h.points ?? 0,
      comments: h.num_comments ?? 0,
    }));
    store.set(CACHE_KEY, { t: Date.now(), posts });
    renderWire(posts);
  } catch {
    if (cached) renderWire(cached.posts);
    else if (status) {
      status.textContent = 'Live feed unavailable right now (offline or blocked).';
      status.classList.add('error');
    }
  }
}

export function initWire() {
  if (!document.getElementById('wire-list')) return;
  document.getElementById('wire-refresh')?.addEventListener('click', () => loadWire(true));
  loadWire();
}