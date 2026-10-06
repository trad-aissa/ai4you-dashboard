import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PAGES = ['/', '/news', '/tools', '/learn', '/changelog', '/article', '/about', '/terms', '/best-writing-tools', '/admin'];
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};
const ARTIFACT_DIR = '.cluster/quality';
const LINK_TIMEOUT_MS = 15_000;
const BLOCKED_STATUSES = new Set([401, 403, 405, 429]);

async function resolveDistFile(root, pathname) {
  const safePath = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, '');
  const relative = safePath === '/' ? 'index.html' : safePath.replace(/^[/\\]/, '');
  const candidates = [join(root, relative)];
  if (!extname(relative)) candidates.push(join(root, `${relative}.html`), join(root, relative, 'index.html'));

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
      if (info.isDirectory()) return join(candidate, 'index.html');
    } catch {}
  }
  return null;
}

async function serveDist(root = 'dist') {
  const server = createServer(async (req, res) => {
    const requestUrl = new URL(req.url ?? '/', 'http://localhost');
    const file = await resolveDistFile(root, requestUrl.pathname);
    if (!file) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(await readFile(join(root, '404.html')).catch(() => 'not found'));
      return;
    }
    try {
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('not found');
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

function normalizeLink(raw, pageUrl) {
  if (!raw || raw.startsWith('#')) return null;
  try {
    const url = new URL(raw, pageUrl);
    if (!['http:', 'https:'].includes(url.protocol)) return null;
    url.hash = '';
    return url.href;
  } catch {
    return null;
  }
}

async function mapConcurrent(items, limit, worker) {
  const results = new Array(items.length);
  let index = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current]);
    }
  }));
  return results;
}

async function requestLink(url, method) {
  const response = await fetch(url, {
    method,
    redirect: 'follow',
    signal: AbortSignal.timeout(LINK_TIMEOUT_MS),
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ai4you-quality-audit/1.0; +https://www.ai4you.site)',
      Accept: 'text/html,application/xhtml+xml,application/json;q=0.9,*/*;q=0.8',
    },
  });
  if (response.body) await response.body.cancel().catch(() => {});
  return { status: response.status, finalUrl: response.url };
}

async function checkLink(url, internal) {
  const methods = internal ? ['GET'] : ['HEAD', 'GET'];
  let lastError = '';
  let lastResult = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    for (const method of methods) {
      try {
        const result = await requestLink(url, method);
        lastResult = result;
        if (result.status < 400 || (!internal && BLOCKED_STATUSES.has(result.status))) {
          return { url, ok: true, status: result.status, finalUrl: result.finalUrl, blocked: BLOCKED_STATUSES.has(result.status) };
        }
        if (method === 'HEAD' && [400, 404, 405, 500, 501].includes(result.status)) continue;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
      }
    }
  }

  return {
    url,
    ok: false,
    status: lastResult?.status ?? null,
    finalUrl: lastResult?.finalUrl ?? null,
    error: lastError || `HTTP ${lastResult?.status ?? 'no response'}`,
  };
}

const local = process.env.BASE ? null : await serveDist();
const BASE = (process.env.BASE ?? local.url).replace(/\/$/, '');
const baseOrigin = new URL(BASE).origin;
let browser;
const failures = [];
const pageResults = [];
const discoveredLinks = new Set();

try {
  browser = await chromium.launch();

  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
    try {
      for (const path of PAGES) {
        const page = await context.newPage();
        const errors = [];
        try {
          page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
          page.on('console', (message) => {
            if (message.type() === 'error') errors.push(`console: ${message.text().slice(0, 200)}`);
          });
          page.on('requestfailed', (request) => {
            errors.push(`request failed: ${request.url().slice(0, 140)} (${request.failure()?.errorText ?? 'unknown'})`);
          });

          const response = await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' }).catch(() => null);
          if (!response || response.status() >= 400) errors.push(`HTTP ${response?.status() ?? 'no response'}`);

          const layout = await page.evaluate(() => ({
            overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            brokenImages: [...document.images]
              .filter((image) => image.complete && image.naturalWidth === 0)
              .map((image) => image.currentSrc || image.src),
            links: [...document.querySelectorAll('a[href]')].map((anchor) => anchor.getAttribute('href')),
          }));
          if (layout.overflow > 1) errors.push(`horizontal overflow: ${layout.overflow}px`);
          for (const src of layout.brokenImages) errors.push(`broken image: ${src}`);

          const axe = await new AxeBuilder({ page }).analyze();
          const severeViolations = axe.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact ?? ''));
          for (const violation of severeViolations) {
            const targets = violation.nodes.flatMap((node) => node.target).slice(0, 3).join(', ');
            errors.push(`axe ${violation.impact}: ${violation.id} (${targets}) ${violation.helpUrl}`);
          }

          if (viewport.name === 'desktop') {
            for (const raw of layout.links) {
              const link = normalizeLink(raw, page.url());
              if (link) discoveredLinks.add(link);
            }
          }

          const label = `${path} @ ${viewport.name}`;
          pageResults.push({ label, path, viewport: viewport.name, errors, axeViolations: axe.violations.length });
          if (errors.length) {
            failures.push({ label, errors });
            console.log(`FAIL ${label}`);
            for (const error of errors) console.log(`     ${error}`);
          } else {
            console.log(`ok   ${label}`);
          }
        } finally {
          await page.close();
        }
      }
    } finally {
      await context.close();
    }
  }

  const internalLinks = [...discoveredLinks].filter((url) => new URL(url).origin === baseOrigin).sort();
  const externalLinks = [...discoveredLinks].filter((url) => new URL(url).origin !== baseOrigin).sort();
  console.log(`\nChecking ${internalLinks.length} internal and ${externalLinks.length} external links...`);

  const internalResults = await mapConcurrent(internalLinks, 8, (url) => checkLink(url, true));
  const externalResults = await mapConcurrent(externalLinks, 6, (url) => checkLink(url, false));
  const brokenLinks = [...internalResults, ...externalResults].filter((result) => !result.ok);
  for (const result of brokenLinks) {
    failures.push({ label: `link ${result.url}`, errors: [result.error] });
    console.log(`FAIL link ${result.url} (${result.error})`);
  }

  const blocked = externalResults.filter((result) => result.blocked).length;
  console.log(`Links: ${internalResults.filter((result) => result.ok).length}/${internalResults.length} internal, ${externalResults.filter((result) => result.ok).length}/${externalResults.length} external reachable${blocked ? ` (${blocked} anti-bot responses accepted)` : ''}`);

  await mkdir(ARTIFACT_DIR, { recursive: true });
  await writeFile(join(ARTIFACT_DIR, 'ui-audit.json'), `${JSON.stringify({
    generatedAt: new Date().toISOString(),
    base: BASE,
    pages: pageResults,
    links: { internal: internalResults, external: externalResults },
    failures,
  }, null, 2)}\n`);
} finally {
  if (browser) await browser.close();
  if (local) await local.close();
}

const totalPageChecks = PAGES.length * VIEWPORTS.length;
console.log(`\n${totalPageChecks - pageResults.filter((result) => result.errors.length).length}/${totalPageChecks} page/viewport checks passed`);
console.log(failures.length ? `${failures.length} total failure(s)` : 'All UI, accessibility, and link audits passed');
process.exitCode = failures.length ? 1 : 0;
