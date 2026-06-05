import { db } from "../db.js";
import { rowToEvent } from "../events/rowToEvent.js";
import { projectSummary } from "../repos/projectSummary.js";
import { specCandidates } from "../specs/specCandidates.js";

function latestRepos() {
  return db
    .prepare("SELECT * FROM repos ORDER BY created_at DESC LIMIT 12")
    .all()
    .map((repo) => ({
      type: "repo",
      id: repo.id,
      title: repo.name,
      subtitle: `${repo.total_files} files`,
      source: repo.source_type,
      createdAt: repo.created_at
    }));
}

function recoverySources() {
  const repos = db.prepare("SELECT * FROM repos ORDER BY created_at DESC LIMIT 8").all();
  return repos.flatMap((repo) => {
    const summary = projectSummary(repo).summary;
    const steps = [
      ...(summary.missingOrLightAreas || []).slice(0, 3).map((item) => `Review ${item} in ${repo.name}.`),
      ...(summary.detectedCapabilities || []).length
        ? `Use detected ${summary.detectedCapabilities.slice(0, 2).join(" and ")} signals when re-orienting in ${repo.name}.`
        : `Review project summary signals before changing ${repo.name}.`
    ];

    return steps.slice(0, 3).map((step, index) => ({
      type: "recovery",
      id: `${repo.id}-step-${index}`,
      title: step,
      subtitle: repo.name,
      source: "project recovery signals"
    }));
  });
}

function recentEvents() {
  return db
    .prepare("SELECT * FROM action_events ORDER BY timestamp DESC LIMIT 100")
    .all()
    .map(rowToEvent);
}

export function contextSources() {
  const specs = specCandidates();
  const events = recentEvents();
  const documentationSources = specs.specs.slice(0, 40).map((spec) => ({
    type: "documentation",
    id: `${spec.repoId}:${spec.path}`,
    title: spec.name,
    subtitle: spec.path,
    source: spec.repoName,
    meta: spec.type
  }));

  return {
    store: {
      connected: false,
      message: "No dedicated memory table exists yet."
    },
    summary: {
      repos: db.prepare("SELECT COUNT(*) AS count FROM repos").get().count,
      documentationFiles: specs.summary.totalCandidates,
      recentEvents: events.length
    },
    contextSources: [
      ...latestRepos(),
      ...documentationSources,
      ...recoverySources(),
      ...events.slice(0, 40).map((event) => ({
        type: "event",
        id: event.id,
        title: event.message,
        subtitle: `${event.area} / ${event.action}`,
        source: event.source,
        meta: event.level,
        timestamp: event.timestamp
      }))
    ],
    recentEvents: events.slice(0, 25)
  };
}
