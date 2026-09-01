// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.ai4you.site',
  trailingSlash: 'never',
  // /admin is noindex and robots-disallowed; submitting it too is a Search Console error.
  integrations: [sitemap({ filter: (page) => !page.includes('/admin') })],
});