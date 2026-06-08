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

## Non-Goals

- AI recommendations
- Embeddings or semantic search
- Automatic code reuse or repo editing
- Marketplace or package publishing
- Agent execution or orchestration
- Local model routing

The v0 layer is deterministic and supports continuity by making proven code easier to find again. Future versions may add AI summaries or reuse recommendations, but that is explicitly out of scope for v0.
