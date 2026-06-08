import { db } from "../db.js";
import { allowedExtensions } from "../config.js";
import { projectMap } from "../repos/projectMap.js";
import { projectSummary } from "../repos/projectSummary.js";
import { symbolMap } from "../repos/symbolMap.js";
import { dependencyMap } from "../repos/dependencyMap.js";
import { behaviorMap } from "../repos/behaviorMap.js";
import { algorithmMap } from "../repos/algorithmMap.js";

const MAX_CANDIDATE_FILE_SIZE_BYTES = 512 * 1024;

const HARD_EXCLUDE_PATTERNS = [
  /(^|\/)\.git(\/|$)/i,
  /(^|\/)node_modules(\/|$)/i,
  /(^|\/)dist(\/|$)/i,
  /(^|\/)build(\/|$)/i,
  /(^|\/)coverage(\/|$)/i,
  /(^|\/)\.next(\/|$)/i,
  /(^|\/)\.nuxt(\/|$)/i,
  /(^|\/)\.svelte-kit(\/|$)/i,
  /(^|\/)\.turbo(\/|$)/i,
  /(^|\/)\.cache(\/|$)/i,
  /(^|\/)\.parcel-cache(\/|$)/i,
  /(^|\/)out(\/|$)/i,
  /(^|\/)target(\/|$)/i,
  /(^|\/)vendor(\/|$)/i,
  /(^|\/)\.venv(\/|$)/i,
  /(^|\/)venv(\/|$)/i,
  /(^|\/)__pycache__(\/|$)/i,
  /(^|\/)\.idea(\/|$)/i,
  /(^|\/)\.vscode(\/|$)/i,
  /(^|\/)tests?(\/|$)/i,
  /(^|\/)__tests__(\/|$)/i,
  /\.test\.[^.\/]+$/i,
  /\.spec\.[^.\/]+$/i,
  /\.min\.[^.\/]+$/i,
  /\.map$/i,
  /(^|\/)(package-lock\.json|pnpm-lock\.yaml|yarn\.lock|bun\.lockb)$/i,
  /(^|\/)docs?(\/|$)/i,
  /(^|\/)documentation(\/|$)/i,
  /(^|\/)readme(\.[^.\/]+)?$/i
];

const STRONG_CATEGORIES = new Set([
  "components",
  "functions",
  "apiEndpoints",
  "configFiles",
  "databaseFiles"
]);

const RISK_RANK = {
  low: 0,
  medium: 1,
  high: 2
};

const FUNCTION_UTILITY_HINT = /(helper|helpers|util|utils|shared|common|tool|tools|lib|library|factory|adapter|service|services|hook|hooks|store|stores|selector|selectors)/i;
const HIGH_RISK_HINT = /(^|[^\w])(auth|payment|checkout|stripe|secret|token|password|credential|session|jwt|oauth|key|env|database|migrat|schema|seed|prisma|sqlite|postgres|mysql|mongo|openai|agent)([^\w]|$)/i;
const MEDIUM_RISK_HINT = /(^|[^\w])(api|route|handler|db|database|auth|payment|checkout|stripe|ai|agent)([^\w]|$)/i;

function safeRead(fn, fallback) {
  try {
    const value = fn();
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function normalizePath(value) {
  return String(value || "").replace(/\\/g, "/");
}

function hasHardExclude(pathValue) {
  const path = normalizePath(pathValue);
  return HARD_EXCLUDE_PATTERNS.some((pattern) => pattern.test(path));
}

function buildLookup(items = [], key = "path") {
  const map = new Map();
  if (!Array.isArray(items)) {
    return map;
  }

  for (const item of items) {
    const value = item?.[key];
    if (!value) {
      continue;
    }
    map.set(normalizePath(value), item);
  }
  return map;
}

function buildDependencyLookup(dependencyMapData) {
  const map = buildLookup(dependencyMapData?.files);
  const hubs = Array.isArray(dependencyMapData?.mostImportedInternal)
    ? dependencyMapData.mostImportedInternal
    : [];

  for (const hub of hubs) {
    const pathKey = normalizePath(hub?.path);
    if (!pathKey) {
      continue;
    }

    const existing = map.get(pathKey) || { path: pathKey };
    const importedByCount = Number(hub.importedByCount || 0);
    existing.importedByCount = Math.max(Number(existing.importedByCount || 0), importedByCount);
    map.set(pathKey, existing);
  }

  return map;
}

function symbolDetails(symbolEntry) {
  const symbols = Array.isArray(symbolEntry?.symbols) ? symbolEntry.symbols : [];
  return {
    count: symbols.length,
    exportedLikeCount: symbols.filter((symbol) => ["export", "function", "routeHandler"].includes(symbol.type)).length
  };
}

function dependencyDetails(dependencyEntry) {
  const importedBy = Array.isArray(dependencyEntry?.importedBy) ? dependencyEntry.importedBy : [];
  const importedByCount = Math.max(importedBy.length, Number(dependencyEntry?.importedByCount || 0));
  return {
    importedByCount,
    isHub: importedByCount >= 2
  };
}

function behaviorDetails(behaviorEntry) {
  const behaviors = Array.isArray(behaviorEntry?.behaviors) ? behaviorEntry.behaviors : [];
  const total = behaviors.reduce((sum, item) => sum + (item?.count || 0), 0);
  const mutationCount = behaviors
    .filter((item) => ["crudCreate", "crudUpdate", "crudDelete"].includes(item?.type))
    .reduce((sum, item) => sum + (item?.count || 0), 0);
  return {
    count: total,
    mutationCount,
    hasMutation: mutationCount > 0,
    isSignal: total > 0
  };
}

function algorithmDetails(algorithmEntry) {
  const signals = Array.isArray(algorithmEntry?.signals) ? algorithmEntry.signals : [];
  const total = signals.reduce((sum, item) => sum + (item?.count || 0), 0);
  return {
    count: total,
    isSignal: total > 0
  };
}

function isCandidateFile(file) {
  const path = normalizePath(file?.path);
  const extension = String(file?.extension || "").toLowerCase();
  const sizeBytes = Number(file?.sizeBytes || 0);

  if (!path || hasHardExclude(path)) {
    return false;
  }

  if (extension && !allowedExtensions.has(extension)) {
    return false;
  }

  return sizeBytes <= MAX_CANDIDATE_FILE_SIZE_BYTES;
}

function assetTypeFor(file, details) {
  const category = file.category;
  const path = normalizePath(file.path);
  const name = String(file.name || path.split("/").pop() || "").toLowerCase();

  if (details.algorithm.isSignal) {
    return {
      type: "algorithm_candidate",
      family: "algorithms",
      strong: true
    };
  }

  if (details.behavior.isSignal) {
    return {
      type: "implementation_pattern",
      family: "patterns",
      strong: true
    };
  }

  if (category === "components") {
    return {
      type: "component",
      family: "components",
      strong: true
    };
  }

  if (category === "apiEndpoints") {
    return {
      type: "api_handler",
      family: "apiHandlers",
      strong: true
    };
  }

  if (category === "configFiles") {
    return {
      type: "config_pattern",
      family: "configs",
      strong: true
    };
  }

  if (category === "databaseFiles") {
    return {
      type: "setup_pattern",
      family: "patterns",
      strong: true
    };
  }

  if (category === "functions") {
    const utilityLike = FUNCTION_UTILITY_HINT.test(path) || FUNCTION_UTILITY_HINT.test(name);
    return {
      type: utilityLike ? "utility" : "function",
      family: utilityLike ? "utilities" : "functions",
      strong: true
    };
  }

  if (category === "pagesRoutes") {
    return {
      type: "implementation_pattern",
      family: "patterns",
      strong: false
    };
  }

  if (category === "other") {
    if (FUNCTION_UTILITY_HINT.test(path) || FUNCTION_UTILITY_HINT.test(name)) {
      return {
        type: "utility",
        family: "utilities",
        strong: false
      };
    }
    return null;
  }

  return null;
}

function riskFor(file, details) {
  const path = normalizePath(file.path).toLowerCase();
  const name = String(file.name || "").toLowerCase();
  const text = `${path} ${name}`.toLowerCase();

  if (/(^|[^\w])(secret|token|password|credential|private|oauth|jwt|session)([^\w]|$)/.test(text)) {
    return "high";
  }

  if (details.behavior?.hasMutation) {
    return ["api_handler", "setup_pattern", "implementation_pattern"].includes(details.type)
      ? "high"
      : "medium";
  }

  if (details.type === "api_handler") {
    return "medium";
  }

  if (details.type === "setup_pattern") {
    return "medium";
  }

  if (MEDIUM_RISK_HINT.test(text) || HIGH_RISK_HINT.test(text)) {
    return "medium";
  }

  return "low";
}

function scoreAsset({ file, assetType, symbol, dependency, behavior, algorithm }) {
  let confidence = 0.55;

  if (assetType.strong) {
    confidence += 0.1;
  }
  if (symbol.exportedLikeCount > 0) {
    confidence += 0.1;
  }
  if (dependency.isHub) {
    confidence += 0.1;
  }
  if (behavior.isSignal || algorithm.isSignal) {
    confidence += 0.1;
  }

  confidence = Math.min(0.95, confidence);

  const strongSignals = [];
  if (assetType.strong) {
    strongSignals.push(`strong ${assetType.type.replace(/_/g, " ")} category`);
  }
  if (symbol.exportedLikeCount > 0) {
    strongSignals.push(`${symbol.exportedLikeCount} exported/function signal${symbol.exportedLikeCount === 1 ? "" : "s"}`);
  }
  if (dependency.isHub) {
    strongSignals.push(`${dependency.importedByCount} internal dependents`);
  }
  if (algorithm.isSignal) {
    strongSignals.push(`${algorithm.count} algorithm signal${algorithm.count === 1 ? "" : "s"}`);
  }
  if (behavior.isSignal) {
    strongSignals.push(`${behavior.count} behavior signal${behavior.count === 1 ? "" : "s"}`);
  }

  return {
    confidence,
    signals: strongSignals
  };
}

function buildReuseReason(assetType, symbol, dependency, behavior, algorithm, risk) {
  const bits = [];

  switch (assetType.type) {
    case "component":
      bits.push("Reusable component with a clear UI surface");
      break;
    case "function":
      bits.push("Reusable function extracted from a general-purpose module");
      break;
    case "utility":
      bits.push("Utility file with reusable helper logic");
      break;
    case "api_handler":
      bits.push("API handler that can be referenced as a route pattern");
      break;
    case "config_pattern":
      bits.push("Configuration pattern that can be reused across setups");
      break;
    case "setup_pattern":
      bits.push("Setup or data-layer pattern that informs future scaffolding");
      break;
    case "algorithm_candidate":
      bits.push("Algorithmic logic with reusable implementation structure");
      break;
    case "implementation_pattern":
      bits.push("Implementation pattern with reusable flow or control structure");
      break;
    default:
      bits.push("Deterministic reusable candidate");
      break;
  }

  if (symbol.exportedLikeCount > 0) {
    bits.push(`${symbol.exportedLikeCount} exported/function signal${symbol.exportedLikeCount === 1 ? "" : "s"} detected`);
  }
  if (dependency.isHub) {
    bits.push(`referenced by ${dependency.importedByCount} internal file${dependency.importedByCount === 1 ? "" : "s"}`);
  }
  if (behavior.isSignal) {
    bits.push(`behavior map signal${behavior.count === 1 ? "" : "s"} present`);
  }
  if (algorithm.isSignal) {
    bits.push(`algorithm map signal${algorithm.count === 1 ? "" : "s"} present`);
  }
  bits.push(`risk ${risk}`);

  return bits.join("; ");
}

function createAssetId(type, filePath) {
  return `${type}-${normalizePath(filePath)}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function compareAssets(a, b) {
  if (b.confidence !== a.confidence) {
    return b.confidence - a.confidence;
  }
  if (RISK_RANK[a.risk] !== RISK_RANK[b.risk]) {
    return RISK_RANK[a.risk] - RISK_RANK[b.risk];
  }
  return a.path.localeCompare(b.path);
}

export function reusableAssets(row) {
  const repo = {
    id: row.id,
    name: row.name,
    sourceType: row.source_type,
    totalFiles: row.total_files,
    createdAt: row.created_at
  };

  const repoFiles = db
    .prepare(
      "SELECT path, name, extension, language, size_bytes AS sizeBytes, category FROM repo_files WHERE repo_id = ? ORDER BY path"
    )
    .all(row.id);

  const projectMapData = safeRead(() => projectMap(row), { summary: {}, sections: {} });
  const projectSummaryData = safeRead(() => projectSummary(row), { summary: { detectedCapabilities: [] } });
  const symbolMapData = safeRead(() => symbolMap(row), { files: [], summary: { counts: {} } });
  const dependencyMapData = safeRead(() => dependencyMap(row), { files: [], summary: {}, mostImportedInternal: [] });
  const behaviorMapData = safeRead(() => behaviorMap(row), { files: [], summary: {}, notableFiles: [] });
  const algorithmMapData = safeRead(() => algorithmMap(row), { files: [], summary: {}, notableFiles: [] });

  const symbolLookup = buildLookup(symbolMapData.files);
  const dependencyLookup = buildDependencyLookup(dependencyMapData);
  const behaviorLookup = buildLookup(behaviorMapData.files);
  const algorithmLookup = buildLookup(algorithmMapData.files);

  const assets = [];

  for (const file of repoFiles) {
    const pathKey = normalizePath(file.path);
    const category = String(file.category || "").toLowerCase();

    if (category === "tests" || category === "documentation" || !isCandidateFile(file)) {
      continue;
    }

    const assetType = assetTypeFor(file, {
      algorithm: algorithmDetails(algorithmLookup.get(pathKey)),
      behavior: behaviorDetails(behaviorLookup.get(pathKey))
    });

    const symbol = symbolDetails(symbolLookup.get(pathKey));
    const dependency = dependencyDetails(dependencyLookup.get(pathKey));
    const behavior = behaviorDetails(behaviorLookup.get(pathKey));
    const algorithm = algorithmDetails(algorithmLookup.get(pathKey));

    const signalStrength = scoreAsset({
      file,
      assetType: assetType || { type: null, strong: false },
      symbol,
      dependency,
      behavior,
      algorithm
    });

    const type = assetType?.type || null;
    if (!type) {
      continue;
    }

    const confidence = signalStrength.confidence;
    if (confidence < 0.65) {
      continue;
    }

    const risk = riskFor(file, { type, behavior });
    const signals = signalStrength.signals;
    const reuseReason = buildReuseReason({ type }, symbol, dependency, behavior, algorithm, risk);

    assets.push({
      id: createAssetId(type, file.path),
      name: file.name,
      type,
      category: file.category,
      path: file.path,
      language: file.language,
      confidence: Number(confidence.toFixed(2)),
      reuseReason,
      signals,
      risk,
      source: {
        category: file.category,
        symbols: symbol.count,
        importedBy: dependency.importedByCount,
        behaviors: behavior.count,
        algorithms: algorithm.count,
        projectCategoryCount: projectMapData.summary?.categoryCounts?.[file.category] || 0,
        projectType: projectSummaryData.summary?.projectType || null
      }
    });
  }

  assets.sort(compareAssets);

  const summary = {
    totalAssets: assets.length,
    components: assets.filter((asset) => asset.type === "component").length,
    functions: assets.filter((asset) => asset.type === "function").length,
    apiHandlers: assets.filter((asset) => asset.type === "api_handler").length,
    utilities: assets.filter((asset) => asset.type === "utility").length,
    configs: assets.filter((asset) => asset.type === "config_pattern").length,
    algorithms: assets.filter((asset) => asset.type === "algorithm_candidate").length,
    patterns: assets.filter((asset) => asset.type === "implementation_pattern" || asset.type === "setup_pattern").length
  };

  return {
    repo,
    summary,
    assets
  };
}
