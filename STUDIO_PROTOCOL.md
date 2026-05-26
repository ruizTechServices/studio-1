# Studio Protocol

This is the canonical operating system for RuizTech Studio.

For future proprietary code asset extraction and reuse, use `CODE_ASSET_PROTOCOL.md` as the controlling protocol. This repository remains markdown-first until a separate scoped decision converts any part of that protocol into implementation work.

## Source-of-Truth Rule

This repository is the source of truth for RuizTech Studio.

Do not rely on scattered chats, screenshots, memory, or loose notes when resuming work. Every serious decision, current focus, milestone, Codex task, and next action must be reflected in this repository.

## Current Focus Rule

There is currently no primary product app.

The active studio focus receives the main planning energy, Codex tasks, architecture work, and weekly planning.

A product app may only become active if `DECISIONS.md` records that selection.

Parked product ideas may only receive work if:

- they create immediate cash flow
- they unblock `ruizTechStudio`
- they are being documented, not expanded

Current studio focus: **ruizTechStudio**

Current primary product app: **None**

## Canonical Studio Operating Loop

Every work session follows this loop:

1. Open `STUDIO_DASHBOARD.md`.
2. Confirm the current studio focus.
3. Confirm the current milestone.
4. Review the latest relevant decisions in `DECISIONS.md`.
5. Review `APP_REGISTRY.md` only if product app status is relevant to the task.
6. Choose the next smallest scope-relevant task.
7. Convert that task into a Codex-ready ticket.
8. Give Codex only that ticket.
9. Review Codex's diff before accepting it.
10. Run validation commands.
11. Manually test the affected workflow.
12. Commit only working changes.
13. Push to GitHub.
14. Update the studio docs with the new state.
15. Record any new decision that affects scope, architecture, business direction, or app priority.

A session is not complete until the repo accurately describes where the project stands.

## Task Decomposition Rule

Never ask Codex to build a whole product.

Every Codex task must be reduced to one bounded implementation unit.

A valid task includes:

- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- validation steps
- final response format

## Codex Handoff Rule

Codex receives only scoped tickets.

Codex may implement, edit, test, inspect diffs, and summarize work, but it does not decide product direction, business priorities, current focus priority, primary product selection, pricing, or launch strategy.

## Review Rule

Review Codex's diff before accepting the work.

Check that the change:

- matches the ticket
- avoids unrelated rewrites
- preserves this repo as the source of truth
- does not create app code unless explicitly requested
- does not implement code asset ingestion, OAuth, vector storage, database schemas, or asset installation automation unless explicitly requested
- does not introduce secrets, generated files, dependency folders, or build outputs

## Manual Test Rule

Run validation commands when available.

Manually test the affected workflow when the task changes behavior or content that a human must read, follow, or use.

For documentation-only tasks, manual testing means reading the changed docs and confirming they answer the session continuity questions.

## Commit Rule

Commit only working changes.

Keep commits small and scoped to one task. Do not mix unrelated cleanup, restructuring, or app code with studio documentation updates.

## End-of-Session Continuity Rule

Every work session must end with the repo able to answer:

1. What changed?
2. Why did it change?
3. What is the current studio focus?
4. What milestone is active?
5. What is the next smallest task?
6. What is blocked?
7. What should not be touched yet?

If those answers are not captured, the session is not complete.

## Decision Logging Rule

Any decision that changes product direction, architecture, stack, scope, pricing, current focus, primary product selection, or launch path must be recorded in `DECISIONS.md`.

A decision entry must include:

- date
- decision
- reason
- rejected alternatives
- revisit condition

## AI Integration Boundary

AI is used to support strategy, scope control, implementation, review, validation, and documentation.

AI does not replace the studio source of truth. If a conclusion matters, it belongs in this repo.
