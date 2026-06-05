import { formatBytes } from "../../core/formatters.js";
import { renderStudioPage } from "../studio-page-renderer.js";

function dateTime(value) {
  return value ? new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Not available";
}

function sourceLabel(sourceType) {
  return sourceType === "github_url_filtered" ? "GitHub import" : "Local upload";
}

export function renderProjectsPage(target, data) {
  const rows = (data.projects || []).map((project) => ({
    id: project.id,
    title: project.name,
    subtitle: project.projectType,
    status: `${project.confidence} confidence`,
    tags: [project.primaryLanguage, ...(project.frameworks || [])].filter(Boolean),
    meta: `${project.totalFiles} files`,
    filterKeys: [
      "all",
      project.sourceType === "github_url_filtered" ? "github" : "local",
      project.confidence,
      ...(project.missingOrLightAreas || []).length ? ["needs-attention"] : []
    ],
    searchText: [
      project.name,
      project.projectType,
      project.primaryLanguage,
      ...(project.frameworks || []),
      ...(project.mainAreas || []),
      ...(project.missingOrLightAreas || [])
    ].join(" "),
    iconName: "folder",
    inspectorTitle: project.name,
    inspectorSubtitle: `${sourceLabel(project.sourceType)} / ${dateTime(project.createdAt)}`,
    details: [
      { label: "Project type", value: project.projectType },
      { label: "Primary language", value: project.primaryLanguage || "None detected" },
      { label: "Frameworks", value: project.frameworks || [] },
      { label: "Main areas", value: project.mainAreas || [] },
      { label: "Files", value: `${project.totalFiles} / ${formatBytes(project.totalBytes)}` },
      { label: "Missing or light", value: project.missingOrLightAreas || [] }
    ],
    timelineTitle: "Latest repo events",
    timeline: (project.recentEvents || []).map((event) => ({
      label: event.action,
      message: event.message,
      meta: dateTime(event.timestamp),
      level: event.level
    })),
    evidenceTitle: "Detected capabilities",
    evidence: project.detectedCapabilities || []
  }));

  renderStudioPage(target, {
    title: "Projects",
    subtitle: "Repo-backed projects derived from saved repositories and project analysis.",
    accent: "#3b82f6",
    iconName: "folder",
    stats: [
      { label: "Projects", value: data.summary?.totalProjects ?? 0, meta: "saved repos" },
      { label: "Files", value: data.summary?.totalFiles ?? 0, meta: formatBytes(data.summary?.totalBytes || 0) },
      { label: "GitHub", value: data.summary?.githubImports ?? 0, meta: "filtered imports" },
      { label: "Local", value: data.summary?.localUploads ?? 0, meta: "folder uploads" }
    ],
    filters: [
      { label: "All", value: "all" },
      { label: "GitHub", value: "github" },
      { label: "Local", value: "local" },
      { label: "Needs attention", value: "needs-attention" }
    ],
    columns: ["Repo", "Confidence", "Signals", "Files"],
    rows,
    searchPlaceholder: "Filter projects...",
    emptyMessage: "No saved repos exist yet. Upload or import a repo from Files first."
  });
}
