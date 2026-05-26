# Decisions

This file records decisions that affect product direction, architecture, stack, scope, pricing, current focus, primary product selection, or launch path.

Each decision must include:

- date
- decision
- reason
- rejected alternatives
- revisit condition

## 2026-05-26 - No current primary product app

### Decision

RuizTech Studio currently has no primary product app.

The current focus is creating and formalizing `ruizTechStudio` as the source-of-truth studio operating workspace and future proprietary code asset system.

TinySheets Worksheet Generator and other app ideas are parked candidates unless a later decision explicitly selects one as active.

### Reason

The immediate need is to define the studio itself: operating docs, protocols, registries, prompts, playbooks, and the controlled code asset reuse direction. Product app creation before that would add scope and false urgency.

### Rejected

- Treating TinySheets as the current active product app
- Starting any product MVP before `ruizTechStudio` is clarified
- Creating app source code or framework files in this repository

### Revisit

When the studio owner explicitly selects a primary product app or decides to convert part of `ruizTechStudio` into an executable product.

## 2026-05-26 - RuizTech Studio adopts Code Asset Protocol direction

### Decision

RuizTech Studio will define a Code Asset Protocol for extracting, classifying, storing, retrieving, and reusing proprietary RuizTech code assets from authorized GitHub repositories.

There is currently no primary product app. The code asset direction is a larger studio capability and does not authorize implementation work in this repository yet.

### Reason

RuizTech Studio should compound implementation leverage across projects by turning reusable functions, components, algorithms, patterns, templates, workflows, prompts, schemas, and integrations into reviewed proprietary assets with provenance and controlled reuse instructions.

### Rejected

- Manual copy-paste between projects as the default reuse process
- Building GitHub ingestion before documenting the protocol
- Implementing vector storage before defining metadata, compliance review, and reuse rules
- Building product app features before documenting the protocol

### Revisit

When RuizTech is ready to implement GitHub ingestion, when a selected product app needs reusable assets, or when the markdown protocol becomes insufficient for tracking asset candidates.

## 2026-05-26 - Studio starts as markdown-first

### Decision

RuizTech Studio starts as a markdown-first source-of-truth repository.

### Reason

The immediate need is continuity, focus, and scope control, not another app or dashboard.

### Rejected

- Building a custom studio dashboard first
- Starting with a database-backed operating system
- Spreading planning across chats, screenshots, and loose notes

### Revisit

After the studio has a shipped product or the markdown workflow becomes a clear blocker.

## 2026-05-26 - Superseded: TinySheets product-app focus

### Decision

This decision is superseded by the later decision that there is no current primary product app.

TinySheets Worksheet Generator is now a parked candidate, not the active studio focus.

### Reason

The studio owner clarified that the current focus is creating `ruizTechStudio`, not creating a primary product app.

### Rejected

- Continuing to describe TinySheets as active
- Starting product MVP work before studio setup is clarified
- Selecting a different product app without an explicit decision

### Revisit

When the studio owner explicitly selects a primary product app.

## 2026-05-26 - Custom studio dashboard is deferred

### Decision

A custom studio dashboard is deferred.

### Reason

The repo can already provide the required source-of-truth structure with markdown files. Building a dashboard now would distract from clarifying `ruizTechStudio`.

### Rejected

- Building the dashboard as the first product
- Creating a Next.js admin interface for studio planning
- Adding database-backed planning tools before the workflow is proven

### Revisit

When the markdown workflow can no longer answer current focus, milestone, next task, blocker, and decision questions efficiently.

## 2026-05-26 - At most one primary app when product work resumes

### Decision

There is currently no primary product app. When product work resumes, only one app can be selected as the primary product app at a time.

### Reason

The studio needs focused build energy, clear priorities, and fewer half-finished products. For now, that focus is `ruizTechStudio`.

### Rejected

- Parallel primary product apps
- Weekly priority switching between products
- Expanding secondary apps without revenue or unblock value

### Revisit

When the studio owner explicitly selects a primary product app.

## 2026-05-26 - Codex only receives scoped tickets

### Decision

Codex only receives scoped implementation tickets with clear boundaries and validation steps.

### Reason

Scoped tickets reduce drift, prevent greenfield rewrites, and keep Codex work aligned with the studio source of truth.

### Rejected

- Asking Codex to build whole products
- Letting Codex decide product direction
- Giving Codex vague instructions without acceptance criteria

### Revisit

If the studio adopts a more formal ticketing system or builds a dedicated implementation workflow.
