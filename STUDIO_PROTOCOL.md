===
## Source of Truth Rule

This repository is the source of truth for RuizTech Studio.

Do not rely on scattered chats, screenshots, memory, or loose notes when resuming work.

Every serious decision, active app, milestone, Codex task, and next action must be reflected in this repository.
===

===

## Work Session Operating Loop

Every work session must follow this loop:

1. Open `STUDIO_DASHBOARD.md`.
2. Confirm the active app.
3. Confirm the current milestone.
4. Read the latest relevant decision in `DECISIONS.md`.
5. Open the active app record in `APP_REGISTRY.md`.
6. Choose one small task.
7. Convert that task into a Codex-ready ticket.
8. Let Codex implement only that ticket.
9. Review the diff.
10. Run validation commands.
11. Test manually.
12. Commit only working changes.
13. Push to GitHub.
14. Update the relevant studio docs.
15. Record new decisions if the task changed direction.

A work session is not complete until the studio notes reflect the current state.

===

===

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

Invalid task:

“Build the app.”

Valid task:

“Create `APP_REGISTRY.md` using the current studio dashboard as the source of truth.”

===

===

## End-of-Session Continuity Rule

Every work session must end with the repo able to answer:

1. What changed?
2. Why did it change?
3. What is the active app?
4. What milestone is active?
5. What is the next smallest task?
6. What is blocked?
7. What should not be touched yet?

If those answers are not captured, the session is not complete.

===

===
## Decision Logging Rule

Any decision that changes product direction, architecture, stack, scope, pricing, active app priority, or launch path must be recorded in `DECISIONS.md`.

A decision entry must include:

- date
- decision
- reason
- rejected alternatives
- revisit condition

#### EXAMPLE: ```## 2026-05-26 — TinySheets remains the active app

### Decision
TinySheets remains the primary active app for the studio.

### Reason
It has the clearest user, smallest MVP, and strongest path to a paid SaaS test.

### Rejected
- Switching focus to 24HourGPT
- Building the studio dashboard first
- Starting a new AI agent app

### Revisit
After TinySheets has a working MVP or a clear blocker.
```

===

===
## Active App Rule

Only one app can be the primary active app at a time.

The active app receives the main build energy, Codex tasks, architecture work, and weekly planning.

Secondary apps may only receive work if:
- they create immediate cash flow
- they unblock the active app
- they are being documented, not expanded

Current active app(NOTE: UPDATE THIS WHEN CHANGING ACTIVE APP): TinySheets Worksheet Generator.
===

===

# App Record: TinySheets

## Status
Active

## Priority
1

## One-Sentence Pitch
K-2 teachers, tutors, and homeschool parents generate clean one-page math and vocabulary worksheets in under 60 seconds.

## Current Milestone
Build the first usable MVP workflow.

## MVP Test
A logged-in user can generate, preview, save, and export one worksheet as a PDF.

## Revenue Hypothesis
Users may pay around $12/month or a low one-time fee for faster worksheet creation.

## Next Task
Create active app context docs.

## Blockers
None yet.

## Do Not Build Yet
- payments
- admin dashboard
- multi-page worksheet books
- school management features
- marketplace
===