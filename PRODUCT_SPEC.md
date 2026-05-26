# ruizTechStudio Product Specification

This file is the canonical product specification for `ruizTechStudio` during the design and specification phase.

This repository is still markdown-first. It is not a production app, not a Next.js app, and not a monorepo. Do not begin app implementation from this file alone.

## What ruizTechStudio Is

`ruizTechStudio` is a centralized operating workspace for Gio and RuizTechServices.

Its purpose is to preserve project continuity, turn authorized repositories into supervised project context, identify reusable RuizTech-created code assets, support controlled code reuse, and generate scoped Codex-ready tickets for future work.

The long-term product thesis:

RuizTechServices should be able to connect or upload a GitHub repository, understand what the project is, capture reliable metadata and provenance, generate reviewed documentation, identify reusable code assets, and use those assets across future projects without manual copy-paste or lost context.

## What ruizTechStudio Is Not

`ruizTechStudio` is not currently:

- a production application
- a Next.js app
- a monorepo
- a dashboard UI
- a database-backed system
- a GitHub ingestion implementation
- an OAuth implementation
- a vector retrieval implementation
- a replacement for human approval
- a place to build parked product apps

It should not be treated as permission to start app code, initialize frameworks, create schemas, or build infrastructure.

## Current Active Focus

The active focus is `ruizTechStudio` itself.

There is currently no primary product app.

The current work is to define product behavior, boundaries, protocols, lifecycle rules, and implementation-ready specifications before any production app work begins.

## Parked Project Policy

Parked projects are real, but intentionally deferred.

Current parked or research candidates include:

- TinySheets Worksheet Generator
- Tech Rescue Sprint
- 24HourGPT
- LetMeExplain
- Nucleus

These projects should not be resumed, expanded, or treated as primary unless `DECISIONS.md` explicitly records that one has been selected as active.

Parked means deferred, not abandoned. Their ideas may later inform repo onboarding, asset extraction, or future product direction, but they should not distract from formalizing `ruizTechStudio`.

## Main System Modules

The future `ruizTechStudio` application should be organized around these conceptual modules:

- Studio operating workspace: current focus, decisions, prompts, protocols, tasks, and continuity.
- Repo onboarding: authorized repository intake, metadata capture, snapshotting, stack detection, architecture mapping, risk scanning, and supervised context generation.
- Code Asset Registry: reusable RuizTech functions, components, algorithms, patterns, templates, workflows, prompts, schemas, and integrations.
- Metadata store: structured records for repositories, snapshots, files, modules, integrations, risks, assets, decisions, approvals, and generated docs.
- Vector retrieval: semantic recall over approved summaries, docs, asset descriptions, and project context.
- Codex-ticket generator: bounded XML-style implementation or documentation tickets based on approved context.
- Approval workflow: user review checkpoints before context becomes canonical, assets become reusable, or implementation tickets are executed.
- Future dashboard: a production UI for reviewing repo state, assets, risks, generated docs, and next actions.

These are product modules, not implementation instructions.

## Repo Onboarding Concept

Repo onboarding is the process of turning an authorized GitHub repository into reviewed project understanding.

The concept is governed by `REPO_ONBOARDING_PROTOCOL.md`.

At a product level, repo onboarding should:

- confirm repository authorization
- capture repo metadata
- snapshot branch, tag, and commit identity
- scan and classify the file tree
- filter generated, ignored, dependency, build, cache, and secret-risk files
- detect tech stack, commands, architecture, routes, APIs, components, functions, services, and integrations
- scan for security and operational risks
- infer project progress from evidence
- generate supervised context docs
- identify possible asset candidates for later review
- produce dashboard-ready summaries
- suggest next tasks and Codex-ticket candidates

Repo onboarding creates understanding. It does not automatically approve reuse or modify source repositories.

## Code Asset Registry Concept

The Code Asset Registry is the future library of reusable RuizTech-created assets.

The concept is governed by `CODE_ASSET_PROTOCOL.md`.

Assets may include:

- functions
- components
- algorithms
- patterns
- templates
- workflows
- prompts
- schemas
- integrations

Every asset must preserve source repo, source file, commit SHA, purpose, dependencies, compatibility, inputs, outputs, side effects, test status, compliance status, reuse status, integration instructions, and license/provenance notes.

Code asset reuse requires classification and approval. Vector similarity, repo onboarding, or a model recommendation is not enough to approve reuse.

## Metadata Storage Concept

Metadata storage is the structured source for durable product memory.

Future metadata records should track:

- repositories
- source snapshots
- file classifications
- detected stacks
- routes, APIs, components, functions, services, and integrations
- commands and validation signals
- security and risk findings
- generated context docs
- user approvals
- candidate assets
- approved assets
- asset usage in target projects
- Codex tickets and outcomes

Metadata must keep provenance explicit. A record should show where the information came from, when it was captured, and what review state it has.

No database schema should be created yet. This section defines product intent only.

## Vector Retrieval Concept

Vector retrieval is for recall, not source-of-truth authority.

Future vector retrieval may help find relevant repo context, docs, prior decisions, asset candidates, approved assets, and similar implementation patterns.

Vector retrieval should not decide:

- whether code may be reused
- whether a generated doc is canonical
- whether a Codex ticket is safe
- whether a repo has passed security review

Structured metadata, provenance, and user approval must remain the authority.

No vector storage should be implemented yet.

## Codex-Ticket Generation Concept

`ruizTechStudio` should eventually generate Codex-ready tickets from approved project context.

Codex tickets should:

- use XML-style structure from `XML_PROMPT_PROTOCOL.md`
- be scoped to one bounded implementation or documentation unit
- include goal, context, scope, constraints, acceptance criteria, validation, likely files, and final response format
- reference relevant protocol files
- include risk notes and approval requirements when needed
- avoid broad instructions like "build the app" or "fix everything"

Ticket generation should happen only from reviewed context. Generated tickets should be suggested, not silently executed.

## Markdown-First Boundary

`ruizTechStudio` is markdown-first only during the design and specification phase.

Markdown files currently define:

- product thesis
- operating rules
- repo onboarding behavior
- code asset reuse behavior
- XML prompt structure
- decisions
- parked project state
- implementation boundaries

This markdown-first approach is temporary and intentional. It lets the product be designed before production code exists.

## Markdown Lifecycle Policy

Planning markdown files are temporary scaffolding used to define product behavior, architecture, repo onboarding, code asset reuse, Codex workflows, and implementation boundaries.

Temporary planning markdown files should remain authoritative while `ruizTechStudio` is being designed and implemented.

Temporary planning markdown files should not remain as active production documentation once `ruizTechStudio` is production-ready.

After production readiness, the temporary planning and protocol markdown files should be removed from the active codebase.

`README.md` is the exception. It should not be deleted simply because it is a markdown file. Instead, `README.md` should be rewritten as the official documentation for the production `ruizTechStudio` application.

Historical planning context may remain recoverable through Git history, release tags, or an archival branch, but it should not remain in the production codebase as active source-of-truth documentation.

## Future Production Documentation Policy

When `ruizTechStudio` becomes production-ready, the production `README.md` should document the real application, not the earlier planning process.

The future production `README.md` should explain:

- what `ruizTechStudio` is as a real application
- how to install and run it locally
- how to configure required services
- how GitHub repo onboarding works
- how the Code Asset Registry works
- how metadata storage works
- how vector retrieval is used
- how Codex-ticket generation works
- how to validate the app
- how to deploy the app
- how future agents or contributors should work with the codebase

Other production documentation may exist if useful, but the temporary planning/protocol docs should not remain as active production source-of-truth files.

## Future App Boundary

The future app should not be built until the product specification, protocols, and implementation boundaries are clear enough to support scoped execution.

Do not implement yet:

- Next.js app shell
- dashboard UI
- GitHub ingestion
- repo upload handling
- OAuth
- metadata database
- vector storage
- Code Asset Registry persistence
- Codex-ticket automation
- asset installation automation
- Supabase schemas
- package setup

Each future implementation step requires a separate decision and a bounded XML-style Codex ticket.

## Next Documentation Steps

Recommended next documentation steps:

1. Create `RUIZTECH_CODE_STANDARD.md` to define quality and compliance rules for code assets.
2. Create `ASSET_REGISTRY_SCHEMA.md` as a markdown-only conceptual schema for future asset records.
3. Create `ASSET_INSTALLATION_PROTOCOL.md` to define controlled asset installation into target repos.
4. Create `REPO_CONTEXT_TEMPLATE.md` for supervised generated repo context docs.
5. Create an implementation readiness checklist before any framework or app code is introduced.

None of these steps should create application code.
