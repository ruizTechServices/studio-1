import { renderStudioPage } from "../studio-page-renderer.js";

function dateTime(value) {
  return value ? new Date(value).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Not available";
}

export function renderWorkflowsPage(target, data) {
  const rows = (data.runs || []).map((run) => ({
    id: run.id,
    title: run.type,
    subtitle: run.entity?.name || run.id,
    status: run.level,
    tags: [run.entity?.type, `${run.eventCount} events`].filter(Boolean),
    meta: dateTime(run.endedAt),
    filterKeys: ["all", run.level],
    searchText: `${run.type} ${run.level} ${run.entity?.name || ""} ${run.id}`,
    iconName: "workflow",
    inspectorTitle: run.type,
    inspectorSubtitle: run.entity?.name || run.id,
    details: [
      { label: "Started", value: dateTime(run.startedAt) },
      { label: "Last event", value: dateTime(run.endedAt) },
      { label: "Final level", value: run.level },
      { label: "Event count", value: run.eventCount },
      { label: "Entity", value: run.entity?.name || "None linked" }
    ],
    timelineTitle: "Event phases",
    timeline: (run.events || []).map((event) => ({
      label: `${event.phase} / ${event.action}`,
      message: event.message,
      meta: dateTime(event.timestamp),
      level: event.level
    }))
  }));

  renderStudioPage(target, {
    title: "Workflows",
    subtitle: "Real action event history grouped into run-like timelines. No workflow definition builder exists yet.",
    accent: "#f59e0b",
    iconName: "workflow",
    stats: [
      { label: "Runs", value: data.summary?.totalRuns ?? 0, meta: "grouped events" },
      { label: "Failed", value: data.summary?.failedRuns ?? 0, meta: "error level" },
      { label: "Warnings", value: data.summary?.warningRuns ?? 0, meta: "warning level" },
      { label: "Success", value: data.summary?.successfulRuns ?? 0, meta: "success level" }
    ],
    filters: [
      { label: "All", value: "all" },
      { label: "Success", value: "success" },
      { label: "Warnings", value: "warning" },
      { label: "Errors", value: "error" }
    ],
    columns: ["Run", "Level", "Entity", "Last event"],
    rows,
    searchPlaceholder: "Filter workflow runs...",
    emptyMessage: "No action events exist yet."
  });
}
