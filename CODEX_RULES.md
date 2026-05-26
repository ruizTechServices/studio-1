# Codex Rules

Codex is used for scoped implementation, editing, inspection, testing, and summarizing changes.

Codex does not decide product direction.

## Prompt Format

Every Codex ticket should include:

- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- validation steps
- final response format

## Task Boundaries

Codex must:

- read `AGENTS.md` before making changes
- read the relevant studio docs
- read `CODE_ASSET_PROTOCOL.md` before tasks involving proprietary code asset extraction, classification, retrieval, storage, or reuse
- work only on the assigned task
- modify only the files needed for that task
- avoid unrelated cleanup or rewrites
- avoid app code unless explicitly instructed
- avoid implementing GitHub ingestion, OAuth, vector storage, database schemas, or asset installation automation unless explicitly instructed
- preserve this repo as the studio source of truth

## Review Requirements

Before accepting Codex work, review the diff for:

- scope match
- unrelated changes
- accidental generated files
- secrets or environment files
- app code created without explicit instruction
- drift from `STUDIO_PROTOCOL.md`

## Validation Requirements

Codex should run validation commands when available.

For documentation tasks, validation means confirming:

- required files exist
- required sections are present
- the active app and milestone are consistent
- the canonical operating loop is reflected
- no forbidden app framework files were created

## Final Response Format

Codex must end with:

- Summary
- Files changed
- Why the change was made
- Validation performed
- Risks or open questions
- Suggested next task

## Bad Prompt Examples

```txt
Build the app.
```

```txt
Make TinySheets.
```

```txt
Set up everything.
```

```txt
Make this repo better.
```

## Good Prompt Example

```txt
Goal:
Create `APP_REGISTRY.md` using `STUDIO_DASHBOARD.md` as the source of truth.

Context:
This repo is the markdown-first source of truth for RuizTech Studio. TinySheets is the active app.

Scope:
Create or update only `APP_REGISTRY.md`.

Constraints:
Do not create app code. Do not initialize frameworks. Do not add unrelated files.

Acceptance Criteria:
- TinySheets is listed as active priority 1.
- Tech Rescue Sprint, 24HourGPT, LetMeExplain, and Nucleus are listed.
- Each app has status, priority, revenue path, current milestone, next task, and paused reason.

Files likely involved:
- `APP_REGISTRY.md`
- `STUDIO_DASHBOARD.md` for reference only

Validation:
Read the final file and confirm all acceptance criteria are met.

Final response format:
Summary, files changed, validation performed, risks, suggested next task.
```
