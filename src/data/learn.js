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
];

export const bySlug = Object.fromEntries(modules.map((m) => [m.slug, m]));
