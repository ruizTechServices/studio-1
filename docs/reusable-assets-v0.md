# Reusable Assets v0

## Status

Next planned implementation. It does not currently exist.

## Goal

Detect and display reusable components, functions, API handlers, utilities, patterns, and algorithm candidates from already-scanned repos.

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

The v0 layer should remain deterministic and support continuity by making proven code easier to find again.
