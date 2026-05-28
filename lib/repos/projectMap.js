import { db } from "../db.js";

const SECTION_KEYS = [
  "pagesRoutes",
  "apiEndpoints",
  "components",
  "databaseFiles",
  "authLogic",
  "paymentLogic",
  "aiLogic",
  "documentation",
  "tests",
  "configFiles",
  "functions",
  "other"
];

export function projectMap(row) {
  const files = db
    .prepare(
      "SELECT path, name, extension, language, size_bytes AS sizeBytes, category FROM repo_files WHERE repo_id = ? ORDER BY path"
    )
    .all(row.id);

  const categoryCounts = {};
  const languageCounts = {};
  const sections = Object.fromEntries(SECTION_KEYS.map((k) => [k, []]));

  for (const file of files) {
    categoryCounts[file.category] = (categoryCounts[file.category] || 0) + 1;
    if (file.language) {
      languageCounts[file.language] = (languageCounts[file.language] || 0) + 1;
    }
    if (sections[file.category] !== undefined) {
      sections[file.category].push(file);
    } else {
      sections.other.push(file);
    }
  }

  const primaryLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([lang]) => lang);

  return {
    repo: {
      id: row.id,
      name: row.name,
      sourceType: row.source_type,
      totalFiles: row.total_files,
      totalBytes: row.total_bytes,
      createdAt: row.created_at
    },
    summary: {
      primaryLanguages,
      categoryCounts,
      languageCounts
    },
    sections
  };
}
