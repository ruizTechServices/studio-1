import { db } from "../db.js";
import { projectMap } from "../repos/projectMap.js";
import { projectSummary } from "../repos/projectSummary.js";
import { rowToEvent } from "../events/rowToEvent.js";
import { findProjectIcon } from "./projectIcon.js";

function latestEventsForRepo(repo) {
  return db
    .prepare(
      `SELECT *
       FROM action_events
       WHERE entity_id = ? OR entity_name = ?
       ORDER BY timestamp DESC
       LIMIT 5`
    )
    .all(repo.id, repo.name)
    .map(rowToEvent);
}

export function projectList() {
  const rows = db.prepare("SELECT * FROM repos ORDER BY created_at DESC").all();

  const projects = rows.map((row) => {
    const map = projectMap(row);
    const detected = projectSummary(row).summary;
    const categories = map.summary?.categoryCounts || {};
    const iconPath = findProjectIcon(row.root_path);

    return {
      id: row.id,
      name: row.name,
      iconUrl: iconPath ? `/api/projects/${encodeURIComponent(row.id)}/icon` : null,
      sourceType: row.source_type,
      totalFiles: row.total_files,
      totalBytes: row.total_bytes,
      createdAt: row.created_at,
      projectType: detected.projectType,
      confidence: detected.confidence,
      primaryLanguage: detected.primaryLanguage,
      frameworks: detected.frameworks || [],
      mainAreas: detected.mainAreas || [],
      missingOrLightAreas: detected.missingOrLightAreas || [],
      detectedCapabilities: detected.detectedCapabilities || [],
      categoryCounts: categories,
      recentEvents: latestEventsForRepo(row)
    };
  });

  return {
    summary: {
      totalProjects: projects.length,
      totalFiles: projects.reduce((sum, project) => sum + project.totalFiles, 0),
      totalBytes: projects.reduce((sum, project) => sum + project.totalBytes, 0),
      githubImports: projects.filter((project) => project.sourceType === "github_url_filtered").length,
      localUploads: projects.filter((project) => project.sourceType === "folder_upload_filtered").length
    },
    projects
  };
}
