# Repo Onboarding Protocol

This protocol defines how RuizTech Studio should process an authorized GitHub repository when a user connects or uploads it.

This is a documentation/specification file only. It does not implement GitHub ingestion, OAuth, vector storage, database schemas, app source code, or automation.

There is currently no primary product app. The current focus is creating and formalizing `ruizTechStudio` as the markdown-first studio operating workspace and future proprietary code asset system.

## Purpose

Repo onboarding is the repo-level intake pipeline for RuizTech Studio.

Its job is to turn an authorized repository into structured project understanding, dashboard-ready context, risk notes, future Codex tasks, and candidate inputs for `CODE_ASSET_PROTOCOL.md`.

Repo onboarding answers:

- What is this repository?
- What does it appear to do?
- What stack and services does it use?
- What parts of the codebase matter?
- What is risky, incomplete, generated, ignored, or sensitive?
- What commands can safely validate it?
- What context docs should a human approve?
- What reusable asset candidates should flow into the Code Asset Protocol?
- What next tasks or Codex tickets are justified by the repo evidence?

Repo onboarding creates understanding. It does not automatically approve code reuse, install assets, create app code, or mutate the onboarded repository.

## Authorization Boundary

RuizTech Studio may only onboard repositories that are authorized for inspection.

Before processing a repository, the system should confirm:

- the user has permission to connect or upload the repository
- RuizTech is allowed to inspect the repository contents
- any reuse rights are documented separately before asset extraction approval
- private repo contents are handled as confidential
- secrets, credentials, customer data, and sensitive files are not stored as reusable assets

Authorization to inspect a repo is not the same as authorization to reuse its code. Reuse decisions are handled through `CODE_ASSET_PROTOCOL.md`.

## Full Onboarding Pipeline

The future onboarding pipeline should follow this sequence:

1. Confirm repository authorization and processing scope.
2. Capture repository metadata.
3. Snapshot branch, tag, and commit identity.
4. Scan the file tree.
5. Classify files by role and risk.
6. Filter ignored, generated, dependency, build, cache, and secret-bearing files.
7. Detect tech stack, frameworks, runtimes, package managers, and deployment targets.
8. Extract project purpose from docs, names, routes, UI copy, schemas, and configuration.
9. Map architecture, modules, boundaries, and important entrypoints.
10. Detect routes, APIs, components, functions, services, commands, and integrations.
11. Detect database, auth, storage, payment, email, analytics, AI, and other service usage.
12. Scan for security, compliance, provenance, dependency, and operational risks.
13. Infer project progress, incomplete work, TODOs, test status, and validation readiness.
14. Generate supervised context docs for human review.
15. Identify candidate reusable assets and route them into `CODE_ASSET_PROTOCOL.md`.
16. Produce dashboard-ready outputs for future `ruizTechStudio` UI surfaces.
17. Suggest next tasks and Codex-ready tickets.
18. Ask for user approval before saving summaries, creating asset candidates, or proposing implementation work.

The pipeline should preserve source evidence at every step. Inferences must be labeled as inferences.

## Repo Metadata Capture

Onboarding should capture repository-level metadata before deeper analysis.

Required metadata includes:

- repository owner and name
- repository URL or upload identifier
- visibility: public, private, internal, or unknown
- default branch
- selected branch or tag
- latest commit SHA analyzed
- commit author and timestamp when available
- repository description
- primary language estimate
- license file status
- README status
- package/config file summary
- detected project type
- onboarding timestamp
- onboarding operator or connected account identifier
- processing scope and excluded paths

Optional metadata may include repo topics, stars, fork status, open issues, pull requests, releases, deployment links, CI status, and connected hosting provider metadata.

## Commit And Branch Snapshotting

Every onboarding run must be tied to a specific source snapshot.

The snapshot should record:

- default branch
- analyzed branch
- analyzed tag, if any
- commit SHA
- short SHA for display
- commit date
- whether the working tree or upload had uncommitted changes
- whether submodules were present
- whether generated files were excluded

The system should never produce durable repo context without a source snapshot. If a repository is uploaded as a zip without Git metadata, the system should create an upload snapshot identifier and mark commit SHA as unavailable.

Snapshotting matters because future context, risks, Codex tickets, and asset candidates must point back to the exact code state that produced them.

## File Tree Scanning

The file tree scan should build a compact map of the repository without treating every file as equally important.

The scan should capture:

- root files
- top-level directories
- source directories
- test directories
- config directories
- documentation directories
- migration or schema directories
- scripts and automation
- CI workflow files
- public/static asset directories
- generated output directories
- dependency directories
- large binary files
- hidden files and dot-directories

The file tree map should prioritize signal over volume. The goal is to support project understanding, not to preserve a full file listing in every summary.

## File Classification

Each relevant file should be classified by role.

Common file roles include:

- `source`: application or library code
- `component`: UI component or view code
- `route`: page route, router file, screen, or navigation entry
- `api`: API endpoint, route handler, controller, server action, or RPC handler
- `service`: service client, integration wrapper, domain service, job, worker, or adapter
- `schema`: database schema, validation schema, model, contract, type definition, or migration
- `config`: framework, tool, build, lint, deploy, package, or environment template config
- `test`: unit, integration, end-to-end, fixture, mock, or test utility
- `script`: CLI, maintenance script, data script, migration helper, or automation
- `doc`: README, architecture note, prompt, playbook, changelog, or decision record
- `asset`: static image, font, media, fixture, or design export
- `generated`: compiled output, cache, lock-generated artifact, or machine output
- `dependency`: vendored code or installed dependency
- `secret-risk`: file likely to contain credentials, tokens, keys, cookies, or private config
- `unknown`: file not confidently classified

Classification should include confidence and evidence. A low-confidence classification should be marked for review.

## Ignored, Generated, And Secret File Filtering

Repo onboarding must filter files before analysis, summarization, or storage.

Files that should generally be ignored include:

- dependency folders such as `node_modules/`, `vendor/`, `.venv/`, and virtual environments
- generated caches such as `.next/`, `.turbo/`, `.cache/`, `dist/`, `build/`, `coverage/`, and compiled outputs
- package manager stores and lock-generated internals
- binary build outputs
- operating system files
- editor caches
- log files with sensitive data
- local database dumps
- uploaded customer files
- environment files such as `.env`, `.env.local`, `.env.production`, and similar variants
- key, certificate, credential, token, cookie, and secret files

The system may note that excluded files exist, but must not store secret contents.

Filtering should use:

- `.gitignore`
- framework-specific ignore patterns
- known dependency/build/cache directory names
- file extension risk lists
- size limits
- entropy or credential-pattern scans
- user-specified exclusions

If a secret-like value is detected in a file that would otherwise be analyzed, onboarding should record a security finding and redact the value.

## Tech Stack Detection

Tech stack detection should infer the repository's runtime, framework, tooling, and deployment assumptions.

Signals include:

- package files such as `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, `go.mod`, and similar manifests
- lockfiles
- framework config files
- route or app directory conventions
- import statements
- CI workflow commands
- Dockerfiles and compose files
- deployment configs
- environment variable names
- database migration tools
- test runner configs
- styling configs

Detected stack output should include:

- languages
- runtimes
- frameworks
- package managers
- build tools
- test tools
- styling systems
- database clients or ORMs
- auth providers
- storage providers
- payment providers
- AI providers
- hosting or deployment platforms
- confidence level and evidence

Do not assume the stack from one file alone when other evidence conflicts.

## Project Purpose Extraction

Onboarding should infer project purpose from multiple sources.

Useful sources include:

- repository name and description
- README and docs
- landing page copy
- route names
- API names
- component names
- database schemas
- seed data
- prompts
- tests
- package metadata
- deployment names

The output should separate:

- explicit purpose stated in docs
- inferred purpose from code
- target users or operators
- main workflows
- current uncertainty
- evidence used

Purpose extraction should avoid inventing product strategy. If the repo does not clearly say what it does, mark the purpose as uncertain.

## Architecture Mapping

Architecture mapping should describe how the repository is organized and how major parts connect.

The map should identify:

- entrypoints
- application routes or screens
- API boundaries
- server/client boundaries
- shared libraries
- domain modules
- service adapters
- database layer
- auth layer
- background jobs or workers
- storage/media layer
- configuration layer
- testing layer
- deployment layer

The architecture map should be concise enough for a human to review quickly and detailed enough for a future Codex ticket to avoid blind edits.

## Route, API, Component, Function, And Service Detection

Onboarding should detect codebase surfaces that explain how the project works.

### Routes

Detect:

- page routes
- app routes
- screen names
- route parameters
- layouts
- protected routes
- public routes
- navigation structure

### APIs

Detect:

- API endpoints
- server actions
- RPC methods
- webhooks
- request methods
- input validation
- response shape
- auth requirements
- rate-limit assumptions
- external service calls

### Components

Detect:

- exported UI components
- shared layout components
- forms
- modals
- tables
- dashboards
- charts
- document renderers
- email components
- component dependencies
- styling system assumptions

### Functions

Detect:

- exported utilities
- domain functions
- validation helpers
- parsers and formatters
- generation logic
- data transforms
- error handlers
- hooks
- side effects and dependencies

### Services

Detect:

- third-party service clients
- internal service wrappers
- database services
- auth services
- storage services
- payment services
- AI/model services
- email services
- background workers
- scheduled jobs

Detected surfaces can become project context. Reusable candidates must be reviewed under `CODE_ASSET_PROTOCOL.md`.

## Integration Detection

Onboarding should detect integrations and their risk profile.

Integration categories include:

- database: Supabase, Postgres, Prisma, Drizzle, SQLite, MySQL, Redis, Neon, Firebase, and similar systems
- auth: Supabase Auth, Clerk, Auth.js, OAuth providers, custom sessions, JWT, cookies, and role logic
- storage: Supabase Storage, S3, R2, Blob storage, local filesystem, uploads, and generated files
- payments: Stripe, checkout flows, webhooks, invoices, subscriptions, and usage billing
- AI: OpenAI, Anthropic, local models, vector stores, embeddings, prompt chains, evals, and agents
- email and messaging: Resend, SendGrid, SMTP, Twilio, Slack, Discord, and notification systems
- analytics and observability: Vercel Analytics, PostHog, Sentry, log drains, metrics, and tracing
- deployment: Vercel, Netlify, Cloudflare, Docker, CI/CD, cron, queues, and workers

For each integration, capture:

- provider or service name
- source files
- required environment variables, without secret values
- user data touched
- auth or permission assumptions
- side effects
- test or mock coverage
- setup requirements
- risk notes

## Command Detection

Onboarding should detect commands that build, test, lint, run, migrate, seed, deploy, and maintain the repo.

Command sources include:

- package scripts
- Makefiles
- task runners
- CI workflow files
- Dockerfiles
- docs
- scripts directories
- framework defaults

Command output should include:

- install command
- local development command
- build command
- lint command
- typecheck command
- test command
- database migration command
- seed command
- format command
- deploy command
- known prerequisites
- confidence and source evidence

Onboarding should not run commands unless a later implementation protocol explicitly permits it. This protocol only defines how commands should be detected and recorded.

## Security And Risk Scanning

Security and risk scanning should flag issues that affect onboarding trust, future Codex work, and asset reuse eligibility.

Risk categories include:

- secrets or credentials in source
- missing or unclear license/provenance
- unsafe authentication or authorization
- missing input validation
- unsafe file uploads or path handling
- insecure storage or public data exposure
- payment/webhook verification gaps
- database access without clear permission boundaries
- missing RLS or unclear RLS assumptions
- insecure CORS or cookie settings
- exposed admin routes
- unhandled personally identifiable information
- hardcoded production URLs, tenants, roles, regions, or account IDs
- unpinned or risky dependencies
- generated or vendored code with unclear origin
- large files or binary blobs
- missing tests for high-risk behavior

Findings should include severity, evidence file, short explanation, and suggested review action. Do not expose secret values in findings.

## Progress Inference

Onboarding should infer project progress from repository evidence.

Signals include:

- README status
- issue or TODO references
- changelog and decision logs
- test coverage indicators
- passing or failing CI status when available
- implemented routes versus placeholder routes
- empty components
- mock data usage
- commented-out code
- disabled tests
- migration state
- deployment configs
- docs that mention next steps
- recent commit activity

Progress output should include:

- likely stage: idea, prototype, MVP, active build, production, maintenance, paused, or unknown
- implemented workflows
- incomplete workflows
- blockers
- validation gaps
- next likely work areas
- confidence and evidence

Progress inference should not override user direction. If the user states the repo status, the onboarding summary should include both stated status and inferred evidence.

## Supervised Context Doc Generation

Repo onboarding should produce draft context docs that require user approval before becoming source-of-truth.

Possible generated docs include:

- project summary
- architecture summary
- command reference
- integration map
- route/API map
- security and risk notes
- testing and validation notes
- onboarding decision notes
- candidate asset summary
- next-task backlog

Draft docs should be:

- evidence-based
- concise
- labeled as generated drafts until approved
- linked to source files and commit snapshot
- clear about uncertainty
- free of secrets
- reviewed before becoming canonical

No generated context doc should be treated as authoritative until the user approves it.

## Connection To Code Asset Protocol

Repo onboarding feeds `CODE_ASSET_PROTOCOL.md`, but it does not replace it.

During onboarding, the system may identify candidate reusable assets such as:

- functions
- components
- algorithms
- patterns
- templates
- workflows
- prompts
- schemas
- integrations

Those candidates should be passed to the Code Asset Protocol with source repo, source file, commit SHA, purpose, dependencies, framework compatibility, inputs, outputs, side effects, test status, compliance status, reuse status, integration instructions, and license/provenance notes when available.

Repo onboarding can say, "this appears to be a candidate asset." It cannot say, "this is approved for reuse" unless the Code Asset Protocol review has approved it.

## Dashboard-Ready Outputs

Future frontend dashboard surfaces should be able to consume onboarding outputs.

Dashboard-ready output should include:

- repository identity
- snapshot identity
- detected purpose
- detected stack
- architecture summary
- route/API/component/function/service counts
- integration map
- command list
- security/risk summary
- progress summary
- generated draft docs status
- candidate asset count by type
- approval checkpoints
- recommended next tasks
- Codex ticket candidates
- blocked or unknown areas

Dashboard output should distinguish facts, inferences, risks, and pending approvals.

## Next-Task And Codex-Ticket Generation

After onboarding, RuizTech Studio may suggest next tasks or Codex-ready tickets.

Suggestions should be based on:

- explicit user goal
- repo purpose
- current milestone
- risk findings
- incomplete workflows
- missing tests
- missing docs
- validation gaps
- user-approved context
- candidate asset opportunities

Generated tickets should include:

- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- validation steps
- final response format
- warnings from onboarding
- approval requirements

Suggested tickets must remain bounded. Onboarding should not generate broad tickets such as "build the app" or "fix everything."

## User Approval Checkpoints

Onboarding should require user approval at important points.

Approval checkpoints include:

1. Permission to inspect the connected or uploaded repository.
2. Confirmation of branch, tag, commit, or upload snapshot to analyze.
3. Confirmation of excluded paths or sensitive areas.
4. Review of detected project purpose and stack.
5. Review of generated context docs before saving them as source-of-truth.
6. Review of security and risk findings.
7. Approval before creating candidate asset records.
8. Approval before marking any asset candidate ready for Code Asset Protocol review.
9. Approval before generating Codex tickets for implementation work.
10. Approval before making any changes to the source repository.

No onboarding output should silently become canonical or trigger repo changes without the proper approval checkpoint.

## Current Implementation Boundary

This repository remains a markdown-first source-of-truth operating workspace.

Do not implement the following as part of this protocol document:

- GitHub ingestion
- repository upload handling
- GitHub OAuth
- OpenAI OAuth
- vector storage
- database schemas
- dashboard UI
- asset extraction automation
- asset installation automation
- package setup
- application source code
- framework initialization

Those items require separate scoped decisions and Codex-ready tickets.
