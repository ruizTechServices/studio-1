# Turning Mock Pages Into Real Studio Workspaces

## A practical implementation plan for grounding Projects, Specs, Agents, Workflows, Memory, and Settings in the backend that exists today

> **Editorial brief:** The new sidebar pages should stop presenting invented product state and start reflecting what `studio-1` actually stores, serves, and knows. The current backend is compact but useful: saved repos, repo file records, repo-derived analysis, action events, and filter/server metadata. The first real version should use those sources honestly, then add new persistent models only where the product genuinely needs them.

---

## The State Of The System

The application is an Express server that serves the static frontend from `app/`, exposes a small `/api` surface, and persists local data in SQLite under the ignored `data/` directory.

The backend currently exposes:

| Surface | File | What it provides |
| --- | --- | --- |
| Static app shell | `server.js` | Serves `app/`, mounts `/api`, assigns request IDs, records startup events |
| Repo APIs | `routes/repos.js` | Repo list, upload, GitHub import, delete, and derived repo analysis endpoints |
| Event APIs | `routes/events.js` | Query and create action events |
| Entity events | `routes/entities.js` | Query events for an entity type/id |
| Metadata | `routes/meta.js` | Filter rules for ignored dirs, extensions, and max file size |

The database currently has only three application tables:

| Table | Purpose |
| --- | --- |
| `repos` | Saved repo identity, source type, root path, file totals, created timestamp |
| `repo_files` | Scannable files for each repo, with path, language, size, and heuristic category |
| `action_events` | System, API, UI, upload, import, delete, and repo-map events |

There are no persisted tables for projects, specs, agents, workflows, memory, users, billing, integrations, or settings.

### Live Data Snapshot

At inspection time, the local SQLite database contained:

| Record type | Count |
| --- | ---: |
| Saved repos | 6 |
| Repo file rows | 3,759 |
| Action events | 290 |

That is enough to make the new pages materially real, but not enough to claim task progress, agent runs, approvals, billing, members, saved memories, or workflow definitions.

---

## Product Principle

The first implementation should be **evidence-backed, not aspirational**.

Each page should answer a real question using existing backend truth:

| Page | Real question it can answer now |
| --- | --- |
| Projects | What saved repos exist, what kind of projects do they appear to be, and what is missing or light? |
| Specs | What documentation/spec-like files exist across saved repos? |
| Agents | Is there any AI/agent-related code or event activity, and is an agent runtime actually connected? |
| Workflows | What real event flows have happened, grouped as runs? |
| Memory | What reusable local context exists in repos, docs, recovery hints, and event history? |
| Settings | What local runtime, storage, and file-filter settings are actually active? |

The mock UI can remain useful as layout scaffolding, but mock content must be replaced with real data or honest empty states.

---

## Backend Inventory

### Existing Endpoints To Reuse

| Endpoint | Reuse |
| --- | --- |
| `GET /api/repos` | Base source for Projects, Memory, Settings counts, and repo selectors |
| `GET /api/repos/:id/project-map` | File category sections for Projects and Specs drilldowns |
| `GET /api/repos/:id/project-summary` | Project type, frameworks, capabilities, missing/light areas |
| `GET /api/repos/:id/symbol-map` | Optional Agents/Workflows evidence for route handlers, schemas, functions |
| `GET /api/repos/:id/dependency-map` | Optional project technical detail and dependency hubs |
| `GET /api/repos/:id/behavior-map` | Workflow and behavior evidence from JS/TS code |
| `GET /api/repos/:id/algorithm-map` | Technical complexity signals |
| `GET /api/repos/:id/recovery-assistant` | Memory and Projects next-step evidence |
| `GET /api/events?limit=...` | Workflows, Agents activity, Settings/system status |
| `GET /api/entities/:type/:id/events` | Repo-specific activity |
| `GET /api/filter-rules` | Settings and Files consistency |

### Existing Behavior To Avoid Duplicating

The repo analysis helpers already do meaningful work and should remain the source of truth:

| Helper | File | Keep using it for |
| --- | --- | --- |
| `repoSummary` | `lib/repos/repoSummary.js` | Repo list cards and file/category summaries |
| `projectMap` | `lib/repos/projectMap.js` | Category sections and language counts |
| `projectSummary` | `lib/repos/projectSummary.js` | Project type, frameworks, capabilities, missing/light areas |
| `symbolMap` | `lib/repos/symbolMap.js` | Route/function/schema evidence |
| `dependencyMap` | `lib/repos/dependencyMap.js` | Import graph summaries |
| `behaviorMap` | `lib/repos/behaviorMap.js` | Workflow-like code behavior signals |
| `algorithmMap` | `lib/repos/algorithmMap.js` | Algorithmic/code complexity signals |
| `recoveryAssistant` | `lib/repos/recoveryAssistant.js` | Suggested next steps and inspect-first files |
| `eventsForQuery` | `lib/events/eventsForQuery.js` | Event filtering and limits |

The categorization is heuristic and path/name based. Pages should label results as detected files, signals, or evidence rather than definitive product entities.

---

## The Page-By-Page Plan

## Projects

### Replace

Remove fake owners, fake progress percentages, blocked states, task counts, and milestone claims from `mock-page-data.js`.

### Show

Use each saved repo as a real “repo-backed project.”

Display:

- Repo name
- Source type: local upload or GitHub import
- File count and total bytes
- Created timestamp
- Primary language
- Detected project type
- Framework tags
- Main category counts
- Missing/light areas
- Latest repo events

### Backend Need

Add `GET /api/projects`.

Recommended response shape:

```json
{
  "summary": {
    "totalProjects": 6,
    "totalFiles": 3759,
    "githubImports": 3,
    "localUploads": 3
  },
  "projects": [
    {
      "id": "repo-id",
      "name": "repo-name",
      "sourceType": "github_url_filtered",
      "totalFiles": 755,
      "totalBytes": 15774918,
      "createdAt": "2026-06-04T00:31:35.282Z",
      "projectType": "Next.js web application",
      "confidence": "high",
      "primaryLanguage": "typescript",
      "frameworks": ["Next.js", "React"],
      "mainAreas": ["Functions", "Components"],
      "missingOrLightAreas": ["documentation is light"],
      "recentEvents": []
    }
  ]
}
```

### Files Likely To Change

| File | Change |
| --- | --- |
| `routes/projects.js` | New aggregate route |
| `routes/index.js` | Mount `/projects` |
| `lib/projects/projectList.js` | New helper deriving project rows from `repos` and `projectSummary` |
| `lib/index.js` | Export new helper |
| `app/js/features/projects/projects-controller.js` | Load real projects |
| `app/js/features/projects/projects-render.js` | Render real table, stats, inspector |
| `app/projects.html` | Point main content to a real component or keep container with new class |
| `app/js/main.js` | Replace `initMockPage` with `initProjectsPage` |

---

## Specs

### Replace

Remove fake spec versions, approval states, review queues, acceptance criteria, and decision logs.

### Show

Use real documentation/spec-like files from `repo_files`.

Candidate rules:

- `category = 'documentation'`
- extension `.md` or `.mdx`
- path/name contains `spec`, `prd`, `rfc`, `requirements`, `readme`, `docs`, `design`, `architecture`, `decision`, or `adr`

Display:

- File name
- Path
- Repo name
- Extension/language
- Size
- Category
- Inferred type: README, RFC, ADR, Spec, Requirements, General docs

Do not show approval, owner, version, or coverage until persisted spec metadata exists.

### Backend Need

Add `GET /api/specs`.

This can be a direct SQLite query joining `repo_files` to `repos`.

Recommended response shape:

```json
{
  "summary": {
    "totalCandidates": 244,
    "reposWithDocs": 6,
    "readmes": 6,
    "specLike": 18
  },
  "specs": [
    {
      "repoId": "repo-id",
      "repoName": "repo-name",
      "path": "docs/architecture.md",
      "name": "architecture.md",
      "extension": ".md",
      "sizeBytes": 12000,
      "type": "Architecture"
    }
  ]
}
```

### Files Likely To Change

| File | Change |
| --- | --- |
| `routes/specs.js` | New docs/spec candidate route |
| `routes/index.js` | Mount `/specs` |
| `lib/specs/specCandidates.js` | New query/classification helper |
| `lib/index.js` | Export helper |
| `app/js/features/specs/specs-controller.js` | Load real specs |
| `app/js/features/specs/specs-render.js` | Render docs/spec table and inspector |
| `app/specs.html` | Real page container |
| `app/js/main.js` | Replace `initMockPage` with `initSpecsPage` |

---

## Agents

### Replace

Remove fake running agents, queues, success rates, loads, handoff time, and controls.

### Show

Show an honest runtime state:

> Agent runtime is not connected in this backend yet.

Then show real supporting evidence:

- AI/agent-related files where `category = 'aiLogic'`
- Files with `agent`, `openai`, or `ai` in the path
- Action events whose `source`, `action`, `message`, or `details_json` mention agents or AI
- Optional route/function/schema signals from `symbolMap` for AI-related repos

### Backend Need

Add `GET /api/agents`.

This should be read-only and evidence-driven. It should not create an agent model yet.

Recommended response shape:

```json
{
  "runtime": {
    "connected": false,
    "message": "No agent runtime is currently exposed by the backend."
  },
  "summary": {
    "aiFiles": 179,
    "reposWithAiSignals": 4,
    "agentEvents": 0
  },
  "files": [],
  "events": []
}
```

### Files Likely To Change

| File | Change |
| --- | --- |
| `routes/agents.js` | New evidence route |
| `routes/index.js` | Mount `/agents` |
| `lib/agents/agentEvidence.js` | New helper querying files/events |
| `lib/index.js` | Export helper |
| `app/js/features/agents/agents-controller.js` | Load runtime/evidence |
| `app/js/features/agents/agents-render.js` | Render honest empty/runtime state |
| `app/agents.html` | Real page container |
| `app/js/main.js` | Replace `initMockPage` with `initAgentsPage` |

---

## Workflows

### Replace

Remove fake workflow definitions, triggers, scheduled runs, saved time, and alert counts.

### Show

Use `action_events` as real workflow/run history.

Group events by:

1. `correlation_id` when present
2. else `request_id`
3. else standalone event ID

Classify run types:

- GitHub import
- Local upload
- Repo delete
- Server startup
- API error
- UI display/logging

Display:

- Run type
- Started/last event time
- Event count
- Final level
- Related repo/entity
- Phases/actions timeline

### Backend Need

Add `GET /api/workflows/runs`.

Recommended response shape:

```json
{
  "summary": {
    "totalRuns": 48,
    "failedRuns": 6,
    "warningRuns": 7,
    "successfulRuns": 35
  },
  "runs": [
    {
      "id": "corr_x",
      "type": "GitHub import",
      "startedAt": "2026-06-04T00:31:00.000Z",
      "endedAt": "2026-06-04T00:31:35.282Z",
      "level": "success",
      "eventCount": 5,
      "entity": { "type": "repo", "id": "repo-id", "name": "odysseus" },
      "events": []
    }
  ]
}
```

### Files Likely To Change

| File | Change |
| --- | --- |
| `routes/workflows.js` | New workflow run route |
| `routes/index.js` | Mount `/workflows` |
| `lib/workflows/workflowRuns.js` | Group/classify events |
| `lib/index.js` | Export helper |
| `app/js/features/workflows/workflows-controller.js` | Load run history |
| `app/js/features/workflows/workflows-render.js` | Render runs/timelines |
| `app/workflows.html` | Real page container |
| `app/js/main.js` | Replace `initMockPage` with `initWorkflowsPage` |

---

## Memory

### Replace

Remove fake saved prompts, pinned items, collections, usage counts, and privacy claims that imply a memory store.

### Show

Show “local context sources” instead of “saved memory.”

Use:

- Saved repos
- Documentation/spec candidates
- Recovery assistant next steps
- Recent action events
- Project summaries

This page should say, in product language, that no dedicated memory store exists yet. The useful real content is local repo context and event history.

### Backend Need

Add `GET /api/memory/context`.

This can aggregate:

- Repo count and recent repos
- Top documentation files
- Recent recovery-assistant next steps from each repo
- Recent events

Recommended response shape:

```json
{
  "store": {
    "connected": false,
    "message": "No dedicated memory table exists yet."
  },
  "summary": {
    "repos": 6,
    "documentationFiles": 244,
    "recentEvents": 100
  },
  "contextSources": []
}
```

### Files Likely To Change

| File | Change |
| --- | --- |
| `routes/memory.js` | New context route |
| `routes/index.js` | Mount `/memory` |
| `lib/memory/contextSources.js` | Aggregate repo/docs/events/recovery data |
| `lib/index.js` | Export helper |
| `app/js/features/memory/memory-controller.js` | Load context sources |
| `app/js/features/memory/memory-render.js` | Render local context, not fake saved memory |
| `app/memory.html` | Real page container |
| `app/js/main.js` | Replace `initMockPage` with `initMemoryPage` |

---

## Settings

### Replace

Remove fake members, integrations, billing, plan, notifications, and workspace policy claims.

### Show

Use real local settings/status:

- Filter rules from `/api/filter-rules`
- Data path/storage counts
- Repo count
- Repo file count
- Event count
- Max upload file size
- Allowed extensions
- Ignored directories
- Server/API health

Settings should be read-only at first unless write APIs are intentionally added.

### Backend Need

Add `GET /api/settings/status`.

Recommended response shape:

```json
{
  "storage": {
    "repos": 6,
    "repoFiles": 3759,
    "actionEvents": 290
  },
  "filterRules": {
    "ignoredDirs": [],
    "allowedExtensions": [],
    "maxFileSizeBytes": 2097152
  },
  "runtime": {
    "api": "ok",
    "persistence": "sqlite"
  }
}
```

### Files Likely To Change

| File | Change |
| --- | --- |
| `routes/settings.js` | New status route |
| `routes/index.js` | Mount `/settings` |
| `lib/settings/settingsStatus.js` | Count DB rows and expose filter rules |
| `lib/index.js` | Export helper |
| `app/js/features/settings/settings-controller.js` | Load settings status |
| `app/js/features/settings/settings-render.js` | Render read-only settings |
| `app/settings.html` | Real page container |
| `app/js/main.js` | Replace `initMockPage` with `initSettingsPage` |

---

## Shared Frontend Architecture

The current new pages all point to `components/mock-page/mock-page.html` and initialize through `initMockPage()` in `app/js/main.js`.

That should be replaced with page-specific controllers:

| Current | Replace with |
| --- | --- |
| `initMockPage()` for Projects | `initProjectsPage()` |
| `initMockPage()` for Specs | `initSpecsPage()` |
| `initMockPage()` for Agents | `initAgentsPage()` |
| `initMockPage()` for Workflows | `initWorkflowsPage()` |
| `initMockPage()` for Memory | `initMemoryPage()` |
| `initMockPage()` for Settings | `initSettingsPage()` |

Add a shared frontend API module for non-Files pages:

```txt
app/js/features/studio-api.js
```

It should use existing helpers from `app/js/core/api.js`, especially `apiGet`, rather than duplicating `fetch` parsing logic.

Recommended helper exports:

- `fetchProjects()`
- `fetchSpecs()`
- `fetchAgents()`
- `fetchWorkflowRuns()`
- `fetchMemoryContext()`
- `fetchSettingsStatus()`

---

## Navigation And Page Wiring

Keep the current page files:

- `app/projects.html`
- `app/specs.html`
- `app/agents.html`
- `app/workflows.html`
- `app/memory.html`
- `app/settings.html`

Keep existing pages intact unless shared shell consistency requires a small adjustment:

- `app/index.html`
- `app/dashboard.html`
- `app/files.html`

Keep `app/js/data/nav-items.js` as the sidebar source. Important: `.gitignore` ignores `data/` directories, so this file may not appear in normal `git status`. Use explicit checks before staging or committing any nav changes.

---

## What Not To Build Yet

Do not add these until there is a clear product need:

- Editable project records
- Spec approval workflows
- Agent execution runtime
- Workflow definition builder
- Saved memory/prompt database
- User/team/member settings
- Billing or plan settings
- Integration configuration

Those concepts are not represented by the current backend. Adding fake tables too early would turn the implementation into another mock layer with persistence.

---

## Styling Direction

The pages can preserve the general magazine-like workspace composition:

- Strong title area
- Compact stat strip
- Searchable primary table
- Inspector panel
- Timeline or evidence list
- Real empty states

But rename or phase out `mock-*` CSS classes once the pages become real. A good shared replacement would be:

```txt
app/css/pages/studio-pages.css
```

Use page-specific class names only where layout or semantics differ.

---

## Safety Notes For The Dirty Worktree

The current worktree already contains unrelated or previous changes:

- Files page collapsible card edits
- New sidebar page files
- Shared mock page files
- Sidebar/layout CSS changes
- An untracked `update_prompt_before_llm_implementation.md`

Implementation should:

- Avoid reverting any existing dirty file
- Read before editing any dirty file
- Leave `update_prompt_before_llm_implementation.md` untouched unless explicitly requested
- Avoid broad formatting churn
- Keep changes scoped to the page/API migration
- Use explicit file lists when staging, especially because `app/js/data/nav-items.js` is under an ignored `data/` path

---

## Recommended Implementation Order

### 1. Backend Aggregates

Add the aggregate routes and helpers in this order:

1. `GET /api/projects`
2. `GET /api/specs`
3. `GET /api/workflows/runs`
4. `GET /api/settings/status`
5. `GET /api/agents`
6. `GET /api/memory/context`

Projects and Specs should come first because they are cleanly derived from `repos` and `repo_files`.

### 2. Shared Frontend API

Add `app/js/features/studio-api.js` and wire it to `apiGet`.

### 3. Projects Page

Convert Projects first. It is the strongest bridge from mock UI to real backend state.

### 4. Specs Page

Convert Specs using documentation/spec candidates.

### 5. Workflows Page

Convert Workflows using grouped event runs.

### 6. Settings Page

Convert Settings to read-only runtime/filter/storage state.

### 7. Agents Page

Convert Agents with an honest “runtime not connected” state plus real AI/agent evidence.

### 8. Memory Page

Convert Memory last because it benefits from Projects, Specs, Events, and Recovery Assistant data.

### 9. Remove Mock Page Infrastructure

Once all six pages are migrated:

- Remove `app/js/features/mock-page/mock-page-data.js`
- Remove `app/js/features/mock-page/mock-page-controller.js`
- Remove `app/js/features/mock-page/mock-page-render.js`
- Remove `app/components/mock-page/mock-page.html` if no page includes it
- Replace or rename `app/css/pages/mock-pages.css`
- Remove the mock CSS import from `app/css/main.css`

---

## Verification Plan

### Static Checks

Run:

```powershell
node --check server.js
node --check routes/index.js
node --check routes/projects.js
node --check routes/specs.js
node --check routes/agents.js
node --check routes/workflows.js
node --check routes/memory.js
node --check routes/settings.js
node --check app/js/main.js
```

Also run `node --check` for every new frontend and backend helper module.

### API Checks

With the server running:

```powershell
Invoke-RestMethod http://localhost:3000/api/projects
Invoke-RestMethod http://localhost:3000/api/specs
Invoke-RestMethod http://localhost:3000/api/agents
Invoke-RestMethod http://localhost:3000/api/workflows/runs
Invoke-RestMethod http://localhost:3000/api/memory/context
Invoke-RestMethod http://localhost:3000/api/settings/status
```

Verify:

- JSON responses are valid
- Empty states are handled
- No endpoint returns fake entities
- Query helpers do not expose unsafe local file contents

### Browser Checks

Verify at desktop and mobile widths:

- `/`
- `/dashboard.html`
- `/files.html`
- `/projects.html`
- `/specs.html`
- `/agents.html`
- `/workflows.html`
- `/memory.html`
- `/settings.html`

For every new page:

- Sidebar active state is correct
- Mobile nav opens and closes
- Search/filter works
- Row selection works
- Inspector updates
- Long paths wrap without breaking layout
- Empty/error/loading states are readable
- No mock claims remain visible

### Regression Checks

Home, Dashboard, and Files should remain intact. Files is especially important because it is the source of the repo data these pages depend on.

Check:

- Repo upload form still works
- GitHub import still works
- Saved repos still render
- Collapsible Files cards still behave correctly
- Nested `<details>` inside generated analysis cards still operate independently
- Action logs still load and filter

---

## Final Target

After this implementation, the sidebar pages should feel like real parts of `studio-1` because they are constrained by actual backend truth:

- Projects are saved repos with derived project intelligence.
- Specs are real documentation/spec-like files.
- Agents show actual agent readiness and evidence, not fictional execution.
- Workflows are real event histories grouped into runs.
- Memory is local context, not imaginary saved prompts.
- Settings are real runtime and filter configuration.

The result is not the final product model. It is the honest foundation that makes the next product model worth adding.
