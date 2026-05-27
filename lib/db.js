import { DatabaseSync } from "node:sqlite";
import { dbPath } from "./paths.js";

export const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS repos (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    source_type TEXT NOT NULL,
    root_path TEXT NOT NULL,
    total_files INTEGER NOT NULL,
    total_bytes INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS repo_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    repo_id TEXT NOT NULL,
    path TEXT NOT NULL,
    name TEXT NOT NULL,
    extension TEXT NOT NULL,
    language TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    category TEXT NOT NULL,
    FOREIGN KEY (repo_id) REFERENCES repos(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS action_events (
    id TEXT PRIMARY KEY,
    timestamp TEXT NOT NULL,
    level TEXT NOT NULL,
    area TEXT NOT NULL,
    source TEXT NOT NULL,
    phase TEXT NOT NULL,
    action TEXT NOT NULL,
    message TEXT NOT NULL,
    details_json TEXT,
    entity_type TEXT,
    entity_id TEXT,
    entity_name TEXT,
    correlation_id TEXT,
    request_id TEXT,
    parent_event_id TEXT
  );
`);

db.exec(`
  DELETE FROM repos
  WHERE NOT EXISTS (
    SELECT 1 FROM repo_files WHERE repo_files.repo_id = repos.id
  );
`);
