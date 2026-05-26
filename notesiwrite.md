==
these are random, in-topic notes I write while working on the studio
==

 This is the sharper product concept:

```txt
RuizTech Studio is not only a repo-continuation tool.

It is a proprietary code intelligence studio that lets RuizTech Services ingest projects, extract reusable functions/components/patterns, certify them against RuizTech standards, store them as reusable assets, and inject them into future projects without copy-paste chaos.
```

The missing layer is:

```txt
Code Asset Registry
```

That is the core.

# Refined product concept

When you upload/connect a GitHub repo, the Studio should do **three things at once**:

```txt
1. Understand the repo as a project.
2. Extract reusable code assets from the repo.
3. Prepare the repo to receive approved RuizTech assets.
```

So the Studio is not just asking:

```txt
What is this app?
What is the next task?
```

It is also asking:

```txt
What useful code did Gio create here that can be reused later?
Is this function/component generic enough to become a RuizTech asset?
What dependencies does it need?
What standards does it follow?
Can it be safely added to another project?
How should it be installed into a new repo without breaking anything?
```

That is the proprietary advantage.

---

# The main architecture idea

You need **two registries**, not one.

## 1. Project Registry

Tracks apps/repos.

Example:

```txt
TinySheets
24HourGPT
LetMeExplain
Nucleus
Tech Rescue Sprint
```

It knows:

```txt
repo URL
purpose
tech stack
current milestone
next tasks
architecture
security risks
commands
progress
```

## 2. Code Asset Registry

Tracks reusable RuizTech-created code.

Example:

```txt
worksheet PDF renderer
auth redirect helper
Supabase server client wrapper
dashboard sidebar component
rate-limit middleware
AI chat message component
file upload pipeline
SQLite logging utility
prompt builder
error handling wrapper
```

It knows:

```txt
asset name
asset type
source repo
source file
version
dependencies
framework compatibility
required environment assumptions
inputs/outputs
tests
usage example
integration instructions
compliance status
```

This is what prevents you from copy-pasting.

---

# What gets extracted from uploaded repos

When any repo is uploaded, the Studio should identify reusable assets across these categories:

## 1. Functions

Examples:

```txt
formatDate()
generateWorksheetPrompt()
createSupabaseServerClient()
validateUserSession()
calculateInvoiceTotal()
chunkTextForEmbeddings()
generateSlug()
retryWithBackoff()
```

The Studio should capture:

```txt
function name
file path
purpose
parameters
return value
dependencies
side effects
framework dependency
reusability score
test coverage
```

## 2. Components

Examples:

```txt
DashboardSidebar
AuthButton
PricingCard
WorksheetPreview
ChatMessageBubble
FileUploadDropzone
AdminStatCard
CommandPalette
```

The Studio should capture:

```txt
component name
props
required styles
dependencies
framework
state behavior
accessibility concerns
screenshots if possible
where used
```

## 3. Algorithms

Examples:

```txt
worksheet layout generator
token usage calculator
PDF pagination logic
vector chunking algorithm
rate-limit decision logic
matching/scoring logic
prompt-routing logic
```

The Studio should capture:

```txt
algorithm purpose
input data
output data
complexity
edge cases
test cases
reuse scenarios
```

## 4. Patterns

Examples:

```txt
Supabase auth guard pattern
server action validation pattern
API route error handler
Zod schema validation pattern
RLS policy pattern
Stripe webhook handler pattern
Codex ticket format
```

The Studio should capture:

```txt
pattern name
problem solved
files involved
when to use
when not to use
implementation checklist
```

## 5. Templates

Examples:

```txt
Next.js SaaS starter
Supabase auth shell
landing page shell
dashboard shell
admin dashboard starter
API route starter
GitHub repo ingestion starter
```

The Studio should capture:

```txt
template name
stack
included files
setup instructions
customization points
compliance checklist
```

---

# The key idea: code becomes an asset

A function/component should not just be stored as “some code.”

It should become a structured asset.

Example asset record:

```md
# Asset: Supabase Server Client Wrapper

## Asset Type
Function / Utility

## Source
Repo: tinysheets
File: lib/supabase/server.js
Commit: abc123

## Purpose
Creates a Supabase server client using the project’s auth cookie strategy.

## Compatibility
- Next.js App Router
- Supabase Auth
- Server Components
- Server Actions

## Dependencies
- @supabase/ssr
- next/headers

## Inputs
None directly.

## Outputs
Authenticated Supabase server client.

## Side Effects
Reads request cookies.

## Reuse Status
Approved

## RuizTech Compliance
Pass

## Integration Method
Copy through Studio asset installer, not manual copy-paste.

## Usage Example
Use inside server actions, route handlers, and server components that need authenticated database access.

## Risks
Must match the target app’s Supabase auth setup.
```

That is the “RuizTech proprietary codebase” concept.

---

# What the Studio should do when a repo is uploaded

Corrected upload pipeline:

```txt
User connects GitHub repo
        ↓
Studio captures repo metadata
        ↓
Studio scans file tree
        ↓
Studio detects tech stack
        ↓
Studio maps routes/components/functions/APIs
        ↓
Studio extracts reusable assets
        ↓
Studio classifies assets by type
        ↓
Studio scores assets for reusability
        ↓
Studio checks license/provenance
        ↓
Studio checks RuizTech compliance
        ↓
Studio stores approved assets in Code Asset Registry
        ↓
Studio embeds docs/code/asset metadata for retrieval
        ↓
Studio builds dependency/symbol graph
        ↓
Studio generates repo context docs
        ↓
Studio generates reusable asset docs
        ↓
Studio shows dashboard-ready project state
        ↓
Studio suggests next tasks and reusable assets
        ↓
User approves what becomes part of the RuizTech proprietary library
```

The important addition is:

```txt
User approves what becomes reusable.
```

Not every piece of code should become a proprietary asset.

Some code is app-specific. Some code is messy. Some code depends too heavily on the original project.

---

# The Studio should classify code into 4 buckets

## Bucket 1: Reusable as-is

Good generic code.

Example:

```txt
formatCurrency()
generateSlug()
Button component
API error handler
```

## Bucket 2: Reusable with adapter

Useful, but needs project-specific glue.

Example:

```txt
Supabase auth helper
PDF generator
dashboard layout
file upload flow
```

## Bucket 3: Project-specific only

Do not reuse directly.

Example:

```txt
TinySheets-specific worksheet schema
LetMeExplain-specific feedback model
client-specific landing copy
```

## Bucket 4: Do not reuse

Unsafe, low quality, duplicated, secret-bearing, or legally questionable.

Example:

```txt
hardcoded API key logic
copied third-party code with unclear license
unvalidated upload handler
messy one-off scripts
```

This classification is crucial.

---

# RuizTech Compliance Layer

You need an internal standard. Call it something like:

```txt
RuizTech Code Standard
```

Every reusable asset should be checked against it.

Minimum compliance rules:

```txt
No secrets.
No hardcoded private URLs.
No hidden vendor lock-in unless documented.
No untyped/unclear inputs where avoidable.
Clear function/component name.
Clear purpose.
Clear dependencies.
Clear usage example.
Small enough to reuse.
No unrelated side effects.
Error handling included.
Security assumptions documented.
Compatible framework listed.
Source repo and commit recorded.
License/provenance checked.
```

For UI components:

```txt
responsive behavior
accessibility notes
props documented
styling dependencies listed
no hardcoded business copy unless intentional
```

For server/API code:

```txt
auth requirements documented
input validation documented
error handling documented
rate-limit needs documented
database access documented
security risks documented
```

---

# The thing you want to avoid

You do **not** want this:

```txt
Copy code from old project.
Paste into new project.
Fix broken imports.
Fix styles.
Fix auth assumptions.
Forget where it came from.
Lose improvements.
Repeat forever.
```

You want this:

```txt
Find approved RuizTech asset.
Review compatibility.
Install into target repo.
Generate adapter if needed.
Update imports.
Run validation.
Record usage.
Track version.
```

That is the studio advantage.

---

# The eventual user flow

In the future Studio app, you should be able to do this:

```txt
1. Connect new GitHub repo.
2. Studio analyzes repo.
3. Studio says:
   “This looks like a Next.js chat app.”
4. Studio detects missing pieces:
   - auth wrapper
   - chat message component
   - API error handler
   - token usage logger
5. Studio recommends existing RuizTech assets:
   - `ChatMessageBubble`
   - `SupabaseServerClient`
   - `RateLimitMiddleware`
   - `SQLiteRequestLogger`
6. You approve selected assets.
7. Studio creates an integration plan.
8. Codex applies the plan.
9. Studio validates and records what was installed.
```

That is much more powerful than copy/paste.

---

# New docs your repo needs

Your current docs are good for Step 2, but the next doc should not be TinySheets-specific.

The next doc should define this asset system.

Create:

```txt
CODE_ASSET_PROTOCOL.md
```

Then later:

```txt
RUIZTECH_CODE_STANDARD.md
ASSET_REGISTRY_SCHEMA.md
ASSET_INSTALLATION_PROTOCOL.md
REPO_ONBOARDING_PROTOCOL.md
```

Order matters.

I would do:

```txt
Step 3: CODE_ASSET_PROTOCOL.md
Step 4: REPO_ONBOARDING_PROTOCOL.md
Step 5: RUIZTECH_CODE_STANDARD.md
Step 6: ASSET_INSTALLATION_PROTOCOL.md
```

Because the core concept is now reusable proprietary assets.

---

# Correct Step 3

Step 3 should now be:

```txt
Define the RuizTech Code Asset Protocol.
```

This answers:

```txt
What is a reusable asset?
How does Studio detect it?
How does Studio classify it?
How does Studio approve it?
How does Studio store it?
How does Studio reuse it in another repo?
```

---

# Codex prompt for Step 3

Use this:

```md
Read `AGENTS.md` before starting.

Goal:
Create `CODE_ASSET_PROTOCOL.md` to define how RuizTech Studio extracts, classifies, stores, and reuses proprietary RuizTech code assets from connected GitHub repositories.

Context:
RuizTech Studio is not only a markdown source-of-truth repo. The product concept is a studio driver that can ingest GitHub repositories, understand their code, extract reusable functions/components/algorithms/patterns/templates, store them as RuizTech proprietary assets, and later install or adapt those assets into future projects without manual copy-paste.

Scope:
Create only:

- `CODE_ASSET_PROTOCOL.md`

Also update only these existing docs if needed to reference this new protocol:

- `README.md`
- `STUDIO_PROTOCOL.md`
- `STUDIO_DASHBOARD.md`
- `AGENTS.md`
- `APP_REGISTRY.md`

Constraints:
- Do not create app source code.
- Do not initialize any framework.
- Do not create package.json.
- Do not add dependencies.
- Do not create database schemas yet.
- Do not implement vector storage yet.
- Do not implement GitHub ingestion yet.
- This is a documentation/specification step only.
- Preserve TinySheets as the current active app.
- Clarify that TinySheets is the first active product/use case, but the Studio’s larger purpose includes building a reusable RuizTech code asset library.

Acceptance Criteria:
- `CODE_ASSET_PROTOCOL.md` defines what a RuizTech code asset is.
- It includes asset types: functions, components, algorithms, patterns, templates, workflows, prompts, schemas, and integrations.
- It explains how assets are detected from uploaded/connected repos.
- It explains how assets are classified into:
  - reusable as-is
  - reusable with adapter
  - project-specific only
  - do not reuse
- It defines required metadata for each asset:
  - name
  - type
  - source repo
  - source file
  - commit SHA
  - purpose
  - dependencies
  - compatibility
  - inputs/outputs
  - side effects
  - test status
  - compliance status
  - reuse status
  - integration instructions
- It defines a RuizTech compliance review concept.
- It defines how assets should be stored for search/retrieval.
- It defines how vector search and structured metadata work together.
- It defines how assets should be suggested for future projects.
- It defines how assets should be installed into target repos through an approved integration plan, not manual copy-paste.
- It includes warnings about secrets, license/provenance, app-specific code, and unsafe reuse.
- Existing docs briefly reference the Code Asset Protocol as part of the Studio’s larger purpose.
- No implementation files are created.

Validation:
- Confirm `CODE_ASSET_PROTOCOL.md` exists.
- Confirm no app code or framework files were created.
- Confirm TinySheets remains the active app.
- Confirm the protocol clearly explains reusable RuizTech proprietary code assets.
- Confirm existing docs still describe this repo as a source-of-truth/studio operating repo.

Final response format:
- Summary
- Files changed
- Why the change was made
- Validation performed
- Risks or open questions
- Suggested next task
```

---

# Commit message

Use:

```bash
git add CODE_ASSET_PROTOCOL.md README.md STUDIO_PROTOCOL.md STUDIO_DASHBOARD.md AGENTS.md APP_REGISTRY.md
git commit -m "docs: define RuizTech code asset protocol"
git push origin main
```

# My corrected understanding

We are building:

```txt
A studio system that ingests GitHub repos, understands them, extracts reusable RuizTech-created assets, stores those assets with metadata/vector search/compliance status, and lets future projects reuse approved assets through controlled integration instead of manual copy-paste.
```

TinySheets is not just an app.

TinySheets is also the first source of future reusable assets:

```txt
worksheet generator logic
PDF rendering logic
dashboard components
auth helpers
form components
generation prompts
export workflow
```

Later, a chat app may reuse:

```txt
auth helpers
dashboard shell
API error wrapper
rate limiter
message component
file upload pipeline
logging system
```

The Studio becomes your proprietary RuizTech Services code memory and reuse engine.
