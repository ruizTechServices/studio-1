# Current Architecture

## Runtime Shape

`studio-1` is an Express-served local-first application:

```text
server.js
  -> routes/         Express API resource routers
  -> lib/            persistence, scanning, maps, evidence/status helpers
  -> app/            static vanilla HTML/CSS/JavaScript frontend
  -> data/           local SQLite database and imported repo files
```

## Backend

- `server.js` is the Express composition root.
- `routes/index.js` mounts modular API routers.
- `routes/repos.js` owns repo intake, persistence, deletion, and deterministic map endpoints.
- `lib/db.js` uses `DatabaseSync` from `node:sqlite`.
- `lib/repos/` contains deterministic maps and recovery synthesis.
- Workspace helpers derive views from persisted repos, files, and action events.

The workspace helpers are read-only projections. They do not provide agent execution, workflow automation, dedicated memory, or AI routing.

## Frontend

- HTML pages live directly under `app/`.
- Shared and repo-specific HTML partials live under `app/components/`.
- `app/js/main.js` loads page-specific feature controllers.
- Controllers and renderers live under `app/js/features/`.
- CSS is split into base, component, layout, and page modules.

The frontend is vanilla HTML/CSS/JavaScript. There is no Next.js, React, or frontend build step.

## Persistence and Intake

- Repos, repo files, and action events are persisted in SQLite.
- Local uploads are filtered before persistence.
- GitHub import accepts a repo URL and shallow-clones the default branch state.
- Branch and commit pinning are planned, not implemented.

## Product Boundary

The current product boundary is continuity: intake, classification, deterministic maps, recovery guidance, smoke coverage, and Reusable Assets v0. AI/local model routing is a later layer.
