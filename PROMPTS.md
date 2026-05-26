# Prompts

Reusable prompt library for RuizTech Studio.

## Resume Studio Prompt

```txt
Read `STUDIO_DASHBOARD.md`, `STUDIO_PROTOCOL.md`, `DECISIONS.md`, and `APP_REGISTRY.md`.

Summarize:
- current studio focus
- current milestone
- next smallest scope-relevant task
- current blockers
- what should not be touched yet

Do not propose new app ideas unless the docs explicitly request product ideation.
```

## Create Codex Ticket Prompt

```txt
Create a Codex-ready ticket for the next smallest scope-relevant task.

Include:
- goal
- context
- scope
- constraints
- acceptance criteria
- files likely involved
- validation steps
- final response format

Keep the task bounded to one implementation unit. Do not ask Codex to build a whole product.
```

## Review Codex Diff Prompt

```txt
Review this Codex diff against the ticket.

Prioritize:
- scope drift
- unrelated rewrites
- missing acceptance criteria
- missing validation
- accidental app code
- secrets or generated files
- inconsistency with `STUDIO_PROTOCOL.md`

Return findings first, ordered by severity, with file references.
```

## Reduce MVP Scope Prompt

```txt
Review this MVP scope and reduce it to the smallest version that can validate user value or revenue.

Return:
- must-have workflow
- deferred features
- biggest scope risks
- next smallest build task
- what not to build yet
```

## Write Decision Log Prompt

```txt
Write a `DECISIONS.md` entry for this decision.

Include:
- date
- decision
- reason
- rejected alternatives
- revisit condition

Keep it factual and specific.
```

## Create App Record Prompt

```txt
Create or update an `APP_REGISTRY.md` product app candidate record.

Include:
- app name
- status
- priority
- revenue path
- current milestone
- next task
- paused reason
- what not to build yet, if relevant

Use the current studio docs as the source of truth.
```
