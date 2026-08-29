// One-off check: does the Live Wire populate with a longer wait?
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
await p.setViewport({ width: 1440, height: 900 });
p.on('requestfailed', (r) => console.log('REQFAIL:', r.url().slice(0, 100), r.failure()?.errorText));
p.on('response', (r) => { if (r.url().includes('hn.algolia')) console.log('HN response:', r.status()); });
await p.goto('https://www.ai4you.site/', { waitUntil: 'networkidle2', timeout: 45000 });
for (const wait of [3000, 5000, 6000]) {
  await new Promise((r) => setTimeout(r, wait));
  const n = await p.$$eval('#wire-list li', (els) => els.length);
  const s = await p.$eval('#wire-status', (el) => ({ t: el.textContent.slice(0, 50), hidden: el.style.display === 'none' }));
  console.log(`after +${wait}ms: ${n} items | status: ${JSON.stringify(s)}`);
  if (n > 0) { console.log('WIRE OK'); break; }
}
await b.close();
