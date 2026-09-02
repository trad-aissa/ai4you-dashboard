// ============================================================
// ai4you.site — theme switching, one implementation.
// The masthead buttons and the `t` shortcut both go through applyTheme().
// Setting data-theme directly (as the shortcut used to) leaves the
// switcher's aria-pressed and both theme-color metas stale, so the page
// renders dark while assistive tech is told it is on "auto".
// ============================================================
const THEMES = ['light', 'auto', 'dark'];
const LIGHT = '#FBFBFA';
const DARK = '#171614';

/** Apply a theme everywhere it is reflected. Returns the theme actually set. */
export function applyTheme(t) {
  const theme = THEMES.includes(t) ? t : 'auto';
  document.documentElement.dataset.theme = theme;
  try { localStorage.setItem('a4u-theme', theme); } catch { /* private mode */ }
  for (const b of document.querySelectorAll('[data-set-theme]')) {
    b.setAttribute('aria-pressed', String(b.dataset.setTheme === theme));
  }
  const light = document.getElementById('meta-theme-light');
  const dark = document.getElementById('meta-theme-dark');
  if (light) light.content = theme === 'dark' ? DARK : LIGHT;
  if (dark) dark.content = theme === 'light' ? LIGHT : DARK;
  return theme;
}

/** The saved theme, or 'auto'. */
export function savedTheme() {
  try { return localStorage.getItem('a4u-theme') ?? 'auto'; } catch { return 'auto'; }
}
