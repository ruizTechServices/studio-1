import { formatBytes } from "../../core/formatters.js";
import { renderStudioPage } from "../studio-page-renderer.js";

function rowsForSettings(data) {
  const rules = data.filterRules || {};
  const storage = data.storage || {};
  const runtime = data.runtime || {};

  return [
    {
      id: "storage",
      title: "SQLite storage",
      subtitle: storage.databasePath || "data/studio-1.sqlite",
      status: "read-only",
      tags: [`${storage.repos || 0} repos`, `${storage.repoFiles || 0} files`],
      meta: `${storage.actionEvents || 0} events`,
      filterKeys: ["all", "storage"],
      searchText: JSON.stringify(storage),
      iconName: "database",
      details: [
        { label: "Repos", value: storage.repos ?? 0 },
        { label: "Repo files", value: storage.repoFiles ?? 0 },
        { label: "Action events", value: storage.actionEvents ?? 0 },
        { label: "Data path", value: storage.dataPath },
        { label: "Database", value: storage.databasePath }
      ]
    },
    {
      id: "filters",
      title: "File filter rules",
      subtitle: "Applied during upload and GitHub import",
      status: "active",
      tags: [`${rules.allowedExtensions?.length || 0} extensions`, `${rules.ignoredDirs?.length || 0} ignored dirs`],
      meta: formatBytes(rules.maxFileSizeBytes || 0),
      filterKeys: ["all", "filters"],
      searchText: JSON.stringify(rules),
      iconName: "settings",
      details: [
        { label: "Max file size", value: formatBytes(rules.maxFileSizeBytes || 0) },
        { label: "Allowed extensions", value: rules.allowedExtensions || [] },
        { label: "Ignored directories", value: rules.ignoredDirs || [] }
      ]
    },
    {
      id: "runtime",
      title: "Backend runtime",
      subtitle: "Express API backed by local SQLite",
      status: runtime.api || "unknown",
      tags: [runtime.persistence, runtime.writableSettings ? "writable" : "read-only"].filter(Boolean),
      meta: "local",
      filterKeys: ["all", "runtime"],
      searchText: JSON.stringify(runtime),
      iconName: "code",
      details: [
        { label: "API", value: runtime.api || "unknown" },
        { label: "Persistence", value: runtime.persistence || "unknown" },
        { label: "Writable settings", value: runtime.writableSettings ? "Available" : "Not exposed" }
      ],
      evidence: [
        "Settings are read-only because no settings write API or settings table exists yet.",
        "Members, billing, integrations, and notifications are not represented by the current backend."
      ]
    }
  ];
}

export function renderSettingsPage(target, data) {
  renderStudioPage(target, {
    title: "Settings",
    subtitle: "Read-only local runtime, storage, and file-filter status from the current backend.",
    accent: "#94a3b8",
    iconName: "settings",
    stats: [
      { label: "Repos", value: data.storage?.repos ?? 0, meta: "saved" },
      { label: "Files", value: data.storage?.repoFiles ?? 0, meta: "indexed" },
      { label: "Events", value: data.storage?.actionEvents ?? 0, meta: "logged" },
      { label: "Max file", value: formatBytes(data.filterRules?.maxFileSizeBytes || 0), meta: "upload filter" }
    ],
    filters: [
      { label: "All", value: "all" },
      { label: "Storage", value: "storage" },
      { label: "Filters", value: "filters" },
      { label: "Runtime", value: "runtime" }
    ],
    columns: ["Setting", "State", "Signals", "Meta"],
    rows: rowsForSettings(data),
    searchPlaceholder: "Filter settings status..."
  });
}
