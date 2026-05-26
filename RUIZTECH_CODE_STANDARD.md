# RuizTech Code Standard

This document defines the engineering quality standard for future RuizTech code, reusable assets, Codex-generated implementation work, and eventual `ruizTechStudio` application code.

This is a documentation-only standard. It does not authorize application implementation, framework initialization, database schemas, package files, repo ingestion, vector retrieval, dashboard UI, OAuth, storage, Codex automation, or parked project work.

## Purpose Of The RuizTech Code Standard

The RuizTech Code Standard exists to make future code readable, maintainable, reusable, testable, and safe to evolve.

It should be used as a quality gate for:

- future `ruizTechStudio` application code
- future RuizTechServices product code
- reusable code assets
- Codex-generated implementation work
- repo onboarding review
- Code Asset Registry review
- future asset installation planning

The goal is not to over-engineer. The goal is to make sure every future implementation has clear boundaries, explicit dependencies, safe data handling, and enough validation to be trusted.

## Relationship To PRODUCT_SPEC.md

`PRODUCT_SPEC.md` is the canonical product context for `ruizTechStudio`.

This standard supports that product specification by defining the engineering bar future code must meet once implementation begins.

When future implementation tasks involve architecture, reusable assets, repo onboarding, Codex tickets, or production-readiness boundaries, Codex and human reviewers should read `PRODUCT_SPEC.md` first, then apply this code standard.

This document does not replace:

- `PRODUCT_SPEC.md` for product definition
- `REPO_ONBOARDING_PROTOCOL.md` for repository intake
- `CODE_ASSET_PROTOCOL.md` for reusable asset classification and reuse
- `XML_PROMPT_PROTOCOL.md` for prompt format

## Core Engineering Principles

- Prefer small, composable modules over large files.
- Separate UI, business logic, data access, validation, and provider integrations.
- Do not hardcode provider-specific logic throughout the app.
- Reusable code must have clear inputs, outputs, dependencies, and ownership boundaries.
- Validation should happen at system boundaries.
- Errors should be explicit, debuggable, and safe to expose only when appropriate.
- Database access should be isolated behind dedicated query or service functions.
- Auth checks must happen before protected data access.
- Metadata and provenance should remain explicit.
- Generated docs must be supervised and reviewed before becoming canonical.
- Vector retrieval is for recall, not source-of-truth authority.
- Codex must modify existing architecture deliberately rather than generating disconnected rewrites.

## Modularity Rules

Future code should be organized into modules with one clear responsibility.

Rules:

- Keep files focused on one domain, feature, or layer.
- Split large files when separate concepts become difficult to scan.
- Prefer pure helper functions for reusable transformations.
- Keep provider clients and adapters isolated.
- Keep side-effect-heavy code separate from pure logic.
- Avoid circular dependencies.
- Avoid hidden global state.
- Avoid utility files that become dumping grounds.
- Export only what other modules need.
- Keep module APIs small and intentional.

A module is ready for reuse only when its dependencies, inputs, outputs, and side effects are clear.

## Separation Of Concerns Rules

Separate these concerns unless a task explicitly justifies combining them:

- UI rendering
- user interaction state
- business rules
- validation
- data access
- authentication and authorization checks
- provider integrations
- formatting and parsing
- logging and observability
- background jobs or scheduled work

Do not mix database queries, provider calls, UI rendering, validation, and business decisions in the same file unless the file is intentionally a thin composition layer.

Composition layers should orchestrate. Domain modules should decide. Data modules should fetch or mutate. UI components should render and delegate.

## File And Folder Organization Rules

Future implementation should follow the conventions of the target repo or framework.

General rules:

- Place code near the feature when it is feature-specific.
- Place code in shared modules only when it is genuinely reused.
- Keep integration clients in dedicated provider or service modules.
- Keep database access in dedicated query, repository, or service modules.
- Keep validation schemas near the boundary where data enters the system.
- Keep tests near the code or in a consistent test folder.
- Keep generated files out of source-of-truth folders unless explicitly required.
- Keep docs separate from implementation files unless the framework expects inline documentation.

Do not create broad folders such as `utils/`, `helpers/`, or `lib/` without clear sub-organization when the codebase has a better existing pattern.

## Naming Conventions

Names should explain intent without requiring a reader to inspect the implementation.

Rules:

- Use domain-specific names where possible.
- Name functions with verbs or verb phrases.
- Name components by the UI concept they render.
- Name service modules after the external provider or domain capability they wrap.
- Name validation schemas after the data boundary they validate.
- Avoid abbreviations unless they are standard in the codebase.
- Avoid vague names such as `data`, `stuff`, `manager`, `handler`, or `helper` unless the surrounding context makes them precise.
- Use consistent naming for async functions, server-only modules, client-only modules, and side-effecting functions.

Reusable assets should have names that make sense outside the original project.

## Error Handling Standards

Errors should be explicit, safe, and useful.

Rules:

- Handle expected failure modes near the boundary where they occur.
- Do not swallow errors silently.
- Do not expose secrets, stack traces, tokens, internal IDs, or provider internals to end users.
- Return user-safe messages from UI and API boundaries.
- Preserve developer-useful details in logs when safe.
- Use typed or structured error shapes when the codebase supports them.
- Distinguish validation errors, auth errors, not-found errors, provider errors, rate-limit errors, and unexpected errors.
- Avoid generic catch blocks that hide root causes.
- Include recovery behavior where practical.

Reusable assets should document expected errors and how callers should handle them.

## Validation Standards

Validation should happen at system boundaries.

Boundary examples:

- form submission
- API route input
- server action input
- webhook payload
- uploaded file metadata
- environment variables
- external API response
- database write input
- AI model output before persistence or execution

Rules:

- Validate untrusted input before using it.
- Prefer schema-based validation when the stack supports it.
- Keep validation close to the boundary.
- Do not rely only on UI validation.
- Validate authorization separately from shape validation.
- Validate assumptions before side effects.
- Treat AI-generated output as untrusted until checked.
- Keep error messages useful but safe.

Reusable assets should define accepted inputs and output guarantees.

## Logging And Observability Standards

Logging should support debugging without leaking sensitive data.

Rules:

- Log meaningful events, not noise.
- Do not log secrets, API keys, passwords, tokens, private keys, cookies, or raw sensitive payloads.
- Redact user data when full values are not needed.
- Include request, job, or operation identifiers when available.
- Log external provider failures with enough context to troubleshoot.
- Log security-sensitive failures carefully.
- Avoid console-only logging in production paths unless the platform captures it intentionally.
- Prefer structured logs when the stack supports them.

Future observability should help answer what happened, where it happened, who or what triggered it, and whether retry or user action is needed.

## API Route Standards

API routes and server endpoints should be thin boundaries around validation, authorization, orchestration, and response shaping.

Rules:

- Validate request input before business logic.
- Authenticate before protected data access.
- Authorize before reading or mutating scoped resources.
- Keep provider-specific logic out of route files when practical.
- Use dedicated services for business logic and integrations.
- Return consistent response shapes.
- Use appropriate status codes.
- Handle known errors explicitly.
- Verify webhooks before trusting payloads.
- Avoid leaking internal errors to clients.
- Add rate limiting or abuse controls where risk justifies it.

An API route should not become the place where all domain logic lives.

## Database Access Standards

Database access should be isolated and reviewable.

Rules:

- Put queries and mutations behind dedicated query, repository, or service functions.
- Do not scatter raw queries throughout UI or route files.
- Keep transaction boundaries explicit.
- Check authorization before protected reads or writes.
- Avoid over-fetching sensitive data.
- Avoid writing unvalidated input.
- Use migrations or schema management when the project has a database layer.
- Keep seed data, test data, and production data clearly separated.
- Document assumptions about row-level security, tenancy, ownership, and roles.
- Make destructive operations explicit and hard to trigger accidentally.

Reusable database-related assets must document schema assumptions and permission assumptions.

## Authentication And Authorization Boundary Standards

Authentication proves identity. Authorization proves permission. Keep them distinct.

Rules:

- Authenticate before protected operations.
- Authorize before accessing user-owned, tenant-owned, admin-only, or paid resources.
- Do not rely only on hidden UI controls for security.
- Keep role and permission checks close to protected data access.
- Document auth assumptions for server actions, route handlers, jobs, and integrations.
- Avoid hardcoded user IDs, emails, tenant IDs, or admin bypasses.
- Treat webhooks, background jobs, and service roles as separate trust boundaries.
- Review storage access rules separately from database access rules.
- Do not expose private resources through public routes or predictable URLs.

Reusable assets involving auth must clearly state the trust boundary and caller responsibilities.

## UI/Component Standards

UI components should be composable, accessible, and separated from business and data logic.

Rules:

- Keep presentational components focused on rendering.
- Keep data fetching and mutations in appropriate route, server, hook, or service layers based on the stack.
- Keep business rules out of low-level UI components.
- Use props that describe intent, not implementation quirks.
- Avoid hardcoded business copy in reusable components unless intentional.
- Document required styling, state, accessibility, and provider assumptions.
- Handle loading, empty, error, disabled, and permission states.
- Prefer composition over deeply configurable monolith components.
- Keep interactive behavior predictable and keyboard-accessible.
- Avoid visual-only cues for important state.

Reusable UI assets should include expected props, dependencies, framework compatibility, and styling assumptions.

## Reusable Asset Readiness Checklist

A code unit is not ready for the Code Asset Registry until it can be reviewed against clear criteria.

Reusable asset readiness requires:

- clear name
- clear purpose
- known asset type
- source repo
- source file
- commit SHA or snapshot identifier
- clear owner or reuse rights
- license/provenance notes
- explicit inputs
- explicit outputs
- known dependencies
- known framework/runtime compatibility
- documented side effects
- documented error behavior
- test status
- security and compliance notes
- no secrets or sensitive data
- no hidden project-specific assumptions
- no unclear third-party copied code
- integration instructions
- reuse classification: reusable as-is, reusable with adapter, project-specific only, or do not reuse

If any required item is unclear, the asset should remain a candidate or require review before reuse.

## Codex Implementation Behavior Rules

For future implementation tasks, Codex must:

- Read `PRODUCT_SPEC.md` before making future implementation decisions.
- Read the relevant protocol docs before changing files.
- Summarize understanding before implementation when asked.
- Prefer targeted edits over broad rewrites.
- Preserve existing project structure unless the task explicitly authorizes restructuring.
- Follow the target repo's existing patterns before introducing new ones.
- Avoid creating new abstractions unless they reduce real duplication or improve system boundaries.
- Avoid silently introducing new dependencies.
- Avoid mixing unrelated concerns in the same file.
- Avoid creating app code in this repository unless explicitly instructed.
- Keep changes scoped to the ticket.
- Add or update validation steps when behavior changes.
- Include validation performed in final responses.
- Report validation that could not be run.
- Never commit secrets, generated caches, dependency folders, build outputs, or environment files.

Codex should treat this standard as a review lens, not as permission to implement application code.

## Anti-Patterns To Reject

Reject or flag:

- large files that mix UI, data access, business logic, and provider calls
- route files containing all domain logic
- database queries scattered across UI components
- auth checks hidden only in the frontend
- unvalidated input reaching database writes or provider calls
- generic catch blocks that hide failures
- console logging secrets or sensitive payloads
- hardcoded provider assumptions across the app
- hardcoded user IDs, tenant IDs, emails, roles, file paths, or production URLs
- reusable assets without source provenance
- copied third-party code with unclear license
- broad rewrites not required by the task
- disconnected abstractions created before real duplication exists
- manual copy-paste reuse without an approved integration plan
- AI-generated code accepted without review and validation

When an anti-pattern is found, prefer a targeted correction or a documented follow-up task over an unrelated rewrite.

## Future Relationship To Code Asset Registry

This standard is the quality gate that supports the future Code Asset Registry.

`CODE_ASSET_PROTOCOL.md` defines how assets are detected, classified, stored, retrieved, and reused. This document defines the engineering bar those assets should meet.

Future Code Asset Registry review should use this standard to decide whether an asset is:

- clear enough to understand
- modular enough to extract
- safe enough to reuse
- documented enough to install
- tested enough for its risk level
- free of secrets and unclear provenance
- compatible with the target project or adapter plan

An asset can be useful but still fail readiness. In that case, classify it as reusable with adapter, project-specific only, or do not reuse until the gap is resolved.

## Current Implementation Boundary

Do not implement application code from this document.

Do not create:

- Next.js files
- package files
- Supabase schemas
- database schemas
- ASSET_REGISTRY_SCHEMA.md
- ASSET_INSTALLATION_PROTOCOL.md
- repo ingestion
- vector retrieval
- dashboard UI
- OAuth
- storage integrations
- Codex automation
- parked project files

Those require separate scoped decisions and XML-style Codex tickets.
