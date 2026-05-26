# Prompts

Reusable XML-style prompt library for RuizTech Studio.

Use `XML_PROMPT_PROTOCOL.md` as the controlling prompt-format protocol.

## Resume Studio Prompt

```xml
<llm_prompt>
  <read_first>
    <file>STUDIO_DASHBOARD.md</file>
    <file>STUDIO_PROTOCOL.md</file>
    <file>PRODUCT_SPEC.md</file>
    <file>DECISIONS.md</file>
    <file>APP_REGISTRY.md</file>
  </read_first>

  <goal>
    Summarize the current RuizTech Studio state.
  </goal>

  <response_requirements>
    <item>current studio focus</item>
    <item>current milestone</item>
    <item>next smallest scope-relevant task</item>
    <item>current blockers</item>
    <item>what should not be touched yet</item>
  </response_requirements>

  <constraints>
    <constraint>Do not propose new app ideas unless the docs explicitly request product ideation.</constraint>
    <constraint>Use the repo docs as the source of truth.</constraint>
  </constraints>
</llm_prompt>
```

## Create Codex Ticket Prompt

```xml
<llm_prompt>
  <read_first>
    <file>XML_PROMPT_PROTOCOL.md</file>
    <file>PRODUCT_SPEC.md</file>
    <file>STUDIO_DASHBOARD.md</file>
    <file>STUDIO_PROTOCOL.md</file>
    <file>CODEX_RULES.md</file>
  </read_first>

  <goal>
    Create a Codex-ready XML ticket for the next smallest scope-relevant task.
  </goal>

  <required_ticket_tags>
    <tag>codex_task</tag>
    <tag>read_first</tag>
    <tag>goal</tag>
    <tag>context</tag>
    <tag>scope</tag>
    <tag>constraints</tag>
    <tag>acceptance_criteria</tag>
    <tag>validation</tag>
    <tag>final_response_format</tag>
  </required_ticket_tags>

  <constraints>
    <constraint>Keep the task bounded to one implementation unit.</constraint>
    <constraint>Do not ask Codex to build a whole product.</constraint>
    <constraint>Preserve the current repo truth from the studio docs.</constraint>
  </constraints>
</llm_prompt>
```

## Create Repo Onboarding Ticket Prompt

```xml
<llm_prompt>
  <read_first>
    <file>XML_PROMPT_PROTOCOL.md</file>
    <file>REPO_ONBOARDING_PROTOCOL.md</file>
    <file>STUDIO_DASHBOARD.md</file>
    <file>CODEX_RULES.md</file>
  </read_first>

  <goal>
    Create a Codex-ready XML ticket for repo onboarding documentation or planning.
  </goal>

  <context>
    <protocol>
      Use `REPO_ONBOARDING_PROTOCOL.md` as the controlling protocol.
    </protocol>
  </context>

  <constraints>
    <constraint>Keep the task documentation/specification-only unless the studio owner explicitly asks for implementation.</constraint>
    <constraint>Do not implement GitHub ingestion, OAuth, vector storage, database schemas, dashboard UI, or automation.</constraint>
  </constraints>

  <required_ticket_tags>
    <tag>codex_task</tag>
    <tag>read_first</tag>
    <tag>goal</tag>
    <tag>context</tag>
    <tag>scope</tag>
    <tag>constraints</tag>
    <tag>acceptance_criteria</tag>
    <tag>validation</tag>
    <tag>final_response_format</tag>
  </required_ticket_tags>
</llm_prompt>
```

## Review Codex Diff Prompt

```xml
<review_prompt>
  <goal>
    Review a Codex diff against the provided ticket.
  </goal>

  <review_focus>
    <item>scope drift</item>
    <item>unrelated rewrites</item>
    <item>missing acceptance criteria</item>
    <item>missing validation</item>
    <item>accidental app code</item>
    <item>secrets or generated files</item>
    <item>inconsistency with `STUDIO_PROTOCOL.md`</item>
  </review_focus>

  <response_format>
    <section>Findings first, ordered by severity, with file references.</section>
    <section>Open questions or assumptions.</section>
    <section>Brief change summary only after findings.</section>
  </response_format>
</review_prompt>
```

## Reduce MVP Scope Prompt

```xml
<llm_prompt>
  <goal>
    Review an MVP scope and reduce it to the smallest version that can validate user value or revenue.
  </goal>

  <response_requirements>
    <section>must-have workflow</section>
    <section>deferred features</section>
    <section>biggest scope risks</section>
    <section>next smallest build task</section>
    <section>what not to build yet</section>
  </response_requirements>

  <constraints>
    <constraint>Do not expand the product scope.</constraint>
    <constraint>Prefer the smallest testable workflow.</constraint>
  </constraints>
</llm_prompt>
```

## Write Decision Log Prompt

```xml
<llm_prompt>
  <goal>
    Write a `DECISIONS.md` entry for a product, architecture, scope, pricing, current focus, primary product selection, or launch-path decision.
  </goal>

  <required_sections>
    <section>date</section>
    <section>decision</section>
    <section>reason</section>
    <section>rejected alternatives</section>
    <section>revisit condition</section>
  </required_sections>

  <constraints>
    <constraint>Keep it factual and specific.</constraint>
    <constraint>Do not invent decisions that were not made.</constraint>
  </constraints>
</llm_prompt>
```

## Create App Record Prompt

```xml
<llm_prompt>
  <goal>
    Create or update an `APP_REGISTRY.md` product app candidate record.
  </goal>

  <required_fields>
    <field>app name</field>
    <field>status</field>
    <field>priority</field>
    <field>revenue path</field>
    <field>current milestone</field>
    <field>next task</field>
    <field>paused reason</field>
    <field>what not to build yet, if relevant</field>
  </required_fields>

  <constraints>
    <constraint>Use the current studio docs as the source of truth.</constraint>
    <constraint>Do not mark any product app active unless `DECISIONS.md` explicitly selects it.</constraint>
  </constraints>
</llm_prompt>
```
