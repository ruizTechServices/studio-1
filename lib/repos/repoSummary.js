import { db } from "../db.js";

export function repoSummary(row) {
  const files = db
    .prepare("SELECT path, name, extension, language, size_bytes AS sizeBytes, category FROM repo_files WHERE repo_id = ? ORDER BY path")
    .all(row.id);

  const categories = files.reduce((result, file) => {
    result[file.category] = (result[file.category] || 0) + 1;
    return result;
  }, {});

  return {
    id: row.id,
    name: row.name,
    sourceType: row.source_type,
    totalFiles: row.total_files,
    totalBytes: row.total_bytes,
    createdAt: row.created_at,
    categories,
    files
  };
}
