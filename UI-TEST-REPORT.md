# UI Test Report — ai4you.site
**Date:** 2026-08-29 · **Target:** https://www.ai4you.site (production) · **Suite:** headless Edge (puppeteer-core) + code-level audits

## Scope
7 pages (/, /tools, /article, /about, /terms, /best-writing-tools, /admin) × 2 viewports (1440×900 desktop, 390×844 mobile) + 5 interaction flows.

## Runtime results (final run): 19/19 PASS

### Per-page checks (desktop + mobile each)
| Page | Status | Console errors | Failed requests | H-overflow | Broken images |
|---|---|---|---|---|---|
| / | 200 | 0 | 0 | none | 0 |
| /tools | 200 | 0 | 0 | none | 0 |
| /article | 200 | 0 | 0 | none | 0 |
| /about | 200 | 0 | 0 | none | 0 |
| /terms | 200 | 0 | 0 | none | 0 |
| /best-writing-tools | 200 | 0 | 0 | none | 0 |
| /admin | 200 | 0 | 0 | none | 0 |

### Interaction checks
| Flow | Result |
|---|---|
| News category filter (filter → filtered → restore) | PASS |
| Newsletter validation (bad email → error; good → success) | PASS |
| Live Wire HN feed (fetch + render + cache) | PASS |
| Nav to /tools | PASS |
| Tools category filter (mobile) | PASS |

## Bugs found during testing (all fixed + deployed)
1. **Preferred Sources script 404** (all pages with the badge): the script URL I used (`www.gstatic.com/pg/ssogp.min.js`) did not exist — I had written it from memory. **Fix:** replaced with Google's official embed (`news.google.com/swg/js/v1/publisher.js` + `<div google-add-preferred-source-btn>`, per developers.google.com/search/docs/appearance/preferred-sources). Verified live: button iframe loads.
2. **Live Wire missing on homepage**: the v2 Astro rebuild never included the HN wire section/script (v1 had it). **Fix:** restored section + extracted `src/lib/wire.js` module (cache TTL 15 min, error fallback, refresh button). Verified live: 12 items render.
3. **(Earlier same-day)** hero invisible without JS — CSS entrance animation made JS-independent (see 2026-08-27 fix).

## Code-level audit coverage (mainline, no subagent — see note)
- **Contrast:** design tokens verified at design time (ink #1A1A19 on #FBFBFA ≈ 16.4:1; muted #6E6D6A on canvas ≈ 5.5:1; link #1F6C9F ≈ 5.6:1; pale chip pairs ≥ 4.6:1). `--faint` (#9B9A96, ≈2.8:1) used only for mono meta ≥11px — a MODERATE flag; acceptable as decorative metadata but upgradeable.
- **Links:** all 8 internal/canonical URLs 200 (re-verified post-deploy); external publisher links were verified at research time; gstatic 404 found & fixed.
- **A11y structure:** skip-link, single h1/page, aria-pressed filters, aria-live status regions, labeled newsletter input, alt/aria-hidden on SVGs — implemented in v1/v2 builds (spot-verified during fixes).

## Test limitations / not covered
- Three parallel audit subagents (a11y deep-dive, responsive deep-dive, full external-link crawl) failed with LLM provider errors and produced no reports; their coverage was partially replaced by mainline checks above. A dedicated axe-core + full external-link crawl run is recommended later.
- No Lighthouse run in this pass (recommend running once domain DNS is fully settled).
- Admin dashboard tested read-only (no credential attempts by design).

## Artifacts
- Raw results: `ai4you-dashboard/.cluster/ui-test/ui-results.json`
- 14 screenshots (7 pages × 2 viewports): `ai4you-dashboard/.cluster/ui-test/*.png`
- Test suite (rerunnable): `ai4you-dashboard/scripts/run-ui-tests.mjs` → `node scripts/run-ui-tests.mjs`
