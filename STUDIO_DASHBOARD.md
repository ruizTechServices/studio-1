# RuizTech Studio Dashboard

This dashboard is the first file to open when resuming RuizTech Studio work.

## Source-of-Truth Rule

This repository is the source of truth for RuizTech Studio.

Do not rely on scattered chats, screenshots, memory, or loose notes when resuming work. Every serious decision, current focus, milestone, Codex task, and next action must be reflected in this repository.

## Studio Purpose

RuizTech Studio exists to help build, launch, sell, and maintain focused software products without losing context between work sessions.

The goal is not to build many half-finished apps. The goal is to build focused, sellable, maintainable products that can become real businesses.

The larger Studio direction also includes a proprietary RuizTech code intelligence and asset-reuse system. `CODE_ASSET_PROTOCOL.md` defines how reusable code assets should be extracted from authorized GitHub repositories, reviewed, stored, retrieved, and later integrated into future projects.

## Current Studio Focus

**ruizTechStudio**

There is currently no primary product app.

The current focus is creating and formalizing `ruizTechStudio` as the markdown-first studio operating workspace and future proprietary code asset system.

## Current Milestone

Define the studio operating docs, protocols, registries, prompt library, and reuse-system boundaries.

## Current Validation Test

The repo clearly explains that `ruizTechStudio` is the current focus, no primary product app is active, and no app source code or framework files should be created.

## Revenue Hypothesis

No product-specific revenue hypothesis is active during this phase. Revenue work resumes when a primary product app or studio product path is explicitly selected.

## Next Smallest Task

Create the next ruizTechStudio protocol or context document needed to support repo onboarding and code asset reuse.

## Blockers

None yet.

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

## Current Focus Rule

There is currently no primary product app.

The active studio focus receives the main planning energy, Codex tasks, architecture work, and weekly planning.

A product app may only become active if `DECISIONS.md` records that selection.

Parked product ideas may only receive work if:

- they create immediate cash flow
- they unblock `ruizTechStudio`
- they are being documented, not expanded

## Current Focus Registry

| Focus | Status | Priority | Purpose | Next Action |
|---|---|---:|---|---|
| ruizTechStudio | Active studio focus | 1 | Studio operating workspace and future proprietary code asset system | Create the next protocol or context document |
| Product app creation | Not active | N/A | Future app work only after explicit selection | Keep candidates parked in `APP_REGISTRY.md` |

## What Not To Build Yet

- custom studio dashboard
- any primary product app
- app source code in this repository unless explicitly instructed
- GitHub ingestion, OAuth, vector storage, or asset installation automation before a separate scoped decision and ticket
- payments
- admin dashboard
- marketplace

## Operating Model

### ChatGPT / Ada Is Used For

- strategy
- scope control
- architecture review
- feature specs
- Codex prompt creation
- reviewing Codex output
- debugging reasoning
- deciding what matters next

### Codex Is Used For

- implementing scoped tickets
- modifying existing files
- writing tests when the ticket requires it
- fixing bugs
- running lint, typecheck, and tests when available
- summarizing changed files

### Final Decision

The studio owner makes final product and business decisions.

## Current Technical Assumptions

No product app stack is selected.

Do not initialize Next.js, React, Supabase, Prisma, Tailwind, or any application framework in this repo unless a later scoped decision explicitly converts the workspace into an executable project.
