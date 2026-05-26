# AGENTS.md

This file defines how Codex and other AI coding agents must work inside the `ruizTechServices/studio-1` repository.

Read this file before making changes.

## Read Order

Before making changes, agents must read:

1. `STUDIO_DASHBOARD.md`
2. `README.md`
3. `STUDIO_PROTOCOL.md`
4. `PRODUCT_SPEC.md` when working on product definition, lifecycle boundaries, future app direction, or canonical studio context
5. `RUIZTECH_CODE_STANDARD.md` when working on future implementation quality, reusable asset readiness, or Codex-generated code behavior
6. `XML_PROMPT_PROTOCOL.md` when creating or editing Codex tickets, reusable prompts, or LLM prompt standards
7. `REPO_ONBOARDING_PROTOCOL.md` when working on repository onboarding, connected repo analysis, uploaded repo analysis, or repo context generation
8. `CODE_ASSET_PROTOCOL.md` when working on code asset extraction, classification, storage, retrieval, or reuse
9. `DECISIONS.md`
10. `APP_REGISTRY.md`
11. `CODEX_RULES.md` when creating or executing Codex tickets

## Repository Identity

This repo is the source-of-truth operating workspace for RuizTech Studio.

It is not currently a production application.

It is not currently a Next.js app.

It is not currently a monorepo.

It is a planning, continuity, prompt, playbook, protocol, and template repository for creating `ruizTechStudio` deliberately.

It also defines the Code Asset Protocol for future RuizTech proprietary code asset extraction and controlled reuse.

It also defines the Repo Onboarding Protocol for future authorized GitHub repository intake and project understanding.

It also defines the XML Prompt Protocol for structured Codex and LLM prompts.

It also defines the canonical `ruizTechStudio` product specification in `PRODUCT_SPEC.md`.

It also defines the RuizTech Code Standard for future implementation quality and reusable asset readiness.

## Current Studio Focus

There is currently no primary product app.

The current focus is creating and formalizing `ruizTechStudio` as the source-of-truth studio operating workspace and future code asset system.

Do not treat TinySheets Worksheet Generator or any other app as the current primary product unless a later decision explicitly sets it as active.

## Primary Rule

Do not build app code in this repository unless explicitly instructed.

This repository currently exists to organize studio operations, documentation, prompts, playbooks, templates, and continuity files.

## Hard Constraints

- Do not create a root-level `/context/` folder in this repo.
- Do not commit secrets.
- Do not commit environment files.
- Do not commit generated caches.
- Do not commit dependency folders.
- Do not commit build outputs.
- Do not create application source code unless the task explicitly asks for it.
- Do not initialize Next.js, React, Supabase, Prisma, Tailwind, or any application framework unless the user explicitly instructs it.
- Do not add package managers or lockfiles unless the repo is deliberately being converted into an executable project.
- Do not perform greenfield rewrites.
- Do not remove existing structure unless explicitly instructed.

## Allowed Root-Level Files

- `README.md`
- `AGENTS.md`
- `STUDIO_DASHBOARD.md`
- `STUDIO_PROTOCOL.md`
- `PRODUCT_SPEC.md`
- `RUIZTECH_CODE_STANDARD.md`
- `XML_PROMPT_PROTOCOL.md`
- `REPO_ONBOARDING_PROTOCOL.md`
- `CODE_ASSET_PROTOCOL.md`
- `APP_REGISTRY.md`
- `DECISIONS.md`
- `PROMPTS.md`
- `CODEX_RULES.md`
- `.gitignore`

## Allowed Folders

- `apps/`
- `clients/`
- `logs/`
- `playbooks/`
- `prompts/`
- `templates/`

## Folder Rules

### `apps/`

Use for app-level notes, links, summaries, and continuity records.

Do not dump full application source code here unless a deliberate monorepo decision is made.

### `clients/`

Use for lead notes, offer notes, outreach notes, objections, and service workflows.

Do not store sensitive client data.

### `logs/`

Use for session logs, weekly reviews, and progress records.

### `playbooks/`

Use for repeatable processes.

Examples:

- Codex workflow
- app validation
- launch process
- bug triage
- security review
- Supabase RLS review
- Stripe payment review
- Vercel deployment review

### `prompts/`

Use for reusable prompts.

Examples:

- Codex feature implementation prompt
- Codex bugfix prompt
- ChatGPT architecture review prompt
- strict code review prompt
- MVP scope reduction prompt

### `templates/`

Use for reusable file templates, app starter documentation, and future boilerplate structures.

## Task Size Limits

Every Codex task must be one bounded implementation unit.

A valid task includes:

- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- validation steps
- final response format

Do not accept vague tasks like:

```txt
Build the whole app.
```

Prefer scoped tasks like:

```txt
Create `APP_REGISTRY.md` using the current studio dashboard as the source of truth.
```

## Final Response Format

When completing work, respond with:

- Summary
- Files changed
- Why the change was made
- Validation performed
- Risks or open questions
- Suggested next task

## Operating Bias

Bias toward clarity, continuity, small commits, scope control, revenue relevance, maintainable structure, and readable documentation.

Bias against overbuilding, vague architecture, premature frameworks, scattered notes, hidden assumptions, disconnected rewrites, and fake progress.
