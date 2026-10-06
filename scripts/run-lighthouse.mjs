import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const ROUTES = ['/', '/news', '/tools', '/learn', '/article'];
const THRESHOLDS = { performance: 0.75, accessibility: 0.9, 'best-practices': 0.9, seo: 0.9 };
const ARTIFACT_DIR = '.cluster/quality/lighthouse';
const MIME = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };

async function resolveFile(root, pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|\\|$))+/, '');
  const relative = safe === '/' ? 'index.html' : safe.replace(/^[/\\]/, '');
  const candidates = [join(root, relative)];
  if (!extname(relative)) candidates.push(join(root, `${relative}.html`), join(root, relative, 'index.html'));
  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return candidate;
    } catch {}
  }
  return null;
}

async function serveDist(root = 'dist') {
  const server = createServer(async (req, res) => {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    const file = await resolveFile(root, pathname);
    if (!file) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}

const local = process.env.BASE ? null : await serveDist();
const base = (process.env.BASE ?? local.url).replace(/\/$/, '');
const executablePath = chromium.executablePath();
let chrome;
const failures = [];
const summaries = [];

try {
  await mkdir(ARTIFACT_DIR, { recursive: true });
  chrome = await chromeLauncher.launch({
    chromePath: executablePath,
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu'],
  });

  for (const route of ROUTES) {
    const result = await lighthouse(`${base}${route}`, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: Object.keys(THRESHOLDS),
    });
    if (!result) throw new Error(`Lighthouse returned no result for ${route}`);

    const scores = Object.fromEntries(Object.keys(THRESHOLDS).map((category) => [category, result.lhr.categories[category].score ?? 0]));
    const routeFailures = Object.entries(THRESHOLDS)
      .filter(([category, minimum]) => scores[category] < minimum)
      .map(([category, minimum]) => `${category} ${(scores[category] * 100).toFixed(0)} < ${minimum * 100}`);
    const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
    await writeFile(join(ARTIFACT_DIR, `${slug}.json`), result.report);
    summaries.push({ route, scores, failures: routeFailures });

    const scoreText = Object.entries(scores).map(([category, score]) => `${category}=${Math.round(score * 100)}`).join(' ');
    console.log(`${routeFailures.length ? 'FAIL' : 'ok  '} ${route} ${scoreText}`);
    failures.push(...routeFailures.map((failure) => `${route}: ${failure}`));
  }

  await writeFile(join(ARTIFACT_DIR, 'summary.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), base, thresholds: THRESHOLDS, routes: summaries }, null, 2)}\n`);
} finally {
  if (chrome) chrome.kill();
  if (local) await local.close();
}

if (failures.length) {
  console.error(`\nLighthouse failed ${failures.length} threshold check(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log('\nAll Lighthouse thresholds passed');
}
