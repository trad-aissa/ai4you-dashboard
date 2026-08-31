// src/data/models.js — frontier model specifications, pricing, and context windows
// Updated August 2026

export const MODELS = [
  {
    id: 'gpt-5-6-sol',
    name: 'GPT-5.6 Sol',
    provider: 'OpenAI',
    category: 'flagship',
    inputPrice: 5.00,  // $ per 1M tokens
    outputPrice: 20.00,
    contextWindow: '256k',
    maxOutput: '16k',
    openWeights: false,
    tools: ['ChatGPT', 'API', 'Cursor', 'Copilot'],
    description: 'OpenAI flagship model with highest general reasoning and multi-modal fidelity.'
  },
  {
    id: 'gpt-5-6-terra',
    name: 'GPT-5.6 Terra',
    provider: 'OpenAI',
    category: 'workhorse',
    inputPrice: 2.50,
    outputPrice: 15.00,
    contextWindow: '256k',
    maxOutput: '16k',
    openWeights: false,
    tools: ['ChatGPT', 'API', 'Cursor'],
    description: 'Balanced performance tier for scalable agent workflows and code generation.'
  },
  {
    id: 'gpt-5-6-luna',
    name: 'GPT-5.6 Luna',
    provider: 'OpenAI',
    category: 'speed',
    inputPrice: 1.00,
    outputPrice: 4.00,
    contextWindow: '128k',
    maxOutput: '8k',
    openWeights: false,
    tools: ['ChatGPT Free Default', 'API'],
    description: 'High-throughput default model with ultra-fast latency for daily tasks.'
  },
  {
    id: 'claude-opus-5',
    name: 'Claude Opus 5',
    provider: 'Anthropic',
    category: 'flagship',
    inputPrice: 5.00,
    outputPrice: 25.00,
    contextWindow: '500k',
    maxOutput: '32k',
    openWeights: false,
    tools: ['Claude Code', 'Workbench', 'Bedrock', 'Vertex AI'],
    description: 'Autonomous agent specialist with state-of-the-art long-horizon planning and reasoning.'
  },
  {
    id: 'claude-sonnet-5',
    name: 'Claude Sonnet 5',
    provider: 'Anthropic',
    category: 'workhorse',
    inputPrice: 2.00,
    outputPrice: 10.00,
    contextWindow: '500k',
    maxOutput: '16k',
    openWeights: false,
    tools: ['Claude Code', 'Cursor', 'Bedrock', 'Vertex AI'],
    description: 'Developer favorite for deep codebase editing, refactoring, and agent tool execution.'
  },
  {
    id: 'gemini-3-7-flash',
    name: 'Gemini 3.7 Flash',
    provider: 'Google',
    category: 'speed',
    inputPrice: 0.75,
    outputPrice: 3.75,
    contextWindow: '2M',
    maxOutput: '64k',
    openWeights: false,
    tools: ['Google AI Studio', 'Vertex AI', 'Cursor'],
    description: 'Massive 2M context window with high reasoning speed and aggressive pricing.'
  },
  {
    id: 'grok-4-6',
    name: 'Grok 4.6',
    provider: 'xAI',
    category: 'workhorse',
    inputPrice: 2.00,
    outputPrice: 6.00,
    contextWindow: '512k',
    maxOutput: '16k',
    openWeights: false,
    tools: ['Cursor', 'Grok Build', 'Bedrock', 'Copilot'],
    description: 'Tuned specifically for continuous coding agent sessions and rapid code compilation.'
  },
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4-Pro',
    provider: 'DeepSeek',
    category: 'workhorse',
    inputPrice: 1.80,
    outputPrice: 7.20,
    contextWindow: '256k',
    maxOutput: '16k',
    openWeights: false,
    tools: ['DeepSeek API', 'Web Chat'],
    description: 'GA model with peak/off-peak rates, strong math and structured logic.'
  },
  {
    id: 'kimi-k3',
    name: 'Kimi K3 (2.8T MoE)',
    provider: 'Moonshot AI',
    category: 'open-weights',
    inputPrice: 0.00, // Open weights
    outputPrice: 0.00,
    contextWindow: '256k',
    maxOutput: '16k',
    openWeights: true,
    hfUrl: 'https://huggingface.co/moonshotai/Kimi-K3',
    tools: ['Hugging Face', 'vLLM', 'Ollama'],
    description: 'Largest open-weight model with 2.8T parameters and native multimodal agent capabilities.'
  },
  {
    id: 'glm-5-3-flash',
    name: 'GLM-5.3-Flash',
    provider: 'Z.ai',
    category: 'open-weights',
    inputPrice: 0.00,
    outputPrice: 0.00,
    contextWindow: '128k',
    maxOutput: '8k',
    openWeights: true,
    hfUrl: 'https://huggingface.co/THUDM/glm-5.3-flash',
    tools: ['Hugging Face', 'Local GPU', 'vLLM'],
    description: 'Fast open-weights coding model downloadable directly for self-hosted inference.'
  }
];

export const PRESETS = [
  { name: 'Coding Agent Session', inputTokens: 45000, outputTokens: 2500, desc: 'Large codebase context scan + 200 lines patch' },
  { name: 'Full Codebase Audit', inputTokens: 180000, outputTokens: 6000, desc: 'Multi-file security and architecture review' },
  { name: 'Daily Developer Chat', inputTokens: 12000, outputTokens: 1200, desc: 'Interactive debugging and function implementation' },
  { name: 'Light Prompt / Q&A', inputTokens: 2000, outputTokens: 400, desc: 'Quick syntax clarification or regex generation' }
];

export default MODELS;
