import { db } from "../db.js";
import { projectMap } from "./projectMap.js";
import { projectSummary } from "./projectSummary.js";
import { dependencyMap } from "./dependencyMap.js";
import { behaviorMap } from "./behaviorMap.js";
import { algorithmMap } from "./algorithmMap.js";

const ENTRY_POINTS = new Set([
  "server.js", "server.ts", "index.js", "index.ts",
  "app.js", "app.ts", "app.py", "manage.py",
  "main.js", "main.ts", "main.py",
  "next.config.js", "next.config.ts",
  "vite.config.js", "vite.config.ts"
]);

function buildInspectFirst(projMapData, depMapData, behMapData, algMapData) {
  const scores = new Map();

  const bump = (filePath, points, reason) => {
    if (!scores.has(filePath)) {
      scores.set(filePath, { path: filePath, score: 0, reasons: [] });
    }
    const entry = scores.get(filePath);
    entry.score += points;
    if (!entry.reasons.includes(reason)) entry.reasons.push(reason);
  };

  for (const f of (depMapData.mostImportedInternal || []).slice(0, 6)) {
    bump(f.path, 3, "dependency hub");
  }
  for (const f of (behMapData.notableFiles || []).slice(0, 6)) {
    bump(f.path, 2, "active behaviors");
  }
  for (const f of (algMapData.notableFiles || []).slice(0, 6)) {
    bump(f.path, 2, "active algorithms");
  }

  const allPaths = Object.values(projMapData.sections || {}).flat().map((f) => f.path);
  for (const p of allPaths) {
    const name = p.split("/").pop();
    if (ENTRY_POINTS.has(name)) {
      bump(p, 1, "key entry point");
    }
  }

  return [...scores.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(({ path, reasons }) => ({ path, reason: reasons[0] || "notable" }));
}

function buildNextSteps(sum, missingOrLight, inspectFirst) {
  const steps = [];
  const missingAreas = new Set(missingOrLight.map((m) => m.area.toLowerCase()));
  const caps = new Set((sum.detectedCapabilities || []).map((c) => c.toLowerCase()));

  if (missingAreas.has("tests")) {
    steps.push("Add tests — no test files were detected.");
  }
  if (missingAreas.has("authentication")) {
    if (caps.has("api layer") || caps.has("network calls")) {
      steps.push("Add authentication — API or network logic exists but no auth files were detected.");
    } else {
      steps.push("Consider adding authentication — no auth logic detected.");
    }
  }
  if (missingAreas.has("documentation")) {
    steps.push("Add documentation — no docs were found.");
  }
  if (missingAreas.has("database")) {
    steps.push("Add database layer — no database files detected.");
  }
  if (missingAreas.has("api")) {
    steps.push("Add API endpoints — none detected.");
  }
  if (inspectFirst.length > 0) {
    const paths = inspectFirst.slice(0, 3).map((f) => f.path).join(", ");
    steps.push(`To re-orient, start by reviewing: ${paths}`);
  }
  if (steps.length === 0) {
    steps.push("Project appears well-rounded. Check recent activity for the last known work area.");
  }

  return steps;
}

export function recoveryAssistant(row) {
  const projMapData = projectMap(row);
  const projSumData = projectSummary(row);
  const depMapData = dependencyMap(row);
  const behMapData = behaviorMap(row);
  const algMapData = algorithmMap(row);

  const recentEvents = db
    .prepare(
      `SELECT action, message, timestamp, level
       FROM action_events
       WHERE entity_id = ? OR entity_name = ?
       ORDER BY timestamp DESC
       LIMIT 10`
    )
    .all(row.id, row.name);

  const { summary: sum } = projSumData;

  const capabilities = (sum.detectedCapabilities || []).map((cap) => {
    const capWord = cap.split(" ")[0].toLowerCase();
    const ev = (sum.evidence || []).find((e) => e.toLowerCase().includes(capWord));
    return { name: cap, evidence: ev || null };
  });

  const missingOrLight = (sum.missingOrLightAreas || []).map((msg) => ({
    area: msg.split(" ")[0],
    severity: msg.includes("missing") ? "missing" : "light",
    message: msg
  }));

  const inspectFirst = buildInspectFirst(projMapData, depMapData, behMapData, algMapData);
  const nextSteps = buildNextSteps(sum, missingOrLight, inspectFirst);

  const evidence = [
    `Project Map: ${Object.values(projMapData.sections || {}).flat().length} files in ${Object.keys(projMapData.summary?.categoryCounts || {}).length} categories`,
    `Dependency Map: ${depMapData.summary?.totalEdges ?? 0} import edges, ${depMapData.mostImportedInternal?.length ?? 0} internal hubs identified`,
    `Behavior Map: ${behMapData.summary?.totalBehaviors ?? 0} behavioral signals across ${behMapData.summary?.totalFilesWithBehaviors ?? 0} files`,
    `Algorithm Map: ${algMapData.summary?.totalSignals ?? 0} algorithmic signals across ${algMapData.summary?.totalFilesWithSignals ?? 0} files`,
    `Action events: ${recentEvents.length} recent events for this repo`
  ];

  return {
    repo: {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,
      sourceType: row.source_type,
      totalFiles: row.total_files
    },
    overview: {
      projectType: sum.projectType,
      confidence: sum.confidence,
      primaryLanguage: sum.primaryLanguage,
      frameworks: sum.frameworks || []
    },
    capabilities,
    inspectFirst,
    missingOrLight,
    nextSteps,
    recentActivity: recentEvents,
    evidence
  };
}
