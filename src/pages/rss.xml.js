import rss from '@astrojs/rss';
import news from '../data/news.js';
import { articles } from '../data/articles.js';
import { SITE } from '../config.js';

export function GET(context) {
  const items = (news.items ?? []).map((n) => {
    const parsed = new Date(`${n.date}T12:00:00Z`);
    return {
      title: n.headline,
      description: n.summary,
      link: n.url,
      pubDate: Number.isNaN(parsed.getTime()) ? new Date() : parsed,
      categories: [n.category],
    };
  });
  const own = articles.map((a) => ({
    title: a.seoTitle ?? a.title,
    description: a.description,
    link: a.path,
    pubDate: new Date(`${a.date}T12:00:00Z`),
    categories: ['deep-dive'],
  }));
  return rss({
    title: 'ai4you.site — AI news, model releases & tools, minus the hype',
    description:
      'A calm, sourced briefing on AI: every frontier-model release, price change and industry move — plus the AI tools actually worth your money.',
    site: context.site ?? SITE.url,
    items: [...own, ...items].sort((x, y) => y.pubDate - x.pubDate),
    customData: '<language>en-us</language>',
  });
}
