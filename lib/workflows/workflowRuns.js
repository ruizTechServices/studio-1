import { db } from "../db.js";
import { rowToEvent } from "../events/rowToEvent.js";

const LEVEL_RANK = {
  error: 4,
  warning: 3,
  success: 2,
  info: 1
};

function runKey(event) {
  return event.correlationId || event.requestId || event.id;
}

function strongestLevel(events) {
  return events.reduce((selected, event) => {
    return (LEVEL_RANK[event.level] || 0) > (LEVEL_RANK[selected] || 0) ? event.level : selected;
  }, "info");
}

function classifyRun(events) {
  const text = events.map((event) => `${event.source} ${event.action} ${event.message}`).join(" ").toLowerCase();

  if (text.includes("github")) return "GitHub import";
  if (text.includes("local_upload") || text.includes("folder")) return "Local upload";
  if (text.includes("delete")) return "Repo delete";
  if (text.includes("server_started") || text.includes("startup")) return "Server startup";
  if (events.some((event) => event.level === "error")) return "API error";
  if (text.includes("display") || text.includes("ui")) return "UI display/logging";
  return "Action event run";
}

function relatedEntity(events) {
  return events.find((event) => event.entity)?.entity || null;
}

export function workflowRuns({ limit = 500 } = {}) {
  const events = db
    .prepare("SELECT * FROM action_events ORDER BY timestamp DESC LIMIT ?")
    .all(limit)
    .map(rowToEvent);

  const grouped = new Map();
  for (const event of events) {
    const key = runKey(event);
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(event);
  }

  const runs = Array.from(grouped.entries()).map(([id, groupEvents]) => {
    const ordered = groupEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    const startedAt = ordered[0]?.timestamp || null;
    const endedAt = ordered[ordered.length - 1]?.timestamp || startedAt;

    return {
      id,
      type: classifyRun(ordered),
      startedAt,
      endedAt,
      level: strongestLevel(ordered),
      eventCount: ordered.length,
      entity: relatedEntity(ordered),
      events: ordered
    };
  }).sort((a, b) => new Date(b.endedAt) - new Date(a.endedAt));

  return {
    summary: {
      totalRuns: runs.length,
      failedRuns: runs.filter((run) => run.level === "error").length,
      warningRuns: runs.filter((run) => run.level === "warning").length,
      successfulRuns: runs.filter((run) => run.level === "success").length
    },
    runs
  };
}
