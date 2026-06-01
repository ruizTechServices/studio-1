import fs from "node:fs";
import path from "node:path";
import { db } from "../db.js";

const JS_TS_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx", ".mjs", ".cjs"]);
const MAX_ALGORITHM_FILE_SIZE = 512 * 1024;

const DETECTORS = [
  {
    type: "sorting",
    label: "Sorting",
    category: "search",
    test: (t) => /\.sort\s*\(|\.toSorted\s*\(/.test(t)
  },
  {
    type: "searching",
    label: "Searching",
    category: "search",
    test: (t) => /\.find\s*\(|\.findIndex\s*\(|\.findLast\s*\(|\.findLastIndex\s*\(|\.indexOf\s*\(|\.lastIndexOf\s*\(|\.includes\s*\(/.test(t)
  },
  {
    type: "filtering",
    label: "Filtering",
    category: "transform",
    test: (t) => /\.filter\s*\(/.test(t)
  },
  {
    type: "mapping",
    label: "Mapping / Transform",
    category: "transform",
    test: (t) => /\.map\s*\(|\.flatMap\s*\(/.test(t)
  },
  {
    type: "reduction",
    label: "Reduction / Accumulation",
    category: "transform",
    test: (t) => /\.reduce\s*\(|\.reduceRight\s*\(/.test(t)
  },
  {
    type: "grouping",
    label: "Grouping / Aggregation",
    category: "aggregate",
    test: (t) => /\bgroupBy\s*\(|Object\.groupBy\s*\(|\bnew\s+Map\s*\(|\bnew\s+Set\s*\(/.test(t)
  },
  {
    type: "counting",
    label: "Counting / Scoring",
    category: "aggregate",
    test: (t) => /\bcount\s*\+\+|\+\+\s*count|\bcount\s*\+=|\btotal\s*\+=|\bscore\s*\+=|\bsum\s*\+=|\.length\s*[><=!]+/.test(t)
  },
  {
    type: "validation",
    label: "Validation",
    category: "validation",
    test: (t) => /\bassert\s*\(|\.safeParse\s*\(|\bisValid\w*\s*\(|\bvalidate\w*\s*\(|\bz\.(string|object|number|boolean|array|enum|union|literal)\s*\(/.test(t)
  },
  {
    type: "parsing",
    label: "Parsing / Extraction",
    category: "validation",
    test: (t) => /JSON\.parse\s*\(|\.split\s*\(|\.match\s*\(|\.matchAll\s*\(|\.exec\s*\(|\bparseInt\s*\(|\bparseFloat\s*\(|\bnew\s+RegExp\s*\(/.test(t)
  },
  {
    type: "matching",
    label: "Matching / Resolution",
    category: "validation",
    test: (t) => /\bswitch\s*\(|\bcase\s+["'`\d\w]|\.test\s*\(/.test(t)
  },
  {
    type: "errorHandling",
    label: "Error Handling",
    category: "safety",
    test: (t) => /\btry\s*\{|\.catch\s*\(|\bthrow\s+new\s|\bthrow\s+\w/.test(t)
  },
  {
    type: "safetyGuard",
    label: "Safety Guard",
    category: "safety",
    test: (t) => /\bsanitize\w*\s*\(|\bescape\w*\s*\(|\bassert\w*Path\s*\(|\.normalize\s*\(|\.includes\s*\(\s*['"`]\.\.['"`]/.test(t)
  },
  {
    type: "fileProcessing",
    label: "File Processing",
    category: "io",
    test: (t) => /\bfs\.(readFile|writeFile|readdir|stat|access|mkdir|rm|unlink|appendFile|copyFile)\b|\bpath\.(join|resolve|extname|basename|dirname|normalize|relative)\s*\(/.test(t)
  },
  {
    type: "graphBuild",
    label: "Graph / Dependency Building",
    category: "io",
    test: (t) => /\b(adjacency|topological|breadthFirst|depthFirst|visited|\.edges\b|\bedges\.|\bnodes\.|\.nodes\b|\bdfs\s*\(|\bbfs\s*\()|\bMap\s*<\s*\w+\s*,\s*Set\s*<|\{\s*from\s*:[^}]*to\s*:/.test(t)
  },
  {
    type: "workflow",
    label: "State / Update Workflow",
    category: "control",
    test: (t) => /\bdb\.prepare\s*\(|\.run\s*\(|\.exec\s*\(|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|BEGIN\s+TRANSACTION|\bsetState\s*\(|\bdispatch\s*\(/.test(t)
  }
];

const CATEGORY_DEFS = {
  search:     { label: "Search & Sort",         types: [] },
  transform:  { label: "Transform Pipelines",   types: [] },
  aggregate:  { label: "Aggregation",           types: [] },
  validation: { label: "Validation & Parsing",  types: [] },
  control:    { label: "Control & Workflow",    types: [] },
  safety:     { label: "Safety",                types: [] },
  io:         { label: "File / IO & Graph",     types: [] }
};

for (const d of DETECTORS) {
  CATEGORY_DEFS[d.category]?.types.push(d.type);
}

// Recursion is a separate cross-line signal that is grouped under "control".
const RECURSION_TYPE = "recursion";
const RECURSION_LABEL = "Recursion (candidate)";
CATEGORY_DEFS.control.types.push(RECURSION_TYPE);

const FUNCTION_DECL_PATTERNS = [
  /\bfunction\s+([a-zA-Z_$][\w$]*)\s*\(/,
  /\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s+)?function\b/,
  /\b(?:const|let|var)\s+([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/
];

const COMMON_NAMES = new Set([
  "constructor", "if", "else", "for", "while", "do", "switch", "case",
  "return", "break", "continue", "throw", "try", "catch", "finally",
  "function", "class", "new", "delete", "typeof", "void", "in", "of",
  "yield", "await", "async", "static", "this", "super", "import",
  "export", "default", "from", "as", "true", "false", "null", "undefined"
]);

function findFunctionNames(lines) {
  const names = new Map();
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue;
    for (const pattern of FUNCTION_DECL_PATTERNS) {
      const match = pattern.exec(t);
      if (match && match[1] && !COMMON_NAMES.has(match[1])) {
        if (!names.has(match[1])) {
          names.set(match[1], i + 1);
        }
      }
    }
  }
  return names;
}

function detectRecursionCandidates(lines, functionNames) {
  const candidates = [];
  for (const [name, declLine] of functionNames) {
    const callPattern = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\(`);
    let callCount = 0;
    const examples = [];
    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      if (lineNumber === declLine) continue;
      const t = lines[i].trim();
      if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue;
      if (callPattern.test(t)) {
        callCount++;
        if (examples.length < 3) {
          examples.push({ line: lineNumber, snippet: t.slice(0, 80) });
        }
      }
    }
    if (callCount > 0) {
      candidates.push({ name, declLine, callCount, examples });
    }
  }
  return candidates;
}

export function algorithmMap(row) {
  const files = db
    .prepare("SELECT path, extension, size_bytes AS sizeBytes FROM repo_files WHERE repo_id = ? ORDER BY path")
    .all(row.id);

  const jsFiles = files.filter((f) => JS_TS_EXTENSIONS.has(f.extension));

  const algorithmCounts = Object.fromEntries(DETECTORS.map((d) => [d.type, 0]));
  algorithmCounts[RECURSION_TYPE] = 0;

  const resultFiles = [];

  for (const file of jsFiles) {
    if (file.sizeBytes > MAX_ALGORITHM_FILE_SIZE) continue;

    const filePath = path.join(row.root_path, file.path);
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);
    const fileAlgorithmMap = new Map();

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const t = raw.trim();
      if (!t || t.startsWith("//") || t.startsWith("*") || t.startsWith("/*")) continue;

      for (const detector of DETECTORS) {
        if (detector.test(t)) {
          if (!fileAlgorithmMap.has(detector.type)) {
            fileAlgorithmMap.set(detector.type, { label: detector.label, count: 0, examples: [] });
          }
          const entry = fileAlgorithmMap.get(detector.type);
          entry.count++;
          if (entry.examples.length < 3) {
            entry.examples.push({ line: i + 1, snippet: t.slice(0, 80) });
          }
          algorithmCounts[detector.type]++;
        }
      }
    }

    const functionNames = findFunctionNames(lines);
    const recursionCandidates = detectRecursionCandidates(lines, functionNames);

    if (recursionCandidates.length > 0) {
      const totalCalls = recursionCandidates.reduce((sum, c) => sum + c.callCount, 0);
      const examples = [];
      for (const c of recursionCandidates) {
        for (const ex of c.examples) {
          if (examples.length < 3) {
            examples.push({ line: ex.line, snippet: ex.snippet });
          }
        }
      }
      fileAlgorithmMap.set(RECURSION_TYPE, {
        label: RECURSION_LABEL,
        count: totalCalls,
        examples
      });
      algorithmCounts[RECURSION_TYPE] += totalCalls;
    }

    if (fileAlgorithmMap.size > 0) {
      const signals = [...fileAlgorithmMap.entries()].map(([type, data]) => ({
        type,
        label: data.label,
        count: data.count,
        examples: data.examples
      }));
      resultFiles.push({
        path: file.path,
        totalSignals: signals.reduce((sum, s) => sum + s.count, 0),
        signals
      });
    }
  }

  const notableFiles = [...resultFiles]
    .sort((a, b) => b.totalSignals - a.totalSignals)
    .slice(0, 10)
    .map((f) => ({
      path: f.path,
      totalSignals: f.totalSignals,
      topTypes: f.signals
        .slice()
        .sort((a, b) => b.count - a.count)
        .slice(0, 3)
        .map((s) => s.type)
    }));

  const categories = Object.fromEntries(
    Object.entries(CATEGORY_DEFS).map(([categoryKey, def]) => {
      const total = def.types.reduce((sum, t) => sum + (algorithmCounts[t] || 0), 0);
      return [categoryKey, { label: def.label, total, types: def.types.filter((t) => (algorithmCounts[t] || 0) > 0) }];
    })
  );

  return {
    repo: { id: row.id, name: row.name },
    summary: {
      totalFilesScanned: jsFiles.length,
      totalFilesWithSignals: resultFiles.length,
      totalSignals: Object.values(algorithmCounts).reduce((a, b) => a + b, 0),
      signalCounts: algorithmCounts
    },
    categories,
    files: resultFiles,
    notableFiles
  };
}
