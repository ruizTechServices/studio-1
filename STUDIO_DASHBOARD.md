# RuizTech Studio Review
## Issue 01 | The Focus Issue | May 2026

---

## From the Editor
RuizTech Studio exists for one reason: to turn software effort into durable, sellable products without losing direction between work sessions. This document is not a brainstorm file, a wish list, or a dumping ground for half-formed ideas. It is the operating issue of the studio: the place where priorities are named clearly, tradeoffs are made deliberately, and next actions stay visible.

This issue sets the tone for how the studio works. The objective is not to accumulate projects. The objective is to ship one focused product that solves a real problem well enough to earn revenue, create momentum, and justify the next expansion.

**Issue thesis:** disciplined focus is the growth strategy.

---

## Cover Story
## TinySheets Leads the Studio

### The Product on the Cover
**TinySheets Worksheet Generator**

### The One-Sentence Pitch
TinySheets helps K-2 teachers, tutors, and homeschool parents generate clean one-page math and vocabulary worksheets in under 60 seconds.

### Current Stage
MVP planning / early build

### The Assignment
Build the first usable version where a logged-in user can generate one worksheet, preview it, and export it as a PDF.

### Why This Story Matters
TinySheets leads the issue because it has the strongest combination of clarity and practicality. The audience is specific. The pain is recurring. The desired outcome is obvious. Teachers and tutors need printable material constantly, and they usually need it fast. A product that reduces prep time and produces classroom-ready output has a credible path to becoming a real small SaaS business rather than another interesting but unfinished experiment.

### The Revenue Question
The immediate commercial test is simple: will teachers and tutors pay roughly **$12/month**, or a modest one-time fee, for speed, simplicity, and consistent worksheet quality?

If the answer is yes, TinySheets earns the right to deepen. If the answer is no, the product needs sharper positioning, better workflow design, or a different pricing frame before any major expansion.

---

## Lead Feature
## This Week's Editorial Calendar

This week's work is about building the minimum viable foundation for TinySheets. Nothing here is decorative. Every item on the list supports the shortest path from concept to proof.

- landing page
- login/auth shell
- dashboard shell
- worksheet generation form
- one-page worksheet output
- PDF export
- saved worksheet history

The operating standard for the week is restraint. The smallest working version is more valuable than a larger, more impressive draft that cannot yet prove demand.

---

## News Desk
## Today's Brief

Today's work is about studio clarity, not feature shipping.

The purpose of today is to establish the structure that makes future execution faster and less fragile:

- define the studio structure
- finalize the master dashboard
- make it easy to resume work without confusion

This is infrastructure for judgment. A clean operating system reduces wasted motion, prevents context loss, and keeps the next session pointed at real output instead of rediscovery.

---

## The Studio Index
## Active Project Scoreboard

| Project | Status | Priority | Revenue Path | Next Action |
|---|---|---:|---|---|
| TinySheets | Active | 1 | SaaS subscription or low-cost paid tool | Finish MVP foundation |
| Tech Rescue Sprint | Secondary | 2 | Local service sales / lead capture | Improve offer and intake flow |
| 24HourGPT | Paused | 3 | $1 temporary AI access | Revisit after one product ships |
| LetMeExplain | Paused | 4 | SaaS for feedback rewriting | Revisit after TinySheets |
| Nucleus | Research | 5 | Desktop AI assistant subscription | Keep as long-term R&D |

### What the Scoreboard Says
This table is not neutral. It reflects the current editorial stance of the studio:

- TinySheets is the lead business candidate.
- Tech Rescue Sprint remains relevant because it can produce nearer-term cash.
- Everything else is either paused intentionally or held as future research.

Priority exists to remove ambiguity. If work competes for attention, the table decides.

---

## Editorial Policy
## The Focus Doctrine

Only one app gets primary focus at a time.

**Current primary app:** TinySheets Worksheet Generator

Everything else stays secondary unless it creates immediate cash flow or directly supports the lead product. This is a rule, not a suggestion. Fragmented attention creates diluted products, slower shipping, weaker judgment, and fake progress disguised as activity.

RuizTech Studio does not need more ideas right now. It needs one clean win.

---

## The Cut List
## What We Are Not Doing

The following items are explicitly out of scope for the current issue:

- building a custom studio dashboard yet
- starting another new app
- rebuilding architecture from scratch
- adding unnecessary AI agents
- adding ten model providers
- designing complex admin systems before MVP proof
- polishing UI before the core workflow works
- using Codex without a clear ticket
- letting Codex make product decisions

These exclusions matter because scope control is not the absence of ambition. It is applied ambition. Every item removed from the current cycle increases the odds that the remaining work ships.

---

## Roles and Responsibilities
## How the Studio Operates

### ChatGPT / Ada
Used for strategy, scope control, architecture review, feature specs, Codex prompt creation, output review, debugging reasoning, and deciding what matters next.

### Codex
Used for implementing scoped tickets, modifying existing code, writing tests, fixing bugs, running lint/typecheck/tests, and summarizing changed files.

### Final Authority
You make the final decisions.

The distinction is important. Strategic judgment and implementation support are different jobs. The studio works best when those roles stay clear.

---

## Product Brief
## TinySheets MVP Definition

The first version only needs to prove one thing:

**A logged-in user can generate a simple K-2 worksheet and export it as a PDF.**

That is the entire test. If that workflow works, the product has a foundation. If that workflow does not work, everything else is premature.

### Not Part of This Issue
- multi-page workbooks
- AI books
- school management
- full curriculum planning
- marketplace features
- advanced analytics

These are expansion ideas, not launch requirements. They may matter later. They do not matter now.

---

## Specifications
## What the MVP Must Include

### Required for the First Valid Release
- landing page
- auth/login
- protected dashboard
- worksheet creation form
- math worksheet mode
- vocabulary worksheet mode
- one-page worksheet preview
- PDF export
- save generated worksheet
- basic worksheet history

### Explicitly Deferred
- payments
- admin dashboard
- multiple classrooms
- student accounts
- multi-page worksheet packets
- AI-generated books
- advanced customization
- marketplace
- parent/student portal

The principle is straightforward: build only what is necessary to test usefulness, usability, and willingness to pay.

---

## Production Notes
## Current Technical Direction

- **Frontend:** Next.js App Router
- **Styling:** Tailwind CSS, ShadCN UI where useful
- **Auth:** Supabase Auth
- **Database:** Supabase Postgres
- **Storage:** Supabase Storage for generated PDF/spec files as needed
- **PDF Generation:** decision pending worksheet rendering structure
- **Deployment:** Vercel

This stack is sufficient for the current issue. No platform expansion should happen unless the MVP proves a real need for it.

---

## Back Page
## Local Reference

```txt
C:\Users\giost\CascadeProjects\ruiztech-studio
```
