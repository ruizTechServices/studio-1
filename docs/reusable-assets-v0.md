# Reusable Assets v0

## Status

Implemented as a deterministic read-only layer inside the repo intake/detail flow.

## Goal

Detect and display reusable components, functions, API handlers, utilities, patterns, and algorithm candidates from already-scanned repos.

The current implementation uses existing repo scan data and deterministic map helpers. It does not use AI, embeddings, or model routing.

## Initial Scope

- Derive candidates from persisted repo files and existing deterministic maps.
- Preserve links back to the source repo and file path.
- Show why each item was classified as a reusable candidate.
- Provide a read-only workspace for inspection.

## Current Implementation

- `GET /api/repos/:id/reusable-assets` returns repo metadata, type counts, and the full deterministic candidate list.
- Candidate signals come from `projectMap`, `projectSummary`, `symbolMap`, `dependencyMap`, `behaviorMap`, `algorithmMap`, and persisted `repo_files` rows.
- Generated output, dependency folders, tests, docs, lock files, source maps, minified files, unsupported extensions, and files over 512 KB are excluded.
- Confidence starts at `0.55` and adds `0.10` for a strong category, exported/function signal, dependency hub, and behavior or algorithm signal, capped at `0.95`.
- Results sort by confidence descending, risk ascending, then path ascending.
- The repo detail panel displays the top 10 candidates while the endpoint returns all detected candidates.
- Missing or partial deterministic-map payloads fall back to empty signals instead of failing the response.

## Non-Goals

- AI recommendations
- Embeddings or semantic search
- Automatic code reuse or repo editing
- Marketplace or package publishing
- Agent execution or orchestration
- Local model routing

The v0 layer is deterministic and supports continuity by making proven code easier to find again. Future versions may add AI summaries or reuse recommendations, but that is explicitly out of scope for v0.
