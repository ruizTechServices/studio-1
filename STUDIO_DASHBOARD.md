# RuizTech Studio Dashboard

This dashboard is the first file to open when resuming RuizTech Studio work.

## Source-of-Truth Rule

This repository is the source of truth for RuizTech Studio.

Do not rely on scattered chats, screenshots, memory, or loose notes when resuming work. Every serious decision, active app, milestone, Codex task, and next action must be reflected in this repository.

## Studio Purpose

RuizTech Studio exists to help build, launch, sell, and maintain focused software products without losing context between work sessions.

The goal is not to build many half-finished apps. The goal is to build focused, sellable, maintainable products that can become real businesses.

The larger Studio direction also includes a proprietary RuizTech code intelligence and asset-reuse system. `CODE_ASSET_PROTOCOL.md` defines how reusable code assets should be extracted from authorized GitHub repositories, reviewed, stored, retrieved, and later integrated into future projects.

## Current Active App

**TinySheets Worksheet Generator**

K-2 teachers, tutors, and homeschool parents generate clean one-page math and vocabulary worksheets in under 60 seconds.

## Current Milestone

Build the first usable MVP workflow.

## MVP Test

A logged-in user can generate a simple K-2 worksheet, preview it, save it, and export it as a PDF.

## Revenue Hypothesis

Users may pay around $12/month or a low one-time fee for faster worksheet creation.

## Next Smallest Task

Create active app context docs.

## Blockers

None yet.

## Canonical Studio Operating Loop

Every work session follows this loop:

1. Open `STUDIO_DASHBOARD.md`.
2. Confirm the current active app.
3. Confirm the current milestone.
4. Review the latest relevant decisions in `DECISIONS.md`.
5. Review the active app entry in `APP_REGISTRY.md`.
6. Choose the next smallest revenue-relevant task.
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

## Active App Rule

Only one app can be the primary active app at a time.

The active app receives the main build energy, Codex tasks, architecture work, and weekly planning.

Secondary apps may only receive work if:

- they create immediate cash flow
- they unblock the active app
- they are being documented, not expanded

## Active App Registry

| App | Status | Priority | Revenue Path | Next Action |
|---|---|---:|---|---|
| TinySheets Worksheet Generator | Active | 1 | SaaS/subscription or low-cost paid tool | Create active app context docs |
| Tech Rescue Sprint | Secondary | 2 | Local service sales / lead capture | Improve offer and intake notes |
| 24HourGPT | Paused | 3 | Low-cost temporary AI access | Revisit after one product ships |
| LetMeExplain | Paused | 4 | SaaS for feedback rewriting | Revisit after TinySheets MVP |
| Nucleus | Research | 5 | Desktop AI assistant subscription | Keep as long-term R&D |

## What Not To Build Yet

- custom studio dashboard
- another new primary app
- app source code in this repository unless explicitly instructed
- GitHub ingestion, OAuth, vector storage, or asset installation automation before a separate scoped decision and ticket
- payments
- admin dashboard
- multi-page worksheet books
- school management features
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

## Current Technical Assumptions For TinySheets

These are app planning assumptions, not instructions to create app code in this repo.

- Frontend: Next.js App Router
- Styling: Tailwind CSS and ShadCN UI where useful
- Auth: Supabase Auth
- Database: Supabase Postgres
- File Storage: Supabase Storage for generated PDF/spec files when needed
- PDF Generation: To be decided after worksheet rendering structure is clear
- Deployment: Vercel
