# XML Prompt Protocol

This protocol defines how RuizTech Studio writes structured prompts for Codex and other LLMs.

This is a documentation/specification file only. It does not create app source code, framework files, dependencies, schemas, ingestion, OAuth, or automation.

There is currently no primary product app. The current focus is formalizing `ruizTechStudio` as the markdown-first studio operating workspace and future proprietary code asset system.

## Purpose

RuizTech Studio uses XML-style prompts to make model instructions easier to parse, review, reuse, and validate.

XML-style prompts help:

- separate goal, context, scope, constraints, acceptance criteria, validation, and final response format
- reduce ambiguity in Codex tickets
- make prompt intent easier to audit before execution
- keep tasks bounded to one implementation unit
- preserve source-of-truth context across sessions
- improve consistency between ChatGPT planning, Codex execution, and human review

The XML tags are prompt structure, not a machine-executed schema. A prompt can be valid for studio use even if it is not strict XML, but it should be well-formed enough for humans and models to understand the boundaries.

## Default Rule

Codex and LLM prompts created for RuizTech Studio should use XML-style structure unless there is a clear reason not to.

Small one-line questions do not need XML. Scoped Codex tickets, reusable prompts, review prompts, planning prompts, repo onboarding prompts, code asset prompts, and multi-step instructions should use XML-style tags.

## Required Tags For Codex Tasks

Every Codex task prompt should include:

```xml
<codex_task>
  <read_first>
    <file>AGENTS.md</file>
  </read_first>

  <goal>
    One bounded goal.
  </goal>

  <context>
    Relevant repo, product, protocol, and decision context.
  </context>

  <scope>
    Files, folders, or behavior in scope.
  </scope>

  <constraints>
    <constraint>Hard limits and forbidden actions.</constraint>
  </constraints>

  <acceptance_criteria>
    <item>Observable completion criteria.</item>
  </acceptance_criteria>

  <validation>
    <step>Commands, checks, or manual review steps.</step>
  </validation>

  <final_response_format>
    <section>Summary</section>
    <section>Files changed</section>
    <section>Why the change was made</section>
    <section>Validation performed</section>
    <section>Risks or open questions</section>
    <section>Suggested next task</section>
  </final_response_format>
</codex_task>
```

## Required Tag Meanings

- `<codex_task>`: wraps a complete Codex ticket.
- `<read_first>`: lists files Codex must read before making changes.
- `<goal>`: states the single bounded outcome.
- `<context>`: gives source-of-truth background needed to avoid wrong assumptions.
- `<scope>`: defines allowed files, folders, or work areas.
- `<constraints>`: lists hard limits, forbidden work, and non-goals.
- `<acceptance_criteria>`: lists what must be true when the task is done.
- `<validation>`: lists checks Codex must perform or report as not performed.
- `<final_response_format>`: defines the exact close-out sections.

## Optional Tags For Complex Tasks

Use optional tags when they improve clarity:

- `<repo_identity>`: source-of-truth repository identity.
- `<current_focus>`: current studio or product focus.
- `<protocols>`: controlling protocol files.
- `<files_likely_involved>`: likely edit/read targets.
- `<out_of_scope>`: explicit exclusions.
- `<risk_notes>`: known risks that should affect implementation.
- `<approval_required>`: steps requiring user approval before proceeding.
- `<assumptions>`: assumptions Codex may use unless contradicted by repo context.
- `<deliverables>`: concrete files or outputs expected.
- `<do_not_create>`: files, folders, app code, or generated outputs that must not be created.
- `<review_focus>`: priorities for code or doc review.
- `<examples>`: examples Codex should imitate or avoid.
- `<success_state>`: concise description of the desired final repo state.

## Style Rules

- Keep tag names lowercase with underscores when needed.
- Prefer clear semantic tags over generic containers.
- Keep each task bounded to one implementation unit.
- Put repeated list items inside child tags such as `<item>`, `<file>`, `<constraint>`, or `<step>`.
- Avoid mixing unrelated goals inside one XML prompt.
- Keep constraints explicit and concrete.
- Include source-of-truth context instead of relying on memory.
- Do not include secrets or private credentials in prompts.
- For documentation-only tasks, state that no implementation files should be created.
- For implementation tasks, include validation steps and expected final response sections.

## Complete Codex Prompt Example

```xml
<codex_task>
  <read_first>
    <file>AGENTS.md</file>
    <file>STUDIO_DASHBOARD.md</file>
    <file>STUDIO_PROTOCOL.md</file>
    <file>CODEX_RULES.md</file>
    <file>DECISIONS.md</file>
  </read_first>

  <goal>
    Create a documentation-only protocol file that defines a bounded RuizTech Studio workflow.
  </goal>

  <context>
    <repo_identity>
      This repository is the markdown-first source-of-truth operating workspace for RuizTech Studio.
    </repo_identity>
    <current_focus>
      There is currently no primary product app. The current focus is formalizing ruizTechStudio.
    </current_focus>
  </context>

  <scope>
    <create_files>
      <file>EXAMPLE_PROTOCOL.md</file>
    </create_files>
    <update_files>
      <file>AGENTS.md</file>
      <file>DECISIONS.md</file>
    </update_files>
  </scope>

  <constraints>
    <constraint>Do not create app source code.</constraint>
    <constraint>Do not initialize any framework.</constraint>
    <constraint>Do not create package.json.</constraint>
    <constraint>Do not add dependencies.</constraint>
    <constraint>Keep this as a documentation/specification-only change.</constraint>
  </constraints>

  <acceptance_criteria>
    <item>EXAMPLE_PROTOCOL.md exists.</item>
    <item>The protocol explains purpose, workflow, boundaries, and validation.</item>
    <item>AGENTS.md references the protocol if relevant.</item>
    <item>DECISIONS.md records the decision if product direction changed.</item>
    <item>No app code or framework files are created.</item>
  </acceptance_criteria>

  <validation>
    <step>Confirm EXAMPLE_PROTOCOL.md exists.</step>
    <step>Confirm no package or framework files were created.</step>
    <step>Confirm the repo still says there is no current primary product app.</step>
  </validation>

  <final_response_format>
    <section>Summary</section>
    <section>Files changed</section>
    <section>Why the change was made</section>
    <section>Validation performed</section>
    <section>Risks or open questions</section>
    <section>Suggested next task</section>
  </final_response_format>
</codex_task>
```

## Current Implementation Boundary

Do not implement prompt builders, validators, parsers, schemas, UI, or automation as part of this protocol.

Those items require separate scoped decisions and Codex-ready tickets.
