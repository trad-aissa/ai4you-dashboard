// src/pages/news.json.js — developer JSON feed for automated tooling, Slack bots & CLI scripts
import news from '../data/news.js';
import headlines from '../data/auto/headlines.json';
import { MODELS } from '../data/models.js';
import { SITE } from '../config.js';

export function GET() {
  const payload = {
    title: 'ai4you.site — Developer AI Feed',
    description: 'Clean, sourced briefing on artificial intelligence: models, benchmarks, pricing, and live wire.',
    home_page_url: SITE.url,
    feed_url: `${SITE.url}/news.json`,
    version: 'https://jsonfeed.org/version/1.1',
    updated_at: new Date().toISOString(),
    frontier_models: MODELS,
    editorial_stories: (news.items ?? []).map((item) => ({
      id: item.id,
      title: item.headline,
      url: item.url,
      summary: item.summary,
      why_it_matters: item.why,
      category: item.category,
      date_published: `${item.date}T12:00:00Z`,
      source: item.source_name,
    })),
    live_headlines: (headlines.items ?? []).slice(0, 40).map((h) => ({
      id: h.id,
      title: h.title,
      url: h.url,
      source: h.source,
      date_published: h.date,
      snippet: h.snippet,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=1800, s-maxage=3600',
    },
  });
}
