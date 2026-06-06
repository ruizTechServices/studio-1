# Designing the AI / Local Model Router for studio-1
### Prompt for the next conversation

---

## Before Anything Else — Read the Handoff

> **This file is the source of truth for the project state and conventions. Do not skim it. Read every section.**

```
c:\Users\giost\CascadeProjects\projects\application-studio\studio-1\CURRENT_PROJECT_HANDOFF.md
```

After reading, you should be able to answer:

- What kind of app is studio-1?
- What pages exist and what does each do?
- What does the backend `lib/` structure look like?
- What deterministic map layers already exist and what does each return?
- Why is the project local-first and why has no AI been added yet?
- What is the established route ordering discipline in `routes/repos.js`?

---

## STEP 1 — Where We Are

studio-1 is a **local-first project recovery and project-mapping studio**. It is an Express 5 + vanilla JS + SQLite app. No React, no Vite, no TypeScript, no build step. ESM modules. HTML partials loaded via `data-include`.

**Current branch: `main`.** The following layers are all implemented, verified, and merged:

| Layer | Status |
|---|---|
| Repo Intake (local folder upload + GitHub URL import) | ✅ Merged |
| Project Map v1 — file categorization + grouping | ✅ Merged |
| Project Summary v1 — deterministic project type / framework / capability / missing-area inference | ✅ Merged |
| Symbol Map v1 — line-level extraction of imports, exports, functions, classes, methods, constants, route handlers, schemas | ✅ Merged |
| Dependency Map v1 — import/require/re-export edges + most-imported hubs + orphans | ✅ Merged |
| Behavior Map v1 — 15 behavioral signal detectors across UI / network / navigation / data / auth / reliability / IO | ✅ Merged |
| Algorithm Map v1 — 16 algorithmic signal detectors across search / transform / aggregate / validation / control / safety / IO | ✅ Merged |
| Recovery Assistant v1 — synthesis layer over all 5 maps + `action_events` query | ✅ Merged |

> Every layer above is **read-only, deterministic, file-scan based, and never executes imported repo code.**

---

## STEP 2 — The Next Task

The next product layer is the **AI / local model router.**

This is the **first layer in studio-1 that introduces an LLM.** Everything before this was rule-based and reproducible. The router is what lets future panels ask natural-language questions about a repo and get answers grounded in the existing map data.

**Do not implement yet.** The first job is to think through the design and produce a written proposal that Gio can review and edit before any code is written.

---

## STEP 3 — What to Contemplate

Work through these questions and write a structured design document. Treat each cluster as a section.

---

### A. Local Model Runtime

- Which local runtime should be the default? Ollama, llama.cpp server, LM Studio, something else?
- How does studio-1 detect that a local runtime is reachable?
- What is the connection contract — HTTP base URL + model name, or richer?
- What happens when no local runtime is running? Hard fail, silent fall-through to cloud, or user-visible "no model available" state?

---

### B. Cloud Fallback

- Should there be a cloud fallback at all in v1, or is local-only the v1 promise?
- If yes — which provider(s)? OpenAI? Anthropic? Both via abstraction?
- Where do API keys live — `.env`, SQLite, a settings panel?
- Is cloud opt-in per-request, per-session, or per-installation?

---

### C. Routing Logic

What does "router" actually mean here? Is it:

- A static config that picks one provider, or
- A runtime decision based on task type (short summary vs. long synthesis), or
- A user-toggled choice in the UI, or
- Some combination?

**Define the smallest version that earns the name "router" without overbuilding.**

---

### D. First User-Facing Feature

> The router is plumbing — it needs a real feature to validate it.

Propose one concrete first feature that consumes the router. Options to weigh:

| Option | Description |
|---|---|
| "Explain this repo" | Feed Recovery Assistant data + ask for a paragraph answer |
| "Where do I start?" | Ground in `inspectFirst` and produce a narrative reading order |
| Q&A box on the files page | Ask any question about the repo |
| Per-file explanation | Pick a file, get a plain-language description |

**Pick one. Justify it. Note what it gives Gio that the current deterministic Recovery Assistant doesn't already give.**

---

### E. Backend Shape

Working from the existing patterns in `lib/repos/`, `routes/repos.js`, and `lib/index.js`:

- Where does the new code live? `lib/ai/`? `lib/llm/`?
- What's the smallest module surface? Probably one `chat(messages, options)` function plus a `health()` check.
- What does the route look like? `POST /api/ai/chat` or feature-specific like `POST /api/repos/:id/ai/explain`?
- How is request validation done? Reuse Zod schemas under `lib/validation/schemas.js`?
- How are events logged? New action values like `ai_request_started`, `ai_request_succeeded`, `ai_request_failed`?

---

### F. Frontend Shape

- Where does the first feature appear — on `files.html`, somewhere else, or as a new panel?
- Follow the existing partial + render + controller pattern. Sketch the file list.
- Streaming or blocking? If streaming, how does it integrate with the current `readApiJson` helper, which assumes a single JSON body?

---

### G. Grounding and Prompt Construction

> The router cannot hallucinate about the repo. It must be grounded in real data.

- What gets sent to the model? The full Project Summary? Recovery Assistant output? Selected file contents?
- How large is the typical context payload? Token budget concerns for local models?
- Is there a system prompt template? Where does it live?

---

### H. Cost, Privacy, Safety

- **Local-first promise:** no repo content should leave the machine unless the user explicitly chose cloud. How is that enforced in code, not just in policy?
- Token counting / cost tracking — needed in v1, or punted to v2?
- Rate limiting on the AI route — needed?
- Any moderation step before sending content to a cloud provider?

---

### I. What v1 Explicitly Does NOT Do

Just as important as scope. Defer these:

- Embeddings
- Vector search
- Multi-turn conversation memory beyond a single exchange
- Streaming *(maybe)*
- Tool calling / function calling
- Cost dashboards
- Multiple model swapping mid-conversation

> Anything you list here makes v1 cleaner.

---

## STEP 4 — Constraints (Non-Negotiable)

| Constraint | Rule |
|---|---|
| Existing map helpers | Do not modify any existing map helper or its endpoint. The router consumes them; it does not change them. |
| Stack | Do not introduce a build step, a framework, or TypeScript. |
| Version control | Do not commit anything. Produce a written proposal first. |
| Route ordering | Any new `/api/repos/:id/...` sub-route must register before the `/:id` catch-all. |
| Error handling | Preserve the existing sanitized error-handling contract — no stack traces, no provider error bodies, no API keys leaked to clients. |
| Local-first identity | Cloud, if included, must be a deliberate user choice, not a default fallback that silently sends repo content out. |

---

## STEP 5 — Deliverable

Produce a single design document with these sections:

1. **Recommended runtime + provider stack** *(one-sentence reasoning per choice)*
2. **Router scope for v1** *(what "router" means in this codebase, concretely)*
3. **First feature to build on top** *(and why this one)*
4. **Backend module + route layout** *(file list + function signatures, no implementation)*
5. **Frontend panel + control flow** *(file list + render contract)*
6. **Grounding strategy** *(what data goes into the prompt, what the system prompt looks like)*
7. **Event logging additions**
8. **Out-of-scope list for v1**
9. **Open questions for Gio to answer before code is written**

> Keep the proposal tight. Bullet lists over prose. No code yet — names, shapes, and tradeoffs only.

---

**Before writing the proposal:** confirm to Gio in one short message — which runtime you'll recommend, which first feature you'll recommend, and one open question you already see. **Wait for his reply, then write the full proposal.**
