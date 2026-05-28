
# Studio-1 Dashboard — Full Specification

## 1. Meta / Frame

- **Format:** Desktop browser mockup in dark mode
- **Browser chrome:** macOS-style window with traffic light buttons (red/yellow/green) top-left
- **URL bar:** `studio-1.app` (HTTPS lock icon present)
- **Window controls:** Back/forward arrows left, refresh icon, share icon top-right
- **Aspect ratio:** Standard widescreen desktop (~16:10)

## 2. Color System

| Token | Approx. Hex | Usage |
|---|---|---|
| `bg-base` | `#0A0E1A` (very dark navy) | App background |
| `bg-surface` | `#111827` / `#0F172A` | Card backgrounds |
| `bg-elevated` | `#1A1F2E` | Nested elements, active sidebar item |
| `border-subtle` | `#1F2937` | Card outlines, dividers |
| `text-primary` | `#F9FAFB` | Headings, primary values |
| `text-secondary` | `#9CA3AF` | Descriptions, labels |
| `text-muted` | `#6B7280` | Timestamps, hints |
| `accent-blue` | `#3B82F6` | Logo, primary CTAs, "studio-1" branding |
| `accent-green` | `#10B981` | Success, health, completed states |
| `accent-orange` | `#F59E0B` | Medium priority, running agents |
| `accent-red` | `#EF4444` | High priority, alerts |
| `accent-purple` | `#8B5CF6` | Workflows, secondary categorization |

**Theme:** Dark, glassy, modern SaaS aesthetic. High contrast on primary text, muted secondary layers.

## 3. Layout Grid

- **Two-column structure:** Fixed left sidebar (~250px) + fluid main content
- **Main content:** 12-column grid, cards arranged in **4-up rows** (each card spans 3 columns)
- **Two card rows** below the welcome header and stat strip
- **Bottom bar:** Sticky input bar across full main content width
- **Border radius:** ~12px on all cards, ~8px on inner elements
- **Card padding:** ~24px
- **Gap between cards:** ~16px

## 4. Left Sidebar

### 4.1 Logo block (top)
- Blue stylized "S" mark + wordmark "**studio-1**"

### 4.2 Primary navigation (icon + label, vertical list)
1. **Home** (active state — slightly elevated background, brighter text)
2. Projects
3. Specs
4. Agents
5. Workflows
6. Memory
7. Files
8. Settings

Icons are outlined, consistent stroke (Lucide-style).

### 4.3 Projects section
- Header: `PROJECTS` (uppercase, muted) with a `+` add button on the right
- Items (each with a small project icon):
  - **studio-1** (active — small blue indicator dot)
  - Acme SaaS
  - Marketing Site
  - Mobile App
  - Internal Tools
  - `+ New Project` (dimmed, add-style row)

### 4.4 Bottom plan card
- Label: **Pro Plan**
- Price: **$20 /mo** (large)
- Subtext: `Renews Jun 12, 2025`
- Full-width blue button: **Manage Plan**

## 5. Top Bar (main content area)

Right-aligned cluster:
- Search input with `⌘K` keyboard hint chip
- Calendar icon
- Notification bell icon
- Circular user avatar (photo)

## 6. Welcome Header

- **H1:** `Welcome back, Alex 👋`
- **Subtitle (muted):** `Here's what's happening with your projects and AI teammates.`

## 7. Stat Strip (4 KPI cards)

Each card: large number + label + colored sub-stat.

| Card | Primary | Sub-metric (colored) |
|---|---|---|
| Projects | **6** | 2 active (blue) |
| Specs | **18** | 6 updated (green) |
| Agents | **4** | 2 running (orange) |
| Workflows | **7** | 3 scheduled (purple) |

## 8. Main Grid — Row 1 (4 cards)

### 8.1 Active Projects
- Header: "Active Projects" + `View all` link (right)
- **Featured project block:**
  - Icon + name **studio-1** + "Featured" badge
  - Description: `AI-powered dev command center for solo builders.`
  - **Progress bar:** labeled "Progress" with `68%` right-aligned
  - **4-column stat row:** Specs `12` | Tasks `24/36` | Agents `2` | Updated `2h ago`
- **Sub-project list** (each row: icon, name, % value, mini progress bar in unique color):
  - 📄 Marketing Site Redesign — 45% (blue bar)
  - 📱 Mobile App v2 — 20% (purple bar)
  - 🛠️ Internal Tools — 75% (green bar)
- Footer button: `+ New Project` (outlined/ghost style)

### 8.2 Recent Specs
- Header + `View all`
- List rows (document icon | title | version badge on right):
  - Checkout Redesign — `v1.3` — Updated 2h ago
  - User Authentication Flow — `v1.1` — Updated 5h ago
  - Data Dashboard Spec — `v2.0` — Updated yesterday
  - AI Agent Orchestration — `v1.0` — Updated 2d ago
  - API Rate Limiting Plan — `v1.2` — Updated 3d ago

### 8.3 Running Agents
- Header + `View all`
- List rows (agent icon | name + status | **circular progress ring** showing %):
  - Code Generator — `Implementing user auth...` — **75%** (blue ring)
  - Test Runner — `Running test suite...` — **45%** (orange ring)
  - Spec Writer — `Drafting API spec...` — **60%** (purple ring)
  - Refactor Agent — `Optimizing components...` — **30%** (green ring)
- Footer button: `+ New Agent`

### 8.4 Quick Create
- Header (no view-all)
- 4 action rows (large icon left, title + description, chevron right `>`):
  - **New Spec** — Define requirements
  - **New Agent** — Create AI teammate
  - **New Workflow** — Automate tasks
  - **New Project** — Start from scratch

## 9. Main Grid — Row 2 (4 cards)

### 9.1 Saved Prompts
- Header + `View all`
- List rows (icon | title | `prompt` tag on right):
  - Code Review Checklist
  - PRD Template
  - Test Plan Generator
  - UX Critique
- Footer button: `+ New Prompt`

### 9.2 Recent Activity
- Header + `View all`
- Activity feed (avatar/icon | bold subject + grey predicate | timestamp right):
  - **Checkout Redesign** spec updated — 2h ago
  - **Code Generator** agent started — 3h ago
  - **Test Runner** completed — 5h ago
  - **User Authentication Flow** created — 5h ago
  - **Refactor Agent** completed — 1d ago

### 9.3 Upcoming Tasks
- Header + `View all`
- Task rows (icon | title + due date | colored priority pill right):
  - Review API spec — Due today — 🔴 **High**
  - User testing session — Due tomorrow — 🟠 **Medium**
  - Deploy to staging — Due May 16 — 🟠 **Medium**
  - Performance audit — Due May 18 — 🔵 **Low**

### 9.4 Project Health
- Header (no view-all)
- **Semicircular gauge** (half-donut, green-filled arc):
  - Large center number: **82**
  - Label below: `Excellent` (green)
- Metric list below (each: green ✓ checkmark | label | % value | small toggle/eye icon):
  - Specs Coverage — 85%
  - Test Coverage — 78%
  - Task Completion — 62%
  - Code Quality — 90%
- Footer button: `View Report`

## 10. Bottom Sticky Bar

Full-width chat/command input:
- Left: small chat/document icon
- Placeholder: `Ask studio-1 anything...`
- Right cluster:
  - **`Deep Research`** toggle switch (currently OFF)
  - Paperclip attachment icon
  - **Send button** — blue circular button with upward arrow

## 11. Typography

- **Font family:** Sans-serif, geometric (Inter / Geist / similar)
- **Heading scale:** ~28–32px for H1, ~16–18px for card titles, ~14px for body, ~12px for meta/labels
- **Weight usage:** Bold for KPI numbers and headings, medium for card titles, regular for body, all-caps + tracking for sidebar section labels
- **Numerals:** Likely tabular figures for KPI alignment

## 12. Iconography & Visual Language

- **Icon library:** Looks like Lucide or Phosphor (outlined, 1.5–2px stroke)
- **Status indicators:** Solid color dots, pill-shaped badges, colored progress bars and rings
- **Avatars:** Circular, photographic for user, generative gradient/glyph for projects/agents
- **No skeuomorphism** — flat, modern, minimal shadow

## 13. Domain / Product Context

This is the home dashboard for **studio-1**, an AI-powered developer command center targeting **solo builders**. Core domain entities:

- **Projects** — top-level workspaces
- **Specs** — versioned requirement documents (v1.0, v1.3, etc.)
- **Agents** — AI workers with real-time progress (Code Generator, Test Runner, Spec Writer, Refactor Agent)
- **Workflows** — automation pipelines
- **Memory / Files** — persistent context stores
- **Saved Prompts** — reusable prompt templates
- **Tasks** — work items with due dates and priority
- **Project Health** — composite scoring across specs, tests, completion, quality

The bottom chat bar plus "Deep Research" toggle implies a **conversational AI shell** layered on top of the dashboard — you can both *view* state and *invoke* the system via natural language.

## 14. Information Architecture Pattern

- **Tiered density:** KPI strip → drill-down cards → list views (`View all` on every card hints at dedicated detail pages)
- **Action-oriented:** Every card surface has either a CTA button (`+ New X`) or a row-level action (chevron, button)
- **State-rich:** Progress percentages, timestamps, version tags, and status colors are persistently visible — the dashboard is meant to communicate *system state at a glance*

