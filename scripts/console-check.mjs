// Console/pageerror capture on homepage
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--no-sandbox'] });
const p = await b.newPage();
p.on('console', (m) => console.log(m.type() + ': ' + m.text().slice(0, 160)));
p.on('pageerror', (e) => console.log('PAGEERROR: ' + e.message.slice(0, 250)));
await p.goto('https://www.ai4you.site/', { waitUntil: 'networkidle2', timeout: 45000 });
await new Promise((r) => setTimeout(r, 4000));
await b.close();
