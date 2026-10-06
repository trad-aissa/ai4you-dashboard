# UI Test Report — ai4you.site

**Date:** 2026-10-06

**Public target:** fresh local production build (`dist/`)

**Admin target:** `https://www.ai4you.site`

## Public quality result: PASS

Run with:

```bash
npm run test:quality
```

This command completed successfully and covered Astro diagnostics, a production build, Playwright UI/accessibility/link audits, and Lighthouse.

### Astro diagnostics and build

- Scoped typed-source diagnostics: **0 errors, 0 warnings, 0 hints** across 24 files.
- Static production build: **30 pages built successfully**.
- The diagnostics baseline is `tsconfig.quality.json`; legacy untyped inline scripts inside `.astro` files remain behavior-tested by Playwright instead of being treated as strict TypeScript.

### Playwright route matrix

Ten routes were tested at 1440×900 desktop and 390×844 mobile:

- `/`
- `/news`
- `/tools`
- `/learn`
- `/changelog`
- `/article`
- `/about`
- `/terms`
- `/best-writing-tools`
- `/admin`

Result: **20/20 page/viewport checks passed**.

Every check covers:

- HTTP navigation failures
- browser exceptions and console errors
- failed network requests
- horizontal overflow
- broken images
- axe serious/critical accessibility violations

No serious or critical axe violations were found.

### Link audit

- Internal links: **30/30 reachable**
- External links: **134/134 reachable**
- 27 external responses returned expected anti-bot/auth/rate-limit statuses and were classified as reachable rather than broken.

The first crawl found an active seeded placement pointing to `example.com/REPLACE_ME`. Public link-unit rendering now rejects placeholder/non-publishable URLs, and the fresh build passes the full crawl.

### Contrast verification

The current `--faint` token meets WCAG AA for normal text in both themes:

- Light `#75746E` on `#FBFBFA`: **4.53:1**
- Dark `#8B897F` on `#171614`: **5.15:1**
- Dark `#8B897F` on `#201F1C`: **4.70:1**

### Lighthouse

Thresholds are performance ≥75, accessibility ≥90, best practices ≥90, and SEO ≥90.

| Route | Performance | Accessibility | Best practices | SEO |
|---|---:|---:|---:|---:|
| `/` | 97 | 100 | 100 | 100 |
| `/news` | 97 | 100 | 100 | 100 |
| `/tools` | 96 | 100 | 100 | 100 |
| `/learn` | 98 | 100 | 100 | 100 |
| `/article` | 96 | 100 | 100 | 100 |

All Lighthouse thresholds passed.

### Dependency audit

`npm audit --omit=dev` reports **0 production vulnerabilities** after applying non-breaking dependency updates. Two moderate dev-only advisories remain in `satori`'s `fflate` dependency; npm only offers a forced breaking downgrade, so it was not applied.

## Admin CRUD journey: PASS

`scripts/test-admin.mjs` completed the real production workflow through `/admin`:

1. Signed in with the configured owner test credentials.
2. Created a uniquely named `e2e-*` placement.
3. Edited it.
4. Paused and resumed it.
5. Deleted it.
6. Signed out.

The successful run left no temporary placement behind. A preceding failed assertion also verified the authenticated `finally` cleanup path by removing its temporary row before exiting.

## CI coverage

`.github/workflows/quality.yml` runs public quality checks for pull requests, `master` pushes, and manual dispatches. The live admin job runs only for trusted `master` pushes/manual dispatches and receives credentials from repository secrets; forked pull requests never receive them.

## Artifacts

Generated files are gitignored under `.cluster/quality/`:

- `.cluster/quality/ui-audit.json`
- `.cluster/quality/lighthouse/*.json`
