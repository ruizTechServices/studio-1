# studio-1 Current Project Handoff

_Last updated: 2026-06-07 - docs reconciliation and smoke-test session_

## Project Identity

`studio-1` / `ruizTechStudio` is a local-first repo recovery and codebase intelligence studio.

The continuity MVP helps Gio import or connect a codebase, scan and classify project files, visualize project structure and behavior, recover where work stopped, identify what to inspect next, and eventually extract reusable assets from already-scanned repos.

The current MVP is continuity. AI orchestration and model routing are later considerations.

## Current Branch and Repo State

Current branch:

```text
main
```

Recent commits:

```text
af0051f moved md files to docs folder
83a4487 Convert mock sidebar pages to backend-backed workspace views
a6b24e2 docs: update handoff after recovery assistant merge
33eb577 merge: add recovery assistant v1
b974915 feat: add recovery assistant v1
f665497 docs: update handoff after algorithm map merge
7899d24 merge: add algorithm map v1
dcf6f61 feat: add algorithm map v1
```

Current known status:

- Core repo recovery and deterministic map layers are implemented.
- Reusable Assets v0 is implemented as a read-only deterministic panel in the repo detail flow.
- Backend-backed workspace pages are implemented for Projects, Specs, Agents evidence/status, Workflow runs, Memory context sources, and Settings/runtime status.
- These newer views expose stored evidence and runtime status. They do not implement agent execution, workflow automation, or a dedicated memory store.
- Documentation is being reorganized under `docs/archive/`, `docs/plans/`, and `docs/prompts/`.
- Reusable Assets v0 is implemented and exposed in the current repo detail flow.

The repo and current code are the source of truth.

## Current Architecture

- Express backend served by `server.js`
- Vanilla HTML/CSS/JavaScript frontend under `app/`
- SQLite persistence through Node's `node:sqlite` `DatabaseSync`
- Modular API routers under `routes/`
- Backend helpers and deterministic scanners under `lib/`
- Modular HTML partials under `app/components/`
- Modular JavaScript feature controllers and renderers under `app/js/features/`

The app is not Next.js and has no frontend build step.

## Run Locally

```bash
npm install
npm start
```

Open `http://localhost:3000`.

`npm run dev` also runs `node server.js`.

## Implemented Core Recovery Features

- Local folder upload with filtering
- GitHub repository URL import
- Repo and file persistence
- Action event persistence and queries
- Project Map
- Project Summary
- Symbol Map
- Dependency Map
- Behavior Map
- Algorithm Map
- Recovery Assistant

GitHub import currently accepts a repository URL and performs a shallow, single-branch clone of the repository's default branch. Branch and commit pinning are not implemented.

## Backend-Backed Workspace Views

- **Projects** summarizes persisted repos and their deterministic project signals.
- **Specs** lists documentation and spec-like file candidates.
- **Agents** reports AI/agent-related file and event evidence; agent runtime is not implemented.
- **Workflow runs** groups action events into observed runs; workflow automation is not implemented.
- **Memory** assembles context sources from repos, docs, recovery signals, and events; a dedicated memory table is not implemented.
- **Settings** reports runtime, storage, and filter-rule status; writable settings are not implemented.
- **Reusable Assets** identifies deterministic reusable candidates from already-scanned repos.

## Current API Surface

```text
GET    /api/repos
POST   /api/repos/upload
POST   /api/repos/import-github
GET    /api/repos/:id
DELETE /api/repos/:id
GET    /api/repos/:id/project-map
GET    /api/repos/:id/project-summary
GET    /api/repos/:id/symbol-map
GET    /api/repos/:id/dependency-map
GET    /api/repos/:id/behavior-map
GET    /api/repos/:id/algorithm-map
GET    /api/repos/:id/recovery-assistant
GET    /api/repos/:id/reusable-assets

GET    /api/events
POST   /api/events
GET    /api/entities/:type/:id/events
GET    /api/projects
GET    /api/specs
GET    /api/agents
GET    /api/workflows/runs
GET    /api/memory/context
GET    /api/settings/status
GET    /api/filter-rules
```

See `docs/current-api-surface.md` for endpoint notes.

## Verification Status

Verified during the current recovery/docs work:

- Key files exist: `server.js`, `routes/index.js`, `app/js/main.js`, and `app/js/data/nav-items.js`.
- JavaScript syntax checks pass.
- Known top-level curl endpoints work: `/api/repos`, `/api/events`, `/api/projects`, `/api/specs`, `/api/agents`, `/api/workflows/runs`, `/api/memory/context`, and `/api/settings/status`.
- `npm run smoke` is available for deterministic API smoke checks while the server is running, including reusable-assets coverage when repos exist.

## Known Non-Features

- No agent runtime
- No workflow automation engine
- No dedicated memory table
- No AI or local model router
- No Nano integration
- No embeddings
- No auth or multi-user isolation
- No repo editing
- No AI summaries or reuse recommendations yet

## Current Next Steps

1. Finish docs reconciliation.
2. Add or verify the smoke test script.
3. Commit documentation/state cleanup.
4. Continue refining Reusable Assets v0 if needed.
5. Only after continuity MVP basics are stable, consider local model/AI routing.

Reusable Assets v0 means detecting and displaying reusable components, functions, API handlers, utilities, patterns, and algorithm candidates from already-scanned repos. It does not include AI recommendations, embeddings, automatic code reuse, a marketplace, or agent execution.

## Working Rules

- Trust current code over old docs and prompts.
- Keep the app local-first and deterministic.
- Preserve the current Express, vanilla frontend, and SQLite architecture.
- Do not treat design prompts as implementation truth.
- Do not move AI/local model routing ahead of smoke coverage and Reusable Assets v0.
