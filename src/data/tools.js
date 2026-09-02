// src/data/tools.js — curated tool shelf.
//
// Everything here is a PLAIN RECOMMENDATION: `affiliate: false` means the card
// renders with no sponsored rel, no disclosure and no commission figures, and
// we earn nothing if a reader signs up. `terms` records what each vendor's
// programme pays IF we join it — research notes, never rendered while
// affiliate is false. Note `cookie: 'unverified'`: none of it is confirmed.
//
// TO TURN ONE ON, in this order:
//   1. get accepted into the programme and confirm the real rate
//   2. paste the tracking URL into `url` (not the bare homepage)
//   3. set affiliate: true
// Live affiliate placements normally live in Supabase link_units instead
// (dashboard -> "Show on the tool shelf"); those always render as affiliate.
export default [
  {
    id: 'jasper', name: 'Jasper', category: 'writing',
    blurb: 'Long-form AI writing assistant built for marketing teams, with brand voice controls and campaign workflows.',
    terms: { commission: '~30% recurring', cookie: 'unverified', network: 'PartnerStack' },
    url: 'https://www.jasper.ai/',
    affiliate: false,
  },
  {
    id: 'copyai', name: 'Copy.ai', category: 'marketing',
    blurb: 'GTM AI platform for automating sales and marketing workflows, from ad copy to outbound sequences.',
    terms: { commission: 'up to 45% recurring', cookie: 'unverified', network: 'PartnerStack' },
    url: 'https://www.copy.ai/',
    affiliate: false,
  },
  {
    id: 'grammarly', name: 'Grammarly', category: 'writing',
    blurb: 'The grammar and tone checker that lives everywhere you type. Free tier plus Premium and Business plans.',
    terms: { commission: 'flat $25 per sale', cookie: 'unverified', network: 'in-house' },
    url: 'https://www.grammarly.com/',
    affiliate: false,
  },
  {
    id: 'elevenlabs', name: 'ElevenLabs', category: 'video',
    blurb: 'Best-in-class AI voice generation and cloning for podcasts, videos, and audiobooks.',
    terms: { commission: 'referral %', cookie: 'unverified', network: 'in-house' },
    url: 'https://elevenlabs.io/',
    affiliate: false,
  },
  {
    id: 'descript', name: 'Descript', category: 'video',
    blurb: 'Edit video and podcasts like a doc. Studio Sound, overdub, and multi-track editing in one timeline.',
    terms: { commission: '15–20% recurring', cookie: 'unverified', network: 'in-house' },
    url: 'https://www.descript.com/',
    affiliate: false,
  },
  {
    id: 'murfai', name: 'Murf AI', category: 'video',
    blurb: 'Studio-grade AI voiceover with 120+ voices, pitch and pause control, and a collaborative studio.',
    terms: { commission: '15–20% recurring', cookie: 'unverified', network: 'in-house' },
    url: 'https://murf.ai/',
    affiliate: false,
  },
  {
    id: 'pictory', name: 'Pictory', category: 'video',
    blurb: 'Turn scripts, blog posts, and long recordings into short branded videos automatically.',
    terms: { commission: 'up to 30% recurring', cookie: 'unverified', network: 'in-house' },
    url: 'https://pictory.ai/',
    affiliate: false,
  },
  {
    id: 'synthesia', name: 'Synthesia', category: 'video',
    blurb: 'AI avatar videos from text — training, onboarding, and product explainers without a camera crew.',
    terms: { commission: '25% recurring', cookie: 'unverified', network: 'Impact' },
    url: 'https://www.synthesia.io/',
    affiliate: false,
  },
  {
    id: 'semrush', name: 'Semrush', category: 'seo',
    blurb: 'Full SEO suite: keyword research, rank tracking, site audits, and competitor gap analysis.',
    terms: { commission: '~$200 per sale', cookie: 'unverified', network: 'in-house (BeRush)' },
    url: 'https://www.semrush.com/',
    affiliate: false,
  },
  {
    id: 'surfer', name: 'Surfer SEO', category: 'seo',
    blurb: 'Content editor that scores your drafts against live SERP data, for writers who care about ranking.',
    terms: { commission: 'up to 20% recurring', cookie: 'unverified', network: 'in-house' },
    url: 'https://surferseo.com/',
    affiliate: false,
  },
  {
    id: 'perplexity', name: 'Perplexity Pro', category: 'productivity',
    blurb: 'Answer engine with cited sources. The Pro tier unlocks stronger models and file uploads.',
    terms: { commission: '—', cookie: 'unverified', network: 'no public program found' },
    url: 'https://www.perplexity.ai/pro',
    affiliate: false,
  },
  {
    id: 'notionai', name: 'Notion AI', category: 'productivity',
    blurb: 'Q&A, drafting, and autofill across your workspace docs. Sold as an add-on to Notion plans.',
    terms: { commission: '50% first year', cookie: 'unverified', network: 'in-house' },
    url: 'https://www.notion.com/product/ai',
    affiliate: false,
  },
];
