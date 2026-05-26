===
## Source of Truth Rule

This repository is the source of truth for RuizTech Studio.

Do not rely on scattered chats, screenshots, memory, or loose notes when resuming work.

Every serious decision, active app, milestone, Codex task, and next action must be reflected in this repository.
===

===
## Active App Rule

Only one app can be the primary active app at a time.

The active app receives the main build energy, Codex tasks, architecture work, and weekly planning.

Secondary apps may only receive work if:
- they create immediate cash flow
- they unblock the active app
- they are being documented, not expanded

Current active app(NOTE: UPDATE THIS WHEN CHANGING ACTIVE APP): TinySheets Worksheet Generator.
===

===

## Daily Resume Loop

Start every session here.

1. Confirm the active app.
2. Confirm the current milestone.
3. Review the next task.
4. Check blockers.
5. Create or use one Codex-ready ticket.
6. Implement, review, test, commit, and push.
7. Update this dashboard before stopping.

If the dashboard does not reflect the current state, the session is not finished.

===


# RUIZTECH STUDIO DASHBOARD
### Master Issue
#### Build focused, sellable, maintainable software products.

---

## Studio Purpose

> RuizTech Studio exists to help me build, launch, sell, and maintain profitable software products without losing context between work sessions.

### In This Issue

This is the master source of truth for:

- active app focus
- app statuses
- revenue goals
- next actions
- paused projects
- blockers
- Codex prompts
- decisions
- launch priorities

### Editorial Note

The goal is not to build many half-finished apps.

The goal is to build focused, sellable, maintainable products that can become real businesses.

---

## Cover Story
## Current Active App

### App Name
**TinySheets Worksheet Generator**

### One-Sentence Product Description
*K-2 teachers, tutors, and homeschool parents generate clean one-page math and vocabulary worksheets in under 60 seconds.*

### Current Stage
MVP planning / early build

### Current Goal
Create the first usable version that allows a logged-in user to generate and export one worksheet.

### Revenue Goal
Validate whether teachers/tutors will pay approximately $12/month or a low one-time fee for quick worksheet generation.

### Why This App Matters
This app has a clear user, clear pain, and clear output.

Teachers and tutors constantly need printable materials. If TinySheets saves them time and produces clean worksheets, it has a realistic chance of becoming a small SaaS product.

---

## Feature Section
## Current Weekly Objective

**Build the minimum working TinySheets MVP foundation.**

### The MVP Foundation Means

- landing page
- login/auth shell
- dashboard shell
- worksheet generation form
- one-page worksheet output
- PDF export
- saved worksheet history

> Only the smallest working version matters right now.

---

## Daily Brief
## Today's Objective

**Define the studio structure and create the master dashboard.**

Today is not for building the app.

Today is for creating the system that lets me resume work without confusion.

---

## Studio Index
## Active App Registry

| App | Status | Priority | Revenue Path | Next Action |
|---|---|---:|---|---|
| TinySheets | Active | 1 | SaaS/subscription or low-cost paid tool | Finish MVP foundation |
| Tech Rescue Sprint | Secondary | 2 | Local service sales / lead capture | Improve offer and intake flow |
| 24HourGPT | Paused | 3 | $1 temporary AI access | Revisit after one product ships |
| LetMeExplain | Paused | 4 | SaaS for feedback rewriting | Revisit after TinySheets |
| Nucleus | Research | 5 | Desktop AI assistant subscription | Keep as long-term R&D |

---

## House Rule
## Current Rule

Only one app gets primary focus at a time.

### Current Primary App

**TinySheets Worksheet Generator**

Everything else is secondary unless it produces immediate cash.

---

## Out of Scope
## What I Am NOT Doing Right Now

- I am not building a custom studio dashboard yet.
- I am not starting another new app.
- I am not rebuilding architecture from scratch.
- I am not adding unnecessary AI agents.
- I am not adding ten model providers.
- I am not designing complex admin systems before the MVP works.
- I am not wasting time on perfect UI before the core workflow works.
- I am not using Codex without a clear ticket.
- I am not letting Codex make product decisions.

---

## Operating Model
## Studio Operating Rule

### ChatGPT / Ada Is Used For

- strategy
- scope control
- architecture review
- feature specs
- Codex prompt creation
- reviewing Codex output
- debugging reasoning
- deciding what matters next

### Codex Is Used For

- implementing scoped tickets
- modifying existing code
- writing tests
- fixing bugs
- running lint/typecheck/tests
- summarizing changed files

### Final Decision

I make the final decisions.

---

## Product Definition
## Current TinySheets MVP Definition

The first version only needs to prove this:

> A logged-in user can generate a simple K-2 worksheet and export it as a PDF.

**That is the MVP.**

Not multi-page workbooks.  
Not AI books.  
Not school management.  
Not full curriculum planning.  
Not marketplace features.  
Not advanced analytics.

---

## Requirements
## TinySheets MVP Features

### Required

- Landing page
- Auth/login
- Protected dashboard
- Worksheet creation form
- Math worksheet mode
- Vocabulary worksheet mode
- One-page worksheet preview
- PDF export
- Save generated worksheet
- Basic worksheet history

### Not Required Yet

- Payments
- Admin dashboard
- Multiple classrooms
- Student accounts
- Multi-page worksheet packets
- AI-generated books
- Advanced customization
- Marketplace
- Parent/student portal

---

## Production Notes
## Current Technical Assumptions

### Frontend
Next.js App Router

### Styling
Tailwind CSS  
ShadCN UI where useful

### Auth
Supabase Auth

### Database
Supabase Postgres

### File Storage
Supabase Storage for generated PDF/spec files when needed

### PDF Generation
To be decided after the worksheet rendering structure is clear

### Deployment
Vercel

---

## Back Page
## Current Local Paths

### Studio Root

```txt
C:\Users\giost\CascadeProjects\ruiztech-studio
```
