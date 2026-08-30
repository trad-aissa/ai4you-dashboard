import rss from '@astrojs/rss';
import news from '../data/news.js';
import { SITE } from '../config.js';

export function GET(context) {
  const items = (news.items ?? []).map((n) => ({
    title: n.headline,
    description: n.summary,
    link: n.url,
    pubDate: new Date(`${n.date}T12:00:00Z`),
    categories: [n.category],
  }));
  return rss({
    title: 'ai4you.site — AI news, model releases & tools, minus the hype',
    description:
      'A calm, sourced briefing on AI: every frontier-model release, price change and industry move — plus the AI tools actually worth your money.',
    site: context.site ?? SITE.url,
    items,
    customData: '<language>en-us</language>',
  });
}
