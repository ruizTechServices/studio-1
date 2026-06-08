# Session Log

## 2026-06-07 - Current docs reconciliation session

Branch: `main`

Verified:

- key files exist
- JS syntax checks pass
- known curl endpoints work
- `npm run smoke` passes, including repo-specific endpoints
- reusable assets endpoint and panel implemented

Current dirty state:

- docs moved/reorganized
- README/current docs created

Decision:

- fix docs/code mismatches before new feature work
- preserve `docs/archive/`, `docs/plans/`, and `docs/prompts/`
- keep AI/local model routing after the continuity MVP basics
- keep reusable asset extraction deterministic and read-only

Next:

- keep the smoke test script current as API routes change
- commit docs reconciliation
- refine Reusable Assets v0 if needed
