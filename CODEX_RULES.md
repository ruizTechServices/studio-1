===
## Codex Execution Loop

Codex may only work from a scoped ticket.

A valid Codex workflow is:

1. Read `AGENTS.md`.
2. Read the relevant studio docs.
3. Confirm the requested task.
4. Modify only the files needed for that task.
5. Avoid unrelated cleanup or rewrites.
6. Run validation commands when available.
7. Report exactly what changed.
8. Report risks, skipped validation, and the next recommended task.

Codex should not decide the product direction.

Codex implements scoped work. The studio docs preserve continuity.
===

===

## Task Decomposition Rule

Never ask Codex to build a whole product.

Every Codex task must be reduced to one bounded implementation unit.

A valid task includes:
- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- validation steps
- final response format

Invalid task:

“Build the app.”

Valid task:

“Create `APP_REGISTRY.md` using the current studio dashboard as the source of truth.”

===

