import { renderStudioPage } from "../studio-page-renderer.js";

function dateTime(value) {
  return value ? new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Not available";
}

function iconForType(type) {
  if (type === "repo") return "folder";
  if (type === "documentation") return "document";
  if (type === "event") return "message";
  return "spark";
}

export function renderMemoryPage(target, data) {
  const rows = (data.contextSources || []).map((source) => ({
    id: source.id,
    title: source.title,
    subtitle: source.subtitle,
    status: source.type,
    tags: [source.source, source.meta].filter(Boolean),
    meta: source.timestamp ? dateTime(source.timestamp) : (source.createdAt ? dateTime(source.createdAt) : ""),
    filterKeys: ["all", source.type],
    searchText: `${source.title} ${source.subtitle} ${source.source} ${source.type} ${source.meta || ""}`,
    iconName: iconForType(source.type),
    inspectorTitle: source.title,
    inspectorSubtitle: source.subtitle,
    details: [
      { label: "Source type", value: source.type },
      { label: "Origin", value: source.source || "local context" },
      { label: "Meta", value: source.meta || "Not available" },
      { label: "Timestamp", value: source.timestamp ? dateTime(source.timestamp) : (source.createdAt ? dateTime(source.createdAt) : "Not available") }
    ],
    evidence: ["This is reusable local context from repos, docs, recovery hints, or event history. It is not a saved memory record."]
  }));

  renderStudioPage(target, {
    title: "Memory",
    subtitle: "Local context sources from repos, documentation, recovery hints, and recent action events.",
    accent: "#10b981",
    iconName: "layers",
    notice: {
      title: "No dedicated memory store",
      message: data.store?.message || "No dedicated memory table exists yet."
    },
    stats: [
      { label: "Repos", value: data.summary?.repos ?? 0, meta: "context roots" },
      { label: "Docs", value: data.summary?.documentationFiles ?? 0, meta: "candidate files" },
      { label: "Events", value: data.summary?.recentEvents ?? 0, meta: "recent history" },
      { label: "Sources", value: rows.length, meta: "shown here" }
    ],
    filters: [
      { label: "All", value: "all" },
      { label: "Repos", value: "repo" },
      { label: "Docs", value: "documentation" },
      { label: "Recovery", value: "recovery" },
      { label: "Events", value: "event" }
    ],
    columns: ["Context", "Type", "Origin", "Meta"],
    rows,
    searchPlaceholder: "Filter local context...",
    emptyMessage: "No local context exists yet. Save a repo from Files first."
  });
}
