import { db } from "../db.js";
import { dbPath, dataDir } from "../paths.js";
import { ignoredDirs, allowedExtensions, MAX_FILE_SIZE_BYTES } from "../config.js";

function countRows(tableName) {
  return db.prepare(`SELECT COUNT(*) AS count FROM ${tableName}`).get().count;
}

export function settingsStatus() {
  return {
    storage: {
      repos: countRows("repos"),
      repoFiles: countRows("repo_files"),
      actionEvents: countRows("action_events"),
      dataPath: dataDir,
      databasePath: dbPath
    },
    filterRules: {
      ignoredDirs: Array.from(ignoredDirs),
      allowedExtensions: Array.from(allowedExtensions),
      maxFileSizeBytes: MAX_FILE_SIZE_BYTES
    },
    runtime: {
      api: "ok",
      persistence: "sqlite",
      writableSettings: false
    }
  };
}
