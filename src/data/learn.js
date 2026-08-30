// ============================================================
// ai4you.site — "Learn by doing" curriculum
// Each module: lesson sections (HTML strings), a scripted terminal
// simulator, and a quiz. Add a module here and it appears on /learn.
// ============================================================
export const modules = [
  {
    slug: 'claude-code-101',
    title: 'Claude Code from zero',
    tool: 'Claude Code',
    level: 'Beginner',
    minutes: 12,
    summary: 'Install the agentic CLI, start your first session, and learn the six commands that carry 90% of daily work.',
    sections: [
      {
        heading: 'What Claude Code actually is',
        body: `<p>Claude Code is Anthropic's command-line agent: it reads your project, edits files, runs commands, and commits — from your terminal, under your permissions. Unlike a chat window, it can <em>do</em> things: it operates on a real working directory with tools (Read, Write, Edit, Bash, search) and asks permission before acting on anything risky.</p>
<p>The mental model that makes everything click: <strong>it is a junior engineer with full repo access who shows its work</strong>. You give outcomes ("add pagination to the users table"), it plans, edits, and reports. Your job is direction and review, not keystrokes.</p>`,
      },
      {
        heading: 'Install and start',
        body: `<p>Install globally with npm (Node 18+):</p>
<pre><code>npm install -g @anthropic-ai/claude-code</code></pre>
<p>Then <code>cd</code> into any project and run <code>claude</code>. The first launch asks you to sign in with your Anthropic account (console or Claude subscription). That's the whole setup — no API keys to wire, no config files to author before your first prompt.</p>
<p>Two launch flags worth knowing early: <code>claude --resume</code> reopens a previous session, and <code>claude -p "quick question"</code> runs a one-shot prompt that prints an answer and exits — useful in scripts.</p>`,
      },
      {
        heading: 'The six commands that matter first',
        body: `<p>Slash commands work inside a session. Start with these:</p>
<ul>
<li><strong>/init</strong> — scans your project and writes a CLAUDE.md memory file (see the next lesson).</li>
<li><strong>/help</strong> — lists every command; the fastest way to discover features.</li>
<li><strong>/clear</strong> — wipes conversation history for a fresh start on a new task.</li>
<li><strong>/compact</strong> — summarizes a long session to free up context when the conversation gets heavy.</li>
<li><strong>/cost</strong> — shows token spend for the session.</li>
<li><strong>exit</strong> (or Ctrl+D) — leave.</li>
</ul>
<p>Try them in the simulator below — the muscle memory is the point.</p>`,
      },
    ],
    sim: {
      hint: 'A fresh Claude Code session. Nothing you type here touches your machine.',
      commands: {
        '/help': [
          'Available commands:',
          '  /init     — analyze the project and write a CLAUDE.md',
          '  /clear    — clear conversation history',
          '  /compact  — summarize the session to free context',
          '  /cost     — show session token usage',
          '  /memory   — edit CLAUDE.md memory files',
          '  exit      — quit Claude Code',
        ],
        '/init': [
          '● Scanning project structure…',
          '● Reading package.json, src/, tests/',
          '✓ Created CLAUDE.md (build: pnpm test · stack: Astro + Supabase)',
          'Tip: refine it anytime with /memory — it is loaded into every future session.',
        ],
        '/compact': [
          '● Compacting conversation…',
          '✓ Context reduced: 142k → 31k tokens. Summary kept.',
        ],
        '/cost': ['Session spend: $0.42 (58.1k input / 3.2k output tokens)'],
        '/clear': ['✓ History cleared. Fresh context.'],
        'exit': ['Goodbye! 👋 (simulated — the real CLI would close here)'],
      },
    },
    quiz: [
      {
        q: 'What does /init do?',
        options: ['Installs Claude Code', 'Generates a CLAUDE.md memory file from your project', 'Clears the session', 'Starts a git repo'],
        answer: 1,
        explain: '/init analyzes the codebase and writes CLAUDE.md — the project memory loaded into future sessions.',
      },
      {
        q: 'Your session has been running long and responses feel slow. What now?',
        options: ['/clear — throw everything away', '/compact — summarize and free context', 'Reinstall', '/cost'],
        answer: 1,
        explain: '/compact keeps a summary of the work while dropping the token weight. /clear works too but loses all continuity.',
      },
      {
        q: 'Which flag runs a one-shot prompt from a script?',
        options: ['claude --resume', 'claude -p "prompt"', 'claude --headless', 'claude /run'],
        answer: 1,
        explain: 'claude -p (print mode) answers once and exits — the building block for shell scripts and CI.',
      },
    ],
  },

  {
    slug: 'claude-md-memory',
    title: 'Teach it your project: CLAUDE.md',
    tool: 'Claude Code',
    level: 'Beginner',
    minutes: 8,
    summary: 'The memory file that turns generic answers into your-team answers — what belongs in it, and where it lives.',
    sections: [
      {
        heading: 'One file, loaded every session',
        body: `<p><strong>CLAUDE.md</strong> is plain markdown that Claude Code reads at the start of every session in your project. It is the difference between "here's how React apps usually work" and "this repo uses pnpm, tests live in <code>tests/</code>, and we never touch <code>legacy/</code> without asking."</p>
<p>Generate a first draft with <code>/init</code>, then prune it by hand. The best CLAUDE.md files are short — commands, conventions, and warnings. It is context paid for on every single prompt, so padding it with obvious boilerplate makes every answer slower and costlier.</p>`,
      },
      {
        heading: 'What goes in — and what stays out',
        body: `<p><strong>In:</strong> build/test/lint commands (exact ones, not "the usual"), architecture one-liners, code-style rules that differ from the mainstream, files or directories to never modify, PR/commit conventions.</p>
<p><strong>Out:</strong> anything the code already says, long tutorials, hopes and dreams. If a rule matters once, say it in chat. If it matters every session, CLAUDE.md.</p>
<p>There is a hierarchy: project <code>CLAUDE.md</code> (shared, in the repo), <code>CLAUDE.local.md</code> (your personal overrides, gitignored), and a global user file at <code>~/.claude/CLAUDE.md</code> for preferences across all projects.</p>`,
      },
      {
        heading: 'The # shortcut — memory while you work',
        body: `<p>Whenever you correct Claude in conversation ("no — we use Vitest, not Jest"), start the message with <strong>#</strong>: <code># Always use Vitest in this repo</code>. Claude Code offers to save that into the right memory file, so the correction survives the session.</p>
<p>Inspect and edit everything with <code>/memory</code>. Treat CLAUDE.md like a config file you review in PRs — it shapes every future answer for everyone on the team.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated session focused on memory commands.',
      commands: {
        '/init': [
          '● Analyzing project…',
          '✓ CLAUDE.md written with build commands and conventions.',
        ],
        '# Use pnpm, never npm': [
          '✓ Saved to CLAUDE.md → "## Conventions"',
          '  Added: Use pnpm, never npm',
        ],
        '/memory': [
          'Opening CLAUDE.md…',
          '## Build',
          '- Dev: pnpm dev · Test: pnpm test',
          '## Conventions',
          '- Use pnpm, never npm',
          '(edit, save, and it applies to every future session)',
        ],
        '/clear': ['✓ History cleared — CLAUDE.md still loaded (that is the point).'],
      },
    },
    quiz: [
      {
        q: 'Which memory file should hold personal preferences you do NOT want in git?',
        options: ['CLAUDE.md', 'CLAUDE.local.md', 'README.md', '.claude/commands/'],
        answer: 1,
        explain: 'CLAUDE.local.md is gitignored personal overrides; CLAUDE.md is the shared, committed project memory.',
      },
      {
        q: 'What is the fastest way to persist a correction mid-session?',
        options: ['Retype it every session', 'Start the message with #', 'Edit package.json', 'Run /init again'],
        answer: 1,
        explain: 'Messages starting with # are offered as memory entries — one keystroke now, permanent fix.',
      },
      {
        q: 'A great CLAUDE.md is…',
        options: ['As long as possible', 'A copy of the README', 'Short: exact commands, conventions, warnings', 'Auto-generated and never edited'],
        answer: 2,
        explain: 'CLAUDE.md rides along with every prompt — terse and high-signal beats exhaustive.',
      },
    ],
  },

  {
    slug: 'claude-code-automation',
    title: 'Hooks, slash commands & headless runs',
    tool: 'Claude Code',
    level: 'Intermediate',
    minutes: 14,
    summary: 'Move from chat sessions to automation: custom commands your team can share, hooks that enforce rules, and one-shot runs in CI.',
    sections: [
      {
        heading: 'Custom slash commands',
        body: `<p>Any markdown file in <code>.claude/commands/</code> becomes a slash command. Create <code>.claude/commands/review.md</code> containing instructions like <em>"Review the current diff for security issues and N+1 queries; be blunt"</em> — and every session (for everyone who pulls the repo) gets <strong>/review</strong>.</p>
<p>Files support a <code>$ARGUMENTS</code> placeholder: <code>fix-issue.md</code> containing <em>"Look up issue $ARGUMENTS, implement a fix, add a test"</em> gives you <code>/fix-issue 142</code>. This is how you turn your team's repeated prompts into checked-in tooling.</p>`,
      },
      {
        heading: 'Hooks — deterministic guardrails',
        body: `<p>Slash commands shape what Claude <em>tries</em>; hooks are the deterministic layer: shell commands that run on tool events like <strong>PreToolUse</strong> (before a tool fires — can block it), <strong>PostToolUse</strong> (after), and <strong>Stop</strong> (when the turn ends).</p>
<p>Classic uses: a PreToolUse hook on Bash that refuses any <code>git push --force</code>, or a PostToolUse hook that runs the formatter on every edited file. Hooks live in <code>.claude/settings.json</code>, so guardrails ship with the repo instead of living in each person's memory. Configure them with <code>/hooks</code>.</p>`,
      },
      {
        heading: 'Headless mode — Claude Code as a building block',
        body: `<p><code>claude -p "prompt"</code> runs without the interactive UI: print an answer, exit. Pipe data in, JSON out (<code>--output-format json</code>), and it becomes a Unix citizen:</p>
<pre><code>claude -p "summarize this diff for a changelog" &lt; diff.txt
claude -p "is this issue a bug or a feature request? reply with one word" &lt; issue.md</code></pre>
<p>That's also how it runs in GitHub Actions — the official <code>claude-code-action</code> uses the same engine to triage issues and review PRs. Start interactive, learn the prompts, then graduate the proven ones into <code>-p</code> scripts.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated session — automation corner.',
      commands: {
        '/review': [
          '● .claude/commands/review.md → reviewing working diff…',
          '⚠ auth.js:23 — SQL string built by concatenation (injection risk)',
          '⚠ db.js:88 — N+1 query in getOrders() loop',
          '✓ 2 findings, 0 style nits. Be blunt mode: satisfied.',
        ],
        '/fix-issue 142': ['● Reading issue #142 "Pagination breaks on page 0"…', '● users.ts: offset < 0 → clamped, test added', '✓ Fix committed: "fix: clamp pagination offset (#142)"'],
        '/hooks': [
          'Configured hooks (project .claude/settings.json):',
          '  PreToolUse  Bash     deny if command matches: git push --force',
          '  PostToolUse Edit     run: prettier --write $FILE',
        ],
        'claude -p "changelog from this diff" < diff.txt': [
          '## Changed',
          '- clamp pagination offset (fixes #142)',
          '## Added',
          '- regression test for page-0 pagination',
        ],
      },
    },
    quiz: [
      {
        q: 'Where do custom slash commands live?',
        options: ['~/.bashrc', '.claude/commands/*.md', 'CLAUDE.md', 'package.json scripts'],
        answer: 1,
        explain: 'Each markdown file in .claude/commands/ becomes a shareable slash command; $ARGUMENTS accepts parameters.',
      },
      {
        q: 'You want to block force-pushes no matter what the model decides. The right tool is:',
        options: ['A polite CLAUDE.md note', 'A PreToolUse hook that denies matching commands', '/clear', 'A custom slash command'],
        answer: 1,
        explain: 'Hooks are deterministic and enforced by the harness — prompts are advisory, hooks are guarantees.',
      },
      {
        q: 'What does claude -p do?',
        options: ['Opens a project picker', 'Prints the version', 'Runs one prompt non-interactively and exits', 'Pauses a session'],
        answer: 2,
        explain: '-p is headless print mode — the piece that makes Claude Code scriptable and CI-friendly.',
      },
    ],
  },

  {
    slug: 'codex-cli-101',
    title: 'Codex CLI from zero',
    tool: 'Codex',
    level: 'Beginner',
    minutes: 10,
    summary: 'OpenAI\'s open-source coding agent: install it, pick an approval mode you trust, and run tasks from the terminal.',
    sections: [
      {
        heading: 'Install and sign in',
        body: `<p>Codex CLI is OpenAI's open-source terminal agent (Rust core, on GitHub at <a href="https://github.com/openai/codex" target="_blank" rel="noopener">openai/codex</a>). Install:</p>
<pre><code>npm install -g @openai/codex</code></pre>
<p>First run asks you to sign in with ChatGPT (Plus/Pro/Team plans include Codex usage) or an API key. Then run <code>codex</code> inside a project to open the interactive TUI — same mental model as Claude Code: a colleague with terminal access and guardrails.</p>`,
      },
      {
        heading: 'Approval modes — the dial that matters',
        body: `<p>Codex's key setting is how much it may do without asking. Interactive <code>/approvals</code> (or the <code>--ask-for-approval</code> / <code>--sandbox</code> flags) sets it:</p>
<ul>
<li><strong>Read-only</strong> — it can look, suggest, but not touch. Good first run in an unfamiliar repo.</li>
<li><strong>Auto</strong> — reads/writes in the workspace and runs sandboxed commands without asking; escalates anything outside.</li>
<li><strong>Full access</strong> — no sandbox, no prompts. Powerful, and exactly what it says on the tin; use it in disposable environments.</li>
</ul>
<p>Start read-only, watch what it <em>wants</em> to do, then loosen. Trust is earned per-repo.</p>`,
      },
      {
        heading: 'Everyday commands',
        body: `<p><code>codex "fix the failing test in auth.spec.ts"</code> gives a task directly; <code>/model</code> switches the model mid-session; <code>/init</code> generates an <code>AGENTS.md</code> memory file (the Codex equivalent of CLAUDE.md — same advice applies); <code>codex resume</code> reopens a past session.</p>
<p>For scripts, <code>codex exec "task"</code> runs non-interactively with the configured sandbox — the CI-friendly sibling of interactive mode. Keep an eye on our <a href="/changelog">Codex changelog tracker</a> — it ships roughly weekly.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated Codex CLI session.',
      commands: {
        'codex': ['Opening Codex TUI…', '✓ Signed in with ChatGPT · model: gpt-5.6-codex · sandbox: workspace-write'],
        '/approvals': [
          'Approval mode:',
          '  [1] Read-only      — look, suggest, never touch',
          '  [2] Auto (default) — sandboxed edits + commands, escalate outside',
          '  [3] Full access    — no sandbox, no prompts',
          'Select: _',
        ],
        '/model': ['Model options: gpt-5.6-codex · gpt-5.6 · gpt-5.6-mini', '✓ Switched to gpt-5.6-codex'],
        '/init': ['● Scanning project…', '✓ AGENTS.md created (stack: Rust CLI, cargo test).'],
        'codex exec "bump minor version and update CHANGELOG"': [
          '● headless run (sandbox: workspace-write)…',
          '✓ version bumped 0.150.0 → 0.151.0',
          '✓ CHANGELOG.md updated with 3 entries',
        ],
      },
    },
    quiz: [
      {
        q: 'Which approval mode is the sensible first run in an unfamiliar repo?',
        options: ['Full access', 'Auto', 'Read-only', 'No sandbox needed'],
        answer: 2,
        explain: 'Read-only lets you watch the agent propose work before granting any write access.',
      },
      {
        q: 'Codex\'s project memory file is called:',
        options: ['CLAUDE.md', 'AGENTS.md', 'CODEX.md', 'MEMORY.md'],
        answer: 1,
        explain: 'AGENTS.md — same role as CLAUDE.md, and /init generates a first draft.',
      },
      {
        q: 'The non-interactive, scriptable Codex command is:',
        options: ['codex run', 'codex exec', 'codex -p', 'codex headless'],
        answer: 1,
        explain: 'codex exec runs a task with the configured sandbox and no TUI — built for automation.',
      },
    ],
  },
  {
    slug: 'permissions-safety',
    title: 'Permissions & staying safe',
    tool: 'Claude Code',
    level: 'Beginner',
    minutes: 9,
    summary: 'An agent with shell access deserves a guardrail conversation: permission modes, allow/deny rules, and the habits that keep surprises at zero.',
    sections: [
      {
        heading: 'Permission modes — the trust dial',
        body: `<p>Every tool call passes a permission gate. Shift+Tab cycles the mode: <strong>default</strong> (ask before edits and commands), <strong>auto-accept edits</strong> (file edits apply without prompting — commands still ask), and <strong>plan mode</strong> (read-only: it explores and proposes, changes nothing).</p>
<p>The professional habit: start risky work in <strong>plan mode</strong>, read the plan, then accept an execution mode once the plan looks right. Approving a plan costs one keystroke; undoing a bad autonomous refactor costs an afternoon.</p>`,
      },
      {
        heading: 'Allowlists — teach it once, not every time',
        body: `<p>Prompt fatigue is real, so Claude Code lets you pre-approve patterns: when prompted, choose "always allow <code>npm test</code>" and the rule lands in <code>.claude/settings.json</code> under <code>permissions.allow</code>. The mirror exists too: <code>permissions.deny</code> blocks patterns outright — a great home for <code>rm -rf *</code>, production deploy commands, or anything touching <code>.env</code>.</p>
<p>Because the file is committed, guardrails are shared: nobody on the team re-answers the same prompts, and nobody accidentally allows what the team already banned.</p>`,
      },
      {
        heading: 'The habits that keep it safe',
        body: `<ul>
<li><strong>Work in git.</strong> A clean tree turns any bad edit into <code>git checkout .</code>.</li>
<li><strong>Never bypass casually.</strong> Flags exist to skip all permission checks for sandboxed/CI use — on your laptop against your real files is not that place.</li>
<li><strong>Read the command.</strong> The prompt shows the exact command about to run. Two seconds of reading is the whole security model.</li>
</ul>`,
      },
    ],
    sim: {
      hint: 'Simulated permission flow — try approving, then allowlisting.',
      commands: {
        'claude': ['✓ Session started · permission mode: default (ask before edits)'],
        '/permissions': [
          'Permission rules (.claude/settings.json):',
          '  allow:  Bash(npm test), Bash(npm run lint)',
          '  deny:   Bash(rm -rf *), Read(.env*)',
          '  ask:    everything else',
        ],
        'npm test': ['✓ allowed by rule: Bash(npm test)', '● running tests… 41 passed'],
        'rm -rf dist': [
          '⚠ Blocked by deny rule: Bash(rm -rf *)',
          'Claude: understood — `npm run clean` can clear dist/ instead.',
        ],
        'git commit -m "wip"': ['Ask: run git commit? [y/N/e]', '✓ approved · committed "wip"'],
      },
    },
    quiz: [
      {
        q: 'You want Claude to propose an approach before touching any file. Which mode?',
        options: ['auto-accept edits', 'plan mode', 'default mode', 'full access'],
        answer: 1,
        explain: 'Plan mode is read-only: it explores the repo and proposes work without changing anything.',
      },
      {
        q: 'Where do shared, committed permission rules live?',
        options: ['~/.bashrc', 'CLAUDE.md', '.claude/settings.json', 'package.json'],
        answer: 2,
        explain: 'permissions.allow / permissions.deny in .claude/settings.json — versioned with the repo.',
      },
      {
        q: 'The single habit that makes agent mistakes cheapest to undo:',
        options: ['Reading every file after', 'Working in git with a clean tree', 'Using plan mode forever', 'Disabling permissions'],
        answer: 1,
        explain: 'Git turns a bad autonomous change into a one-command revert.',
      },
    ],
  },
  {
    slug: 'skills',
    title: 'Skills: teach it your playbooks',
    tool: 'Claude Code',
    level: 'Intermediate',
    minutes: 11,
    summary: "Package reusable expertise into SKILL.md folders that Claude loads exactly when relevant — your team's best practices, on tap.",
    sections: [
      {
        heading: 'What a skill is',
        body: `<p>A <strong>skill</strong> is a folder with a <code>SKILL.md</code> file: frontmatter (name + description) plus instructions, and optionally supporting scripts or templates. Skills live in <code>~/.claude/skills/</code> (personal) or <code>.claude/skills/</code> (project, committed and shared).</p>
<p>The design idea is <em>progressive disclosure</em>: Claude always sees only the skill's name and description (a few tokens each), and reads the full SKILL.md only when your request actually matches. You can install a library of skills without bloating every prompt.</p>`,
      },
      {
        heading: 'When a skill beats a slash command',
        body: `<p>Slash commands are for <em>invocations</em> — you decide when they run (<code>/review</code>). Skills are for <em>knowledge</em> — Claude decides when they apply. If the value is "whenever we touch X, follow these rules," that's a skill. If it's "when I say so, do this," that's a command.</p>
<p>Good first skills: your release checklist, the house style for API errors, "how we write database migrations," a deploy runbook. Anything a new hire would need explained twice.</p>`,
      },
      {
        heading: 'Anatomy of a good SKILL.md',
        body: `<pre><code>---
name: release-checklist
description: Run before cutting any release — versioning, notes, smoke tests.
---
1. Bump version in package.json (semver, no skips)
2. Update CHANGELOG.md from merged PRs
3. pnpm test &amp;&amp; pnpm build must pass clean
4. Tag vX.Y.Z and push with the tag</code></pre>
<p>The <code>description</code> is the trigger — write it like a search query Claude should match ("before release", "cut a version"). Instructions stay imperative and short; drop in the exact commands so nothing is improvised.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated session with skills installed.',
      commands: {
        'cut a release for the dashboard': [
          '● skill matched: release-checklist',
          '● Bumping version 2.1.0 → 2.2.0 in package.json',
          '● Regenerating CHANGELOG.md from 7 merged PRs',
          '● pnpm test ✓ · pnpm build ✓',
          'Ready to tag v2.2.0 — approve?',
        ],
        '/skills': [
          'Installed skills:',
          '  release-checklist  (project)  — run before cutting any release',
          '  api-error-style    (personal) — house style for API error responses',
          '  migration-rules    (project)  — how we write DB migrations',
        ],
        'write a new API endpoint': [
          '● skill matched: api-error-style',
          '● Drafting endpoint with { error, code, message } envelope per house style',
        ],
      },
    },
    quiz: [
      {
        q: "When does a skill's full SKILL.md get loaded?",
        options: ['Every prompt', 'Only when the request matches its description', 'On /skills', 'Never — you open it manually'],
        answer: 1,
        explain: 'Progressive disclosure: descriptions ride along cheaply; the body loads on relevance.',
      },
      {
        q: 'Team-wide skills that ship with the repo live in:',
        options: ['~/.claude/skills/', '.claude/skills/', 'skills.json', 'node_modules/'],
        answer: 1,
        explain: '.claude/skills/ is committed with the project; ~/.claude/skills/ is personal.',
      },
      {
        q: '"Whenever we touch auth code, follow our security checklist" is best implemented as:',
        options: ['A slash command', 'A CLAUDE.md paragraph', 'A skill', 'A git hook'],
        answer: 2,
        explain: "It's contextual knowledge Claude should apply when relevant — the definition of a skill.",
      },
    ],
  },
  {
    slug: 'mcp',
    title: "MCP: plug in the world's tools",
    tool: 'Claude Code',
    level: 'Intermediate',
    minutes: 12,
    summary: 'Model Context Protocol turns Claude Code into a client for databases, browsers, issue trackers — any tool with an MCP server.',
    sections: [
      {
        heading: 'The protocol in one paragraph',
        body: `<p><strong>MCP (Model Context Protocol)</strong> is an open standard: servers expose tools, resources and prompts; clients (Claude Code, Claude Desktop, many IDEs) discover and call them. For you it means one sentence: <em>Claude can query Postgres, drive a browser, read Jira — through the same permission system as its built-in tools.</em></p>
<p>Add servers via <code>claude mcp add</code> or a committed <code>.mcp.json</code> at the repo root — teammates get the same toolbelt on their next session. Inside a session, <code>/mcp</code> lists servers, their status, and available tools.</p>`,
      },
      {
        heading: 'Transports: stdio and HTTP',
        body: `<p><strong>stdio</strong> servers are local processes — Claude Code spawns them and talks over stdin/stdout. Perfect for tools that run on your machine (filesystem, local DB CLIs, Puppeteer).</p>
<p><strong>HTTP</strong> servers run remotely (yours or a vendor's) and connect by URL — often with OAuth, so the server sees the logged-in user, not your machine. Hosted services (Linear, Sentry, Notion…) typically ship HTTP endpoints.</p>`,
      },
      {
        heading: 'A practical starter set',
        body: `<ul>
<li><strong>github</strong> — open issues, read PRs, create branches without leaving the loop.</li>
<li><strong>postgres / sqlite</strong> — "what does the orders table look like?" becomes a real query, not a guess.</li>
<li><strong>puppeteer / playwright</strong> — Claude opens your app, clicks through the flow it just built, and screenshots the result.</li>
</ul>
<p>Scope deliberately: each server adds tools to every prompt's context. A lean <code>.mcp.json</code> with the three servers you actually use beats fifteen idle ones.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated session with MCP servers connected.',
      commands: {
        '/mcp': [
          'MCP servers:',
          '  ✓ github      (http)   12 tools — issues, PRs, repos',
          '  ✓ postgres    (stdio)   4 tools — read-only SQL',
          '  ✓ puppeteer   (stdio)   7 tools — navigate, click, screenshot',
          '  ✗ linear      (http)   auth expired — /mcp auth linear',
        ],
        'what are the 5 newest orders?': [
          '● mcp__postgres__query: SELECT id, total, created_at FROM orders ORDER BY created_at DESC LIMIT 5',
          '  1. #4821 · $129.00 · 2h ago',
          '  2. #4820 · $64.50 · 5h ago',
          '  … 3 more rows',
        ],
        'open the pricing page and screenshot it': [
          '● mcp__puppeteer__navigate → http://localhost:4321/pricing',
          '● mcp__puppeteer__screenshot → pricing.png (1440×900)',
          '✓ Saved. The pricing table overflows on this viewport — want a fix?',
        ],
        'create an issue for that': [
          '● mcp__github__create_issue',
          '✓ #142 "Pricing table overflows on wide viewports" opened',
        ],
      },
    },
    quiz: [
      {
        q: 'Where does a repo-committed MCP server list live?',
        options: ['.mcp.json', 'mcp.config.js', 'CLAUDE.md', '.github/mcp.yaml'],
        answer: 0,
        explain: '.mcp.json at the repo root shares the server config with the whole team.',
      },
      {
        q: 'A local process server speaking over stdin/stdout uses which transport?',
        options: ['http', 'websocket', 'stdio', 'grpc'],
        answer: 2,
        explain: 'stdio servers run locally; http servers connect by URL (often with OAuth).',
      },
      {
        q: "You connected fifteen MCP servers but use two. The real cost is:",
        options: ['None — unused tools are free', 'Slower npm installs', "Extra tool definitions in every prompt's context", 'Git size'],
        answer: 2,
        explain: 'Every connected tool adds definitions to context. Scope .mcp.json to what you use.',
      },
    ],
  },
  {
    slug: 'subagents',
    title: 'Subagents & agent teams',
    tool: 'Claude Code',
    level: 'Advanced',
    minutes: 12,
    summary: 'Delegate parallel work to specialized sub-agents with their own prompts, tools and context — and coordinate the results.',
    sections: [
      {
        heading: 'Why subagents exist',
        body: `<p>A single long session accumulates context: every file read and command output stays in the transcript. A <strong>subagent</strong> is a fresh, isolated context with its own system prompt and tool access, dispatched by the main session for one job — "investigate the flaky test," "scan for TODOs," "review this diff." It burns its own tokens, then returns a summary.</p>
<p>The win is twofold: the main thread stays lean (only conclusions return), and independent jobs can run in <strong>parallel</strong>. Claude does this automatically for natural sub-tasks; you can also invoke agents explicitly with the Agent tool.</p>`,
      },
      {
        heading: 'Defining your own agents',
        body: `<p><code>/agents</code> opens the manager; agents are markdown files with frontmatter in <code>.claude/agents/</code>:</p>
<pre><code>---
name: test-runner
description: Runs the test suite and triages failures. Use when tests break.
tools: [Bash, Read, Grep]
---
You triage failing tests. Reproduce first, then identify the minimal
root cause. Never edit application code — report findings only.</code></pre>
<p>The <code>description</code> is how the main agent knows when to delegate; <code>tools</code> constrains what the subagent may do. A read-only "investigator" and a full-access "implementer" are a classic pair.</p>`,
      },
      {
        heading: 'Agent teams',
        body: `<p>For bigger jobs, agents can coordinate as a <strong>team</strong>: a lead breaks work into a shared task list, teammates claim tasks and message each other when done. It's the shift from "one assistant with a todo list" to "a stand-up meeting that executes itself" — powerful for parallelizable work like migrating many files, and worth running with a clean git tree and close supervision the first few times.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated session delegating to subagents.',
      commands: {
        '/agents': [
          'Configured agents (.claude/agents/):',
          '  investigator  — read-only triage · tools: Bash, Read, Grep',
          '  implementer   — full edit access · tools: all',
        ],
        '3 tests are failing — find the root cause': [
          '● Dispatching subagent: investigator (read-only)',
          '● investigator: reproduced 3/3 · common factor: Date.now() in cache key',
          'Summary: midnight UTC rollover invalidates cache keys — one-line fix in cache.ts:41.',
        ],
        'fix it and run the suite': [
          '● Dispatching subagent: implementer',
          '● implementer: cache.ts:41 → date-keyed bucket id',
          '✓ 41/41 tests pass · diff ready for review (1 file, +2 −1)',
        ],
      },
    },
    quiz: [
      {
        q: 'The main benefit of delegating to a subagent (vs doing it in-session):',
        options: ['It is smarter', 'Isolated context — only conclusions return to the main thread', 'It skips permissions', 'It works offline'],
        answer: 1,
        explain: 'Subagent transcripts stay isolated; the parent receives a summary, keeping its own context lean.',
      },
      {
        q: 'A read-only triage agent should declare:',
        options: ['tools: all', 'tools: [Bash, Read, Grep] plus no Edit/Write', 'no frontmatter', 'unlimited retries'],
        answer: 1,
        explain: 'Constraining tools encodes "investigate, don\'t modify" at the harness level.',
      },
      {
        q: 'The description field in an agent file exists so that:',
        options: ['Users can browse it', 'The main agent knows when delegation is appropriate', 'Git history is readable', 'VS Code shows a tooltip'],
        answer: 1,
        explain: 'Descriptions are the routing signal the parent uses to pick and dispatch agents.',
      },
    ],
  },
  {
    slug: 'plugins',
    title: 'Plugins & marketplaces',
    tool: 'Claude Code',
    level: 'Intermediate',
    minutes: 8,
    summary: 'Bundle commands, agents, skills, hooks and MCP servers into one installable unit — and share your toolkit the way you share npm packages.',
    sections: [
      {
        heading: 'The problem plugins solve',
        body: `<p>After a month you accumulate: four custom commands, two agents, a skill, a formatting hook, an MCP server. Handing that to a teammate means a copy-paste tour of six directories. A <strong>plugin</strong> bundles all of it under one name with one install.</p>
<p>Install from a marketplace with <code>/plugin</code>: browse, install, enable/disable per project. Under the hood it's still the primitives you know — the plugin just ships the files for you.</p>`,
      },
      {
        heading: 'Marketplaces',
        body: `<p>A marketplace is just a git repository with a manifest listing plugins. Add one with <code>/plugin marketplace add owner/repo</code>, then install from it. Teams keep a private marketplace repo with their internal tooling; public ones already exist for common stacks.</p>
<p>Anatomy of a plugin directory: <code>commands/</code>, <code>agents/</code>, <code>skills/</code>, <code>hooks/</code>, <code>.mcp.json</code> — every folder is optional. If you've followed the earlier lessons, you already know how to build every piece.</p>`,
      },
      {
        heading: 'When to reach for one',
        body: `<p>Solo and staying solo? Files in <code>.claude/</code> are simpler — skip plugins. Sharing across repos or teams, or wanting enable/disable per project? That's the plugin moment. Rule of thumb: <em>commands you'd have to re-explain are plugins; config you'd have to re-type are settings.</em></p>`,
      },
    ],
    sim: {
      hint: 'Simulated plugin workflow.',
      commands: {
        '/plugin': [
          'Plugin manager:',
          '  marketplaces: team-tools (github.com/acme/team-tools)',
          '  installed:    pr-reviewer ✓ enabled · deploy-kit ⏸ disabled',
          '  browse:       /plugin install <name>',
        ],
        '/plugin install pr-reviewer': [
          '● Resolving acme/team-tools → pr-reviewer@1.4.0',
          '✓ Installed: 3 commands (/review, /approve, /pr-comments), 1 agent, 1 hook',
        ],
        '/review': ['● pr-reviewer plugin → /review', '⚠ auth.js:23 SQL concatenation · db.js:88 N+1', '✓ 2 findings'],
        '/plugin disable deploy-kit': ['✓ deploy-kit disabled in this project (files kept, tools unloaded)'],
      },
    },
    quiz: [
      {
        q: 'A plugin can bundle:',
        options: ['Only slash commands', 'Commands, agents, skills, hooks and MCP servers', 'Only MCP servers', 'Only CLAUDE.md files'],
        answer: 1,
        explain: 'Plugins package every Claude Code extension primitive under one installable name.',
      },
      {
        q: 'A marketplace is:',
        options: ['A paid app store', 'A git repo with a plugin manifest', 'An npm registry mirror', 'A built-in catalog only'],
        answer: 1,
        explain: 'Add any git repo as a marketplace with /plugin marketplace add owner/repo — private team repos work great.',
      },
      {
        q: 'The leanest correct setup for a solo dev on one repo:',
        options: ['Always build plugins', 'Plain .claude/ files, no plugin layer', 'Marketplace for everything', 'Disable plugins globally'],
        answer: 1,
        explain: 'Plugins earn their keep when sharing across projects or people; for one repo, plain files are simpler.',
      },
    ],
  },
  {
    slug: 'git-workflows',
    title: 'Claude Code × Git',
    tool: 'Claude Code',
    level: 'Intermediate',
    minutes: 10,
    summary: 'Commits, PRs, worktrees and code review — the workflows where an agent with repo access pays for itself daily.',
    sections: [
      {
        heading: 'Commits and PRs without the chore',
        body: `<p>"commit this" is the most-used Claude Code phrase for a reason: it diffs the tree, writes a conventional message from the actual changes, and commits. Same for PRs — describe the change and it drafts title, body, and test notes via <code>gh</code>.</p>
<p>The force multiplier is history awareness: ask "why does function X exist?" and it reads the blame and commit messages. Ask it to find which release broke something and it walks tags and diffs for you.</p>`,
      },
      {
        heading: 'Worktrees — parallel Claudes, zero conflicts',
        body: `<p>Two agent sessions in one checkout fight over the same files. <strong>Git worktrees</strong> fix that: <code>git worktree add ../feat-a -b feat-a</code> gives branch <code>feat-a</code> its own directory. Run one Claude per worktree — refactor in one, hotfix in the other, merge both.</p>
<p>Keep a rule: one session, one worktree, one branch. It's the cheapest concurrency model there is, and it needs no sync infrastructure.</p>`,
      },
      {
        heading: 'Review on both sides of the diff',
        body: `<p>Before pushing: "review my diff like a harsh senior" — expect real findings, not praise. After pushing: the <code>claude-code-action</code> reviews incoming PRs on GitHub, and /mcp GitHub tools let your local session read review comments and fix them. The pattern that sticks: <strong>agent writes, agent self-reviews, human reviews the result.</strong></p>`,
      },
    ],
    sim: {
      hint: 'Simulated git session.',
      commands: {
        'commit this': [
          '● Diffing 3 files (+84 −12)…',
          'Suggested: feat(pagination): clamp offset, add page-0 regression test',
          '✓ committed',
        ],
        'open a pr': [
          '● gh pr create --fill',
          'Title: feat(pagination): clamp offset, add regression test',
          'Body: ## What · ## Why · ## Tests',
          '✓ https://github.com/acme/app/pull/143',
        ],
        'git worktree add ../hotfix-121 -b hotfix/121': [
          '✓ worktree ../hotfix-121 on branch hotfix/121',
          'Tip: cd ../hotfix-121 && claude — parallel session, zero file conflicts',
        ],
        'why does normalizePhone exist?': [
          '● git log -S normalizePhone --oneline → a41f2c9 (Mar)',
          'It normalizes E.164 for the Twilio sync added in a41f2c9; without it the API rejects +1-prefixed numbers.',
        ],
      },
    },
    quiz: [
      {
        q: 'Two Claude sessions must edit the same repo simultaneously. The clean answer:',
        options: ['Same directory, take turns', 'git worktrees — one branch per directory', 'One session, two prompts', 'Copy the repo twice'],
        answer: 1,
        explain: 'Worktrees give each session an isolated checkout and branch; merges stay ordinary git.',
      },
      {
        q: '"commit this" produces a good message because Claude:',
        options: ['Asks you for keywords', 'Reads the actual diff and recent history', 'Uses the last message', 'Picks a random convention'],
        answer: 1,
        explain: 'Messages are derived from the real change plus repo conventions — review before accepting.',
      },
      {
        q: 'Which sequence uses the agent most safely on a tricky change?',
        options: ['Edit → commit → push → pray', 'Plan mode → implement → agent self-review → human review', 'Full access, review later', 'Skip review — it tested it'],
        answer: 1,
        explain: 'Read-only plan, then implementation, then a fresh-eyes review pass — human judgement stays in the loop.',
      },
    ],
  },
  {
    slug: 'context-management',
    title: 'Context: the invisible budget',
    tool: 'Claude Code',
    level: 'Beginner',
    minutes: 8,
    summary: 'Why long sessions get slow and expensive — and the three commands plus one habit that keep context lean.',
    sections: [
      {
        heading: 'What fills the tank',
        body: `<p>Every prompt ships the whole conversation: system rules, CLAUDE.md, tool definitions, every file you read, every command output. A 200-line file read "to check something" rides along with <em>every subsequent message</em>. Long sessions don't just cost more — quality degrades as relevant details get crowded out.</p>
<p>Run <code>/context</code> to see the current breakdown. The usual suspects: giant file dumps, verbose tool outputs, and a session that has survived three unrelated tasks.</p>`,
      },
      {
        heading: 'The three commands',
        body: `<ul>
<li><strong>/compact</strong> — summarize the session and drop the raw history. Use when context grows but the task continues.</li>
<li><strong>/clear</strong> — wipe everything for a fresh start. Use when switching tasks; stale context is worse than no context.</li>
<li><strong>/context</strong> — inspect what's occupying the window; the fuel gauge.</li>
</ul>
<p>Related: CLAUDE.md loads every single prompt, so every line you delete from it is a line saved thousands of times. Keep memory files ruthlessly curated.</p>`,
      },
      {
        heading: 'The habit: one task, one session',
        body: `<p>The pros don't manage context heroically — they avoid the problem. One bug = one session = one commit. Need the fix summarized for a PR? Ask first, then <code>/clear</code>. New task tomorrow? Fresh session, fresh context, CLAUDE.md carries the project knowledge so nothing important is lost.</p>
<p>Subagents extend the same idea: heavy exploration happens in isolated contexts whose summaries come back, while the raw reading never enters your main thread.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated context meters — watch the numbers move.',
      commands: {
        '/context': [
          'Context window usage: 61k / 200k tokens',
          '  system + tools        12k',
          '  CLAUDE.md              1.8k',
          '  conversation + files  47k  ← 3 large file reads',
        ],
        '/compact': ['● Compacting… 61k → 14k tokens. Task summary retained.'],
        '/clear': ['✓ History cleared. Context: 3.1k tokens (system + CLAUDE.md only).'],
      },
    },
    quiz: [
      {
        q: 'Switching from the pagination bug to a new feature. Best move:',
        options: ['/compact and continue', 'Keep going — context is free', '/clear and start fresh', 'Open a second terminal in the same directory'],
        answer: 2,
        explain: 'Unrelated stale context actively hurts; /clear plus a fresh session is the clean cut. (/compact is for continuing the SAME task.)',
      },
      {
        q: 'Which file is worth the most editing scrutiny because it loads every prompt?',
        options: ['README.md', 'CLAUDE.md', 'package-lock.json', '.gitignore'],
        answer: 1,
        explain: 'CLAUDE.md is paid for on every message — terse and high-signal wins.',
      },
      {
        q: 'The command that shows what currently occupies the context window:',
        options: ['/cost', '/status', '/context', '/usage'],
        answer: 2,
        explain: '/context breaks down window usage; /cost shows money spent.',
      },
    ],
  },
  {
    slug: 'ci-cd',
    title: 'Claude Code in CI/CD',
    tool: 'Claude Code',
    level: 'Advanced',
    minutes: 11,
    summary: 'From terminal to pipeline: the GitHub Action, headless runs, and the rules that make unattended agents trustworthy.',
    sections: [
      {
        heading: 'The official GitHub Action',
        body: `<p><code>claude-code-action</code> brings the same agent to Pull Requests and issues: mention <code>@claude</code> in a comment and it can answer questions, review diffs, fix flagged issues and push commits — with an allowlist of what it may touch. Setup is one workflow file plus API credentials.</p>
<p>The killer workflows: <strong>triage</strong> (new issue → labelled, summarized, duplicates flagged) and <strong>review-and-fix</strong> (CI fails on a PR → agent reads the failure, pushes a fix, explains the root cause).</p>`,
      },
      {
        heading: 'Headless runs as build steps',
        body: `<p>Anything you can phrase as text-in → text-out can be a pipeline step with <code>claude -p</code>:</p>
<pre><code>- run: claude -p "summarize this diff for release notes" &lt; diff.txt &gt;&gt; notes.md
  env: { ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }} }</code></pre>
<p>Deterministic wrappers matter: the agent drafts, your scripts validate (tests, linters, type checks run as separate steps — never trust "it looks right").</p>`,
      },
      {
        heading: 'Rules for unattended agents',
        body: `<ul>
<li><strong>Least privilege</strong> — a CI agent gets the repo and nothing else: no cloud keys, no prod access. Permission allowlists work headless too.</li>
<li><strong>Bounded scope</strong> — "fix this failing test," never "improve the codebase."</li>
<li><strong>Human merge</strong> — the agent pushes to a branch; a human (or required reviews) merges.</li>
<li><strong>Budget guardrails</strong> — cap runtime and spend per run so a confused loop costs minutes, not a weekend.</li>
</ul>`,
      },
    ],
    sim: {
      hint: 'Simulated CI run with @claude on a PR.',
      commands: {
        '@claude why is CI red?': [
          '● claude-code-action on PR #143',
          '● Reading failed job: test (node 22) — pagination.spec.ts:17',
          'Diagnosis: test asserts page 1-indexed, code is 0-indexed after the clamp fix.',
          '● Pushing fix to branch: 1 commit',
          '✓ "test: align pagination spec with 0-indexed pages" — CI green',
        ],
        'claude -p "release notes from these PRs" < prs.md': [
          '## 2.2.0',
          '- clamp pagination offset (fixes #142)',
          '- test: align pagination spec',
        ],
        'deny rules in CI settings': [
          'permissions.deny: [Bash(git push --force), Bash(npm publish)]',
          '✓ unattended runs cannot force-push or publish',
        ],
      },
    },
    quiz: [
      {
        q: 'What triggers claude-code-action in the standard setup?',
        options: ['Every commit', 'Mentioning @claude in an issue or PR', 'A cron schedule only', 'Failed builds only'],
        answer: 1,
        explain: 'The action listens for mentions; you converse with the agent right in the PR thread.',
      },
      {
        q: 'The safest CI setup for an agent that fixes failing tests:',
        options: ['Full access + auto-merge', 'Scoped branch pushes + human merge + deny rules', 'No permissions — describe fixes in comments', 'Run it locally instead'],
        answer: 1,
        explain: 'Least privilege with a human merge keeps untrusted automation contained.',
      },
      {
        q: 'Agent-edited code in a pipeline should be gated by:',
        options: ['Agent self-report', 'Your existing tests/linters as separate steps', 'Nothing — it is usually right', 'A second agent approval'],
        answer: 1,
        explain: 'Deterministic checks validate agent output; agents draft, pipelines verify.',
      },
    ],
  },
  {
    slug: 'codex-automation',
    title: 'Codex: exec, config & automation',
    tool: 'Codex',
    level: 'Intermediate',
    minutes: 10,
    summary: 'The Codex power layer: config.toml, non-interactive exec, MCP support, and where it differs from Claude Code.',
    sections: [
      {
        heading: "config.toml — the memory file's sibling",
        body: `<p>Codex keeps preferences in <code>~/.codex/config.toml</code>: default model, approval policy, sandbox mode, and per-project profile overrides. Where Claude Code spreads settings across <code>.claude/</code> JSON files, Codex concentrates them in one TOML — check a project-level config into the repo for shared behavior.</p>
<p>Run <code>codex --profile</code> to switch presets: a paranoid read-only profile for unfamiliar repos, a workspace-write profile for your own.</p>`,
      },
      {
        heading: 'exec — the scriptable mode',
        body: `<p><code>codex exec "task"</code> runs headless under the configured sandbox — the CI-friendly primitive. Combine with <code>--sandbox read-only</code> for analysis jobs or <code>workspace-write</code> for fix jobs, and pipe output onward:</p>
<pre><code>codex exec --sandbox read-only "summarize the failing CI log" &lt; ci.log</code></pre>
<p>Same rule as Claude Code's <code>-p</code>: the agent drafts, deterministic checks verify.</p>`,
      },
      {
        heading: 'MCP and the differences that matter',
        body: `<p>Codex speaks MCP too — servers configured in its config file extend it with the same tool ecosystem. Choosing between the two CLIs is now a preference, not a capability gap; both ship roughly weekly (tracked on our <a href="/changelog">changelog page</a>).</p>
<p>Practical differences: Codex is <strong>open source</strong> (Rust core — read the source, file issues), historically stronger in <strong>sandbox ergonomics</strong> (explicit read-only/workspace-write/full-access dials), while Claude Code leans on <strong>hooks/skills/plugins</strong> for extensibility. Teams run both; the AGENTS.md file format works across them.</p>`,
      },
    ],
    sim: {
      hint: 'Simulated Codex automation session.',
      commands: {
        'cat ~/.codex/config.toml': [
          'model = "gpt-5.6-codex"',
          'approval_policy = "on-request"',
          'sandbox = "workspace-write"',
          '',
          '[profiles.readonly]',
          'sandbox = "read-only"',
        ],
        'codex --profile readonly exec "audit auth.js for injection risks"': [
          '● headless · sandbox: read-only',
          '⚠ auth.js:23 — string-concatenated SQL (parameterize it)',
          '✓ report complete (no files touched)',
        ],
        'codex exec "add parameterized query to auth.js" --sandbox workspace-write': [
          '● patching auth.js:23 → prepared statement',
          '✓ done · diff: +3 −2 · tests not run (run them yourself)',
        ],
      },
    },
    quiz: [
      {
        q: "Codex's centralized settings file is:",
        options: ['settings.json', 'config.toml', 'codex.yaml', 'AGENTS.toml'],
        answer: 1,
        explain: '~/.codex/config.toml holds model, approval policy, sandbox and profiles.',
      },
      {
        q: 'An audit job must not modify files. The right invocation:',
        options: ['codex exec --sandbox read-only', 'codex --full-access', 'codex exec --ask', 'codex tui'],
        answer: 0,
        explain: 'read-only sandbox guarantees analysis without writes.',
      },
      {
        q: 'Which project-memory format do BOTH CLIs read?',
        options: ['CLAUDE.md only', 'AGENTS.md', 'MEMORY.md', 'README.md'],
        answer: 1,
        explain: 'AGENTS.md is the cross-tool convention (Codex /init generates it; Claude Code also reads it).',
      },
    ],
  },
];

export const bySlug = Object.fromEntries(modules.map((m) => [m.slug, m]));
