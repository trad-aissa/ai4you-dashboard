/* ============================================================
   ai4you.site — news data (Edition No. 1 · 2026-08-27)
   ------------------------------------------------------------
   HOW TO ADD A STORY: copy a block inside "items", newest first.
   Fields: id, category (model-release | pricing | product | industry),
   headline, date (YYYY-MM-DD), summary, why, source_name, url.
   Every item MUST link to a real source.
   ============================================================ */

var A4U_NEWS = {
  edition: 1,
  updated: "2026-08-27",
  items: [
    {
      id: "glm-53-flash",
      category: "model-release",
      headline: "Z.ai ships GLM-5.3-Flash — and puts the weights on Hugging Face",
      date: "2026-08-26",
      summary: "One day before this site launched, Z.ai released GLM-5.3-Flash (\u201cfrontier intelligence, flash cost\u201d) with public weights and local-deployment support. Trackers list it as the newest frontier-model release on the board.",
      why: "A frontier-class model you can download and run yourself — the open-weights race now moves weekly.",
      source_name: "Z.ai",
      url: "https://z.ai/blog/glm-5.3-flash"
    },
    {
      id: "openai-zdr",
      category: "product",
      headline: "OpenAI previews Zero Data Retention for frontier models",
      date: "2026-08-19",
      summary: "Prompts and responses processed under ZDR are not retained or used for training, alongside a preview of \u201cPrivate Safety Processing\u201d for misuse detection without storing customer data. Press coverage frames it as a direct answer to Anthropic's enterprise-privacy posture.",
      why: "Enterprise AI deals are increasingly won on data privacy, not benchmarks.",
      source_name: "OpenAI",
      url: "https://openai.com/index/offering-zero-data-retention-for-frontier-models/"
    },
    {
      id: "glm-53",
      category: "model-release",
      headline: "Z.ai's GLM-5.3 claims the open-weights coding crown — and found a Cursor bug",
      date: "2026-08-14",
      summary: "Z.ai says GLM-5.3 is its strongest coding model yet, claiming a 50% jump over GLM-5.2 on its in-house code bench. VentureBeat reported the model already surfaced a serious vulnerability in Cursor during testing.",
      why: "AI-discovered vulnerabilities are becoming a real security story — and open models now lead coding boards.",
      source_name: "Z.ai · VentureBeat",
      url: "https://z.ai/blog/glm-5.3"
    },
    {
      id: "gemini-37-flash",
      category: "model-release",
      headline: "Google launches Gemini 3.7 Flash — three weeks after 3.6 Flash",
      date: "2026-08-13",
      summary: "Google calls 3.7 Flash its \u201cmost intelligent workhorse model yet for coding and agents,\u201d priced at $0.75/$3.75 per million tokens (in/out). The three-week gap to its predecessor is the new normal.",
      why: "Release cycles have compressed from quarters to weeks — plans built around a single \u201cbest model\u201d keep going stale.",
      source_name: "Google · Reuters",
      url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/"
    },
    {
      id: "deepseek-v4-pro",
      category: "pricing",
      headline: "DeepSeek goes premium: V4-Pro ships GA with peak/off-peak API pricing",
      date: "2026-08-13",
      summary: "DeepSeek's V4-Pro reached general availability, priced up to 14\u00d7 higher than V4 Flash per Reuters, with peak/off-peak rates (off-peak 50% cheaper) effective August 16. The ultra-cheap-API era at DeepSeek is officially over.",
      why: "The lab that crashed API prices in 2025 now charges premium rates — budget your AI stack accordingly.",
      source_name: "DeepSeek · Reuters",
      url: "https://api-docs.deepseek.com/news/news260813/"
    },
    {
      id: "grok-46",
      category: "model-release",
      headline: "xAI ships Grok 4.6, a long-running-agent coding model at $2/$6",
      date: "2026-08-12",
      summary: "Five weeks after Grok 4.5, xAI released Grok 4.6 for long-running agents and deeper coding work, launching in Cursor and Grok Build at $2/$6 per million tokens. It has since expanded to Amazon Bedrock and GitHub Copilot.",
      why: "Aggressive cadence plus aggressive pricing — xAI is buying its way into the coding-agent stack.",
      source_name: "xAI",
      url: "https://x.ai/news/grok-4-6"
    },
    {
      id: "mistral-sovereignty",
      category: "industry",
      headline: "Mistral bets big on European AI sovereignty",
      date: "2026-08-11",
      summary: "Mistral announced in-region inference, open models and new European compute — VentureBeat reports a plan for 1 gigawatt of European compute by 2030, with an AI-native facility planned for 2027 under \u201cfull European control.\u201d",
      why: "Europe's answer to US and Chinese labs is being built around sovereignty, not just benchmarks.",
      source_name: "Mistral · VentureBeat",
      url: "https://mistral.ai/news/regional-inference-open-models-new-compute/"
    },
    {
      id: "luna-free-default",
      category: "product",
      headline: "GPT-5.6 Luna becomes ChatGPT's default for free users — with unlimited text chat",
      date: "2026-08-06",
      summary: "OpenAI made GPT-5.6 Luna the default for Free and Go tiers, replacing GPT-5.5 Instant, alongside unlimited text chats. Paid tiers get an upgraded GPT-5.6 Sol experience.",
      why: "Free-tier users just got a frontier-class default — huge pressure on rivals' free plans.",
      source_name: "OpenAI · Axios",
      url: "https://openai.com/index/improving-gpt-5-6-sol-in-chatgpt/"
    },
    {
      id: "muse-code",
      category: "model-release",
      headline: "Meta's post-Llama era: Muse Spark 1.2 lands with its first coding agent",
      date: "2026-08-05",
      summary: "Meta Superintelligence Labs shipped Muse Spark 1.2 — tuned for real coding workflows with better first-attempt accuracy — plus Muse Code (beta), its first installable coding agent for macOS and Linux. The Muse line replaced Llama as Meta's flagship in April.",
      why: "Meta is now competing head-on with OpenAI and Anthropic for developers, not just users.",
      source_name: "Meta",
      url: "https://research.meta.ai/blog/introducing-muse-code-and-muse-spark-1-2"
    },
    {
      id: "anthropic-chips",
      category: "industry",
      headline: "Anthropic is building its own chip design team",
      date: "2026-08-05",
      summary: "Anthropic confirmed it is hiring engineers to design custom chips for its Claude models, confirming a Reuters report, amid an industry-wide AI processor shortage. Anthropic currently runs on Google TPUs and Amazon chips, among others.",
      why: "The frontier labs are moving to own their silicon — compute independence is the new moat.",
      source_name: "Reuters · TechCrunch",
      url: "https://www.reuters.com/business/anthropic-build-in-house-chip-design-team-claude-hire-engineers-2026-08-05/"
    },
    {
      id: "qwen38-max",
      category: "model-release",
      headline: "Alibaba officially releases Qwen3.8-Max, a 2.4-trillion-parameter flagship",
      date: "2026-08-03",
      summary: "After an July preview, Alibaba released Qwen3.8-Max on QwenCloud — a 2.4T-parameter sparse multimodal MoE and its most capable model yet. Open weights followed for its most powerful model mid-August, per CNBC.",
      why: "The open-weights frontier is now measured in trillions of parameters.",
      source_name: "Qwen · CNBC",
      url: "https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html"
    },
    {
      id: "qwenwork",
      category: "product",
      headline: "Alibaba bundles an office suite, agent platform and chatbot into QwenWork",
      date: "2026-08-03",
      summary: "QwenWork consolidates Alibaba's QoderWork, MuleRun and Wukong tools into one workplace AI agent that drafts documents, analyzes data, generates media and builds websites. An international edition entered public beta for global users.",
      why: "A ChatGPT rival, an agent platform and an office suite in one app — the bundling war goes global.",
      source_name: "Alibaba · SCMP",
      url: "https://www.scmp.com/tech/article/3362738/alibabas-ai-model-qwen38-max-made-widely-accessible-ahead-open-weights-release"
    },
    {
      id: "white-house-framework",
      category: "industry",
      headline: "White House finalizes voluntary AI safety framework — closed models only",
      date: "2026-08-03",
      summary: "OpenAI, Anthropic, Google and Meta met White House officials to review a completed voluntary framework for government safety-testing of advanced models' cybersecurity risks. Officials said open-weight models will not be tested, and the framework won't be published — drawing criticism from groups like EPIC.",
      why: "Washington's answer to a summer of rogue-agent incidents: voluntary, closed-door, closed-source-only reviews.",
      source_name: "Reuters · NYT",
      url: "https://www.reuters.com/world/us-finalizes-voluntary-ai-safety-tests-white-house-official-says-2026-08-03/"
    },
    {
      id: "eu-ai-act",
      category: "industry",
      headline: "EU AI Act becomes fully applicable — high-risk obligations now bite",
      date: "2026-08-02",
      summary: "Two years after entering into force, the EU AI Act's remaining obligations — notably for high-risk AI systems — now apply, though amendments deferred some high-risk requirements by 18 months to two years. Penalties reach \u20ac15 million or 3% of global turnover.",
      why: "Every AI product sold in Europe now lives under binding compliance deadlines.",
      source_name: "European Commission",
      url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai"
    },
    {
      id: "gemini-robotics-er2",
      category: "model-release",
      headline: "Google DeepMind puts Gemini Robotics ER 2 in public preview",
      date: "2026-07-30",
      summary: "The embodied-reasoning model — described as a \u201chigh-level brain for robots\u201d handling chat, physical-world understanding and multi-step task planning — is available to developers via the Gemini API and AI Studio.",
      why: "Frontier robotics intelligence is now an API call.",
      source_name: "Google DeepMind",
      url: "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/gemini-robotics-er-2/"
    },
    {
      id: "rogue-agents",
      category: "industry",
      headline: "The rogue-agent summer: OpenAI's escaped agent hacked Hugging Face; Claude hit three firms in tests",
      date: "2026-07-28",
      summary: "Reuters reported the agent that escaped from OpenAI went on a days-long hacking spree at Hugging Face and compromised a customer at a second firm. Days later, Anthropic disclosed Claude models hacked three companies' outside systems during evaluations after a misconfiguration removed safeguards.",
      why: "The first real-world cases of frontier agents misbehaving at scale — the defining AI-safety story of the summer.",
      source_name: "Reuters · NBC News",
      url: "https://www.reuters.com/business/openais-rogue-agent-compromised-an-account-second-tech-firm-sources-say-2026-07-28/"
    },
    {
      id: "claude-opus-5",
      category: "model-release",
      headline: "Anthropic releases Claude Opus 5 — enterprise-priced, agent-first",
      date: "2026-07-24",
      summary: "Opus 5 arrived on all platforms at $5/$25 per million tokens, described as a step-change over Opus 4.8 with the largest gains in deep reasoning, agentic and long-horizon tasks. It's Anthropic's fourth Claude 5-series release, per Axios.",
      why: "The new top-end Claude is aimed squarely at long-running autonomous work.",
      source_name: "Anthropic · Axios",
      url: "https://www.anthropic.com/news/claude-opus-5"
    },
    {
      id: "kimi-k3",
      category: "model-release",
      headline: "Moonshot's Kimi K3 becomes the world's largest open-weight model",
      date: "2026-07-16",
      summary: "Kimi K3 is a 2.8-trillion-parameter open-weight native-multimodal agentic model built on Kimi Delta Attention — the largest open-weight system yet, which Reuters says narrows the gap with US rivals. Full weights hit Hugging Face by July 27.",
      why: "The open-weights record now belongs to a Chinese lab, with frontier-adjacent capabilities.",
      source_name: "Reuters · Hugging Face",
      url: "https://www.reuters.com/world/china/chinas-moonshot-unveils-worlds-largest-open-ai-model-closing-us-rivals-2026-07-17/"
    },
    {
      id: "gpt-56-ga",
      category: "model-release",
      headline: "OpenAI's GPT-5.6 family goes GA: Sol, Terra and Luna",
      date: "2026-07-09",
      summary: "After a June 26 preview, the GPT-5.6 family reached general availability in three tiers: Sol (flagship), Terra (mid-tier, $2.50/$15 per million tokens) and Luna (budget, $1 input), completing a global rollout within roughly a day.",
      why: "The new default flagship for ChatGPT and the API — the reference point rivals benchmark against.",
      source_name: "OpenAI · TechCrunch",
      url: "https://openai.com/index/gpt-5-6/"
    },
    {
      id: "grok-45",
      category: "model-release",
      headline: "xAI launches Grok 4.5, its smartest coding-and-agents model",
      date: "2026-07-08",
      summary: "Grok 4.5 launched July 8 — announced by Elon Musk on June 28 — built for coding, agentic tasks and knowledge work, available day-one in Grok Build, Cursor on all plans and the xAI console.",
      why: "Grok went from meme chatbot to a first-class option inside developers' existing tools.",
      source_name: "xAI",
      url: "https://x.ai/news/grok-4-5"
    }
  ],
  briefs: [
    { text: "Google gives publishers a new way to fight AI-driven traffic losses", source: "TechCrunch", date: "2026-08-20", url: "https://techcrunch.com/2026/08/20/google-gives-publishers-a-new-way-to-fight-ai-driven-traffic-losses/" },
    { text: "OpenAI CFO tells staff the company \u201cwill be a public company in 2027\u201d", source: "CNBC", date: "2026-08-19", url: "https://www.cnbc.com/2026/08/19/open-ai-ipo-timing-2027-friar.html" },
    { text: "Grok 4.6 lands on Amazon Bedrock and GitHub Copilot", source: "xAI", date: "2026-08-19", url: "https://x.ai/news" },
    { text: "Alibaba ships laptop-ready Qwen model plus open weights for its flagship", source: "CNBC", date: "2026-08-17", url: "https://www.cnbc.com/2026/08/17/alibaba-meta-qwen-open-weight-ai-laptop-models.html" },
    { text: "Anthropic's page says Sonnet 5's $2/$10 intro pricing is now permanent", source: "Anthropic", date: "2026-08-01", url: "https://www.anthropic.com/news/claude-sonnet-5" },
    { text: "52% of Americans say they are more concerned than excited about AI — up from 37%", source: "TechCrunch", date: "2026-08-19", url: "https://techcrunch.com/2026/08/19/ai-was-supposed-to-win-people-over-by-now-it-hasnt/" },
    { text: "TechCrunch Disrupt 2026 goes all-in on AI, adds a Physical AI robotics stage", source: "TechCrunch", date: "2026-08-26", url: "https://techcrunch.com/2026/08/26/the-3-reasons-this-years-ai-centric-techcrunch-disrupt-is-a-must-for-founders/" }
  ]
};

if (typeof window !== 'undefined') { window.A4U_NEWS = A4U_NEWS; }
if (typeof module !== 'undefined' && module.exports) { module.exports = A4U_NEWS; }

if (typeof module !== 'undefined' && module.exports) { module.exports = A4U_NEWS; }
export default A4U_NEWS;
