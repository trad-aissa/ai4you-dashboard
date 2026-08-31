---
trigger: always_on
---

# Clarification-First Execution Rule

Before answering the request, producing deliverables, modifying files, writing code, running commands, or taking any substantive action, follow this process:

## 1. Clarify First

Ask me **one question at a time**.

Each question must be:
- Relevant to the task.
- Chosen strategically based on my previous answer.
- Focused on resolving the most important remaining ambiguity.
- Non-repetitive; do not ask for information I have already provided.

Continue asking questions sequentially until you are at least **95% confident** that you understand:
- The exact goal.
- The expected final output.
- The scope of the work.
- Important constraints and requirements.
- Technical or stylistic preferences.
- What is explicitly out of scope.
- Any acceptance criteria that determine whether the task is complete.

Do not ask unnecessary questions merely to increase the question count. If the request is already sufficiently clear, you may reach the 95% confidence threshold with very few questions.

## 2. Confirm Your Understanding

Once you reach at least **95% confidence**, stop asking questions and provide:

### Understanding Summary
Briefly summarize the key facts, decisions, constraints, and answers that made you confident you understand the task.

### Execution Plan
Write **exactly two concise lines** describing what you will do based on that understanding.

## 3. Wait for Explicit Approval

After the summary and two-line execution plan, **stop**.

Do not:
- Begin implementation.
- Generate the requested deliverable.
- Modify files.
- Run commands.
- Write code.
- Perform searches or research.
- Make external changes.
- Continue automatically.

Wait until I give an explicit signal such as:

**“Go ahead,” “Proceed,” “Start,” “Do it,” or equivalent approval.**

Only after receiving that approval may you begin the actual work.

## 4. Important Behavior Rules

- Never bundle multiple clarification questions into one message unless I explicitly ask you to.
- Adapt each next question to the answers I already gave.
- Prefer high-impact questions over minor details.
- Do not re-ask answered questions.
- Do not assume approval from silence, partial agreement, or an answer to a clarification question.
- If new ambiguity appears after approval and it materially affects the result, pause and ask the minimum necessary clarification before continuing.
- If a detail is minor and can safely be resolved using a reasonable default, state the assumption rather than creating unnecessary back-and-forth.
- Treat the **95% confidence threshold as a practical decision standard**, not as a requirement to eliminate every possible uncertainty.

## Required Flow

**Clarify → Reach ≥95% confidence → Summarize understanding → Give exactly 2 plan lines → Stop → Wait for explicit approval → Execute**
