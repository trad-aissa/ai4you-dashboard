// ============================================================
// ai4you.site — runtime UI test suite (playwright, any platform)
//
//   npm run test:ui                       # tests the built dist/
//   BASE=https://www.ai4you.site npm run test:ui   # tests production
//
// Checks per page x viewport: console errors, failed requests, horizontal
// overflow, broken images. Exits non-zero on any failure.
// ============================================================
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const PAGES = ['/', '/news', '/tools', '/learn', '/changelog', '/article', '/about', '/terms', '/best-writing-tools', '/admin'];
const VIEWPORTS = [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }];
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain' };

/** Serve dist/ so the suite works with no BASE and no dev server. */
async function serveDist(root = 'dist') {
  const srv = createServer(async (req, res) => {
    const url = decodeURIComponent(req.url.split('?')[0]);
    let file = join(root, url);
    try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); }
    catch { file = join(root, url + '/index.html'); }
    try {
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(await readFile(file));
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(await readFile(join(root, '404.html')).catch(() => 'not found'));
    }
  });
  await new Promise((r) => srv.listen(0, r));
  return { url: `http://localhost:${srv.address().port}`, close: () => srv.close() };
}

const local = process.env.BASE ? null : await serveDist();
const BASE = process.env.BASE ?? local.url;
const browser = await chromium.launch();
const failures = [];

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  for (const path of PAGES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text().slice(0, 160)}`); });
    page.on('requestfailed', (r) => errors.push(`request failed: ${r.url().slice(0, 100)} (${r.failure()?.errorText})`));

    const res = await page.goto(BASE + path, { waitUntil: 'networkidle' }).catch(() => null);
    if (!res || res.status() >= 400) errors.push(`HTTP ${res?.status() ?? 'no response'}`);

    const { overflow, brokenImages } = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      brokenImages: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src),
    }));
    if (overflow > 1) errors.push(`horizontal overflow: ${overflow}px`);
    for (const src of brokenImages) errors.push(`broken image: ${src}`);

    const label = `${path} @ ${vp.name}`;
    if (errors.length) { failures.push({ label, errors }); console.log(`FAIL ${label}`); for (const e of errors) console.log(`       ${e}`); }
    else console.log(`ok   ${label}`);
    await page.close();
  }
  await ctx.close();
}

await browser.close();
local?.close();
console.log(`\n${PAGES.length * VIEWPORTS.length - failures.length}/${PAGES.length * VIEWPORTS.length} passed`);
process.exit(failures.length ? 1 : 0);
