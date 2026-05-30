# studio-1 Current Project Handoff

_Last updated: 2026-05-28_

## Purpose of this file

This file replaces the older handoff/history files:

- `docs/recent_modifications_5-27-2026.md`
- `docs/LLM_HANDOFF_2026-05-26.md`

Those files can be deleted after this file is added and committed.

This file is the current root-level handoff for `studio-1`. It should be read first by any LLM, coding agent, or future developer before making changes.

---

## Current branch and repo state

Current branch:

```bash
main
```

Latest known local and remote head:

```bash
5cdd2f6 (HEAD -> main, origin/main, origin/feature/project-map-v1, feature/project-map-v1) fix: clean project map response and remove temp file
```

Recent commits:

```bash
5cdd2f6 fix: clean project map response and remove temp file
044b1f4 feat: add Project Map v1 (GET /api/repos/:id/project-map + UI panel)
3d6b77c docs: move current handoff to root and remove stale handoffs
f5e044e docs: clarify home route and frontend initialization
4312fc9 updated index.html
```

Current known state:

```text
main is aligned with origin/main.
Project Map v1 is merged into main.
The old handoff files were removed.
The current handoff is root-level at CURRENT_PROJECT_HANDOFF.md.
```

Working tree status from the latest known check was clean enough that `git status --short` printed no modified/untracked files.

Official repo:

```text
https://github.com/ruizTechServices/studio-1.git
```

Important rule:

> The repo is the source of truth. Always confirm the current branch before giving implementation advice.

Current branch:

```bash
main
````

Latest known local and remote head:

```bash
4312fc9 (HEAD -> main, origin/main) updated index.html
```

Recent commits:

```bash
4312fc9 updated index.html
a762cee updated docs folder all docs here all .md files go here except neccessary root .md files
18e3f02 Merge pull request #2 from ruizTechServices/refactor/manual-vanilla-components
98e9fb5 Refactor repo intake page into files workspace
6fe4c05 chore: refactored and cleaned up code
```

Working tree status from the latest known check was clean enough that `git status --short` printed no modified/untracked files.

Official repo:

```text
https://github.com/ruizTechServices/studio-1.git
```

Important rule:

> The repo is the source of truth. Always confirm the current branch before giving implementation advice.

---

## Current project identity

`studio-1` is a local-first project recovery and project-mapping studio.

Its purpose is to help Gio import or upload a codebase, inspect the project structure, classify files, preserve app activity in logs, and eventually generate a usable project map that helps answer questions like:

* What did I work on?
* What files exist?
* What kind of app is this?
* What are the pages, routes, components, APIs, docs, tests, database files, auth logic, payment logic, and AI logic?
* Where did I leave off?
* What should I work on next?

This app is not currently a React/Vite/Next/Svelte app. It is an Express-served vanilla frontend with modular JavaScript, HTML partials, CSS, SQLite persistence, and API routes.

---

## Current runtime

Start the app with:

```bash
npm start
```

or:

```bash
npm run dev
```

Both run:

```bash
node server.js
```

Open the app through the Express server:

```text
http://localhost:3000
```

Do not test the app through a static file server like:

```text
127.0.0.1:5500/app/index.html
```

That will serve HTML/CSS/JS only and will not provide `/api/*` routes.

---

## Current package setup

`package.json` defines:

```json
{
  "name": "studio-1",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^5.1.0",
    "multer": "^2.0.2",
    "zod": "^4.4.3"
  }
}
```

Important runtime detail:

* The app uses Node's experimental `node:sqlite` `DatabaseSync` API.
* Node may emit an experimental warning for `node:sqlite`.
* That warning is expected in the current implementation.

---

## Current architecture overview

The app is now organized around clear separation of concerns.

High-level shape:

```text
server.js
  -> Express composition root

routes/
  -> API resource routers

lib/
  -> backend helpers, database, validation, middleware, repo/file logic

app/
  -> static frontend shell, HTML pages, partials, JS modules, CSS
```

---

## Backend composition root

`server.js` is intentionally small.

Current responsibilities:

1. Create the Express app.
2. Serve static files from `app/`.
3. Parse JSON with `express.json()`.
4. Attach request IDs.
5. Serve `/` from `app/index.html`.
6. Mount `/api` through `routes/index.js`.
7. Use centralized error handling.
8. Start the HTTP server.
9. Record a `server_started` event.

Current conceptual flow:

```text
create app
-> serve static app directory
-> parse JSON
-> attach requestId
-> GET /
-> mount /api router
-> error handler
-> listen
-> log startup event
```

`server.js` should remain a composition root. Do not move route logic or helper logic back into it.

---

## Backend routes

Routes are split by resource.

Current route index:

```text
routes/index.js
```

Mounts:

```text
/api/repos     -> routes/repos.js
/api/events    -> routes/events.js
/api/entities  -> routes/entities.js
/api           -> routes/meta.js
```

Current API surface:

```text
GET    /api/filter-rules

GET    /api/repos
GET    /api/repos/:id
GET    /api/repos/:id/project-map
POST   /api/repos/upload
POST   /api/repos/import-github
DELETE /api/repos/:id

GET    /api/events
POST   /api/events

GET    /api/entities/:type/:id/events
```

No API paths should be casually renamed. The frontend depends on this contract.

`GET /api/repos/:id/project-map` is now implemented and returns a structured, read-only Project Map built from stored `repo_files`.
---

## Backend lib structure

Backend helpers live under `lib/`.

Important folders/files:

```text
lib/config.js
lib/paths.js
lib/db.js
lib/index.js

lib/ids/
lib/events/
lib/fileFuncs/
lib/github/
lib/repos/
lib/middleware/
lib/validation/
```

### `lib/index.js`

This is a backend barrel module.

It exports the shared DB instance, config/path constants, ID helpers, event helpers, file helpers, GitHub helpers, and repo helpers.

This file exists to keep route files and `server.js` from having too many deep imports.

### `lib/config.js`

Defines file filtering configuration:

* `ignoredDirs`
* `allowedExtensions`
* `importantNames`
* `MAX_FILE_SIZE_BYTES`

Current file size limit:

```text
2 MB
2097152 bytes
```

### `lib/paths.js`

Defines and bootstraps local runtime directories:

```text
data/
data/repos/
data/imports/
data/temp/
data/studio-1.sqlite
```

### `lib/db.js`

Creates the SQLite database and schema.

Current local database path:

```text
data/studio-1.sqlite
```

Current tables:

```text
repos
repo_files
action_events
```

It also removes orphan repo rows with no associated `repo_files`.

---

## SQLite tables

### `repos`

Stores imported/uploaded repo summaries.

Columns:

```text
id
name
source_type
root_path
total_files
total_bytes
created_at
```

### `repo_files`

Stores filtered file records for each repo.

Columns:

```text
id
repo_id
path
name
extension
language
size_bytes
category
```

### `action_events`

Stores append-style app events.

Columns:

```text
id
timestamp
level
area
source
phase
action
message
details_json
entity_type
entity_id
entity_name
correlation_id
request_id
parent_event_id
```

Events are used for observability, debugging, and future project history.

---

## Repo intake

The app supports two intake paths:

1. Local folder upload.
2. GitHub repo URL import.

### Local folder upload

Frontend filters and uploads selected repo files.

The backend accepts local uploads at:

```text
POST /api/repos/upload
```

Important behavior:

* Uses `multer`.
* Applies file filtering.
* Stores accepted files under `data/repos/<repoId>/`.
* Writes repo metadata to `repos`.
* Writes file records to `repo_files`.
* Logs action events.

### GitHub import

Frontend sends a GitHub URL.

The backend accepts GitHub imports at:

```text
POST /api/repos/import-github
```

Important behavior:

* Validates the GitHub repo URL.
* Normalizes the URL to `.git` when needed.
* Clones with:

```bash
git clone --depth=1 --single-branch
```

* Stores imported repo files under:

```text
data/imports/<repoId>/<repoName>/
```

* Scans and filters files.
* Writes repo metadata and file records.
* Logs clone started, clone succeeded/failed, and repo saved events.

---

## File filtering

Current ignored directories include:

```text
.git
.next
.nuxt
.svelte-kit
.turbo
.cache
.parcel-cache
node_modules
dist
build
coverage
out
target
vendor
.venv
venv
__pycache__
.idea
.vscode
```

Current allowed extensions include:

```text
.js
.jsx
.ts
.tsx
.mjs
.cjs
.py
.rb
.go
.rs
.java
.php
.cs
.swift
.kt
.html
.css
.scss
.sql
.json
.md
.mdx
.yaml
.yml
.toml
```

Current max file size:

```text
2097152 bytes
```

Current verified API response:

```bash
curl http://localhost:3000/api/filter-rules
```

Expected shape:

```json
{
  "ignoredDirs": ["..."],
  "allowedExtensions": ["..."],
  "maxFileSizeBytes": 2097152
}
```

---

## File categories

Repo files are classified into categories.

Known categories:

```text
components
pagesRoutes
apiEndpoints
databaseFiles
authLogic
paymentLogic
aiLogic
documentation
tests
configFiles
functions
other
```

These categories currently power the Repo Map UI.

Future Project Map v1 should build on these categories instead of inventing a separate classification system too early.

These categories now power Project Map v1.

Project Map v1 groups files by existing category instead of inventing a separate classification system.

---

## Project Map v1

Project Map v1 is implemented and merged into `main`.

Backend endpoint:

```text
GET /api/repos/:id/project-map
```

Backend helper:

```text
lib/repos/projectMap.js
```

Frontend files involved:

```text
app/components/repo/repo-project-map.html
app/components/repo/repo-page.html
app/js/features/repo-intake/repo-api.js
app/js/features/repo-intake/repo-controller.js
app/js/features/repo-intake/repo-render.js
app/css/pages/repo-intake.css
```

Project Map v1 is read-only.

It answers:

```text
What repo is this?
How many files does it have?
What languages are present?
What category counts exist?
Where are the pages/routes?
Where are the API endpoints?
Where are the components?
Where are the docs?
Where are the tests?
Where is auth/payment/AI/database logic?
What files are unknown/other?
```

Current response shape:

```json
{
  "repo": {
    "id": "...",
    "name": "...",
    "sourceType": "...",
    "totalFiles": 67,
    "totalBytes": 539521,
    "createdAt": "..."
  },
  "summary": {
    "primaryLanguages": ["typescript", "markdown", "json", "javascript", "css"],
    "categoryCounts": {
      "components": 24,
      "documentation": 13,
      "pagesRoutes": 8
    },
    "languageCounts": {
      "typescript": 44,
      "markdown": 16
    }
  },
  "sections": {
    "pagesRoutes": [],
    "apiEndpoints": [],
    "components": [],
    "databaseFiles": [],
    "authLogic": [],
    "paymentLogic": [],
    "aiLogic": [],
    "documentation": [],
    "tests": [],
    "configFiles": [],
    "functions": [],
    "other": []
  }
}
```

Current verified behavior:

```text
Project Map panel appears on files.html.
Category sections render as expandable sections.
Language tags render in the Project Map header.
Switching repos updates the Project Map.
No browser console errors were observed during the latest check.
```
---

## Repo deletion

The app supports repo deletion through:

```text
DELETE /api/repos/:id
```

Delete behavior:

1. Validate `:id`.
2. Look up the repo row.
3. Verify the target path is inside the app's `data/` directory.
4. Delete stored repo files/folders.
5. Delete `repo_files`.
6. Delete the `repos` row.
7. Log `repo_deleted`.

For GitHub imports, deletion also removes the parent import folder under:

```text
data/imports/<repoId>
```

Important safety rule:

* Deletion must never remove paths outside `data/`.
* Keep `assertDataPath()` or equivalent guard in place.

---

## Event logging

The app uses a stateless append-style action log.

Important event concepts:

```text
id
timestamp
level
area
source
phase
action
message
details
entity
correlationId
requestId
parentEventId
```

Current event levels:

```text
debug
info
success
warning
error
```

Important event actions currently observed:

```text
server_started
local_folder_selected
local_files_filtered
local_file_count_high
local_upload_started
repo_saved
repo_displayed
github_url_changed
github_import_clicked
github_clone_started
github_clone_succeeded
github_clone_failed
repo_delete_clicked
repo_deleted
repo_delete_missing
repo_delete_failed
repo_removed_from_view
api_request_failed
```

Current verified command:

```bash
curl http://localhost:3000/api/events
```

This returns recent events, including startup events, repo intake events, repo delete events, validation errors, and clone errors.

Known issue:

* `repo_displayed` events are noisy because clicking/displaying repos emits events.
* This is acceptable for now.
* Later, throttle/dedupe or move display telemetry behind a debug mode.

---

## Request validation

Input validation exists under:

```text
lib/validation/
```

Important files:

```text
lib/validation/validate.js
lib/validation/schemas.js
lib/validation/index.js
```

The validator supports:

```js
validate({ params, query, body })
```

Important Express 5 detail:

* `req.query` is read-only.
* The validator gates `params` and `query` without reassigning them.
* Only `req.body` is replaced with the parsed result.

Current schemas include:

```text
repoIdParams
deleteRepoBody
importGithubBody
entitiesParams
eventsQuery
```

Validation is wired into:

```text
POST   /api/repos/import-github
GET    /api/repos/:id
DELETE /api/repos/:id
GET    /api/events
GET    /api/entities/:type/:id/events
```

Current verified validation check:

```bash
curl "http://localhost:3000/api/events?limit=abc"
```

Expected response:

```json
{
  "error": "limit: limit must be a positive integer.",
  "requestId": "..."
}
```

---

## Error handling

Centralized error handling exists at:

```text
lib/middleware/errorHandler.js
```

Behavior:

| Error type           | Client response                         |
| -------------------- | --------------------------------------- |
| `ZodError`           | `400` with readable field-level message |
| `multer.MulterError` | `400` with safe multer message          |
| Safe 4xx error       | Passes through 4xx status/message       |
| Unknown/server error | `500` with generic `"Server error"`     |

Every error response includes:

```json
{
  "error": "...",
  "requestId": "..."
}
```

Important security behavior:

* Client responses do not expose stack traces.
* Client responses do not expose Git stderr for 5xx clone errors.
* Client responses do not expose local filesystem paths for 5xx errors.
* Full details are logged server-side through `recordEventSafely()` with `requestId`.

This is intentional.

Do not undo this by returning `error.message` for all errors.

---

## GitHub URL validation

GitHub URL validation is centralized in:

```text
lib/github/assertGitHubUrl.js
```

It exports:

```js
GITHUB_URL_REGEX
assertGitHubUrl()
```

The validation schema and runtime assertion share the same regex.

Malformed GitHub URLs should return `400`, not `500`.

---

## Frontend architecture

The frontend lives under:

```text
app/
```

Current frontend style:

```text
vanilla HTML
vanilla CSS
vanilla JavaScript modules
HTML partials
page-level initializers
```

This is not currently React, Next.js, SvelteKit, Vite, or TypeScript.

Important frontend files/folders:

```text
app/index.html
app/files.html
app/dashboard.html

app/css/main.css

app/components/
app/components/shell/
app/components/repo/

app/js/main.js
app/js/core/
app/js/data/
app/js/features/
```

Older references to:

```text
app/script.js
app/styles.css
```

are stale. Do not recreate those files unless there is a deliberate reason.

---

## Current frontend routes/pages

### `/`

File:

```text
app/index.html
```

Current role:

```text
Main Home Page
```

This is the primary home route for `studio-1`. It is not a placeholder route. The home page may still be visually incomplete and will be redesigned later, but `/` should always be treated as the main product home page.

Current body page:

```html
<body data-page="home">
```

Expected structure:

```html
<div class="product-shell">
  <div data-include="./components/shell/sidebar.html"></div>

  <main class="home-workspace">
    <div data-include="./components/home/home-page.html"></div>
  </main>
</div>
```

The home page has a matching page initializer in:

```text
app/js/features/home/home-controller.js
```

`app/js/main.js` includes a `home` initializer:

```js
home: async () => {
  const { initHomePage } = await import("./features/home/home-controller.js");
  initHomePage();
},
```

The home initializer should handle home-specific behavior only.

Shared behavior belongs in `app/js/main.js`, including:

```text
partial loading
icon rendering
primary nav rendering
shared toast click handling
page initializer dispatch
```

---

### `/files.html`

File:

```text
app/files.html
```

Current role:

```text
Repo intake / Files workspace
```

Current body page:

```html
<body data-page="files">
```

Current content:

```html
<main class="files-workspace">
  <div data-include="./components/repo/repo-page.html"></div>
</main>
```

This is where the repo intake UI belongs.

Current Files workspace features:

```text
local folder upload
GitHub repo import
saved repo list
repo detail panel
repo deletion
Project Map panel
Repo Map action log
Global action log
```

---

### `/dashboard.html`

File:

```text
app/dashboard.html
```

Current role:

```text
Dashboard page
```

Current body page:

```html
<body data-page="dashboard">
```

---

## Frontend initialization

`app/js/main.js` owns shared startup behavior.

Startup flow:

```text
load HTML partials
render icon placeholders
read document.body.dataset.page
render primary nav
attach shared toast click handling
run the matching page-specific initializer
```

Current page initializers include:

```js
const pageInitializers = {
  home: async () => {
    const { initHomePage } = await import("./features/home/home-controller.js");
    initHomePage();
  },

  files: async () => {
    const { initRepoIntakePage } = await import("./features/repo-intake/repo-controller.js");
    initRepoIntakePage();
  },

  dashboard: async () => {
    const { initDashboardPage } = await import("./features/dashboard/dashboard-controller.js");
    initDashboardPage();
  },
};
```

Rules:

- Add new page behavior by adding a new initializer entry.
- Do not create a chain of `if/else` page checks.
- Do not put page-specific behavior directly into `main.js`.
- Keep `main.js` as the shared bootloader.
- Keep each page’s behavior in its own `app/js/features/<page>/` folder.
- Treat `/` as the real main home page, even if the design is temporarily incomplete.

---

## Home initializer status

Home initializer work is complete.

Relevant files:

```text
app/components/home/home-page.html
app/js/features/home/home-controller.js
app/js/features/home/home-render.js
app/index.html
app/js/main.js
app/css/main.css
```

Manual browser checks:

```text
http://localhost:3000
http://localhost:3000/files.html
http://localhost:3000/dashboard.html
```

Expected behavior:

```text
/ loads the main home page
/files.html loads the repo intake workspace
/dashboard.html loads the dashboard
```

---

## Frontend initialization

`app/js/main.js` owns shared startup behavior.

Startup flow:

```text
load HTML partials
render icon placeholders
read document.body.dataset.page
render primary nav
attach shared toast click handling
run the matching page-specific initializer
```

Current page initializers should include:

```js
const pageInitializers = {
  home: async () => {
    const { initHomePage } = await import("./features/home/home-controller.js");
    initHomePage();
  },

  files: async () => {
    const { initRepoIntakePage } = await import("./features/repo-intake/repo-controller.js");
    initRepoIntakePage();
  },

  dashboard: async () => {
    const { initDashboardPage } = await import("./features/dashboard/dashboard-controller.js");
    initDashboardPage();
  },
};
```

Rules:

- Add new page behavior by adding a new initializer entry.
- Do not create a chain of `if/else` page checks.
- Do not put page-specific behavior directly into `main.js`.
- Keep `main.js` as the shared bootloader.
- Keep each page’s behavior in its own `app/js/features/<page>/` folder.
- Treat `/` as the real main home page, even if the design is temporarily incomplete.

---

## Home initializer implementation checklist

Create these files:

```text
app/components/home/home-page.html
app/js/features/home/home-controller.js
app/js/features/home/home-render.js
```

Update:

```text
app/index.html
app/js/main.js
app/css/main.css
```

`app/index.html` should keep:

```html
<body data-page="home">
```

and include:

```html
<main class="home-workspace">
  <div data-include="./components/home/home-page.html"></div>
</main>
```

`app/js/main.js` should include:

```js
home: async () => {
  const { initHomePage } = await import("./features/home/home-controller.js");
  initHomePage();
},
```

Syntax-check after implementation:

```bash
node --check app/js/main.js
node --check app/js/features/home/home-controller.js
node --check app/js/features/home/home-render.js
```

Manual browser checks:

```text
http://localhost:3000
http://localhost:3000/files.html
http://localhost:3000/dashboard.html
```

Expected behavior:

```text
/ loads the main home page
/files.html loads the repo intake workspace
/dashboard.html loads the dashboard
```

Commit commands:

```bash
git status --short
node --check app/js/main.js
node --check app/js/features/home/home-controller.js
node --check app/js/features/home/home-render.js
git add app/index.html app/components/home/home-page.html app/js/main.js app/js/features/home app/css/main.css CURRENT_PROJECT_HANDOFF.md
git commit -m "feat: add home page initializer"
git push origin main
```

### `/`

File:

```text
app/index.html

Current role:

Main Home Page

This is the primary home route for studio-1. It is not a placeholder route. The home page may still be visually incomplete and will be redesigned later, but / should always be treated as the main product home page.

Current body page:

<body data-page="home">

Expected structure:

<div class="product-shell">
  <div data-include="./components/shell/sidebar.html"></div>

  <main class="home-workspace">
    <div data-include="./components/home/home-page.html"></div>
  </main>
</div>

The home page should have a matching page initializer in:

app/js/features/home/home-controller.js

and app/js/main.js should include:

home: async () => {
  const { initHomePage } = await import("./features/home/home-controller.js");
  initHomePage();
},

The home initializer should handle home-specific behavior only. Shared behavior such as partial loading, icon rendering, nav rendering, and toast click handling belongs in app/js/main.js.

/files.html

File:

app/files.html

Current role:

Repo intake / Files workspace

Current body page:

<body data-page="files">

Current content:

<main class="files-workspace">
  <div data-include="./components/repo/repo-page.html"></div>
</main>

This is where the repo intake UI belongs.

/dashboard.html

File:

app/dashboard.html

Current role:

Dashboard page

Current body page:

<body data-page="dashboard">
Frontend initialization

app/js/main.js currently owns shared startup behavior.

Startup flow:

load HTML partials
render icon placeholders
read document.body.dataset.page
render primary nav
attach shared toast click handling
run the page-specific initializer

Current page initializers should include:

const pageInitializers = {
  home: async () => {
    const { initHomePage } = await import("./features/home/home-controller.js");
    initHomePage();
  },

  files: async () => {
    const { initRepoIntakePage } = await import("./features/repo-intake/repo-controller.js");
    initRepoIntakePage();
  },

  dashboard: async () => {
    const { initDashboardPage } = await import("./features/dashboard/dashboard-controller.js");
    initDashboardPage();
  },
};

Rules:

Add new page behavior by adding a new initializer entry.
Do not create a chain of if/else page checks.
Do not put page-specific behavior directly into main.js.
Keep main.js as the shared bootloader.
Keep each page’s behavior in its own app/js/features/<page>/ folder.

## Commit commands

After implementing:

```bash
git status --short
node --check app/js/main.js
node --check app/js/features/home/home-controller.js
node --check app/js/features/home/home-render.js
git add app/index.html app/components/home/home-page.html app/js/main.js app/js/features/home app/css/main.css CURRENT_PROJECT_HANDOFF.md
git commit -m "feat: add home page initializer"
git push origin main

## Current verified local behavior

The following checks were run successfully from Git Bash on Windows:

```bash
git branch --show-current
git status --short
git log --oneline -5
```

Current branch:

```text
main
```

Current remote alignment:

```text
HEAD -> main, origin/main
```

API checks:

```bash
curl http://localhost:3000/api/filter-rules
```

Returned the expected filter rules JSON.

Validation check:

```bash
curl "http://localhost:3000/api/events?limit=abc"
```

Returned:

```json
{
  "error": "limit: limit must be a positive integer.",
  "requestId": "req_1779975865635_d9966748"
}
```

Events check:

```bash
curl http://localhost:3000/api/events
```

Returned recent event history, including:

* server startup events
* repo saves
* repo displays
* GitHub clone events
* local folder upload events
* repo deletion events
* validation errors
* clone failure logs

---

## Local data observed

The action log showed successful repo intake and deletion activity.

Observed repo examples:

```text
catherine-ruiz
paperclip
luis_ruiz_2
studio-1
```

Observed local upload behavior for `luis_ruiz_2`:

```text
58970 selected files
444 kept files
58526 skipped files
```

Observed GitHub import behavior for `paperclip`:

```text
GitHub clone started
GitHub clone succeeded
repo saved
repo displayed
```

Observed deletion behavior:

```text
repo_delete_clicked
repo_deleted
repo_removed_from_view
```

A duplicate delete attempt can produce:

```text
repo_delete_missing
Repo not found
```

That is expected if the repo was already deleted.

---

## Current docs policy

Most project planning and historical `.md` files should live under:

```text
docs/
```

Root-level Markdown should be limited to necessary entry-point files only.

This file is intentionally root-level because it is the current handoff entry point.

Recommended root-level docs:

```text
README.md
CURRENT_PROJECT_HANDOFF.md
```

Optional root-level agent docs only if needed:

```text
AGENTS.md
CLAUDE.md
```

Historical or planning docs should go under:

```text
docs/
```

---

## Files that can now be deleted

After this file is created and committed, delete:

```text
docs/recent_modifications_5-27-2026.md
docs/LLM_HANDOFF_2026-05-26.md
```

Suggested delete command:

```bash
rm docs/recent_modifications_5-27-2026.md docs/LLM_HANDOFF_2026-05-26.md
```

Then verify:

```bash
git status --short
```

---

## Suggested next engineering step

Do not jump to local model orchestration yet.

Project Map v1 is now complete.

The correct next step is:

```text
Project Summary v1
```

Reason:

The app already imports repos, filters files, categorizes files, stores metadata, logs events, and renders a Project Map. The next useful product layer is to summarize what the Project Map means.

Project Summary v1 should answer:

```text
What kind of project is this?
What framework does it appear to use?
What languages are present?
What are the main areas of the project?
Does it have routes/pages?
Does it have API endpoints?
Does it have components?
Does it have auth logic?
Does it have payment logic?
Does it have AI logic?
Does it have database logic?
Does it have tests?
Does it have documentation?
What looks missing or light based on file categories?
```

---

## Recommended Project Summary v1 scope

Build a read-only, rule-based project summary.

Do not introduce AI yet.

Do not introduce embeddings yet.

Do not introduce model routing yet.

### Backend

Add an endpoint like:

```text
GET /api/repos/:id/project-summary
```

It should:

1. Validate `repoId`.
2. Load the repo row.
3. Return `404` if the repo does not exist.
4. Reuse the existing `projectMap(row)` helper.
5. Generate a deterministic summary from the Project Map.
6. Return repo info, project type, confidence, primary language, detected frameworks, main areas, detected capabilities, missing/light areas, and evidence.

Suggested helper:

```text
lib/repos/projectSummary.js
```

Possible response shape:

```json
{
  "repo": {
    "id": "...",
    "name": "website-one"
  },
  "summary": {
    "projectType": "Next.js web application",
    "confidence": "high",
    "primaryLanguage": "typescript",
    "frameworks": ["Next.js", "React"],
    "mainAreas": [
      "dashboard",
      "authentication",
      "design system"
    ],
    "detectedCapabilities": [
      "frontend pages/routes",
      "component system",
      "authentication logic",
      "documentation/spec files"
    ],
    "missingOrLightAreas": [
      "API endpoints are missing or light",
      "database files are missing or light",
      "tests are missing or light",
      "payment logic is missing or light"
    ],
    "evidence": [
      "app/page.tsx exists",
      "app/layout.tsx exists",
      "next.config.ts exists",
      "components/ contains component files"
    ]
  }
}
```

### Frontend

Add a Project Summary panel inside the repo detail UI near the Project Map panel.

Initial UI should show:

```text
Project type
Primary language
Frameworks detected
Main areas
Detected capabilities
Missing / light areas
Evidence
```

Keep the UI simple. Cards, badges, and short lists are enough.

Do not overdesign it yet.

## Recommended smoke tests before Project Summary v1

Add or maintain a simple smoke test script before expanding functionality further.

Suggested file:

```text
scripts/smoke-api.js
```

Minimum tests:

```text
GET /api/filter-rules -> 200
GET /api/repos -> 200
GET /api/events -> 200
GET /api/events?limit=abc -> 400
POST /api/repos/import-github with bad URL -> 400
DELETE /api/repos/__missing__ -> 404
GET /api/repos/:id/project-map -> 200 for a real repo id
GET /api/repos/:id/project-summary -> 200 after Project Summary v1 is implemented
```

Keep this script simple. Do not bring in Jest/Vitest yet unless the project actually needs it.

Suggested command later:

```bash
node scripts/smoke-api.js
```

## Current risks

### 1. Event log noise

`repo_displayed` logs are useful but noisy.

Do not solve this immediately unless it blocks debugging.

Future options:

```text
dedupe repeated repo_displayed events
throttle display events
hide UI display events by default
add debug-only telemetry mode
```

### 2. Large local folder selection

The app can select massive local folders, then filter them down.

Observed example:

```text
58970 selected files
444 kept files
58526 skipped files
```

This works, but the UX should eventually warn the user earlier and more clearly.

### 3. Local `data/` is runtime-only

`data/` is ignored by Git.

This means local repo imports and SQLite logs are not portable across machines unless exported deliberately.

That is acceptable for the current local-first MVP.

### 4. No auth or multi-user isolation

There is currently no authentication, no account system, and no multi-user isolation.

That is acceptable for local-first development, but this app is not production-safe as a multi-user hosted service yet.

### 5. Do not add AI too early

The app does not yet need an LLM router.

AI should come after:

```text
repo intake
file categorization
Project Map v1
Project Summary v1
Symbol Map v1
Behavior Map v1
smoke tests
```

The current next step is Project Summary v1, not AI orchestration.

---

## Commands for current workflow

Start server:

```bash
npm start
```

Check syntax:

```bash
node --check server.js
find routes lib app/js -name "*.js" -print0 | xargs -0 -n1 node --check
```

Check Git state:

```bash
git branch --show-current
git status --short
git log --oneline -5
```

Check APIs:

```bash
curl http://localhost:3000/api/filter-rules
curl http://localhost:3000/api/repos
curl http://localhost:3000/api/events
curl "http://localhost:3000/api/events?limit=abc"
```

Check Project Map for a real repo id:

```bash
curl -s "http://localhost:3000/api/repos" > repos.tmp.json
REPO_ID=$(node -e "const repos = JSON.parse(require('fs').readFileSync('./repos.tmp.json', 'utf8')); console.log(repos[0].id)")
echo "$REPO_ID"
curl "http://localhost:3000/api/repos/$REPO_ID/project-map"
rm repos.tmp.json
```

After Project Summary v1 is implemented, also check:

```bash
curl "http://localhost:3000/api/repos/$REPO_ID/project-summary"
```

---

## Instruction for future LLMs / agents

Before making recommendations:

1. Ask what branch Gio is on.
2. Check the repo state.
3. Read this file.
4. Treat the current repo as source of truth.
5. Do not rely on old handoff files if this file exists.
6. Do not reintroduce stale paths like `app/script.js` or `app/styles.css`.
7. Do not move logic back into `server.js`.
8. Do not expose server internals in client error responses.
9. Do not jump to AI orchestration before Project Summary v1, Symbol Map v1, and Behavior Map v1 are stable.
10. Keep new work layered and deterministic before adding LLM behavior.

Current build order:

```text
Repo Intake ✅
Project Map v1 ✅
Project Summary v1 ← current next task
Symbol Map v1
Dependency Map v1
Behavior Map v1
Algorithm Map v1
Recovery Assistant
AI/local model router
```

---

## Current best next task

Build:

```text
Project Summary v1
```

Recommended first prompt for Claude, Codex, or another coding agent:

```text
Read CURRENT_PROJECT_HANDOFF.md first.

We are on branch feature/project-summary-v1.

Implement Project Summary v1 as a rule-based feature built on top of Project Map v1.

Important:
- No AI.
- No embeddings.
- No model routing.
- No project recommendations yet.
- This must be deterministic and based only on stored repo metadata, repo_files records, and the existing Project Map output.

Goal:
Add a read-only project summary layer that answers:
- What kind of project is this?
- What framework does it appear to use?
- What languages are present?
- What are the main areas of the project?
- What capabilities are detected?
- What areas look missing or light based on file categories?

Backend requirements:
1. Add GET /api/repos/:id/project-summary.
2. Reuse the existing repoIdParams validation pattern.
3. Load the repo from SQLite.
4. If the repo does not exist, return 404.
5. Reuse the existing projectMap(row) helper instead of duplicating file grouping logic.
6. Add a new helper under lib/repos/projectSummary.js.
7. Export the helper through lib/index.js if needed.
8. The response should include:
   - repo id/name
   - projectType
   - confidence
   - primaryLanguage
   - frameworks
   - mainAreas
   - detectedCapabilities
   - missingOrLightAreas
   - evidence
9. Keep server.js as the composition root.
10. Do not break GET /api/repos, GET /api/repos/:id, or GET /api/repos/:id/project-map.

Rule examples:
- If files include app/page.tsx, app/layout.tsx, next.config.ts, or package.json with Next.js-style structure, classify as "Next.js web application".
- If TypeScript is the top language, primaryLanguage should be "typescript".
- If components exist, include "component system".
- If pagesRoutes exist, include "frontend pages/routes".
- If apiEndpoints exist, include "API layer".
- If authLogic exists, include "authentication logic".
- If paymentLogic exists, include "payment logic".
- If aiLogic exists, include "AI-related logic".
- If databaseFiles exists, include "database layer".
- If tests is empty or very low, include "tests are missing or light".
- If apiEndpoints is empty, include "API endpoints are missing or light".
- If databaseFiles is empty, include "database files are missing or light".

Frontend requirements:
1. Add fetchProjectSummary(repoId) to the existing repo-intake API module.
2. Add a Project Summary panel to the repo page partial.
3. Add renderProjectSummary(data) to the existing repo-intake renderer.
4. Update the repo-intake controller so the Project Summary loads when:
   - initial repo loads
   - user selects another repo
   - user uploads a repo
   - user imports a GitHub repo
5. Keep the UI simple and readable.
6. Reuse existing architecture and styling patterns.
7. Do not add React, Vite, Next, Svelte, or any frontend framework.

Verification:
1. Run node --check on changed JS files.
2. Start the server with npm start.
3. Test GET /api/repos.
4. Test GET /api/repos/:id/project-map.
5. Test GET /api/repos/:id/project-summary.
6. Open http://localhost:3000/files.html.
7. Confirm Project Map still works.
8. Confirm Project Summary appears.
9. Confirm switching repos updates both Project Map and Project Summary.
10. Confirm no console errors.
```

---

## Bottom line

The current foundation is good enough to proceed.

Backend modularization is done.
Validation is done.
Sanitized error handling is done.
Repo intake works.
File filtering works.
SQLite persistence works.
Event logging works.
Repo deletion works.
Home initializer works.
`files.html` is the repo intake workspace.
`index.html` is the main home page.
Project Map v1 is complete and merged into main.

The next meaningful product layer is Project Summary v1.

---

## Bottom line

The current foundation is good enough to proceed.

Backend modularization is done.
Validation is done.
Sanitized error handling is done.
Repo intake works.
File filtering works.
SQLite persistence works.
Event logging works.
Repo deletion works.
`files.html` is now the repo intake workspace.
`index.html` is now a future home shell.

The next meaningful product layer is Project Map v1.    

