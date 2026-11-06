// ============================================================
// ai4you.site — original articles.
//
// TO PUBLISH: drop a Markdown file in src/content/articles/<slug>.md.
// It becomes /news/<slug> and is picked up by the nav ("Deep dive" = newest),
// /stories, /rss.xml, the sitemap and its own social card. Copy an existing
// file for the frontmatter fields; title, description and date are required.
// ============================================================
const files = import.meta.glob('../content/articles/*.md', { eager: true });

const REQUIRED = ['title', 'description', 'date'];

export const articles = Object.entries(files)
  // `draft: true` in frontmatter keeps a file out of every page, feed and sitemap.
  .filter(([, mod]) => !mod.frontmatter.draft)
  .map(([file, mod]) => {
    const fm = mod.frontmatter;
    const slug = file.split('/').pop().replace(/\.md$/, '');
    // Fail the build, not the page: a missing field would ship a broken article.
    for (const k of REQUIRED) if (!fm[k]) throw new Error(`${file}: frontmatter "${k}" is required`);
    const date = new Date(fm.date).toISOString().slice(0, 10);
    const words = mod.rawContent().replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length ?? 0;
    return { ...fm, slug, date, path: `/news/${slug}`, minutes: Math.max(1, Math.round(words / 230)), Content: mod.Content };
  })
  .sort((a, b) => b.date.localeCompare(a.date));
