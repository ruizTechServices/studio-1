# RuizTech Studio

RuizTech Studio is the source-of-truth workspace for planning, building, reviewing, and launching RuizTechServices software products.

This repository is not a production application. It is the operating system for keeping product direction, app status, Codex tickets, decisions, prompts, playbooks, and session continuity in one place.

## Studio Purpose

RuizTech Studio exists to help build focused, sellable, maintainable software products without losing context between work sessions.

## Current Active App

**TinySheets Worksheet Generator**

TinySheets helps K-2 teachers, tutors, and homeschool parents generate clean one-page math and vocabulary worksheets in under 60 seconds.

Current MVP goal:

A logged-in user can generate a simple K-2 worksheet, preview it, save it, and export it as a PDF.

## Source-of-Truth Rule

This repository is the source of truth for RuizTech Studio.

Do not rely on scattered chats, screenshots, memory, or loose notes when resuming work. Every serious decision, active app, milestone, Codex task, and next action must be reflected in this repository.

## Folder Map

```txt
studio-1/
  README.md
  AGENTS.md
  STUDIO_DASHBOARD.md
  STUDIO_PROTOCOL.md
  APP_REGISTRY.md
  DECISIONS.md
  CODEX_RULES.md
  PROMPTS.md
  .gitignore

  apps/
  clients/
  logs/
  playbooks/
  prompts/
  templates/
```

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

## What Not To Build Yet

- Do not build a custom studio dashboard yet.
- Do not start another primary app.
- Do not create application source code in this repo unless explicitly instructed.
- Do not initialize Next.js, React, Supabase, Prisma, Tailwind, or any application framework here unless the repo is deliberately converted into an executable project.
- Do not add payments, admin dashboards, school management features, marketplaces, or multi-page worksheet products before the TinySheets MVP workflow works.

## How To Resume Work

Start with `STUDIO_DASHBOARD.md`, then read `DECISIONS.md` and `APP_REGISTRY.md`. Pick one small revenue-relevant task, turn it into a Codex-ready ticket, and update the docs before ending the session.
