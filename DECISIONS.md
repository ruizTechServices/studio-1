# Decisions

This file records decisions that affect product direction, architecture, stack, scope, pricing, active app priority, or launch path.

Each decision must include:

- date
- decision
- reason
- rejected alternatives
- revisit condition

## 2026-05-26 - RuizTech Studio adopts Code Asset Protocol direction

### Decision

RuizTech Studio will define a Code Asset Protocol for extracting, classifying, storing, retrieving, and reusing proprietary RuizTech code assets from authorized GitHub repositories.

TinySheets Worksheet Generator remains the current active app. The code asset direction is a larger studio capability and does not authorize implementation work in this repository yet.

### Reason

RuizTech Studio should compound implementation leverage across projects by turning reusable functions, components, algorithms, patterns, templates, workflows, prompts, schemas, and integrations into reviewed proprietary assets with provenance and controlled reuse instructions.

### Rejected

- Manual copy-paste between projects as the default reuse process
- Building GitHub ingestion before documenting the protocol
- Implementing vector storage before defining metadata, compliance review, and reuse rules
- Replacing the TinySheets MVP focus with a new studio platform build

### Revisit

When TinySheets needs reusable assets from another repo, when RuizTech is ready to implement GitHub ingestion, or when the markdown protocol becomes insufficient for tracking asset candidates.

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

## 2026-05-26 - TinySheets is the active app

### Decision

TinySheets Worksheet Generator remains the primary active app for the studio.

### Reason

It has the clearest user, smallest MVP, and strongest path to a paid SaaS or low-cost paid tool test.

### Rejected

- Switching focus to 24HourGPT
- Switching focus to LetMeExplain
- Making Nucleus the active app
- Building the studio dashboard before the product workflow

### Revisit

After TinySheets has a working MVP or a clear blocker.

## 2026-05-26 - Custom studio dashboard is deferred

### Decision

A custom studio dashboard is deferred.

### Reason

The repo can already provide the required source-of-truth structure with markdown files. Building a dashboard now would distract from the TinySheets MVP.

### Rejected

- Building the dashboard as the first product
- Creating a Next.js admin interface for studio planning
- Adding database-backed planning tools before the workflow is proven

### Revisit

When the markdown workflow can no longer answer active app, milestone, next task, blocker, and decision questions efficiently.

## 2026-05-26 - One primary app at a time

### Decision

Only one app can be the primary active app at a time.

### Reason

The studio needs focused build energy, clear priorities, and fewer half-finished products.

### Rejected

- Parallel primary apps
- Weekly priority switching between products
- Expanding secondary apps without revenue or unblock value

### Revisit

After TinySheets ships an MVP or a different app has a stronger immediate revenue opportunity.

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
