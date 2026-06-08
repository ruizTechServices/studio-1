import { db } from "../db.js";
import { projectMap } from "../repos/projectMap.js";
import { projectSummary } from "../repos/projectSummary.js";
import { symbolMap } from "../repos/symbolMap.js";
import { dependencyMap } from "../repos/dependencyMap.js";
import { behaviorMap } from "../repos/behaviorMap.js";
import { algorithmMap } from "../repos/algorithmMap.js";

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
  for (const item of items || []) {
    const value = item?.[key];
    if (!value) {
      continue;
    }
    map.set(normalizePath(value), item);
  }
  return map;
}

function symbolDetails(symbolEntry) {
  const symbols = Array.isArray(symbolEntry?.symbols) ? symbolEntry.symbols : [];
  const meaningful = symbols.filter((symbol) => ["function", "class", "method", "routeHandler", "schema", "export", "constant"].includes(symbol.type));
  return {
    count: symbols.length,
    meaningfulCount: meaningful.length,
    exportedLikeCount: symbols.filter((symbol) => ["export", "function", "routeHandler"].includes(symbol.type)).length
  };
}

function dependencyDetails(dependencyEntry) {
  const importedBy = Array.isArray(dependencyEntry?.importedBy) ? dependencyEntry.importedBy : [];
  return {
    importedByCount: importedBy.length,
    isHub: importedBy.length >= 2
  };
}

function behaviorDetails(behaviorEntry) {
  const behaviors = Array.isArray(behaviorEntry?.behaviors) ? behaviorEntry.behaviors : [];
  const total = behaviors.reduce((sum, item) => sum + (item?.count || 0), 0);
  return {
    count: total,
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

function riskFor(file, details, repoCapabilities) {
  const path = normalizePath(file.path).toLowerCase();
  const name = String(file.name || "").toLowerCase();
  const text = `${path} ${name} ${repoCapabilities}`.toLowerCase();

  if (/(^|[^\w])(secret|token|password|credential|private|oauth|jwt|session)([^\w]|$)/.test(text)) {
    return "high";
  }

  if (HIGH_RISK_HINT.test(text)) {
    if (details.type === "api_handler" || details.type === "setup_pattern" || details.type === "implementation_pattern") {
      return "medium";
    }
    if (details.type === "component" && MEDIUM_RISK_HINT.test(text)) {
      return "medium";
    }
  }

  if (details.type === "api_handler") {
    return HIGH_RISK_HINT.test(text) ? "high" : "medium";
  }

  if (details.type === "setup_pattern") {
    return HIGH_RISK_HINT.test(text) ? "high" : "medium";
  }

  if (details.type === "implementation_pattern") {
    return MEDIUM_RISK_HINT.test(text) ? "medium" : "low";
  }

  if (details.type === "component" || details.type === "utility" || details.type === "function" || details.type === "config_pattern" || details.type === "algorithm_candidate") {
    return MEDIUM_RISK_HINT.test(text) && /auth|payment|database|db|ai|agent/.test(text) ? "medium" : "low";
  }

  return "low";
}

function scoreAsset({ file, assetType, symbol, dependency, behavior, algorithm }) {
  let confidence = 0.55;

  if (assetType.strong) {
    confidence += 0.1;
  }
  if (symbol.meaningfulCount > 0) {
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
  if (symbol.meaningfulCount > 0) {
    strongSignals.push(`${symbol.meaningfulCount} exported symbol${symbol.meaningfulCount === 1 ? "" : "s"}`);
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

  if (symbol.meaningfulCount > 0) {
    bits.push(`${symbol.meaningfulCount} exported symbol${symbol.meaningfulCount === 1 ? "" : "s"} detected`);
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

  const repoCapabilities = Array.isArray(projectSummaryData.summary?.detectedCapabilities)
    ? projectSummaryData.summary.detectedCapabilities.join(" ").toLowerCase()
    : "";

  const symbolLookup = buildLookup(symbolMapData.files);
  const dependencyLookup = buildLookup(dependencyMapData.files);
  const behaviorLookup = buildLookup(behaviorMapData.files);
  const algorithmLookup = buildLookup(algorithmMapData.files);

  const assets = [];

  for (const file of repoFiles) {
    const pathKey = normalizePath(file.path);
    const category = String(file.category || "").toLowerCase();

    if (category === "tests" || category === "documentation" || hasHardExclude(pathKey)) {
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

    const risk = riskFor(file, { type }, repoCapabilities);
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
