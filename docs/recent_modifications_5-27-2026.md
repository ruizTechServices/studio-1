# Recent Modifications — 2026-05-27

Summary of the backend refactoring and hardening work done on the evening of May 27, 2026.
The goal across the session was a cleaner, more secure, more modular `server.js`, driven by
four priorities: **security, modularity, obfuscation (internal-detail hiding), and performance.**

There are two distinct bodies of work:

1. **Pushed** — commit `171914f`, already on `origin/main`: the full modularization.
2. **Pending commit** — current working tree: error-response sanitization + input validation.

No API paths or the frontend contract changed at any point; the SvelteKit-free static UI in
`app/` continues to call the same endpoints.

---

## 1. Pushed — `171914f` "refactor: extract Express routes and middleware from server.js"

**Pushed to `origin/main` at 2026-05-27 18:14 -0400.** 36 files changed, +1012 / −865.
`server.js` went from a single ~913-line file to a 56-line composition root.

### Helpers extracted into `lib/` (one function per file)
Every helper that previously lived inline in `server.js` was moved into a categorized folder
behind a barrel ([lib/index.js](lib/index.js)) so `server.js` has one import surface:

- **`lib/config.js`** — `ignoredDirs`, `allowedExtensions`, `importantNames`, and a new
  `MAX_FILE_SIZE_BYTES` constant (replaced three hard-coded `2 * 1024 * 1024` literals).
- **`lib/paths.js`** — `dataDir`/`reposDir`/`importsDir`/`tempDir`/`dbPath` + the `mkdirSync`
  bootstrap.
- **`lib/db.js`** — the single shared `DatabaseSync` instance, schema creation, and orphan-repo
  cleanup.
- **`lib/ids/`** — `createId`, `normalizeNullableString`.
- **`lib/events/`** — `logEventSchema`, `normalizeLogEvent`, `rowToEvent`, `recordEvent`,
  `recordEventSafely`, `eventsForQuery`.
- **`lib/fileFuncs/`** — `cleanRelativePath`, `shouldKeepPath`, `detectRepoName`, `languageFor`,
  `categoryFor`, `fileRecord`, `walkRepoFiles`.
- **`lib/github/`** — `assertGitHubUrl`, `repoNameFromUrl`, `cloneGitHubRepo`.
- **`lib/repos/`** — `repoSummary`, `assertDataPath`, `deleteRepo`, `saveRepo`.

### Routes extracted into `routes/` (one router per resource)
Route handlers moved verbatim into Express routers, mounted under `/api` via
[routes/index.js](routes/index.js) so the resolved URLs stayed byte-identical:

| Router | Mounted at | Endpoints |
|--------|-----------|-----------|
| [routes/repos.js](routes/repos.js) | `/api/repos` | `GET /`, `POST /upload`, `POST /import-github`, `GET /:id`, `DELETE /:id` |
| [routes/events.js](routes/events.js) | `/api/events` | `GET /`, `POST /` |
| [routes/entities.js](routes/entities.js) | `/api/entities` | `GET /:type/:id/events` |
| [routes/meta.js](routes/meta.js) | `/api` | `GET /filter-rules` |

Route ordering in `repos.js` puts the literal POST paths before `/:id` so they can never be
shadowed.

### Middleware extracted into `lib/middleware/`
- **`upload.js`** — the configured `multer` instance.
- **`requestId.js`** — assigns `request.requestId` per request.
- **`errorHandler.js`** — the centralized error middleware.
- **`index.js`** — barrel.

### Result
`server.js` is now a thin composition root: create app → static + `express.json()` →
`requestId` → serve `/` → `app.use("/api", apiRouter)` → `errorHandler` → `listen`. It no
longer imports `crypto`, `fs`, `multer`, `DatabaseSync`, or `zod` directly.

---

## 2. Pending commit — Error sanitization + input validation

**Not yet committed.** Working tree: 5 files modified (+55 / −24) and 3 new files in
`lib/validation/`. This pass delivers the deferred "security / obfuscation" goals.

### New: zod-based request validation (`lib/validation/`)
- **[validate.js](lib/validation/validate.js)** — middleware factory `validate({ params, query,
  body })`. Respects Express 5's read-only `req.query` getter: it **gates** `params`/`query`
  without reassigning them and only writes the parsed result back to `req.body`.
- **[schemas.js](lib/validation/schemas.js)** — per-route zod schemas (`repoIdParams`,
  `deleteRepoBody`, `importGithubBody`, `entitiesParams`, `eventsQuery`), reusing the existing
  `zod` dependency. No new packages.
- **[index.js](lib/validation/index.js)** — barrel.

Validation is wired into the routers: import-github (`body`), repo `:id` GET (`params`),
DELETE (`params` + `body`), events `GET` (`query`), entities (`params` + `query`).

### Error-response sanitization ([lib/middleware/errorHandler.js](lib/middleware/errorHandler.js))
The handler now classifies errors and **stops leaking internals to clients**:

- `ZodError` → **400** with a readable field-level message.
- `multer.MulterError` → **400** with multer's own (safe) message.
- Anything with a 4xx `statusCode`/`status` → that status, message passed through.
- Everything else → **500 generic `{ error: "Server error", requestId }`** — no stack, no
  git stderr, no filesystem paths.

Full detail (original message, stack on 5xx, zod issues) is still logged **server-side** via
`recordEventSafely`, correlated by `requestId`. Every error response now echoes `requestId`
for support correlation.

### Reuse / de-duplication ([lib/github/assertGitHubUrl.js](lib/github/assertGitHubUrl.js))
Extracted the inline GitHub-URL regex into an exported `GITHUB_URL_REGEX` so the validation
schema and the assertion share one source of truth.

### Bug fixed in passing
A malformed GitHub URL previously returned **HTTP 500** (a plain `Error` thrown by
`assertGitHubUrl` fell through to the 500 path). It now returns a clean **400** via schema
validation, before any work starts.

### Verification (smoke-tested on a throwaway port `127.0.0.1:3999`)
- All 11 changed/new files pass `node --check`.
- Server boots cleanly; `GET /api/filter-rules`, `GET /api/repos`, valid `POST /api/events`
  (201) all unchanged.
- `POST /api/events {}` → 400 with readable missing-field list.
- Bad GitHub URL → **400** (was 500); blank repo id and non-numeric `?limit` → 400.
- **Clone failure → 500 `{ "error": "Server error", "requestId": ... }`** to the client,
  while the server log retained git's full "Repository not found" output, the absolute import
  path, and the stack trace under the matching `requestId`. Sanitization confirmed.

---

## Suggested commit message for the pending pass

```
feat: sanitize error responses and validate request input

Add a zod-based validate({ params, query, body }) middleware and
per-route schemas (lib/validation/), wired into the repos, events,
and entities routers. The validator respects Express 5's read-only
req.query getter.

Harden errorHandler to stop leaking internals: 5xx now return a
generic { error: "Server error", requestId } while the full message,
stack, and zod issues are logged server-side via recordEventSafely.
ZodError -> readable 400; MulterError -> 400; all responses echo
requestId.

Extract GITHUB_URL_REGEX so the schema and assertGitHubUrl share one
source of truth. Fixes a bug where a malformed GitHub URL returned
500 instead of 400.

Co-Authored-By: Claude Opus 4.7 <noreply@anthropic.com>
```
