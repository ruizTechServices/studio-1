# Status Notice

This is a historical handoff-update prompt, not current implementation truth or the current next-task sequence. Use `docs/CURRENT_PROJECT_HANDOFF.md` and current code instead.

Current sequence is smoke tests, docs reconciliation, Reusable Assets v0, and only then consideration of local model/AI routing.

---

Read CURRENT_PROJECT_HANDOFF.md first.

We are on branch main.

Current git state from Gio:

main
63e2067 (HEAD -> main, origin/main) merge: add project summary v1
79d4dea (origin/feature/project-summary-v1, feature/project-summary-v1) feat: add project summary v1
bad79eb docs: update handoff after project map v1
5cdd2f6 (origin/feature/project-map-v1, feature/project-map-v1) fix: clean project map response and remove temp file
044b1f4 feat: add Project Map v1 (GET /api/repos/:id/project-map + UI panel)

Task:
Update CURRENT_PROJECT_HANDOFF.md to the latest information ONLY. YOU MUST NOT IMPLEMENT ANYTHING ELSE EXCEPT UPDATING `CURRENT_PROJECT_HANDOFF.md`.

Do not implement Symbol Map v1.
Do not change app code.
Do not change API code.
Do not change frontend files.
Do not delete docs in this task.
Only clean and update CURRENT_PROJECT_HANDOFF.md so it accurately reflects:

Project Map v1 ✅ merged into main
Project Summary v1 ✅ merged into main
Symbol Map v1 ← current next task

The uploaded/current handoff file is stale in several places:
- It has duplicate old branch data.
- It still references old commit 4312fc9 as HEAD.
- It has a broken markdown code fence in Current branch and repo state.
- It still says Project Summary v1 is the next engineering step.
- It still has old Project Summary implementation instructions even though Project Summary v1 is already merged.
- It has duplicate Bottom line sections.
- It has duplicate Frontend initialization sections.
- It has stale Home initializer implementation checklist content that now reads like a future task even though home initializer is complete.

Edit the file carefully and preserve useful current architecture details.

Required edits:

1. Replace the entire section:

## Current branch and repo state

with this exact section:

## Current branch and repo state

Current branch:

```bash
main

Latest known local and remote head:

63e2067 (HEAD -> main, origin/main) merge: add project summary v1

Recent commits:

63e2067 merge: add project summary v1
79d4dea feat: add project summary v1
bad79eb docs: update handoff after project map v1
5cdd2f6 fix: clean project map response and remove temp file
044b1f4 feat: add Project Map v1 (GET /api/repos/:id/project-map + UI panel)

Current known state:

main is aligned with origin/main.
Project Map v1 is merged into main.
Project Summary v1 is merged into main.
The current handoff is root-level at CURRENT_PROJECT_HANDOFF.md.

Official repo:

https://github.com/ruizTechServices/studio-1.git

Important rule:

The repo is the source of truth. Always confirm the current branch before giving implementation advice.

In:
Backend routes

Update the Current API surface so it includes BOTH:

GET    /api/repos/:id/project-map
GET    /api/repos/:id/project-summary

The route list should become:

GET    /api/filter-rules

GET    /api/repos
GET    /api/repos/:id
GET    /api/repos/:id/project-map
GET    /api/repos/:id/project-summary
POST   /api/repos/upload
POST   /api/repos/import-github
DELETE /api/repos/:id

GET    /api/events
POST   /api/events

GET    /api/entities/:type/:id/events

After the Project Map sentence, add this sentence:

`GET /api/repos/:id/project-summary` is implemented and returns a deterministic, rule-based Project Summary built from Project Map data.
In:
Backend lib structure

Under the existing lib folder list, add a short subsection or sentence that documents:

lib/repos/projectMap.js
lib/repos/projectSummary.js

Also add:

`projectSummary()` reuses `projectMap()` instead of duplicating file grouping logic.
Replace the entire section:
File categories

with this exact section:

File categories

Repo files are classified into categories.

Known categories:

components
pagesRoutes
apiEndpoints
databaseFiles
authLogic
paymentLogic
aiLogic
documentation
tests
configFiles
functions
other

These categories now power Project Map v1 and Project Summary v1.

Project Map v1 groups files by category.

Project Summary v1 uses the grouped categories to infer project type, capabilities, missing/light areas, and supporting evidence.

In:
Project Map v1

Make sure the first sentence says exactly:

Project Map v1 is implemented, verified, and merged into `main`.

Do not rewrite the entire section unless needed.
Remove any wording that treats Project Map v1 as future work.

Add this new section immediately after:
Project Map v1

Add:

Project Summary v1

Project Summary v1 is implemented, verified, and merged into main.

Backend endpoint:

GET /api/repos/:id/project-summary

Backend helper:

lib/repos/projectSummary.js

Frontend files/functions involved:

app/components/repo/repo-project-summary.html
fetchProjectSummary()
renderProjectSummary()

Project Summary v1 is read-only and deterministic.

It is built from Project Map data instead of using AI, embeddings, or model routing.

It answers:

What kind of project is this?
What framework does it appear to use?
What is the primary language?
What frameworks are detected?
What are the main areas of the project?
What capabilities are detected?
What areas are missing or light?
What evidence supports the summary?

Verified output from the Project Summary endpoint:

projectType: Next.js web application
confidence: high
primaryLanguage: typescript
frameworks: Next.js, React

Important rule:

Project Summary v1 is complete.
Do not rebuild it unless the current implementation is broken.
The next product layer is Symbol Map v1.
In:
Current frontend routes/pages

Under the /files.html feature list, make sure the list is exactly:

local folder upload
GitHub repo import
saved repo list
repo detail panel
repo deletion
Project Map panel
Project Summary panel
Repo Map action log
Global action log
Remove duplicate stale sections.

Specifically:

Remove the duplicated second "Frontend initialization" section if it repeats the same content.
Remove "Home initializer implementation checklist" because it reads like future work even though the file already says Home initializer work is complete.
Remove the malformed block that starts with "### /" and then includes a huge unclosed code block.
Remove the duplicate "Commit commands" block for the home initializer.
Remove duplicate "Bottom line" sections and keep only one final Bottom line.
In:
Current verified local behavior

Add these verified checks:

Latest merge commit observed: 63e2067 merge: add project summary v1
Project Map endpoint works.
Project Summary endpoint works.
Project Map panel renders.
Project Summary panel renders.
Switching repos updates both Project Map and Project Summary.

Keep the existing useful API checks if they are still accurate.

Rename this section:
Recommended smoke tests before Project Summary v1

to:

Recommended smoke tests before Symbol Map v1

Update the minimum tests to include:

GET /api/filter-rules -> 200
GET /api/repos -> 200
GET /api/events -> 200
GET /api/events?limit=abc -> 400
POST /api/repos/import-github with bad URL -> 400
DELETE /api/repos/__missing__ -> 404
GET /api/repos/:id/project-map -> 200 for a real repo id
GET /api/repos/:id/project-summary -> 200 for a real repo id

Remove wording that says Project Summary v1 will be implemented later.

In:
5. Do not add AI too early

Replace the build order with:

repo intake
file categorization
Project Map v1 ✅
Project Summary v1 ✅
Symbol Map v1 ← next
Behavior Map v1
smoke tests

Also replace:

The current next step is Project Summary v1, not AI orchestration.

with:

The current next step is Symbol Map v1, not AI orchestration.
In:
Commands for current workflow

Keep the Project Map check.

Change this stale wording:

After Project Summary v1 is implemented, also check:

to:

Check Project Summary for a real repo id:

Keep this command:

curl "http://localhost:3000/api/repos/$REPO_ID/project-summary"
In:
Instruction for future LLMs / agents

Update rule 9 so it says:

Do not jump to AI orchestration before Symbol Map v1, Dependency Map v1, Behavior Map v1, and Algorithm Map v1 are stable.

Replace the Current build order with:

Repo Intake ✅
Project Map v1 ✅
Project Summary v1 ✅
Symbol Map v1 ← current next task
Dependency Map v1
Behavior Map v1
Algorithm Map v1
Recovery Assistant
AI/local model router
Replace the entire section:
Current best next task

with:

Current best next task

Build:

Symbol Map v1

Symbol Map v1 should extract code-level symbols from the stored repo files.

It should extract:

functions
classes
methods
imports
exports
constants
route handlers
schemas

Rules:

No AI yet.
No embeddings yet.
No model routing yet.
No project recommendations yet.
Keep it deterministic.
Build on top of the stored repo files and existing repo/project map structure.

Recommended first prompt for Claude, Codex, or another coding agent:

Read CURRENT_PROJECT_HANDOFF.md first.

We are on main after Project Summary v1 was merged.

Create a new branch for Symbol Map v1 before implementation.

Implement Symbol Map v1 as a deterministic code-symbol extraction feature.

Important:
- No AI.
- No embeddings.
- No model routing.
- No project recommendations yet.
- Do not rewrite Project Map v1.
- Do not rewrite Project Summary v1.
- Build on the existing repo intake, file storage, Project Map, and Project Summary foundation.

Goal:
Add a read-only Symbol Map layer that extracts and displays:
- functions
- classes
- methods
- imports
- exports
- constants
- route handlers
- schemas

Backend requirements:
1. Add a Symbol Map helper under lib/repos/.
2. Add a route like GET /api/repos/:id/symbol-map.
3. Reuse existing repoIdParams validation.
4. Load the repo from SQLite.
5. Return 404 if the repo does not exist.
6. Use stored repo_files records to locate relevant source files.
7. Read only files that are already accepted by the repo intake filter.
8. Start with practical regex/string parsing for JavaScript and TypeScript.
9. Keep parsing conservative and safe.
10. Return a structured response with repo info, summary counts, and symbols grouped by file.
11. Do not execute imported repo code.
12. Do not install heavy parser dependencies yet unless absolutely necessary.

Frontend requirements:
1. Add fetchSymbolMap(repoId) to the repo-intake API module.
2. Add a Symbol Map panel to the repo detail UI.
3. Add renderSymbolMap(data) to the repo renderer.
4. Update the repo-intake controller so Symbol Map loads when:
   - initial repo loads
   - user selects another repo
   - user uploads a repo
   - user imports a GitHub repo
5. Keep the UI simple.
6. Reuse existing architecture and styling patterns.
7. Do not add React, Vite, Next, Svelte, TypeScript, or any new frontend framework.

Verification:
1. Run node --check on changed JS files.
2. Start the server with npm start.
3. Test GET /api/repos.
4. Test GET /api/repos/:id/project-map.
5. Test GET /api/repos/:id/project-summary.
6. Test GET /api/repos/:id/symbol-map.
7. Open http://localhost:3000/files.html.
8. Confirm Project Map still works.
9. Confirm Project Summary still works.
10. Confirm Symbol Map appears.
11. Confirm switching repos updates Project Map, Project Summary, and Symbol Map.
12. Confirm no browser console errors.
Replace the final Bottom line with one clean section:
Bottom line

The current foundation is good enough to proceed.

Backend modularization is done.
Validation is done.
Sanitized error handling is done.
Repo intake works.
File filtering works.
SQLite persistence works.
Event logging works.
Repo deletion works.
Home initializer works.
files.html is the repo intake workspace.
index.html is the main home page.
Project Map v1 is complete and merged into main.
Project Summary v1 is complete and merged into main.

The next meaningful product layer is Symbol Map v1.

Current build order:

Repo Intake ✅
Project Map v1 ✅
Project Summary v1 ✅
Symbol Map v1 ← next
Dependency Map v1
Behavior Map v1
Algorithm Map v1
Recovery Assistant
AI/local model router

Verification after editing:

Run:

git diff -- CURRENT_PROJECT_HANDOFF.md

Then check for stale wording:

grep -n "Project Summary v1 ← current next task\|The current next step is Project Summary v1\|Future Project Map v1\|4312fc9 (HEAD\|feature/project-summary-v1\|Recommended Project Summary v1 scope\|After Project Summary v1 is implemented" CURRENT_PROJECT_HANDOFF.md

Expected result:
No matches.

Then check for required new wording:

grep -n "63e2067\|GET    /api/repos/:id/project-summary\|Project Summary v1 is implemented, verified, and merged into \`main\`\|Symbol Map v1 ← current next task\|## Current best next task" CURRENT_PROJECT_HANDOFF.md

Expected result:
Each required phrase appears.

Finally run:

git status --short

Do not commit until Gio reviews the diff.


## Commit message after you review the diff

```bash
git add CURRENT_PROJECT_HANDOFF.md
git commit -m "docs: update handoff after project summary merge"
git push origin main
```
