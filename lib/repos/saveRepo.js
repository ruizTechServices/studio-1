import { db } from "../db.js";

export function saveRepo({ repoId, repoName, sourceType, repoPath, records }) {
  const now = new Date().toISOString();
  const totalBytes = records.reduce((sum, file) => sum + file.sizeBytes, 0);

  try {
    db.exec("BEGIN");

    db.prepare(`
      INSERT INTO repos (id, name, source_type, root_path, total_files, total_bytes, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(repoId, repoName, sourceType, repoPath, records.length, totalBytes, now);

    const insertFile = db.prepare(`
      INSERT INTO repo_files (repo_id, path, name, extension, language, size_bytes, category)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (const file of records) {
      insertFile.run(file.repoId, file.path, file.name, file.extension, file.language, file.sizeBytes, file.category);
    }

    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }

  return db.prepare("SELECT * FROM repos WHERE id = ?").get(repoId);
}
