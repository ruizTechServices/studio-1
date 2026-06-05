# Prompt For Implementing Real Pages

You are working in this repo:

```txt
C:\Users\giost\CascadeProjects\projects\application-studio\studio-1
```

Your task is to implement the plan in:

```txt
REAL_PAGES_IMPLEMENTATION_PLAN.md
```

Follow the plan from beginning to end. Treat it as the product and engineering source of truth for converting the mock sidebar pages into real backend-backed pages.

## Core Objective

Turn these currently mock pages into pages that use real backend data as much as the current server allows:

- `app/projects.html`
- `app/specs.html`
- `app/agents.html`
- `app/workflows.html`
- `app/memory.html`
- `app/settings.html`

Keep these existing pages intact unless a small shared consistency change is necessary:

- `app/index.html`
- `app/dashboard.html`
- `app/files.html`

The new pages must stop presenting invented product state. They should reflect actual backend truth from saved repos, repo files, repo analysis helpers, action events, filter rules, and server/database metadata.

## Important Repository Context

The backend currently has a compact data model:

- `repos`
- `repo_files`
- `action_events`

The app does not currently persist real projects, specs, agents, workflows, memory items, users, billing, integrations, or editable settings.

The first implementation should therefore be evidence-backed and honest:

- Projects are repo-backed projects.
- Specs are documentation/spec-like files.
- Agents show runtime-not-connected plus real AI/agent evidence.
- Workflows are grouped action-event runs.
- Memory is local context from repos, docs, recovery hints, and event history.
- Settings are read-only runtime/filter/storage status.

Do not create fake persisted entities just to satisfy UI copy.

## Dirty Worktree Rules

Before editing, inspect the current git status.

There may already be dirty files from previous work, including:

- Files page collapsible card edits
- Sidebar/layout changes
- New mock page scaffolding
- An untracked `update_prompt_before_llm_implementation.md`

Follow these rules:

- Do not revert existing dirty files.
- Do not touch unrelated dirty files.
- Do not touch `update_prompt_before_llm_implementation.md` unless explicitly required.
- Read dirty files carefully before editing them.
- Keep changes scoped to implementing the real pages plan.
- Be careful with `app/js/data/nav-items.js`; this repo ignores `data/` directories, so explicit handling may be required if staging later.

## Implementation Cycle

### 1. Orient In The Codebase

Read the implementation plan first:

```powershell
Get-Content -Raw REAL_PAGES_IMPLEMENTATION_PLAN.md
```

Then inspect:

- `server.js`
- `routes/index.js`
- `routes/repos.js`
- `routes/events.js`
- `routes/entities.js`
- `routes/meta.js`
- `lib/db.js`
- `lib/index.js`
- `lib/repos/*.js`
- `lib/events/*.js`
- `app/js/core/api.js`
- `app/js/main.js`
- `app/js/features/repo-intake/repo-api.js`
- `app/js/features/repo-intake/repo-controller.js`
- `app/js/features/mock-page/*`
- the six new HTML page files
- relevant CSS imports and page CSS files

Confirm the current API routes, current database schema, and current frontend page initialization before changing code.

### 2. Add Backend Aggregate Routes

Implement thin backend aggregate endpoints that reuse existing helpers instead of duplicating behavior.

Add these routes:

- `GET /api/projects`
- `GET /api/specs`
- `GET /api/agents`
- `GET /api/workflows/runs`
- `GET /api/memory/context`
- `GET /api/settings/status`

Recommended route files:

- `routes/projects.js`
- `routes/specs.js`
- `routes/agents.js`
- `routes/workflows.js`
- `routes/memory.js`
- `routes/settings.js`

Mount them in `routes/index.js`.

Recommended helper files:

- `lib/projects/projectList.js`
- `lib/specs/specCandidates.js`
- `lib/agents/agentEvidence.js`
- `lib/workflows/workflowRuns.js`
- `lib/memory/contextSources.js`
- `lib/settings/settingsStatus.js`

Export new helpers from `lib/index.js`.

Use the existing `db` instance and existing helpers:

- `repoSummary`
- `projectMap`
- `projectSummary`
- `symbolMap`
- `dependencyMap`
- `behaviorMap`
- `algorithmMap`
- `recoveryAssistant`
- `eventsForQuery`

Do not read arbitrary full file contents for new pages unless the plan explicitly requires it. Prefer metadata already in SQLite.

### 3. Backend Behavior Requirements

#### Projects API

Return repo-backed projects derived from `repos`, `repo_files`, `projectSummary`, and recent events.

Each project should include:

- repo id
- name
- source type
- file totals
- byte totals
- created timestamp
- detected project type
- confidence
- primary language
- frameworks
- main areas
- missing/light areas
- recent events

#### Specs API

Return documentation/spec candidates by joining `repo_files` to `repos`.

Candidate signals:

- `category = 'documentation'`
- `.md` or `.mdx`
- paths containing `spec`, `prd`, `rfc`, `requirements`, `readme`, `docs`, `design`, `architecture`, `decision`, or `adr`

Do not invent approval status, version, owner, review state, or coverage.

#### Agents API

Return:

- `runtime.connected = false`
- a clear message that no agent runtime is exposed by the backend
- AI/agent-related files from `aiLogic`
- agent/AI-related events when present

Do not show fake running agents or queues.

#### Workflows API

Use `action_events` as real run history.

Group events by:

1. `correlation_id`
2. else `request_id`
3. else standalone event id

Classify runs such as:

- GitHub import
- Local upload
- Repo delete
- Server startup
- API error
- UI display/logging

Return summary counts and per-run timeline data.

#### Memory API

Return local context sources:

- repos
- documentation/spec candidates
- recovery assistant next steps
- recent action events

Also return `store.connected = false` with an honest message that no dedicated memory table exists yet.

#### Settings API

Return read-only status:

- repo count
- repo file count
- action event count
- filter rules
- runtime/API status
- persistence type

Do not invent members, billing, integrations, plan state, or notification preferences.

### 4. Add Shared Frontend API Helpers

Create:

```txt
app/js/features/studio-api.js
```

Use `apiGet` from:

```txt
app/js/core/api.js
```

Add helpers:

- `fetchProjects()`
- `fetchSpecs()`
- `fetchAgents()`
- `fetchWorkflowRuns()`
- `fetchMemoryContext()`
- `fetchSettingsStatus()`

Keep parsing/error handling centralized. Do not duplicate `readApiJson` behavior.

### 5. Replace Mock Page Initializers

In `app/js/main.js`, replace the six `initMockPage()` initializers with page-specific initializers:

- `initProjectsPage()`
- `initSpecsPage()`
- `initAgentsPage()`
- `initWorkflowsPage()`
- `initMemoryPage()`
- `initSettingsPage()`

Keep existing `home`, `dashboard`, and `files` initializers intact.

### 6. Implement Page-Specific Frontend Modules

Add page modules:

```txt
app/js/features/projects/projects-controller.js
app/js/features/projects/projects-render.js
app/js/features/specs/specs-controller.js
app/js/features/specs/specs-render.js
app/js/features/agents/agents-controller.js
app/js/features/agents/agents-render.js
app/js/features/workflows/workflows-controller.js
app/js/features/workflows/workflows-render.js
app/js/features/memory/memory-controller.js
app/js/features/memory/memory-render.js
app/js/features/settings/settings-controller.js
app/js/features/settings/settings-render.js
```

Each controller should:

- Render a loading state.
- Fetch its backend endpoint.
- Render real data.
- Render a readable error state on failure.
- Support search/filtering where appropriate.
- Support row selection and inspector updates where appropriate.

Each render module should:

- Escape dynamic HTML using existing formatter helpers where available.
- Avoid fake claims in copy.
- Handle empty arrays gracefully.
- Keep long repo paths readable on mobile.
- Avoid nested cards inside cards.

### 7. Update HTML Containers

The six page HTML files currently use:

```html
<main class="mock-workspace">
  <div data-include="./components/mock-page/mock-page.html"></div>
</main>
```

Replace this with real page containers or shared neutral containers.

Acceptable direction:

```html
<main class="studio-page-workspace">
  <section class="studio-page" id="projectsPage" aria-live="polite"></section>
</main>
```

Use the matching page id for each page.

Do not change Home, Dashboard, or Files structure unless needed for shared shell consistency.

### 8. Replace Or Rename Mock CSS

The current mock styling lives in:

```txt
app/css/pages/mock-pages.css
```

Either:

- keep the file temporarily but rename class usage away from `mock-*`, or
- create a new shared page stylesheet such as `app/css/pages/studio-pages.css`.

Update `app/css/main.css` imports accordingly.

The UI should feel like a real operational workspace:

- compact stat strip
- searchable table/list
- inspector panel
- evidence/timeline sections
- clear empty states
- no fake marketing copy

### 9. Remove Mock Infrastructure When Safe

After all six pages are migrated and no page imports/includes mock infrastructure, remove:

- `app/js/features/mock-page/mock-page-data.js`
- `app/js/features/mock-page/mock-page-controller.js`
- `app/js/features/mock-page/mock-page-render.js`
- `app/components/mock-page/mock-page.html`

Only remove `app/css/pages/mock-pages.css` if its styles have been replaced and no file imports it.

### 10. Verification

Run syntax checks:

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

Also run `node --check` on every new helper/controller/render module.

Start the server:

```powershell
npm run dev
```

Test API endpoints:

```powershell
Invoke-RestMethod http://localhost:3000/api/projects
Invoke-RestMethod http://localhost:3000/api/specs
Invoke-RestMethod http://localhost:3000/api/agents
Invoke-RestMethod http://localhost:3000/api/workflows/runs
Invoke-RestMethod http://localhost:3000/api/memory/context
Invoke-RestMethod http://localhost:3000/api/settings/status
```

Verify pages in browser at desktop and mobile widths:

- `http://localhost:3000/`
- `http://localhost:3000/dashboard.html`
- `http://localhost:3000/files.html`
- `http://localhost:3000/projects.html`
- `http://localhost:3000/specs.html`
- `http://localhost:3000/agents.html`
- `http://localhost:3000/workflows.html`
- `http://localhost:3000/memory.html`
- `http://localhost:3000/settings.html`

For every new page, verify:

- loading state
- populated state
- empty state where possible
- error state where practical
- search/filter behavior
- row selection
- inspector updates
- sidebar active state
- mobile nav drawer
- no text overlap
- long paths wrap cleanly
- no fake product state remains

For regression, verify Files still works:

- repo upload
- GitHub import
- repo delete
- saved repo selection
- generated analysis cards
- collapsible cards
- nested details sections
- action log filtering

### 11. Final Reporting

At the end, report:

- What backend routes were added.
- What frontend pages were converted.
- What mock files were removed or preserved.
- Any existing pages changed for consistency.
- What tests/checks passed.
- Any checks that could not be run.
- Any remaining honest limitations, especially missing persisted models for specs, agents, workflows, memory, and settings.

Do not claim the pages are fully product-complete if they are only backend-evidence-backed. The desired outcome is an honest real-data foundation, not a new mock layer.
