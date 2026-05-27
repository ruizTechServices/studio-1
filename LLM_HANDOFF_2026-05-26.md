# LLM Handoff Summary - 2026-05-26 Evening

This file summarizes only the work implemented in this codebase today, May 26, 2026, with emphasis on the evening application changes. It is written for a future LLM to resume from the current state without re-discovering the same context.

## Current Project Shape

`studio-1` is now a small Express-served vanilla frontend application with SQLite persistence. There is no separate Vite/React dev server.

Run it with:

```powershell
npm start
```

Then open:

```text
http://localhost:3000
```

Do not use a static file server such as `127.0.0.1:5500/app/index.html` for testing. That only serves HTML/CSS/JS and does not provide `/api/*`, which causes `Cannot GET /api/repos` or similar route errors.

## Important Commits From This Evening

- `e10269b` - Added repo intake flow with SQLite persistence and app-wide logging plan.
- `a7264f2` - Added action logger and repo deletion.
- `8712d84` - Improved frontend handling for non-JSON API route errors.

There is also one current uncommitted UI copy change:

- `app/index.html` GitHub URL placeholder changed from a branded repo URL to `https://github.com/owner/repository.git`.

## Installed Packages And Runtime

`package.json` now defines:

```json
{
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

Installed/used today:

- `express` for the single app/API server.
- `multer` for local folder upload handling.
- `zod` for backend action-event validation.
- Node's experimental `node:sqlite` `DatabaseSync` API for local SQLite persistence.

Node emits an experimental warning for `node:sqlite`; this is expected in the current implementation.

## File And App Structure Changes

The frontend now lives under `app/`:

- `app/index.html` - Repo Map Intake page.
- `app/dashboard.html` - Dashboard page.
- `app/script.js` - Shared frontend behavior, repo intake UI, action log UI, delete UI.
- `app/styles.css` - Shared app styling.

The server is:

- `server.js` - Express app, static serving, API routes, SQLite schema, repo import/upload/delete, logger persistence.

Local generated/runtime data is ignored:

- `.gitignore` includes `node_modules/`, `data/`, `npm-debug.log*`, `.DS_Store`.

## SQLite Persistence

The local database path is:

```text
data/studio-1.sqlite
```

Tables created by `server.js`:

- `repos`
- `repo_files`
- `action_events`

`repos` stores each imported/uploaded repository:

- `id`
- `name`
- `source_type`
- `root_path`
- `total_files`
- `total_bytes`
- `created_at`

`repo_files` stores filtered file records:

- `repo_id`
- `path`
- `name`
- `extension`
- `language`
- `size_bytes`
- `category`

`action_events` stores app-wide stateless logger events:

- `id`
- `timestamp`
- `level`
- `area`
- `source`
- `phase`
- `action`
- `message`
- `details_json`
- `entity_type`
- `entity_id`
- `entity_name`
- `correlation_id`
- `request_id`
- `parent_event_id`

## Repo Intake Implemented Today

The home page is now a Repo Map Intake screen.

It supports two intake paths:

1. GitHub repo URL import.
2. Local repo folder upload.

The server filters incoming repo files before storing them. Important rules:

- Ignored directories include `.git`, `node_modules`, build output, cache folders, virtual env folders, IDE folders, and similar.
- Allowed code/config/doc extensions include JS/TS, Python, HTML/CSS, JSON, Markdown, YAML, TOML, SQL, etc.
- Important extensionless names include `Dockerfile`, `Makefile`, `README`, `LICENSE`, lock files, and common package manifests.
- Maximum file size is `2 MB`.
- Multer upload limits are `3000` files and `2 MB` per file.

Repo files are classified into categories such as:

- `components`
- `pagesRoutes`
- `apiEndpoints`
- `databaseFiles`
- `authLogic`
- `paymentLogic`
- `aiLogic`
- `documentation`
- `tests`
- `configFiles`
- `functions`
- `other`

## API Routes Implemented Today

Current API surface:

```text
GET    /api/filter-rules
GET    /api/repos
GET    /api/repos/:id
POST   /api/repos/upload
POST   /api/repos/import-github
DELETE /api/repos/:id

GET    /api/events
POST   /api/events
GET    /api/entities/:type/:id/events
```

`GET /api/repos` returns repo summaries with categories and file lists.

`POST /api/repos/upload` accepts a filtered folder upload from the frontend.

`POST /api/repos/import-github` clones a GitHub repo with:

```text
git clone --depth=1 --single-branch
```

`DELETE /api/repos/:id` removes:

- The repo row.
- The repo file rows.
- The stored repo folder under `data/repos`.
- For GitHub imports, the parent import folder under `data/imports/<repoId>`.

Delete is guarded by `assertDataPath()`, which refuses to delete paths outside the app's `data` directory.

## App-Wide Stateless Logger Implemented Today

The logger is based on `action-log-plan.md` and is now partially implemented.

Backend:

- `logEventSchema` uses Zod to validate action events.
- `recordEvent(input)` normalizes and persists an event.
- `recordEventSafely(input)` records without breaking the original app operation.
- `eventsForQuery(query)` supports filtered event reads.
- Events use `ON CONFLICT(id) DO NOTHING` to avoid overwriting historical log rows.

Frontend:

- `logEvent(input, options)` creates an event immediately in memory and posts to `/api/events`.
- Persistence failures do not block the user action.
- Log panels render from a shared `actionEvents` array.
- `Repo Map Action Log` filters `area === "repo_map"`.
- `Global Action Log` shows recent events across all areas.
- Filters: `All`, `Errors`, `Warnings`, `Success`.

Important event actions now emitted:

- `local_folder_selected`
- `local_files_filtered`
- `local_file_count_high`
- `local_upload_started`
- `local_upload_failed`
- `repo_saved`
- `repo_displayed`
- `github_url_changed`
- `github_import_clicked`
- `github_clone_started`
- `github_clone_succeeded`
- `github_import_no_scannable_files`
- `github_clone_failed`
- `repo_delete_clicked`
- `repo_deleted`
- `repo_delete_failed`
- `repo_removed_from_view`
- `server_started`
- `api_request_failed`

## Repo Deletion Implemented Today

The repo detail header now has a `Delete` button.

Frontend behavior:

1. User clicks `Delete`.
2. Browser shows a native confirmation dialog:
   `Delete <repo name>? This removes the saved repo and its stored files.`
3. On confirmation, frontend calls:
   `DELETE /api/repos/:id`
4. The saved repo list is updated in memory.
5. The detail panel renders the next repo or the empty state.
6. Delete-related events are written to the action log.

Backend behavior:

1. Looks up the repo row.
2. Verifies `root_path` resolves under `data/`.
3. Removes the repo folder.
4. Removes import parent folder for GitHub-imported repos.
5. Deletes `repo_files`.
6. Deletes `repos`.
7. Logs `repo_deleted`.

This was verified today with a temporary repo record/folder:

- API returned `{ deleted: true, repoId, name }`.
- Repo row count became `0`.
- File row count became `0`.
- Stored folder was removed.

## Error Encountered And Mitigated Today

After the delete feature was committed, the user saw repeated delete failures for `catherine-ruiz`.

The action log showed:

```text
Cannot DELETE /api/repos/1779842377949-119352f7
```

Diagnosis:

- The browser had loaded the new frontend containing the Delete button.
- Port `3000` was still running a stale older `server.js` process that did not include `DELETE /api/repos/:id`.
- The stale Express process returned HTML: `Cannot DELETE /api/repos/...`.

Mitigation:

- The stale listener on port `3000` was killed.
- The current committed server code was restarted on `localhost:3000`.
- A probe against `DELETE /api/repos/__missing_delete_probe__` confirmed the current route exists and returns JSON behavior.
- The synthetic probe log was removed from `action_events`.
- `readApiJson()` in `app/script.js` was updated to detect Express route-missing HTML and report:
  `Server route unavailable for DELETE /api/repos/.... Restart the Express server and reload.`

Commit for this mitigation:

```text
8712d84 Handle non-JSON API route errors
```

## Current Saved Repo Data Observed During Debugging

At the time of debugging, SQLite had these repos:

- `catherine-ruiz`
  - id: `1779842377949-119352f7`
  - source: `folder_upload_filtered`
  - 13 files
  - root path: `data/repos/1779842377949-119352f7`

- `website-one`
  - id: `1779842332332-28e38754`
  - source: `github_url_filtered`
  - 66 files
  - root path: `data/imports/1779842332332-28e38754/website-one`

- `studio-1`
  - id: `1779838404898-d844c4d8`
  - source: `github_url_filtered`
  - 5 files
  - root path: `data/imports/1779838404898-d844c4d8/studio-1`

The user intended to delete `catherine-ruiz`; it had not been deleted by the assistant during mitigation.

## UI Updates Implemented Today

Home page now includes:

- Repo Map Intake header.
- GitHub import input and button.
- Local folder upload dropzone.
- Repo name input.
- Saved Repos list.
- Repo detail panel with category pills and file table.
- Delete button in repo detail header.
- Repo Map Action Log panel.
- Global Action Log panel.

Dashboard page still exists as `app/dashboard.html`.

The GitHub URL input placeholder has been made generic:

```text
https://github.com/owner/repository.git
```

This placeholder change is currently uncommitted at the time this handoff file is being written unless a later commit includes it.

## Verification Performed Today

Commands used successfully:

```powershell
node --check server.js
node --check app\script.js
git diff --check
```

Manual/API verification performed:

- `GET /api/events`
- `POST /api/events`
- Filtered event query by `area`, `level`, and action.
- Invalid event level returned `400`.
- Browser DOM check found both action log panels.
- Browser console check showed no frontend console errors during the logger panel check.
- Temporary repo deletion verified through `DELETE /api/repos/:id`.
- Stale-server delete failure diagnosed through `action_events`.
- Current server route probe verified that `DELETE /api/repos/:id` exists.

## Known Current State And Follow-Up Notes

- The app should be tested through `http://localhost:3000`.
- If frontend and backend seem mismatched, kill/restart the Express server, then reload the browser.
- `data/` is ignored by Git and contains local SQLite state plus stored repo files.
- The action log can become noisy because clicking repos emits `repo_displayed` events. This is useful for now but may need throttling or deduping later.
- The logger is intentionally stateless. It records events only; feature state remains in repo-specific data.
- Event persistence is append-safe for duplicate IDs, using `ON CONFLICT(id) DO NOTHING`.
- The current frontend still silently ignores failed event persistence in `logEvent()`. Non-JSON API responses are now cleaner through `readApiJson()`, but background event persistence failures are still swallowed.
- There is no authentication, no multi-user isolation, and no production deployment setup yet.
- There are no automated tests beyond syntax checks and manual/API verification.

## Suggested Next Steps

1. Commit the generic placeholder change if it has not been committed yet.
2. Reload `http://localhost:3000` and verify deleting `catherine-ruiz` now succeeds.
3. Add a small automated API smoke test script for:
   - Create temp repo row/folder.
   - Delete repo.
   - Assert DB and filesystem cleanup.
4. Add a compact logger debug view or details drawer only if the visible panels get too noisy.
5. Consider formatting Zod validation errors into concise client-facing messages.
6. Consider separating `server.js` into modules once the API surface grows further.

