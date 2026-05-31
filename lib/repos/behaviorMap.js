import fs from "node:fs";
import path from "node:path";
import { db } from "../db.js";

const JS_TS_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const MAX_BEHAVIOR_FILE_SIZE = 512 * 1024;

const DETECTORS = [
  {
    type: "eventListener",
    label: "Event Listener",
    area: "ui",
    test: (t) => /\.addEventListener\s*\(/.test(t)
  },
  {
    type: "networkCall",
    label: "Network Call",
    area: "network",
    test: (t) => /\bfetch\s*\(|axios\.(get|post|put|delete|patch|request)\b|new\s+XMLHttpRequest/.test(t)
  },
  {
    type: "asyncFlow",
    label: "Async / Await",
    area: "network",
    test: (t) => /\bawait\s+/.test(t)
  },
  {
    type: "domMutation",
    label: "DOM Mutation",
    area: "ui",
    test: (t) => /\.innerHTML\s*[+=]|\.textContent\s*=|\.appendChild\s*\(|\.removeChild\s*\(|\.insertBefore\s*\(|\.replaceChild\s*\(/.test(t)
  },
  {
    type: "formHandling",
    label: "Form / Input",
    area: "ui",
    test: (t) => /\bnew\s+FormData\s*\(|\.submit\s*\(\s*\)|["'`]submit["'`]|["'`]change["'`]|["'`]input["'`]/.test(t)
  },
  {
    type: "navigationFlow",
    label: "Navigation",
    area: "navigation",
    test: (t) => /router\.(push|replace|navigate)\s*\(|useNavigate\s*\(|window\.location\.(href|assign|replace)\s*=|history\.(push|replace)State|navigate\s*\(/.test(t)
  },
  {
    type: "crudCreate",
    label: "Create",
    area: "data",
    test: (t) => /\.insert\s*\(|\.create\s*\(|\.save\s*\(/.test(t)
  },
  {
    type: "crudRead",
    label: "Read / Query",
    area: "data",
    test: (t) => /\.select\s*\(|\.find\s*\(|\.findOne\s*\(|\.findById\s*\(|\.query\s*\(/.test(t)
  },
  {
    type: "crudUpdate",
    label: "Update",
    area: "data",
    test: (t) => /\.update\s*\(|\.patch\s*\(|\.upsert\s*\(/.test(t)
  },
  {
    type: "crudDelete",
    label: "Delete",
    area: "data",
    test: (t) => /\.delete\s*\(|\.deleteOne\s*\(|\.deleteMany\s*\(|\.destroy\s*\(/.test(t)
  },
  {
    type: "storageOp",
    label: "Storage",
    area: "data",
    test: (t) => /\blocalStorage\.|sessionStorage\.|\.setItem\s*\(|\.getItem\s*\(/.test(t)
  },
  {
    type: "authOp",
    label: "Auth",
    area: "auth",
    test: (t) => /\bsignIn\b|\bsignOut\b|\blogin\s*\(|\blogout\s*\(|\bauthenticate\b|\bgetSession\b|\bgetUser\b|\bgetCurrentUser\b/.test(t)
  },
  {
    type: "errorHandling",
    label: "Error Handling",
    area: "reliability",
    test: (t) => /\btry\s*\{|\.catch\s*\(|\bthrow\s+new\s|\bthrow\s+\w/.test(t)
  },
  {
    type: "timerBased",
    label: "Timer",
    area: "reliability",
    test: (t) => /\bsetTimeout\s*\(|\bsetInterval\s*\(/.test(t)
  },
  {
    type: "fileOp",
    label: "File / IO",
    area: "io",
    test: (t) => /\bfs\.(read|write|append|stat|unlink|mkdir|exists|rm)\b|\breadFile\b|\bwriteFile\b|\breadFileSync\b|\bwriteFileSync\b/.test(t)
  }
];

const AREA_DEFS = {
  ui:          { label: "UI",           types: [] },
  network:     { label: "Network",      types: [] },
  navigation:  { label: "Navigation",   types: [] },
  data:        { label: "Data",         types: [] },
  auth:        { label: "Auth",         types: [] },
  reliability: { label: "Reliability",  types: [] },
  io:          { label: "File / IO",    types: [] }
};

for (const d of DETECTORS) {
  AREA_DEFS[d.area]?.types.push(d.type);
}

export function behaviorMap(row) {
  const files = db
    .prepare("SELECT path, extension, size_bytes AS sizeBytes FROM repo_files WHERE repo_id = ? ORDER BY path")
    .all(row.id);

  const jsFiles = files.filter((f) => JS_TS_EXTENSIONS.has(f.extension));

  const behaviorCounts = Object.fromEntries(DETECTORS.map((d) => [d.type, 0]));

  const resultFiles = [];

  for (const file of jsFiles) {
    if (file.sizeBytes > MAX_BEHAVIOR_FILE_SIZE) continue;

    const filePath = path.join(row.root_path, file.path);
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);
    const fileBehaviorMap = new Map();

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const t = raw.trim();
      if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue;

      for (const detector of DETECTORS) {
        if (detector.test(t)) {
          if (!fileBehaviorMap.has(detector.type)) {
            fileBehaviorMap.set(detector.type, { label: detector.label, count: 0, examples: [] });
          }
          const entry = fileBehaviorMap.get(detector.type);
          entry.count++;
          if (entry.examples.length < 3) {
            entry.examples.push({ line: i + 1, snippet: t.slice(0, 80) });
          }
          behaviorCounts[detector.type]++;
        }
      }
    }

    if (fileBehaviorMap.size > 0) {
      const behaviors = [...fileBehaviorMap.entries()].map(([type, data]) => ({
        type,
        label: data.label,
        count: data.count,
        examples: data.examples
      }));
      resultFiles.push({
        path: file.path,
        totalBehaviors: behaviors.reduce((sum, b) => sum + b.count, 0),
        behaviors
      });
    }
  }

  const notableFiles = [...resultFiles]
    .sort((a, b) => b.totalBehaviors - a.totalBehaviors)
    .slice(0, 10)
    .map((f) => ({
      path: f.path,
      totalBehaviors: f.totalBehaviors,
      topTypes: f.behaviors
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((b) => b.type)
    }));

  const areas = Object.fromEntries(
    Object.entries(AREA_DEFS).map(([areaKey, def]) => {
      const total = def.types.reduce((sum, t) => sum + (behaviorCounts[t] || 0), 0);
      return [areaKey, { label: def.label, total, types: def.types.filter((t) => (behaviorCounts[t] || 0) > 0) }];
    })
  );

  return {
    repo: { id: row.id, name: row.name },
    summary: {
      totalFilesScanned: jsFiles.length,
      totalFilesWithBehaviors: resultFiles.length,
      totalBehaviors: Object.values(behaviorCounts).reduce((a, b) => a + b, 0),
      behaviorCounts
    },
    areas,
    files: resultFiles,
    notableFiles
  };
}
