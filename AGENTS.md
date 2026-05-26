# AGENTS.md

This file defines how AI coding agents must work inside the `ruizTechServices/studio-1` repository.

Read this file before making changes.

## Repository Identity

This repo is the source-of-truth operating workspace for RuizTech Studio.

It is not currently a production application.

It is not currently a Next.js app.

It is not currently a monorepo.

It is a planning, continuity, prompt, playbook, and template repository for building future apps deliberately.

## Current Primary Product

TinySheets Worksheet Generator is the current primary app.

The MVP goal is:

A logged-in user can generate a simple K-2 worksheet, preview it, save it, and export it as a PDF.

## Primary Rule

Do not build app code in this repository unless explicitly instructed.

This repository currently exists to organize studio operations, documentation, prompts, playbooks, templates, and continuity files.

## Required Behavior

When asked to modify this repo:

1. Read `STUDIO_DASHBOARD.md`.
2. Read `README.md` if it exists.
3. Follow this `AGENTS.md`.
4. Make the smallest correct change.
5. Do not perform greenfield rewrites.
6. Do not create unrelated files.
7. Do not remove existing structure unless explicitly instructed.
8. Preserve the source-of-truth purpose of the repo.
9. Update documentation deliberately.
10. Summarize all changes clearly.

## Hard Constraints

Do not create a root-level `/context/` folder in this repo.

Do not commit secrets.

Do not commit environment files.

Do not commit generated caches.

Do not commit dependency folders.

Do not commit build outputs.

Do not create application source code unless the task explicitly asks for it.

Do not initialize Next.js, React, Supabase, Prisma, Tailwind, or any application framework unless the user explicitly instructs it.

Do not add package managers or lockfiles unless the repo is deliberately being converted into an executable project.

## What This Repo Should Contain

Allowed root-level docs:

- `README.md`
- `AGENTS.md`
- `STUDIO_DASHBOARD.md`
- `APP_REGISTRY.md`
- `DECISIONS.md`
- `PROMPTS.md`
- `CODEX_RULES.md`
- `BUSINESS_RULES.md`
- `WEEKLY_PLAN.md`

Allowed folders:

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

## Codex Work Rules

Every Codex task should have:

- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- tests or validation steps
- final response format

Do not accept vague tasks like:

```txt
Build the whole app.

Prefer scoped tasks like:

Create `APP_REGISTRY.md` using the existing studio dashboard as the source of truth.
Final Response Format for Agents

When completing work, respond with:

Summary
Files changed
Why the change was made
Validation performed
Risks or open questions
Suggested next task
Current Operating Bias

Bias toward:

clarity
continuity
small commits
scope control
revenue relevance
maintainable structure
readable documentation

Bias against:

overbuilding
vague architecture
premature frameworks
scattered notes
hidden assumptions
disconnected rewrites
fake progress
EOFcat > AGENTS.md <<'EOF'
# AGENTS.md

This file defines how AI coding agents must work inside the `ruizTechServices/studio-1` repository.

Read this file before making changes.

## Repository Identity

This repo is the source-of-truth operating workspace for RuizTech Studio.

It is not currently a production application.

It is not currently a Next.js app.

It is not currently a monorepo.

It is a planning, continuity, prompt, playbook, and template repository for building future apps deliberately.

## Current Primary Product

TinySheets Worksheet Generator is the current primary app.

The MVP goal is:

A logged-in user can generate a simple K-2 worksheet, preview it, save it, and export it as a PDF.

## Primary Rule

Do not build app code in this repository unless explicitly instructed.

This repository currently exists to organize studio operations, documentation, prompts, playbooks, templates, and continuity files.

## Required Behavior

When asked to modify this repo:

1. Read `STUDIO_DASHBOARD.md`.
2. Read `README.md` if it exists.
3. Follow this `AGENTS.md`.
4. Make the smallest correct change.
5. Do not perform greenfield rewrites.
6. Do not create unrelated files.
7. Do not remove existing structure unless explicitly instructed.
8. Preserve the source-of-truth purpose of the repo.
9. Update documentation deliberately.
10. Summarize all changes clearly.

## Hard Constraints

Do not create a root-level `/context/` folder in this repo.

Do not commit secrets.

Do not commit environment files.

Do not commit generated caches.

Do not commit dependency folders.

Do not commit build outputs.

Do not create application source code unless the task explicitly asks for it.

Do not initialize Next.js, React, Supabase, Prisma, Tailwind, or any application framework unless the user explicitly instructs it.

Do not add package managers or lockfiles unless the repo is deliberately being converted into an executable project.

## What This Repo Should Contain

Allowed root-level docs:

- `README.md`
- `AGENTS.md`
- `STUDIO_DASHBOARD.md`
- `APP_REGISTRY.md`
- `DECISIONS.md`
- `PROMPTS.md`
- `CODEX_RULES.md`
- `BUSINESS_RULES.md`
- `WEEKLY_PLAN.md`

Allowed folders:

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

## Codex Work Rules

Every Codex task should have:

- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- tests or validation steps
- final response format

Do not accept vague tasks like:

```txt
Build the whole app.

Prefer scoped tasks like:

Create `APP_REGISTRY.md` using the existing studio dashboard as the source of truth.
Final Response Format for Agents

When completing work, respond with:

Summary
Files changed
Why the change was made
Validation performed
Risks or open questions
Suggested next task
Current Operating Bias

Bias toward:

clarity
continuity
small commits
scope control
revenue relevance
maintainable structure
readable documentation

Bias against:

overbuilding
vague architecture
premature frameworks
scattered notes
hidden assumptions
disconnected rewrites
fake progress
