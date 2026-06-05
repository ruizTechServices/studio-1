import { db } from "../db.js";
import { rowToEvent } from "../events/rowToEvent.js";

function aiFileRows() {
  return db
    .prepare(
      `SELECT
        repo_files.repo_id AS repoId,
        repos.name AS repoName,
        repo_files.path,
        repo_files.name,
        repo_files.extension,
        repo_files.language,
        repo_files.size_bytes AS sizeBytes,
        repo_files.category
       FROM repo_files
       JOIN repos ON repos.id = repo_files.repo_id
       WHERE repo_files.category = 'aiLogic'
          OR lower(repo_files.path) LIKE '%agent%'
          OR lower(repo_files.path) LIKE '%openai%'
          OR lower(repo_files.path) LIKE '%/ai/%'
          OR lower(repo_files.name) LIKE 'ai.%'
          OR lower(repo_files.name) LIKE '%ai%'
       ORDER BY repos.name, repo_files.path
       LIMIT 250`
    )
    .all();
}

function aiEventRows() {
  return db
    .prepare(
      `SELECT *
       FROM action_events
       WHERE lower(source) LIKE '%agent%'
          OR lower(source) LIKE '%ai%'
          OR lower(action) LIKE '%agent%'
          OR lower(action) LIKE '%ai%'
          OR lower(message) LIKE '%agent%'
          OR lower(message) LIKE '%ai%'
          OR lower(COALESCE(details_json, '')) LIKE '%agent%'
          OR lower(COALESCE(details_json, '')) LIKE '%ai%'
       ORDER BY timestamp DESC
       LIMIT 100`
    )
    .all()
    .map(rowToEvent);
}

export function agentEvidence() {
  const files = aiFileRows();
  const events = aiEventRows();

  return {
    runtime: {
      connected: false,
      message: "No agent runtime is currently exposed by the backend."
    },
    summary: {
      aiFiles: files.length,
      reposWithAiSignals: new Set(files.map((file) => file.repoId)).size,
      agentEvents: events.length
    },
    files,
    events
  };
}
