# studio-1 / ruizTechStudio

`studio-1` is a local-first repo recovery and codebase intelligence studio. It imports or uploads codebases, scans and classifies files, builds deterministic project maps, and helps recover where work stopped.

The continuity MVP is focused on repo intake, project understanding, recovery guidance, and the next planned Reusable Assets v0 layer. It is not an AI-agent orchestration platform.

## Current Stack

- Express backend
- Vanilla HTML/CSS/JavaScript frontend
- SQLite via Node's `node:sqlite`
- Modular HTML partials
- Modular JavaScript feature controllers and renderers

## Run Locally

Prerequisite: a Node.js version that includes `node:sqlite`.

```bash
npm install
npm start
```

Open `http://localhost:3000`.

With the server running, verify the current API surface:

```bash
npm run smoke
```

See `docs/CURRENT_PROJECT_HANDOFF.md` for current state and next steps.
