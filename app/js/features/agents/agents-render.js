import { formatBytes } from "../../core/formatters.js";
import { renderStudioPage } from "../studio-page-renderer.js";

function dateTime(value) {
  return value ? new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Not available";
}

export function renderAgentsPage(target, data) {
  const fileRows = (data.files || []).map((file) => ({
    id: `file:${file.repoId}:${file.path}`,
    title: file.name,
    subtitle: file.path,
    status: "file signal",
    tags: [file.repoName, file.category, file.language].filter(Boolean),
    meta: formatBytes(file.sizeBytes),
    filterKeys: ["all", "files"],
    searchText: `${file.name} ${file.path} ${file.repoName} ${file.category} ${file.language}`,
    iconName: "file",
    inspectorTitle: file.name,
    inspectorSubtitle: file.repoName,
    details: [
      { label: "Repo", value: file.repoName },
      { label: "Path", value: file.path },
      { label: "Category", value: file.category },
      { label: "Language", value: file.language },
      { label: "Size", value: formatBytes(file.sizeBytes) }
    ],
    evidence: ["AI/agent evidence is path/category based. No runtime status is inferred from this file."]
  }));

  const eventRows = (data.events || []).map((event) => ({
    id: `event:${event.id}`,
    title: event.action,
    subtitle: event.message,
    status: event.level,
    tags: [event.source, event.area, event.entity?.name].filter(Boolean),
    meta: dateTime(event.timestamp),
    filterKeys: ["all", "events", event.level],
    searchText: `${event.action} ${event.message} ${event.source} ${event.area}`,
    iconName: "message",
    inspectorTitle: event.action,
    inspectorSubtitle: event.source,
    details: [
      { label: "Level", value: event.level },
      { label: "Area", value: event.area },
      { label: "Phase", value: event.phase },
      { label: "Entity", value: event.entity?.name || "None linked" },
      { label: "Time", value: dateTime(event.timestamp) }
    ],
    evidence: [event.message]
  }));

  renderStudioPage(target, {
    title: "Agents",
    subtitle: "Agent readiness is evidence-backed: runtime status plus AI/agent-related files and events.",
    accent: "#06b6d4",
    iconName: "bot",
    notice: {
      title: "Runtime not connected",
      message: data.runtime?.message || "No agent runtime is currently exposed by the backend."
    },
    stats: [
      { label: "Runtime", value: data.runtime?.connected ? "on" : "off", meta: "backend exposed" },
      { label: "AI files", value: data.summary?.aiFiles ?? 0, meta: "detected signals" },
      { label: "Repos", value: data.summary?.reposWithAiSignals ?? 0, meta: "with AI signals" },
      { label: "Events", value: data.summary?.agentEvents ?? 0, meta: "agent/AI mentions" }
    ],
    filters: [
      { label: "All", value: "all" },
      { label: "Files", value: "files" },
      { label: "Events", value: "events" },
      { label: "Errors", value: "error" }
    ],
    columns: ["Evidence", "Type", "Signals", "Meta"],
    rows: [...fileRows, ...eventRows],
    searchPlaceholder: "Filter agent evidence...",
    emptyMessage: "No AI or agent-related file/event evidence was found."
  });
}
