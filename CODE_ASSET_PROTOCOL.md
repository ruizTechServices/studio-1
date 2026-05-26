# Code Asset Protocol

This protocol defines how RuizTech Studio should identify, classify, store, retrieve, and reuse proprietary RuizTech code assets from uploaded or connected GitHub repositories.

This is a documentation/specification file only. It does not implement GitHub ingestion, OAuth, vector storage, database schemas, or installation automation.

TinySheets Worksheet Generator remains the current active app. This protocol describes a larger studio capability that can support TinySheets and future RuizTech projects.

## Purpose

RuizTech Studio should become a controlled code intelligence and asset-reuse system.

The studio should be able to inspect authorized GitHub repositories, detect reusable implementation knowledge, preserve clear provenance, review reuse safety, and later install or adapt approved assets into target projects through an explicit integration plan.

The goal is not manual copy-paste. The goal is reusable RuizTech-owned implementation leverage with traceable source, review status, and controlled adaptation.

## What Is A RuizTech Code Asset

A RuizTech code asset is a reusable implementation or knowledge unit that RuizTech owns, authored, or is otherwise authorized to reuse, and that has been extracted from a source repository with provenance, metadata, compliance status, and reuse instructions.

A code asset is not just a snippet. It must include enough context to understand:

- what it does
- where it came from
- what it depends on
- how it behaves
- whether it is safe and legal to reuse
- how it should be integrated into another project

## Asset Types

RuizTech Studio recognizes these asset types:

- `functions`: standalone helpers, utilities, hooks, service methods, parsers, formatters, validators, and other callable units.
- `components`: UI components, layout primitives, form controls, email components, document renderers, and reusable interaction surfaces.
- `algorithms`: domain logic, ranking logic, generation logic, scoring rules, transformation pipelines, matching systems, and non-trivial data processing routines.
- `patterns`: repeatable architecture, state management, validation, rendering, testing, authorization, error handling, or deployment approaches.
- `templates`: starter files, boilerplate structures, config examples, page shells, document templates, email templates, and implementation skeletons.
- `workflows`: repeatable development, launch, support, QA, CI, deployment, review, incident, migration, or operations procedures.
- `prompts`: reusable system prompts, Codex tickets, model instructions, evaluation prompts, prompt chains, and task-specific generation instructions.
- `schemas`: database models, validation schemas, API contracts, event shapes, JSON schemas, and typed interfaces that define data structure.
- `integrations`: reusable adapters or implementation patterns for third-party services such as auth, storage, payments, email, analytics, AI APIs, GitHub, Supabase, Vercel, Stripe, and OpenAI.

## Source Detection Workflow

Assets may be detected from uploaded repositories or connected GitHub repositories only when RuizTech has permission to inspect and reuse the source.

The future ingestion workflow should follow this sequence:

1. Confirm the repository is authorized for RuizTech inspection and reuse.
2. Snapshot source identity, including source repo, branch or tag when available, source file, and commit SHA.
3. Exclude files that should not become assets, including environment files, secrets, generated caches, dependency folders, build outputs, logs with sensitive data, and third-party vendored code unless explicitly licensed for reuse.
4. Scan code, documentation, prompts, templates, tests, configs, and workflow files for candidate assets.
5. Detect asset boundaries such as exported functions, components, modules, schemas, prompts, workflow sections, integration clients, and repeated implementation patterns.
6. Identify dependencies, framework assumptions, inputs, outputs, side effects, runtime requirements, tests, and external services.
7. Cluster duplicate or near-duplicate candidates so the asset catalog does not fill with redundant variants.
8. Create a candidate asset record with metadata and source provenance.
9. Route the candidate through RuizTech compliance review before it can be suggested as install-ready.

Detection should produce candidate records, not automatic reuse approval.

## Candidate Detection Signals

Useful detection signals include:

- exported functions, classes, hooks, components, modules, or commands
- files imported by multiple parts of a repo
- test-covered utilities or behavior-heavy modules
- repeated logic appearing across projects
- stable templates copied intentionally across apps
- prompts or playbooks used repeatedly in successful work
- schemas or contracts that define reusable domain structures
- integration code that cleanly isolates third-party service behavior
- documentation that explains a repeatable technical or operational pattern

The system should also detect negative signals:

- hardcoded user, client, project, path, tenant, or environment assumptions
- direct secret usage or leaked credentials
- unreviewed third-party code
- unclear license or provenance
- missing tests around risky behavior
- tightly coupled app-specific data models
- hidden dependencies on global state, local files, hosted services, or manual setup

## Reuse Classification

Every candidate asset must be classified before reuse.

### Reusable As-Is

Use this classification when the asset is self-contained enough to reuse with minimal changes.

Requirements:

- clear RuizTech ownership or reuse rights
- no secrets or sensitive data
- compatible license and provenance
- documented purpose, inputs, outputs, and side effects
- dependencies are acceptable and explicit
- framework compatibility is known
- tests pass or test status is acceptable for the risk level
- integration instructions are clear

### Reusable With Adapter

Use this classification when the asset is valuable but must be wrapped, parameterized, migrated, or isolated before reuse.

Common reasons:

- framework-specific assumptions need conversion
- hardcoded config must become injected config
- UI styling needs adaptation
- service clients need target-project credentials or environment bindings
- domain names, table names, routes, or copy need replacement
- dependency versions differ from the target repo
- tests need to be added or rewritten for the target context

### Project-Specific Only

Use this classification when the asset should inform future design but should not be reused directly.

Common reasons:

- tightly bound to one app's domain model
- depends on app-specific business rules
- includes project-specific naming, UX, workflows, routes, or assumptions
- cannot be separated cleanly without rewriting most of it
- useful as a pattern or reference, not as installable code

### Do Not Reuse

Use this classification when the asset is unsafe, unauthorized, unclear, obsolete, or too risky to reuse.

Reasons include:

- secrets, credentials, tokens, or sensitive data
- unclear ownership, license, or provenance
- third-party code without reuse permission
- insecure authentication, authorization, storage, payment, or data handling
- known broken behavior or failing critical tests
- hidden production dependencies
- generated code whose source or license cannot be verified
- stale implementation that conflicts with current RuizTech standards
- hardcoded assumptions that could cause unsafe behavior in another project

`Do not reuse` assets may still be recorded as blocked references so future agents do not rediscover and recommend them.

## Required Asset Metadata

Each asset record must include:

- `name`: human-readable asset name.
- `type`: one of `functions`, `components`, `algorithms`, `patterns`, `templates`, `workflows`, `prompts`, `schemas`, or `integrations`.
- `source repo`: repository owner/name or internal source identifier.
- `source file`: file path where the asset was detected.
- `commit SHA`: exact source commit used for provenance.
- `purpose`: concise statement of what the asset does and why it exists.
- `dependencies`: packages, services, runtime assumptions, internal modules, environment variables, and required platform features.
- `framework compatibility`: known compatibility such as React, Next.js, Node, Python, Supabase, Vercel, browser-only, server-only, framework-agnostic, or unknown.
- `inputs`: function arguments, props, config, request shape, data shape, files, environment values, or user actions consumed by the asset.
- `outputs`: return values, rendered output, files, database writes, API responses, events, logs, or side effects produced by the asset.
- `side effects`: network calls, filesystem access, database changes, external API calls, auth changes, payment actions, email sends, logging, analytics, mutations, or global state changes.
- `test status`: known test coverage, test files, last validation result, manual review status, or `untested`.
- `compliance status`: RuizTech compliance review state such as `pending review`, `approved`, `approved with adapter`, `blocked`, or `retired`.
- `reuse status`: `reusable as-is`, `reusable with adapter`, `project-specific only`, or `do not reuse`.
- `integration instructions`: how the asset should be installed, adapted, configured, tested, and reviewed in a target repo.
- `license/provenance notes`: ownership, source license, author context, third-party references, restrictions, and any uncertainty.

Optional metadata may include tags, related assets, asset version, target use cases, known risks, screenshots, examples, benchmark notes, and reviewer notes.

## RuizTech Compliance Review

RuizTech compliance review is the required human or approved-review workflow that decides whether a candidate asset can be reused.

The review should check:

- RuizTech ownership or explicit reuse authorization
- source repo, source file, and commit SHA accuracy
- license and provenance clarity
- absence of secrets, credentials, private customer data, or sensitive business data
- security posture for auth, storage, payments, network calls, permissions, and data handling
- dependency risk and hidden dependency risk
- framework and runtime compatibility
- hardcoded assumptions and project-specific coupling
- test status and validation quality
- whether the asset should be reusable as-is, reusable with adapter, project-specific only, or blocked

An asset must not be presented as install-ready until compliance status and reuse status allow it.

## Storage For Search And Retrieval

Future implementation should store assets in a searchable asset catalog. This repository only defines the protocol and does not create a database schema.

The catalog should preserve:

- structured metadata for deterministic filtering
- source provenance with repo, file path, and commit SHA
- a normalized summary of purpose and behavior
- integration instructions and adapter requirements
- compliance and reuse status
- links to source tests, examples, screenshots, or docs when available
- extracted code or template content only when RuizTech has the right to store and reuse it
- embeddings or vector records for semantic discovery

Source provenance must remain attached to every asset. A vector result without metadata is not enough to justify reuse.

## Vector Search And Structured Metadata

Vector search and structured metadata should work together.

Vector search should help find assets by intent, purpose, behavior, domain, or similarity to a target task. Structured metadata should constrain and verify the results.

Recommended retrieval flow:

1. Apply structured filters for asset type, framework compatibility, compliance status, reuse status, dependency constraints, source repo, and test status.
2. Use vector search to find semantically relevant candidates within the allowed set.
3. Re-rank candidates using metadata fit, provenance confidence, recency, test status, dependency compatibility, and adapter effort.
4. Show the source repo, source file, commit SHA, compliance status, reuse status, and integration notes with every suggestion.
5. Never treat vector similarity as approval to reuse code.

Vector search finds candidates. Structured metadata and compliance review decide whether they can be used.

## Suggesting Assets For Future Projects

When a future project needs functionality, RuizTech Studio should compare the project requirements against the approved asset catalog.

Suggestions should consider:

- project goal and domain
- target framework, runtime, deployment platform, and services
- required inputs and outputs
- acceptable dependencies
- security and compliance requirements
- needed UI, schema, integration, workflow, or prompt behavior
- adapter effort and test effort
- prior success of the asset in RuizTech projects

Suggested assets should be returned with:

- asset name and type
- source repo, source file, and commit SHA
- fit reason
- known risks
- required adapter work
- dependency impact
- test requirements
- approved integration plan requirement

Assets classified as `do not reuse` must not be suggested as reusable. Assets classified as `project-specific only` may be suggested only as references or patterns.

## Installing Assets Into Target Repos

Assets should be installed into target repositories only through an approved integration plan.

Manual copy-paste is not the protocol.

An integration plan must include:

- target repo and target feature goal
- selected asset name, source repo, source file, and commit SHA
- classification and compliance status
- fit analysis for the target project
- files expected to be created or changed
- dependency changes, if any
- environment variables or service configuration needed, without secret values
- adapter changes required
- tests or validation steps required
- rollback or removal plan when practical
- reviewer approval before high-risk integrations

Codex or another coding agent may then implement the approved plan inside the target repo, preserving attribution/provenance in the asset record and validating the result.

## Warnings

Agents and future automation must treat these as blockers or review triggers:

- secrets, tokens, API keys, credentials, private keys, session cookies, or environment files
- unclear licensing, third-party code, copied examples, generated code, or missing provenance
- project-specific routes, tenants, domains, customer names, file paths, table names, and business rules
- unsafe authentication, authorization, RLS, payment, storage, email, or data export behavior
- hidden dependencies on global state, local machines, manual setup, cloud resources, or non-obvious services
- hardcoded assumptions about framework versions, regions, currencies, locales, roles, or deployment platforms
- missing tests for security-sensitive or money-sensitive behavior
- stale patterns that conflict with current RuizTech standards
- code that works only because of undocumented side effects

When in doubt, classify the asset as `pending review`, `reusable with adapter`, `project-specific only`, or `do not reuse` until the risk is resolved.

## Lifecycle

Asset lifecycle states should be:

1. `detected`: found in an authorized source.
2. `candidate`: metadata record created.
3. `pending review`: waiting for RuizTech compliance review.
4. `approved`: reusable as-is or with a documented adapter.
5. `installed`: used in a target project through an approved integration plan.
6. `updated`: source or target usage changed and metadata was refreshed.
7. `retired`: no longer recommended for new work.
8. `blocked`: must not be reused.

The catalog should support versioning so a later commit can improve or replace an older asset without erasing original provenance.

## Current Implementation Boundary

This repository remains a markdown-first source-of-truth operating workspace.

Do not implement the following as part of this protocol document:

- GitHub ingestion
- GitHub OAuth
- OpenAI OAuth
- vector storage
- database schemas
- asset installation automation
- package setup
- application source code
- framework initialization

Those items require separate scoped decisions and Codex-ready tickets.
