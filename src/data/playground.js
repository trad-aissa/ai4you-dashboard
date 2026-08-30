// ============================================================
// ai4you.site — Playground command database
// One unified sandbox: every lesson command + general extras.
// ============================================================
export const playgroundCategories = [
  {
    id: 'basics',
    label: 'Session basics',
    commands: {
      help: [
        'Claude Code — commands:',
        '  /help /init /clear /compact /cost /context',
        '  /memory /permissions /agents /mcp /skills /plugin',
        '  exit — quit · TAB completes · ↑/↓ history',
      ],
      claude: ['✓ Interactive session started in ~/projects/app', 'Permission mode: default — ask before edits'],
      'claude "fix the failing test"': [
        '● Reading vitest output…',
        '● auth.spec.ts:17 expects 1-indexed pages; clamp fix is 0-indexed',
        '● Editing auth.spec.ts:17',
        '✓ Fixed — 41/41 tests pass',
      ],
      'claude -p "summarize this diff" < diff.txt': ['feat(pagination): clamp offset, add regression test'],
      'claude --resume': ['✓ Resumed session from 2h ago — "pagination clamp fix" (14 messages)'],
      exit: ['Goodbye! 👋 (simulated)'],
    },
  },
  {
    id: 'memory',
    label: 'Memory & context',
    commands: {
      '/init': [
        '● Analyzing project structure…',
        '● Reading package.json, src/, tests/',
        '✓ Created CLAUDE.md (build: pnpm test · stack: Astro + Supabase)',
      ],
      '/memory': [
        'Opening CLAUDE.md…',
        '## Build',
        '- Dev: pnpm dev · Test: pnpm test',
        '## Conventions',
        '- Use pnpm, never npm',
      ],
      '# Use pnpm, never npm': ['✓ Saved to CLAUDE.md → "## Conventions"'],
      '/compact': ['● Compacting… 61k → 14k tokens. Task summary retained.'],
      '/clear': ['✓ History cleared. Context: 3.1k tokens.'],
      '/context': [
        'Context window usage: 14k / 200k tokens',
        '  system + tools        12k',
        '  CLAUDE.md              1.8k',
        '  conversation           0.2k ✓ healthy',
      ],
      '/cost': ['Session spend: $0.42 (58.1k input / 3.2k output tokens)'],
    },
  },
  {
    id: 'permissions',
    label: 'Permissions & safety',
    commands: {
      '/permissions': [
        'Permission rules (.claude/settings.json):',
        '  allow:  Bash(npm test), Bash(npm run lint)',
        '  deny:   Bash(rm -rf *), Read(.env*)',
        '  ask:    everything else',
      ],
      'npm test': ['✓ allowed by rule: Bash(npm test)', '● running tests… 41 passed'],
      'rm -rf dist': [
        '⚠ Blocked by deny rule: Bash(rm -rf *)',
        'Claude: `npm run clean` can clear dist/ instead.',
      ],
      'git push --force': ['⚠ Blocked by deny rule: force-pushes are never allowed in this repo'],
    },
  },
  {
    id: 'extensibility',
    label: 'Skills, agents & plugins',
    commands: {
      '/skills': [
        'Installed skills:',
        '  release-checklist  (project)  — run before cutting any release',
        '  api-error-style    (personal) — house style for API error responses',
      ],
      'cut a release': [
        '● skill matched: release-checklist',
        '● pnpm test ✓ · pnpm build ✓ · CHANGELOG.md updated',
        'Ready to tag v2.2.0 — approve?',
      ],
      '/agents': [
        'Configured agents (.claude/agents/):',
        '  investigator  — read-only triage · tools: Bash, Read, Grep',
        '  implementer   — full edit access · tools: all',
      ],
      '3 tests fail — find the root cause': [
        '● Dispatching subagent: investigator (read-only)',
        '● investigator: Date.now() in cache key breaks at midnight UTC',
        'Summary: one-line fix in cache.ts:41.',
      ],
      '/plugin': [
        'Plugin manager:',
        '  marketplaces: team-tools (github.com/acme/team-tools)',
        '  installed:    pr-reviewer ✓ enabled · deploy-kit ⏸ disabled',
      ],
      '/plugin install pr-reviewer': ['✓ Installed: 3 commands, 1 agent, 1 hook'],
    },
  },
  {
    id: 'mcp',
    label: 'MCP servers',
    commands: {
      '/mcp': [
        'MCP servers:',
        '  ✓ github      (http)   12 tools — issues, PRs, repos',
        '  ✓ postgres    (stdio)   4 tools — read-only SQL',
        '  ✓ puppeteer   (stdio)   7 tools — navigate, click, screenshot',
      ],
      'what are the 5 newest orders?': [
        '● mcp__postgres__query: SELECT … ORDER BY created_at DESC LIMIT 5',
        '  1. #4821 · $129.00 · 2h ago',
        '  2. #4820 · $64.50 · 5h ago',
      ],
      'open the pricing page and screenshot it': [
        '● mcp__puppeteer__navigate → http://localhost:4321/pricing',
        '● mcp__puppeteer__screenshot → pricing.png ✓',
      ],
      'create an issue for the pricing overflow': [
        '● mcp__github__create_issue',
        '✓ #142 "Pricing table overflows on wide viewports" opened',
      ],
    },
  },
  {
    id: 'git',
    label: 'Git workflows',
    commands: {
      'commit this': [
        '● Diffing 3 files (+84 −12)…',
        'Suggested: feat(pagination): clamp offset, add page-0 regression test',
        '✓ committed',
      ],
      'open a pr': ['● gh pr create --fill', '✓ https://github.com/acme/app/pull/143'],
      'git worktree add ../hotfix-121 -b hotfix/121': [
        '✓ worktree ../hotfix-121 on branch hotfix/121',
        'Tip: one session per worktree = parallel agents, zero conflicts',
      ],
      'why does normalizePhone exist?': [
        '● git log -S normalizePhone → a41f2c9 (Mar)',
        'Normalizes E.164 for the Twilio sync; without it +1 numbers are rejected.',
      ],
    },
  },
  {
    id: 'codex',
    label: 'Codex CLI',
    commands: {
      codex: ['✓ TUI started · model: gpt-5.6-codex · sandbox: workspace-write'],
      '/approvals': [
        'Approval mode:',
        '  [1] Read-only  [2] Auto (default)  [3] Full access',
      ],
      '/model': ['✓ Switched to gpt-5.6-codex'],
      'codex exec "audit auth.js" --sandbox read-only': [
        '● headless · sandbox: read-only',
        '⚠ auth.js:23 — string-concatenated SQL (parameterize it)',
        '✓ report complete (no files touched)',
      ],
      'cat ~/.codex/config.toml': [
        'model = "gpt-5.6-codex"',
        'approval_policy = "on-request"',
        'sandbox = "workspace-write"',
      ],
    },
  },
  {
    id: 'shell',
    label: 'Just for fun',
    commands: {
      whoami: ['guest @ ai4you.site playground (nothing here touches your machine)'],
      'cat CLAUDE.md': [
        '# CLAUDE.md',
        '## Build',
        '- Dev: pnpm dev · Test: pnpm test',
        '## Conventions',
        '- Use pnpm, never npm',
      ],
      ls: ['src/  tests/  CLAUDE.md  package.json  vitest.config.ts'],
      pwd: ['/home/guest/projects/app'],
      'echo "hello agent"': ['hello agent'],
    },
  },
];

export const playgroundCommandCount = Object.values(playgroundCategories).reduce(
  (n, c) => n + Object.keys(c.commands).length,
  0,
);
