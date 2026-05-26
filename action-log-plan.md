# App-Wide Stateless Logging Plan

## Purpose

The logging system records important interactions, system steps, decisions, warnings, and errors across the entire `studio-1` app.

It is not exclusive to Repo Map intake.

It should be a reusable, stateless event system that any feature can use:

- Repo Map Intake
- Repo Scanner
- Dashboard
- Studio Workspace
- Components View
- Routes View
- Config View
- Future AI tools
- Future repo editing tools

Each feature should be able to create its own specialized log view from the same shared event shape.

## Core Principle

The logger should be stateless.

That means:

- the logger does not own workflow state
- the logger does not decide what step comes next
- the logger does not mutate feature data
- the logger only records events that happened
- any feature can emit events
- any component can read/filter/render events

The app state lives in feature-specific data.

The log records the path through that state.

## Why This Matters

A stateless logger lets `studio-1` answer questions like:

- What did the user do?
- What did the app do?
- What source triggered the action?
- What changed?
- What failed?
- What was skipped?
- What was saved?
- Which feature did this belong to?
- Which repo, file, component, route, or workflow was involved?

The same event system should explain both small UI actions and larger backend workflows.

## Event Shape

Every log event should use one shared shape:

```json
{
  "id": "evt_1779840000000_a1b2c3",
  "timestamp": "2026-05-26T20:00:00.000Z",
  "level": "info",
  "area": "repo_map",
  "source": "local_upload",
  "phase": "filter",
  "action": "files_filtered",
  "message": "435 scannable files selected. 58,535 files skipped.",
  "details": {
    "selectedFiles": 58970,
    "keptFiles": 435,
    "skippedFiles": 58535
  },
  "entity": {
    "type": "repo",
    "id": null,
    "name": "luis_ruiz_2"
  },
  "correlationId": "corr_1779840000000_d4e5f6",
  "requestId": "req_1779840000000_f7g8h9",
  "parentEventId": null
}
```

## Required Fields

| Field | Type | Required | Description |
|---|---:|---:|---|
| `id` | string | yes | Unique event ID. |
| `timestamp` | string | yes | ISO timestamp when the event happened. |
| `level` | string | yes | `debug`, `info`, `success`, `warning`, or `error`. |
| `area` | string | yes | App area or feature, such as `repo_map`, `dashboard`, `studio`, `scanner`, `settings`. |
| `source` | string | yes | Event source, such as `ui`, `github`, `local_upload`, `sqlite`, `api`, `scanner`, `system`. |
| `phase` | string | yes | Workflow phase, such as `input`, `validate`, `filter`, `clone`, `save`, `display`. |
| `action` | string | yes | Machine-readable action name. |
| `message` | string | yes | Human-readable summary. |
| `details` | object | no | Structured details for analysis. |
| `entity` | object/null | no | Main object involved in the event. |
| `correlationId` | string/null | no | Groups events from one user journey or workflow. |
| `requestId` | string/null | no | Groups events from one API request. |
| `parentEventId` | string/null | no | Allows event chains when needed. |

## Entity Shape

The `entity` field links events to app objects without making the logger stateful.

```json
{
  "type": "repo",
  "id": "1779840000000-a1b2c3",
  "name": "studio-1"
}
```

Common entity types:

- `repo`
- `file`
- `component`
- `route`
- `function`
- `class`
- `config`
- `document`
- `workflow`
- `agent`
- `user_action`
- `system_task`

## Log Levels

### `debug`

Low-level diagnostic events.

Examples:

- filter rules loaded
- request payload prepared
- API response parsed
- scanner rule matched

### `info`

Normal user or system action.

Examples:

- page loaded
- tab selected
- GitHub URL entered
- folder selected
- scan started

### `success`

Completed action.

Examples:

- GitHub clone succeeded
- SQLite save succeeded
- repo displayed
- component classification completed

### `warning`

Non-fatal issue.

Examples:

- many files skipped
- selected folder is very large
- stale input exists while another action starts
- no scannable files found
- slow operation detected

### `error`

Failed action.

Examples:

- GitHub clone failed
- upload failed
- SQLite insert failed
- server returned invalid JSON
- scanner crashed

## App Areas

The `area` field specializes logs by feature.

### `repo_map`

Events for repo input, filtering, classification, and project map generation.

### `dashboard`

Events for dashboard loading, display, panels, saved repo selection, and summary widgets.

### `studio`

Events for opening, viewing, and working inside the studio space.

### `scanner`

Events for stack detection, file classification, dependency extraction, and future code analysis.

### `settings`

Events for app config, preferences, and future API/auth settings.

### `system`

Events for server startup, database setup, shared API failures, and app-level health.

## Sources

The `source` field describes where the event came from.

Common sources:

- `ui`
- `api`
- `github`
- `local_upload`
- `sqlite`
- `scanner`
- `system`
- `worker`
- `agent`

Sources are not tied to one area.

Example:

`sqlite` can appear in `repo_map`, `scanner`, `dashboard`, or `settings`.

## Feature-Specialized Logs

Every feature should be able to render a filtered view of the same event stream.

Examples:

- Repo Map Action Log: `area = repo_map`
- GitHub Import Log: `area = repo_map`, `source = github`
- Scanner Log: `area = scanner`
- Current Repo Log: `entity.type = repo`, `entity.id = selectedRepoId`
- Error Log: `level = error`
- Studio Activity Log: `area = studio`

This avoids creating separate logging systems for each feature.

## Component Model

The app should create reusable logging components.

### `ActionLogPanel`

Displays a list of events.

Inputs:

- `events`
- `filters`
- `title`
- `emptyMessage`

### `ActionLogRow`

Displays one event.

Shows:

- timestamp
- level
- area
- source
- action
- message
- expandable details

### `ActionLogFilters`

Lets the user filter events.

Common filters:

- All
- Errors
- Warnings
- Success
- Current Area
- Current Entity
- Source

### `ActionLogDrawer`

Optional global drawer for app-wide debugging.

Can show events from every feature.

### `FeatureActionLog`

Small wrapper that pre-filters events for one feature.

Example:

```js
FeatureActionLog({
  area: "repo_map",
  entityType: "repo",
  entityId: selectedRepoId
});
```

## Frontend Logger

The frontend should expose a small stateless utility:

```js
logEvent({
  level: "info",
  area: "repo_map",
  source: "local_upload",
  phase: "filter",
  action: "files_filtered",
  message: "435 scannable files selected. 58,535 files skipped.",
  details: {
    selectedFiles: 58970,
    keptFiles: 435,
    skippedFiles: 58535
  },
  entity: {
    type: "repo",
    id: null,
    name: "luis_ruiz_2"
  },
  correlationId: "corr_1779840000000_d4e5f6"
});
```

The frontend logger should:

- create a complete event object
- render the event immediately in subscribed UI components
- send the event to the backend for persistence
- never decide workflow state
- never block the user action if persistence fails

## Backend Logger

The backend should expose a stateless `recordEvent` function:

```js
recordEvent({
  level: "success",
  area: "repo_map",
  source: "sqlite",
  phase: "save",
  action: "files_insert_succeeded",
  message: "435 file records saved.",
  details: {
    fileCount: 435
  },
  entity: {
    type: "repo",
    id: "1779840000000-a1b2c3",
    name: "studio-1"
  },
  correlationId: "corr_1779840000000_d4e5f6",
  requestId: "req_1779840000000_f7g8h9"
});
```

The backend logger should:

- validate event shape
- add missing IDs and timestamps
- write events to SQLite
- never mutate feature state
- never hide the original operation error

## SQLite Table

Add this table:

```sql
CREATE TABLE IF NOT EXISTS action_events (
  id TEXT PRIMARY KEY,
  timestamp TEXT NOT NULL,
  level TEXT NOT NULL,
  area TEXT NOT NULL,
  source TEXT NOT NULL,
  phase TEXT NOT NULL,
  action TEXT NOT NULL,
  message TEXT NOT NULL,
  details_json TEXT,
  entity_type TEXT,
  entity_id TEXT,
  entity_name TEXT,
  correlation_id TEXT,
  request_id TEXT,
  parent_event_id TEXT
);
```

## API Endpoints

### `GET /api/events`

Returns recent events.

Query options:

- `limit`
- `level`
- `area`
- `source`
- `entityType`
- `entityId`
- `correlationId`
- `requestId`

### `POST /api/events`

Receives frontend events and stores them.

### `GET /api/entities/:type/:id/events`

Returns events for one app entity.

Examples:

- `/api/entities/repo/1779840000000-a1b2c3/events`
- `/api/entities/component/button/events`
- `/api/entities/route/dashboard/events`

## App-Wide Warning Rules

The logger should create warnings when:

- an action starts while stale input from another action is still present
- an operation takes longer than expected
- a server response is not valid JSON
- persistence succeeds but display refresh fails
- selected input is unusually large
- an expected related entity ID is missing
- user action triggers no visible result
- a backend operation partially succeeds

## Repo Map Specialized Events

Repo Map should use the app-wide event shape.

Required first events:

| Action | Level | Area | Source | Phase |
|---|---|---|---|---|
| `github_url_changed` | info | repo_map | ui | input |
| `github_import_clicked` | info | repo_map | ui | input |
| `github_clone_started` | info | repo_map | github | clone |
| `github_clone_succeeded` | success | repo_map | github | clone |
| `github_clone_failed` | error | repo_map | github | clone |
| `local_folder_selected` | info | repo_map | local_upload | input |
| `local_files_filtered` | info | repo_map | local_upload | filter |
| `local_file_count_high` | warning | repo_map | local_upload | filter |
| `local_upload_started` | info | repo_map | local_upload | upload |
| `repo_saved` | success | repo_map | sqlite | save |
| `repo_displayed` | success | repo_map | ui | display |

## Future Scanner Specialized Events

The scanner should use the same app-wide event shape.

Examples:

| Action | Level | Area | Source | Phase |
|---|---|---|---|---|
| `scan_started` | info | scanner | scanner | start |
| `stack_detection_started` | info | scanner | scanner | detect |
| `stack_detected` | success | scanner | scanner | detect |
| `file_classification_started` | info | scanner | scanner | classify |
| `file_classified` | debug | scanner | scanner | classify |
| `project_map_generated` | success | scanner | scanner | output |
| `scan_failed` | error | scanner | scanner | error |

## UI Behavior

There should be two levels of log UI:

1. Global Action Log
2. Feature-specific Action Logs

The Global Action Log shows everything.

Feature-specific logs show only relevant events.

For example:

- Repo Map page shows Repo Map events.
- Scanner page shows Scanner events.
- Dashboard can show current repo events.

## What This Logger Should Prevent

This logger should prevent confusion about:

- which action is currently being tested
- whether GitHub import or local upload produced the current displayed repo
- whether skipped files were uploaded or ignored before upload
- whether SQLite saved the repo
- whether display data came from the latest action or an older saved entity
- whether an error came from UI, API, GitHub, scanner, SQLite, or system code
- whether future studio actions are tied to a repo, file, component, route, or workflow

## Minimum Useful First Version

The first implementation should include:

- shared event shape
- SQLite `action_events` table
- `recordEvent` backend utility
- `logEvent` frontend utility
- `GET /api/events`
- `POST /api/events`
- app-wide `ActionLogPanel`
- Repo Map specialized log panel using `area = repo_map`

## Correct Next Step

Implement the stateless app-wide event logger first, then plug Repo Map intake into it as the first specialized feature log.
