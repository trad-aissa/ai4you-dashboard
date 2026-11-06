---
title: "Claude Code vs Codex CLI: which AI coding agent should you use?"
seoTitle: "Claude Code vs Codex CLI (2026): Which Should You Use?"
description: "Claude Code vs OpenAI Codex CLI compared: install, permissions, MCP, hooks, CI and pricing, with a clear verdict on which coding agent fits you."
dek: "Both read your repo, edit files and run commands from the terminal. They differ on safety controls, licensing and what your existing subscription already covers. Here's how to choose."
date: 2026-11-06
kicker: "Compared · coding agents"
cardTitle: "Claude Code vs Codex CLI"
cardTag: "Compared · coding agents"
draft: true
---

**The short answer.** If you already pay for ChatGPT, start with Codex CLI: it's included from the $20 Plus plan, it's open source, and every command runs in a sandbox by default. If you already pay for Claude, or you want the most ways to control what an agent may do, start with Claude Code: it's included from the $20 Pro plan and offers six permission modes, hooks, skills, subagents and plugins, and it runs in the terminal, IDEs, a desktop app and the browser. At the entry price the two cost the same, so the subscription you already have is a fair tiebreaker.

The longer answer depends on how you work. Below, each claim links to the vendor's own documentation, checked on November 6, 2026. Both tools ship new releases most days, so for what changed this week, see our [changelog tracker](/changelog).

## At a glance

<table>
<thead>
<tr><th></th><th>Claude Code</th><th>Codex CLI</th></tr>
</thead>
<tbody>
<tr><td>Made by</td><td>Anthropic</td><td>OpenAI</td></tr>
<tr><td>Licence</td><td>Proprietary (<a href="https://github.com/anthropics/claude-code">"All rights reserved"</a>)</td><td>Open source, <a href="https://github.com/openai/codex">Apache-2.0</a>, written mostly in Rust</td></tr>
<tr><td>Cheapest plan that includes it</td><td><a href="https://claude.com/pricing">Claude Pro</a>, $20/month ($17 billed annually)</td><td><a href="https://learn.chatgpt.com/docs/pricing">ChatGPT Plus</a>, $20/month</td></tr>
<tr><td>Pay-per-use option</td><td>Claude Console API key</td><td>OpenAI API key (no cloud features)</td></tr>
<tr><td>Where it runs</td><td>Terminal, VS Code &amp; Cursor, JetBrains, desktop app, web</td><td>Terminal, VS Code-compatible editors, Xcode &amp; JetBrains integrations, desktop app, web, iOS</td></tr>
<tr><td>Project instructions file</td><td><code>CLAUDE.md</code> (can read <code>AGENTS.md</code>)</td><td><code>AGENTS.md</code></td></tr>
<tr><td>Safety model</td><td>Permission modes + allow/ask/deny rules, optional OS sandbox</td><td>OS sandbox by default + approval policy</td></tr>
<tr><td>Scripting</td><td><code>claude -p</code></td><td><code>codex exec</code></td></tr>
<tr><td>Official GitHub Action</td><td><code>anthropics/claude-code-action</code></td><td><code>openai/codex-action</code></td></tr>
<tr><td>Extensibility</td><td>MCP, hooks, skills, subagents, plugins</td><td>MCP, hooks, skills, subagents, plugins</td></tr>
</tbody>
</table>

## Setup: both take one command

Claude Code's [recommended install](https://code.claude.com/docs/en/overview) is a native installer, `curl -fsSL https://claude.ai/install.sh | bash` on macOS, Linux and WSL, with PowerShell and CMD equivalents on Windows. Homebrew and WinGet work too. Native installs update themselves in the background, while Homebrew and WinGet installs need a manual upgrade. Run `claude` in a project folder and it asks you to log in with a Claude subscription or an Anthropic Console account.

Codex CLI installs the same way, with `curl -fsSL https://chatgpt.com/codex/install.sh | sh`. The [repository README](https://github.com/openai/codex) also lists `npm install -g @openai/codex`, `brew install --cask codex` and a PowerShell one-liner. You sign in with a ChatGPT account on Plus, Pro, Business, Edu or Enterprise, or with an API key.

Both lessons walk through a first session in a browser simulator: [Claude Code from zero](/learn/claude-code-101) and [Codex CLI from zero](/learn/codex-cli-101).

## Daily workflow

Day to day, the loop is the same: describe a task, the agent reads the code, proposes or makes edits, runs commands, and you review the diff. The differences are in what surrounds that loop.

**Claude Code runs in more places.** The same engine runs in the terminal, the [VS Code and Cursor extension](https://code.claude.com/docs/en/overview), a JetBrains plugin, a desktop app and the web at claude.ai/code. Your `CLAUDE.md`, settings and MCP servers carry across all of them. You can start a task in the cloud and pull it into your terminal with `claude --teleport`, or schedule recurring tasks that run when your laptop is off.

**Codex keeps everything in one ChatGPT account.** The [CLI page](https://learn.chatgpt.com/docs/codex/cli) lists the terminal, an [IDE extension](https://learn.chatgpt.com/docs/codex/ide) for VS Code, Cursor and Windsurf (Xcode and JetBrains have their own integrations), and Codex Cloud for tasks that run in parallel in cloud environments. Built-in code review checks uncommitted changes, a commit or a branch against its base.

**Project memory.** Claude Code reads a [`CLAUDE.md`](https://code.claude.com/docs/en/overview) at the start of every session. If your repository already has an `AGENTS.md`, it can read that instead. Codex reads [`AGENTS.md`](https://learn.chatgpt.com/docs/agent-configuration/agents-md) files from `~/.codex/` and then from each directory between the Git root and your working directory. The file closest to where you are wins. `/init` in Codex writes a starter file for you. If you use both tools, one `AGENTS.md` can serve both. More in our lesson on [teaching an agent your project](/learn/claude-md-memory).

## Safety and permissions: the real difference

This is where the two tools take opposite approaches, and it's the section worth reading twice.

**Codex sandboxes first.** By default, commands run inside an [OS-level sandbox](https://learn.chatgpt.com/docs/sandboxing): Seatbelt on macOS, bubblewrap on Linux and WSL2, and a native sandbox on Windows. There are three sandbox modes:

- `read-only`: look, don't touch
- `workspace-write`: edit and run routine commands inside the project, which the docs call "the default low-friction mode for local work"
- `danger-full-access`: no filesystem or network boundary

An approval policy, `on-request` or `never`, decides whether Codex stops to ask before it steps outside that boundary. You can also send eligible approval prompts to a reviewer agent instead of yourself. Change all of this mid-session with `/permissions`.

**Claude Code asks first.** Its [permission system](https://code.claude.com/docs/en/permissions) has six modes:

- `default`: shown as Manual; asks the first time each tool is used
- `acceptEdits`: auto-accepts file edits and common filesystem commands
- `plan`: explores read-only and doesn't edit your source files
- `auto`: a background classifier checks each action against your request before it runs
- `dontAsk`: denies anything that would otherwise prompt
- `bypassPermissions`: skips prompts, except for actions no mode auto-approves

On top of the modes are allow, ask and deny rules for individual commands, file paths and domains, which you can commit to the repo for the whole team. An optional [sandbox](https://code.claude.com/docs/en/sandboxing) adds OS-level filesystem and network limits for shell commands.

The trade-off: Codex gives you a hard boundary with almost no setup. Claude Code gives you finer control, with more settings to understand. Our [permissions and safety lesson](/learn/permissions-safety) covers how to set either one up sensibly.

## Automation and CI

Both tools have a scripting mode built for pipelines.

`claude -p "task"` runs [Claude Code non-interactively](https://code.claude.com/docs/en/headless). It can return `json` or `stream-json`, and `--json-schema` makes it return structured output. `--allowedTools` or `--permission-mode` decide what it may do without asking. The docs recommend `--bare` for CI, so a run skips local hooks, plugins and `CLAUDE.md` and behaves the same on every machine. For GitHub, the [`claude-code-action`](https://code.claude.com/docs/en/github-actions) answers `@claude` mentions in issues and pull requests, or runs a fixed prompt on any event, including a schedule. Running `/install-github-app` sets it up. GitLab CI/CD is supported too.

`codex exec "task"` runs [Codex non-interactively](https://learn.chatgpt.com/docs/non-interactive-mode). By default it uses a read-only sandbox, so it can't write until you pass `--sandbox workspace-write`. `--json` streams events as JSON Lines, `--output-schema` enforces a schema on the final answer, and `codex exec resume --last` continues the previous run. For GitHub, OpenAI's docs point you to [`openai/codex-action`](https://github.com/openai/codex-action) rather than installing the CLI yourself.

Codex's read-only default is the safer starting point for unattended jobs. Claude Code's GitHub Action is the more complete package if you want an agent that answers in pull requests. Patterns for both are in [Claude Code in CI/CD](/learn/ci-cd) and [Codex: exec, config & automation](/learn/codex-automation).

## Extensibility

On paper, the feature lists now mostly match.

- **MCP.** Both connect to Model Context Protocol servers. Claude Code uses [`claude mcp add`](https://code.claude.com/docs/en/mcp) with local, project (`.mcp.json`) or user scope. Codex uses [`codex mcp add`](https://learn.chatgpt.com/docs/extend/mcp?surface=cli), with servers in `~/.codex/config.toml` or a trusted project's `.codex/config.toml`. Both support local stdio servers and remote HTTP servers. Start with our [MCP lesson](/learn/mcp).
- **Hooks.** Claude Code [hooks](https://code.claude.com/docs/en/hooks) run shell commands before or after its actions, for example formatting after every edit. Codex [hooks](https://learn.chatgpt.com/docs/hooks) are on by default and cover events such as `PreToolUse`, `PostToolUse`, `PermissionRequest` and `Stop`. You review and trust them with `/hooks`.
- **Subagents.** Claude Code can [run several agents in parallel](https://code.claude.com/docs/en/sub-agents), with a lead agent coordinating. Codex [subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) are also on by default. They're defined as TOML files in `.codex/agents/`, and `worker` and `explorer` are built in.
- **Skills and plugins.** Both package reusable workflows as skills, and both bundle commands, hooks and servers into installable plugins. See [Skills](/learn/skills) and [Plugins & marketplaces](/learn/plugins).

## Pricing

Both are included in the paid chat plans you may already have, with usage limits that grow with the plan. On Claude plans, Claude Code [shares one usage pool](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan) with your chats.

**Claude Code** ([pricing](https://claude.com/pricing), [plan details](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)):
- **Pro:** $20/month, or $17/month billed annually
- **Max:** $100/month
- **Ultra:** $200/month
- **Team:** $25 per seat per month, or $20 billed annually
- Not included on the Free plan. With a Console API key you pay per token instead.

**Codex** ([pricing](https://learn.chatgpt.com/docs/pricing)):
- **Plus:** $20/month; includes the CLI, IDE extension, web and iOS
- **Pro:** from $100/month, with tiers at $100, $200 and $500
- **Business:** $20 per user per month billed annually, or $25 monthly
- Free and Go list Codex only in the desktop app. An API key gives usage-based billing for the CLI and IDE, without cloud features.

OpenAI doesn't publish fixed Codex limits; it points you to your usage dashboard instead.

## Which should you pick?

**Pick Codex CLI if:**
- you already pay for ChatGPT, so it costs you nothing extra to try;
- you want an open-source tool you can read, audit or fork;
- you want an OS sandbox on every command without configuring anything;
- you run unattended jobs and want them read-only unless you say otherwise.

**Pick Claude Code if:**
- you already pay for Claude;
- you want detailed, team-shared rules for exactly what the agent may run;
- you want the same sessions across terminal, IDE, desktop, web and phone;
- you want an agent that answers `@claude` in your pull requests with little setup.

**Or use both.** Both are $20 a month at the entry level and both read `AGENTS.md`, so running both on the same repo is a cheap experiment. Give each the same real task for a week, and keep the one whose diffs you merge without rewriting.

Before you commit, try both for free in our [browser playground](/learn/playground). It runs the commands from every lesson, and nothing touches your machine.
