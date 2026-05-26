# Codex Rules

Codex is used for scoped implementation, editing, inspection, testing, and summarizing changes.

Codex does not decide product direction.

## Prompt Format

Every Codex ticket should use XML-style structure unless there is a clear reason not to.

Use `XML_PROMPT_PROTOCOL.md` as the controlling prompt-format protocol.

Every Codex ticket should include these sections as XML-style tags:

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
- read `PRODUCT_SPEC.md` before tasks involving product definition, future app direction, markdown lifecycle, or production-readiness boundaries
- read `XML_PROMPT_PROTOCOL.md` before creating or editing Codex tickets, reusable prompts, or LLM prompt standards
- read `REPO_ONBOARDING_PROTOCOL.md` before tasks involving connected repo analysis, uploaded repo analysis, repo onboarding, or repo context generation
- read `CODE_ASSET_PROTOCOL.md` before tasks involving proprietary code asset extraction, classification, retrieval, storage, or reuse
- work only on the assigned task
- modify only the files needed for that task
- avoid unrelated cleanup or rewrites
- avoid app code unless explicitly instructed
- avoid implementing GitHub ingestion, repo upload handling, OAuth, vector storage, database schemas, dashboard UI, or asset installation automation unless explicitly instructed
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
- the current studio focus and milestone are consistent
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
Make the product.
```

```txt
Set up everything.
```

```txt
Make this repo better.
```

## Good Prompt Example

```xml
<codex_task>
  <read_first>
    <file>AGENTS.md</file>
    <file>STUDIO_DASHBOARD.md</file>
    <file>STUDIO_PROTOCOL.md</file>
    <file>CODEX_RULES.md</file>
  </read_first>

  <goal>
    Update `STUDIO_DASHBOARD.md` to reflect the current studio focus.
  </goal>

  <context>
    <repo_identity>
      This repo is the markdown-first source of truth for RuizTech Studio.
    </repo_identity>
    <current_focus>
      There is currently no primary product app. The current focus is creating `ruizTechStudio`.
    </current_focus>
  </context>

  <scope>
    <update_files>
      <file>STUDIO_DASHBOARD.md</file>
    </update_files>
  </scope>

  <constraints>
    <constraint>Do not create app code.</constraint>
    <constraint>Do not initialize frameworks.</constraint>
    <constraint>Do not add unrelated files.</constraint>
  </constraints>

  <acceptance_criteria>
    <item>The dashboard says `ruizTechStudio` is the current focus.</item>
    <item>The dashboard says no primary product app is active.</item>
    <item>The current milestone and next task are consistent with studio setup.</item>
  </acceptance_criteria>

  <validation>
    <step>Read the final file and confirm all acceptance criteria are met.</step>
  </validation>

  <final_response_format>
    <section>Summary</section>
    <section>Files changed</section>
    <section>Validation performed</section>
    <section>Risks or open questions</section>
    <section>Suggested next task</section>
  </final_response_format>
</codex_task>
```
