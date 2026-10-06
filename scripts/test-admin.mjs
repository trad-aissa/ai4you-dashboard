import { createClient } from '@supabase/supabase-js';
import { chromium } from 'playwright';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from '../src/config.js';

const { ADMIN_TEST_EMAIL, ADMIN_TEST_PASSWORD, BASE } = process.env;
if (!ADMIN_TEST_EMAIL || !ADMIN_TEST_PASSWORD || !BASE) {
  console.log('SKIP admin E2E: set BASE, ADMIN_TEST_EMAIL, and ADMIN_TEST_PASSWORD to run the live CRUD journey.');
  process.exit(0);
}

const base = BASE.replace(/\/$/, '');
const slug = `e2e-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
const updatedLabel = `Updated ${slug}`;
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
});
let browser;
let needsCleanup = false;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForStatus(page, text) {
  await page.locator('#f-status').filter({ hasText: text }).waitFor({ state: 'visible' });
}

async function rowFor(page) {
  return page.locator('.pcard', { has: page.locator('.u-id', { hasText: slug }) });
}

try {
  browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  page.on('dialog', (dialog) => dialog.accept());

  await page.goto(`${base}/admin`, { waitUntil: 'networkidle' });
  await page.locator('#a-email').fill(ADMIN_TEST_EMAIL);
  await page.locator('#a-pass').fill(ADMIN_TEST_PASSWORD);
  await page.locator('#a-login').click();
  await Promise.race([
    page.locator('#dash').waitFor({ state: 'visible' }),
    page.locator('#a-msg.err').waitFor({ state: 'visible' }).then(async () => {
      throw new Error(`Admin sign-in failed: ${await page.locator('#a-msg').textContent()}`);
    }),
  ]);
  await page.locator('#rows').waitFor({ state: 'visible' });

  await page.locator('#f-slug').fill(slug);
  await page.locator('#f-type').selectOption('card');
  await page.locator('#f-url').fill(`https://example.com/quality-test?sub=${slug}`);
  await page.locator('#f-label').fill(`Quality ${slug}`);
  await page.locator('#f-note').fill('Temporary automated quality audit placement');
  needsCleanup = true;
  await page.locator('#f-save').click();
  await waitForStatus(page, 'Created.');

  let row = await rowFor(page);
  await row.waitFor({ state: 'visible' });
  await row.locator('[data-edit]').click();
  await page.locator('#f-label').fill(updatedLabel);
  await page.locator('#f-save').click();
  await waitForStatus(page, 'Updated.');
  row = await rowFor(page);
  await row.getByText(updatedLabel).waitFor({ state: 'visible' });

  await row.locator('[data-toggle]').click();
  await waitForStatus(page, 'Paused');
  row = await rowFor(page);
  assert(await row.locator('.chip--red').textContent() === 'paused', 'Placement did not become paused');

  await row.locator('[data-toggle]').click();
  await waitForStatus(page, 'Resumed.');
  row = await rowFor(page);
  await row.waitFor({ state: 'visible' });
  await row.locator('.chip--red').waitFor({ state: 'detached' });

  await row.locator('[data-del]').click();
  await waitForStatus(page, 'Deleted.');
  await row.waitFor({ state: 'detached' });
  needsCleanup = false;

  await page.locator('#signout').click();
  await page.locator('#auth').waitFor({ state: 'visible' });
  console.log(`PASS admin CRUD journey (${slug})`);
} finally {
  if (needsCleanup) {
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: ADMIN_TEST_EMAIL, password: ADMIN_TEST_PASSWORD });
      if (signInError) throw signInError;
      const { error: deleteError } = await supabase.from('link_units').delete().eq('slug', slug);
      if (deleteError) throw deleteError;
      console.log(`Cleaned temporary placement ${slug}`);
    } catch (error) {
      console.error(`CLEANUP FAILED for ${slug}: ${error instanceof Error ? error.message : String(error)}`);
      process.exitCode = 1;
    } finally {
      await supabase.auth.signOut().catch(() => {});
    }
  }
  if (browser) await browser.close();
}
