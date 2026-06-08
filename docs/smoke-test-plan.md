# Smoke Test Plan

## Purpose

Confirm that the running local Express server exposes the current read-only API surface without adding dependencies or modifying persisted repo data.

## Command

Start the server with `npm start`, then run in another terminal:

```bash
npm run smoke
```

Set `STUDIO_BASE_URL` to test a different host or port.

## Coverage

The smoke script checks the known top-level read endpoints. If at least one repo exists, it also checks that repo's detail, project map, project summary, symbol map, dependency map, behavior map, algorithm map, recovery assistant, and reusable-assets endpoints.

## Behavior

- Uses built-in Node `fetch`.
- Adds no data and deletes no data.
- Skips repo-specific checks when no repos exist.
- Exits with code `1` if a request fails, returns a non-2xx status, or returns invalid JSON.
