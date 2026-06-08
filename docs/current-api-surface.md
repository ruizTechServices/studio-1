# Current API Surface

The current API is mounted under `/api` by the Express backend.

## Repo Intake and Recovery

| Method | Route | Current behavior |
|---|---|---|
| `GET` | `/api/repos` | List persisted repos. |
| `POST` | `/api/repos/upload` | Upload, filter, scan, and persist a local folder. |
| `POST` | `/api/repos/import-github` | Shallow-clone and scan the default state of a GitHub repo URL. |
| `GET` | `/api/repos/:id` | Get a persisted repo summary. |
| `DELETE` | `/api/repos/:id` | Delete a persisted repo and its stored files. |
| `GET` | `/api/repos/:id/project-map` | Return categorized file structure. |
| `GET` | `/api/repos/:id/project-summary` | Return deterministic project summary signals. |
| `GET` | `/api/repos/:id/symbol-map` | Return extracted symbols. |
| `GET` | `/api/repos/:id/dependency-map` | Return dependency edges and hubs. |
| `GET` | `/api/repos/:id/behavior-map` | Return detected behavior signals. |
| `GET` | `/api/repos/:id/algorithm-map` | Return detected algorithm candidates. |
| `GET` | `/api/repos/:id/recovery-assistant` | Return deterministic continuity guidance. |

GitHub branch and commit pinning are not implemented.

## Events

| Method | Route | Current behavior |
|---|---|---|
| `GET` | `/api/events` | Query persisted action events. |
| `POST` | `/api/events` | Persist an action event. |
| `GET` | `/api/entities/:type/:id/events` | Query events for an entity. |

## Backend-Backed Workspace Views

| Method | Route | Current behavior |
|---|---|---|
| `GET` | `/api/projects` | Summarize persisted repos and project signals. |
| `GET` | `/api/specs` | List documentation/spec candidates. |
| `GET` | `/api/agents` | Report agent/AI-related file and event evidence plus runtime status. |
| `GET` | `/api/workflows/runs` | Group action events into observed runs. |
| `GET` | `/api/memory/context` | Assemble context sources from current persisted data. |
| `GET` | `/api/settings/status` | Report storage, filters, and runtime status. |
| `GET` | `/api/filter-rules` | Return current repo file-filter rules. |

## Explicit Gaps

- Agent runtime: not implemented.
- Dedicated memory table: not implemented.
- Workflow automation: not implemented.
- AI/local model routing: not implemented.
- Reusable Assets v0: next planned implementation.
