// ============================================================
// ai4you.site — runtime UI test suite (puppeteer-core + Edge)
// Tests PRODUCTION: console errors, failed requests, horizontal
// overflow (desktop + 390px), broken images, interactions,
// performance timings. Writes .cluster/ui-test/ui-results.json.
// ============================================================
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const BASE = 'https://www.ai4you.site';
const PAGES = ['/', '/tools', '/article', '/about', '/terms', '/best-writing-tools', '/admin'];
const OUT = '.cluster/ui-test';

const results = { timestamp: new Date().toISOString(), base: BASE, pages: {}, interactions: {}, screenshots: [] };

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
});

async function testPage(path, viewport) {
  const page = await browser.newPage();
  await page.setViewport({ width: viewport.width, height: viewport.height });
  const consoleErrors = [];
  const failedRequests = [];
  page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', (err) => consoleErrors.push('PAGEERROR: ' + err.message));
  page.on('requestfailed', (req) => failedRequests.push({ url: req.url().slice(0, 120), error: req.failure()?.errorText }));
  page.on('response', (res) => { if (res.status() >= 400 && !res.url().includes('hn.algolia')) failedRequests.push({ url: res.url().slice(0, 120), status: res.status() }); });

  const t0 = Date.now();
  const resp = await page.goto(BASE + path, { waitUntil: 'networkidle2', timeout: 45000 });
  const loadMs = Date.now() - t0;

  // horizontal overflow check
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    offenders: [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > document.documentElement.clientWidth + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`),
  }));

  // broken images
  const brokenImages = await page.evaluate(() =>
    [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).map((img) => img.src.slice(0, 100))
  );

  // h1 + title
  const meta = await page.evaluate(() => ({
    title: document.title.slice(0, 80),
    h1: document.querySelector('h1')?.textContent.trim().slice(0, 60) ?? null,
    h1Count: document.querySelectorAll('h1').length,
    hasSkipLink: !!document.querySelector('.skip-link'),
    lang: document.documentElement.lang,
  }));

  const shotName = `${path.replace(/\//g, '_') || '_home'}-${viewport.name}.png`;
  mkdirSync(OUT, { recursive: true });
  await page.screenshot({ path: `${OUT}/${shotName}`, fullPage: viewport.name === 'mobile' });
  results.screenshots.push(shotName);

  await page.close();
  return {
    status: resp?.status(),
    loadMs,
    consoleErrors,
    failedRequests,
    horizontalOverflow: overflow.scrollWidth > overflow.clientWidth ? { ...overflow } : false,
    brokenImages,
    meta,
  };
}

// --- desktop pass ---
for (const path of PAGES) {
  console.log(`testing ${path} (desktop)…`);
  results.pages[`${path}|desktop`] = await testPage(path, { name: 'desktop', width: 1440, height: 900 });
}

// --- mobile pass (390px iPhone 12-ish) ---
for (const path of PAGES) {
  console.log(`testing ${path} (mobile)…`);
  results.pages[`${path}|mobile`] = await testPage(path, { name: 'mobile', width: 390, height: 844 });
}

// --- interactions on homepage (desktop) ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(BASE + '/', { waitUntil: 'networkidle2', timeout: 45000 });

  // 1) category filter
  const before = await page.$$eval('#feed-grid .feed-card', (els) => els.filter((e) => e.style.display !== 'none').length);
  await page.click('.filter-btn[data-filter="pricing"]');
  await new Promise((r) => setTimeout(r, 300));
  const after = await page.$$eval('#feed-grid .feed-card', (els) => els.filter((e) => e.style.display !== 'none').length);
  await page.click('.filter-btn[data-filter="all"]');
  const restored = await page.$$eval('#feed-grid .feed-card', (els) => els.filter((e) => e.style.display !== 'none').length);
  results.interactions.newsFilter = { before, pricingFiltered: after, restored, pass: after > 0 && after < before && restored === before };

  // 2) newsletter validation: bad email -> error, good email -> success
  await page.type('#nl-email', 'not-an-email');
  await page.click('.newsletter form button[type="submit"]');
  await new Promise((r) => setTimeout(r, 200));
  const errMsg = await page.$eval('#nl-msg', (el) => el.textContent);
  await page.click('#nl-email', { clickCount: 3 });
  await page.type('#nl-email', 'test@example.com');
  await page.click('.newsletter form button[type="submit"]');
  await new Promise((r) => setTimeout(r, 200));
  const okMsg = await page.$eval('#nl-msg', (el) => ({ text: el.textContent, cls: el.className }));
  results.interactions.newsletter = {
    invalidShowsError: /valid email/i.test(errMsg),
    validShowsSuccess: /list/i.test(okMsg.text),
    pass: /valid email/i.test(errMsg) && /list/i.test(okMsg.text),
  };

  // 3) live wire section populated?
  await new Promise((r) => setTimeout(r, 2500));
  const wireItems = await page.$$eval('#wire-list li', (els) => els.length).catch(() => -1);
  const wireStatus = await page.$eval('#wire-status', (el) => ({ text: el.textContent.slice(0, 60), hidden: el.style.display === 'none' })).catch(() => null);
  results.interactions.liveWire = { items: wireItems, status: wireStatus, pass: wireItems > 0 || (wireStatus && wireStatus.hidden) };

  // 4) nav links navigate correctly
  await page.click('.masthead nav a[href="/tools"]');
  await new Promise((r) => setTimeout(r, 1200));
  const toolsUrl = page.url();
  results.interactions.navToTools = { url: toolsUrl, pass: toolsUrl.includes('/tools') };

  results.interactions.pageErrors = errs;
  await page.close();
}

// --- mobile interaction: hamburger-less nav visibility + tool filter ---
{
  const page = await browser.newPage();
  await page.setViewport({ width: 390, height: 844 });
  await page.goto(BASE + '/tools', { waitUntil: 'networkidle2', timeout: 45000 });
  const cards = await page.$$eval('#dir-grid .dir-card', (els) => els.length);
  await page.click('.filter-btn[data-filter="video"]');
  await new Promise((r) => setTimeout(r, 300));
  const videoCards = await page.$$eval('#dir-grid .dir-card', (els) => els.filter((e) => e.style.display !== 'none').length);
  results.interactions.toolsFilterMobile = { cards, videoCards, pass: cards > 0 && videoCards > 0 && videoCards < cards };
  await page.close();
}

await browser.close();
writeFileSync(`${OUT}/ui-results.json`, JSON.stringify(results, null, 2));

// console summary
let issues = 0;
for (const [key, r] of Object.entries(results.pages)) {
  const flags = [];
  if (r.consoleErrors.length) flags.push(`${r.consoleErrors.length} consoleErr`);
  if (r.failedRequests.length) flags.push(`${r.failedRequests.length} failedReq`);
  if (r.horizontalOverflow) flags.push('H-OVERFLOW');
  if (r.brokenImages.length) flags.push(`${r.brokenImages.length} brokenImg`);
  if (flags.length) { issues++; console.log(`✗ ${key}: ${flags.join(', ')}`); }
  else console.log(`✓ ${key}`);
}
for (const [k, v] of Object.entries(results.interactions)) {
  if (typeof v === 'object' && v !== null && 'pass' in v) { console.log(`${v.pass ? '✓' : '✗'} interaction:${k}`); if (!v.pass) issues++; }
}
console.log(`\n${issues} issue group(s). Full results: ${OUT}/ui-results.json`);
